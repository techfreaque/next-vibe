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
    name: "Monatsabonnement",
    description: "€10/Monat - Für alle zugänglich",
    longDescription: "Erschwinglicher KI-Zugang mit 1000 Credits monatlich",
    features: {
      credits: "1000 Credits pro Monat",
      allModels: "Alle 40+ KI-Modelle",
      allFeatures: "Alle Funktionen enthalten",
      cancel: "Jederzeit kündbar",
    },
  },

  // Credit pack product
  creditPack: {
    name: "Credit-Paket",
    description: "Zusätzliche Credits für Power-User",
    longDescription: "€5 für 500 Credits, die nie ablaufen",
    features: {
      credits: "500 Credits pro Paket",
      allModels: "Alle KI-Modelle enthalten",
      allFeatures: "Alle Funktionen enthalten",
      multiple: "Mehrere Pakete kaufen",
      permanent: "Credits laufen nie ab",
    },
  },
};
