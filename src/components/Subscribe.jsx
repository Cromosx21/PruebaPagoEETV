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
		"/yape-qr.png";
	const plinQr =
		(import.meta.env.VITE_PLIN_QR_URL || "").toString().trim() ||
		"/plin-qr.svg";

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

	useEffect(() => {
		const initIzipay = async () => {
			try {
				if (!isUnico || method !== "izipay") {
					if (izipayContainerRef.current) {
						izipayContainerRef.current.innerHTML = "";
					}
					return;
				}
				setStatus("");
				const res = await fetch("/api/izipay-create-payment", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						planId: selected.id,
					}),
				});
				const data = await res.json().catch(() => ({}));
				if (!res.ok) {
					const base =
						data?.error || "No se pudo iniciar el pago con Izipay";
					const more = data?.detail?.message
						? `: ${data.detail.message}`
						: "";
					setStatus(base + more);
					return;
				}
				const formToken = data?.formToken;
				const publicKey = data?.publicKey;
				if (!formToken || !publicKey) {
					setStatus("Respuesta inválida del servidor de pagos");
					return;
				}
				if (izipayContainerRef.current) {
					izipayContainerRef.current.innerHTML = "";
					const embedded = document.createElement("div");
					embedded.className = "kr-embedded";
					embedded.setAttribute("kr-form-token", formToken);
					const pan = document.createElement("div");
					pan.className = "kr-pan";
					const expiry = document.createElement("div");
					expiry.className = "kr-expiry";
					const cvv = document.createElement("div");
					cvv.className = "kr-security-code";
					const firstName = document.createElement("div");
					firstName.className = "kr-first-name";
					const lastName = document.createElement("div");
					lastName.className = "kr-last-name";
					const emailField = document.createElement("div");
					emailField.className = "kr-email";
					const btn = document.createElement("button");
					btn.className = "kr-payment-button";
					const err = document.createElement("div");
					err.className = "kr-form-error";
					embedded.appendChild(pan);
					embedded.appendChild(expiry);
					embedded.appendChild(cvv);
					embedded.appendChild(firstName);
					embedded.appendChild(lastName);
					embedded.appendChild(emailField);
					embedded.appendChild(btn);
					embedded.appendChild(err);
					izipayContainerRef.current.appendChild(embedded);
					const existingCss = document.querySelector(
						'link[href="https://static.micuentaweb.pe/static/js/krypton-client/V4.0/ext/classic-reset.css"]'
					);
					if (!existingCss) {
						const css = document.createElement("link");
						css.rel = "stylesheet";
						css.href =
							"https://static.micuentaweb.pe/static/js/krypton-client/V4.0/ext/classic-reset.css";
						document.head.appendChild(css);
					}
					const ensureScriptLoaded = () =>
						new Promise((resolve, reject) => {
							if (krLoadedRef.current && window.KR) {
								return resolve();
							}
							if (!krScriptRef.current) {
								const script = document.createElement("script");
								script.src =
									"https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js";
								script.setAttribute("kr-public-key", publicKey);
								script.setAttribute(
									"kr-post-url-success",
									"/api/izipay-success"
								);
								script.setAttribute(
									"kr-get-url-refused",
									"/?payment=refused"
								);
								script.setAttribute("kr-language", "es-ES");
								script.onload = () => {
									krLoadedRef.current = true;
									resolve();
								};
								script.onerror = () => {
									reject(
										new Error(
											"No se pudo cargar la pasarela de Izipay"
										)
									);
								};
								document.head.appendChild(script);
								krScriptRef.current = script;
								setStatus("Cargando pasarela de Izipay...");
							} else {
								if (krLoadedRef.current && window.KR) {
									resolve();
								} else {
									krScriptRef.current.onload = () => {
										krLoadedRef.current = true;
										resolve();
									};
									krScriptRef.current.onerror = () => {
										reject(
											new Error(
												"No se pudo cargar la pasarela de Izipay"
											)
										);
									};
								}
							}
						});
					await ensureScriptLoaded();
					if (
						window.KR &&
						typeof window.KR.setFormToken === "function"
					) {
						window.KR.setFormToken(formToken);
						setStatus("");
					} else {
						setStatus("Izipay no inicializado correctamente");
					}
				}
			} catch {
				setStatus("Error interpretando respuesta del pago");
			}
		};
		initIzipay();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selected.id, method]);

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
