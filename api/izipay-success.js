import getRawBody from "raw-body";
import crypto from "crypto";

export default async function handler(req, res) {
	if (req.method !== "POST") {
		res.status(405).json({ error: "Method not allowed" });
		return;
	}
	const shaKey = process.env.IZIPAY_SHA256_KEY || "";
	try {
		const raw = await getRawBody(req);
		const parsed = new URLSearchParams(raw.toString());
		const answerStr = parsed.get("kr-answer") || "";
		const hash = parsed.get("kr-hash") || "";
		if (!answerStr || !hash) {
			res.status(400).send("Missing payment data");
			return;
		}
		if (shaKey) {
			const calc = crypto
				.createHmac("sha256", shaKey)
				.update(answerStr, "utf8")
				.digest("hex");
			if (calc !== hash) {
				res.status(400).send("Invalid signature");
				return;
			}
		}
		let answer;
		try {
			answer = JSON.parse(answerStr);
		} catch {
			res.status(400).send("Invalid answer format");
			return;
		}
		const amount = (answer?.orderDetails?.orderTotalAmount || 0) / 100;
		const currency = answer?.orderDetails?.orderCurrency || "PEN";
		const orderId = answer?.orderDetails?.orderId || "";
		const transId = answer?.transactions?.[0]?.transactionDetails?.transactionId || "";
		const cardBrand = answer?.transactions?.[0]?.paymentMethod?.brand || "";
		const maskedPan = answer?.transactions?.[0]?.paymentMethod?.maskedPan || "";
		const status = answer?.transactions?.[0]?.transactionDetails?.status || "";
		const date = answer?.transactions?.[0]?.transactionDetails?.effectiveDate || "";
		const customerEmail = answer?.customer?.email || "";
		const html = `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Comprobante de Pago</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet"><style>body{font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#f8fafc;color:#0f172a;margin:0;padding:24px} .card{max-width:720px;margin:0 auto;background:#fff;border:1px solid #e2e8f0;border-radius:12px;box-shadow:0 1px 2px rgba(0,0,0,.05)} .header{padding:20px 24px;border-bottom:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center} .title{font-size:18px;font-weight:600} .badge{padding:4px 10px;border-radius:999px;background:#dcfce7;color:#166534;font-size:12px;font-weight:600} .body{padding:24px;display:grid;grid-template-columns:1fr 1fr;gap:16px} .item{border:1px solid #e2e8f0;border-radius:10px;padding:12px} .label{font-size:12px;color:#475569} .value{margin-top:4px;font-weight:600} .footer{padding:16px 24px;border-top:1px solid #e2e8f0;display:flex;gap:12px} .btn{appearance:none;border:1px solid #0f172a;background:#0f172a;color:#fff;padding:10px 14px;border-radius:8px;font-weight:600;cursor:pointer} .btn.secondary{background:#fff;color:#0f172a} .muted{font-size:12px;color:#64748b;margin-left:auto}</style></head><body><div class="card"><div class="header"><div class="title">Comprobante de Pago</div><div class="badge">${status || "SUCCESS"}</div></div><div class="body"><div class="item"><div class="label">Monto</div><div class="value">${currency} ${amount.toFixed(2)}</div></div><div class="item"><div class="label">Orden</div><div class="value">${orderId}</div></div><div class="item"><div class="label">Transacción</div><div class="value">${transId}</div></div><div class="item"><div class="label">Fecha</div><div class="value">${date}</div></div><div class="item"><div class="label">Tarjeta</div><div class="value">${cardBrand} •••• ${maskedPan?.slice(-4) || ""}</div></div><div class="item"><div class="label">Correo</div><div class="value">${customerEmail}</div></div></div><div class="footer"><button class="btn" onclick="window.print()">Descargar/Imprimir</button><a class="btn secondary" href="/">Volver al inicio</a><div class="muted">EasyEnglishTV</div></div></div></body></html>`;
		res.setHeader("Content-Type", "text/html; charset=utf-8");
		res.status(200).send(html);
	} catch {
		res.status(500).send("Server error");
	}
}
