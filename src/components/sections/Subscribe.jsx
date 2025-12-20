import { useEffect, useRef, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useCurrency } from "../../context/CurrencyContext";
import IcoFacebook from "../../../public/SocialMedia/IcoFacebook.svg?react";
import IcoYouTube from "../../../public/SocialMedia/IcoYoutube.svg?react";

const stripePromise = loadStripe(
	import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_placeholder"
);

const PLANS = [
	{
		id: "mensual",
		name: "Plan Mensual",
		amount: "6.00",
		currency: "USD",
		paypalAmount: "6.00",
		color: "primary",
		allowedMethods: ["facebook"],
	},
	{
		id: "oro",
		name: "Plan ORO",
		amount: "8.00",
		currency: "USD",
		paypalAmount: "8.00",
		color: "accent",
		allowedMethods: ["youtube"],
	},
	{
		id: "unico",
		name: "Plan Único",
		amount: "50.00",
		currency: "USD",
		paypalAmount: "50.00",
		color: "secondary",
		allowedMethods: ["paypal", "stripe", "qr"],
	},
];

export default function Subscribe() {
	const { formatPrice, currency } = useCurrency();
	const [selected, setSelected] = useState(PLANS[2]); // Default to Unico (Popular)
	const [status, setStatus] = useState("");
	const [method, setMethod] = useState(PLANS[2].allowedMethods[0]);
	const paypalContainerRef = useRef(null);
	const colorClasses = {
		primary: "bg-primary",
		secondary: "bg-secondary",
		accent: "bg-accent",
	};

	const yapeNumber = (import.meta.env.VITE_YAPE_NUMBER || "932914462")
		.toString()
		.trim();
	const plinNumber = (import.meta.env.VITE_PLIN_NUMBER || "932914462")
		.toString()
		.trim();
	const whatsappNumber = (
		import.meta.env.VITE_WHATSAPP_NUMBER || "+51932914462"
	)
		.toString()
		.trim();
	const yapeQr = import.meta.env.VITE_YAPE_QR_URL || "/Yape-qr.jpeg";
	const plinQr = import.meta.env.VITE_PLIN_QR_URL || "/Yape-qr.jpeg";

	// Actualizar método de pago al cambiar de plan
	useEffect(() => {
		if (selected && !selected.allowedMethods.includes(method)) {
			setMethod(selected.allowedMethods[0]);
		}
	}, [selected, method]);

	// Verificar retorno de Stripe
	useEffect(() => {
		const query = new URLSearchParams(window.location.search);
		if (query.get("status") === "success" && query.get("session_id")) {
			setStatus("Confirmando pago...");
			fetch("/api/confirm-stripe-payment", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ session_id: query.get("session_id") }),
			})
				.then((res) => res.json())
				.then((data) => {
					if (data.status === "confirmed") {
						setStatus(
							`¡Pago exitoso! Hemos enviado el material a ${data.email}.`
						);
						// Limpiar URL
						window.history.replaceState(
							{},
							document.title,
							window.location.pathname
						);
					} else {
						setStatus(
							"Error al confirmar el pago. Contacte a soporte."
						);
					}
				})
				.catch((err) => {
					console.error(err);
					setStatus("Error de conexión al confirmar pago.");
				});
		} else if (query.get("status") === "cancel") {
			setStatus("El pago fue cancelado.");
		}
	}, []);

	useEffect(() => {
		const rawId = import.meta.env.VITE_PAYPAL_CLIENT_ID || "sb";
		const clientId =
			String(rawId)
				.replace(/^"+|"+$/g, "")
				.trim() || "sb";
		const url = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&components=buttons`;

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
				if (method !== "paypal") {
					if (paypalContainerRef.current)
						paypalContainerRef.current.innerHTML = "";
					return;
				}

				await ensureSdk();
				setStatus("");
				if (paypalContainerRef.current)
					paypalContainerRef.current.innerHTML = "";

				window.paypal
					.Buttons({
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
											value: selected.paypalAmount,
											currency_code: "USD",
										},
										description: selected.name,
									},
								],
							}),
						onApprove: async (_, actions) => {
							const details = await actions.order.capture();
							setStatus("Procesando envío de material...");

							// Enviar correo tras pago exitoso
							fetch("/api/send-material", {
								method: "POST",
								headers: { "Content-Type": "application/json" },
								body: JSON.stringify({
									email: details.payer.email_address,
									name: details.payer.name.given_name,
									planName: selected.name,
								}),
							})
								.then((res) => res.json())
								.then(() => {
									setStatus(
										`¡Pago aprobado! Material enviado a ${details.payer.email_address}.`
									);
								})
								.catch(() => {
									setStatus(
										`Pago aprobado, pero hubo un error enviando el correo. ID: ${details.id}`
									);
								});
						},
						onError: () =>
							setStatus("Error procesando el pago con PayPal"),
					})
					.render(paypalContainerRef.current);
			} catch {
				setStatus("No se pudo inicializar PayPal");
			}
		};

		renderButtons();
	}, [selected.id, method, selected.paypalAmount, selected.name]);

	const handleStripePayment = async () => {
		setStatus("Redirigiendo a Stripe...");
		try {
			const stripe = await stripePromise;
			const response = await fetch("/api/create-checkout-session", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ planId: selected.id }),
			});
			const session = await response.json();
			if (session.error) {
				setStatus(session.error);
				return;
			}
			const result = await stripe.redirectToCheckout({
				sessionId: session.id,
			});
			if (result.error) {
				setStatus(result.error.message);
			}
		} catch (error) {
			console.error(error);
			setStatus("Error al conectar con Stripe");
		}
	};

	return (
		<section id="suscribete" className="py-16 bg-slate-50">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="text-center">
					<h2 className="text-3xl font-bold">Suscríbete</h2>
					<p className="mt-2 text-slate-600">
						Elige tu plan y paga de forma segura
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
										{formatPrice(parseFloat(p.amount))}
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

				{selected.allowedMethods.length === 1 ? (
					<div className="mt-10 max-w-3xl mx-auto">
						<div className="rounded-2xl border bg-white p-10 shadow-sm text-center">
							{method === "facebook" && (
								<div className="flex flex-col items-center">
									<IcoFacebook className="w-24 h-24 text-[#1877F2] mb-6" />
									<h3 className="text-2xl font-bold mb-2">
										Suscríbete por Facebook
									</h3>
									<p className="text-slate-600 mb-8 text-lg max-w-lg">
										Únete a nuestra comunidad exclusiva en
										Facebook para acceder a las clases de
										este plan.
									</p>
									<a
										href="https://www.facebook.com/EasyEnglishTv.1"
										target="_blank"
										rel="noreferrer"
										className="inline-flex items-center justify-center rounded-xl bg-[#1877F2] text-white px-10 py-4 hover:bg-[#166fe5] transition-all duration-200 font-bold text-xl shadow-lg hover:shadow-xl hover:-translate-y-1"
									>
										Suscribirme en Facebook
									</a>
									<p className="mt-6 text-sm text-slate-500">
										Serás redirigido a Facebook. Busca el
										botón "Suscribirse".
									</p>
								</div>
							)}

							{method === "youtube" && (
								<div className="flex flex-col items-center">
									<IcoYouTube className="w-24 h-24 text-[#FF0000] mb-6" />
									<h3 className="text-2xl font-bold mb-2">
										Suscríbete por YouTube
									</h3>
									<p className="text-slate-600 mb-8 text-lg max-w-lg">
										Conviértete en miembro del canal para
										acceder a los beneficios del Plan ORO.
									</p>
									<a
										href="https://www.youtube.com/channel/UCzxP2uldBPoaOdS-vhuGYzg/join"
										target="_blank"
										rel="noreferrer"
										className="inline-flex items-center justify-center rounded-xl bg-[#FF0000] text-white px-10 py-4 hover:bg-[#e60000] transition-all duration-200 font-bold text-xl shadow-lg hover:shadow-xl hover:-translate-y-1"
									>
										Unirme en YouTube
									</a>
									<p className="mt-6 text-sm text-slate-500">
										Serás redirigido a YouTube para
										completar tu membresía.
									</p>
								</div>
							)}
						</div>
					</div>
				) : (
					<div className="mt-10 grid md:grid-cols-4 gap-6">
						<div className="rounded-2xl border bg-white p-6 shadow-sm">
							<div className="text-lg font-semibold">
								Método de pago
							</div>
							<div className="mt-4 flex flex-wrap gap-2">
								{selected.allowedMethods.includes("paypal") && (
									<button
										type="button"
										onClick={() => setMethod("paypal")}
										className={`px-3 py-2 rounded-lg border ${
											method === "paypal"
												? "bg-primary text-white border-primary"
												: "bg-white text-slate-700"
										}`}
									>
										PayPal
									</button>
								)}
								{selected.allowedMethods.includes("stripe") && (
									<button
										type="button"
										onClick={() => setMethod("stripe")}
										className={`px-3 py-2 rounded-lg border ${
											method === "stripe"
												? "bg-primary text-white border-primary"
												: "bg-white text-slate-700"
										}`}
									>
										Tarjeta (Stripe)
									</button>
								)}
								{selected.allowedMethods.includes("qr") && (
									<button
										type="button"
										onClick={() => setMethod("qr")}
										className={`px-3 py-2 rounded-lg border ${
											method === "qr"
												? "bg-primary text-white border-primary"
												: "bg-white text-slate-700"
										}`}
									>
										QR (Yape/Plin)
									</button>
								)}
							</div>
						</div>

						<div className="rounded-2xl border bg-white p-6 shadow-sm md:col-span-2 relative">
							{/* PayPal */}
							{method === "paypal" && (
								<>
									<div className="text-lg font-semibold">
										Pagar con PayPal
									</div>
									<div className="mt-1 text-sm text-slate-600">
										Monto:{" "}
										{formatPrice(
											parseFloat(selected.amount)
										)}{" "}
										{currency !== "USD" &&
											`(aprox. $${selected.amount} USD)`}
									</div>
									<div
										className="mt-4"
										ref={paypalContainerRef}
									/>
								</>
							)}

							{/* Stripe */}
							{method === "stripe" && (
								<>
									<div className="text-lg font-semibold">
										Pagar con Tarjeta
									</div>
									<div className="mt-1 text-sm text-slate-600">
										Procesado por Stripe (Seguro). Se
										cobrará en USD.
									</div>
									<div className="mt-4">
										<button
											onClick={handleStripePayment}
											className="w-full rounded-lg bg-indigo-600 text-white px-5 py-3 hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center gap-2"
										>
											<svg
												className="w-5 h-5"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
												/>
											</svg>
											Pagar{" "}
											{formatPrice(
												parseFloat(selected.amount)
											)}{" "}
											con Tarjeta
										</button>
									</div>
								</>
							)}

							{/* QR */}
							{method === "qr" && (
								<>
									<div className="text-lg font-semibold">
										Pagar con QR (Yape/Plin)
									</div>
									<div className="mt-4 grid md:grid-cols-2 gap-4">
										<div className="rounded-lg border p-4">
											<div className="font-medium">
												Yape
											</div>
											<div className="mt-2">
												<img
													src={yapeQr}
													alt="QR Yape"
													className="w-full rounded"
												/>
											</div>
											<div className="mt-2 text-sm text-slate-700">
												Nombre: Jessica Milagros Zena
												Torres
												<br />
												Número: {yapeNumber}
											</div>
										</div>
										<div className="rounded-lg border p-4">
											<div className="font-medium">
												Plin
											</div>
											<div className="mt-2">
												<img
													src={plinQr}
													alt="QR Plin"
													className="w-full rounded"
												/>
											</div>
											<div className="mt-2 text-sm text-slate-700">
												Nombre: Jessica Milagros Zena
												Torres
												<br />
												Número: {plinNumber}
											</div>
										</div>
									</div>
									<button
										type="button"
										className="mt-4 rounded-lg bg-green-600 text-white px-5 py-3 w-full hover:bg-green-700 transition-colors"
										onClick={() => {
											const msg = encodeURIComponent(
												`Hola, envié mi comprobante de pago por QR para el ${selected.name}.`
											);
											window.open(
												`https://wa.me/${whatsappNumber.replace(
													/[^+\d]/g,
													""
												)}?text=${msg}`,
												"_blank"
											);
										}}
									>
										Enviar voucher por WhatsApp
									</button>
								</>
							)}
						</div>
					</div>
				)}

				{status && (
					<div
						className={`mt-6 rounded-lg border p-4 text-sm font-medium ${
							status.includes("exitoso") ||
							status.includes("aprobado")
								? "bg-green-50 text-green-700 border-green-200"
								: "bg-slate-50 text-slate-700"
						}`}
					>
						{status}
					</div>
				)}
			</div>
		</section>
	);
}
