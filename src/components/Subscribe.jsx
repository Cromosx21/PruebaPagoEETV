import { useEffect, useRef, useState } from "react";

const PLANS = [
	{
		id: "mensual",
		name: "Plan Mensual",
		amount: "16.90",
		currency: "PEN",
		paypalAmount: "5.90",
		color: "primary",
	},
	{
		id: "unico",
		name: "Plan Único",
		amount: "185.00",
		currency: "PEN",
		paypalAmount: "50.00",
		color: "secondary",
	},
	{
		id: "vip",
		name: "Plan VIP",
		amount: "250.00",
		currency: "PEN",
		paypalAmount: "68.00",
		color: "accent",
	},
];

export default function Subscribe() {
	const [selected, setSelected] = useState(PLANS[1]); // Default to Unico (Popular)
	const [status, setStatus] = useState("");
	const [method, setMethod] = useState("paypal");
	const [izipayData, setIzipayData] = useState({
		firstName: "",
		lastName: "",
		email: "",
	});
	const paypalContainerRef = useRef(null);
	const izipayContainerRef = useRef(null);
	const krScriptRef = useRef(null);
	const krLoadedRef = useRef(false);
	const colorClasses = {
		primary: "bg-primary",
		secondary: "bg-secondary",
		accent: "bg-accent",
	};
	const isDirectPayment = selected.id !== "mensual";
	const yapeNumber =
		(import.meta.env.VITE_YAPE_NUMBER || "").toString().trim() ||
		"969673200";
	const plinNumber =
		(import.meta.env.VITE_PLIN_NUMBER || "").toString().trim() ||
		"969673200";
	const whatsappNumber =
		(import.meta.env.VITE_WHATSAPP_NUMBER || "").toString().trim() ||
		"+51969673200";
	const yapeQr =
		(import.meta.env.VITE_YAPE_QR_URL || "").toString().trim() ||
		"/yape.avif";
	const plinQr =
		(import.meta.env.VITE_PLIN_QR_URL || "").toString().trim() ||
		"/plin-qr.svg";

	useEffect(() => {
		// Cargar estilos de Izipay V4
		if (!document.querySelector('link[href*="kr-payment-form.neon.css"]')) {
			const link = document.createElement("link");
			link.rel = "stylesheet";
			link.href =
				"https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.neon.css";
			document.head.appendChild(link);
		}

		// Cargar script de Izipay V4
		const scriptUrl =
			"https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js";
		if (!document.querySelector(`script[src="${scriptUrl}"]`)) {
			const script = document.createElement("script");
			script.src = scriptUrl;
			script.setAttribute(
				"kr-public-key",
				import.meta.env.VITE_IZIPAY_PUBLIC_KEY ||
					"52755255:testpublickey_ezl002715016335123456789012345678901234567890" // Fallback or empty if not set
			);
			script.setAttribute("kr-post-url-success", "paid"); // Opcional, para redirección
			script.async = true;
			document.head.appendChild(script);
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
				if (!isDirectPayment) {
					setStatus("");
					if (paypalContainerRef.current) {
						paypalContainerRef.current.innerHTML =
							'<div class="text-sm text-slate-600">Disponible solo para Planes de Pago Directo</div>';
					}
					return;
				}
				if (method !== "paypal") {
					if (paypalContainerRef.current) {
						paypalContainerRef.current.innerHTML = "";
					}
					return;
				}
				await ensureSdk();
				setStatus("");
				if (paypalContainerRef.current) {
					paypalContainerRef.current.innerHTML = "";
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
										value: selected.paypalAmount,
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
			} catch {
				setStatus("No se pudo inicializar el pago");
			}
		};
		renderButtons();
		// Re-render cuando cambia el plan
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selected.id, method]);

	const mountedRef = useRef(true);

	useEffect(() => {
		mountedRef.current = true;
		return () => {
			mountedRef.current = false;
		};
	}, []);

	// Modificar la función para que no dependa del evento y sea inicialización
	const initializeIzipay = async () => {
		try {
			if (!mountedRef.current) return;

			// Limpiar cualquier estado previo
			if (window.KR) {
				await window.KR.removeForms();
			}

			if (!mountedRef.current) return;

			setStatus("Cargando pasarela de pago...");
			const res = await fetch("/api/izipay-create-payment", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					planId: selected.id,
					email: izipayData.email,
					firstName: izipayData.firstName,
					lastName: izipayData.lastName,
				}),
			});

			if (!mountedRef.current) return;

			const data = await res.json().catch(() => ({}));
			if (!res.ok) {
				setStatus(
					data?.error || "Error al conectar con el servidor de pagos"
				);
				return;
			}

			const { formToken } = data;

			if (!formToken) {
				setStatus("Respuesta inválida del servidor");
				return;
			}

			if (typeof window.KR === "undefined") {
				setStatus(
					"La pasarela de pago no se ha cargado correctamente. Recargue la página."
				);
				return;
			}

			// Inicializar formulario
			const result = await window.KR.setFormToken(formToken);
			if (mountedRef.current) {
				if (result.hasError) {
					setStatus(
						"Error al inicializar el formulario: " +
							result.errorMessage
					);
				} else {
					setStatus(""); // Limpiar estado, el formulario se muestra
				}
			}
		} catch (error) {
			console.error(error);
			if (mountedRef.current) {
				setStatus("Error al procesar el pago con Izipay");
			}
		}
	};

	// Efecto para inicializar Izipay cuando se selecciona el método
	useEffect(() => {
		let timer;
		if (method === "izipay" && isDirectPayment) {
			// Pequeño delay para asegurar que el DOM está listo y evitar condiciones de carrera
			timer = setTimeout(() => {
				initializeIzipay();
			}, 100);
		}

		// Cleanup function para limpiar formularios cuando se desmonta o cambia el método
		return () => {
			if (timer) clearTimeout(timer);
			if (window.KR) {
				// Intentar limpiar formularios de manera segura
				try {
					window.KR.removeForms();
				} catch (e) {
					console.error("Error cleaning up Izipay forms:", e);
				}
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [method, selected.id]); // Se ejecuta al cambiar método o plan

	return (
		<section id="suscribete" className="py-16 bg-slate-50">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="text-center">
					<h2 className="text-3xl font-bold">Suscríbete</h2>
					<p className="mt-2 text-slate-600">
						Elige tu plan y paga con PayPal, Izipay o QR (Yape/Plin)
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

				<div
					className={`mt-10 gap-6 ${
						isDirectPayment ? "grid md:grid-cols-4" : "hidden"
					}`}
				>
					<div className="rounded-2xl border bg-white p-6 shadow-sm">
						<div className="text-lg font-semibold">
							Método de pago
						</div>
						<div className="mt-4 flex flex-wrap gap-2">
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
							<button
								type="button"
								onClick={() => setMethod("izipay")}
								className={`px-3 py-2 rounded-lg border ${
									method === "izipay"
										? "bg-primary text-white border-primary"
										: "bg-white text-slate-700"
								}`}
							>
								Izipay (Tarjeta)
							</button>
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
						</div>
					</div>
					<div className="rounded-2xl border bg-white p-6 shadow-sm md:col-span-2 relative">
						{/* Contenedor PayPal */}
						{method === "paypal" && (
							<>
								<div className="text-lg font-semibold">
									Pagar con PayPal
								</div>
								<div className="mt-1 text-sm text-slate-600">
									Monto a pagar: {selected.currency}{" "}
									{selected.amount}
									{selected.currency !== "USD" && (
										<span className="block text-xs text-slate-500 mt-1">
											(Equivalente aprox. a $
											{selected.paypalAmount} USD para
											procesamiento)
										</span>
									)}
								</div>
								<div
									className="mt-4"
									ref={paypalContainerRef}
								/>
							</>
						)}

						{/* Contenedor Izipay - Siempre en el DOM pero oculto si no es el método activo */}
						<div
							style={{
								display: method === "izipay" ? "block" : "none",
							}}
						>
							<div className="text-lg font-semibold">
								Pagar con Tarjeta (Izipay)
							</div>
							<div className="mt-1 text-sm text-slate-600">
								Pagos procesados en PEN
							</div>
							<div className="mt-4 grid gap-4">
								<div>
									<label className="block text-sm font-medium text-slate-700 mb-1">
										Nombre
									</label>
									<input
										type="text"
										value={izipayData.firstName}
										onChange={(e) =>
											setIzipayData({
												...izipayData,
												firstName: e.target.value,
											})
										}
										className="w-full rounded-lg border-slate-200 focus:border-primary focus:ring-primary transition-colors shadow-sm py-2.5"
										placeholder="Tu nombre"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-slate-700 mb-1">
										Apellidos
									</label>
									<input
										type="text"
										value={izipayData.lastName}
										onChange={(e) =>
											setIzipayData({
												...izipayData,
												lastName: e.target.value,
											})
										}
										className="w-full rounded-lg border-slate-200 focus:border-primary focus:ring-primary transition-colors shadow-sm py-2.5"
										placeholder="Tus apellidos"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-slate-700 mb-1">
										Correo Electrónico
									</label>
									<input
										type="email"
										value={izipayData.email}
										onChange={(e) =>
											setIzipayData({
												...izipayData,
												email: e.target.value,
											})
										}
										className="w-full rounded-lg border-slate-200 focus:border-primary focus:ring-primary transition-colors shadow-sm py-2.5"
										placeholder="correo@ejemplo.com"
									/>
								</div>
							</div>
							<div
								className="mt-6 kr-embedded"
								ref={izipayContainerRef}
							/>
						</div>

						{/* Contenedor QR */}
						{method === "qr" && (
							<>
								<div className="text-lg font-semibold">
									Pagar con QR (Yape/Plin)
								</div>
								<div className="mt-4 grid md:grid-cols-2 gap-4">
									<div className="rounded-lg border p-4">
										<div className="font-medium">Yape</div>
										<div className="mt-2">
											{yapeQr ? (
												<img
													src={yapeQr}
													alt="QR Yape"
													className="w-full rounded"
												/>
											) : (
												<div className="h-40 flex items-center justify-center text-sm text-slate-500">
													QR de Yape no configurado
												</div>
											)}
										</div>
										<div className="mt-2 text-sm text-slate-700">
											Número: {yapeNumber}
										</div>
									</div>
									<div className="rounded-lg border p-4">
										<div className="font-medium">Plin</div>
										<div className="mt-2">
											{plinQr ? (
												<img
													src={plinQr}
													alt="QR Plin"
													className="w-full rounded"
												/>
											) : (
												<div className="h-40 flex items-center justify-center text-sm text-slate-500">
													QR de Plin no configurado
												</div>
											)}
										</div>
										<div className="mt-2 text-sm text-slate-700">
											Número: {plinNumber}
										</div>
									</div>
								</div>
								<button
									type="button"
									className="mt-4 rounded-lg bg-green-600 text-white px-5 py-3 hover:bg-dark/90 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md"
									onClick={() => {
										const msg = encodeURIComponent(
											`Hola, envié mi comprobante de pago por QR para el ${selected.name}.`
										);
										const waUrl = `https://wa.me/${whatsappNumber.replace(
											/[^+\d]/g,
											""
										)}?text=${msg}`;
										window.open(waUrl, "_blank");
									}}
								>
									Enviar voucher por WhatsApp
								</button>
							</>
						)}
					</div>
					<div className="hidden"></div>
				</div>

				<div
					className={`mt-10 gap-6 ${
						!isDirectPayment ? "grid md:grid-cols-2" : "hidden"
					}`}
				>
					<div className="rounded-2xl border bg-white p-6 shadow-sm">
						<div className="text-lg font-semibold">
							Suscríbete en nuestras redes
						</div>
						<div className="mt-1 text-sm text-slate-600">
							Plan Mensual disponible vía redes sociales
						</div>
						<div className="mt-4 grid gap-3">
							<a
								href="https://www.youtube.com/channel/UCzxP2uldBPoaOdS-vhuGYzg/join"
								target="_blank"
								rel="noopener"
								className="inline-flex items-center justify-center rounded-lg bg-primary text-white px-5 py-3 hover:bg-primary/90 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md"
							>
								YouTube
							</a>
							<a
								href="https://www.facebook.com/EasyEnglishTv.1"
								target="_blank"
								rel="noopener"
								className="inline-flex items-center justify-center rounded-lg bg-primary text-white px-5 py-3 hover:bg-primary/90 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md"
							>
								Facebook
							</a>
							<a
								href="https://www.tiktok.com/@easyenglishtvtiktok?is_from_webapp=1&sender_device=pc"
								target="_blank"
								rel="noopener"
								className="inline-flex items-center justify-center rounded-lg bg-primary text-white px-5 py-3 hover:bg-primary/90 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md"
							>
								TikTok
							</a>
						</div>
					</div>
					<div className="rounded-2xl border bg-white p-6 shadow-sm">
						<div className="text-lg font-semibold">Información</div>
						<div className="mt-1 text-sm text-slate-600">
							Selecciona Plan Único o VIP para pagar con PayPal o
							Izipay
						</div>
					</div>
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
