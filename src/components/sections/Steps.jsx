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

export default function Steps() {
	return (
		<section className="py-16" id="beneficios">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="text-center">
					<h2 className="text-3xl font-bold">Cómo Funciona</h2>
					<p className="mt-2 text-slate-600">
						Sigue estos pasos para obtener tu material exclusivo
					</p>
				</div>
				<div className="mt-12">
					<div className="relative flex flex-col md:flex-row md:items-start md:justify-between gap-10 md:gap-8">
						<div className="hidden md:block w-4/5 absolute left-1/2 -translate-x-1/2 right-0 top-7 h-0.5 border-t-4 border-dashed border-slate-300"></div>

						<div className="relative flex-1 flex flex-col items-center text-center">
							<div className="flex items-center justify-center">
								<div className="flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-md">
									<div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-200 text-white text-2xl">
										📋
									</div>
								</div>
							</div>
							<div className="mt-4">
								<h3 className="text-lg sm:text-xl font-semibold">
									1. Elige tu Plan
								</h3>
								<p className="mt-2 text-slate-600 max-w-xs mx-auto">
									Selecciona la opción que mejor se adapte a
									tus necesidades de aprendizaje.
								</p>
							</div>
						</div>

						<div className="relative flex-1 flex flex-col items-center text-center">
							<div className="flex items-center justify-center">
								<div className="flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-md">
									<div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-200 text-white text-2xl">
										<CheckIcon colorClass="text-primary" />
									</div>
								</div>
							</div>
							<div className="mt-4">
								<h3 className="text-lg sm:text-xl font-semibold">
									2. Validación de datos
								</h3>
								<p className="mt-2 text-slate-600 max-w-xs mx-auto">
									Completa el pago seguro y verifica tu correo
									electrónico para obtener el acceso.
								</p>
							</div>
						</div>

						<div className="relative flex-1 flex flex-col items-center text-center">
							<div className="flex items-center justify-center">
								<div className="flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-md">
									<div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-200 text-white text-2xl">
										📘
									</div>
								</div>
							</div>
							<div className="mt-4">
								<h3 className="text-lg sm:text-xl font-semibold">
									3. Recibe tu material
								</h3>
								<p className="mt-2 text-slate-600 max-w-xs mx-auto">
									Accede a las clases en vivo y descarga tu
									material PDF en tu correo.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
