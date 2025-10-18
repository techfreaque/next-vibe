import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
    stripeCustomerFailed: "Nie udało się utworzyć klienta Stripe",
    checkoutFailed: "Nie udało się utworzyć sesji płatności",
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
  purchase: {
    post: {
      title: "Kup kredyty",
      description: "Utwórz sesję płatności Stripe dla zakupu pakietu kredytów",
      container: {
        title: "Kup kredyty",
        description: "Kup pakiety kredytów, aby korzystać z funkcji AI",
      },
      quantity: {
        label: "Ilość",
        description: "Liczba pakietów kredytowych do zakupu (1-10)",
        placeholder: "Wprowadź ilość (1-10)",
      },
      checkoutUrl: {
        content: "URL płatności",
      },
      sessionId: {
        content: "ID sesji",
      },
      totalAmount: {
        content: "Łączna kwota (centy)",
      },
      totalCredits: {
        content: "Łączne kredyty",
      },
      success: {
        title: "Płatność utworzona",
        description: "Sesja płatności Stripe utworzona pomyślnie",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowa ilość zakupu",
        },
        network: {
          title: "Błąd sieci",
          description: "Połączenie sieciowe nie powiodło się",
        },
        unauthorized: {
          title: "Nieautoryzowany",
          description: "Musisz być zalogowany, aby kupić kredyty",
        },
        forbidden: {
          title: "Zabronione",
          description: "Nie masz uprawnień do zakupu kredytów",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Zasób nie znaleziony",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się utworzyć sesji płatności",
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
