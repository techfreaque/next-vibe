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
    name: "Plan nielimitowany",
    description: "Nielimitowane wiadomości dla poważnych użytkowników",
    longDescription: "Najlepsza wartość dla zaawansowanych użytkowników",
    features: {
      credits: "Nielimitowane wiadomości",
      allModels: "Wszystkie 40+ modeli AI",
      allFeatures: "Wszystkie funkcje włączone",
      cancel: "Anuluj w dowolnym momencie",
    },
  },

  // Credit pack product
  creditPack: {
    name: "Pakiet kredytów",
    description: "Płać za to, czego używasz, nigdy nie wygasa",
    longDescription: "Idealny do okazjonalnego użytku",
    features: {
      credits: "500 kredytów na pakiet",
      allModels: "Wszystkie modele AI włączone",
      allFeatures: "Wszystkie funkcje włączone",
      multiple: "Kup wiele pakietów",
      permanent: "Kredyty nigdy nie wygasają",
    },
  },
};
