export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    deviceLicenses: "Licencje urządzeń",
  },
  post: {
    title: "Migruj licencję urządzenia",
    description:
      "Migruje licencję urządzenia do nowego realm. Tylko dla administratorów głównego realm.",
    oldActivationKeyId: {
      label: "Stary ID klucza aktywacji",
      description: "ID klucza aktywacji do migracji.",
      placeholder: "42",
    },
    newRealm: {
      label: "Nowy realm",
      description: "Realm, do którego ma zostać przeniesiona licencja.",
      placeholder: "master",
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
      title: "Migruj licencję",
      back: "Wstecz",
    },
    submitButton: {
      label: "Migruj licencję",
      loadingText: "Migrowanie...",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description:
          "Żądanie jest nieprawidłowe. Sprawdź oldActivationKeyId i newRealm.",
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
        description: "Wymagany dostęp administratora głównego realm.",
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
      title: "Licencja zmigrowana",
      description:
        "Licencja urządzenia została pomyślnie przeniesiona do nowego realm.",
    },
  },
};
