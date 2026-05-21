export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    roles: "Role",
  },
  post: {
    title: "Utwórz rolę",
    description: "Tworzy nową rolę w organizacji Corvina.",
    orgId: {
      label: "ID organizacji",
      description: "Liczbowy identyfikator organizacji Corvina.",
    },
    name: {
      label: "Nazwa",
      description: "Nazwa roli (min. 2 znaki).",
      placeholder: "moja-rola",
    },
    label: {
      label: "Etykieta",
      description: "Czytelna etykieta wyświetlana w interfejsie.",
      placeholder: "Moja rola",
    },
    descriptionField: {
      label: "Opis",
      description: "Opcjonalny opis uprawnień tej roli.",
      placeholder: "Umożliwia dostęp do…",
    },
    type: {
      label: "Typ roli",
      description: "Rodzaj zasobu, do którego odnosi się ta rola.",
    },
    enabled: {
      label: "Aktywna",
      description: "Aktywuj rolę od razu po utworzeniu.",
    },
    defaultStar: {
      label: "Rola domyślna",
      description: "Automatycznie przypisuj tę rolę nowym użytkownikom.",
    },
    deviceGeneralPermission: {
      label: "Uprawnienia urządzenia",
      description: "Ogólny poziom uprawnień do dostępu do urządzeń.",
    },
    vpnGeneralPermission: {
      label: "Uprawnienia VPN",
      description: "Ogólny poziom uprawnień do dostępu VPN.",
    },
    response: {
      id: "ID",
      name: "Nazwa",
      label: "Etykieta",
      type: "Typ",
      enabled: "Aktywna",
    },
    submitButton: {
      label: "Utwórz rolę",
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
        description: "Klucz API nie ma uprawnień do tworzenia ról.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Organizacja o tym ID nie istnieje.",
      },
      conflict: {
        title: "Konflikt",
        description: "Rola o tej nazwie już istnieje.",
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
      description: "Rola utworzona pomyślnie.",
    },
  },
};
