const days = ["Lunes", "Miércoles", "Viernes"]
const anchorHour = 19
const peruLabel = "07:00 pm"
const countries = [
  { name: "Perú", flag: "🇵🇪", offset: 0 },
  { name: "Colombia", flag: "🇨🇴", offset: 0 },
  { name: "Ecuador", flag: "🇪🇨", offset: 0 },
  { name: "México (CDMX)", flag: "🇲🇽", offset: -1 },
  { name: "Bolivia", flag: "🇧🇴", offset: 1 },
  { name: "Chile", flag: "🇨🇱", offset: 2 },
  { name: "Argentina", flag: "🇦🇷", offset: 2 },
]

function formatHour(h) {
  const hour = ((h % 24) + 24) % 24
  const isPM = hour >= 12
  const hour12 = hour % 12 === 0 ? 12 : hour % 12
  const label = `${String(hour12).padStart(2, "0")}:00 ${isPM ? "pm" : "am"}`
  return label
}

export default function Schedule() {
  return (
    <section id="horario" className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative h-[380px] rounded-2xl overflow-hidden -rotate-1 shadow-xl shadow-neutral-400">
              <img
                src="./ClassZoom.jpg"
                alt="Personas de distintos países felices por aprender inglés"
                className="w-full h-full object-cover "
              />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Clases en vivo</h2>
                <span className="text-secondary font-medium">En vivo</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {days.map((d) => (
                  <div key={d} className="rounded-full border px-3 py-1 text-sm">{d}</div>
                ))}
              </div>
              <div className="mt-8">
                <div className="text-lg font-semibold">Horarios por país</div>
                <div className="mt-4 grid sm:grid-cols-2 gap-3">
                  {countries.map((c) => (
                    <div key={c.name} className="flex items-center justify-between rounded-lg border px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{c.flag}</span>
                        <span className="text-sm">{c.name}</span>
                      </div>
                      <span className="text-sm font-medium">
                        {c.offset === 0 ? peruLabel : formatHour(anchorHour + c.offset)}
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
  )
}
