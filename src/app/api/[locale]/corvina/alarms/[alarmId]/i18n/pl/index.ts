export const translations = {
  category: "Corvina",
  tags: { corvina: "Corvina", alarms: "Alarmy" },
  get: {
    title: "Szczegóły alarmu",
    description:
      "Pobiera pełne dane pojedynczego alarmu Corvina na podstawie ID.",
    alarmId: {
      label: "ID alarmu",
      description: "Unikalny identyfikator alarmu.",
    },
    response: {
      id: "ID",
      realmId: "Realm",
      name: "Nazwa",
      description: "Opis",
      deviceId: "ID urządzenia",
      deviceLabel: "Urządzenie",
      tag: "Tag",
      severity: "Poziom ważności",
      status: "Status",
      action: "Akcja",
      alarmEnabled: "Włączony",
      ack: "Wymaga potwierdzenia",
      reset: "Wymaga resetu",
      eventTimestamp: "Czas zdarzenia",
      updatedAt: "Zaktualizowano",
      acknowledgedDate: "Potwierdzono",
      orgResourceId: "Organizacja",
      user: "Użytkownik",
      comment: "Komentarz",
      timestampAction: "Czas akcji",
      platformAction: "Akcja platformy",
      value_double: "Wartość (double)",
      value_integer: "Wartość (integer)",
      value_boolean: "Wartość (boolean)",
      value_string: "Wartość (string)",
    },
    widget: {
      identity: "Identyfikacja",
      statusSection: "Status",
      timing: "Czasy",
      metadata: "Metadane",
      noData: "—",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "ID alarmu jest nieprawidłowe.",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z Corvina Platform API.",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Sprawdź CORVINA_API_KEY.",
      },
      forbidden: {
        title: "Zabroniony",
        description: "Brak dostępu do tego alarmu.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Alarm nie istnieje.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina zgłosiła konflikt.",
      },
      server: {
        title: "Błąd serwera",
        description: "Corvina Platform API zwróciła błąd serwera.",
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
    success: {
      title: "Sukces",
      description: "Alarm pobrany.",
    },
  },
};
