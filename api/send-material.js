import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { MercadoPagoConfig, Payment } from "mercadopago";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicializar cliente de Mercado Pago
const mpClient = new MercadoPagoConfig({
	accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

export default async function handler(req, res) {
	if (req.method !== "POST") {
		res.setHeader("Allow", ["POST"]);
		return res.status(405).end(`Method ${req.method} Not Allowed`);
	}

	const { email, name, planName, paymentId, orderId, provider } = req.body;

	if (!email) {
		return res.status(400).json({ error: "Email es requerido" });
	}

	// Verificación de Seguridad del Pago
	try {
		if (provider === "mercadopago") {
			if (!paymentId) {
				return res
					.status(400)
					.json({ error: "Falta ID de pago de Mercado Pago" });
			}
			const payment = new Payment(mpClient);
			const payData = await payment.get({ id: paymentId });

			if (payData.status !== "approved") {
				return res
					.status(403)
					.json({ error: "El pago no está aprobado o es inválido." });
			}
		} else if (provider === "paypal") {
			if (!orderId) {
				return res
					.status(400)
					.json({ error: "Falta ID de orden de PayPal" });
			}
			// NOTA: Para verificar PayPal en backend se requiere PAYPAL_CLIENT_SECRET
			// Por ahora confiamos en la captura del cliente, pero se recomienda agregar la verificación de servidor.
			console.log(`Procesando pago PayPal: ${orderId}`);
		} else {
			// Si no hay proveedor, rechazamos la solicitud para evitar abusos
			return res.status(403).json({
				error: "Acceso denegado. Se requiere validación de pago.",
			});
		}
	} catch (error) {
		console.error("Error verificando pago:", error);
		return res
			.status(403)
			.json({ error: "Error de validación de pago. Acceso denegado." });
	}

	try {
		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS,
			},
		});

		const mailOptions = {
			from: process.env.EMAIL_USER,
			to: email,
			subject: `¡Gracias por tu compra del ${planName}! - Easy English TV`,
			html: `
        <h1>👋 ¡Hola ${name || "Estudiante"}!</h1>
        <p>Gracias por haber adquirido nuestro material <strong>INGLÉS CON AMOR (GRAMÁTICA, VOCABULARIO & SPEAKING)</strong>.</p>
        <p>A través de estos links se te actualizará automáticamente las carpetas con material que iremos publicando conforme avancen nuestras clases en vivo por YouTube.</p>
        
        <ul>
          <li><a href="${process.env.LINK_MATERIAL_1}" target="_blank">Material Parte 1</a></li>
          <li><a href="${process.env.LINK_MATERIAL_2}" target="_blank">Material Parte 2</a></li>
          <li><a href="${process.env.LINK_MATERIAL_3}" target="_blank">Material Parte 3</a></li>
        </ul>

        <p>Te recomendamos descargar el material y de preferencia imprimirlo para mayor comodidad en el desarrollo de tus clases 📚👩🏻‍🏫.</p>
        <br>
        <p>Saludos,</p>
        <p>El equipo de Easy English TV</p>
      `,
			attachments: [
				{
					filename: "Material-EasyEnglishTV.pdf",
					path: path.join(__dirname, "../public/material-demo.pdf"),
				},
			],
		};

		await transporter.sendMail(mailOptions);
		res.status(200).json({ message: "Correo enviado exitosamente" });
	} catch (error) {
		console.error("Error enviando correo:", error);
		res.status(500).json({
			error: error.message || "Error al enviar el correo",
		});
	}
}
