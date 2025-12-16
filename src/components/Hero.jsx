export default function Hero() {
	return (
		<section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-light">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
				<div className="grid lg:grid-cols-2 gap-10 items-center">
					<div>
						<h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
							Aprende Inglés con Jessica de manera chévere y
							gratuita
						</h1>
						<p className="mt-4 text-lg text-slate-600">
							Disfruta de clases en vivo y adquiere material
							exclusivo para potenciar tu aprendizaje.
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
						<div className="rounded-2xl bg-white shadow-xl p-6">
							<div className="grid grid-cols-3 gap-4">
								<div className="aspect-square rounded-lg bg-primary/20"></div>
								<div className="aspect-square rounded-lg bg-secondary/20"></div>
								<div className="aspect-square rounded-lg bg-accent/20"></div>
								<div className="aspect-square rounded-lg bg-secondary/20"></div>
								<div className="aspect-square rounded-lg bg-accent/20"></div>
								<div className="aspect-square rounded-lg bg-primary/20"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
