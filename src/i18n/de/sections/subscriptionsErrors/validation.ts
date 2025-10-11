import type { validationTranslations as EnglishValidationTranslations } from "../../../en/sections/subscriptionsErrors/validation";

export const validationTranslations: typeof EnglishValidationTranslations = {
  id: {
    invalid: "Ungültige Abonnement-ID",
  },
  userId: {
    invalid: "Ungültige Benutzer-ID",
    required: "Benutzer-ID ist erforderlich",
  },
  planId: {
    invalid: "Ungültiger Abonnement-Plan",
    required: "Abonnement-Plan ist erforderlich",
  },
  billingInterval: {
    invalid: "Ungültiges Abrechnungsintervall",
  },
  status: {
    invalid: "Ungültiger Abonnement-Status",
  },
  cancellationReason: {
    invalid: "Ungültiger Kündigungsgrund",
  },
  stripeCustomerId: {
    invalid: "Ungültige Stripe-Kunden-ID",
  },
  stripeSubscriptionId: {
    invalid: "Ungültige Stripe-Abonnement-ID",
  },
  stripePriceId: {
    invalid: "Ungültige Stripe-Preis-ID",
  },
};
