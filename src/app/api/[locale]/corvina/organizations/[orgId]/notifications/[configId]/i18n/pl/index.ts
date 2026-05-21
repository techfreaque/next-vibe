export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    notifications: "Powiadomienia",
  },
  post: {
    title: "Aktualizuj konfigurację powiadomień",
    description: "Aktualizuje istniejącą konfigurację powiadomień.",
    orgId: {
      label: "ID organizacji",
      description: "Liczbowy identyfikator organizacji Corvina.",
    },
    configId: {
      label: "ID konfiguracji",
      description: "Liczbowy identyfikator konfiguracji powiadomień.",
    },
    event: {
      label: "Zdarzenie",
      description: "Typ zdarzenia powiadomienia.",
    },
    beforeDays: {
      label: "Dni przed",
      description: "Wyślij powiadomienie tyle dni przed zdarzeniem.",
    },
    afterDays: {
      label: "Dni po",
      description: "Wyślij powiadomienie tyle dni po zdarzeniu.",
    },
    emailBcc: {
      label: "E-mail BCC",
      description: "Dodatkowy adres BCC dla powiadomień.",
      placeholder: "bcc@przykład.pl",
    },
    response: {
      id: "ID",
      organizationId: "ID organizacji",
      event: "Zdarzenie",
      beforeDays: "Dni przed",
      afterDays: "Dni po",
      emailBcc: "E-mail BCC",
      lastCheck: "Ostatnie sprawdzenie",
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
        description: "Klucz API nie ma dostępu do aktualizacji konfiguracji.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Konfiguracja o tym ID nie istnieje.",
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
      title: "Zaktualizowano",
      description: "Konfiguracja powiadomień zaktualizowana pomyślnie.",
    },
    submitButton: {
      label: "Zapisz zmiany",
      loadingText: "Zapisywanie...",
    },
    widget: {
      labels: {
        bcc: "bcc",
        before: "przed",
        after: "po",
        deleted: "USUNIĘTO",
        updated: "Zaktualizowano",
        deleted2: "Usunięto",
      },
    },
  },
  delete: {
    title: "Usuń konfigurację powiadomień",
    description: "Usuwa konfigurację powiadomień.",
    orgId: {
      label: "ID organizacji",
      description: "Liczbowy identyfikator organizacji Corvina.",
    },
    configId: {
      label: "ID konfiguracji",
      description: "Liczbowy identyfikator konfiguracji powiadomień.",
    },
    response: {
      id: "ID",
      organizationId: "ID organizacji",
      event: "Zdarzenie",
      beforeDays: "Dni przed",
      afterDays: "Dni po",
      emailBcc: "E-mail BCC",
      lastCheck: "Ostatnie sprawdzenie",
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
        description: "Klucz API nie ma dostępu do usuwania konfiguracji.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Konfiguracja o tym ID nie istnieje.",
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
      title: "Usunięto",
      description: "Konfiguracja powiadomień usunięta pomyślnie.",
    },
  },
};
