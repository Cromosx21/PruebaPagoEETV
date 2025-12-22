import { MercadoPagoConfig, Preference } from "mercadopago";
import dotenv from "dotenv";

dotenv.config();

const client = new MercadoPagoConfig({
	accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

export const createPreference = async (req, res) => {
	try {
		const { title, price } = req.body;
		// Use provided values or fallback to defaults
		const itemTitle = title || "Producto";
		const itemPrice = Number(price) || 10;

		const preference = new Preference(client);

		const result = await preference.create({
			body: {
				items: [
					{
						title: itemTitle,
						quantity: 1,
						unit_price: itemPrice,
						currency_id: "PEN", // Default to PEN for simplicity or dynamic
					},
				],
				back_urls: {
					success: `${req.headers.origin}/?status=approved`,
					failure: `${req.headers.origin}/?status=failure`,
					pending: `${req.headers.origin}/?status=pending`,
				},
				auto_return: "approved",
			},
		});

		res.json({ id: result.id });
	} catch (error) {
		console.error("Error creating Mercado Pago preference:", error);
		res.status(500).json({ error: error.message });
	}
};
