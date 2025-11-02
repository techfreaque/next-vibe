import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  creditPricing: {
    badge: "Proste ceny oparte na kredytach",
    title: "Płać za użycie czatu AI",
    subtitle:
      "Wybierz między miesięcznymi kredytami a jednorazowymi pakietami kredytów. Pełna przejrzystość kosztów dla wszystkich modeli AI i funkcji.",

    subscription: {
      badge: "Dostępne dla wszystkich",
      title: "Subskrypcja miesięczna",
      price: "€{{price}}",
      perMonth: "/miesiąc",
      description: "{{credits}} kredytów miesięcznie (wygasają co miesiąc)",
      expiryInfo:
        "€10/miesiąc za 1000 kredytów. Przystępny dostęp do AI dla wszystkich!",
      features: {
        credits: "{{credits}} kredytów miesięcznie",
        allModels: "Dostęp do wszystkich modeli AI (darmowych i płatnych)",
        allFeatures: "Wyszukiwanie Brave, TTS i STT",
        cancel: "Anuluj w dowolnym momencie, bez zobowiązań",
      },
      button: "Subskrybuj teraz",
    },

    creditPack: {
      badge: "Dla zaawansowanych",
      title: "Pakiet kredytów",
      price: "€{{price}}",
      description: "{{credits}} kredytów (nigdy nie wygasają)",
      permanentInfo:
        "Potrzebujesz więcej? €5 za 500 kredytów, które nigdy nie wygasają. Idealne dla zaawansowanych użytkowników potrzebujących dodatkowej pojemności.",
      quantityLabel: "Ilość (1-10 pakietów)",
      pricePerPack: "€{{price}} za {{credits}} kredytów",
      features: {
        credits: "{{credits}} stałych kredytów",
        allModels: "Dostęp do wszystkich modeli AI (darmowych i płatnych)",
        allFeatures: "Wyszukiwanie Brave, TTS i STT",
        multiple: "Kupuj wiele pakietów w dowolnym momencie",
      },
      button: "Kup {{quantity}} pakiet",
      buttonPlural: "Kup {{quantity}} pakietów",
    },

    common: {
      processing: "Przetwarzanie...",
    },

    costTransparency: {
      title: "Przejrzystość kosztów",
      card: {
        title: "Koszty modeli AI",
        description: "Jasne ceny dla każdego modelu AI i funkcji",
      },
      table: {
        provider: "Dostawca",
        model: "Model",
        costPerMessage: "Koszt za wiadomość",
        features: "Funkcje",
        braveSearch: "Wyszukiwanie Brave",
        braveSearchCost: "+1 kredyt za wyszukiwanie",
        tts: "Tekst na mowę (TTS)",
        ttsCost: "1 kredyt na minutę",
        stt: "Mowa na tekst (STT)",
        sttCost: "1 kredyt na minutę",
        free: "Darmowe",
        credits: "{{count}} kredyt",
        creditsPlural: "{{count}} kredytów",
        parameters: "{{count}}B parametrów",
      },
    },

    calculator: {
      title: "Kalkulator kredytów",
      card: {
        title: "Oszacuj swoje miesięczne kredyty",
        description:
          "Oblicz, ile kredytów będziesz potrzebować w zależności od użytkowania",
      },
      messagesLabel: "Wiadomości miesięcznie",
      estimates: {
        free: "Z darmowymi modelami (0 kredytów):",
        freeCredits: "0 kredytów",
        basic: "Z podstawowymi modelami (1 kredyt/wiadomość):",
        basicCredits: "{{count}} kredytów",
        pro: "Z modelami Pro (2 kredyty/wiadomość):",
        proCredits: "{{count}} kredytów",
        premium: "Z modelami Premium (5 kredytów/wiadomość):",
        premiumCredits: "{{count}} kredytów",
      },
      recommendation: {
        title: "Rekomendacja:",
        freeTier:
          "Zacznij od darmowego planu (20 kredytów), aby wypróbować usługę!",
        subscription:
          "Subskrypcja miesięczna ({{credits}} kredytów) jest idealna dla Twojego użytkowania!",
        additionalPacks:
          "Rozważ zakup {{packs}} pakiet(ów) kredytów oprócz subskrypcji lub częściej korzystaj z darmowych modeli.",
      },
    },

    freeTier: {
      title: "Dostępny darmowy plan",
      description:
        "Zacznij z 20 darmowymi kredytami (śledzone po IP/leadId). Nie wymagana karta kredytowa. Wiele modeli jest całkowicie darmowych!",
      button: "Zacznij za darmo",
    },
  },
};
