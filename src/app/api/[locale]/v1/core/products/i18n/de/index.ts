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
    longDescription: "Bester Wert für Power-User",
    features: {
      credits: "Unbegrenzte Nachrichten",
      allModels: "Alle 40+ KI-Modelle",
      allFeatures: "Alle Funktionen enthalten",
      cancel: "Jederzeit kündbar",
    },
  },

  // Credit pack product
  creditPack: {
    name: "Credit-Paket",
    description: "Bezahlen Sie nach Nutzung, läuft nie ab",
    longDescription: "Perfekt für gelegentliche Nutzung",
    features: {
      credits: "500 Credits pro Paket",
      allModels: "Alle KI-Modelle enthalten",
      allFeatures: "Alle Funktionen enthalten",
      multiple: "Mehrere Pakete kaufen",
      permanent: "Credits laufen nie ab",
    },
  },
};
