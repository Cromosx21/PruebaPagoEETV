I will proceed with the restructuring and cleanup as requested, ensuring the Stripe integration is solid and the codebase is clean.

1.  **Environment & Configuration**:
    *   Update `.env.example` to remove all Izipay variables and add the necessary Stripe (`VITE_STRIPE_PUBLIC_KEY`, `STRIPE_SECRET_KEY`) and Email (`EMAIL_USER`, `EMAIL_PASS`) variables.
    *   Update `README.md` to remove Izipay references and document the new Stripe + PayPal flow.

2.  **Documentation**:
    *   Create `DOCUMENTATION.txt` in the root directory. This will explain the project structure, how to set up the environment, how the payment flows work (Stripe & PayPal), and how to deploy.

3.  **Testing**:
    *   Create a `scripts/test-endpoints.js` script. This will allow you to manually test the `/api/send-material` endpoint from the terminal to verify email delivery without needing to make a real payment.

4.  **Refactoring & Cleanup**:
    *   Review `src/components/Subscribe.jsx` and `src/components/Plans.jsx` one last time to ensure no commented-out Izipay code remains.
    *   Ensure the project is ready for a "clean" handover.

*Note: I will focus on the USD implementation for now as per the pricing update ($6, $8, $50). If you need a dynamic currency switcher (USD <-> PEN) that updates the Stripe/PayPal charge currency, please let me know, as that requires backend updates to support multiple currencies per plan.*