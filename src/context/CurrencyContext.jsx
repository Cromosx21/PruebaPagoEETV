import { createContext, useContext, useState, useEffect } from "react";
import { RATES, FLAGS } from "../constants/currency";

const CurrencyContext = createContext();

/* eslint-disable react-refresh/only-export-components */
export const CurrencyProvider = ({ children }) => {
	const [currency, setCurrency] = useState("USD");

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
			} catch {
				console.warn(
					"No se pudo detectar el país, usando USD por defecto."
				);
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
