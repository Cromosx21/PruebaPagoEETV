import { MercadoPagoConfig, Preference } from "mercadopago";
import dotenv from "dotenv";

dotenv.config();

const client = new MercadoPagoConfig({
	accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

export default async function handler(req, res) {
	if (req.method !== "POST") {
		res.setHeader("Allow", ["POST"]);
		return res.status(405).end(`Method ${req.method} Not Allowed`);
	}

	try {
		const { title, price } = req.body;
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
						currency_id: "PEN",
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

		res.status(200).json({ id: result.id });
	} catch (error) {
		console.error("Error creating Mercado Pago preference:", error);
		res.status(500).json({ error: error.message });
	}
}
