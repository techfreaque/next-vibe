import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Product category
  category: "Produkte",

  // Enums
  enums: {
    productType: {
      service: "Dienstleistung",
      physical: "Physisch",
      digital: "Digital",
    },
  },

  // Product summary (single source of truth)
  summary:
    "Wir bieten Kostenlos ({{freeCredits}} Credits/Monat als Gast, {{freeCreditsSignedIn}} angemeldet, +{{freeCreditsNewsletterBonus}} mit Newsletter), Monatsabonnement ({{subCurrency}}{{subPrice}}/Monat für {{subCredits}} Credits) und Credit-Pakete ({{packCurrency}}{{packPrice}} für {{packCredits}} Credits), die jeder ohne Abonnement kaufen kann, an.",

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
    price: "Monatliche Abonnementpreise",
    cta: "Jetzt abonnieren",
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
    description: "Zahlen, was du nutzt. Kein Abo. Credits laufen nie ab.",
    longDescription:
      "Kaufen Sie Credits, wenn Sie sie brauchen. Kein Abonnement nötig. Pakete lassen sich zu einem Plan addieren oder allein nutzen.",
    features: {
      credits: "{{packCredits}} Credits pro Paket",
      allModels: "Alle {{modelCount}} KI-Modelle enthalten",
      allFeatures: "Alle Funktionen enthalten",
      multiple: "Mehrere Pakete kaufen",
      permanent: "Credits laufen nie ab",
    },
  },

  // Großes Credit-Paket: eingestellt, nur noch in alten Käufen sichtbar.
  creditPackLarge: {
    name: "Großes Credit-Paket (eingestellt)",
    description:
      "Nicht mehr erhältlich. Bereits gekaufte Credits bleiben gültig.",
  },
};
