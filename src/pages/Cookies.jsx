const Cookies = () => {
	return (
		<section className="bg-light">
			<div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
				<span className="inline-flex items-center rounded-full bg-accent/10 text-accent text-xs font-semibold px-3 py-1 uppercase tracking-wide">
					Cookies
				</span>
				<h1 className="mt-4 text-3xl md:text-4xl font-extrabold text-slate-900">
					Política de cookies
				</h1>
				<p className="mt-3 text-slate-600 text-sm md:text-base">
					Las cookies nos ayudan a que la web funcione mejor, sea más
					rápida y se sienta más personalizada para ti.
				</p>

				<div className="mt-10 grid gap-6">
					<div className="rounded-2xl border bg-white p-6 shadow-sm">
						<h2 className="text-lg md:text-xl font-bold text-slate-900">
							1. Qué es una cookie
						</h2>
						<p className="mt-2 text-sm md:text-base text-slate-600">
							Es un pequeño archivo que se guarda en tu navegador
							y que recuerda cierta información para que no tengas
							que repetirla cada vez que entras a la página.
						</p>
					</div>

					<div className="rounded-2xl border bg-white p-6 shadow-sm">
						<h2 className="text-lg md:text-xl font-bold text-slate-900">
							2. Tipos de cookies que podemos usar
						</h2>
						<ul className="mt-2 space-y-2 text-sm md:text-base text-slate-600 list-disc list-inside">
							<li>
								Cookies necesarias para que la web funcione
								(correcto cargado de páginas, seguridad, etc.).
							</li>
							<li>
								Cookies de preferencias, para recordar idioma o
								ajustes básicos.
							</li>
							<li>
								Cookies de análisis, para entender qué secciones
								se usan más y seguir mejorándolas.
							</li>
						</ul>
					</div>

					<div className="rounded-2xl border bg-white p-6 shadow-sm">
						<h2 className="text-lg md:text-xl font-bold text-slate-900">
							3. Cómo puedes gestionarlas
						</h2>
						<p className="mt-2 text-sm md:text-base text-slate-600">
							Desde la configuración de tu navegador puedes borrar
							cookies o desactivarlas. Ten en cuenta que, si lo
							haces, algunas partes de la web pueden dejar de
							funcionar como esperas.
						</p>
					</div>

					<div className="rounded-2xl border bg-slate-900 text-slate-50 p-6 shadow-sm">
						<h2 className="text-lg md:text-xl font-bold">
							4. Mantendremos esto actualizado
						</h2>
						<p className="mt-2 text-sm md:text-base">
							Si añadimos nuevas herramientas o cambiamos cómo
							usamos las cookies, actualizaremos esta sección para
							que siempre sepas qué está pasando.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Cookies;

