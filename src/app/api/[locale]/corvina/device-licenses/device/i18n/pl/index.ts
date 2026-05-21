export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    deviceLicenses: "Licencje urządzeń",
  },
  get: {
    title: "Znajdź licencję urządzenia",
    description:
      "Pobiera licencję urządzenia na podstawie numeru seryjnego i klucza aktywacyjnego.",
    serialNumber: {
      label: "Numer seryjny",
      description: "Numer seryjny urządzenia, które aktywowało licencję.",
      placeholder: "SN-ABC-001",
    },
    activationKey: {
      label: "Klucz aktywacyjny",
      description: "Klucz aktywacyjny licencji.",
      placeholder: "ACT-KEY-XXXX",
    },
    response: {
      realm: "Realm",
      logicalId: "Identyfikator logiczny",
      gatewayLogicalId: "Identyfikator logiczny bramki",
      label: "Etykieta",
      apiKey: "Klucz API",
      orgResourceId: "ID zasobu organizacji",
      vpnKey: "Klucz VPN",
      fromDateVpn: "VPN od",
      toDateVpn: "VPN do",
      numOfSecondsAutoRenewVpn: "Automatyczne odnowienie (sekundy)",
      activationDate: "Data aktywacji",
      vpnValidityMonths: "Ważność VPN (miesiące)",
      vpnAccountingDisabled: "Rozliczenie VPN wyłączone",
    },
    widget: {
      title: "Wyszukiwanie licencji urządzenia",
      back: "Wróć",
    },
    submitButton: {
      label: "Wyszukaj",
      loadingText: "Wyszukiwanie...",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Sprawdź numer seryjny i klucz aktywacyjny.",
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
        description: "Brak uprawnień do wyszukiwania licencji urządzeń.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono licencji urządzenia dla podanych danych.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina zgłosiła konflikt.",
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
      title: "Licencja urządzenia znaleziona",
      description: "Licencja urządzenia pobrana pomyślnie.",
    },
  },
  post: {
    title: "Znajdź licencję urządzenia (POST)",
    description:
      "Pobiera licencję urządzenia przez POST na podstawie numeru seryjnego i klucza aktywacyjnego.",
    serialNumber: {
      label: "Numer seryjny",
      description: "Numer seryjny urządzenia, które aktywowało licencję.",
      placeholder: "SN-ABC-001",
    },
    activationKey: {
      label: "Klucz aktywacyjny",
      description: "Klucz aktywacyjny licencji.",
      placeholder: "ACT-KEY-XXXX",
    },
    response: {
      realm: "Realm",
      logicalId: "Identyfikator logiczny",
      gatewayLogicalId: "Identyfikator logiczny bramki",
      label: "Etykieta",
      apiKey: "Klucz API",
      orgResourceId: "ID zasobu organizacji",
      vpnKey: "Klucz VPN",
      fromDateVpn: "VPN od",
      toDateVpn: "VPN do",
      numOfSecondsAutoRenewVpn: "Automatyczne odnowienie (sekundy)",
      activationDate: "Data aktywacji",
      vpnValidityMonths: "Ważność VPN (miesiące)",
      vpnAccountingDisabled: "Rozliczenie VPN wyłączone",
    },
    widget: {
      title: "Wyszukiwanie licencji urządzenia (POST)",
      back: "Wróć",
    },
    submitButton: {
      label: "Wyszukaj",
      loadingText: "Wyszukiwanie...",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Sprawdź numer seryjny i klucz aktywacyjny.",
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
        description: "Brak uprawnień do wyszukiwania licencji urządzeń.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono licencji urządzenia dla podanych danych.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina zgłosiła konflikt.",
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
      title: "Licencja urządzenia znaleziona",
      description: "Licencja urządzenia pobrana pomyślnie.",
    },
  },
};
