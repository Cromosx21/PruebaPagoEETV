import { useState } from "react"

export default function Plans() {
  const [info, setInfo] = useState(null)
  return (
    <section id="planes" className="py-16 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Elige tu Plan</h2>
          <p className="mt-2 text-slate-600">Accede a material exclusivo con el plan que prefieras</p>
        </div>
        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border bg-white p-8 shadow-sm">
            <h3 className="text-2xl font-bold">Plan Mensual</h3>
            <p className="mt-2 text-slate-600">Suscríbete mensualmente en tus redes favoritas y obtén acceso inmediato.</p>
            <div className="mt-6 flex gap-3">
              <a href="#suscribete" className="rounded-lg bg-primary text-white px-5 py-3 hover:bg-primary/90 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md">Suscribirme</a>
              <a
                href="#planes"
                className="rounded-lg border px-5 py-3 hover:bg-slate-100 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md"
                onClick={(e) => {
                  e.preventDefault()
                  setInfo("mensual")
                }}
              >
                Ver beneficios
              </a>
            </div>
          </div>
          <div className="rounded-2xl border bg-white p-8 shadow-sm">
            <h3 className="text-2xl font-bold">Plan Único</h3>
            <p className="mt-2 text-slate-600">Haz un único pago y disfruta de acceso ilimitado a todo el material.</p>
            <div className="mt-6 flex gap-3">
              <a href="#suscribete" className="rounded-lg bg-secondary text-white px-5 py-3 hover:bg-secondary/90 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md">Comprar ahora</a>
              <a
                href="#planes"
                className="rounded-lg border px-5 py-3 hover:bg-slate-100 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md"
                onClick={(e) => {
                  e.preventDefault()
                  setInfo("unico")
                }}
              >
                Ver contenido
              </a>
            </div>
          </div>
        </div>
        {info === "mensual" && (
          <div className="mt-10 rounded-2xl border bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="inline-block h-8 w-1 rounded bg-primary"></span>
              <h3 className="text-2xl font-bold">Beneficios del Plan Mensual</h3>
            </div>
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <div className="rounded-lg border p-4">
                <div className="font-semibold">Acceso inmediato al material exclusivo</div>
                <div className="mt-1 text-slate-600">Contenido actualizado y ejercicios prácticos para reforzar tu aprendizaje.</div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="font-semibold">Clases en vivo Lunes, Miércoles y Viernes</div>
                <div className="mt-1 text-slate-600">Participa en las transmisiones en los horarios publicados.</div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="font-semibold">Acompañamiento y soporte</div>
                <div className="mt-1 text-slate-600">Resolución de dudas por correo y canales oficiales.</div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="font-semibold">Flexibilidad</div>
                <div className="mt-1 text-slate-600">Cancela o renueva cuando lo necesites, sin permanencias.</div>
              </div>
            </div>
          </div>
        )}
        {info === "unico" && (
          <div className="mt-10 rounded-2xl border bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="inline-block h-8 w-1 rounded bg-secondary"></span>
              <h3 className="text-2xl font-bold">Contenido y Beneficios del Plan Único</h3>
            </div>
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <div className="rounded-lg border p-4">
                <div className="font-semibold">Acceso completo e ilimitado</div>
                <div className="mt-1 text-slate-600">Obtén todo el material exclusivo disponible para estudiar a tu ritmo.</div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="font-semibold">Sin renovaciones mensuales</div>
                <div className="mt-1 text-slate-600">Pago único con acceso permanente al contenido adquirido.</div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="font-semibold">Material descargable</div>
                <div className="mt-1 text-slate-600">Guías, recursos y ejercicios que puedes guardar y reutilizar.</div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="font-semibold">Complemento ideal para las clases</div>
                <div className="mt-1 text-slate-600">Refuerza las transmisiones en vivo con contenido estructurado.</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
