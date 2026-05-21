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
    },
    widget: {
      edit: "Edytuj",
      tags: "Tagi",
      sections: { identity: "Tożsamość" },
      labels: {
        label: "Etykieta",
        hwId: "ID sprzętowe",
        orgResourceId: "ID zasobu org",
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
