export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    wallet: "Portfel",
  },
  get: {
    title: "Historia transakcji portfela",
    description:
      "Pobiera stronicowaną historię transakcji kredytowych portfela Corvina.",
    walletId: {
      label: "ID portfela",
      description: "ID portfela, którego historia ma zostać pobrana.",
    },
    page: {
      label: "Strona",
      description: "Numer strony (od zera).",
    },
    pageSize: {
      label: "Rozmiar strony",
      description: "Liczba transakcji na stronie.",
    },
    orderBy: {
      label: "Sortuj według",
      description: "Pole sortowania — np. id, serialNumber.",
    },
    orderDir: {
      label: "Kierunek sortowania",
      description: "Kierunek sortowania — ASC lub DESC.",
    },
    response: {
      total: "Łącznie",
      totalPages: "Stron łącznie",
      currentPage: "Bieżąca strona",
      transactions: {
        id: "ID",
        executionResult: "Wynik",
        failureReason: "Przyczyna błędu",
        sourceWalletId: "Portfel źródłowy",
        targetWalletId: "Portfel docelowy",
        amount: "Kwota",
        createdAt: "Utworzono",
        authorizedBy: "Autoryzowane przez",
        description: "Opis",
        orderId: "ID zamówienia",
        orgResourceId: "ID zasobu organizacji",
      },
    },
    widget: {
      title: "Transakcje",
      noItemsFound: "Nie znaleziono transakcji.",
      back: "Wstecz",
      success: "SUKCES",
      failure: "BŁĄD",
      noop: "NOOP",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Żądanie do Corvina było nieprawidłowe.",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z API Corvina.",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Corvina odrzuciła klucz API.",
      },
      forbidden: {
        title: "Zabronione",
        description: "Klucz API nie ma uprawnień do historii tego portfela.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono portfela o podanym ID.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina zgłosiła konflikt.",
      },
      server: {
        title: "Błąd serwera",
        description: "Corvina zwróciła wewnętrzny błąd serwera.",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Występują niezapisane zmiany.",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd.",
      },
    },
    success: {
      title: "Sukces",
      description: "Historia transakcji pobrana pomyślnie.",
    },
  },
};
