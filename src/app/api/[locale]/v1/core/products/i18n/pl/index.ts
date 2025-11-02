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
  },

  // Credit pack product
  creditPack: {
    name: "Pakiet kredytów",
    description: "Płać za to, czego używasz, nigdy nie wygasa",
  },
};
