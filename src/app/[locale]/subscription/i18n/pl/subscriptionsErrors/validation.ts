import type { translations as EnglishValidationTranslations } from "../../en/subscriptionsErrors/validation";

export const translations: typeof EnglishValidationTranslations = {
  id: {
    invalid: "Nieprawidłowy identyfikator subskrypcji",
  },
  userId: {
    invalid: "Nieprawidłowy identyfikator użytkownika",
    required: "Identyfikator użytkownika jest wymagany",
  },
  planId: {
    invalid: "Nieprawidłowy plan subskrypcji",
    required: "Plan subskrypcji jest wymagany",
  },
  billingInterval: {
    invalid: "Nieprawidłowy interwał rozliczeniowy",
  },
  status: {
    invalid: "Nieprawidłowy status subskrypcji",
  },
  cancellationReason: {
    invalid: "Nieprawidłowy powód anulowania",
  },
  stripeCustomerId: {
    invalid: "Nieprawidłowy identyfikator klienta Stripe",
  },
  stripeSubscriptionId: {
    invalid: "Nieprawidłowy identyfikator subskrypcji Stripe",
  },
  stripePriceId: {
    invalid: "Nieprawidłowy identyfikator ceny Stripe",
  },
};
