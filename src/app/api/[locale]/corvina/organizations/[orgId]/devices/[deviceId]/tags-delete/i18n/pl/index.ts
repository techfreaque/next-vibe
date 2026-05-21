export const translations = {
  category: "Corvina",
  tags: { corvina: "Corvina", devices: "Urządzenia" },
  delete: {
    title: "Usuń tagi urządzenia",
    description: "Usuwa historyczne dane tagów urządzenia Corvina.",
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
      description: "Filtr ścieżki modelu tagu. ** pasuje do wszystkich tagów.",
      placeholder: "**",
    },
    since: {
      label: "Od",
      description:
        "Początek zakresu czasu do usunięcia (ISO 8601 lub znacznik czasu).",
      placeholder: "2024-01-01T00:00:00Z",
    },
    to: {
      label: "Do",
      description:
        "Koniec zakresu czasu do usunięcia (ISO 8601 lub znacznik czasu).",
      placeholder: "2024-12-31T23:59:59Z",
    },
    filterCondition: {
      label: "Warunek filtra",
      description: "Dodatkowe wyrażenie filtrujące.",
      placeholder: "value > 0",
    },
    response: {
      deletedCount: "Liczba usuniętych",
    },
    widget: {
      title: "Tagi usunięte",
      deletedMessage: "usunięto",
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
        description: "Brak dostępu do usuwania danych urządzenia.",
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
    success: { title: "Sukces", description: "Dane tagów usunięte." },
  },
};
