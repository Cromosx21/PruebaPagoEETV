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
