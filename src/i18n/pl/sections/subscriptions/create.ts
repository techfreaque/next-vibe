import type { createTranslations as EnglishCreateTranslations } from "../../../en/sections/subscriptions/create";

export const createTranslations: typeof EnglishCreateTranslations = {
  fields: {
    userId: "ID użytkownika dla subskrypcji",
    planId: "ID planu dla subskrypcji",
    billingInterval: "Interwał rozliczeń (miesięczny lub roczny)",
    trialDays: "Liczba dni okresu próbnego",
    cancelAtPeriodEnd: "Anuluj na koniec okresu",
  },
};
