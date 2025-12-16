// Función serverless en Vercel para crear una sesión de Stripe Checkout
// - Recibe { planId } en el cuerpo
// - Configura moneda PEN (Perú) y redirige a success/cancel
import Stripe from "stripe";

export default async function handler(req, res) {
	if (req.method !== "POST") {
		res.status(405).json({ error: "Method not allowed" });
		return;
	}
	const secret = process.env.STRIPE_SECRET_KEY;
	if (!secret) {
		res.status(500).json({ error: "Stripe secret not configured" });
		return;
	}
	const stripe = Stripe(secret);
	const body =
		typeof req.body === "string"
			? JSON.parse(req.body || "{}")
			: req.body || {};
	const planId = body.planId;
	const plans = {
		mensual: { name: "Plan Mensual", amount: 999, currency: "PEN" },
		unico: { name: "Plan Único", amount: 4900, currency: "PEN" },
	};
	const plan = plans[planId] || plans.mensual;
	const host = process.env.VERCEL_URL
		? `https://${process.env.VERCEL_URL}`
		: "http://localhost:5173";
	try {
		const session = await stripe.checkout.sessions.create({
			mode: "payment",
			payment_method_types: ["card"],
			line_items: [
				{
					price_data: {
						currency: plan.currency,
						unit_amount: plan.amount,
						product_data: { name: plan.name },
					},
					quantity: 1,
				},
			],
			success_url: `${host}/?payment=success`,
			cancel_url: `${host}/?payment=cancel`,
		});
		res.status(200).json({ id: session.id, url: session.url });
	} catch {
		res.status(500).json({ error: "Failed to create checkout session" });
	}
}
