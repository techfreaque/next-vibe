export const translations = {
  category: "Corvina",
  tags: { corvina: "Corvina", devices: "Urządzenia" },
  get: {
    title: "Tagi urządzenia",
    description: "Pobiera tagi telemetryczne urządzenia Corvina.",
    orgId: {
      label: "ID Organizacji",
      description: "Numeryczne ID organizacji Corvina.",
    },
    deviceId: {
      label: "HW ID urządzenia",
      description: "ID sprzętowe (hwId) urządzenia.",
    },
    response: {
      tags: {
        modelPath: "Ścieżka modelu",
        latestValue: "Ostatnia wartość",
        latestTimestamp: "Znacznik czasu",
      },
      total: "Łącznie",
    },
    widget: {
      title: "Tagi",
      noTagsFound: "Nie znaleziono tagów.",
      noData: "brak danych",
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
        description: "Brak dostępu do urządzenia.",
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
    success: { title: "Sukces", description: "Tagi pobrane." },
  },
  post: {
    title: "Ustaw wartość tagu",
    description: "Zapisuje nową wartość do tagu urządzenia Corvina.",
    orgId: {
      label: "ID Organizacji",
      description: "Numeryczne ID organizacji Corvina.",
    },
    deviceId: {
      label: "HW ID urządzenia",
      description: "ID sprzętowe (hwId) urządzenia.",
    },
    modelPath: {
      label: "Ścieżka tagu",
      description: "Pełna ścieżka modelu tagu.",
      placeholder: "ABC:1/Tag9",
    },
    v: {
      label: "Nowa wartość",
      description: "Wartość do zapisania w tagu.",
      placeholder: "np. 42 lub tekst",
    },
    response: { message: "Wynik" },
    widget: {
      currentValue: "Aktualna wartość",
      submitButton: "Zapisz wartość",
      successTitle: "Wartość zapisana",
      successDescription: "Tag został pomyślnie zaktualizowany.",
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
        description: "Brak dostępu do zapisu urządzenia.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Urządzenie lub tag nie istnieje.",
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
    success: { title: "Sukces", description: "Wartość tagu zapisana." },
  },
};
