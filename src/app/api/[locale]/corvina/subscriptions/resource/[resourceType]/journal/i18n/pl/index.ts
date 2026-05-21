export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    subscriptions: "Subskrypcje",
  },
  get: {
    title: "Dziennik użycia zasobów",
    description:
      "Zwraca paginowane wpisy dziennika dla określonego typu zasobu.",
    resourceType: {
      label: "Typ zasobu",
      description:
        "Typ zasobu do zapytania (np. DEVICES, USERS, ORGANIZATIONS, DEVICE_DATA, DEVICE_VPN, CREDITS).",
    },
    orgResourceId: {
      label: "ID zasobu organizacji",
      description: "Filtruj wpisy dziennika po ID zasobu organizacji.",
    },
    deviceLabel: {
      label: "Etykieta urządzenia",
      description: "Filtruj wpisy dziennika po etykiecie urządzenia.",
    },
    organizationFilter: {
      label: "Filtr organizacji",
      description: "Filtruj wpisy dziennika według organizacji.",
    },
    includeSubOrgs: {
      label: "Uwzględnij podorganizacje",
      description: "Czy uwzględniać wpisy z podorganizacji.",
    },
    fromDate: {
      label: "Data od",
      description: "Sygnatura czasowa początku w milisekundach.",
    },
    toDate: {
      label: "Data do",
      description: "Sygnatura czasowa końca w milisekundach.",
    },
    page: {
      label: "Strona",
      description: "Numer strony (od zera).",
    },
    pageSize: {
      label: "Rozmiar strony",
      description: "Liczba wpisów na stronie.",
    },
    response: {
      items: {
        usage: "Użycie",
        timestamp: "Sygnatura czasowa",
        grantingOrganization: "Organizacja przyznająca",
        dealerOrganization: "Organizacja dealera",
        organization: "Organizacja",
        licenseCode: "Kod licencji",
        deviceId: "ID urządzenia",
        deviceLogicalId: "Logiczny ID urządzenia",
        deviceSerialNumber: "Numer seryjny urządzenia",
      },
      total: "Łącznie",
      totalPages: "Łączna liczba stron",
      currentPage: "Bieżąca strona",
    },
    widget: {
      title: "Dziennik użycia zasobów",
      noItemsFound: "Nie znaleziono wpisów dziennika.",
      back: "Wstecz",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Żądanie jest nieprawidłowe.",
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
        description: "Brak uprawnień.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono wpisów dziennika.",
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
      title: "Dane pobrane",
      description: "Dziennik użycia zasobów pobrany pomyślnie.",
    },
  },
};
