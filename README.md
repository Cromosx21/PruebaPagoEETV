# EasyEnglishTV

Landing Page para cursos de inglés con React + Vite. Integración de pagos con Stripe y PayPal, y automatización de envío de material por correo.

## Características

-   **UI Moderna:** Construida con TailwindCSS.
-   **Pagos Seguros:**
    -   **PayPal:** Pagos en USD (Wallet/Tarjeta).
    -   **Stripe:** Pagos con tarjeta de crédito/débito (USD).
    -   **QR (Yape/Plin):** Instrucciones para pago manual y envío de voucher por WhatsApp.
-   **Automatización:** Envío automático de material (PDF) por correo electrónico tras el pago exitoso.
-   **Backend:** Servidor Express (`server.js`) para manejar secretos de Stripe y envío de correos.

## Estructura del Proyecto

-   `src/components/`: Componentes de UI (Navbar, Hero, Plans, Subscribe, etc.)
-   `api/`: Lógica del backend (Stripe, Email).
-   `server.js`: Punto de entrada del servidor backend.
-   `public/`: Archivos estáticos (imágenes, PDF demo).

## Configuración y Variables de Entorno

Crea un archivo `.env` en la raíz basado en `.env.example`:

```bash
# Stripe
VITE_STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# PayPal
VITE_PAYPAL_CLIENT_ID=...

# Email (Gmail App Password)
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=tu_password_app

# QR
VITE_YAPE_NUMBER=...
VITE_PLIN_NUMBER=...
```

## Instalación y Ejecución

1.  **Instalar dependencias:**
    ```bash
    npm install
    ```

2.  **Iniciar el proyecto (Frontend + Backend):**
    Para desarrollo local, necesitas correr tanto el servidor de Vite como el servidor Express.

    **Terminal 1 (Backend):**
    ```bash
    node server.js
    ```
    (El servidor correrá en http://localhost:3000)

    **Terminal 2 (Frontend):**
    ```bash
    npm run dev
    ```
    (El frontend correrá en http://localhost:5173 y hará proxy de `/api` a `localhost:3000`)

## Flujo de Pagos

### Stripe
1.  El usuario selecciona "Tarjeta (Stripe)" y el plan deseado.
2.  Se llama a `/api/create-checkout-session` para crear una sesión de pago.
3.  El usuario es redirigido a la página segura de Stripe.
4.  Al completar el pago, Stripe redirige a `/?status=success`.
5.  El frontend detecta el éxito y llama a `/api/confirm-stripe-payment`.
6.  El backend verifica el pago y envía el material por correo automáticamente.

### PayPal
1.  El usuario selecciona "PayPal".
2.  Se renderizan los botones oficiales de PayPal.
3.  Al aprobar el pago (`onApprove`), el frontend captura la orden.
4.  Tras la captura exitosa, el frontend llama a `/api/send-material` para enviar el correo con el PDF.

## Despliegue

Para producción, se recomienda desplegar el frontend (ej. Vercel, Netlify) y el backend (ej. Vercel Functions, Render, Railway).

-   **Vercel:** Si despliegas en Vercel, puedes convertir `server.js` y `api/` en Serverless Functions o usar un adaptador.
-   **VPS/Node:** Puedes correr `node server.js` y servir el frontend compilado (`npm run build`) desde la carpeta `dist`.
