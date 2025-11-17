import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  subscription: {
    title: "Kredyty i Subskrypcja",
    description: "Zarządzaj swoimi kredytami i miesięczną subskrypcją",
    backToChat: "Powrót do czatu",
    billingInterval: "Okres rozliczeniowy",
    currentPeriodStart: "Początek bieżącego okresu",
    nextBillingDate: "Następna data rozliczenia",
    endsOn: "Subskrypcja kończy się",
    cancellation: {
      title: "Subskrypcja zaplanowana do anulowania",
      description:
        "Twoja subskrypcja zakończy się {{date}}. Zachowasz dostęp do tego czasu.",
    },
    manage: {
      stripe: {
        button: "Zarządzaj subskrypcją",
      },
      nowpayments: {
        button: "Zobacz szczegóły subskrypcji",
        info: "Twoja subskrypcja jest zarządzana przez e-mail. Sprawdź swoją skrzynkę odbiorczą w poszukiwaniu linków do płatności i szczegółów subskrypcji od NOWPayments.",
      },
    },
    balance: {
      title: "Saldo kredytów",
      description:
        "Twoje dostępne kredyty na rozmowy z AI z {{modelCount}} modelami",
      credit: "{{count}} kredyt",
      credits: "{{count}} kredytów",
      nextExpiration: "Następne wygaśnięcie",
      expiring: {
        title: "Kredyty subskrypcyjne",
        description:
          "Z miesięcznej subskrypcji ({{subCredits}} kredytów/miesiąc)",
      },
      permanent: {
        title: "Kredyty stałe",
        description: "Kredyty kupione w pakietach nigdy nie wygasają",
      },
      free: {
        title: "Darmowe miesięczne kredyty",
        description: "{{count}} darmowych kredytów miesięcznie dla wszystkich",
      },
    },
    overview: {
      howItWorks: {
        title: "Jak działają kredyty",
        description:
          "Subskrybuj dla {{subCredits}} miesięcznych kredytów i kupuj dodatkowe pakiety w razie potrzeby",
        expiring: {
          title: "Subskrypcja miesięczna",
          description:
            "{{subPrice}}/miesiąc - {{subCredits}} kredytów miesięcznie ze wszystkimi {{modelCount}} modelami AI. Idealne dla regularnych użytkowników!",
        },
        permanent: {
          title: "Dodatkowe pakiety kredytów",
          description:
            "{{packPrice}} za {{packCredits}} kredytów - Potrzebujesz więcej niż {{subCredits}} kredytów? Kup dodatkowe pakiety, które nigdy nie wygasają. Wymaga aktywnej subskrypcji.",
        },
        free: {
          title: "Darmowe kredyty testowe",
          description:
            "Każdy otrzymuje {{count}} darmowych kredytów do wypróbowania naszej usługi. Nie wymaga karty kredytowej!",
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
      signInRequired: {
        title: "Wymagane logowanie",
        description:
          "Zaloguj się lub utwórz konto, aby kupić kredyty i subskrypcje.",
      },
      provider: {
        stripe: {
          description: "Karty kredytowe/debetowe",
        },
        nowpayments: {
          description: "Kryptowaluta",
        },
      },
      subscription: {
        badge: "Dostępne dla wszystkich",
        title: "Subskrypcja miesięczna",
        description:
          "{{subPrice}}/miesiąc - {{subCredits}} kredytów miesięcznie ze wszystkimi {{modelCount}} modelami AI",
        perMonth: "/miesiąc",
        features: {
          credits: "{{count}} kredytów miesięcznie",
          expiry: "Dostęp do wszystkich {{modelCount}} modeli AI",
          bestFor: "Idealne dla regularnych użytkowników AI",
        },
        button: "Subskrybuj teraz",
        buttonAlreadySubscribed: "Już zasubskrybowano",
      },
      pack: {
        title: "Pakiety kredytów",
        description:
          "Dodatkowe kredyty dla zaawansowanych użytkowników (wymaga aktywnej subskrypcji)",
        badge: "Dla zaawansowanych",
        perPack: "/pakiet",
        quantity: "Ilość",
        total: "{{count}} kredyty",
        features: {
          credits: "{{count}} kredytów na pakiet",
          permanent: "Nigdy nie wygasa",
          expiry: "Nigdy nie wygasa",
          bestFor:
            "Dla zaawansowanych użytkowników potrzebujących dodatkowych kredytów",
        },
        button: {
          submit: "Kup pakiet kredytów",
        },
        totalPrice: "Razem: {{price}}",
        pack: "Pakiet",
        packs: "Pakiety",
        requiresSubscription:
          "Pakiety kredytów wymagają aktywnej subskrypcji. Subskrybuj, aby otrzymać miesięczne kredyty i odblokować możliwość kupowania pakietów kredytów!",
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
        monthly_reset: "Miesięczne odnowienie",
        free_grant: "Darmowe przyznanie",
        free_reset: "Darmowe odnowienie",
        refund: "Zwrot",
        transfer: "Transfer",
      },
    },
    tabs: {
      overview: "Przegląd",
      buy: "Kup kredyty",
      billing: "Rozliczenia",
      history: "Historia",
      plans: "Plany",
    },
    payment: {
      success: {
        title: "Płatność zakończona sukcesem",
        subscription:
          "Twoja subskrypcja została pomyślnie aktywowana! Twoje kredyty będą dostępne wkrótce.",
        credits:
          "Twój zakup pakietu kredytów zakończył się sukcesem! Twoje kredyty będą dostępne wkrótce.",
      },
      canceled: {
        title: "Płatność anulowana",
        subscription:
          "Twoja płatność za subskrypcję została anulowana. Możesz spróbować ponownie w dowolnym momencie.",
        credits:
          "Twój zakup pakietu kredytów został anulowany. Możesz spróbować ponownie w dowolnym momencie.",
      },
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
  payment: {
    success: {
      title: "Płatność zakończona sukcesem",
      subscription: "Twoja subskrypcja została pomyślnie aktywowana!",
      credits: "Zakup pakietu kredytów zakończony sukcesem!",
    },
    canceled: {
      title: "Płatność anulowana",
      subscription: "Płatność za subskrypcję została anulowana.",
      credits: "Zakup pakietu kredytów został anulowany.",
    },
  },
};
