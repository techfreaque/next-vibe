export const translations = {
  category: "Corvina",
  tags: { corvina: "Corvina", devices: "Urządzenia" },
  post: {
    title: "Przenieś urządzenie",
    description: "Przenosi urządzenie Corvina do innej organizacji.",
    orgId: {
      label: "ID Organizacji",
      description: "Źródłowe ID organizacji Corvina.",
    },
    deviceId: {
      label: "HW ID urządzenia",
      description: "ID sprzętowe (hwId) urządzenia do przeniesienia.",
    },
    organizationImportToken: {
      label: "Token importu organizacji",
      description: "Token importu organizacji docelowej.",
      placeholder: "tok_abc123",
    },
    response: {
      id: "ID urządzenia",
      label: "Etykieta",
      hwId: "HW ID",
      orgResourceId: "ID zasobu organizacji",
    },
    widget: {
      successTitle: "Urządzenie przeniesione",
      successDescription:
        "Urządzenie zostało przeniesione do organizacji docelowej.",
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
        description: "Brak dostępu do przeniesienia urządzenia.",
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
    success: { title: "Sukces", description: "Urządzenie przeniesione." },
  },
};
