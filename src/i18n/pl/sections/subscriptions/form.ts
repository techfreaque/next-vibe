import type { formTranslations as EnglishFormTranslations } from "../../../en/sections/subscriptions/form";

export const formTranslations: typeof EnglishFormTranslations = {
  labels: {
    userId: "Użytkownik",
    planId: "Plan",
    billingInterval: "Interwał rozliczeń",
    status: "Status",
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
  buttons: {
    save: "Zapisz subskrypcję",
    cancel: "Anuluj",
    create: "Utwórz subskrypcję",
    update: "Zaktualizuj subskrypcję",
    cancelSubscription: "Anuluj subskrypcję",
    reset: "Resetuj formularz",
  },
};
