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
    "Wir bieten Kostenlos (ohne Konto: {{freeCredits}} Credits/Monat, Gratis-Konto: {{freeCreditsSignedIn}}, Konto plus Newsletter: {{freeCreditsMax}}) und vier Monatspläne: {{subPrice}} für {{subCredits}} Credits, {{plusPrice}} für {{plusCredits}}, {{proPrice}} für {{proCredits}} und {{ultraPrice}} für {{ultraCredits}}. Abonnenten laden jederzeit mit Credit-Paketen nach ({{packPrice}} für {{packCredits}} Credits), die nie verfallen.",

  // Free tier product
  free: {
    name: "Kostenlos",
    description:
      "Starten Sie mit kostenlosen Credits - keine Karte erforderlich",
  },

  // Subscription product
  subscription: {
    name: "Starter",
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

  // Higher subscription tiers (credits and prices come from config)
  subscriptionPlus: {
    name: "Plus",
  },
  subscriptionPro: {
    name: "Pro",
  },
  subscriptionUltra: {
    name: "Ultra",
  },

  // Credit pack product
  creditPack: {
    name: "Credit-Paket",
    description: "Dein Plan zum Nachladen. Credits laufen nie ab.",
    longDescription:
      "Credits knapp vor der Verlängerung? Paket dazu. Pakete kommen zu deinen Monats-Credits hinzu und laufen nie ab.",
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
