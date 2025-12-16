import { useState } from "react";

export default function Navbar() {
	const [open, setOpen] = useState(false);
	return (
		<header className="sticky top-0 z-50 bg-light/80 backdrop-blur border-b border-slate-200">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					<a href="#" className="flex items-center gap-2">
						<span className="inline-block h-8 w-8 rounded bg-primary"></span>
						<span className="text-lg font-bold">EasyEnglishTV</span>
					</a>
					<nav className="hidden md:flex items-center gap-6">
						<a
							href="#horario"
							className="hover:text-primary transition-colors duration-200"
						>
							Horario
						</a>
						<a
							href="#planes"
							className="hover:text-primary transition-colors duration-200"
						>
							Planes
						</a>
						<a
							href="#beneficios"
							className="hover:text-primary transition-colors duration-200"
						>
							Beneficios
						</a>
					</nav>
					<div className="flex items-center gap-3">
						<a
							href="#suscribete"
							className="hidden sm:inline-block rounded-lg bg-primary text-white px-4 py-2 hover:bg-primary/90 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md"
						>
							Suscríbete
						</a>
						<button
							className="md:hidden rounded p-2 border"
							onClick={() => setOpen(!open)}
						>
							<span className="sr-only">Abrir menú</span>
							<div className="space-y-1">
								<span className="block h-0.5 w-5 bg-dark"></span>
								<span className="block h-0.5 w-5 bg-dark"></span>
								<span className="block h-0.5 w-5 bg-dark"></span>
							</div>
						</button>
					</div>
				</div>
				{open && (
					<div className="md:hidden pb-4">
						<div className="flex flex-col gap-2">
							<a
								href="#horario"
								className="px-2 py-2 rounded hover:bg-slate-100 transition-colors duration-200"
							>
								Horario
							</a>
							<a
								href="#planes"
								className="px-2 py-2 rounded hover:bg-slate-100 transition-colors duration-200"
							>
								Planes
							</a>
							<a
								href="#beneficios"
								className="px-2 py-2 rounded hover:bg-slate-100 transition-colors duration-200"
							>
								Beneficios
							</a>
							<a
								href="#suscribete"
								className="px-2 py-2 rounded bg-primary text-white transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md"
							>
								Suscríbete
							</a>
						</div>
					</div>
				)}
			</div>
		</header>
	);
}
