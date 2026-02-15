const Privacy = () => {
	return (
		<section className="bg-light">
			<div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
				<span className="inline-flex items-center rounded-full bg-secondary/10 text-secondary text-xs font-semibold px-3 py-1 uppercase tracking-wide">
					Privacidad
				</span>
				<h1 className="mt-4 text-3xl md:text-4xl font-extrabold text-slate-900">
					Política de privacidad
				</h1>
				<p className="mt-3 text-slate-600 text-sm md:text-base">
					Tu información es importante. Por eso te explicamos de forma
					directa qué datos recolectamos, para qué los usamos y cómo
					los cuidamos.
				</p>

				<div className="mt-10 grid gap-6">
					<div className="rounded-2xl border bg-white p-6 shadow-sm">
						<h2 className="text-lg md:text-xl font-bold text-slate-900">
							1. Datos que podemos recopilar
						</h2>
						<ul className="mt-2 space-y-2 text-sm md:text-base text-slate-600 list-disc list-inside">
							<li>Nombre y apellidos.</li>
							<li>Correo electrónico de contacto.</li>
							<li>
								País de residencia y zona horaria para adaptar
								horarios y precios.
							</li>
							<li>
								Información básica de uso de la web para mejorar
								la experiencia.
							</li>
						</ul>
					</div>

					<div className="rounded-2xl border bg-white p-6 shadow-sm">
						<h2 className="text-lg md:text-xl font-bold text-slate-900">
							2. Para qué usamos tu información
						</h2>
						<ul className="mt-2 space-y-2 text-sm md:text-base text-slate-600 list-disc list-inside">
							<li>
								Para gestionar tu acceso a clases y contenido
								exclusivo.
							</li>
							<li>
								Para enviarte recordatorios, novedades y
								actualizaciones relacionadas con el curso.
							</li>
							<li>
								Para mejorar la plataforma según el uso real de
								los estudiantes.
							</li>
						</ul>
					</div>

					<div className="rounded-2xl border bg-white p-6 shadow-sm">
						<h2 className="text-lg md:text-xl font-bold text-slate-900">
							3. Cómo protegemos tus datos
						</h2>
						<p className="mt-2 text-sm md:text-base text-slate-600">
							Utilizamos proveedores de pago y herramientas
							tecnológicas de confianza. No vendemos tu
							información personal y la tratamos con la misma
							seriedad con la que cuidamos el contenido que
							recibes.
						</p>
					</div>

					<div className="rounded-2xl border bg-slate-900 text-slate-50 p-6 shadow-sm">
						<h2 className="text-lg md:text-xl font-bold">
							4. Tus derechos
						</h2>
						<p className="mt-2 text-sm md:text-base">
							Puedes pedirnos que actualicemos o eliminemos tu
							información personal cuando lo necesites, salvo
							datos que debamos conservar por motivos legales o
							contables. Si tienes dudas, escríbenos y lo
							revisamos contigo.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Privacy;

