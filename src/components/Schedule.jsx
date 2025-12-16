const baseTimes = ["05:00 pm", "06:00 pm", "07:00 pm", "08:00 pm", "09:00 pm"]
const days = ["Lunes", "Miércoles", "Viernes"]
const countrySchedules = [
  { name: "Perú", flag: "🇵🇪", range: "05:00–09:00 pm" },
  { name: "Colombia", flag: "🇨🇴", range: "05:00–09:00 pm" },
  { name: "Ecuador", flag: "🇪🇨", range: "05:00–09:00 pm" },
  { name: "México (CDMX)", flag: "🇲🇽", range: "04:00–08:00 pm" },
  { name: "Bolivia", flag: "🇧🇴", range: "06:00–10:00 pm" },
  { name: "Chile", flag: "🇨🇱", range: "06:00–10:00 pm" },
  { name: "Argentina", flag: "🇦🇷", range: "07:00–11:00 pm" },
]

export default function Schedule() {
  return (
    <section id="horario" className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative h-[380px] rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1520975922284-5f62a75beedd?q=80&w=1600&auto=format&fit=crop"
                alt="Personas de distintos países felices por aprender inglés"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/40 to-transparent"></div>
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
              <div className="mt-6 grid grid-cols-5 gap-2">
                {baseTimes.map((t) => (
                  <div key={t} className="rounded-lg border px-3 py-2 text-center text-sm">{t}</div>
                ))}
              </div>
              <div className="mt-8">
                <div className="text-lg font-semibold">Horarios por país</div>
                <div className="mt-4 grid sm:grid-cols-2 gap-3">
                  {countrySchedules.map((c) => (
                    <div key={c.name} className="flex items-center justify-between rounded-lg border px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{c.flag}</span>
                        <span className="text-sm">{c.name}</span>
                      </div>
                      <span className="text-sm font-medium">{c.range}</span>
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
