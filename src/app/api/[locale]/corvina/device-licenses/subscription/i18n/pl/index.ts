export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    deviceLicenses: "Licencje urządzeń",
    subscription: "Subskrypcja",
  },
  get: {
    title: "Subskrypcja urządzenia",
    description: "Pobierz szczegóły subskrypcji dla konkretnego urządzenia.",
    logicalId: {
      label: "ID urządzenia",
      description: "Logiczne ID urządzenia w systemie Corvina.",
    },
    response: {
      logicalId: "ID urządzenia",
      orgResourceId: "ID zasobu organizacji",
      clientEmail: "E-mail klienta",
      trialStartDate: "Data rozpoczęcia okresu próbnego",
      subscriptionEndDate: "Data końca subskrypcji",
      effectiveStartDate: "Efektywny start",
      effectiveEndDate: "Efektywny koniec",
      status: "Status",
      daysUntilExpiry: "Dni do wygaśnięcia",
    },
    status: {
      trial: "Okres próbny",
      active: "Aktywna",
      expiringSoon: "Wygasa wkrótce",
      expired: "Wygasła",
      noSubscription: "Brak subskrypcji",
    },
    widget: {
      title: "Subskrypcja",
      editButton: "Edytuj",
      requestLicense: "Zapytaj o licencję",
      notFound:
        "Brak wpisu subskrypcji. Domyślnie obowiązuje 30-dniowy okres próbny od daty aktywacji.",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "ID urządzenia jest wymagane.",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z serwerem.",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagane uwierzytelnienie.",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Nie masz uprawnień do danych subskrypcji.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Brak wpisu subskrypcji dla tego urządzenia.",
      },
      conflict: { title: "Konflikt", description: "Wystąpił konflikt." },
      server: {
        title: "Błąd serwera",
        description: "Wewnętrzny błąd serwera.",
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
    success: { title: "Sukces", description: "Dane subskrypcji pobrane." },
  },
  post: {
    title: "Aktualizuj subskrypcję urządzenia",
    description:
      "Ustaw lub zaktualizuj okres subskrypcji i e-mail klienta dla urządzenia.",
    logicalId: {
      label: "ID urządzenia",
      description: "Logiczne ID urządzenia w systemie Corvina.",
    },
    orgResourceId: {
      label: "ID zasobu organizacji",
      description: "ID zasobu organizacji dla tego urządzenia.",
    },
    clientEmail: {
      label: "E-mail klienta",
      description: "Adres e-mail do wysyłania przypomnień.",
    },
    trialStartDate: {
      label: "Data rozpoczęcia próby",
      description:
        "Nadpisz datę startu próby. Zostaw puste, aby użyć daty aktywacji.",
    },
    subscriptionEndDate: {
      label: "Data końca subskrypcji",
      description: "Nadpisz datę końca. Zostaw puste, aby użyć start + 30 dni.",
    },
    widget: {
      title: "Edytuj subskrypcję",
      back: "Wróć",
      result: { title: "Subskrypcja zaktualizowana" },
    },
    submitButton: {
      label: "Zapisz subskrypcję",
      loadingText: "Zapisywanie...",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Sprawdź pola formularza.",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z serwerem.",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagane uwierzytelnienie.",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Nie masz uprawnień do aktualizacji.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Urządzenie nie zostało znalezione.",
      },
      conflict: { title: "Konflikt", description: "Wystąpił konflikt." },
      server: {
        title: "Błąd serwera",
        description: "Wewnętrzny błąd serwera.",
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
      title: "Zaktualizowano",
      description: "Subskrypcja zaktualizowana pomyślnie.",
    },
  },
};
