import type { paymentTranslations as EnglishPaymentTranslations } from "../../../en/sections/onboarding/payment";

export const paymentTranslations: typeof EnglishPaymentTranslations = {
  title: "Unsere Services abonnieren",
  description: "Sofort mit unserem Standard-Paket loslegen",
  starterPlan: "Starter-Plan",
  features: {
    analytics: "Basis-Analytics-Dashboard",
    scheduling: "Content-Planungstools",
    support: "E-Mail-Support",
  },
  price: "{{price}} pro Monat",
  subscribe: "Jetzt abonnieren",
  processing: "Zahlung wird verarbeitet...",
  success: {
    title: "Zahlung erfolgreich!",
    description: "Ihr Abonnement wurde aktiviert.",
  },
  failed: {
    title: "Zahlung fehlgeschlagen",
    description:
      "Es gab ein Problem bei der Verarbeitung Ihrer Zahlung. Bitte versuchen Sie es erneut.",
    message:
      "Zahlung wurde nicht abgeschlossen. Bitte versuchen Sie erneut, einen Plan auszuwählen.",
  },
  error: {
    title: "Zahlungsfehler",
    description:
      "Ein Fehler ist bei der Verarbeitung Ihrer Zahlung aufgetreten.",
  },
  redirecting: "Weiterleitung zur Zahlungsseite...",
  immediate: {
    title: "Jetzt bezahlen & loslegen",
    description:
      "Abonnieren Sie einen Plan und erhalten Sie sofortigen Zugang zu unseren Services, plus eine Beratung zur Optimierung Ihrer Strategie.",
    cta: "Plan wählen & bezahlen",
  },
  benefits: {
    immediate: "Sofortiger Zugang zu allen Funktionen",
    consultation: "Beinhaltet Strategieberatung",
    priority: "Priority-Support und Onboarding",
  },
};
