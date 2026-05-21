export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    notifications: "Powiadomienia",
  },
  get: {
    title: "Lista konfiguracji powiadomień",
    description:
      "Wyświetla wszystkie konfiguracje powiadomień organizacji Corvina.",
    orgId: {
      label: "ID organizacji",
      description: "Liczbowy identyfikator organizacji Corvina.",
    },
    page: {
      label: "Strona",
      description: "Numer strony (od zera).",
    },
    pageSize: {
      label: "Rozmiar strony",
      description: "Liczba konfiguracji na stronie (maks. 100).",
    },
    response: {
      configs: {
        id: "ID",
        organizationId: "ID organizacji",
        event: "Zdarzenie",
        beforeDays: "Dni przed",
        afterDays: "Dni po",
        emailBcc: "E-mail BCC",
        lastCheck: "Ostatnie sprawdzenie",
      },
      totalElements: "Łączna liczba konfiguracji",
      totalPages: "Łączna liczba stron",
      last: "Ostatnia strona",
    },
    widget: {
      title: "Konfiguracje powiadomień",
      emptyState: "Brak konfiguracji powiadomień.",
      labels: {
        bcc: "bcc",
        before: "przed",
        after: "po",
      },
    },
    enums: {
      notificationEvent: {
        standardLicenseExpiration: "Wygaśnięcie licencji standardowej",
        plusLicenseExpiration: "Wygaśnięcie licencji Plus",
        trialLicenseExpiration: "Wygaśnięcie licencji próbnej",
        vpnConsumptionsLevel0: "Zużycie VPN poziom 0",
        vpnConsumptionsLevel1: "Zużycie VPN poziom 1",
        vpnConsumptionsLevel2: "Zużycie VPN poziom 2",
        vpnConsumptionsLevel3: "Zużycie VPN poziom 3",
        iotConsumptionsLevel0: "Zużycie IoT poziom 0",
        iotConsumptionsLevel1: "Zużycie IoT poziom 1",
        iotConsumptionsLevel2: "Zużycie IoT poziom 2",
        iotConsumptionsLevel3: "Zużycie IoT poziom 3",
      },
      notificationMailEventType: {
        alarmNotification: "Powiadomienie alarmowe",
        userCreation: "Tworzenie użytkownika",
        standardLicenseExpiration: "Wygaśnięcie licencji standardowej",
        plusLicenseExpiration: "Wygaśnięcie licencji Plus",
        trialLicenseExpiration: "Wygaśnięcie licencji próbnej",
        standardLicenseExpired: "Licencja standardowa wygasła",
        plusLicenseExpired: "Licencja Plus wygasła",
        trialLicenseExpired: "Licencja próbna wygasła",
        vpnCreditsConsumptions: "Zużycie kredytów VPN",
        vpnCreditsConsumptionsOver: "Przekroczono kredyty VPN",
        iotCreditsConsumptions: "Zużycie kredytów IoT",
        iotCreditsConsumptionsOver: "Przekroczono kredyty IoT",
      },
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Żądanie do Corvina było nieprawidłowe.",
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
        title: "Zabronione",
        description: "Klucz API nie ma dostępu do listy konfiguracji.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Organizacja o tym ID nie istnieje.",
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
        description: "Występują niezapisane zmiany.",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd.",
      },
    },
    success: {
      title: "Sukces",
      description: "Konfiguracje powiadomień pobrane pomyślnie.",
    },
  },
  post: {
    title: "Utwórz konfigurację powiadomień",
    description: "Tworzy nową konfigurację powiadomień dla organizacji.",
    orgId: {
      label: "ID organizacji",
      description: "Liczbowy identyfikator organizacji Corvina.",
    },
    event: {
      label: "Zdarzenie",
      description: "Typ zdarzenia powiadomienia.",
    },
    beforeDays: {
      label: "Dni przed",
      description: "Wyślij powiadomienie tyle dni przed zdarzeniem.",
    },
    afterDays: {
      label: "Dni po",
      description: "Wyślij powiadomienie tyle dni po zdarzeniu.",
    },
    emailBcc: {
      label: "E-mail BCC",
      description: "Dodatkowy adres BCC dla powiadomień.",
      placeholder: "bcc@przykład.pl",
    },
    response: {
      id: "ID",
      organizationId: "ID organizacji",
      event: "Zdarzenie",
      beforeDays: "Dni przed",
      afterDays: "Dni po",
      emailBcc: "E-mail BCC",
      lastCheck: "Ostatnie sprawdzenie",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Żądanie do Corvina było nieprawidłowe.",
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
        title: "Zabronione",
        description: "Klucz API nie ma dostępu do tworzenia konfiguracji.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Organizacja o tym ID nie istnieje.",
      },
      conflict: {
        title: "Konflikt",
        description: "Konfiguracja dla tego zdarzenia już istnieje.",
      },
      server: {
        title: "Błąd serwera",
        description: "Corvina zwróciła wewnętrzny błąd serwera.",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Występują niezapisane zmiany.",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd.",
      },
    },
    success: {
      title: "Utworzono",
      description: "Konfiguracja powiadomień utworzona pomyślnie.",
    },
    submitButton: {
      label: "Utwórz konfigurację",
      loadingText: "Tworzenie...",
    },
  },
};
