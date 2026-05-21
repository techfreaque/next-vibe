export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    roles: "Role",
  },
  get: {
    title: "Lista ról organizacji",
    description: "Wyświetla wszystkie role zdefiniowane w organizacji Corvina.",
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
      description: "Liczba ról na stronie (maks. 100).",
    },
    response: {
      roles: {
        id: "ID",
        name: "Nazwa",
        label: "Etykieta",
        resourceId: "ID zasobu",
        description: "Opis",
        type: "Typ",
        owner: "Właściciel",
        enabled: "Aktywna",
        defaultStar: "Domyślna",
        deleted: "Usunięta",
        createdAt: "Utworzono",
        updatedAt: "Zaktualizowano",
        deviceGeneralPermission: "Uprawnienia urządzenia",
        vpnGeneralPermission: "Uprawnienia VPN",
        orgResourceId: "ID zasobu organizacji",
      },
      totalElements: "Łączna liczba ról",
      totalPages: "Łączna liczba stron",
      last: "Ostatnia strona",
    },
    widget: {
      title: "Role",
      emptyState: "Brak ról.",
      badges: {
        enabled: "Aktywna",
        disabled: "Nieaktywna",
        defaultRole: "Domyślna",
      },
    },
    enums: {
      roleType: {
        application: "Aplikacja",
        device: "Urządzenie",
        undefined: "Nieokreślony",
      },
      roleOwner: {
        system: "System",
        organization: "Organizacja",
        application: "Aplikacja",
      },
      permissionLevel: {
        none: "Brak",
        regularUser: "Zwykły użytkownik",
        administrator: "Administrator",
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
        description: "Klucz API nie ma dostępu do listy ról.",
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
      description: "Role pobrane pomyślnie.",
    },
  },
};
