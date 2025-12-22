import { useEffect, useRef, useState } from "react";
import { useCurrency } from "../../context/CurrencyContext";
import IcoFacebook from "../../../public/SocialMedia/IcoFacebook.svg?react";
import IcoYouTube from "../../../public/SocialMedia/IcoYoutube.svg?react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";

const mpPublicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;

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
		allowedMethods: ["paypal", "mercadopago", "qr"],
	},
];

export default function Subscribe() {
	// Initialize Mercado Pago with public key only once inside component
	useEffect(() => {
		if (mpPublicKey) {
			initMercadoPago(mpPublicKey, { locale: "es-PE" });
		}
	}, []);

	const { formatPrice, currency } = useCurrency();
	const [selected, setSelected] = useState(PLANS[2]); // Default to Unico
	const [status, setStatus] = useState("");
	const [method, setMethod] = useState(PLANS[2].allowedMethods[0]);
	const [preferenceId, setPreferenceId] = useState(null);
	const [email, setEmail] = useState("");
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

	const handlePlanSelect = (plan) => {
		setSelected(plan);
		if (!plan.allowedMethods.includes(method)) {
			setMethod(plan.allowedMethods[0]);
		}
	};

	// Validate email format
	const isValidEmail = (email) => {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	};

	// Check for payment status on mount (Return from Mercado Pago)
	useEffect(() => {
		const query = new URLSearchParams(window.location.search);
		const statusParam = query.get("status");
		const paymentId = query.get("payment_id");

		if (statusParam === "approved" && paymentId) {
			const pendingEmail = localStorage.getItem("pending_payment_email");
			const pendingPlan = localStorage.getItem("pending_payment_plan");

			if (pendingEmail) {
				// Use setTimeout to avoid synchronous state update warning during effect
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
								`¡Pago aprobado! Material enviado a ${pendingEmail}.`
							);
							localStorage.removeItem("pending_payment_email");
							localStorage.removeItem("pending_payment_plan");
							window.history.replaceState(
								{},
								document.title,
								window.location.pathname
							);
						})
						.catch(() => {
							setStatus(
								"Pago aprobado, pero hubo un error enviando el correo. Contacta a soporte."
							);
						});
				}, 0);
			} else {
				setTimeout(() => setStatus("Pago aprobado exitosamente."), 0);
			}
		} else if (statusParam === "failure") {
			setTimeout(
				() => setStatus("El pago fue rechazado. Intenta nuevamente."),
				0
			);
		} else if (statusParam === "pending") {
			setTimeout(
				() => setStatus("El pago está pendiente de confirmación."),
				0
			);
		}
	}, []);

	// Initialize PayPal
	useEffect(() => {
		if (method !== "paypal") {
			if (paypalContainerRef.current)
				paypalContainerRef.current.innerHTML = "";
			return;
		}

		// Don't render PayPal if email is invalid (force user to input email first)
		if (!isValidEmail(email) && selected.id === "unico") {
			if (paypalContainerRef.current)
				paypalContainerRef.current.innerHTML = "";
			return;
		}

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

							// Send email
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
	}, [selected.id, method, selected.paypalAmount, selected.name, email]);

	// Create Mercado Pago Preference
	useEffect(() => {
		let isMounted = true;
		let timeoutId;

		// Only create preference if method is MP and email is valid
		if (
			method === "mercadopago" &&
			selected &&
			selected.id === "unico" &&
			isValidEmail(email)
		) {
			// Debounce to prevent multiple calls while typing
			timeoutId = setTimeout(() => {
				// Save email for return flow
				localStorage.setItem("pending_payment_email", email);
				localStorage.setItem("pending_payment_plan", selected.name);

				fetch("/api/create-preference", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						planId: selected.id,
						title: selected.name,
						price: selected.amount,
						email: email, // Pass email to backend if needed
					}),
				})
					.then((res) => res.json())
					.then((data) => {
						if (isMounted) {
							if (data.id) setPreferenceId(data.id);
							else
								setStatus(
									"Error al crear preferencia de Mercado Pago"
								);
						}
					})
					.catch((err) => {
						if (isMounted) {
							console.error(err);
							setStatus("Error conectando con Mercado Pago");
						}
					});
			}, 800); // 800ms debounce
		} else {
			// Clear preference if conditions are not met
			setPreferenceId((prev) => (prev ? null : prev));
		}

		return () => {
			isMounted = false;
			if (timeoutId) clearTimeout(timeoutId);
		};
		// Removed preferenceId from dependencies to avoid infinite loop/re-renders
	}, [method, selected, email]);

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
							onClick={() => handlePlanSelect(p)}
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
								{selected.allowedMethods.includes(
									"mercadopago"
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
							{/* Email Input for Payment Methods */}
							{(method === "mercadopago" ||
								method === "paypal") && (
								<div className="mb-6">
									<label className="block text-sm font-medium text-slate-700 mb-1">
										Correo Electrónico (Para recibir tu
										material)
									</label>
									<input
										type="email"
										value={email}
										onChange={(e) =>
											setEmail(e.target.value)
										}
										placeholder="tu@correo.com"
										className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
									/>
									{!isValidEmail(email) &&
										email.length > 0 && (
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
											parseFloat(selected.amount)
										)}{" "}
										{currency !== "USD" &&
											`(aprox. $${selected.amount} USD)`}
									</div>
									<div
										className="mt-4"
										ref={paypalContainerRef}
									/>
									{!isValidEmail(email) && (
										<p className="text-sm text-amber-600 mt-2">
											Ingresa tu correo arriba para ver el
											botón de pago.
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
										Procesado por Mercado Pago. Se cobrará
										en PEN/USD según configuración.
									</div>
									<div className="mt-4">
										{isValidEmail(email) ? (
											preferenceId ? (
												<Wallet
													key={preferenceId}
													initialization={{
														preferenceId:
															preferenceId,
													}}
													customization={{
														texts: {
															valueProp:
																"smart_option",
														},
													}}
												/>
											) : (
												<div className="text-sm text-slate-500">
													Cargando opción de pago...
												</div>
											)
										) : (
											<p className="text-sm text-amber-600">
												Ingresa tu correo arriba para
												continuar.
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
