const Terms = () => {
	return (
		<section className="bg-light">
			<div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
				<span className="inline-flex items-center rounded-full bg-primary/10 text-primary text-xs font-semibold px-3 py-1 uppercase tracking-wide">
					Términos de uso
				</span>
				<h1 className="mt-4 text-3xl md:text-4xl font-extrabold text-slate-900">
					Términos y condiciones de EasyEnglishTV
				</h1>
				<p className="mt-3 text-slate-600 text-sm md:text-base">
					Queremos que tu experiencia aprendiendo inglés sea clara y
					tranquila. Aquí te contamos, en un lenguaje sencillo, cómo
					funciona el uso de esta página y de nuestros servicios.
				</p>

				<div className="mt-10 grid gap-6">
					<div className="rounded-2xl border bg-white p-6 shadow-sm">
						<h2 className="text-lg md:text-xl font-bold text-slate-900">
							1. Quiénes somos
						</h2>
						<p className="mt-2 text-sm md:text-base text-slate-600">
							EasyEnglishTV es un proyecto educativo digital que
							ayuda a personas de habla hispana a mejorar su
							inglés con clases en vivo, material descargable y
							contenido exclusivo.
						</p>
					</div>

					<div className="rounded-2xl border bg-white p-6 shadow-sm">
						<h2 className="text-lg md:text-xl font-bold text-slate-900">
							2. Uso responsable de la plataforma
						</h2>
						<ul className="mt-2 space-y-2 text-sm md:text-base text-slate-600 list-disc list-inside">
							<li>
								Usa el contenido solo para tu aprendizaje
								personal, no para revenderlo ni compartirlo de
								forma masiva.
							</li>
							<li>
								Mantén siempre un lenguaje respetuoso en los
								chats, clases y comunidades.
							</li>
							<li>
								No uses nuestros recursos para actividades
								ilegales, fraudulentas o que dañen a otras
								personas.
							</li>
						</ul>
					</div>

					<div className="rounded-2xl border bg-white p-6 shadow-sm">
						<h2 className="text-lg md:text-xl font-bold text-slate-900">
							3. Pagos, suscripciones y accesos
						</h2>
						<ul className="mt-2 space-y-2 text-sm md:text-base text-slate-600 list-disc list-inside">
							<li>
								Los precios y beneficios de cada plan se muestran
								siempre antes de realizar el pago.
							</li>
							<li>
								Al completar tu suscripción aceptas estos
								términos y confirmas que la información
								proporcionada es real.
							</li>
							<li>
								El acceso al material es personal e
								intransferible. Evita compartir cuentas o datos
								de acceso.
							</li>
						</ul>
					</div>

					<div className="rounded-2xl border bg-white p-6 shadow-sm">
						<h2 className="text-lg md:text-xl font-bold text-slate-900">
							4. Cambios en el contenido y en los términos
						</h2>
						<p className="mt-2 text-sm md:text-base text-slate-600">
							Podemos actualizar las clases, beneficios de los
							planes o estos términos para mejorar el servicio.
							Siempre respetaremos los derechos básicos de los
							estudiantes y mantendremos una comunicación clara
							en nuestros canales oficiales.
						</p>
					</div>

					<div className="rounded-2xl border bg-slate-900 text-slate-50 p-6 shadow-sm">
						<h2 className="text-lg md:text-xl font-bold">
							5. Dudas o soporte
						</h2>
						<p className="mt-2 text-sm md:text-base">
							Si algo no te queda claro o necesitas ayuda con tu
							suscripción, puedes escribirnos a través de nuestros
							canales oficiales. Nuestro objetivo es que estudies
							acompañado, no solo.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Terms;

