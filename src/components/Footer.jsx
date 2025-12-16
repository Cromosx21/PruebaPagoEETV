export default function Footer() {
	return (
		<footer className="border-t bg-white">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
				<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
					<div className="flex items-center gap-2">
						<span className="inline-block h-8 w-8 rounded bg-primary"></span>
						<span className="font-semibold">EasyEnglishTV</span>
					</div>
					<div className="flex items-center gap-4">
						<a
							className="rounded px-3 py-2 border hover:bg-slate-100 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md"
							href="#"
							target="_blank"
							rel="noreferrer"
						>
							YouTube
						</a>
						<a
							className="rounded px-3 py-2 border hover:bg-slate-100 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md"
							href="#"
							target="_blank"
							rel="noreferrer"
						>
							Facebook
						</a>
						<a
							className="rounded px-3 py-2 border hover:bg-slate-100 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md"
							href="#"
							target="_blank"
							rel="noreferrer"
						>
							Instagram
						</a>
						<a
							className="rounded px-3 py-2 border hover:bg-slate-100 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md"
							href="#"
							target="_blank"
							rel="noreferrer"
						>
							TikTok
						</a>
					</div>
				</div>
				<div className="mt-6 text-center text-sm text-slate-600">
					© {new Date().getFullYear()} EasyEnglishTV. Todos los
					derechos reservados.
				</div>
			</div>
		</footer>
	);
}
