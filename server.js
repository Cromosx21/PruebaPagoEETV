/* global process */
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import createPreferenceHandler from "./api/create-preference.js";
import sendMaterialHandler from "./api/send-material.js";
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

// Rutas API (Adaptadores para Express usando los handlers de Vercel)
app.all("/api/create-preference", (req, res) =>
	createPreferenceHandler(req, res)
);
app.all("/api/send-material", (req, res) => sendMaterialHandler(req, res));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
