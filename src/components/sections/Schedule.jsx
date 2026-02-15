import Flag from "react-world-flags";
import VideoRender from "../ui/VideoRender";

const anchorHour = 19;
const peruLabel = "07:00 pm";
const countries = [
	{ name: "Perú", code: "PE", offset: 0 },
	{ name: "Colombia", code: "CO", offset: 0 },
	{ name: "Ecuador", code: "EC", offset: 0 },
	{ name: "México (CDMX)", code: "MX", offset: -1 },
	{ name: "Bolivia", code: "BO", offset: 1 },
	{ name: "Chile", code: "CL", offset: 2 },
	{ name: "Argentina", code: "AR", offset: 2 },
	{ name: "EE.UU", code: "US", offset: 2 },
];

function formatHour(h) {
	const hour = ((h % 24) + 24) % 24;
	const isPM = hour >= 12;
	const hour12 = hour % 12 === 0 ? 12 : hour % 12;
	const label = `${String(hour12).padStart(2, "0")}:00 ${isPM ? "pm" : "am"}`;
	return label;
}

export default function Schedule() {
	return (
		<section id="horario" className="py-16">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="grid lg:grid-cols-2 gap-10 items-center">
					<div className="order-2 lg:order-1">
						<div className="relative h-fit rounded-2xl overflow-hidden -rotate-1 shadow-xl shadow-neutral-400">
							<VideoRender
								videoId="PLZpSrH0_JyRNOUx64Hkzf1hMCJ2xQqgUU"
								title="Playlist Inglés con Amor - EasyEnglishTV"
							/>
						</div>
					</div>
					<div className="order-1 lg:order-2">
						<div className="rounded-2xl border bg-white p-6 shadow-sm">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-2xl font-bold">
									Clases en vivo
								</h2>
								<span className="text-red-600 font-medium">
									Vía Youtube
								</span>
							</div>

							<div className="space-y-4">
								<div className="flex flex-col sm:flex-row sm:items-center gap-2 border-b pb-3">
									<span className="font-bold text-primary min-w-[100px]">
										Gramática:
									</span>
									<div className="flex gap-2">
										{["Lunes", "Miércoles", "Viernes"].map(
											(d) => (
												<span
													key={d}
													className="bg-slate-100 px-2 py-1 rounded text-sm"
												>
													{d}
												</span>
											),
										)}
									</div>
								</div>
								<div className="flex flex-col sm:flex-row sm:items-center gap-2 border-b pb-3">
									<span className="font-bold text-accent min-w-[100px]">
										Vocabulario:
									</span>
									<div className="flex gap-2">
										<span className="bg-slate-100 px-2 py-1 rounded text-sm">
											Martes
										</span>
									</div>
								</div>
								<div className="flex flex-col sm:flex-row sm:items-center gap-2">
									<span className="font-bold text-secondary min-w-[100px]">
										Speaking:
									</span>
									<div className="flex gap-2">
										<span className="bg-slate-100 px-2 py-1 rounded text-sm">
											Jueves
										</span>
									</div>
								</div>
							</div>

							<div className="mt-8">
								<div className="text-lg font-semibold">
									Horarios por país
								</div>
								<div className="mt-4 grid sm:grid-cols-2 gap-3">
									{countries.map((c) => (
										<div
											key={c.name}
											className="flex items-center justify-between rounded-lg border px-3 py-2"
										>
											<div className="flex items-center gap-2">
												<div className="w-8 h-5 relative overflow-hidden rounded-[2px] shadow-sm flex-shrink-0">
													<Flag
														code={c.code}
														className="absolute inset-0 w-full h-full object-cover"
													/>
												</div>
												<span className="text-sm">
													{c.name}
												</span>
											</div>
											<span className="text-sm font-medium">
												{c.offset === 0
													? peruLabel
													: formatHour(
															anchorHour +
																c.offset,
														)}
											</span>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
