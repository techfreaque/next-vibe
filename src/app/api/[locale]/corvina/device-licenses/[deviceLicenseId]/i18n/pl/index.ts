export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    deviceLicenses: "Licencje urządzeń",
  },
  put: {
    title: "Aktualizuj licencję urządzenia",
    description:
      "Aktualizuje numer seryjny, nazwę klienta, notatki i ustawienia VPN licencji urządzenia.",
    deviceLicenseId: {
      label: "ID licencji urządzenia",
      description: "Numeryczny identyfikator licencji urządzenia.",
    },
    serialNumber: {
      label: "Numer seryjny",
      description: "Sprzętowy numer seryjny urządzenia.",
    },
    clientName: {
      label: "Nazwa klienta",
      description: "Nazwa klienta posiadającego tę licencję urządzenia.",
    },
    notes: {
      label: "Notatki",
      description: "Dowolne notatki dotyczące tej licencji urządzenia.",
    },
    vpnStartDate: {
      label: "Data rozpoczęcia VPN",
      description: "Data, od której dostęp VPN jest aktywny.",
    },
    vpnEndDate: {
      label: "Data zakończenia VPN",
      description: "Data, kiedy dostęp VPN wygasa.",
    },
    vpnValidityMonths: {
      label: "Ważność VPN (miesiące)",
      description: "Liczba miesięcy, przez które dostęp VPN pozostaje ważny.",
    },
    vpnAccountingDisabled: {
      label: "Wyłącz rozliczanie VPN",
      description: "Gdy włączone, użycie VPN nie jest rozliczane.",
    },
    response: {
      id: "ID",
      realm: "Realm",
      logicalId: "Identyfikator logiczny",
      gatewayLogicalId: "Identyfikator logiczny bramy",
      label: "Etykieta",
      apiKey: "Klucz API",
      platformPairingApiUrl: "URL API parowania platformy",
      vpnPairingApiUrl: "URL API parowania VPN",
      brokerUrls: "URL brokera",
      orgResourceId: "ID zasobu organizacji",
      vpnKey: "Klucz VPN",
      fromDateVpn: "VPN od",
      toDateVpn: "VPN do",
      numOfSecondsAutoRenewVpn: "Automatyczne odnowienie VPN (sekundy)",
      activationDate: "Data aktywacji",
      vpnValidityMonths: "Ważność VPN (miesiące)",
      vpnAccountingDisabled: "Rozliczanie VPN wyłączone",
      serialNumber: "Numer seryjny",
      activationKey: "Klucz aktywacyjny",
      used: "W użyciu",
      usedInTrial: "Użyte w wersji próbnej",
      deleted: "Usunięte",
      clientName: "Nazwa klienta",
      notes: "Notatki",
      vpnOtpRequired: "Wymagany OTP dla VPN",
      vpnPairingMode: "Tryb parowania VPN",
      vpnLastAttempt: "Ostatnia próba VPN",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Żądanie do Corvina było błędne.",
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
          "Klucz API nie ma uprawnień do aktualizacji licencji urządzeń.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie istnieje licencja urządzenia o podanym ID.",
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
      title: "Zaktualizowano",
      description: "Licencja urządzenia zaktualizowana pomyślnie.",
    },
    submitButton: {
      label: "Zapisz zmiany",
      loadingText: "Zapisywanie...",
    },
    widget: {
      back: "Wróć",
    },
  },
  delete: {
    title: "Usuń licencję urządzenia",
    description: "Trwale usuwa licencję urządzenia po identyfikatorze.",
    deviceLicenseId: {
      label: "ID licencji urządzenia",
      description: "Numeryczny identyfikator licencji urządzenia do usunięcia.",
    },
    deleteOrgResourceId: {
      label: "ID zasobu organizacji",
      description: "Ogranicz usuwanie do konkretnej organizacji.",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Żądanie do Corvina było błędne.",
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
          "Klucz API nie ma uprawnień do usuwania licencji urządzeń.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie istnieje licencja urządzenia o podanym ID.",
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
      title: "Usunięto",
      description: "Licencja urządzenia usunięta pomyślnie.",
    },
    submitButton: {
      label: "Usuń licencję urządzenia",
      loadingText: "Usuwanie...",
    },
    widget: {
      back: "Wróć",
      deletedDevice: "Usunięte urządzenie",
      activationKey: "Klucz aktywacyjny",
    },
  },
};
