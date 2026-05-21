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
      name: "Nazwa",
      label: "Etykieta",
      status: "Status",
      serialNumber: "Numer seryjny",
      firmwareVersion: "Firmware",
      connected: "Połączone",
      lastSeen: "Ostatnio widziano",
      vpnEnabled: "VPN włączony",
      dataEnabled: "Dane włączone",
    },
    widget: {
      edit: "Edytuj",
      tags: "Tagi",
      sections: { identity: "Tożsamość", network: "Sieć" },
      labels: {
        name: "Nazwa",
        label: "Etykieta",
        serialNumber: "Numer seryjny",
        firmwareVersion: "Firmware",
        lastSeen: "Ostatnio widziano",
      },
      badges: {
        connected: "Online",
        disconnected: "Offline",
        vpnOn: "VPN włączone",
        vpnOff: "VPN wyłączone",
        dataOn: "Dane włączone",
        dataOff: "Dane wyłączone",
      },
      cli: {
        firmwarePrefix: " · fw ",
        lastSeenPrefix: "ostatnio widziano ",
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
  put: {
    title: "Edytuj urządzenie",
    description: "Aktualizuje urządzenie Corvina.",
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
    vpnEnabled: {
      label: "VPN włączony",
      description: "Włącz VPN dla tego urządzenia.",
    },
    dataEnabled: {
      label: "Dane włączone",
      description: "Włącz usługi danych dla tego urządzenia.",
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
