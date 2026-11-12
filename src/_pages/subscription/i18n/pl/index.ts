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
    canceledOn: "Anulowano",
    endedOn: "Zakończono",
    cancellation: {
      title: "Subskrypcja zaplanowana do anulowania",
      description:
        "Twoja subskrypcja zakończy się {{date}}. Zachowasz dostęp do tego czasu.",
    },
    canceled: {
      title: "Subskrypcja anulowana",
      description:
        "Twoja subskrypcja została anulowana. Możesz w każdej chwili ponownie zasubskrybować, aby odzyskać dostęp do miesięcznych kredytów.",
    },
    manage: {
      stripe: {
        button: "Zarządzaj subskrypcją",
      },
      nowpayments: {
        button: "Zobacz szczegóły subskrypcji",
        info: "Twoja subskrypcja jest zarządzana przez e-mail. Sprawdź swoją skrzynkę odbiorczą w poszukiwaniu linków do płatności i szczegółów subskrypcji od NOWPayments.",
      },
      portal: {
        error: "Nie udało się otworzyć portalu płatności. Spróbuj ponownie.",
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
        description:
          "{{guest}} darmowych kredytów miesięcznie jako gość, {{signedIn}} po zalogowaniu, +{{bonus}} z newsletterem",
      },
      earned: {
        title: "Zarobione kredyty",
        description: "Zarabiaj zapraszając znajomych →",
      },
    },
    overview: {
      howItWorks: {
        title: "Jak działają kredyty",
        description:
          "Jedna waluta dla każdego modelu. Subskrybuj, doładuj albo zacznij za darmo.",
        expiring: {
          title: "Plan miesięczny",
          description:
            "{{subPrice}}/mies. {{subCredits}} kredytów co miesiąc i dostęp do {{modelCount}} modeli AI.",
        },
        permanent: {
          title: "Pakiety kredytów",
          description:
            "{{packPrice}} za {{packCredits}} kredytów albo {{largePackPrice}} za {{largePackCredits}}. Nie wygasają. Bez subskrypcji.",
        },
        free: {
          title: "Darmowe kredyty",
          description:
            "{{guest}} miesięcznie jako gość. {{signedIn}} z darmowym kontem, +{{bonus}} z newsletterem. Bez karty.",
        },
      },
      costs: {
        title: "Ile to kosztuje",
        description:
          "Kredyty za wiadomość, obraz, klip lub wywołanie narzędzia.",
        models: {
          title: "Modele AI (na wiadomość)",
          gpt4: "GPT-4",
          claude: "Claude Sonnet",
          gpt35: "GPT-3.5",
          llama: "Llama 3",
          cost: "{{count}} kredyty",
          showLegacy: "Pokaż starsze modele",
          hideLegacy: "Ukryj starsze modele",
          free: "Bezpłatny",
          approxCost: "~kredytów",
          legacyBadge: "Starszy",
          types: {
            text: "Czat",
            tts: "Tekst na mowę",
            stt: "Mowa na tekst",
            image: "Generowanie obrazów",
            audio: "Generowanie muzyki",
            video: "Generowanie wideo",
          },
        },
        features: {
          title: "Funkcje",
          braveSearchLabel: "Wyszukiwanie Brave (na wyszukiwanie)",
          kagiSearchLabel: "Wyszukiwanie Kagi (na wyszukiwanie)",
          fetchUrlLabel:
            "Pobierz stronę internetową jako tekst (na pobieranie)",
          costFormat: "{{value}} {{unit}}",
          creditsUnit: "kredytów",
        },
      },
      cta: {
        title: "Odblokuj wszystkie modele.",
        description:
          "Miesięczne kredyty na {{modelCount}} modeli AI. Doładowuj pakietami, kiedy chcesz.",
        button: "Subskrybuj",
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
        cryptoMonthlyDisabled:
          "Płatności kryptowalutą są dostępne tylko dla subskrypcji rocznych ze względu na wymagania minimalnej wartości transakcji (minimum 80 PLN).",
        cryptoMinimumPacks:
          "Płatności kryptowalutą wymagają minimum {{minPacks}} pakietów kredytów ({{minValue}}) ze względu na wymagania minimalnej wartości transakcji.",
      },
      subscription: {
        badge: "Dostępne dla wszystkich",
        title: "Subskrypcja miesięczna",
        description:
          "{{subPrice}}/miesiąc - {{subCredits}} kredytów miesięcznie ze wszystkimi {{modelCount}} modelami AI",
        perMonth: "/miesiąc",
        perYear: "/rok",
        yearlyEquivalent:
          "Tylko {{monthlyPrice}}/miesiąc przy rozliczeniu rocznym",
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
          "Płacisz za to, co zużyjesz. Bez subskrypcji. Kredyty nie wygasają.",
        badge: "Bez subskrypcji",
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
        other_devices: "Wydatki z innych urządzeń",
        referral_earning: "Zarobki z poleceń",
        referral_payout: "Wypłata z poleceń",
      },
    },
    tabs: {
      overview: "Przegląd",
      buy: "Kup kredyty",
      adminBuy: "Zarządzaj kredytami",
      billing: "Rozliczenia",
      history: "Historia",
      plans: "Plany",
      remote: "Synchronizacja",
    },
    admin: {
      title: "Kredyty i Limity",
      description:
        "Zarządzaj przydziałami kredytów i limitami użycia tej instancji",
      allocate: {
        title: "Przydziel kredyty",
        description:
          "Dodaj kredyty do dowolnego konta użytkownika. Kredyty działają jako limit wydatków - kontrolują, ile użycia AI jest dozwolone.",
        howItWorks: {
          title: "Jak działają limity kredytów",
          freePool: {
            title: "Darmowa pula (współdzielona)",
            description:
              "Wszyscy użytkownicy współdzielą pulę darmowych kredytów, która jest odnawiana miesięcznie.",
          },
          bonus: {
            title: "Kredyty bonusowe (na użytkownika)",
            description:
              "Kredyty bonusowe są stałe - nigdy nie wygasają i sumują się z kredytami z puli.",
          },
          apiKeys: {
            title: "Usuń wszystkie limity",
            description:
              "Skonfiguruj własne klucze API LLM w ustawieniach, aby całkowicie ominąć kredyty.",
          },
        },
      },
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
    category: "Cennik",
    imageAlt: "Cennik {{appName}}: kredyty na każdy model AI",
    keywords:
      "cennik czatu AI, AI bez cenzury cena, płatność za wiadomość AI, kredyty AI, {{appName}}",
    overview: {
      title: "Cennik - płacisz za wiadomość, bez zobowiązań | {{appName}}",
      description:
        "{{freeCredits}} darmowych kredytów co miesiąc. {{subCredits}} kredytów za {{subPrice}} miesięcznie albo pakiet, który nigdy nie wygasa. Jedno saldo na {{modelCount}} modeli, od mainstreamu po bez cenzury.",
    },
    buyCredits: {
      title: "Kup kredyty - subskrypcja lub pakiety | {{appName}}",
      description:
        "{{subCredits}} kredytów miesięcznie za {{subPrice}} albo pakiety kredytów bez daty ważności. Płać kartą lub kryptowalutą. Do użycia z {{modelCount}} modelami AI.",
    },
    history: {
      title: "Historia kredytów | {{appName}}",
      description:
        "Każdy kredyt na plus i na minus: zakupy, miesięczne przydziały, prowizje z poleceń i koszt każdego czatu.",
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
