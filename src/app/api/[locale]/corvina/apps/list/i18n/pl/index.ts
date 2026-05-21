export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    apps: "Aplikacje",
  },
  get: {
    title: "Sklep z aplikacjami",
    description:
      "Przeglądaj wszystkie dostępne aplikacje w marketplace Corvina.",
    response: {
      title: "Aplikacje",
      description: "Wszystkie aplikacje dostępne w marketplace.",
      apps: {
        title: "Aplikacje",
        description: "Jeden wiersz na aplikację marketplace.",
        appDescription: "Opis",
        id: "ID",
        key: "Klucz",
        name: "Nazwa",
        status: "Status",
        coverImageUrl: "Okładka",
        iconUrl: "Ikona",
        version: "Wersja",
      },
      total: "Łącznie",
      totalPages: "Strony",
      currentPage: "Bieżąca strona",
    },
    widget: {
      title: "Marketplace aplikacji Corvina",
      noAppsFound: "Nie znaleziono aplikacji w marketplace",
      install: "Zainstaluj",
      search: "Szukaj aplikacji...",
      installedApps: "Zainstalowane aplikacje",
      installApp: "Zainstaluj własną",
    },
    enums: {
      appStoreStatus: {
        active: "Aktywna",
        underEvaluation: "W ocenie",
      },
      installStatus: {
        installation: "Instalowanie",
        installed: "Zainstalowana",
        installationFailed: "Instalacja nieudana",
        uninstallation: "Odinstalowywanie",
        uninstalled: "Odinstalowana",
        uninstallationFailed: "Odinstalowanie nieudane",
        manualUpgradable: "Dostępna aktualizacja",
        freeTrial: "Bezpłatny okres próbny",
        paymentRequired: "Wymagana płatność",
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
        description: "Klucz API nie ma uprawnień do listowania aplikacji.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono aplikacji pod tym adresem.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina zgłosiła konflikt podczas pobierania aplikacji.",
      },
      server: {
        title: "Błąd serwera",
        description: "API Corvina zwróciło błąd wewnętrzny.",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Istnieją niezapisane zmiany.",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd.",
      },
    },
    success: {
      title: "Sukces",
      description: "Aplikacje pobrane pomyślnie.",
    },
  },
};
