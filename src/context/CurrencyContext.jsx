import { createContext, useContext, useState, useEffect } from "react";
import { RATES, FLAGS } from "../constants/currency";

const CurrencyContext = createContext();

/* eslint-disable react-refresh/only-export-components */
export const CurrencyProvider = ({ children }) => {
	const [currency, setCurrency] = useState("USD");
	const [isWorldCurrency, setIsWorldCurrency] = useState(false);

	useEffect(() => {
		const detectCountry = () => {
			try {
				const countryMap = {
					PE: "PEN",
					MX: "MXN",
					CO: "COP",
					CL: "CLP",
					AR: "ARS",
					BO: "BOB",
					US: "USD",
				};

				// Intentar primero por zona horaria
				try {
					const timeZoneCurrencyMap = {
						"America/Lima": "PEN",
						"America/Bogota": "COP",
						"America/Mexico_City": "MXN",
						"America/La_Paz": "BOB",
						"America/Santiago": "CLP",
						"America/Argentina/Buenos_Aires": "ARS",
						"America/New_York": "USD",
						"America/Chicago": "USD",
						"America/Los_Angeles": "USD",
					};

					const tz =
						typeof Intl !== "undefined" &&
						Intl.DateTimeFormat().resolvedOptions().timeZone;

					if (tz && timeZoneCurrencyMap[tz]) {
						setCurrency(timeZoneCurrencyMap[tz]);
						setIsWorldCurrency(false);
						return;
					}
				} catch {
					// Ignorar fallos de Intl/timezone y seguir con locale
				}

				if (typeof navigator !== "undefined") {
					const locale =
						navigator.language ||
						(navigator.languages && navigator.languages[0]);

					if (!locale || !locale.includes("-")) {
						setCurrency("USD");
						setIsWorldCurrency(true);
						return;
					}

					const countryCode = locale.split("-")[1].toUpperCase();

					if (countryMap[countryCode]) {
						setCurrency(countryMap[countryCode]);
						setIsWorldCurrency(false);
					} else {
						setCurrency("USD");
						setIsWorldCurrency(true);
					}
				}
			} catch {
				console.warn(
					"No se pudo detectar el país, usando USD por defecto.",
				);
				setCurrency("USD");
				setIsWorldCurrency(true);
			}
		};

		detectCountry();
	}, []);

	const formatPrice = (amountUSD) => {
		const rate = RATES[currency] || 1;
		const value = amountUSD * rate;

		// Formato de moneda
		return new Intl.NumberFormat("es-ES", {
			style: "currency",
			currency: currency,
			minimumFractionDigits: 2,
		}).format(value);
	};

	const value = {
		currency,
		setCurrency: (curr) => {
			setCurrency(curr);
			// Cambio manual: desactivar modo "moneda mundial"
			setIsWorldCurrency(false);
		},
		formatPrice,
		currencies: Object.keys(RATES),
		flags: FLAGS,
		rates: RATES,
		isWorldCurrency,
	};

	return (
		<CurrencyContext.Provider value={value}>
			{children}
		</CurrencyContext.Provider>
	);
};

export const useCurrency = () => useContext(CurrencyContext);
