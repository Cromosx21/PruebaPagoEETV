export default async function handler(req, res) {
	if (req.method !== "POST") {
		res.status(405).json({ error: "Method not allowed" });
		return;
	}
	const apiBase = process.env.IZIPAY_API_BASE || "https://api.micuentaweb.pe";
	const user = process.env.IZIPAY_REST_USER;
	const pass = process.env.IZIPAY_REST_PASSWORD;
	const publicKey = process.env.IZIPAY_PUBLIC_KEY;
	if (!user || !pass || !publicKey) {
		res.status(500).json({
			error: "Izipay REST not configured: missing user/password/publicKey",
		});
		return;
	}
	const body =
		typeof req.body === "string"
			? JSON.parse(req.body || "{}")
			: req.body || {};
	const planId = body.planId;
	const email = body.email || "cliente@example.com";
	const plans = {
		mensual: { name: "Plan Mensual", amount: 9.99, currency: "PEN" },
		unico: { name: "Plan Único", amount: 185.0, currency: "PEN" },
	};
	const plan = plans[planId] || plans.mensual;
	const amountCents = Math.round(parseFloat(plan.amount) * 100);
	const orderId = `EETV-${Date.now()}`;
	const payload = {
		amount: amountCents,
		currency: plan.currency,
		orderId,
		customer: { email },
		paymentMethodType: "CARD",
		transactionOptions: {
			cardOptions: {
				captureDelay: 0,
				manualValidation: "NO",
			},
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
		if (!resp.ok || !data || data.status !== "SUCCESS") {
			res.status(500).json({
				error: "Failed to create formToken",
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
		const formToken = data.answer?.formToken;
		if (!formToken) {
			res.status(500).json({
				error: "Missing formToken in Izipay response",
			});
			return;
		}
		res.status(200).json({ formToken, publicKey });
	} catch {
		res.status(500).json({ error: "Izipay REST error" });
	}
}
