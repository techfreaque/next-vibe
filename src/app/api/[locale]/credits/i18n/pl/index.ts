import { translations as purchaseTranslations } from "../../purchase/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Kredyty",
  tags: {
    credits: "kredyty",
    balance: "saldo",
  },
  purchase: purchaseTranslations,
  repository: {
    tts: "Tekst na mowę",
    stt: "Mowa na tekst",
    search: "Wyszukiwanie",
    sttHotkey: "Mowa na tekst (Skrót klawiszowy)",
  },
  enums: {
    creditType: {
      userSubscription: "Kredyty subskrypcji użytkownika",
      leadFree: "Darmowe kredyty leada",
    },
    transactionType: {
      purchase: "Zakup",
      subscription: "Subskrypcja",
      usage: "Użycie",
      expiry: "Wygaśnięcie",
      freeTier: "Darmowy",
      monthlyReset: "Miesięczne odnowienie",
      freeGrant: "Darmowe przyznanie",
      freeReset: "Darmowe odnowienie",
      refund: "Zwrot",
      transfer: "Transfer",
      otherDevices: "Wydatki z powiązanych urządzeń/sesji",
      referralEarning: "Zarobki z polecenia",
      referralPayout: "Wypłata z polecenia",
    },
    packType: {
      subscription: "Subskrypcja",
      permanent: "Stałe",
      bonus: "Bonus",
      earned: "Zarobione",
    },
  },
  expire: {
    post: {
      title: "Wygaś kredyty",
      description:
        "Wygasza stare kredyty subskrypcyjne (wywoływane przez cron)",
      tag: "wygaśnięcie",
      container: {
        title: "Wygaś kredyty",
        description: "Wyniki wygasania kredytów",
      },
      response: {
        expiredCount: "Liczba wygasłych",
      },
      success: {
        title: "Kredyty wygasły",
        description: "Stare kredyty subskrypcyjne wygasły pomyślnie",
      },
      errors: {
        unauthorized: {
          title: "Nieautoryzowany",
          description: "Wymagane uwierzytelnienie",
        },
        forbidden: {
          title: "Zabronione",
          description: "Odmowa dostępu",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się wygasić kredytów",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe parametry żądania",
        },
      },
    },
    task: {
      description: "Wygasa stare kredyty subskrypcyjne codziennie",
      error: "Nie udało się wygasić kredytów",
    },
  },
  cleanup: {
    task: {
      description: "Czyści osierocone portfele leadów tygodniowo",
      error: "Nie udało się wyczyścić osieroconych portfeli",
    },
  },
  errors: {
    getBalanceFailed: "Nie udało się pobrać salda kredytów",
    getLeadBalanceFailed: "Nie udało się pobrać salda kredytów leada",
    getOrCreateLeadFailed: "Nie udało się pobrać lub utworzyć leada",
    addCreditsFailed: "Nie udało się dodać kredytów",
    deductCreditsFailed: "Nie udało się odjąć kredytów",
    insufficientCredits:
      "Niewystarczające kredyty. Potrzebujesz {{cost}} kredytów, aby użyć tej funkcji.",
    deductionFailed: "Nie udało się odjąć {{cost}} kredytów. Spróbuj ponownie.",
    getTransactionsFailed: "Nie udało się pobrać transakcji kredytowych",
    invalidIdentifier: "Nieprawidłowy identyfikator użytkownika lub leada",
    userNotFound: "Nie znaleziono użytkownika",
    noLeadFound: "Nie znaleziono leada dla użytkownika",
    getCreditIdentifierFailed: "Nie udało się pobrać identyfikatora kredytu",
    noCreditSource: "Brak dostępnego źródła kredytów",
    stripeCustomerFailed: "Nie udało się utworzyć klienta Stripe",
    checkoutFailed: "Nie udało się utworzyć sesji płatności",
    mergeFailed: "Nie udało się połączyć kredytów leada",
    mergeLeadWalletsFailed:
      "Nie udało się połączyć portfeli leadów z kontem użytkownika",
    cleanupOrphanedFailed:
      "Nie udało się wyczyścić osieroconych portfeli leadów",
    monthlyResetFailed: "Nie udało się odnowić miesięcznych kredytów",
    noLeadsToMerge: "Brak leadów do połączenia",
    oldestLeadNotFound: "Nie znaleziono najstarszego leada w klastrze",
    transactionFailed: "Nie udało się utworzyć rekordu transakcji",
    not_implemented_on_native:
      "{{method}} nie jest zaimplementowana na platformie natywnej. Użyj wersji webowej dla tej operacji.",
    expireCreditsFailed: "Nie udało się wygasić kredytów",
    invalidAmount: "Kwota kredytu musi być liczbą dodatnią",
    walletNotFound: "Nie znaleziono portfela",
    walletCreationFailed: "Nie udało się utworzyć portfela",
    addEarnedCreditsFailed: "Nie udało się dodać zarobionych kredytów",
    getEarnedBalanceFailed: "Nie udało się pobrać salda zarobionych kredytów",
    insufficientEarnedCredits:
      "Niewystarczające zarobione kredyty dla tej operacji",
    deductEarnedCreditsFailed: "Nie udało się odjąć zarobionych kredytów",
    getReferralTransactionsFailed: "Nie udało się pobrać transakcji poleceń",
  },
  get: {
    title: "Pobierz saldo kredytów",
    description: "Pobierz aktualne saldo kredytów z podziałem",
    response: {
      title: "Saldo kredytów",
      description: "Twoje aktualne saldo kredytów i podział",
    },
    balance: {
      title: "Twoje saldo kredytów",
      adminTitle: "Limit wydatków",
      description: "Używaj kredytów w {{modelCount}} modelach AI",
      adminDescription:
        "Kredyty działają jako limit wydatków - kontroluj dozwolone użycie AI przez wszystkich użytkowników.",
      credit: "{{count}} kredyt",
      credits: "{{count}} kredytów",
      expiring: {
        title: "Wygasające kredyty",
        description: "{{subCredits}} nowych kredytów na cykl subskrypcji",
        adminDescription: "Kredyty z limitem czasowym (cykl subskrypcji)",
      },
      permanent: {
        title: "Stałe kredyty",
        description: "Nie wygasają - należą do Ciebie",
        adminDescription: "Stałe kredyty - nie wygasają",
      },
      free: {
        title: "Darmowe kredyty",
        description: "{{count}} darmowych kredytów odnawiane co miesiąc",
        adminDescription:
          "{{count}} darmowych kredytów na pulę/miesiąc (wspólne dla urządzeń)",
      },
      earned: {
        title: "Zarobione kredyty",
        description:
          "Zarobione przez polecenia - kliknij, aby zaprosić znajomych",
      },
      spending: {
        title: "Twoje zarobione kredyty",
        adminDescription:
          "Twoje osobiste zarobki z poleceń (nie dla całej instancji)",
      },
    },
    total: {
      content: "Łączne kredyty",
    },
    expiring: {
      content: "Wygasające kredyty (Subskrypcja)",
    },
    permanent: {
      content: "Stałe kredyty (Pakiety)",
    },
    free: {
      content: "Darmowe kredyty",
    },
    earned: {
      content: "Zarobione kredyty (Polecenia)",
    },
    expiresAt: {
      content: "Wygasa",
    },
    success: {
      title: "Saldo pobrane",
      description: "Saldo kredytów pobrane pomyślnie",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      network: {
        title: "Błąd sieci",
        description: "Połączenie sieciowe nie powiodło się",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Musisz być zalogowany, aby zobaczyć swoje saldo kredytów",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do tego zasobu",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasób nie znaleziony",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się pobrać salda kredytów",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      noActiveSubscription: {
        title: "Wymagane aktywne subskrypcja",
        description:
          "Musisz mieć aktywną subskrypcję, aby kupić pakiety kredytów",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt zasobów",
      },
      no_active_subscription: {
        title: "Wymagane aktywne subskrypcja",
        description:
          "Musisz mieć aktywną subskrypcję, aby kupić pakiety kredytów",
      },
    },
  },
  history: {
    get: {
      title: "Pobierz historię kredytów",
      description: "Pobierz stronicowaną historię transakcji kredytowych",
      container: {
        title: "Historia kredytów",
        description: "Zobacz swoją historię transakcji kredytowych",
      },
      emptyState: "Brak transakcji kredytowych",
      balance: "Saldo po: {{count}}",
      limit: {
        label: "Limit",
        description: "Maksymalna liczba transakcji do zwrócenia (1-100)",
      },
      offset: {
        label: "Przesunięcie",
        description: "Liczba transakcji do pominięcia dla stronicowania",
      },
      targetUserId: {
        label: "ID docelowego użytkownika",
      },
      targetLeadId: {
        label: "ID docelowego leada",
      },
      id: "ID transakcji",
      amount: "Kwota",
      type: "Typ",
      modelId: "Model",
      messageId: "ID wiadomości",
      createdAt: "Data",
      transactions: {
        title: "Transakcje",
        description: "Lista transakcji kredytowych",
      },
      paginationInfo: {
        total: "Łączne transakcje",
        totalPages: "Łączne strony",
      },
      totalCount: {
        content: "Łączna liczba",
      },
      transaction: {
        id: {
          content: "ID transakcji",
        },
        amount: {
          content: "Kwota",
        },
        balanceAfter: {
          content: "Saldo po",
        },
        type: {
          content: "Typ",
        },
        modelId: {
          content: "Model",
        },
        messageId: {
          content: "ID wiadomości",
        },
        createdAt: {
          content: "Data",
        },
      },
      success: {
        title: "Historia pobrana",
        description: "Historia kredytów pobrana pomyślnie",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe parametry żądania",
        },
        network: {
          title: "Błąd sieci",
          description: "Połączenie sieciowe nie powiodło się",
        },
        unauthorized: {
          title: "Nieautoryzowany",
          description:
            "Musisz być zalogowany, aby zobaczyć swoją historię kredytów",
        },
        forbidden: {
          title: "Zabronione",
          description: "Nie masz uprawnień do tego zasobu",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Zasób nie znaleziony",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się pobrać historii kredytów",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
        conflict: {
          title: "Konflikt",
          description: "Wystąpił konflikt zasobów",
        },
      },
    },
  },
  adminAdd: {
    post: {
      title: "Dodaj kredyty",
      description: "Dodaj pakiety kredytów do konta użytkownika (tylko admin)",
      tag: "admin",
      container: {
        title: "Dodaj kredyty użytkownikowi",
        description: "Przyznaj bonusowe kredyty konkretnemu kontu użytkownika",
        selfTitle: "Dodaj kredyty do swojego konta",
        selfDescription: "Przyznaj sobie bonusowe kredyty",
      },
      targetUserId: {
        label: "ID użytkownika docelowego",
        description: "Użytkownik, któremu zostaną dodane kredyty",
      },
      amount: {
        label: "Kwota",
        description: "Liczba kredytów do dodania",
        placeholder: "Wprowadź kwotę kredytów...",
      },
      packType: {
        label: "Typ pakietu",
        description: "Rodzaj pakietu kredytów",
      },
      response: {
        message: {
          content: "Wynik",
        },
      },
      success: {
        title: "Kredyty dodane",
        description: "Kredyty zostały dodane do konta użytkownika",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe parametry żądania",
        },
        network: {
          title: "Błąd sieci",
          description: "Połączenie sieciowe nie powiodło się",
        },
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Wymagane uwierzytelnienie",
        },
        forbidden: {
          title: "Zabronione",
          description: "Wymagany dostęp administratora",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Nie znaleziono użytkownika",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się dodać kredytów",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
        conflict: {
          title: "Konflikt",
          description: "Wystąpił konflikt zasobów",
        },
      },
    },
  },
  email: {
    creditPack: {
      user: {
        subject: "Twój pakiet kredytów jest gotowy - {{appName}}",
        title: "Kredyty zostały dodane do Twojego konta",
        previewText: "{{credits}} kredytów zostało dodanych do Twojego konta",
        greeting: "Cześć {{privateName}},",
        body: "Zakup pakietu kredytów zakończył się sukcesem. {{credits}} stałych kredytów zostało dodanych do Twojego konta i jest gotowych do użycia.",
        cta: "Zacznij używać kredytów",
        signoff: "Dziękujemy za zakup!\n\nZespół {{appName}}",
      },
      admin: {
        subject:
          "[{{appName}}] Zakupiono pakiet kredytów - {{credits}} kredytów",
        title: "Zakup pakietu kredytów",
        preview: "Użytkownik zakupił pakiet kredytów",
        body: "Użytkownik zakupił pakiet kredytów.",
        labelUser: "Użytkownik",
        labelCredits: "Kredyty",
        footer: "Automatyczne powiadomienie od {{appName}}",
      },
    },
  },
};
