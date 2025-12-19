# EasyEnglishTV

Landing en React + Vite con pagos para suscripciones, desplegable en Vercel.

-   UI con TailwindCSS
-   Pago con PayPal (wallet y tarjeta, moneda USD para Plan Único)
-   Pago con Izipay (tarjeta, moneda PEN para Plan Único)
-   Funciones serverless en `api/` para integración de pagos

## Estructura

-   `src/components/` componentes de UI (Navbar, Hero, Schedule, Plans, Steps, Stats, Subscribe, Footer)
-   Endpoints backend para Izipay: `/api/izipay-create-payment` y `/api/izipay-success` (configúralos en tu servidor o plataforma serverless)
-   `index.html`, `src/index.css`, `tailwind.config.js` configuración base

## Variables de entorno

Frontend (.env):

-   `VITE_PAYPAL_CLIENT_ID`: Client ID de PayPal (Business)
-   `VITE_YAPE_NUMBER`: número de Yape para pagos por QR
-   `VITE_PLIN_NUMBER`: número de Plin para pagos por QR
-   `VITE_YAPE_QR_URL`: URL de la imagen del código QR de Yape
-   `VITE_PLIN_QR_URL`: URL de la imagen del código QR de Plin
-   `VITE_WHATSAPP_NUMBER`: número de WhatsApp para envío de comprobante

Backend (.env del servidor):

-   `IZIPAY_API_BASE`: base de la API REST de Izipay (ej. `https://api.micuentaweb.pe`)
-   `IZIPAY_REST_USER`: usuario REST de Izipay
-   `IZIPAY_REST_PASSWORD`: contraseña REST de Izipay
-   `IZIPAY_PUBLIC_KEY`: clave pública para Krypton (`<usuario>:<clave>`)
-   `IZIPAY_SHA256_KEY`: clave para validar `kr-hash` en `/api/izipay-success`

Ejemplo disponible en `.env.example`.

## Planes y montos

-   Plan Mensual: solo suscripción vía redes sociales (no muestra medios de pago)
-   Plan Único:
    -   PayPal: `USD 50.00`
    -   Izipay: `PEN 185.00`

## Flujo de Izipay (tarjeta)

1. En `Subscribe.jsx`, selecciona Plan Único y el método `Izipay`.
2. El front llama `POST /api/izipay-create-payment` con `{ planId }`.
3. El backend obtiene `formToken` desde Izipay (KR-Embedded) y responde `{ formToken, publicKey }`.
4. El front incrusta el formulario oficial Krypton (`kr-pan`, `kr-expiry`, `kr-security-code`, `kr-payment-button`).
5. Al finalizar, Izipay POSTea a `/api/izipay-success`. Ahí se valida el hash y se renderiza o registra el comprobante con:
    - Fecha/hora en `es-PE`
    - Orden y Número de transacción
    - Marca y últimos 4 dígitos de la tarjeta
    - Monto y moneda

## Flujo de PayPal

-   El SDK se carga con `VITE_PAYPAL_CLIENT_ID`.
-   Botón estándar (wallet).
-   Montos en `USD` y descripción según plan.

## Desarrollo local

-   Instalar dependencias: `npm install`
-   Servidor dev: `npm run dev` (http://localhost:5173)
-   Lint: `npm run lint`
-   Build: `npm run build`
-   Con Vercel: `vercel dev` para probar funciones `api/` junto al front

## Despliegue

1. Configurar variables de entorno en Vercel (Project Settings → Environment Variables).
2. `Build Command`: `npm run build`
3. `Output Directory`: `dist`
4. Desplegar. Las rutas `api/` quedan disponibles como funciones serverless.

## Seguridad

-   No guardar secretos en el repositorio; usa variables de entorno.
-   No manejar datos sensibles de tarjeta; Krypton/Izipay procesan en cliente.
-   Validar la firma `kr-hash` en el backend.

## QR (Yape/Plin)

-   Configura `VITE_YAPE_NUMBER`, `VITE_PLIN_NUMBER`, `VITE_YAPE_QR_URL`, `VITE_PLIN_QR_URL`.
-   Para recepción de comprobantes por WhatsApp, define `VITE_WHATSAPP_NUMBER` en formato internacional, por ejemplo `+51987654321`.

## Personalización

-   Colores y estilos: `tailwind.config.js` y `src/index.css`
-   Contenidos: componentes en `src/components/`
