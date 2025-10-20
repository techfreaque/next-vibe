import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  subscription: {
    title: "Kredyty",
    description: "Zarządzaj swoimi kredytami i subskrypcjami",
    balance: {
      title: "Saldo kredytów",
      description: "Twoje dostępne kredyty na rozmowy z AI",
      total: "kredyty",
      nextExpiration: "Następne wygaśnięcie: {{date}}",
      expiring: {
        title: "Wygasające kredyty",
        description: "Z subskrypcji",
      },
      permanent: {
        title: "Stałe kredyty",
        description: "Nigdy nie wygasają",
      },
      free: {
        title: "Darmowe kredyty",
        description: "Kredyty próbne",
      },
    },
    overview: {
      howItWorks: {
        title: "Jak działają kredyty",
        description: "Zrozumienie systemu kredytów",
        expiring: {
          title: "Wygasające kredyty",
          description:
            "Kredyty z miesięcznych subskrypcji wygasają na koniec każdego cyklu rozliczeniowego. Użyj ich, zanim wygasną!",
        },
        permanent: {
          title: "Stałe kredyty",
          description:
            "Zakupione pakiety kredytów nigdy nie wygasają. Kup raz, używaj w dowolnym momencie. Idealne dla okazjonalnych użytkowników.",
        },
        free: {
          title: "Darmowe kredyty",
          description:
            "Każdy otrzymuje 20 darmowych kredytów do wypróbowania naszej usługi. Zacznij rozmawiać z AI natychmiast!",
        },
      },
      costs: {
        title: "Koszty kredytów",
        description: "Zobacz, ile kosztuje każda funkcja",
        models: {
          title: "Modele AI (na wiadomość)",
          gpt4: "GPT-4",
          claude: "Claude Sonnet",
          gpt35: "GPT-3.5",
          llama: "Llama 3",
          cost: "{{count}} kredyty",
        },
        features: {
          title: "Funkcje",
          search: "Wyszukiwanie Brave",
          tts: "Tekst na mowę",
          stt: "Mowa na tekst",
          searchCost: "+1 kredyt",
          audioCost: "+2 kredyty",
        },
      },
    },
    buy: {
      subscription: {
        badge: "Najlepsza wartość",
        title: "Subskrypcja miesięczna",
        description:
          "Otrzymuj kredyty co miesiąc, które wygasają na koniec cyklu rozliczeniowego",
        perMonth: "/miesiąc",
        features: {
          credits: "{{count}} kredytów miesięcznie",
          expiry: "Kredyty wygasają co miesiąc",
          bestFor: "Najlepsze dla regularnych użytkowników",
        },
        button: "Subskrybuj teraz",
      },
      pack: {
        title: "Pakiety kredytów",
        description: "Kup kredyty, które nigdy nie wygasają",
        badge: "Nigdy nie wygasa",
        perPack: "/pakiet",
        quantity: "Ilość",
        total: "{{count}} kredyty",
        features: {
          credits: "{{count}} kredyty",
          permanent: "Nigdy nie wygasa",
          expiry: "Nigdy nie wygasa",
          bestFor: "Najlepsze dla okazjonalnego użytku",
        },
        button: "Kup {{count}} {{type}}",
        totalPrice: "Razem: {{price}}",
        pack: "Pakiet",
        packs: "Pakiety",
      },
    },
    history: {
      title: "Historia transakcji",
      description: "Twoje ostatnie transakcje kredytowe",
      empty: {
        title: "Brak transakcji",
        description: "Twoja historia transakcji kredytowych pojawi się tutaj",
      },
      balance: "Saldo: {{count}}",
      loadMore: "Załaduj więcej",
      types: {
        purchase: "Zakup",
        subscription: "Subskrypcja",
        usage: "Użycie",
        expiry: "Wygaśnięcie",
        free_tier: "Darmowy poziom",
      },
    },
    tabs: {
      overview: "Przegląd",
      buy: "Kup kredyty",
      billing: "Rozliczenia",
      history: "Historia",
      plans: "Plany",
    },
  },
  meta: {
    subscription: {
      title: "Subskrypcja i kredyty",
      description: "Zarządzaj swoją subskrypcją, kredytami i rozliczeniami",
      category: "Konto",
      imageAlt: "Zarządzanie subskrypcją i kredytami",
      keywords: {
        subscription: "subskrypcja",
        billing: "rozliczenia",
        plans: "plany",
        pricing: "cennik",
      },
    },
  },
};
