const mpPublicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;

export default function Subscribe() {
	// Initialize Mercado Pago with public key only once inside component
	useEffect(() => {
		if (mpPublicKey) {
			initMercadoPago(mpPublicKey, { locale: "es-PE" });
		}
	}, []);

	const { formatPrice, currency } = useCurrency();
	const [selected, setSelected] = useState(PLANS[2]); // Default to Unico
	const [status, setStatus] = useState("");
	const [method, setMethod] = useState(PLANS[2].allowedMethods[0]);
	const [preferenceId, setPreferenceId] = useState(null);
	const [email, setEmail] = useState("");
	const paypalContainerRef = useRef(null);
	const colorClasses = {
		primary: "bg-primary",
		secondary: "bg-secondary",
		accent: "bg-accent",
	};

	const yapeNumber = (import.meta.env.VITE_YAPE_NUMBER || "932914462")
		.toString()
		.trim();
	const plinNumber = (import.meta.env.VITE_PLIN_NUMBER || "932914462")
		.toString()
		.trim();
	const whatsappNumber = (
		import.meta.env.VITE_WHATSAPP_NUMBER || "+51932914462"
	)
		.toString()
		.trim();
	const yapeQr = import.meta.env.VITE_YAPE_QR_URL || "/Yape-qr.jpeg";
	const plinQr = import.meta.env.VITE_PLIN_QR_URL || "/Yape-qr.jpeg";

	const handlePlanSelect = (plan) => {
		setSelected(plan);
		if (!plan.allowedMethods.includes(method)) {
			setMethod(plan.allowedMethods[0]);
		}
	};

	// Validate email format
	const isValidEmail = (email) => {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	};

	// Create Mercado Pago Preference
	useEffect(() => {
		let isMounted = true;
		let timeoutId;

		// Only create preference if method is MP and email is valid
		if (
			method === "mercadopago" &&
			selected &&
			selected.id === "unico" &&
			isValidEmail(email)
		) {
			// Debounce to prevent multiple calls while typing
			timeoutId = setTimeout(() => {
				// Save email for return flow
				localStorage.setItem("pending_payment_email", email);
				localStorage.setItem("pending_payment_plan", selected.name);

				fetch("/api/create-preference", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						planId: selected.id,
						title: selected.name,
						price: selected.amount,
						email: email, // Pass email to backend if needed
					}),
				})
					.then((res) => res.json())
					.then((data) => {
						if (isMounted) {
							if (data.id) setPreferenceId(data.id);
							else
								setStatus(
									"Error al crear preferencia de Mercado Pago"
								);
						}
					})
					.catch((err) => {
						if (isMounted) {
							console.error(err);
							setStatus("Error conectando con Mercado Pago");
						}
					});
			}, 800); // 800ms debounce
		} else {
			// Clear preference if conditions are not met.
			// Checking preferenceId in dependency causes loop, so we assume
			// if conditions aren't met, we should clear it.
			// We use a small timeout to avoid immediate clearing during rapid state changes
			// but here direct clearing is safer if we want to hide button.
			// To avoid loop warning or functionality, we don't check preferenceId here
			// but we need a way to clear it.
			// However, since we removed preferenceId from deps, we can't trust its current value in closure
			// without ref or functional update.
			setPreferenceId((prev) => (prev ? null : prev));
		}

		return () => {
			isMounted = false;
			if (timeoutId) clearTimeout(timeoutId);
		};
		// Removed preferenceId from dependencies to avoid infinite loop/re-renders
	}, [method, selected, email]);
}
