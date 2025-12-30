import { translations as appTranslations } from "../../[locale]/i18n/pl";
import { translations as apiTranslations } from "../../api/i18n/pl";

export const translations = {
  api: apiTranslations,
  ...appTranslations,
  currency: {
    usd: "Dolar amerykański (USD)",
    eur: "Euro (EUR)",
    gbp: "Funt brytyjski (GBP)",
    jpy: "Jen japoński (JPY)",
    chf: "Frank szwajcarski (CHF)",
    cad: "Dolar kanadyjski (CAD)",
    aud: "Dolar australijski (AUD)",
    cny: "Juan chiński (CNY)",
    inr: "Rupia indyjska (INR)",
    brl: "Real brazylijski (BRL)",
  },
};
