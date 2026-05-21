export const translations = {
  category: "Corvina",
  tags: { corvina: "Corvina", devices: "Urządzenia" },
  post: {
    title: "Historia zapytań tagów",
    description: "Pobiera historyczne dane tagów urządzenia Corvina.",
    orgId: {
      label: "ID Organizacji",
      description: "Numeryczne ID organizacji Corvina.",
    },
    deviceId: {
      label: "HW ID urządzenia",
      description: "ID sprzętowe (hwId) urządzenia.",
    },
    modelPath: {
      label: "Ścieżka modelu",
      description: "Filtr ścieżki modelu tagu. Obsługuje symbole wieloznaczne.",
      placeholder: "** lub Test_Model:1/Tag",
    },
    since: {
      label: "Od",
      description: "Początek zakresu czasu (ISO 8601 lub znacznik czasu).",
      placeholder: "2024-01-01T00:00:00Z",
    },
    to: {
      label: "Do",
      description: "Koniec zakresu czasu (ISO 8601 lub znacznik czasu).",
      placeholder: "2024-12-31T23:59:59Z",
    },
    limit: {
      label: "Limit",
      description: "Maksymalna liczba zwracanych wierszy.",
      placeholder: "100",
    },
    mode: {
      label: "Tryb",
      description: "Filtr trybu dostępu do tagu.",
    },
    filterCondition: {
      label: "Warunek filtra",
      description: "Dodatkowe wyrażenie filtrujące.",
      placeholder: "value > 0",
    },
    response: {
      deviceId: "ID urządzenia",
      modelPath: "Ścieżka modelu",
      rowCount: "Liczba wierszy",
      latestValue: "Ostatnia wartość",
      latestTimestamp: "Ostatni znacznik czasu",
    },
    widget: {
      title: "Wyniki zapytania tagów",
      noResultsFound: "Nie znaleziono danych tagów.",
      rows: "wierszy",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Żądanie było nieprawidłowe.",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z Corvina API.",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Sprawdź CORVINA_API_KEY.",
      },
      forbidden: {
        title: "Zabroniony",
        description: "Brak dostępu do odczytu urządzenia.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Urządzenie nie istnieje.",
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
        description: "Są niezapisane zmiany.",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd.",
      },
    },
    success: { title: "Sukces", description: "Historia tagów pobrana." },
  },
};
