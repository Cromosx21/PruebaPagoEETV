export default async function handler(req, res) {
	if (req.method !== "POST") {
		res.status(405).json({ error: "Method not allowed" });
		return;
	}
	const apiBase = process.env.IZIPAY_API_BASE || "https://api.micuentaweb.pe";
	const user = process.env.IZIPAY_REST_USER;
	const pass = process.env.IZIPAY_REST_PASSWORD;
	if (!user || !pass) {
		res.status(500).json({
			error: "Izipay REST not configured: missing user/password",
		});
		return;
	}
	const body =
		typeof req.body === "string"
			? JSON.parse(req.body || "{}")
			: req.body || {};
	const planId = body.planId || "unico";
	const email = body.email || "cliente@example.com";
	const network = body.network || "YAPE";
	const plans = {
		unico: { name: "Plan Único", amount: 185.0, currency: "PEN" },
	};
	const plan = plans[planId] || plans.unico;
	const amountCents = Math.round(parseFloat(plan.amount) * 100);
	const orderId = `EETV-QR-${Date.now()}`;
	// Intento genérico de pago QR/wallet en Izipay.
	// La estructura exacta depende del contrato habilitado (Yape/Plin).
	// Devolvemos el contenido crudo para inspección en el front si el PSP no devuelve un campo estándar.
	const payload = {
		amount: amountCents,
		currency: plan.currency,
		orderId,
		customer: { email },
		paymentMethodType: "WALLET",
		// Campos orientativos; pueden variar según la configuración de Izipay
		paymentMethodData: {
			type: "QR_CODE",
			network,
		},
	};
	const auth = Buffer.from(`${user}:${pass}`).toString("base64");
	try {
		const resp = await fetch(
			`${apiBase}/api-payment/V4/Charge/CreatePayment`,
			{
				method: "POST",
				headers: {
					Authorization: `Basic ${auth}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			}
		);
		const data = await resp.json().catch(() => null);
		if (!resp.ok || !data) {
			res.status(500).json({
				error: "Failed to create QR payment",
				detail: {
					httpStatus: resp.status,
					status: data?.status,
					errorCode: data?.errorCode,
					message:
						data?.answer?.errorMessage ||
						data?.message ||
						"Unknown error",
				},
			});
			return;
		}
		// Intentar extraer posibles campos de QR
		const answer = data.answer || {};
		const qrBase64 =
			answer.qrCodeBase64 ||
			answer.qrCode ||
			answer.wallet?.qrCodeBase64 ||
			null;
		const qrUrl =
			answer.qrCodeUrl ||
			answer.redirectionUrl ||
			answer.paymentPageUrl ||
			null;
		res.status(200).json({
			status: data.status,
			orderId,
			qrBase64,
			qrUrl,
			raw: data,
		});
	} catch {
		res.status(500).json({ error: "Izipay REST error" });
	}
}
