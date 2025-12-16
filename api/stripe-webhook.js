// Webhook de Stripe para validar pagos de Checkout
// - Verifica la firma del evento usando STRIPE_WEBHOOK_SECRET
// - Responde a checkout.session.completed (puedes actualizar tu base de datos aquí)
import Stripe from "stripe";
import getRawBody from "raw-body";

export default async function handler(req, res) {
	if (req.method !== "POST") {
		res.status(405).json({ error: "Method not allowed" });
		return;
	}
	const secret = process.env.STRIPE_SECRET_KEY;
	const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
	if (!secret || !webhookSecret) {
		res.status(500).json({ error: "Stripe configuration missing" });
		return;
	}
	const stripe = Stripe(secret);
	let event;
	try {
		const raw = await getRawBody(req);
		const sig = req.headers["stripe-signature"];
		event = stripe.webhooks.constructEvent(raw, sig, webhookSecret);
	} catch {
		res.status(400).json({ error: "Invalid signature" });
		return;
	}
	if (event.type === "checkout.session.completed") {
		// TODO: Persistir la compra del usuario (ej. marcando acceso al material)
		res.status(200).json({ received: true });
		return;
	}
	res.status(200).json({ received: true });
}
