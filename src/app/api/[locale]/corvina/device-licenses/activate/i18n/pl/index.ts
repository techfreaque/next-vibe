export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    deviceLicenses: "Licencje urządzeń",
  },
  post: {
    title: "Aktywuj licencję urządzenia",
    description:
      "Aktywuje licencję urządzenia na platformie Corvina przy użyciu klucza aktywacyjnego.",
    activationKey: {
      label: "Klucz aktywacyjny",
      description: "Unikalny klucz aktywacyjny dla licencji urządzenia.",
    },
    alias: {
      label: "Alias",
      description: "Opcjonalny alias dla tej licencji urządzenia.",
    },
    deviceSerialNumber: {
      label: "Numer seryjny urządzenia",
      description: "Numer seryjny urządzenia do powiązania z tą licencją.",
    },
    activateDescription: {
      label: "Opis",
      description: "Dowolny opis dla tej licencji urządzenia.",
    },
    orgResourceId: {
      label: "ID zasobu organizacji",
      description:
        "ID zasobu organizacji, do której przypisana zostanie licencja.",
    },
    logicalId: {
      label: "Identyfikator logiczny",
      description: "Logiczny identyfikator urządzenia.",
    },
    numOfSecondsVpn: {
      label: "Czas trwania VPN (sekundy)",
      description: "Liczba sekund ważności VPN.",
    },
    autorenewVpn: {
      label: "Automatyczne odnawianie VPN",
      description: "Automatycznie odnawia dostęp VPN po wygaśnięciu.",
    },
    response: {
      id: "ID",
      realm: "Realm",
      logicalId: "Identyfikator logiczny",
      gatewayLogicalId: "Identyfikator logiczny bramki",
      label: "Etykieta",
      apiKey: "Klucz API",
      platformPairingApiUrl: "URL parowania platformy",
      vpnPairingApiUrl: "URL parowania VPN",
      brokerUrls: "URL-e brokera",
      orgResourceId: "ID zasobu organizacji",
      vpnKey: "Klucz VPN",
      fromDateVpn: "Data rozpoczęcia VPN",
      toDateVpn: "Data zakończenia VPN",
      numOfSecondsAutoRenewVpn: "Automatyczne odnowienie VPN (s)",
      activationDate: "Data aktywacji",
      vpnValidityMonths: "Ważność VPN (miesiące)",
      vpnAccountingDisabled: "Rozliczanie VPN wyłączone",
      serialNumber: "Numer seryjny",
      activationKey: "Klucz aktywacyjny",
      used: "Użyta",
      usedInTrial: "Użyta w wersji próbnej",
      deleted: "Usunięta",
      clientName: "Nazwa klienta",
      notes: "Notatki",
      vpnOtpRequired: "Wymagany OTP VPN",
      vpnPairingMode: "Tryb parowania VPN",
      vpnLastAttempt: "Ostatnia próba VPN",
    },
    widget: {
      title: "Aktywuj licencję urządzenia",
      back: "Wróć",
      result: "Aktywowano",
      noResult: "Wpisz klucz aktywacyjny, aby aktywować licencję urządzenia.",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Żądanie aktywacji jest nieprawidłowe.",
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
          "Klucz API nie ma uprawnień do aktywacji licencji urządzeń.",
      },
      notFound: {
        title: "Nie znaleziono",
        description:
          "Klucz aktywacyjny lub zasób docelowy nie został znaleziony.",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Licencja urządzenia z tym kluczem aktywacyjnym jest już aktywna.",
      },
      server: {
        title: "Błąd serwera",
        description: "Corvina zwróciła wewnętrzny błąd serwera.",
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
      title: "Aktywowano",
      description: "Licencja urządzenia została pomyślnie aktywowana.",
    },
    submitButton: {
      label: "Aktywuj licencję",
      loadingText: "Aktywowanie...",
    },
  },
};
