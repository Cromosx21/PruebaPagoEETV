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
				<div className="mt-10 grid md:grid-cols-3 gap-6">
					<div className="rounded-xl border bg-white p-6 shadow-sm">
						<div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
							1
						</div>
						<h3 className="mt-4 text-xl font-semibold">
							Elige tu Plan
						</h3>
						<p className="mt-2 text-slate-600">
							Selecciona Plan Mensual o Plan Único y realiza tu
							suscripción.
						</p>
					</div>
					<div className="rounded-xl border bg-white p-6 shadow-sm">
						<div className="h-10 w-10 rounded-full bg-secondary text-white flex items-center justify-center font-bold">
							2
						</div>
						<h3 className="mt-4 text-xl font-semibold">
							Validación de datos
						</h3>
						<p className="mt-2 text-slate-600">
							Completa tus datos correctamente para validar tu
							acceso.
						</p>
					</div>
					<div className="rounded-xl border bg-white p-6 shadow-sm">
						<div className="h-10 w-10 rounded-full bg-accent text-white flex items-center justify-center font-bold">
							3
						</div>
						<h3 className="mt-4 text-xl font-semibold">
							Recibe tu material
						</h3>
						<p className="mt-2 text-slate-600">
							En menos de 24 horas te lo enviamos al correo.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
