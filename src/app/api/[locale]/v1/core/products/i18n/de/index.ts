import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Product category
  category: "Produkte",

  // Free tier product
  free: {
    name: "Kostenlos",
    description: "Starten Sie mit kostenlosen Credits - keine Karte erforderlich",
  },

  // Subscription product
  subscription: {
    name: "Unbegrenzter Plan",
    description: "Unbegrenzte Nachrichten für ernsthafte Nutzer",
  },

  // Credit pack product
  creditPack: {
    name: "Credit-Paket",
    description: "Bezahlen Sie nach Nutzung, läuft nie ab",
  },
};
