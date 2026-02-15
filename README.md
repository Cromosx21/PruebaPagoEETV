# EasyEnglishTV

Landing en React + Vite para suscripciones con pagos (Mercado Pago y PayPal), optimizada para despliegue en Vercel con enfoque en rendimiento, accesibilidad y SEO.

## Tecnologías

- React 19 (Vite)
- TailwindCSS
- Express (API local / serverless)
- SDKs: `@mercadopago/sdk-react`, `@paypal/react-paypal-js`

## Estructura

- `src/components/sections/`: componentes de UI principales
- `src/components/layout/`: cabecera y pie de página
- `api/`: endpoints para crear preferencias y envío de material
- `public/`: imágenes, íconos, `robots.txt`, `sitemap.xml`
- `tailwind.config.js`: paleta y utilidades
- `index.html`: SEO y performance base

## Variables de entorno

Configura estas variables en `.env` (local) o en Vercel:

Frontend:

- `VITE_PAYPAL_CLIENT_ID`: Client ID de PayPal (Live o Sandbox)
- `VITE_MERCADOPAGO_PUBLIC_KEY`: Public Key de Mercado Pago
- `VITE_YAPE_QR_URL`: Ruta pública del QR (ej. `/Yape-qr.jpeg`)
- `VITE_WHATSAPP_NUMBER`: Número para WhatsApp (ej. `51912345678`)
- `VITE_PLIN_NUMBER`: (opcional) Número de Plin

Backend:

- `MERCADOPAGO_ACCESS_TOKEN`: Access Token (Test/Production) para crear preferencias

## Pagos

### PayPal

- Integrado con `@paypal/react-paypal-js`.
- Usa `VITE_PAYPAL_CLIENT_ID` en producción (Live). En pruebas, usa `sb`.

### Mercado Pago

- Frontend renderiza el botón Wallet con `@mercadopago/sdk-react`.
- Backend crea la preferencia en `/api/create-preference`.

## SEO y Performance

- Meta tags y Open Graph configurados en [index.html](file:///f:/proyectos/pruebaeetv/easyenglishtv/index.html).
- `robots.txt` y `sitemap.xml` en [public](file:///f:/proyectos/pruebaeetv/easyenglishtv/public).
- Preconnect a fuentes y preload de imagen crítica.
- Paleta Tailwind ajustada a azul/rojo coherente con el logo: ver [tailwind.config.js](file:///f:/proyectos/pruebaeetv/easyenglishtv/tailwind.config.js).

## Despliegue en Vercel

1. Importa el repo.
2. Añade variables de entorno.
3. Build: `npm run build`
4. Output: `dist`

## Desarrollo local

- Instalar: `npm install`
- Frontend: `npm run dev`
- Backend: `node server.js` (si usas Express local)
- Lint: `npm run lint`

## Buenas prácticas aplicadas

- Botones principales en azul (armonía con logo), secundarios en rojo.
- Accesibilidad: `alt` en imágenes, `aria-label` en enlaces de iconos.
- SEO: canonical, Open Graph, Twitter Card, favicon y apple-touch-icon.
- Rendimiento: preconnect/preload, tamaños de imagen definidos para evitar CLS.
