export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    wallet: "Portfel",
  },
  get: {
    title: "Pobierz portfel",
    description: "Pobiera pojedynczy portfel Corvina po identyfikatorze.",
    walletId: {
      label: "ID portfela",
      description: "Unikalny identyfikator portfela.",
    },
    response: {
      id: "ID",
      type: "Typ",
      description: "Opis",
      webhookUrl: "URL webhooka",
    },
    widget: {
      title: "Portfel",
      edit: "Edytuj",
      back: "Wstecz",
      noData: "Brak danych portfela.",
      labels: {
        id: "ID",
        type: "Typ",
        description: "Opis",
        webhookUrl: "URL webhooka",
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
        description: "Klucz API nie ma uprawnień do odczytu tego portfela.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie istnieje portfel o podanym identyfikatorze.",
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
    enums: {
      walletType: {
        generic: "Ogólny",
        app: "Aplikacja",
      },
    },
    success: {
      title: "Sukces",
      description: "Portfel pobrany pomyślnie.",
    },
  },
  put: {
    title: "Zaktualizuj portfel",
    description: "Aktualizuje konfigurację portfela Corvina.",
    walletId: {
      label: "ID portfela",
      description: "Unikalny identyfikator portfela do aktualizacji.",
    },
    type: {
      label: "Typ",
      description: "Typ portfela — GENERIC lub APP.",
      placeholder: "GENERIC",
    },
    description: {
      label: "Opis",
      description: "Czytelna etykieta tego portfela.",
      placeholder: "Mój portfel",
    },
    webhookUrl: {
      label: "URL webhooka",
      description: "Adres URL do odbierania powiadomień o zdarzeniach portfela.",
      placeholder: "https://example.com/webhook",
    },
    submitButton: {
      label: "Zapisz zmiany",
      loadingText: "Zapisywanie…",
    },
    errors: {
      validation: {
        title: "Nieprawidłowa aktualizacja",
        description: "Corvina odrzuciła dane aktualizacji.",
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
        description: "Klucz API nie ma uprawnień do zapisu tego portfela.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie istnieje portfel o podanym identyfikatorze.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina zgłosiła konflikt przy tej aktualizacji.",
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
      title: "Zapisano",
      description: "Portfel zaktualizowany pomyślnie.",
    },
  },
};
