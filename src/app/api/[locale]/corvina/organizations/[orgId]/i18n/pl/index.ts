export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    organizations: "Organizacje",
  },
  get: {
    title: "Pobierz organizację Corvina",
    description: "Pobiera pełne dane organizacji Corvina po identyfikatorze.",
    container: {
      title: "Organizacja",
      description: "Pełne szczegóły organizacji Corvina.",
    },
    id: {
      label: "ID organizacji",
      description: "Liczbowy lub nazwowy identyfikator organizacji Corvina.",
    },
    response: {
      id: "ID",
      name: "Nazwa",
      label: "Etykieta",
      status: "Status",
      resourceId: "ID zasobu",
      privateAccess: "Prywatny dostęp",
      allowDisablePrivateAccess: "Zezwalaj na wyłączenie prywatnego dostępu",
      hostname: "Nazwa hosta",
      hostnameAllowed: "Hostname dozwolony",
      dataEnabled: "Dane aktywne",
      vpnEnabled: "VPN aktywny",
      vpnPairingMode: "Tryb parowania VPN",
      vpnOtpRequired: "Wymagany OTP VPN",
      ipAddressesWhitelist: "Whitelist IP",
      userCanAccess: "Dostęp użytkownika",
      storeEnabled: "Sklep aktywny",
      dataTemporarilyDisabled: "Dane tymczasowo wyłączone",
      mfaRequired: "Wymagane MFA",
    },
    widget: {
      edit: "Edytuj",
      devices: "Urządzenia",
      sections: {
        identity: "Tożsamość",
        network: "Sieć",
        securityServices: "Bezpieczeństwo i usługi",
      },
      labels: {
        name: "Nazwa",
        label: "Etykieta",
        resourceId: "ID zasobu",
        hostname: "Hostname",
      },
      cli: {
        hostnameLabel: "hostname: ",
      },
      badges: {
        dataOn: "Dane włączone",
        dataOff: "Dane wyłączone",
        vpnOn: "VPN włączony",
        vpnOff: "VPN wyłączony",
        private: "Prywatny",
        public: "Publiczny",
        customHostname: "Własny hostname",
        mfaRequired: "MFA wymagane",
        mfaOff: "MFA wyłączone",
        vpnOtp: "VPN OTP",
        noOtp: "Bez OTP",
        storeOn: "Sklep aktywny",
        storeOff: "Sklep nieaktywny",
        userAccess: "Dostęp użytkownika",
        noUserAccess: "Brak dostępu",
        dataTemporarilyDisabled: "Dane tymczasowo wyłączone",
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
        description: "Klucz API nie ma dostępu do odczytu tej organizacji.",
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
    enums: {
      orgStatus: {
        new: "Nowa",
        provisioning: "Konfigurowanie",
        done: "Aktywna",
        deleting: "Usuwanie",
        deleted: "Usunięta",
      },
    },
    success: {
      title: "Sukces",
      description: "Organizacja pobrana pomyślnie.",
    },
  },
  put: {
    title: "Aktualizuj organizację Corvina",
    description: "Aktualizuje konfigurację organizacji Corvina.",
    container: {
      title: "Edytuj organizację",
      description:
        "Zmień etykietę, ustawienia sieciowe i przełączniki funkcji.",
    },
    id: {
      label: "ID organizacji",
      description:
        "Liczbowy lub nazwowy identyfikator organizacji do aktualizacji.",
    },
    label: {
      label: "Etykieta",
      description: "Czytelna etykieta wyświetlana w interfejsie Corvina.",
      placeholder: "Moja organizacja",
    },
    hostname: {
      label: "Własna nazwa hosta",
      description:
        "Niestandardowy hostname dla tej organizacji (zostaw puste, aby usunąć).",
      placeholder: "https://org.przyklad.pl",
    },
    ipAddressesWhitelist: {
      label: "Whitelist IP",
      description:
        "Lista dozwolonych adresów IP oddzielona przecinkami (zostaw puste, aby zezwolić wszystkim).",
      placeholder: "127.0.0.1, 10.0.0.0/8",
    },
    privateAccess: {
      label: "Prywatny dostęp",
      description:
        "Ogranicz dostęp tylko do użytkowników połączonych przez VPN.",
    },
    allowDisablePrivateAccess: {
      label: "Zezwalaj na wyłączenie prywatnego dostępu",
      description:
        "Pozwól użytkownikom tymczasowo wyłączyć ograniczenie prywatnego dostępu.",
    },
    allowHostname: {
      label: "Zezwalaj na własny hostname",
      description: "Aktywuj pole własnej nazwy hosta powyżej.",
    },
    dataEnabled: {
      label: "Dane aktywne",
      description: "Włącz usługi danych dla tej organizacji.",
    },
    vpnEnabled: {
      label: "VPN aktywny",
      description: "Włącz dostęp VPN dla tej organizacji.",
    },
    storeEnabled: {
      label: "Sklep aktywny",
      description: "Włącz sklep Corvina dla tej organizacji.",
    },
    mfaRequired: {
      label: "Wymagane MFA",
      description:
        "Wymuś uwierzytelnianie wieloskładnikowe dla wszystkich użytkowników.",
    },
    response: {
      id: "ID",
      name: "Nazwa",
      label: "Etykieta",
      status: "Status",
      resourceId: "ID zasobu",
      privateAccess: "Prywatny dostęp",
      allowDisablePrivateAccess: "Zezwalaj na wyłączenie prywatnego dostępu",
      hostname: "Nazwa hosta",
      hostnameAllowed: "Hostname dozwolony",
      dataEnabled: "Dane aktywne",
      vpnEnabled: "VPN aktywny",
      vpnPairingMode: "Tryb parowania VPN",
      vpnOtpRequired: "Wymagany OTP VPN",
      ipAddressesWhitelist: "Whitelist IP",
      userCanAccess: "Dostęp użytkownika",
      storeEnabled: "Sklep aktywny",
      dataTemporarilyDisabled: "Dane tymczasowo wyłączone",
      mfaRequired: "Wymagane MFA",
    },
    submitButton: { label: "Zapisz zmiany", loadingText: "Zapisywanie…" },
    errors: {
      validation: {
        title: "Nieprawidłowa aktualizacja",
        description: "Corvina odrzuciła ładunek aktualizacji.",
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
        description: "Klucz API nie ma dostępu do zapisu tej organizacji.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Organizacja o tym ID nie istnieje.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina zgłosiła konflikt dla tej aktualizacji.",
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
      title: "Zapisano",
      description: "Organizacja zaktualizowana pomyślnie.",
    },
  },
};
