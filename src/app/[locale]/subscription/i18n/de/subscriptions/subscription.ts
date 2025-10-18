import type { translations as EnglishSubscriptionTranslations } from "../../en/subscriptions/subscription";

export const translations: typeof EnglishSubscriptionTranslations = {
  fields: {
    id: "Abonnement-ID",
    userId: "Benutzer-ID",
    planId: "Plan-ID",
    billingInterval: "Abrechnungsintervall",
    status: "Abonnement-Status",
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
};
