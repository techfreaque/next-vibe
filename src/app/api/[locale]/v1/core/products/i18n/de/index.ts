import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Product category
  category: "Produkte",

  // Product summary (single source of truth)
  summary:
    "Wir bieten Kostenlos ({{freeCredits}} Credits/Monat), Monatsabonnement ({{subCurrency}}{{subPrice}}/Monat für {{subCredits}} Credits) und Credit-Pakete ({{packCurrency}}{{packPrice}} für {{packCredits}} Credits, erfordert Abonnement) an.",

  // Free tier product
  free: {
    name: "Kostenlos",
    description:
      "Starten Sie mit kostenlosen Credits - keine Karte erforderlich",
  },

  // Subscription product
  subscription: {
    name: "Monatsabonnement",
    description:
      "{{subCredits}} Credits pro Monat mit allen {{modelCount}} KI-Modellen",
    longDescription:
      "Monatsabonnement mit {{subCredits}} Credits für alle {{modelCount}} unzensierten KI-Modellen",
    features: {
      credits: "{{subCredits}} Credits pro Monat",
      allModels: "Alle {{modelCount}} KI-Modelle",
      allFeatures: "Alle Funktionen enthalten",
      cancel: "Jederzeit kündbar",
    },
  },

  // Credit pack product
  creditPack: {
    name: "Credit-Paket",
    description: "Zusätzliche Credits für Abonnenten - laufen nie ab",
    longDescription:
      "Kaufen Sie zusätzliche Credit-Pakete, wenn Sie mehr als Ihre monatlichen {{subCredits}} Credits benötigen. Erfordert aktives Abonnement.",
    features: {
      credits: "{{packCredits}} Credits pro Paket",
      allModels: "Alle {{modelCount}} KI-Modelle enthalten",
      allFeatures: "Alle Funktionen enthalten",
      multiple: "Mehrere Pakete kaufen",
      permanent: "Credits laufen nie ab",
    },
  },
};
