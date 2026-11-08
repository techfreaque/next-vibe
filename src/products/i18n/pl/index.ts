import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Product category
  category: "Produkty",

  // Enums
  enums: {
    productType: {
      service: "Usługa",
      physical: "Fizyczny",
      digital: "Cyfrowy",
    },
  },

  // Product summary (single source of truth)
  summary:
    "Oferujemy plany Darmowy ({{freeCredits}} kredytów/miesiąc jako gość, {{freeCreditsSignedIn}} po zalogowaniu, +{{freeCreditsNewsletterBonus}} z newsletterem), Subskrypcja miesięczna ({{subCurrency}}{{subPrice}}/miesiąc za {{subCredits}} kredytów) i Pakiety kredytów ({{packCurrency}}{{packPrice}} za {{packCredits}} kredytów albo {{packCurrency}}{{largePackPrice}} za {{largePackCredits}}), które każdy kupi bez subskrypcji.",

  // Free tier product
  free: {
    name: "Darmowy plan",
    description: "Zacznij z darmowymi kredytami - bez karty kredytowej",
  },

  // Subscription product
  subscription: {
    name: "Subskrypcja miesięczna",
    description:
      "{{subCredits}} kredytów miesięcznie ze wszystkimi {{modelCount}} modelami AI",
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
    description:
      "Płacisz za to, czego używasz. Bez subskrypcji. Kredyty nie wygasają.",
    longDescription:
      "Kup kredyty, gdy ich potrzebujesz. Bez subskrypcji. Dokładaj pakiety do planu albo używaj samych.",
    features: {
      credits: "{{packCredits}} kredytów na pakiet",
      allModels: "Wszystkie {{modelCount}} modeli AI włączone",
      allFeatures: "Wszystkie funkcje włączone",
      multiple: "Kup wiele pakietów",
      permanent: "Kredyty nigdy nie wygasają",
    },
  },

  // Duży pakiet kredytów
  creditPackLarge: {
    name: "Duży pakiet kredytów",
    description:
      "{{largePackCredits}} kredytów w lepszej cenie. Bez subskrypcji. Nie wygasają.",
    longDescription:
      "Pakiet hurtowy. {{largePackCredits}} kredytów w niższej cenie za kredyt. Subskrypcja niepotrzebna.",
    features: {
      credits: "{{largePackCredits}} kredytów na pakiet",
      allModels: "Wszystkie {{modelCount}} modeli AI włączone",
      allFeatures: "Wszystkie funkcje włączone",
      multiple: "Kup kilka pakietów",
      permanent: "Kredyty nigdy nie wygasają",
    },
  },
};
