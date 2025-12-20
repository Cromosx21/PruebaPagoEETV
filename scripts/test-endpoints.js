// Script para probar el endpoint de envío de correos
// Uso: node scripts/test-endpoints.js [email]

const email = process.argv[2] || "test@example.com";
const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

console.log(`Probando envío de material a: ${email}`);
console.log(
	`Asegúrate de que el servidor esté corriendo en ${BASE_URL} (node server.js)`
);

async function testEmail() {
	try {
		const response = await fetch(`${BASE_URL}/api/send-material`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email: email,
				name: "Tester",
				planName: "Plan de Prueba",
			}),
		});

		const data = await response.json();

		if (response.ok) {
			console.log("✅ Éxito:", data);
		} else {
			console.error("❌ Error del servidor:", data);
		}
	} catch (error) {
		console.error("❌ Error de conexión:", error.message);
		console.log(
			"¿Está corriendo el servidor? Intenta 'node server.js' en otra terminal."
		);
	}
}

testEmail();
