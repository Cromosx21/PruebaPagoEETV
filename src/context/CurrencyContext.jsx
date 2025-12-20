import { createContext, useContext, useState, useEffect } from "react";

const CurrencyContext = createContext();

// Tasas de cambio aproximadas (Hardcoded para estabilidad del demo)
// En producción, esto debería venir de una API en tiempo real.
const RATES = {
	USD: 1,
	PEN: 3.75, // Perú
	MXN: 17.5, // México
	COP: 3900, // Colombia
	CLP: 950, // Chile
	ARS: 850, // Argentina
	BOB: 6.9, // Bolivia
};

const FLAGS = {
	USD: "US",
	PEN: "PE",
	MXN: "MX",
	COP: "CO",
	CLP: "CL",
	ARS: "AR",
	BOB: "BO",
};

const SYMBOLS = {
	USD: "$",
	PEN: "S/",
	MXN: "$",
	COP: "$",
	CLP: "$",
	ARS: "$",
	BOB: "Bs",
};

export const CurrencyProvider = ({ children }) => {
	const [currency, setCurrency] = useState("USD");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Intentar detectar país por IP
		const detectCountry = async () => {
			try {
				const res = await fetch("https://ipapi.co/json/");
				const data = await res.json();

				const countryMap = {
					PE: "PEN",
					MX: "MXN",
					CO: "COP",
					CL: "CLP",
					AR: "ARS",
					BO: "BOB",
				};

				if (countryMap[data.country_code]) {
					setCurrency(countryMap[data.country_code]);
				}
			} catch (error) {
				console.warn(
					"No se pudo detectar el país, usando USD por defecto."
				);
			} finally {
				setLoading(false);
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
		setCurrency,
		formatPrice,
		currencies: Object.keys(RATES),
		flags: FLAGS,
		rates: RATES,
	};

	return (
		<CurrencyContext.Provider value={value}>
			{children}
		</CurrencyContext.Provider>
	);
};

export const useCurrency = () => useContext(CurrencyContext);
