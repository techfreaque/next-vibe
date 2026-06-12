import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "SSH",

  errors: {
    noRowReturned: "Brak zwróconego wiersza",
    notYourConnection: "To połączenie nie należy do ciebie",
    mountNotFound: "Punkt montowania nie znaleziony",
  },

  list: {
    title: "Zamontowane katalogi",
    titleShort: "Punkty montowania",
    description:
      "Nazwane skróty katalogów dla tego połączenia. Każdy punkt montowania pojawia się jako /ssh/<połączenie>/<nazwa>/ w cortex. Terminale startują w domyślnym katalogu.",
    fields: {
      connectionId: {
        label: "Połączenie",
        description: "Połączenie SSH, do którego należą te punkty montowania",
      },
    },
    response: {
      mounts: { title: "Punkty montowania" },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Sprawdź dane i spróbuj ponownie",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Wymagane logowanie",
      },
      forbidden: { title: "Brak dostępu", description: "Odmowa dostępu" },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się załadować punktów montowania",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Połączenie nie znalezione",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Punkt montowania o tej nazwie już istnieje",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można osiągnąć serwera",
      },
    },
    success: {
      title: "Punkty montowania załadowane",
      description: "Punkty montowania katalogów dla tego połączenia",
    },
  },

  create: {
    title: "Dodaj punkt montowania",
    titleShort: "Dodaj",
    description:
      "Dodaj nazwany skrót katalogu. Nazwa staje się segmentem ścieżki: /ssh/<połączenie>/<nazwa>/",
    fields: {
      connectionId: {
        label: "ID połączenia",
        description: "Połączenie SSH, do którego dodać punkt montowania",
      },
      path: {
        label: "Ścieżka katalogu",
        description:
          "Bezwzględna ścieżka na maszynie, np. /home/max/projekt. Katalog startowy terminala gdy to jest domyślny punkt montowania.",
        placeholder: "/home/uzytkownik/projekt",
      },
      isDefault: {
        label: "Domyślny punkt montowania",
        description:
          "Nowe sesje terminala startują w tym katalogu. Tylko jeden punkt montowania na połączenie może być domyślny.",
      },
    },
    response: {
      id: { title: "ID punktu montowania" },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Sprawdź pola i spróbuj ponownie",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Wymagane logowanie",
      },
      forbidden: { title: "Brak dostępu", description: "Odmowa dostępu" },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się zapisać punktu montowania",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Połączenie nie znalezione",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: {
        title: "Nazwa zajęta",
        description: "Punkt montowania o tej nazwie już istnieje",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można osiągnąć serwera",
      },
    },
    success: {
      title: "Punkt montowania dodany",
      description: "Punkt montowania katalogu dodany pomyślnie",
    },
  },

  detail: {
    titleGet: "Punkt montowania",
    titleShortGet: "Punkt montowania",
    descriptionGet: "Szczegóły punktu montowania katalogu.",
    titlePatch: "Edytuj punkt montowania",
    titleShortPatch: "Edytuj",
    descriptionPatch: "Zmień nazwę lub przenieś punkt montowania.",
    titleDelete: "Usuń punkt montowania",
    titleShortDelete: "Usuń",
    descriptionDelete: "Usuń skrót katalogu z tego połączenia.",
    fields: {
      mountId: {
        label: "ID punktu montowania",
        description: "Unikalny identyfikator tego punktu montowania",
      },
      path: {
        label: "Ścieżka katalogu",
        description: "Bezwzględna ścieżka na maszynie",
        placeholder: "/home/uzytkownik/projekt",
      },
      isDefault: {
        label: "Domyślny punkt montowania",
        description: "Nowe sesje terminala startują w tym katalogu",
      },
    },
    response: {
      id: { title: "ID" },
      name: { title: "Nazwa" },
      path: { title: "Ścieżka" },
      isDefault: { title: "Domyślny" },
      createdAt: { title: "Utworzony" },
      updatedAt: { title: "Zaktualizowany" },
      deleted: { title: "Usunięty" },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Sprawdź dane i spróbuj ponownie",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Wymagane logowanie",
      },
      forbidden: { title: "Brak dostępu", description: "Odmowa dostępu" },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się zaktualizować punktu montowania",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Punkt montowania nie znaleziony",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: {
        title: "Nazwa zajęta",
        description: "Punkt montowania o tej nazwie już istnieje",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można osiągnąć serwera",
      },
    },
    successGet: {
      title: "Punkt montowania załadowany",
      description: "Szczegóły punktu montowania",
    },
    successPatch: {
      title: "Punkt montowania zaktualizowany",
      description: "Zaktualizowano pomyślnie",
    },
    successDelete: {
      title: "Punkt montowania usunięty",
      description: "Usunięto pomyślnie",
    },
    widget: {
      confirmDelete: "Usunąć ten punkt montowania?",
    },
  },

  widget: {
    noMounts: "Brak skonfigurowanych punktów montowania",
    noMountsHint:
      "Dodaj punkt montowania, aby utworzyć skrót katalogu. Terminale będą startować w domyślnym katalogu.",
    addMount: "Dodaj punkt montowania",
    defaultBadge: "domyślny",
    cortexPath: "Ścieżka cortex",
    cortexPathPrefix: "/ssh/…/",
    pathArrow: "→",
  },
};
