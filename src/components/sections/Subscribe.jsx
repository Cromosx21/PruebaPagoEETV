import { useEffect, useState } from "react";
import { useCurrency } from "../../context/CurrencyContext";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const mpPublicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;

const DEFAULT_PLAN = {
	id: "unico",
	name: "Plan Único",
	amount: "50.00",
	currency: "USD",
	paypalAmount: "50.00",
	allowedMethods: ["paypal", "mercadopago", "qr"],
};

/**
 * Componente principal de suscripción.
 * Maneja la selección de planes y los métodos de pago (PayPal, MercadoPago, QR).
 */
export default function Subscribe() {
	// Inicializar Mercado Pago
	useEffect(() => {
		if (mpPublicKey) {
			initMercadoPago(mpPublicKey, { locale: "es-PE" });
		}
	}, []);

	const { formatPrice, currency, rates } = useCurrency();
	const [status, setStatus] = useState("");
	const [method, setMethod] = useState(DEFAULT_PLAN.allowedMethods[0]);
	const [preferenceId, setPreferenceId] = useState(null);
	const [email, setEmail] = useState("");

	const whatsappNumber = (import.meta.env.VITE_WHATSAPP_NUMBER || "")
		.toString()
		.trim();
	const yapeQr = import.meta.env.VITE_YAPE_QR_URL || "/Yape-qr.jpeg";

	// Obtener ID de Cliente de PayPal (Sandbox o Live)
	// NOTA: Para cuenta personal, usar el Client ID generado en developer.paypal.com con dicha cuenta.
	const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || "sb";

	const isValidEmail = (email) => {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	};

	// Manejo del retorno de Mercado Pago
	useEffect(() => {
		const query = new URLSearchParams(window.location.search);
		const statusParam = query.get("status");
		const paymentId = query.get("payment_id");

		if (statusParam === "approved" && paymentId) {
			const pendingEmail = localStorage.getItem("pending_payment_email");
			const pendingPlan = localStorage.getItem("pending_payment_plan");

			if (pendingEmail) {
				setTimeout(() => {
					setStatus("Pago aprobado. Enviando material...");
					fetch("/api/send-material", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							email: pendingEmail,
							name: "Estudiante",
							planName: pendingPlan || "Plan Único",
						}),
					})
						.then((res) => res.json())
						.then(() => {
							setStatus(
								`¡Pago aprobado! Material enviado a ${pendingEmail}.`,
							);
							localStorage.removeItem("pending_payment_email");
							localStorage.removeItem("pending_payment_plan");
							window.history.replaceState(
								{},
								document.title,
								window.location.pathname,
							);
						})
						.catch(() => {
							setStatus(
								"Pago aprobado, pero hubo un error enviando el correo. Contacta a soporte.",
							);
						});
				}, 0);
			} else {
				setTimeout(() => setStatus("Pago aprobado exitosamente."), 0);
			}
		} else if (statusParam === "failure") {
			setTimeout(
				() => setStatus("El pago fue rechazado. Intenta nuevamente."),
				0,
			);
		} else if (statusParam === "pending") {
			setTimeout(
				() => setStatus("El pago está pendiente de confirmación."),
				0,
			);
		}
	}, []);

	// Generar Preferencia de Mercado Pago
	useEffect(() => {
		let isMounted = true;
		let timeoutId;

		if (method === "mercadopago" && isValidEmail(email)) {
			timeoutId = setTimeout(() => {
				localStorage.setItem("pending_payment_email", email);
				localStorage.setItem("pending_payment_plan", DEFAULT_PLAN.name);

				let finalPrice = parseFloat(DEFAULT_PLAN.amount);
				let finalCurrency = DEFAULT_PLAN.currency;

				if (currency === "PEN") {
					const rate = rates["PEN"] || 3.75;
					finalPrice = finalPrice * rate;
					finalCurrency = "PEN";
				}

				fetch("/api/create-preference", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						planId: DEFAULT_PLAN.id,
						title: DEFAULT_PLAN.name,
						price: finalPrice,
						currency_id: finalCurrency,
						email: email,
					}),
				})
					.then((res) => res.json())
					.then((data) => {
						if (isMounted) {
							if (data.id) setPreferenceId(data.id);
							else
								setStatus(
									"Error al crear preferencia de Mercado Pago",
								);
						}
					})
					.catch((err) => {
						if (isMounted) {
							console.error(err);
							setStatus("Error conectando con Mercado Pago");
						}
					});
			}, 800);
		} else {
			if (preferenceId) {
				timeoutId = setTimeout(() => {
					setPreferenceId(null);
				}, 0);
			}
		}

		return () => {
			isMounted = false;
			if (timeoutId) clearTimeout(timeoutId);
		};
	}, [method, email, currency, rates, preferenceId]);

	const currentStep = status ? 3 : 2;

	return (
		<section id="subscribe" className="py-16 bg-slate-50">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="text-center">
					<h2 className="text-3xl font-bold">Suscríbete</h2>
					<p className="mt-2 text-slate-600">
						Elige tu plan y paga de forma segura
					</p>
				</div>

				<div className="mt-8 max-w-3xl mx-auto">
					<div className="relative flex items-center justify-between gap-4">
						<div className="absolute inset-x-10 top-1/2 h-0.5 -translate-y-1/2 bg-slate-200"></div>
						{[
							"Escoge tu plan",
							"Escoge método de pago",
							"Confirmación del material",
						].map((label, index) => {
							const step = index + 1;
							const isCompleted = step < currentStep;
							const isActive = step === currentStep;

							return (
								<div
									key={label}
									className="relative flex-1 flex flex-col items-center text-center"
								>
									<div
										className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-xs font-semibold ${
											isCompleted
												? "bg-green-500 border-green-500 text-white"
												: isActive
													? "bg-primary border-primary text-white"
													: "bg-white border-slate-300 text-slate-600"
										}`}
									>
										{isCompleted ? "✓" : step}
									</div>
									<span
										className={`mt-2 text-xs sm:text-sm font-medium ${
											isActive
												? "text-slate-900"
												: "text-slate-500"
										}`}
									>
										{label}
									</span>
								</div>
							);
						})}
					</div>
				</div>

				<div className="mt-10 max-w-3xl mx-auto grid md:grid-cols-5 gap-6">
					<div className="rounded-2xl border bg-white p-6 shadow-sm md:col-span-2">
						<div className="text-lg font-semibold">
							Método de pago
						</div>
						<div className="mt-4 flex flex-wrap gap-2">
							{DEFAULT_PLAN.allowedMethods.includes("paypal") && (
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
							{DEFAULT_PLAN.allowedMethods.includes(
								"mercadopago",
							) && (
								<button
									type="button"
									onClick={() => setMethod("mercadopago")}
									className={`px-3 py-2 rounded-lg border ${
										method === "mercadopago"
											? "bg-primary text-white border-primary"
											: "bg-white text-slate-700"
									}`}
								>
									Mercado Pago
								</button>
							)}
							{DEFAULT_PLAN.allowedMethods.includes("qr") && (
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

					<div className="rounded-2xl border bg-white p-6 shadow-sm md:col-span-3 relative">
						{/* Email Input for Payment Methods */}
						{(method === "mercadopago" || method === "paypal") && (
							<div className="mb-6">
								<label className="block text-sm font-medium text-slate-700 mb-1">
									Correo Electrónico (Para recibir tu
									material)
								</label>
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="tu@correo.com"
									className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
								/>
								{!isValidEmail(email) && email.length > 0 && (
									<p className="text-red-500 text-xs mt-1">
										Ingresa un correo válido
									</p>
								)}
							</div>
						)}

						{/* PayPal */}
						{method === "paypal" && (
							<>
								<div className="text-lg font-semibold">
									Pagar con PayPal
								</div>
								<div className="mt-1 text-sm text-slate-600">
									Monto:{" "}
									{formatPrice(
										parseFloat(DEFAULT_PLAN.amount),
									)}{" "}
									{currency !== "USD" &&
										`(aprox. $${DEFAULT_PLAN.amount} USD)`}
								</div>
								<div className="mt-4">
									{!isValidEmail(email) ? (
										<button
											disabled
											className="w-full py-3 rounded-full bg-slate-200 text-slate-400 font-bold cursor-not-allowed border border-slate-300"
										>
											Pagar con PayPal
										</button>
									) : (
										<PayPalScriptProvider
											options={{
												"client-id": paypalClientId,
												currency: "USD",
											}}
										>
											<PayPalButtons
												style={{
													layout: "horizontal",
													shape: "pill",
													color: "gold",
												}}
												createOrder={(_, actions) => {
													return actions.order.create(
														{
															purchase_units: [
																{
																	amount: {
																		value: DEFAULT_PLAN.paypalAmount,
																		currency_code:
																			"USD",
																	},
																	description:
																		DEFAULT_PLAN.name,
																},
															],
														},
													);
												}}
												onApprove={async (
													_,
													actions,
												) => {
													const details =
														await actions.order.capture();
													setStatus(
														"Procesando envío de material...",
													);

													// Enviar correo
													fetch(
														"/api/send-material",
														{
															method: "POST",
															headers: {
																"Content-Type":
																	"application/json",
															},
															body: JSON.stringify(
																{
																	email: details
																		.payer
																		.email_address,
																	name: details
																		.payer
																		.name
																		.given_name,
																	planName:
																		DEFAULT_PLAN.name,
																},
															),
														},
													)
														.then((res) =>
															res.json(),
														)
														.then(() => {
															setStatus(
																`¡Pago aprobado! Material enviado a ${details.payer.email_address}.`,
															);
														})
														.catch(() => {
															setStatus(
																`Pago aprobado, pero hubo un error enviando el correo. ID: ${details.id}`,
															);
														});
												}}
												onError={() =>
													setStatus(
														"Error procesando el pago con PayPal",
													)
												}
											/>
										</PayPalScriptProvider>
									)}

									{/* Advertencia solo si estamos en Sandbox explícitamente */}
									{isValidEmail(email) &&
										paypalClientId === "sb" && (
											<div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
												<strong>Modo de Prueba:</strong>{" "}
												Usa una cuenta Sandbox de PayPal
												para probar.
											</div>
										)}
								</div>
								{!isValidEmail(email) && (
									<p className="text-sm text-amber-600 mt-2">
										Ingresa tu correo arriba para activar el
										botón.
									</p>
								)}
							</>
						)}

						{/* Mercado Pago */}
						{method === "mercadopago" && (
							<>
								<div className="text-lg font-semibold">
									Pagar con Mercado Pago
								</div>
								<div className="mt-1 text-sm text-slate-600">
									Procesado por Mercado Pago. Se cobrará en
									PEN/USD según configuración.
								</div>
								<div className="mt-4">
									{isValidEmail(email) && preferenceId ? (
										<Wallet
											key={preferenceId}
											initialization={{
												preferenceId: preferenceId,
												redirectMode: "modal",
											}}
											customization={{
												texts: {
													valueProp: "smart_option",
												},
											}}
										/>
									) : (
										<button
											disabled
											className="w-full py-3 rounded-lg bg-slate-200 text-slate-400 font-bold cursor-not-allowed border border-slate-300"
										>
											Pagar con Mercado Pago
										</button>
									)}
									{!isValidEmail(email) && (
										<p className="text-sm text-amber-600 mt-2">
											Ingresa tu correo arriba para
											activar el botón.
										</p>
									)}
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
										<div className="mt-2">
											<img
												src={yapeQr}
												alt="QR Yape"
												className="w-full rounded"
											/>
										</div>
										<div className="mt-2 text-sm text-slate-700">
											Nombre: Jessica Milagros Zena Torres
										</div>
									</div>
								</div>
								<button
									type="button"
									className="mt-4 rounded-lg bg-green-600 text-white px-5 py-3 w-full hover:bg-green-700 transition-colors"
									onClick={() => {
										const msg = encodeURIComponent(
											`Hola, envié mi comprobante de pago por QR para el ${DEFAULT_PLAN.name}.`,
										);
										window.open(
											`https://wa.me/${whatsappNumber.replace(
												/[^+\d]/g,
												"",
											)}?text=${msg}`,
											"_blank",
										);
									}}
								>
									Enviar voucher por WhatsApp
								</button>
							</>
						)}
					</div>
				</div>

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
