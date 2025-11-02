import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Product category
  category: "Produkty",

  // Free tier product
  free: {
    name: "Darmowy plan",
    description: "Zacznij z darmowymi kredytami - bez karty kredytowej",
  },

  // Subscription product
  subscription: {
    name: "Subskrypcja miesięczna",
    description: "€10/miesiąc - Dostępne dla wszystkich",
    longDescription: "Przystępny dostęp do AI z 1000 kredytów miesięcznie",
    features: {
      credits: "1000 kredytów miesięcznie",
      allModels: "Wszystkie 40+ modeli AI",
      allFeatures: "Wszystkie funkcje włączone",
      cancel: "Anuluj w dowolnym momencie",
    },
  },

  // Credit pack product
  creditPack: {
    name: "Pakiet kredytów",
    description: "Dodatkowe kredyty dla zaawansowanych użytkowników",
    longDescription: "€5 za 500 kredytów, które nigdy nie wygasają",
    features: {
      credits: "500 kredytów na pakiet",
      allModels: "Wszystkie modele AI włączone",
      allFeatures: "Wszystkie funkcje włączone",
      multiple: "Kup wiele pakietów",
      permanent: "Kredyty nigdy nie wygasają",
    },
  },
};
