export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    deviceLicenses: "Licencje urządzeń",
  },
  post: {
    title: "Aktywuj licencję urządzenia endpoint",
    description: "Aktywuje licencję urządzenia dla urządzenia endpoint.",
    activationKey: {
      label: "Klucz aktywacji",
      description: "Klucz aktywacji urządzenia.",
      placeholder: "0123-4567-89AB-CDEF",
    },
    alias: {
      label: "Alias",
      description: "Alias urządzenia.",
      placeholder: "moje-urządzenie",
    },
    deviceSerialNumber: {
      label: "Numer seryjny",
      description: "Numer seryjny urządzenia.",
      placeholder: "1234567890",
    },
    endpointDescription: {
      label: "Opis",
      description: "Opis urządzenia.",
      placeholder: "Moje urządzenie endpoint",
    },
    orgResourceId: {
      label: "ID zasobu organizacji",
      description: "Docelowa organizacja.",
      placeholder: "org.resource.id",
    },
    logicalId: {
      label: "Identyfikator logiczny",
      description: "Opcjonalny identyfikator logiczny (base64 URL-safe).",
      placeholder: "",
    },
    numOfSecondsVpn: {
      label: "Sekundy VPN",
      description: "Sekundy dodawane do subskrypcji VPN.",
      placeholder: "2592000",
    },
    autorenewVpn: {
      label: "Auto-odnawianie VPN",
      description: "Czy VPN będzie automatycznie odnawiany.",
    },
    gatewayId: {
      label: "ID bramki",
      description: "Identyfikator logiczny urządzenia bramki.",
      placeholder: "",
    },
    response: {
      id: "ID",
      logicalId: "Identyfikator logiczny",
      serialNumber: "Numer seryjny",
      clientName: "Nazwa klienta",
      orgResourceId: "ID zasobu organizacji",
      activationKey: "Klucz aktywacji",
      fromDateVpn: "VPN od",
      toDateVpn: "VPN do",
      activationDate: "Data aktywacji",
      vpnValidityMonths: "Ważność VPN (miesiące)",
      numOfSecondsAutoRenewVpn: "Auto-odnawianie (sekundy)",
      used: "Użyty",
      deleted: "Usunięty",
    },
    widget: {
      title: "Aktywuj endpoint",
      back: "Wstecz",
    },
    submitButton: {
      label: "Aktywuj endpoint",
      loadingText: "Aktywowanie...",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description:
          "Żądanie jest nieprawidłowe. Sprawdź activationKey i alias.",
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
        title: "Brak dostępu",
        description:
          "Brak uprawnień do aktywacji licencji urządzenia endpoint.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono licencji urządzenia lub klucza aktywacji.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina zgłosiła konflikt.",
      },
      server: {
        title: "Błąd serwera",
        description: "Corvina zwróciła błąd wewnętrzny serwera.",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Istnieją niezapisane zmiany.",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd.",
      },
    },
    success: {
      title: "Endpoint aktywowany",
      description: "Licencja urządzenia endpoint została pomyślnie aktywowana.",
    },
  },
};
