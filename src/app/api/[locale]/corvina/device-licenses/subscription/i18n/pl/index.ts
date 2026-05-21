export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    deviceLicenses: "Subskrypcje urządzeń",
    subscription: "Subskrypcja",
  },
  get: {
    title: "Status subskrypcji urządzenia",
    description:
      "Daty okresu próbnego i płatnej subskrypcji urządzenia Corvina. Pokazuje aktualny status, pozostałe dni i e-mail kontaktowy do przypomnień o odnowieniu.",
    logicalId: {
      label: "ID urządzenia",
      description: "Logiczne ID urządzenia w systemie Corvina.",
    },
    response: {
      logicalId: "ID urządzenia",
      orgResourceId: "Organizacja",
      clientEmail: "E-mail kontaktowy",
      trialStartDate: "Start okresu próbnego",
      subscriptionEndDate: "Koniec subskrypcji",
      effectiveStartDate: "Aktywna od",
      effectiveEndDate: "Aktywna do",
      status: "Status",
      daysUntilExpiry: "Pozostałe dni",
    },
    status: {
      trial: "Okres próbny",
      active: "Aktywna",
      expiringSoon: "Wygasa wkrótce",
      expired: "Wygasła",
      noSubscription: "Brak subskrypcji",
    },
    widget: {
      title: "Subskrypcja urządzenia",
      editButton: "Edytuj",
      requestRenewal: "Zapytaj o odnowienie",
      notFound:
        "Brak wpisu subskrypcji. Domyślnie 30-dniowy okres próbny od daty aktywacji.",
      daysLeft: "dni pozostało",
      daysAgo: "dni temu",
      loading: "Ładowanie subskrypcji…",
      noSubscription: "Brak subskrypcji",
      noSubscriptionHint:
        "Domyślnie 30-dniowy okres próbny od daty aktywacji urządzenia.",
      sections: {
        subscription: "Subskrypcja",
      },
      effectiveFrom: "Aktywna od",
      effectiveUntil: "Aktywna do",
      trialStart: "Start próby",
      subscriptionEnd: "Koniec subskrypcji",
      clientEmail: "E-mail kontaktowy",
      organization: "Organizacja",
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
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt.",
      },
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
      title: "Sukces",
      description: "Status subskrypcji załadowany.",
    },
  },
  post: {
    title: "Ustaw subskrypcję urządzenia",
    description:
      "Ustaw lub nadpisz daty okresu próbnego i końca subskrypcji urządzenia. Przypisz e-mail kontaktowy do przypomnień o wygaśnięciu.",
    logicalId: {
      label: "ID urządzenia",
      description: "Logiczne ID urządzenia w systemie Corvina.",
    },
    orgResourceId: {
      label: "Organizacja",
      description: "ID zasobu organizacji dla tego urządzenia.",
    },
    clientEmail: {
      label: "E-mail kontaktowy",
      description: "Adres e-mail do przypomnień o wygaśnięciu subskrypcji.",
    },
    trialStartDate: {
      label: "Start próby",
      description:
        "Nadpisz datę startu próby. Zostaw puste, aby użyć daty aktywacji.",
    },
    subscriptionEndDate: {
      label: "Koniec subskrypcji",
      description:
        "Ustaw datę końca płatnej subskrypcji. Zostaw puste dla trybu próbnego (start + 30 dni).",
    },
    widget: {
      title: "Edytuj subskrypcję",
      back: "Wróć",
      result: {
        title: "Subskrypcja zapisana",
      },
      sections: {
        identity: "Urządzenie",
        subscription: "Daty subskrypcji",
      },
    },
    submitButton: {
      label: "Zapisz",
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
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt.",
      },
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
      title: "Zapisano",
      description: "Subskrypcja zaktualizowana.",
    },
  },
};
