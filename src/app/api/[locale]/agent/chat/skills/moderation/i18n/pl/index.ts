export const translations = {
  category: "Umiejętności AI",
  tags: {
    moderation: "Moderacja",
  },
  get: {
    title: "Zgłoszone umiejętności",
    description:
      "Lista umiejętności ze zgłoszeniami, posortowana według liczby zgłoszeń",
    fields: {
      minReports: {
        label: "Min. zgłoszeń",
        description:
          "Minimalna liczba zgłoszeń do uwzględnienia (domyślnie: 1)",
      },
      limit: {
        label: "Limit",
        description: "Maksymalna liczba zwracanych umiejętności",
      },
      offset: {
        label: "Offset",
        description: "Liczba pomijanych umiejętności dla stronicowania",
      },
    },
    response: {
      skills: {
        id: { content: "ID umiejętności" },
        name: { content: "Nazwa" },
        ownerAuthorId: { content: "ID właściciela" },
        status: { content: "Status" },
        reportCount: { content: "Zgłoszenia" },
        voteCount: { content: "Głosy" },
        trustLevel: { content: "Poziom zaufania" },
        publishedAt: { content: "Opublikowano" },
        updatedAt: { content: "Zaktualizowano" },
      },
      totalCount: { content: "Łącznie" },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe żądanie",
      },
      network: { title: "Błąd sieci", description: "Połączenie nieudane" },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Wymagany dostęp administratora",
      },
      forbidden: {
        title: "Zabronione",
        description: "Wymagany dostęp administratora",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono umiejętności",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się załadować zgłoszonych umiejętności",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: { title: "Konflikt", description: "Wystąpił konflikt danych" },
    },
    success: {
      title: "Umiejętności załadowane",
      description: "Zgłoszone umiejętności pobrane pomyślnie",
    },
    empty: "Brak zgłoszonych umiejętności - społeczność wygląda zdrowo!",
    action: {
      moderate: "Moderuj",
    },
    backButton: {
      label: "Wstecz",
    },
  },
  patch: {
    title: "Moderuj umiejętność",
    description: "Ukryj zgłoszoną umiejętność lub wyczyść jej zgłoszenia",
    fields: {
      id: {
        label: "ID umiejętności",
        description: "ID umiejętności do moderowania",
      },
      action: {
        label: "Akcja",
        description:
          "hide = ustaw status na UNLISTED, clear = zresetuj liczbę zgłoszeń do 0",
      },
    },
    response: {
      id: { content: "ID umiejętności" },
      status: { content: "Nowy status" },
      reportCount: { content: "Liczba zgłoszeń" },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe żądanie",
      },
      network: { title: "Błąd sieci", description: "Połączenie nieudane" },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Wymagany dostęp administratora",
      },
      forbidden: {
        title: "Zabronione",
        description: "Wymagany dostęp administratora",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono umiejętności",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się moderować umiejętności",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: { title: "Konflikt", description: "Wystąpił konflikt danych" },
    },
    success: {
      title: "Umiejętność moderowana",
      description: "Akcja zastosowana pomyślnie",
    },
  },
};
