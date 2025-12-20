import { useState, useRef, useEffect } from "react";
import LogoEETV from "/LogoEETV.svg";
import { useCurrency } from "../../context/CurrencyContext";
import Flag from "react-world-flags";

export default function Navbar() {
	const [open, setOpen] = useState(false);
	const { currency, setCurrency, currencies, flags } = useCurrency();
	const [currencyOpen, setCurrencyOpen] = useState(false);
	const dropdownRef = useRef(null);

	// Cerrar dropdown al hacer clic fuera
	useEffect(() => {
		function handleClickOutside(event) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target)
			) {
				setCurrencyOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<header className="sticky top-0 z-50 bg-light/80 backdrop-blur border-b border-slate-200">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					<a href="#" className="flex items-center gap-2">
						<img
							src={LogoEETV}
							alt="Logo EasyEnglishTV"
							className="h-12"
						/>
					</a>
					<nav className="hidden md:flex items-center gap-6">
						<a
							href="#horario"
							className="hover:text-primary transition-colors duration-200"
						>
							Horario
						</a>
						<a
							href="#beneficios"
							className="hover:text-primary transition-colors duration-200"
						>
							¿Cómo funciona?
						</a>
						<a
							href="#planes"
							className="hover:text-primary transition-colors duration-200"
						>
							Planes
						</a>
					</nav>
					<div className="flex items-center gap-3">
						{/* Selector de Moneda Custom */}
						<div className="relative" ref={dropdownRef}>
							<button
								onClick={() => setCurrencyOpen(!currencyOpen)}
								className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 py-1.5 pl-3 pr-2 rounded-lg hover:border-primary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
							>
								<div className="w-6 h-4 relative overflow-hidden rounded-[2px] shadow-sm">
									<Flag
										code={flags[currency]}
										className="absolute inset-0 w-full h-full object-cover"
									/>
								</div>
								<span className="text-sm font-medium">
									{currency}
								</span>
								<svg
									className={`fill-current h-4 w-4 text-slate-500 transition-transform duration-200 ${
										currencyOpen ? "rotate-180" : ""
									}`}
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
								>
									<path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
								</svg>
							</button>

							{currencyOpen && (
								<div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 overflow-hidden ring-1 ring-black/5">
									{currencies.map((curr) => (
										<button
											key={curr}
											onClick={() => {
												setCurrency(curr);
												setCurrencyOpen(false);
											}}
											className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left hover:bg-slate-50 transition-colors ${
												currency === curr
													? "bg-slate-50 text-primary font-semibold"
													: "text-slate-700"
											}`}
										>
											<div className="w-6 h-4 relative overflow-hidden rounded-[2px] shadow-sm flex-shrink-0">
												<Flag
													code={flags[curr]}
													className="absolute inset-0 w-full h-full object-cover"
												/>
											</div>
											{curr}
										</button>
									))}
								</div>
							)}
						</div>

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
							<div className="space-y-1 ">
								<span
									className={`transition-all ease-in-out duration-300 ${
										open ? "rotate-45 translate-y-1" : ""
									} block h-0.5 w-5 bg-dark`}
								></span>
								<span
									className={`transition-all ease-in-out duration-300 ${
										open ? "hidden" : ""
									} block h-0.5 w-5 bg-dark`}
								></span>
								<span
									className={`transition-all ease-in-out duration-300 ${
										open
											? "-rotate-45 -translate-y-0.5 "
											: ""
									} block h-0.5 w-5 bg-dark`}
								></span>
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
