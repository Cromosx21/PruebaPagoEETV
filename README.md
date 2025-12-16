# EasyEnglishTV

Landing en React + Vite con pagos integrados para suscripciones, optimizada para despliegue en Vercel. Incluye:

-   UI con TailwindCSS
-   Pago con Stripe Checkout (tarjeta, moneda PEN)
-   Pago con PayPal (wallet y tarjeta, moneda PEN)
-   Funciones serverless en `api/` para Stripe

## Estructura

-   `src/components/` componentes de UI (Navbar, Hero, Schedule, Plans, Steps, Stats, Subscribe, Footer)
-   `src/lib/stripeClient.js` inicialización de Stripe en el cliente
-   `api/create-checkout-session.js` creación de sesión de pago en Stripe
-   `api/stripe-webhook.js` recepción y validación de eventos de Stripe
-   `index.html`, `src/index.css`, `tailwind.config.js` configuración base

## Variables de entorno

Configura estas variables antes de desplegar:

Frontend:

-   `VITE_STRIPE_PUBLISHABLE_KEY`: clave pública de Stripe
-   `VITE_PAYPAL_CLIENT_ID`: client id de PayPal (Business, REST App)

Backend (Funciones Vercel/API):

-   `STRIPE_SECRET_KEY`: clave secreta de Stripe (test/production)
-   `STRIPE_WEBHOOK_SECRET`: secreto del webhook de Stripe
-   `VERCEL_URL`: lo establece Vercel automáticamente en producción

## Stripe (tarjeta)

-   Moneda configurada en PEN (Perú) y montos definidos en centavos:
    -   Plan Mensual: `999` (S/ 9.99)
    -   Plan Único: `4900` (S/ 49.00)
-   Flujo:
    1. Cliente hace click en “Pagar ahora” (panel Tarjeta Débito).
    2. Front llama `POST /api/create-checkout-session` con `{ planId }`.
    3. Backend crea sesión y el front redirige a Stripe Checkout.
    4. Stripe redirige a `/?payment=success` o `/?payment=cancel`.
    5. Webhook (`/api/stripe-webhook`) valida `checkout.session.completed`.

## PayPal (wallet y tarjeta)

-   El SDK se carga con `VITE_PAYPAL_CLIENT_ID` y `currency=PEN`.
-   Dos botones:
    -   Wallet estándar de PayPal.
    -   Tarjeta vía PayPal (elegible según región).
-   Para configurar la cuenta destino:
    1. Crea/usa una cuenta Business en [developer.paypal.com](https://developer.paypal.com).
    2. Crea una App REST y copia el `Client ID` (modo sandbox o live).
    3. Define `VITE_PAYPAL_CLIENT_ID` en Vercel (Environment Variables).
    4. Despliega; el pago se enruta a la cuenta asociada a ese `Client ID`.
    -   Nota: El `client-id=sb` es solo sandbox genérico; no está vinculado a tu cuenta. Reemplázalo por tu propio `Client ID`.

## Despliegue en Vercel

1. Importa el repo en Vercel.
2. Añade las variables de entorno.
3. `Build Command`: `npm run build`
4. `Output Directory`: `dist`
5. Las funciones en `api/` se desplegarán automáticamente.
6. Configura el webhook de Stripe apuntando a `https://tu-dominio/api/stripe-webhook` y usa el secreto en `STRIPE_WEBHOOK_SECRET`.

## Desarrollo local

-   Instala dependencias: `npm install`
-   Dev server: `npm run dev` (sirve el front en `http://localhost:5173`)
-   Lint: `npm run lint`
-   Para probar funciones `api/` junto con el front, usa `vercel dev`.

## Seguridad y cumplimiento

-   No se manejan datos de tarjeta en el servidor; Stripe Checkout y PayPal procesan los datos.
-   Valida firmas en webhook de Stripe.
-   Usa HTTPS en producción y configura `Content-Security-Policy`.
-   No expongas claves en el repositorio; usa variables de entorno.

## Perú: Yape y Plin

-   No están integrados nativamente en Stripe/PayPal.
-   Proveedores locales (Niubiz, Izipay, Culqi) pueden soportar Yape/Plin.
-   Siguiente paso: añadir panel Yape/Plin y un endpoint en `api/` para iniciar cobros con el PSP elegido (requiere credenciales).

## Personalización

-   Colores y estilos: `tailwind.config.js` y `src/index.css`.
-   Contenidos: edita los componentes en `src/components/`.
-   Montos y moneda: `api/create-checkout-session.js` y `Subscribe.jsx`.
