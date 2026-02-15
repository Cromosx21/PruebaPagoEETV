export default function Hero() {
	return (
		<section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-light">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
				<div className="grid lg:grid-cols-2 gap-10 items-center">
					<div>
						<h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
							Domina el idioma con
							<span className="text-secondary uppercase">
								{" "}
								Inglés con Amor
							</span>
							, el método más completo y dinámico
						</h1>
						<p className="mt-4 text-lg text-slate-600">
							Aprende en vivo y accede a material exclusivo
							diseñado para acelerar tu fluidez desde el primer
							día.
						</p>
						<div className="mt-8 flex flex-wrap gap-3">
							<a
								href="#horario"
								className="rounded-lg bg-primary text-white px-5 py-3 hover:bg-primary/90 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md"
							>
								Empezar ahora
							</a>
							<a
								href="#planes"
								className="rounded-lg border border-dark px-5 py-3 hover:bg-slate-100 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md"
							>
								Ver planes
							</a>
						</div>
						<div className="mt-8 flex items-center gap-6 text-sm text-slate-600">
							<div className="flex items-center gap-2">
								<span className="h-3 w-3 rounded-full bg-secondary"></span>
								Clases gratuitas
							</div>
							<div className="flex items-center gap-2">
								<span className="h-3 w-3 rounded-full bg-accent"></span>
								Material exclusivo
							</div>
						</div>
					</div>
					<div className="relative">
						<div className="border-b-8 border-primary ">
							<img
								src="./Hero-jessica.png"
								alt="Jessica enseñando inglés en EasyEnglishTV"
								loading="eager"
								width="1200"
								height="800"
								className="w-full h-auto"
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
