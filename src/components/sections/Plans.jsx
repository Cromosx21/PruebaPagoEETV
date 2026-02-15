import { useCurrency } from "../../context/CurrencyContext";

const CheckIcon = ({ colorClass = "text-primary" }) => (
	<svg
		className={`w-5 h-5 flex-shrink-0 ${colorClass}`}
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M5 13l4 4L19 7"
		/>
	</svg>
);

const CrossIcon = () => (
	<svg
		className="w-5 h-5 text-slate-300 flex-shrink-0"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M6 18L18 6M6 6l12 12"
		/>
	</svg>
);

export default function Plans() {
	const { formatPrice } = useCurrency();

	return (
		<section id="planes" className="py-16 bg-slate-50">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<h2 className="text-3xl font-bold">Elige tu Plan</h2>
					<p className="mt-2 text-slate-600">
						Invierte en tu futuro con nuestros planes diseñados para
						ti
					</p>
				</div>

				<div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto items-start">
					{/* Plan Mensual */}
					<div className="rounded-2xl border bg-white p-8 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
						<h3 className="text-2xl font-bold">Plan Mensual</h3>
						<div className="mt-4 mb-6">
							<span className="text-4xl font-bold">
								{formatPrice(6)}
							</span>
							<span className="text-slate-500 ml-2">/ mes</span>
						</div>
						<p className="text-slate-600 mb-6 font-medium">
							INGLÉS CON AMOR (Gramática)
						</p>

						<ul className="space-y-4 mb-8 flex-grow">
							<li className="flex gap-3">
								<CheckIcon colorClass="text-primary" />
								<span className="text-sm text-slate-700">
									Acceso a comunidad
								</span>
							</li>
							<li className="flex gap-3">
								<CheckIcon colorClass="text-primary" />
								<span className="text-sm text-slate-700">
									Material de Gramática
								</span>
							</li>
							<li className="flex gap-3">
								<CrossIcon />
								<span className="text-sm text-slate-400">
									Material de Vocabulario
								</span>
							</li>
							<li className="flex gap-3">
								<CrossIcon />
								<span className="text-sm text-slate-400">
									Material de Speaking
								</span>
							</li>
							<li className="flex gap-3">
								<CheckIcon />
								<span className="text-sm text-slate-700">
									Clases de Gramática
								</span>
							</li>
							<li className="flex gap-3">
								<CrossIcon />
								<span className="text-sm text-slate-400">
									Clases de Speaking
								</span>
							</li>
							<li className="flex gap-3">
								<CrossIcon />
								<span className="text-sm text-slate-400">
									Clases de Vocabulario
								</span>
							</li>
						</ul>

						<a
							href="https://www.facebook.com/EasyEnglishTv.1"
							target="_blank"
							rel="noreferrer"
							className="w-full block text-center rounded-lg border-2 border-primary text-primary px-5 py-3 hover:bg-primary/5 transition-all duration-200 font-medium"
						>
							Suscribirme en Facebook
						</a>
					</div>

					{/* Plan ORO (Nuevo Intermedio) */}
					<div className="rounded-2xl border transition-shadow duration-200 bg-white p-8 shadow-sm flex flex-col h-full hover:shadow-md ">
						<h3 className="text-2xl font-bold">Plan ORO</h3>
						<div className="mt-4 mb-6">
							<span className="text-4xl font-bold">
								{formatPrice(8)}
							</span>
							<span className="text-slate-500 ml-2">/ mes</span>
						</div>
						<p className="text-slate-600 mb-6 font-medium">
							Gramática + Vocabulario + Speaking
						</p>

						<ul className="space-y-4 mb-8 flex-grow">
							<li className="flex gap-3">
								<CheckIcon colorClass="text-accent" />
								<span className="text-sm text-slate-700">
									Acceso a la comunidad
								</span>
							</li>
							<li className="flex gap-3">
								<CheckIcon colorClass="text-accent" />
								<span className="text-sm text-slate-700">
									Material de Gramática
								</span>
							</li>
							<li className="flex gap-3">
								<CheckIcon colorClass="text-accent" />
								<span className="text-sm text-slate-700">
									Material de Vocabulario
								</span>
							</li>
							<li className="flex gap-3">
								<CheckIcon colorClass="text-accent" />
								<span className="text-sm text-slate-700">
									Material de Speaking
								</span>
							</li>
							<li className="flex gap-3">
								<CheckIcon colorClass="text-accent" />
								<span className="text-sm text-slate-700">
									Clases de Gramática
								</span>
							</li>
							<li className="flex gap-3">
								<CheckIcon colorClass="text-accent" />
								<span className="text-sm text-slate-700">
									Clases de Speaking
								</span>
							</li>
							<li className="flex gap-3">
								<CheckIcon colorClass="text-accent" />
								<span className="text-sm text-slate-700">
									Clases de Vocabulario
								</span>
							</li>
							<li className="flex gap-3">
								<CheckIcon colorClass="text-accent" />
								<span className="text-sm text-slate-700">
									Guías y recursos descargables
								</span>
							</li>
							<li className="flex gap-3">
								<CrossIcon />
								<span className="text-sm text-slate-400">
									Acceso ilimitado de por vida
								</span>
							</li>
						</ul>

						<a
							href="https://www.youtube.com/channel/UCzxP2uldBPoaOdS-vhuGYzg/join"
							target="_blank"
							rel="noreferrer"
							className="w-full block text-center rounded-lg border-2 border-accent text-accent px-5 py-3 hover:border-accent hover:text-accent hover:bg-accent/5 transition-all duration-200 font-medium"
						>
							Obtener Plan ORO en YouTube
						</a>
					</div>

					{/* Plan Único (Más Popular) */}
					<div className=" relative rounded-2xl border-2 border-secondary bg-white p-8 shadow-lg flex flex-col h-full hover:shadow-xl transition-shadow md:-mt-4 md:mb-4">
						<div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
							<span className="bg-secondary text-white px-4 py-1 rounded-full text-sm font-semibold shadow-sm">
								Más Popular
							</span>
						</div>
						<h3 className="text-2xl font-bold">Plan Único</h3>
						<div className="mt-4 mb-6">
							<span className="text-4xl font-bold">
								{formatPrice(50)}
							</span>
							<span className="text-slate-500 ml-2">
								Pago único
							</span>
						</div>
						<p className="text-slate-600 mb-6 font-medium">
							INGLÉS CON AMOR (Todo incluido)
						</p>

						<ul className="space-y-4 mb-8 flex-grow">
							<li className="flex gap-3">
								<CheckIcon colorClass="text-secondary" />
								<span className="text-sm font-medium text-slate-800">
									Acceso a la comunidad
								</span>
							</li>
							<li className="flex gap-3">
								<CheckIcon colorClass="text-secondary" />
								<span className="text-sm font-medium text-slate-800">
									Material completo (Gramática, Vocabulario,
									Speaking)
								</span>
							</li>
							<li className="flex gap-3">
								<CheckIcon colorClass="text-secondary" />
								<span className="text-sm font-medium text-slate-800">
									Acceso a todas las clases
								</span>
							</li>
							<li className="flex gap-3">
								<CheckIcon colorClass="text-secondary" />
								<span className="text-sm font-medium text-slate-800">
									Acceso ilimitado de por vida
								</span>
							</li>
							<li className="flex gap-3">
								<CheckIcon colorClass="text-secondary" />
								<span className="text-sm font-medium text-slate-800">
									Actualizaciones futuras gratis
								</span>
							</li>
							<li className="flex gap-3">
								<CheckIcon colorClass="text-secondary" />
								<span className="text-sm font-medium text-slate-800">
									Sin mensualidades
								</span>
							</li>
							<li className="flex gap-3">
								<CheckIcon colorClass="text-secondary" />
								<span className="text-sm font-medium text-slate-800">
									Guías y recursos descargables
								</span>
							</li>
						</ul>

						<a
							href="#subscribe"
							className="w-full block text-center rounded-lg bg-secondary text-white px-5 py-3 hover:bg-secondary/90 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md font-medium"
						>
							Comprar ahora
						</a>
					</div>
				</div>
			</div>
		</section>
	);
}
