import type { translations as enTranslations } from "../en";
import { translations as purchaseTranslations } from "../../purchase/i18n/pl";

export const translations: typeof enTranslations = {
  purchase: purchaseTranslations,
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
    },
  },
  expire: {
    task: {
      description: "Wygasa stare kredyty subskrypcyjne codziennie",
      error: "Nie udało się wygasić kredytów",
    },
  },
  errors: {
    getBalanceFailed: "Nie udało się pobrać salda kredytów",
    getLeadBalanceFailed: "Nie udało się pobrać salda kredytów leada",
    getOrCreateLeadFailed: "Nie udało się pobrać lub utworzyć leada",
    addCreditsFailed: "Nie udało się dodać kredytów",
    deductCreditsFailed: "Nie udało się odjąć kredytów",
    insufficientCredits: "Niewystarczające kredyty",
    getTransactionsFailed: "Nie udało się pobrać transakcji kredytowych",
    invalidIdentifier: "Nieprawidłowy identyfikator użytkownika lub leada",
    userNotFound: "Nie znaleziono użytkownika",
    noLeadFound: "Nie znaleziono leada dla użytkownika",
    getCreditIdentifierFailed: "Nie udało się pobrać identyfikatora kredytu",
    noCreditSource: "Brak dostępnego źródła kredytów",
    stripeCustomerFailed: "Nie udało się utworzyć klienta Stripe",
    checkoutFailed: "Nie udało się utworzyć sesji płatności",
    mergeFailed: "Nie udało się połączyć kredytów leada",
    monthlyResetFailed: "Nie udało się odnowić miesięcznych kredytów",
    noLeadsToMerge: "Brak leadów do połączenia",
    oldestLeadNotFound: "Nie znaleziono najstarszego leada w klastrze",
    transactionFailed: "Nie udało się utworzyć rekordu transakcji",
    not_implemented_on_native:
      "{{method}} nie jest zaimplementowana na platformie natywnej. Użyj wersji webowej dla tej operacji.",
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
      limit: {
        label: "Limit",
        description: "Maksymalna liczba transakcji do zwrócenia (1-100)",
      },
      offset: {
        label: "Przesunięcie",
        description: "Liczba transakcji do pominięcia dla stronicowania",
      },
      transactions: {
        title: "Transakcje",
        description: "Lista transakcji kredytowych",
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
