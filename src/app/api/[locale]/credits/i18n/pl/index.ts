import { translations as purchaseTranslations } from "../../purchase/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
      otherDevices: "Wydatki z innych urządzeń",
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
};
