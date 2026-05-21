export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    subscriptions: "Subskrypcje",
  },
  get: {
    title: "Suma użycia zasobów",
    description:
      "Zwraca łączne użycie dla określonego typu zasobu na podstawie wpisów dziennika.",
    resourceType: {
      label: "Typ zasobu",
      description:
        "Typ zasobu do zapytania (np. DEVICES, USERS, ORGANIZATIONS, DEVICE_DATA, DEVICE_VPN, CREDITS).",
    },
    orgResourceId: {
      label: "ID zasobu organizacji",
      description: "Filtruj po ID zasobu organizacji.",
    },
    deviceLabel: {
      label: "Etykieta urządzenia",
      description: "Filtruj po etykiecie urządzenia.",
    },
    organizationFilter: {
      label: "Filtr organizacji",
      description: "Filtruj według organizacji.",
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
      totalUsage: "Łączne użycie",
    },
    widget: {
      title: "Suma użycia zasobów",
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
        description: "Nie znaleziono danych.",
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
      description: "Suma użycia zasobów pobrana pomyślnie.",
    },
  },
};
