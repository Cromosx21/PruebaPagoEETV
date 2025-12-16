// Sección de suscripción: integra PayPal (wallet y tarjeta) y Stripe Checkout para pagos con tarjeta
// - Moneda configurada para Perú (PEN)
// - Selección de planes con distintos montos
// - Carga dinámica del SDK de PayPal usando client id por entorno
import { useEffect, useRef, useState } from "react";

const PLANS = [
	{
		id: "mensual",
		name: "Plan Mensual",
		amount: "9.99",
		currency: "USD",
		color: "primary",
	},
	{
		id: "unico",
		name: "Plan Único",
		amount: "49.00",
		currency: "USD",
		color: "secondary",
	},
];

export default function Subscribe() {
	const [selected, setSelected] = useState(PLANS[0]);
	const [status, setStatus] = useState("");
	const paypalContainerRef = useRef(null);
	const cardContainerRef = useRef(null);
	const colorClasses = { primary: "bg-primary", secondary: "bg-secondary" };

	useEffect(() => {
		const rawId = import.meta.env.VITE_PAYPAL_CLIENT_ID || "sb";
		const clientId =
			String(rawId)
				.replace(/^"+|"+$/g, "")
				.trim() || "sb";
		const url = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&components=buttons&enable-funding=card`;
		const ensureSdk = () =>
			new Promise((resolve, reject) => {
				if (window.paypal) return resolve();
				const script = document.createElement("script");
				script.src = url;
				script.async = true;
				script.onload = () => resolve();
				script.onerror = () =>
					reject(new Error("No se pudo cargar PayPal SDK"));
				document.body.appendChild(script);
			});

		const renderButtons = async () => {
			try {
				await ensureSdk();
				setStatus("");
				if (paypalContainerRef.current) {
					paypalContainerRef.current.innerHTML = "";
				}
				if (cardContainerRef.current) {
					cardContainerRef.current.innerHTML = "";
				}
				// Botón estándar de PayPal (wallet)
				const paypalButtons = window.paypal.Buttons({
					style: {
						layout: "horizontal",
						shape: "pill",
						color: "gold",
					},
					createOrder: (_, actions) =>
						actions.order.create({
							purchase_units: [
								{
									amount: {
										value: selected.amount,
										currency_code: "USD",
									},
									description: selected.name,
								},
							],
						}),
					onApprove: async (_, actions) => {
						const details = await actions.order.capture();
						setStatus(`Pago aprobado: ${details.id}`);
					},
					onError: () => setStatus("Error procesando el pago"),
				});
				paypalButtons.render(paypalContainerRef.current);

				// Botón de tarjeta vía PayPal (si es elegible en la región)
				const cardButtons = window.paypal.Buttons({
					fundingSource: window.paypal.FUNDING.CARD,
					style: {
						layout: "horizontal",
						shape: "pill",
						color: "silver",
					},
					createOrder: (_, actions) =>
						actions.order.create({
							purchase_units: [
								{
									amount: {
										value: selected.amount,
										currency_code: "USD",
									},
									description: `${selected.name} (Tarjeta)`,
								},
							],
						}),
					onApprove: async (_, actions) => {
						const details = await actions.order.capture();
						setStatus(`Pago con tarjeta aprobado: ${details.id}`);
					},
					onError: () => setStatus("Error procesando la tarjeta"),
				});
				if (cardButtons.isEligible()) {
					cardButtons.render(cardContainerRef.current);
				} else {
					if (cardContainerRef.current) {
						cardContainerRef.current.innerHTML =
							'<div class="text-sm text-slate-600">Pago con tarjeta no disponible en tu región</div>';
					}
				}
			} catch {
				setStatus("No se pudo inicializar el pago");
			}
		};
		renderButtons();
		// Re-render cuando cambia el plan
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selected.id]);

	return (
		<section id="suscribete" className="py-16 bg-slate-50">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="text-center">
					<h2 className="text-3xl font-bold">Suscríbete</h2>
					<p className="mt-2 text-slate-600">
						Elige tu plan y paga con PayPal o tarjeta débito
					</p>
				</div>

				<div className="mt-8 grid md:grid-cols-3 gap-6">
					{PLANS.map((p) => (
						<button
							key={p.id}
							className={`rounded-xl border p-4 text-left transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md ${
								selected.id === p.id
									? "ring-2 ring-primary"
									: ""
							}`}
							onClick={() => setSelected(p)}
						>
							<div className="flex items-center justify-between">
								<div>
									<div className="text-lg font-semibold">
										{p.name}
									</div>
									<div className="mt-1 text-sm text-slate-600">
										{p.currency} {p.amount}
									</div>
								</div>
								<span
									className={`inline-block h-6 w-6 rounded ${
										colorClasses[p.color]
									}`}
								></span>
							</div>
						</button>
					))}
				</div>

				<div className="mt-10 grid md:grid-cols-3 gap-6">
					<div className="rounded-2xl border bg-white p-6 shadow-sm">
						<div className="text-lg font-semibold">
							Pagar con PayPal
						</div>
						<div className="mt-1 text-sm text-slate-600">
							Pagos procesados en USD
						</div>
						<div className="mt-4" ref={paypalContainerRef} />
					</div>
					<div className="rounded-2xl border bg-white p-6 shadow-sm">
						<div className="text-lg font-semibold">
							Pagar con Tarjeta Débito
						</div>
						<div className="mt-4" ref={cardContainerRef} />
					</div>
					<div className="hidden"></div>
				</div>

				{status && (
					<div className="mt-6 rounded-lg border bg-white p-4 text-sm">
						{status}
					</div>
				)}
			</div>
		</section>
	);
}
