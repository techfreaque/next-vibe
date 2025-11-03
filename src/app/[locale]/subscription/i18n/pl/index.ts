import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  subscription: {
    title: "Kredyty",
    description: "Zarządzaj swoimi kredytami i subskrypcjami",
    backToChat: "Powrót do czatu",
    billingInterval: "Okres rozliczeniowy",
    currentPeriodStart: "Początek bieżącego okresu",
    nextBillingDate: "Następna data rozliczenia",
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
        description: "Zrozumienie systemu kredytów",
        expiring: {
          title: "Kredyty z subskrypcji miesięcznej",
          description:
            "€10/miesiąc daje 1000 kredytów, które wygasają na koniec każdego cyklu rozliczeniowego. Przystępne ceny dla wszystkich!",
        },
        permanent: {
          title: "Dodatkowe kredyty dla zaawansowanych użytkowników",
          description:
            "Potrzebujesz więcej? Kup pakiety kredytów (€5 za 500 kredytów), które nigdy nie wygasają. Idealne dla zaawansowanych użytkowników potrzebujących dodatkowej pojemności.",
        },
        free: {
          title: "Darmowe kredyty testowe",
          description:
            "Każdy otrzymuje 20 darmowych kredytów do wypróbowania naszej usługi. Nie wymaga karty kredytowej!",
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
      subscription: {
        badge: "Dostępne dla wszystkich",
        title: "Subskrypcja miesięczna",
        description:
          "€10/miesiąc - Przystępny dostęp do AI dla wszystkich z 1000 kredytów miesięcznie",
        perMonth: "/miesiąc",
        features: {
          credits: "{{count}} kredytów miesięcznie",
          expiry: "Kredyty wygasają co miesiąc",
          bestFor: "Przystępne ceny dla wszystkich użytkowników",
        },
        button: "Subskrybuj teraz",
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
          "Subskrybuj miesięczny plan, aby kupić dodatkowe pakiety kredytów.",
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
