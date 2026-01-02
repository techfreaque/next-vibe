import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Product category
  category: "Produkty",

  // Product summary (single source of truth)
  summary:
    "Oferujemy plany Darmowy ({{freeCredits}} kredytów/miesiąc), Subskrypcja miesięczna ({{subCurrency}}{{subPrice}}/miesiąc za {{subCredits}} kredytów) i Pakiety kredytów ({{packCurrency}}{{packPrice}} za {{packCredits}} kredytów, wymaga subskrypcji).",

  // Free tier product
  free: {
    name: "Darmowy plan",
    description: "Zacznij z darmowymi kredytami - bez karty kredytowej",
  },

  // Subscription product
  subscription: {
    name: "Subskrypcja miesięczna",
    description: "{{subCredits}} kredytów miesięcznie ze wszystkimi {{modelCount}} modelami AI",
    longDescription:
      "Miesięczna subskrypcja z {{subCredits}} kredytów dla wszystkich {{modelCount}} niecenzurowanych modeli AI",
    price: "Ceny subskrypcji miesięcznej",
    cta: "Subskrybuj teraz",
    features: {
      credits: "{{subCredits}} kredytów miesięcznie",
      allModels: "Wszystkie {{modelCount}} modeli AI",
      allFeatures: "Wszystkie funkcje włączone",
      cancel: "Anuluj w dowolnym momencie",
    },
  },

  // Credit pack product
  creditPack: {
    name: "Pakiet kredytów",
    description: "Dodatkowe kredyty dla subskrybentów - nigdy nie wygasają",
    longDescription:
      "Kup dodatkowe pakiety kredytów, gdy potrzebujesz więcej niż miesięczne {{subCredits}} kredytów. Wymaga aktywnej subskrypcji.",
    features: {
      credits: "{{packCredits}} kredytów na pakiet",
      allModels: "Wszystkie {{modelCount}} modeli AI włączone",
      allFeatures: "Wszystkie funkcje włączone",
      multiple: "Kup wiele pakietów",
      permanent: "Kredyty nigdy nie wygasają",
    },
  },
};
