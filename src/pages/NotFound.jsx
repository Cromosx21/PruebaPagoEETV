const NotFound = () => {
	return (
		<section className="min-h-[60vh] bg-gradient-to-b from-primary/10 via-light to-secondary/10 flex items-center">
			<div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 text-center">
				<p className="text-sm font-semibold tracking-wide text-primary uppercase">
					Error 404
				</p>
				<h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-slate-900">
					Esta página parece estar practicando inglés en otro lugar
				</h1>
				<p className="mt-4 text-slate-600 text-sm md:text-base max-w-2xl mx-auto">
					No encontramos la ruta que estás buscando. Puede que el
					enlace esté mal escrito o que el contenido haya cambiado de
					lugar. Mientras tanto, puedes volver al inicio y seguir
					aprovechando las clases y materiales.
				</p>
				<div className="mt-8 flex flex-wrap justify-center gap-4">
					<a
						href="/"
						className="rounded-lg bg-primary text-white px-6 py-3 text-sm md:text-base font-semibold hover:bg-primary/90 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md"
					>
						Ir al inicio
					</a>
					<a
						href="/#planes"
						className="rounded-lg border border-slate-900 px-6 py-3 text-sm md:text-base font-semibold text-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md"
					>
						Ver planes disponibles
					</a>
				</div>
			</div>
		</section>
	);
};

export default NotFound;

