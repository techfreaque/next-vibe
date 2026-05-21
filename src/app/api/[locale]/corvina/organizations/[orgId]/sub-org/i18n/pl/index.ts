export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    organizations: "Organizacje",
  },
  post: {
    title: "Utwórz podorganizację",
    description:
      "Tworzy organizację podrzędną w ramach istniejącej organizacji Corvina.",
    orgId: {
      label: "ID organizacji nadrzędnej",
      description: "Liczbowy identyfikator nadrzędnej organizacji Corvina.",
    },
    name: {
      label: "Nazwa",
      description:
        "Identyfikator w formie slug (małe litery, cyfry, myślniki, podkreślniki).",
      placeholder: "moja-podorganizacja",
    },
    label: {
      label: "Etykieta",
      description: "Czytelna etykieta wyświetlana w interfejsie Corvina.",
      placeholder: "Moja podorganizacja",
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
    hostname: {
      label: "Własna nazwa hosta",
      description:
        "Opcjonalna niestandardowa nazwa hosta dla tej podorganizacji.",
      placeholder: "https://sub.przyklad.pl",
    },
    allowHostname: {
      label: "Zezwalaj na własny hostname",
      description: "Aktywuj pole własnej nazwy hosta.",
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
    },
    submitButton: {
      label: "Utwórz podorganizację",
      loadingText: "Tworzenie…",
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
        description: "Klucz API nie ma uprawnień do tworzenia podorganizacji.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Organizacja nadrzędna o tym ID nie istnieje.",
      },
      conflict: {
        title: "Konflikt",
        description: "Organizacja o tej nazwie już istnieje.",
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
      description: "Podorganizacja utworzona pomyślnie.",
    },
  },
};
