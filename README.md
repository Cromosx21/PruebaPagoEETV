# EasyEnglishTV

Landing en React + Vite con pagos para suscripciones, desplegable en Vercel.

-   UI con TailwindCSS
-   Pago con PayPal (wallet y tarjeta, moneda USD para Plan Único)
-   Pago con Izipay (tarjeta, moneda PEN para Plan Único)
-   Funciones serverless en `api/` para integración de pagos

## Estructura

-   `src/components/` componentes de UI (Navbar, Hero, Schedule, Plans, Steps, Stats, Subscribe, Footer)
-   `api/izipay-create-payment.js` inicia el pago y devuelve `formToken` para Krypton
-   `api/izipay-success.js` recibe la respuesta de Izipay, valida hash y genera comprobante HTML
-   `index.html`, `src/index.css`, `tailwind.config.js` configuración base

## Variables de entorno

Frontend:

-   `VITE_PAYPAL_CLIENT_ID`: Client ID de PayPal (Business)

Backend:

-   `IZIPAY_API_BASE`: base de la API REST de Izipay (ej. `https://api.micuentaweb.pe`)
-   `IZIPAY_REST_USER`: usuario REST de Izipay
-   `IZIPAY_REST_PASSWORD`: contraseña REST de Izipay
-   `IZIPAY_PUBLIC_KEY`: clave pública para Krypton (`<usuario>:<clave>`)
-   `IZIPAY_SHA256_KEY`: clave para validar `kr-hash` en `/api/izipay-success`

## Planes y montos

-   Plan Mensual: solo suscripción vía redes sociales (no muestra medios de pago)
-   Plan Único:
    -   PayPal: `USD 50.00`
    -   Izipay: `PEN 185.00`

## Flujo de Izipay (tarjeta)

1. En `Subscribe.jsx`, selecciona Plan Único y la marca de tarjeta (Visa/Mastercard/Amex/Diners).
2. Ingresa el correo y pulsa “Pagar ahora (Tarjeta con Izipay)”.
3. El front llama `POST /api/izipay-create-payment` con `{ planId, email }`.
4. El backend devuelve `formToken` y se embebe el formulario Krypton (`kr-pan`, `kr-expiry`, `kr-security-code`, `kr-payment-button`).
5. Al finalizar, Izipay POSTea a `/api/izipay-success`. Ahí se valida el hash y se renderiza el comprobante con:
    - Fecha/hora en `es-PE`
    - Orden y Número de transacción
    - Marca y últimos 4 dígitos de la tarjeta
    - Monto y moneda

## Flujo de PayPal

-   El SDK se carga con `VITE_PAYPAL_CLIENT_ID`.
-   Botón estándar (wallet) y botón de tarjeta (según elegibilidad regional).
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

## Personalización

-   Colores y estilos: `tailwind.config.js` y `src/index.css`
-   Contenidos: componentes en `src/components/`
