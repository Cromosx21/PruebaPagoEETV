export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  const base = process.env.IZIPAY_CHECKOUT_BASE_URL;
  const merchant = process.env.IZIPAY_MERCHANT_ID;
  if (!base || !merchant) {
    res.status(500).json({ error: "Izipay not configured" });
    return;
  }
  const body =
    typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const planId = body.planId;
  const plans = {
    mensual: { name: "Plan Mensual", amount: 9.99, currency: "PEN" },
    unico: { name: "Plan Único", amount: 49.0, currency: "PEN" },
  };
  const plan = plans[planId] || plans.mensual;
  const host = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:5173";
  const params = new URLSearchParams({
    amount: String(plan.amount),
    currency: plan.currency,
    description: plan.name,
    merchant_id: merchant,
    methods: "yape,plin",
    success_url: `${host}/?payment=success`,
    cancel_url: `${host}/?payment=cancel`,
  });
  const url = `${base}?${params.toString()}`;
  res.status(200).json({ url });
}
