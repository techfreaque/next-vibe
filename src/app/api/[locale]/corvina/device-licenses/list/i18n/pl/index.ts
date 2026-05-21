export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    deviceLicenses: "Licencje urządzeń",
  },
  get: {
    title: "Lista licencji urządzeń",
    description:
      "Pobiera stronicowaną listę licencji urządzeń z platformy Corvina.",
    page: {
      label: "Strona",
      description: "Numer strony (od zera).",
    },
    pageSize: {
      label: "Rozmiar strony",
      description: "Liczba licencji urządzeń na stronie.",
    },
    orgResourceId: {
      label: "ID zasobu organizacji",
      description: "Filtruj licencje po ID zasobu organizacji.",
    },
    response: {
      total: "Łącznie",
      totalPages: "Stron łącznie",
      currentPage: "Bieżąca strona",
      deviceLicenses: {
        id: "ID",
        serialNumber: "Numer seryjny",
        realm: "Obszar",
        logicalId: "Identyfikator logiczny",
        label: "Etykieta",
        apiKey: "Klucz API",
        orgResourceId: "ID zasobu organizacji",
        vpnKey: "Klucz VPN",
        fromDateVpn: "Data rozpoczęcia VPN",
        toDateVpn: "Data zakończenia VPN",
        numOfSecondsAutoRenewVpn: "Autoodnawianie VPN (s)",
        activationDate: "Data aktywacji",
        used: "Używana",
        deleted: "Usunięta",
        activationKey: "Klucz aktywacyjny",
        clientName: "Nazwa klienta",
        notes: "Notatki",
        vpnEnabled: "VPN włączony",
        vpnValidityMonths: "Ważność VPN (miesiące)",
        subscriptionStatus: "Status subskrypcji",
        subscriptionEndDate: "Koniec subskrypcji",
        daysUntilExpiry: "Dni do wygaśnięcia",
      },
    },
    widget: {
      title: "Licencje urządzeń",
      noItemsFound: "Nie znaleziono licencji urządzeń.",
      back: "Wstecz",
      refresh: "Odśwież",
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
        description:
          "Klucz API nie ma uprawnień do pobierania licencji urządzeń.",
      },
      notFound: {
        title: "Nie znaleziono",
        description:
          "Nie znaleziono licencji urządzeń dla podanych parametrów.",
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
      description: "Licencje urządzeń pobrane pomyślnie.",
    },
  },
  post: {
    title: "Utwórz licencję urządzenia",
    description: "Tworzy nową licencję urządzenia w platformie Corvina.",
    serialNumber: {
      label: "Numer seryjny",
      description: "Numer seryjny urządzenia powiązanego z licencją.",
    },
    activationKey: {
      label: "Klucz aktywacyjny",
      description: "Unikalny klucz aktywacyjny dla licencji urządzenia.",
    },
    clientName: {
      label: "Nazwa klienta",
      description: "Nazwa klienta lub użytkownika tej licencji.",
    },
    notes: {
      label: "Notatki",
      description: "Dowolne notatki dotyczące tej licencji urządzenia.",
    },
    vpnEnabled: {
      label: "VPN włączony",
      description: "Czy VPN jest włączony dla tego urządzenia.",
    },
    dataEnabled: {
      label: "Transmisja danych włączona",
      description: "Czy transmisja danych jest włączona dla tego urządzenia.",
    },
    vpnStartDate: {
      label: "Data rozpoczęcia VPN",
      description: "Data, od której dostęp VPN jest ważny.",
    },
    vpnEndDate: {
      label: "Data zakończenia VPN",
      description: "Data, do której dostęp VPN jest ważny.",
    },
    vpnValidityMonths: {
      label: "Ważność VPN (miesiące)",
      description: "Liczba miesięcy, przez które subskrypcja VPN jest ważna.",
    },
    vpnAccountingDisabled: {
      label: "Rozliczanie VPN wyłączone",
      description: "Wyłącz rozliczanie użycia VPN dla tego urządzenia.",
    },
    widget: {
      title: "Utwórz licencję urządzenia",
      back: "Wstecz",
      result: {
        title: "Licencja utworzona",
      },
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
        description:
          "Klucz API nie ma uprawnień do tworzenia licencji urządzeń.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono docelowej organizacji lub urządzenia.",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Licencja urządzenia z tym kluczem aktywacyjnym już istnieje.",
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
      title: "Utworzono",
      description: "Licencja urządzenia utworzona pomyślnie.",
    },
    submitButton: {
      label: "Utwórz licencję",
      loadingText: "Tworzenie...",
    },
  },
};
