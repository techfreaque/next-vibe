export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    devices: "Urządzenia",
    configuration: "Konfiguracja",
  },
  get: {
    title: "Pobierz konfigurację urządzenia",
    description: "Pobiera pełną konfigurację urządzenia w formacie JSON.",
    orgId: {
      label: "ID organizacji",
      description: "Liczbowy identyfikator organizacji Corvina.",
    },
    deviceId: {
      label: "ID urządzenia",
      description: "Liczbowy identyfikator urządzenia.",
    },
    response: {
      configJson: "JSON konfiguracji",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Żądanie było nieprawidłowe.",
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
        description: "Brak dostępu do konfiguracji urządzenia.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Urządzenie nie zostało znalezione.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina zgłosiła konflikt.",
      },
      server: {
        title: "Błąd serwera",
        description: "Corvina zwróciła błąd serwera.",
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
      description: "Konfiguracja urządzenia pobrana pomyślnie.",
    },
  },
};
