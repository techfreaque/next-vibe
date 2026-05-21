export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    organizations: "Organizacje",
  },
  get: {
    title: "Lista organizacji Corvina",
    description:
      "Pobiera wszystkie organizacje klientów ze skonfigurowanego tenanta Corvina.",
    container: {
      title: "Organizacje Corvina",
      description:
        "Wszystkie organizacje klientów na skonfigurowanym tenancie Corvina.",
    },
    response: {
      title: "Organizacje",
      description: "Organizacje klientów zwrócone przez API Corvina.",
      organizations: {
        title: "Organizacje",
        description: "Każdy wiersz to jedna organizacja klienta.",
        id: "ID",
        name: "Nazwa",
        label: "Etykieta",
        status: "Status",
        resourceId: "ID zasobu",
        dataEnabled: "Dane",
        vpnEnabled: "VPN",
        privateAccess: "Prywatny dostęp",
        allowDisablePrivateAccess: "Zezwól wyłączyć prywatny",
        hostname: "Nazwa hosta",
        hostnameAllowed: "Hostname dozwolony",
        vpnPairingMode: "Tryb VPN",
        vpnOtpRequired: "VPN OTP",
        ipAddressesWhitelist: "Biała lista IP",
        userCanAccess: "Dostęp użytkownika",
        storeEnabled: "Sklep",
        dataTemporarilyDisabled: "Dane wstrzymane",
        mfaRequired: "MFA",
      },
      total: "Łącznie",
      totalPages: "Strony",
      currentPage: "Bieżąca strona",
    },
    widget: {
      title: "Organizacje Corvina",
      noOrgsFound: "Nie znaleziono organizacji",
      nav: {
        appStore: "Sklep aplikacji",
        installedApps: "Zainstalowane aplikacje",
        alarms: "Alarmy",
        licenses: "Licencje",
        createOrg: "Nowa org",
      },
    },
    enums: {
      orgStatus: {
        new: "Nowa",
        provisioning: "Konfigurowanie",
        done: "Aktywna",
        deleting: "Usuwanie",
        deleted: "Usunięta",
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
        description: "Corvina odrzuciła klucz API. Sprawdź CORVINA_API_KEY.",
      },
      forbidden: {
        title: "Zabronione",
        description:
          "Klucz API nie ma wymaganego zakresu do listowania organizacji.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Corvina zwraca 404 dla ścieżki organizacji.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina zgłosiła konflikt przy listowaniu organizacji.",
      },
      server: {
        title: "Błąd serwera",
        description: "API Corvina zwróciło wewnętrzny błąd serwera.",
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
      description: "Organizacje pobrane pomyślnie.",
    },
  },
};
