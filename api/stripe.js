import Stripe from "stripe";
import dotenv from "dotenv";
import { sendEmailInternal } from "./email.js";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PLANS = {
	mensual: {
		name: "Plan Mensual",
		amount: 600, // $6.00 in cents
		currency: "usd",
		interval: "month",
	},
	oro: {
		name: "Plan ORO",
		amount: 800, // $8.00 in cents
		currency: "usd",
		interval: "month",
	},
	unico: {
		name: "Plan Único",
		amount: 5000, // $50.00 in cents
		currency: "usd",
		mode: "payment", // One-time payment
	},
};

export const createCheckoutSession = async (req, res) => {
	try {
		const { planId } = req.body;
		const plan = PLANS[planId];

		if (!plan) {
			return res.status(400).json({ error: "Plan inválido" });
		}

		const sessionConfig = {
			payment_method_types: ["card"],
			line_items: [
				{
					price_data: {
						currency: plan.currency,
						product_data: {
							name: plan.name,
						},
						unit_amount: plan.amount,
						...(plan.interval && {
							recurring: { interval: plan.interval },
						}),
					},
					quantity: 1,
				},
			],
			mode: plan.mode || "subscription",
			success_url: `${req.headers.origin}/?status=success&session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${req.headers.origin}/?status=cancel`,
		};

		const session = await stripe.checkout.sessions.create(sessionConfig);

		res.json({ id: session.id });
	} catch (error) {
		console.error("Error creando sesión de Stripe:", error);
		res.status(500).json({ error: error.message });
	}
};

export const confirmStripePayment = async (req, res) => {
	try {
		const { session_id } = req.body;

		if (!session_id) {
			return res.status(400).json({ error: "Session ID es requerido" });
		}

		const session = await stripe.checkout.sessions.retrieve(session_id);

		if (session.payment_status === "paid") {
			const email =
				session.customer_details?.email || session.customer_email;
			const name = session.customer_details?.name || "Estudiante";

			// Determinar el nombre del plan basado en el monto (simplificado)
			// En un caso real, expandir line_items
			let planName = "Plan Easy English TV";
			if (session.amount_total === 600) planName = "Plan Mensual";
			if (session.amount_total === 800) planName = "Plan ORO";
			if (session.amount_total === 5000) planName = "Plan Único";

			// Enviar correo
			await sendEmailInternal({ email, name, planName });

			res.json({ status: "confirmed", email });
		} else {
			res.status(400).json({ error: "El pago no ha sido completado" });
		}
	} catch (error) {
		console.error("Error confirmando pago Stripe:", error);
		res.status(500).json({ error: error.message });
	}
};
