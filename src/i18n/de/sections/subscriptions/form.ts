import type { formTranslations as EnglishFormTranslations } from "../../../en/sections/subscriptions/form";

export const formTranslations: typeof EnglishFormTranslations = {
  labels: {
    userId: "Benutzer",
    planId: "Plan",
    billingInterval: "Abrechnungsintervall",
    status: "Status",
    currentPeriodStart: "Aktuelle Periode Start",
    currentPeriodEnd: "Aktuelle Periode Ende",
    cancelAtPeriodEnd: "Am Periodenende kündigen",
    canceledAt: "Gekündigt am",
    endedAt: "Beendet am",
    cancellationReason: "Kündigungsgrund",
    trialStart: "Testphase Start",
    trialEnd: "Testphase Ende",
    stripeCustomerId: "Stripe Kunden-ID",
    stripeSubscriptionId: "Stripe Abonnement-ID",
    stripePriceId: "Stripe Preis-ID",
  },
  buttons: {
    save: "Abonnement speichern",
    cancel: "Abbrechen",
    create: "Abonnement erstellen",
    update: "Abonnement aktualisieren",
    cancelSubscription: "Abonnement kündigen",
    reset: "Formular zurücksetzen",
  },
};
