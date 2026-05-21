export const translations = {
  tags: {
    corvina: "Corvina",
    apps: "Aplikacje",
  },
  get: {
    title: "Zainstalowane aplikacje",
    description:
      "Wyświetl wszystkie aplikacje zainstalowane w organizacji Corvina.",
    organizationId: {
      label: "ID organizacji",
      description: "Numeryczne ID organizacji Corvina.",
    },
    response: {
      title: "Zainstalowane aplikacje",
      description: "Aplikacje zainstalowane w organizacji.",
      installs: {
        title: "Instalacje",
        description: "Jeden wiersz na zainstalowaną aplikację.",
        id: "ID instalacji",
        status: "Status",
        appKey: "Klucz aplikacji",
        appName: "Nazwa aplikacji",
        manifestFrom: "Źródło",
        planId: "Plan",
        autoRenewActive: "Auto-odnowienie",
        freeTrial: "Okres próbny",
        serviceAccountUsername: "Konto serwisowe",
        createdAt: "Zainstalowano",
        updatedAt: "Zaktualizowano",
      },
      total: "Łącznie",
      totalPages: "Strony",
      currentPage: "Bieżąca strona",
    },
    widget: {
      title: "Zainstalowane aplikacje",
      noInstallsFound: "Brak zainstalowanych aplikacji w tej organizacji",
      back: "Wstecz",
      uninstall: "Odinstaluj",
      loadButton: "Załaduj",
      trialBadge: "Okres próbny",
      autoRenewBadge: "Auto-odnowienie",
      orgLabel: "Org",
      orgIdPlaceholder: "ID organizacji",
      appStore: "Sklep aplikacji",
      installApp: "Zainstaluj własną",
      source: {
        store: "Sklep",
        custom: "Własny",
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
        description: "Klucz API nie ma wymaganych uprawnień.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono organizacji.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina zgłosiła konflikt.",
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
      description: "Zainstalowane aplikacje pobrane pomyślnie.",
    },
  },
};
