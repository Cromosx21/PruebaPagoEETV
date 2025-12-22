# EasyEnglishTV

Landing en React + Vite con pagos integrados para suscripciones, optimizada para despliegue en Vercel. Incluye:

-   UI con TailwindCSS
-   Pago con Mercado Pago (Checkout Pro/Wallet)
-   Pago con PayPal
-   Funciones serverless en `api/` (Express)

## Estructura

-   `src/components/sections/` componentes de UI principales
-   `api/mercadopago.js` creación de preferencias de pago
-   `server.js` servidor Express para desarrollo local o despliegue
-   `index.html`, `src/index.css`, `tailwind.config.js` configuración base

## Variables de entorno

Configura estas variables en `.env` (local) o en el panel de Vercel:

Frontend:

-   `VITE_PAYPAL_CLIENT_ID`: client id de PayPal
-   `VITE_MERCADOPAGO_PUBLIC_KEY`: clave pública de Mercado Pago

Backend:

-   `MERCADOPAGO_ACCESS_TOKEN`: token de acceso de Mercado Pago (Production/Test)

Opcionales (QR Manual):

-   `VITE_YAPE_NUMBER`, `VITE_PLIN_NUMBER`
-   `VITE_WHATSAPP_NUMBER`

## Mercado Pago

-   Se usa el SDK `@mercadopago/sdk-react` en el frontend para renderizar el botón de pago (Wallet).
-   El backend crea una "Preferencia" de pago y devuelve el ID.
-   Flujo:
    1.  Usuario selecciona "Mercado Pago".
    2.  Front llama a `/api/create-preference`.
    3.  Backend crea preferencia y retorna `preferenceId`.
    4.  Front renderiza el botón de pago con ese ID.

## PayPal

-   El SDK se carga dinámicamente con `VITE_PAYPAL_CLIENT_ID`.

## Despliegue en Vercel

1.  Importa el repo en Vercel.
2.  Añade las variables de entorno.
3.  `Build Command`: `npm run build`
4.  `Output Directory`: `dist`
5.  Configura las Serverless Functions si usas la carpeta `api/` como funciones de Vercel, o despliega `server.js` como un servicio web si prefieres (requiere `vercel.json` específico).
    -   _Nota_: Este proyecto usa `server.js` con Express. Para Vercel Functions, lo ideal es tener archivos en `api/` que exporten `default (req, res)`.
    -   Actualmente `api/mercadopago.js` exporta una función, no un handler default. Si despliegas en Vercel como Functions, asegúrate de adaptar la estructura o usar `vercel build`.

## Desarrollo local

-   Instala dependencias: `npm install`
-   Dev server (Frontend): `npm run dev`
-   Servidor API (Backend): `node server.js` (o `npm run server` si configuras el script)
-   Lint: `npm run lint`
