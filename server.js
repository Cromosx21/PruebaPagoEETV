/* global process */
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createPreference } from "./api/mercadopago.js";
import { sendMaterial } from "./api/email.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// Servir archivos estáticos (para el PDF de demo)
app.use(express.static(path.join(__dirname, "public")));

// Rutas API
app.post("/api/create-preference", createPreference);
app.post("/api/send-material", sendMaterial);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
