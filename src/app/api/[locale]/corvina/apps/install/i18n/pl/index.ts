export const translations = {
  tags: {
    corvina: "Corvina",
    apps: "Aplikacje",
  },
  post: {
    title: "Zainstaluj aplikację Corvina",
    description:
      "Zainstaluj aplikację w organizacji Corvina przez manifest lub ID aplikacji ze sklepu.",
    organizationId: {
      label: "ID organizacji",
      description: "Numeryczne ID docelowej organizacji Corvina.",
      placeholder: "45511",
    },
    manifest: {
      label: "Manifest aplikacji (JSON)",
      description:
        "Wklej pełną zawartość corvina-manifest.json. Ignorowane gdy podano ID aplikacji.",
      placeholder:
        '{"key": "my-app", "name": {"value": "Moja aplikacja"}, "baseUrl": "https://..."}',
    },
    appId: {
      label: "ID aplikacji (opcjonalne)",
      description:
        "Użyj istniejącej aplikacji ze sklepu zamiast własnego manifestu.",
      placeholder: "123",
    },
    planId: {
      label: "ID planu (opcjonalne)",
      description: "ID planu płatności dla płatnych aplikacji.",
      placeholder: "planId1",
    },
    submitButton: {
      label: "Zainstaluj aplikację",
      loadingText: "Instalowanie...",
    },
    response: {
      title: "Wynik instalacji",
      description: "Szczegóły zainstalowanej aplikacji.",
      id: "ID instalacji",
      status: "Status",
      appKey: "Klucz aplikacji",
      appName: "Nazwa aplikacji",
      serviceAccountUsername: "Konto serwisowe",
      createdAt: "Zainstalowano",
      manifestFrom: "Źródło",
    },
    widget: {
      title: "Zainstaluj aplikację Corvina",
      manifestLabel: "Manifest aplikacji",
      jsonPlaceholder: "Wklej tutaj zawartość corvina-manifest.json",
      success: "Aplikacja zainstalowana pomyślnie",
      errorDetail:
        "Instalacja nieudana — sprawdź strukturę manifestu i ID organizacji.",
      resultTitle: "Instalacja zainicjowana",
      appLabel: "Aplikacja",
      statusLabel: "Status",
      serviceAccountLabel: "Konto serwisowe",
      installIdLabel: "ID instalacji",
      installedAtLabel: "Zainstalowano",
      appStore: "Sklep aplikacji",
      installedApps: "Zainstalowane aplikacje",
    },
    errors: {
      validation: {
        title: "Nieprawidłowy manifest",
        description:
          "JSON manifestu jest nieprawidłowy lub brakuje wymaganych pól.",
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
        description: "Klucz API nie ma uprawnień do instalowania aplikacji.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono organizacji.",
      },
      conflict: {
        title: "Już zainstalowana",
        description: "Ta aplikacja jest już zainstalowana w organizacji.",
      },
      server: {
        title: "Błąd serwera",
        description:
          "Corvina zwróciła błąd serwera. Sprawdź strukturę manifestu.",
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
      title: "Aplikacja zainstalowana",
      description: "Aplikacja została zainstalowana pomyślnie.",
    },
  },
};
