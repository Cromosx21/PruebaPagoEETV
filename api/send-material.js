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
        <h1>👋 ¡Hola ${name || "Estudiante"}!</h1>
        <p>Gracias por haber adquirido nuestro material <strong>INGLÉS CON AMOR (GRAMÁTICA, VOCABULARIO & SPEAKING)</strong>.</p>
        <p>A través de estos links se te actualizará automáticamente las carpetas con material que iremos publicando conforme avancen nuestras clases en vivo por YouTube.</p>
        
        <ul>
          <li><a href="${process.env.LINK_MATERIAL_1}" target="_blank">Material de GRAMÁTICA</a></li>
          <li><a href="${process.env.LINK_MATERIAL_2}" target="_blank">Material de VOCABULARIO</a></li>
          <li><a href="${process.env.LINK_MATERIAL_3}" target="_blank">Material de SPEAKING</a></li>
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
