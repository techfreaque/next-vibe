export const translations = {
  category: "Corvina",
  tags: { corvina: "Corvina", devices: "Urządzenia" },
  get: {
    title: "Urządzenie",
    description: "Pobiera pojedyncze urządzenie Corvina.",
    orgId: {
      label: "ID Organizacji",
      description: "Numeryczne ID organizacji Corvina.",
    },
    deviceId: {
      label: "ID Urządzenia",
      description: "Numeryczne ID urządzenia Corvina.",
    },
    response: {
      orgId: "ID Organizacji",
      deviceId: "ID Urządzenia",
      label: "Etykieta",
      hwId: "ID sprzętowe",
      orgResourceId: "ID zasobu org",
      groups: "Grupy",
      connected: "Połączony",
      lastConnection: "Ostatnie połączenie",
      lastDisconnection: "Ostatnie rozłączenie",
      firstRegistration: "Pierwsza rejestracja",
      lastSeenIp: "Ostatnio widziany IP",
    },
    widget: {
      edit: "Edytuj",
      delete: "Usuń",
      tags: "Tagi",
      subscription: "Subskrypcja",
      loading: "Ładowanie urządzenia…",
      groups: "Grupy",
      noSubscription: "Brak aktywnej subskrypcji",
      noSubscriptionHint: "Aktywuj licencję, aby włączyć funkcje.",
      trialStart: "Początek okresu próbnego",
      subscriptionEnd: "Koniec subskrypcji",
      clientEmail: "E-mail klienta",
      sections: {
        identity: "Tożsamość",
        connectivity: "Połączenie",
        subscription: "Subskrypcja",
        device: "Urządzenie",
      },
      labels: {
        label: "Etykieta",
        hwId: "ID sprzętowe",
        orgResourceId: "ID zasobu org",
        groups: "Grupy",
        connected: "Status",
        online: "Online",
        offline: "Offline",
        lastConnection: "Ostatnie połączenie",
        lastDisconnection: "Ostatnie rozłączenie",
        firstRegistration: "Pierwsza rejestracja",
        lastSeenIp: "Ostatni IP",
        subscriptionStatus: "Status",
        hwIdLabel: "ID sprzętowe",
        orgResourceLabel: "Zasób org",
        backToDevice: "Wróć do urządzenia",
        changesSaved: "Zapisano",
      },
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
    success: { title: "Sukces", description: "Urządzenie pobrane." },
  },
  patch: {
    title: "Edytuj urządzenie",
    info: "Aktualizuje etykietę, opis i numer seryjny urządzenia Corvina.",
    orgId: {
      label: "ID Organizacji",
      description: "Numeryczne ID organizacji Corvina.",
    },
    deviceId: {
      label: "ID Urządzenia",
      description: "Numeryczne ID urządzenia Corvina.",
    },
    label: {
      label: "Etykieta",
      description: "Wyświetlana nazwa urządzenia.",
      placeholder: "Moje urządzenie",
    },
    description: {
      label: "Opis",
      description: "Opcjonalny opis urządzenia.",
      placeholder: "Krótki opis",
    },
    serialNumber: {
      label: "Numer seryjny",
      description: "Fizyczny numer seryjny urządzenia.",
      placeholder: "SN-123456",
    },
    submitButton: { label: "Zapisz zmiany", loadingText: "Zapisywanie…" },
    editSubscription: "Edytuj subskrypcję",
    trialStartDate: {
      label: "Początek okresu próbnego",
      description: "Data rozpoczęcia okresu próbnego.",
    },
    subscriptionEndDate: {
      label: "Koniec subskrypcji",
      description: "Data wygaśnięcia subskrypcji.",
    },
    clientEmail: {
      label: "E-mail klienta",
      description: "Adres e-mail klienta tego urządzenia.",
      placeholder: "klient@przyklad.pl",
    },
    subscription: {
      sectionTitle: "Subskrypcja",
    },
    errors: {
      validation: {
        title: "Nieprawidłowa aktualizacja",
        description: "Corvina odrzuciła aktualizację.",
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
    success: { title: "Zapisano", description: "Urządzenie zaktualizowane." },
  },
};
