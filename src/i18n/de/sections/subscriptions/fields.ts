import type { fieldsTranslations as EnglishFieldsTranslations } from "../../../en/sections/subscriptions/fields";

export const fieldsTranslations: typeof EnglishFieldsTranslations = {
  userId: "Benutzer-ID für das Abonnement",
  planId: "Plan-ID für das Abonnement",
  billingInterval: "Abrechnungsintervall (monatlich/jährlich)",
  status: "Status des Abonnements",
  currentPeriodStart: "Startdatum der aktuellen Abrechnungsperiode",
  currentPeriodEnd: "Enddatum der aktuellen Abrechnungsperiode",
  cancelAtPeriodEnd: "Am Ende der aktuellen Periode kündigen",
  canceledAt: "Datum der Kündigung",
  endedAt: "Datum des Abonnement-Endes",
  cancellationReason: "Grund für die Kündigung",
  trialStart: "Startdatum der Testphase",
  trialEnd: "Enddatum der Testphase",
  stripeCustomerId: "Stripe-Kunden-ID",
  stripeSubscriptionId: "Stripe-Abonnement-ID",
  stripePriceId: "Stripe-Preis-ID",
};
