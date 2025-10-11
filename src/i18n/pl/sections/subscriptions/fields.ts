import type { fieldsTranslations as EnglishFieldsTranslations } from "../../../en/sections/subscriptions/fields";

export const fieldsTranslations: typeof EnglishFieldsTranslations = {
  userId: "ID użytkownika dla subskrypcji",
  planId: "ID planu dla subskrypcji",
  billingInterval: "Interwał rozliczeń (miesięczny/roczny)",
  status: "Status subskrypcji",
  currentPeriodStart: "Data rozpoczęcia obecnego okresu rozliczeniowego",
  currentPeriodEnd: "Data zakończenia obecnego okresu rozliczeniowego",
  cancelAtPeriodEnd: "Anuluj na koniec obecnego okresu",
  canceledAt: "Data anulowania",
  endedAt: "Data zakończenia subskrypcji",
  cancellationReason: "Powód anulowania",
  trialStart: "Data rozpoczęcia okresu próbnego",
  trialEnd: "Data zakończenia okresu próbnego",
  stripeCustomerId: "ID klienta Stripe",
  stripeSubscriptionId: "ID subskrypcji Stripe",
  stripePriceId: "ID ceny Stripe",
};
