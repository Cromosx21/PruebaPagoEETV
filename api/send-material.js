import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function handler(req, res) {
	if (req.method !== "POST") {
		res.setHeader("Allow", ["POST"]);
		return res.status(405).end(`Method ${req.method} Not Allowed`);
	}

	const { email, name, planName } = req.body;

	if (!email) {
		return res.status(400).json({ error: "Email es requerido" });
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
        <h1>¡Hola ${name || "Estudiante"}!</h1>
        <p>Gracias por adquirir el <strong>${planName}</strong>.</p>
        <p>Adjunto encontrarás el material prometido. Por favor descárgalo y guárdalo en un lugar seguro.</p>
        <p>Si tienes alguna duda, el material puede tardar hasta 24 horas en llegar en casos excepcionales. Si no lo recibes, contacta a soporte.</p>
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
