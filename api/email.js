import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función interna reutilizable
export const sendEmailInternal = async ({ email, name, planName }) => {
	if (!email) throw new Error("Email es requerido");

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
};

// Handler para la ruta API (PayPal usa esto directamente)
export const sendMaterial = async (req, res) => {
	try {
		const { email, name, planName } = req.body;
		await sendEmailInternal({ email, name, planName });
		res.json({ message: "Correo enviado exitosamente" });
	} catch (error) {
		console.error("Error enviando correo:", error);
		res.status(500).json({
			error: error.message || "Error al enviar el correo",
		});
	}
};
