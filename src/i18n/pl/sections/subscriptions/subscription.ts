import type { subscriptionTranslations as EnglishSubscriptionTranslations } from "../../../en/sections/subscriptions/subscription";

export const subscriptionTranslations: typeof EnglishSubscriptionTranslations =
  {
    fields: {
      id: "ID subskrypcji",
      userId: "ID użytkownika",
      planId: "ID planu",
      billingInterval: "Interwał rozliczeń",
      status: "Status subskrypcji",
      currentPeriodStart: "Początek obecnego okresu",
      currentPeriodEnd: "Koniec obecnego okresu",
      cancelAtPeriodEnd: "Anuluj na koniec okresu",
      canceledAt: "Anulowano dnia",
      endedAt: "Zakończono dnia",
      cancellationReason: "Powód anulowania",
      trialStart: "Początek okresu próbnego",
      trialEnd: "Koniec okresu próbnego",
      stripeCustomerId: "ID klienta Stripe",
      stripeSubscriptionId: "ID subskrypcji Stripe",
      stripePriceId: "ID ceny Stripe",
    },
  };
