import type { createTranslations as EnglishCreateTranslations } from "../../../en/sections/subscriptions/create";

export const createTranslations: typeof EnglishCreateTranslations = {
  fields: {
    userId: "Benutzer-ID für das Abonnement",
    planId: "Plan-ID für das Abonnement",
    billingInterval: "Abrechnungsintervall (monatlich oder jährlich)",
    trialDays: "Anzahl der Testtage",
    cancelAtPeriodEnd: "Am Periodenende kündigen",
  },
};
