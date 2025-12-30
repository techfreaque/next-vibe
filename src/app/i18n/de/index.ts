import { translations as apiTranslations } from "../../api/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  api: apiTranslations,
  currency: {
    usd: "US-Dollar (USD)",
    eur: "Euro (EUR)",
    gbp: "Britisches Pfund (GBP)",
    jpy: "Japanischer Yen (JPY)",
    chf: "Schweizer Franken (CHF)",
    cad: "Kanadischer Dollar (CAD)",
    aud: "Australischer Dollar (AUD)",
    cny: "Chinesischer Yuan (CNY)",
    inr: "Indische Rupie (INR)",
    brl: "Brasilianischer Real (BRL)",
  },
};
