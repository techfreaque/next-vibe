import type { billingTranslations as EnglishBillingTranslations } from "../../en/sections/billing";

export const translations: typeof EnglishBillingTranslations = {
  title: "Abrechnung & Abonnement",
  description:
    "Verwalten Sie Ihr Abonnement, Zahlungsmethoden und Abrechnungshistorie",
  history: {
    title: "Abrechnungshistorie",
    description:
      "Sehen Sie Ihre Abrechnungshistorie ein und lade Rechnungen herunter",
    date: "Datum: {{date}}",
    status: {
      paid: "Bezahlt",
    },
    planDescriptions: {
      professional: "Professional Plan Abonnement",
    },
  },
  noSubscription: {
    title: "Kein aktives Abonnement",
    description:
      "Sie haben kein aktives Abonnement. Wählen Sie einen Abonnement-Plan, der zu Ihren Bedürfnissen passt.",
    heading: "Loslegen",
    message: "Wähle einen Abonnement-Plan, der zu Ihren Bedürfnissen passt.",
    viewPlans: "Pläne anzeigen",
  },
  currentPlan: {
    title: "Aktueller Plan",
    description: "Verwalte deinen aktuellen Abonnement-Plan",
    status: "Status: {{status}}",
  },
  subscription: {
    title: "Abonnement-Verwaltung",
    description: "Verwalte deinen Abonnement-Plan und Abrechnung",
    currentPlan: "Aktueller Plan: {{plan}}",
    billingCycle: "Abrechnungszyklus: {{cycle}}",
    nextBilling: "Nächstes Abrechnungsdatum:",
    noDate: "Kein Abrechnungsdatum verfügbar",
  },
  paymentMethod: {
    title: "Zahlungsmethode",
    description:
      "Verwalten Sie Ihre Zahlungsmethode und Abrechnungsinformationen",
    cardNumber: "Kartennummer",
    cardNumberPlaceholder: "**** **** **** 1234",
    expiryDate: "Ablaufdatum",
    cvv: "CVV",
    update: "Zahlungsmethode aktualisieren",
    updating: "Wird aktualisiert...",
    success: {
      title: "Zahlungsmethode aktualisiert",
      description: "Ihre Zahlungsmethode wurde erfolgreich aktualisiert.",
    },
    error: {
      title: "Update fehlgeschlagen",
      description:
        "Die Aktualisierung Ihrer Zahlungsmethode ist fehlgeschlagen. Bitte versuchen Sie es erneut.",
    },
  },
  plans: {
    starter: "Starter",
    basic: "Basic",
    professional: "Professional",
    premium: "Premium",
    enterprise: "Enterprise",
  },
  subscriptionStatus: {
    active: "Aktiv",
    pastDue: "Überfällig",
    canceled: "Gekündigt",
  },
  billingActions: {
    upgrade: "Plan upgraden",
    cancel: "Abonnement kündigen",
    canceling: "Wird gekündigt...",
  },
};
