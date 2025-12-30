import { translations as appTranslations } from "../../[locale]/i18n/en";
import { translations as apiTranslations } from "../../api/i18n/en";

export const translations = {
  api: apiTranslations,
  // we spread [locale] translations to avoid it in the translation key
  ...appTranslations,
  currency: {
    usd: "US Dollar (USD)",
    eur: "Euro (EUR)",
    gbp: "British Pound (GBP)",
    jpy: "Japanese Yen (JPY)",
    chf: "Swiss Franc (CHF)",
    cad: "Canadian Dollar (CAD)",
    aud: "Australian Dollar (AUD)",
    cny: "Chinese Yuan (CNY)",
    inr: "Indian Rupee (INR)",
    brl: "Brazilian Real (BRL)",
  },
};
