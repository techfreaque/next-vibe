export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    roles: "Role",
  },
  get: {
    title: "Pobierz rolę",
    description: "Pobiera dane pojedynczej roli organizacji Corvina.",
    orgId: {
      label: "ID organizacji",
      description: "Liczbowy identyfikator organizacji Corvina.",
    },
    roleId: {
      label: "ID roli",
      description: "Liczbowy identyfikator roli Corvina.",
    },
    response: {
      id: "ID",
      name: "Nazwa",
      label: "Etykieta",
      resourceId: "ID zasobu",
      description: "Opis",
      type: "Typ",
      owner: "Właściciel",
      enabled: "Aktywna",
      defaultStar: "Domyślna",
      deviceGeneralPermission: "Uprawnienia urządzenia",
      vpnGeneralPermission: "Uprawnienia VPN",
      orgResourceId: "ID zasobu organizacji",
    },
    widget: {
      edit: "Edytuj",
      delete: "Usuń",
      sections: {
        identity: "Tożsamość",
        permissions: "Uprawnienia",
      },
      labels: {
        name: "Nazwa",
        label: "Etykieta",
        resourceId: "ID zasobu",
        description: "Opis",
        type: "Typ",
        owner: "Właściciel",
      },
      badges: {
        enabled: "Aktywna",
        disabled: "Nieaktywna",
        defaultRole: "Domyślna",
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
        description: "Klucz API nie ma dostępu do tej roli.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Rola o tym ID nie istnieje.",
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
      description: "Rola pobrana pomyślnie.",
    },
  },
  put: {
    title: "Aktualizuj rolę",
    description: "Aktualizuje istniejącą rolę organizacji Corvina.",
    orgId: {
      label: "ID organizacji",
      description: "Liczbowy identyfikator organizacji Corvina.",
    },
    roleId: {
      label: "ID roli",
      description: "Liczbowy identyfikator roli do aktualizacji.",
    },
    label: {
      label: "Etykieta",
      description: "Czytelna etykieta wyświetlana w interfejsie.",
      placeholder: "Moja rola",
    },
    descriptionField: {
      label: "Opis",
      description: "Opis uprawnień tej roli.",
      placeholder: "Umożliwia dostęp do…",
    },
    type: {
      label: "Typ roli",
      description: "Rodzaj zasobu, do którego odnosi się ta rola.",
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
    submitButton: {
      label: "Zapisz zmiany",
      loadingText: "Zapisywanie…",
    },
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
        description: "Klucz API nie ma dostępu do zapisu tej roli.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Rola o tym ID nie istnieje.",
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
      description: "Rola zaktualizowana pomyślnie.",
    },
  },
  delete: {
    title: "Usuń rolę",
    description: "Trwale usuwa rolę organizacji Corvina.",
    orgId: {
      label: "ID organizacji",
      description: "Liczbowy identyfikator organizacji Corvina.",
    },
    roleId: {
      label: "ID roli",
      description: "Liczbowy identyfikator roli do usunięcia.",
    },
    widget: {
      warning: "Ta operacja jest nieodwracalna.",
      confirmButton: "Usuń rolę",
      cancelButton: "Anuluj",
      deletedTitle: "Rola usunięta",
      deletedDescription: "Rola została trwale usunięta.",
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
        description: "Klucz API nie ma uprawnień do usunięcia tej roli.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Rola o tym ID nie istnieje.",
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
      title: "Usunięto",
      description: "Rola usunięta pomyślnie.",
    },
  },
};
