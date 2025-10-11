import type { billingTranslations as EnglishBillingTranslations } from "../../en/sections/billing";

export const billingTranslations: typeof EnglishBillingTranslations = {
  title: "Rozliczenia i Subskrypcja",
  description:
    "Zarządzaj swoją subskrypcją, metodami płatności i historią rozliczeń",
  history: {
    title: "Historia Rozliczeń",
    description: "Przeglądaj historię rozliczeń i pobieraj faktury",
    date: "Data: {{date}}",
    status: {
      paid: "Opłacone",
    },
    planDescriptions: {
      professional: "Subskrypcja Planu Professional",
    },
  },
  noSubscription: {
    title: "Brak Aktywnej Subskrypcji",
    description:
      "Nie masz aktywnej subskrypcji. Wybierz plan subskrypcji, który odpowiada Twoim potrzebom.",
    heading: "Rozpocznij",
    message: "Wybierz plan subskrypcji, który odpowiada Twoim potrzebom.",
    viewPlans: "Zobacz Plany",
  },
  currentPlan: {
    title: "Aktualny Plan",
    description: "Zarządzaj swoim aktualnym planem subskrypcji",
    status: "Status: {{status}}",
  },
  subscription: {
    title: "Zarządzanie Subskrypcją",
    description: "Zarządzaj swoim planem subskrypcji i rozliczeniami",
    currentPlan: "Aktualny Plan: {{plan}}",
    billingCycle: "Cykl Rozliczeniowy: {{cycle}}",
    nextBilling: "Następna data rozliczenia:",
    noDate: "Brak dostępnej daty rozliczenia",
  },
  paymentMethod: {
    title: "Metoda Płatności",
    description:
      "Zarządzaj swoją metodą płatności i informacjami rozliczeniowymi",
    cardNumber: "Numer Karty",
    cardNumberPlaceholder: "**** **** **** 1234",
    expiryDate: "Data Ważności",
    cvv: "CVV",
    update: "Zaktualizuj Metodę Płatności",
    updating: "Aktualizowanie...",
    success: {
      title: "Metoda Płatności Zaktualizowana",
      description: "Twoja metoda płatności została pomyślnie zaktualizowana.",
    },
    error: {
      title: "Aktualizacja Nie Powiodła Się",
      description:
        "Nie udało się zaktualizować Twojej metody płatności. Spróbuj ponownie.",
    },
  },
  plans: {
    starter: "Starter",
    basic: "Basic",
    professional: "Professional",
    premium: "Najwyższa jakość",
    enterprise: "Enterprise",
  },
  subscriptionStatus: {
    active: "Aktywna",
    pastDue: "Przeterminowana",
    canceled: "Anulowana",
  },
  billingActions: {
    upgrade: "Ulepsz Plan",
    cancel: "Anuluj Subskrypcję",
    canceling: "Anulowanie...",
  },
};
