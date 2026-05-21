export const translations = {
  category: "Corvina",
  tags: { corvina: "Corvina", alarms: "Alarmy" },
  post: {
    title: "Szukaj alarmów",
    description:
      "Przeszukuje i filtruje aktywne alarmy na wszystkich urządzeniach Corvina.",
    filter: {
      label: "Filtr",
      description: "Wyrażenie OData do zawężenia wyników.",
      placeholder: "np. severity gt 3",
    },
    page: {
      label: "Strona",
      description: "Numer strony (od 0).",
    },
    pageSize: {
      label: "Rozmiar strony",
      description: "Liczba alarmów na stronie.",
    },
    orderBy: {
      label: "Sortuj według",
      description: "Pole, według którego sortowane są wyniki.",
    },
    orderDir: {
      label: "Kierunek sortowania",
      description: "Rosnąco lub malejąco.",
    },
    scopedOrganization: {
      label: "Organizacja",
      description: "Ogranicz wyniki do konkretnego ID zasobu organizacji.",
      placeholder: "np. exorde.connex.acme",
    },
    deviceName: {
      label: "Nazwa urządzenia",
      description: "Filtruj alarmy według nazwy urządzenia.",
      placeholder: "np. moje-urządzenie",
    },
    deviceGroups: {
      label: "Grupy urządzeń",
      description: "Lista grup urządzeń oddzielona przecinkami.",
      placeholder: "np. grupa1,grupa2",
    },
    response: {
      alarms: {
        id: "ID",
        name: "Nazwa",
        description: "Opis",
        deviceId: "ID urządzenia",
        deviceLabel: "Urządzenie",
        tag: "Tag",
        severity: "Poziom ważności",
        status: "Status",
        action: "Akcja",
        alarmEnabled: "Włączony",
        ack: "Wymaga potwierdzenia",
        reset: "Wymaga resetu",
        eventTimestamp: "Czas zdarzenia",
        updatedAt: "Zaktualizowano",
        acknowledgedDate: "Potwierdzono",
        orgResourceId: "Organizacja",
        user: "Użytkownik",
        comment: "Komentarz",
        timestampAction: "Czas akcji",
        platformAction: "Akcja platformy",
        value_double: "Wartość (double)",
        value_integer: "Wartość (integer)",
        value_boolean: "Wartość (boolean)",
        value_string: "Wartość (string)",
        realmId: "Realm",
      },
      totalElements: "Łącznie",
      totalPages: "Strony",
      last: "Ostatnia strona",
    },
    widget: {
      title: "Alarmy",
      noAlarmsFound: "Nie znaleziono alarmów.",
      filterPlaceholder: "Filtruj alarmy…",
      back: "Wstecz",
    },
    enums: {
      alarmStatus: {
        active: "Aktywny",
        notActive: "Nieaktywny",
      },
      alarmAction: {
        ack: "Potwierdzony",
        noAck: "Niepotwierdzony",
      },
      alarmActionType: {
        ack: "Potwierdź",
        reset: "Resetuj",
        clear: "Usuń",
      },
      bulkAlarmActionType: {
        ackAll: "Potwierdź wszystkie",
        resetAll: "Resetuj wszystkie",
        clearAll: "Usuń wszystkie",
      },
      alarmOrderBy: {
        eventTimestamp: "Czas zdarzenia",
        updatedAt: "Czas aktualizacji",
        severity: "Poziom ważności",
      },
      alarmOrderDir: {
        asc: "Rosnąco",
        desc: "Malejąco",
      },
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Zapytanie wyszukiwania było nieprawidłowe.",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z Corvina Platform API.",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Sprawdź CORVINA_API_KEY.",
      },
      forbidden: {
        title: "Zabroniony",
        description: "Brak dostępu do wyszukiwania alarmów.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Endpoint wyszukiwania alarmów nie istnieje.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina zgłosiła konflikt.",
      },
      server: {
        title: "Błąd serwera",
        description: "Corvina Platform API zwróciła błąd serwera.",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Są niezapisane zmiany.",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd.",
      },
    },
    success: {
      title: "Sukces",
      description: "Alarmy pobrane.",
    },
  },
};
