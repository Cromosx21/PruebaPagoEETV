// Cliente de Stripe en el frontend
// - Carga de forma perezosa con la clave pública VITE_STRIPE_PUBLISHABLE_KEY
import { loadStripe } from "@stripe/stripe-js"

let stripePromise

export function getStripe() {
  if (!stripePromise) {
    const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
    stripePromise = key ? loadStripe(key) : Promise.resolve(null)
  }
  return stripePromise
}
