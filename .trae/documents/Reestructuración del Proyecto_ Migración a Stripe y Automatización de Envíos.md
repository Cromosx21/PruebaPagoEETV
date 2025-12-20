# Reestructuración del Proyecto y Nueva Integración de Pagos

Este plan detalla los pasos para migrar de Izipay a Stripe, implementar el envío automático de correos con material (PDF) y limpiar el código.

## 1. Limpieza y Refactorización (Punto 1 y 5)

* **Eliminar Izipay:** Se eliminarán los archivos `api/izipay-create-payment.js` y `api/izipay-success.js` (si existe).

* **Limpiar** **`Subscribe.jsx`:** Se removerá toda la lógica, estados y efectos relacionados con Izipay.

* **Refactorización:** Se optimizará el componente `Subscribe.jsx` para manejar los métodos de pago de forma modular.

* Componetizacion: Componetizar los codigos en una carpeta UI, Loyauts, etc, los que se considere necesarios.

<br />

## 2. Agregar en el nav boton de cambio de moneda

El usuario podra elegir el tipo de moneda de acuerdo a su país pero pero defecto aparecera la monedas en el país desde está visitando la web.

## 3. Corregir la seccion de plan

Se tendrá 3 planes

* **Plan Mensual :** INGLÉS CON AMOR (Gramática)
  $6 dólares al mes

* **Plan ORO :** INGLÉS CON AMOR (Gramática - Vocabulario - Speaking)
  $8 dólares al mes

* **PLAN ÚNICO:** INGLÉS CON AMOR (Material completo desde cero hasta avanzado)
  $50 dólares

## 4. corregir la seccion de clases en vivo

**Horario:**
Lunes, Miércoles y Viernes (GRAMÁTICA) 

**Hora Fija:** 07pm hora peruana y actualizar para los demás paises a partir de este.

Martes (VOCABULARIO)

Jueves (SPEAKING)

## 5. Integración de Stripe (Punto 1 y 3)

* **Backend:**

  * Crear `api/create-checkout-session.js`: Endpoint para iniciar la sesión de pago de Stripe.

  * Configurar los precios y productos dinámicamente según el plan seleccionado (Único o VIP).

* **Frontend:**

  * Instalar dependencias: `@stripe/stripe-js`.

  * Implementar el botón de pago de Stripe que redirige al Checkout seguro.

  * Manejar el retorno exitoso (`/success`) para confirmar la compra.

## 6. Automatización de Correos y PDF (Punto 4)

* **Backend de Correo:**

  * Instalar `nodemailer`.

  * Crear `api/send-material.js`: Endpoint seguro que se llamará tras un pago exitoso.

  * **Flujo:**

    1. Verificar el pago (Stripe Session ID o PayPal Order ID).
    2. Enviar correo con el PDF adjunto (usaremos un archivo `public/material-demo.pdf` como placeholder).
    3. Mensaje de agradecimiento y aviso de tiempo de entrega.

* **Integración PayPal:** Actualizar la función `onApprove` de PayPal para llamar a `api/send-material` automáticamente.

## 7. Configuración y Documentación (Punto 2 y 6)

* **Variables de Entorno:** Actualizar `.env.example` con las claves necesarias:

  * `STRIPE_SECRET_KEY`, `STRIPE_PUBLIC_KEY`

  * `EMAIL_USER`, `EMAIL_PASS` (para el envío de correos)

  * `PAYPAL_CLIENT_ID`

* **Documentación:** Crear `DOCUMENTATION.txt` explicando:

  * Estructura del proyecto.

  * Cómo configurar las pasarelas de pago.

  * Cómo configurar el correo (Gmail/SMTP).

  * Explicación de los endpoints principales.

## 8. Pruebas (Punto 3)

* Se dejará el sistema configurado en modo de prueba (Test Mode) para Stripe y PayPal.

* Se incluirán instrucciones sobre cómo simular pagos exitosos.

### Archivos Afectados

* `package.json` (nuevas dependencias)

* `api/*` (nuevos endpoints, eliminación de izipay)

* `src/components/Subscribe.jsx` (lógica de pago renovada)

* `public/` (añadir PDF de prueba)

* `.env.example`

* `DOCUMENTATION.txt` (nuevo)

