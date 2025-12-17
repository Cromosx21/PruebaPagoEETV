export default async function handler(req, res) {
	if (req.method !== "POST") {
		res.status(405).json({ error: "Method not allowed" });
		return;
	}
	const base = process.env.IZIPAY_CHECKOUT_BASE_URL;
	const path = process.env.IZIPAY_CHECKOUT_PATH || "";
	const merchant = process.env.IZIPAY_MERCHANT_ID;
	if (!base || !merchant) {
		res.status(500).json({
			error: "Izipay not configured: missing base or merchant",
		});
		return;
	}
	if (!/^https?:\/\//i.test(base)) {
		res.status(500).json({ error: "Invalid Izipay base url" });
		return;
	}
	let urlObj;
	try {
		urlObj = new URL(path || "", base);
	} catch {
		res.status(500).json({
			error: "Failed to construct Izipay checkout url",
		});
		return;
	}
	const body =
		typeof req.body === "string"
			? JSON.parse(req.body || "{}")
			: req.body || {};
	const planId = body.planId;
	const plans = {
		mensual: { name: "Plan Mensual", amount: 9.99, currency: "PEN" },
		unico: { name: "Plan Único", amount: 49.0, currency: "PEN" },
	};
	const plan = plans[planId] || plans.mensual;
	const host = process.env.VERCEL_URL
		? `https://${process.env.VERCEL_URL}`
		: "http://localhost:5173";
	const params = new URLSearchParams({
		amount: String(plan.amount),
		currency: plan.currency,
		description: plan.name,
		merchant_id: merchant,
		methods: "yape,plin",
		success_url: `${host}/?payment=success`,
		cancel_url: `${host}/?payment=cancel`,
	});
	urlObj.search = params.toString();
	res.status(200).json({ url: urlObj.toString() });
}
