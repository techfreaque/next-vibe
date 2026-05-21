export const translations = {
  category: "Corvina",
  tags: { corvina: "Corvina", devices: "Urządzenia", status: "Status" },
  get: {
    title: "Pobierz status urządzenia",
    description: "Pobiera aktualny stan połączenia urządzenia.",
    orgId: {
      label: "ID organizacji",
      description: "Liczbowy identyfikator organizacji Corvina.",
    },
    deviceId: {
      label: "ID urządzenia",
      description: "Liczbowy identyfikator urządzenia.",
    },
    response: {
      connected: "Połączone",
      lastSeen: "Ostatnio widziano",
      ipAddress: "Adres IP",
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
        description: "Brak dostępu do statusu urządzenia.",
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
      description: "Status urządzenia pobrany pomyślnie.",
    },
  },
};
