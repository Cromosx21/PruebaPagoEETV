export default function Stats() {
  const stats = [
    { label: "Clases gratuitas", value: "+360" },
    { label: "Páginas en el material", value: "+850" },
    { label: "Seguidores", value: "+3 M" },
  ]
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-3 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border bg-white p-6 text-center shadow-sm">
              <div className="text-3xl font-extrabold text-primary">{s.value}</div>
              <div className="mt-2 text-slate-600">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
