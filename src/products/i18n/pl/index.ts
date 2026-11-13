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
    "Oferujemy plany Darmowy (bez konta: {{freeCredits}} kredytów/miesiąc, darmowe konto: {{freeCreditsSignedIn}}, konto z newsletterem: {{freeCreditsMax}}), Subskrypcja miesięczna ({{subCurrency}}{{subPrice}}/miesiąc za {{subCredits}} kredytów) i Pakiety kredytów ({{packCurrency}}{{packPrice}} za {{packCredits}} kredytów), które każdy kupi bez subskrypcji.",

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

  // Duży pakiet kredytów: wycofany, widoczny tylko w starych zakupach.
  creditPackLarge: {
    name: "Duży pakiet kredytów (wycofany)",
    description: "Już niedostępny. Kupione kredyty zostają ważne.",
  },
};
