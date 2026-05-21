export const translations = {
  category: "Corvina",
  tags: { corvina: "Corvina", alarms: "Alarmy" },
  post: {
    title: "Liczba alarmów wg poziomu ważności",
    description:
      "Zwraca liczbę aktywnych alarmów pogrupowanych według poziomu ważności.",
    scopedOrganization: {
      label: "Organizacja",
      description: "Ogranicz liczniki do konkretnego ID zasobu organizacji.",
      placeholder: "np. exorde.connex.acme",
    },
    deviceName: {
      label: "Nazwa urządzenia",
      description: "Filtruj liczniki według nazwy urządzenia.",
      placeholder: "np. moje-urządzenie",
    },
    response: {
      data: {
        count: "Liczba",
        severity: "Poziom ważności",
      },
    },
    widget: {
      title: "Liczniki ważności",
      noData: "Brak danych alarmowych.",
      severity: "Poziom ważności",
      count: "Liczba",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Żądanie było nieprawidłowe.",
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
        description: "Brak dostępu do liczników ważności.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Endpoint liczników ważności nie istnieje.",
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
      description: "Liczniki ważności pobrane.",
    },
  },
};
