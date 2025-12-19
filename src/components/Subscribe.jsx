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
		amount: "50.00",
		currency: "USD",
		color: "secondary",
	},
];

export default function Subscribe() {
	const [selected, setSelected] = useState(PLANS[0]);
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
	const colorClasses = { primary: "bg-primary", secondary: "bg-secondary" };
	const isUnico = selected.id === "unico";
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
		const scriptUrl =
			import.meta.env.VITE_IZIPAY_SDK_URL ||
			"https://sandbox-checkout.izipay.pe/payments/v1/js/index.js";
		if (!document.querySelector(`script[src="${scriptUrl}"]`)) {
			const script = document.createElement("script");
			script.src = scriptUrl;
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
				if (!isUnico) {
					setStatus("");
					if (paypalContainerRef.current) {
						paypalContainerRef.current.innerHTML =
							'<div class="text-sm text-slate-600">Disponible solo para Plan Único</div>';
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
			} catch {
				setStatus("No se pudo inicializar el pago");
			}
		};
		renderButtons();
		// Re-render cuando cambia el plan
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selected.id, method]);

	const handleIzipayPay = async () => {
		if (
			!izipayData.firstName ||
			!izipayData.lastName ||
			!izipayData.email
		) {
			setStatus("Por favor complete todos los campos requeridos");
			return;
		}

		try {
			setStatus("Iniciando pago con Izipay...");
			const res = await fetch("/api/izipay-create-payment", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					planId: selected.id,
					email: izipayData.email,
				}),
			});
			const data = await res.json().catch(() => ({}));
			if (!res.ok) {
				setStatus(
					data?.error || "Error al conectar con el servidor de pagos"
				);
				return;
			}

			const {
				formToken,
				publicKey,
				merchantCode,
				orderId,
				transactionId,
				dateTimeTransaction,
				amount,
				currency,
			} = data;

			if (!formToken || !publicKey) {
				setStatus("Respuesta inválida del servidor");
				return;
			}

			if (typeof window.Izipay !== "function") {
				setStatus(
					"La pasarela de Izipay no está cargada correctamente"
				);
				return;
			}

			const iziConfig = {
				transactionId: transactionId,
				action: "pay",
				merchantCode: merchantCode,
				order: {
					orderNumber: orderId,
					currency: currency || "PEN",
					amount: amount,
					processType: "AT",
					merchantBuyerId: merchantCode,
					dateTimeTransaction: dateTimeTransaction,
				},
				billing: {
					firstName: izipayData.firstName,
					lastName: izipayData.lastName,
					email: izipayData.email,
				},
				render: {
					typeForm: "pop-up",
				},
			};

			const checkout = new window.Izipay({ config: iziConfig });
			checkout.LoadForm({
				authorization: formToken,
				keyRSA: publicKey,
				callbackResponse: (response) => {
					console.log("Izipay response:", response);
					if (response.code === "00" || response.status === "PAID") {
						setStatus("Pago realizado con éxito");
					} else {
						setStatus(
							"El pago no se completó o fue rechazado: " +
								(response.message || "")
						);
					}
				},
			});
		} catch (error) {
			console.error(error);
			setStatus("Error al procesar el pago con Izipay");
		}
	};

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

				{isUnico ? (
					<div className="mt-10 grid md:grid-cols-4 gap-6">
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
						<div className="rounded-2xl border bg-white p-6 shadow-sm md:col-span-2">
							{method === "paypal" && (
								<>
									<div className="text-lg font-semibold">
										Pagar con PayPal
									</div>
									<div className="mt-1 text-sm text-slate-600">
										Pagos procesados en USD
									</div>
									<div
										className="mt-4"
										ref={paypalContainerRef}
									/>
								</>
							)}
							{method === "izipay" && (
								<>
									<div className="text-lg font-semibold">
										Pagar con Tarjeta (Izipay)
									</div>
									<div className="mt-1 text-sm text-slate-600">
										Pagos procesados en PEN
									</div>
									<div className="mt-4 grid gap-4">
										<div>
											<label className="block text-sm font-medium text-slate-700">
												Nombre
											</label>
											<input
												type="text"
												value={izipayData.firstName}
												onChange={(e) =>
													setIzipayData({
														...izipayData,
														firstName:
															e.target.value,
													})
												}
												className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
												placeholder="Tu nombre"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-slate-700">
												Apellidos
											</label>
											<input
												type="text"
												value={izipayData.lastName}
												onChange={(e) =>
													setIzipayData({
														...izipayData,
														lastName:
															e.target.value,
													})
												}
												className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
												placeholder="Tus apellidos"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-slate-700">
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
												className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
												placeholder="correo@ejemplo.com"
											/>
										</div>
										<button
											type="button"
											onClick={handleIzipayPay}
											className="mt-2 w-full rounded-lg bg-primary text-white px-5 py-3 hover:bg-primary/90 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md font-semibold"
										>
											Pagar con Tarjeta
										</button>
									</div>
									<div
										className="mt-4"
										ref={izipayContainerRef}
									/>
								</>
							)}
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
												{yapeQr ? (
													<img
														src={yapeQr}
														alt="QR Yape"
														className="w-full rounded"
													/>
												) : (
													<div className="h-40 flex items-center justify-center text-sm text-slate-500">
														QR de Yape no
														configurado
													</div>
												)}
											</div>
											<div className="mt-2 text-sm text-slate-700">
												Número: {yapeNumber}
											</div>
										</div>
										<div className="rounded-lg border p-4">
											<div className="font-medium">
												Plin
											</div>
											<div className="mt-2">
												{plinQr ? (
													<img
														src={plinQr}
														alt="QR Plin"
														className="w-full rounded"
													/>
												) : (
													<div className="h-40 flex items-center justify-center text-sm text-slate-500">
														QR de Plin no
														configurado
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
				) : (
					<div className="mt-10 grid md:grid-cols-2 gap-6">
						<div className="rounded-2xl border bg-white p-6 shadow-sm">
							<div className="text-lg font-semibold">
								Suscríbete en nuestras redes
							</div>
							<div className="mt-1 text-sm text-slate-600">
								Plan Mensual disponible vía redes sociales
							</div>
							<div className="mt-4 grid gap-3">
								<a
									href="https://www.youtube.com"
									target="_blank"
									rel="noopener"
									className="inline-flex items-center justify-center rounded-lg bg-primary text-white px-5 py-3 hover:bg-primary/90 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md"
								>
									YouTube
								</a>
								<a
									href="https://www.facebook.com"
									target="_blank"
									rel="noopener"
									className="inline-flex items-center justify-center rounded-lg bg-primary text-white px-5 py-3 hover:bg-primary/90 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md"
								>
									Facebook
								</a>
								<a
									href="https://www.tiktok.com"
									target="_blank"
									rel="noopener"
									className="inline-flex items-center justify-center rounded-lg bg-primary text-white px-5 py-3 hover:bg-primary/90 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md"
								>
									TikTok
								</a>
							</div>
						</div>
						<div className="rounded-2xl border bg-white p-6 shadow-sm">
							<div className="text-lg font-semibold">
								Información
							</div>
							<div className="mt-1 text-sm text-slate-600">
								Selecciona Plan Único para pagar con PayPal o
								Izipay
							</div>
						</div>
					</div>
				)}

				{status && (
					<div className="mt-6 rounded-lg border bg-white p-4 text-sm">
						{status}
					</div>
				)}
			</div>
		</section>
	);
}
