import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Pobierz wątek czatu",
    description: "Pobierz określony wątek czatu według ID",
    container: {
      title: "Szczegóły wątku",
      description: "Wyświetl szczegółowe informacje o wątku",
    },
    id: {
      label: "ID wątku",
      description: "Unikalny identyfikator wątku",
      placeholder: "Wprowadź ID wątku...",
    },
    response: {
      thread: {
        title: "Szczegóły wątku",
        description: "Pełne informacje o wątku",
        id: {
          content: "ID wątku",
        },
        userId: {
          content: "ID użytkownika",
        },
        threadTitle: {
          content: "Tytuł",
        },
        folderId: {
          content: "ID folderu",
        },
        status: {
          content: "Status",
        },
        defaultModel: {
          content: "Domyślny model",
        },
        defaultTone: {
          content: "Domyślny ton",
        },
        systemPrompt: {
          content: "Prompt systemowy",
        },
        pinned: {
          content: "Przypięty",
        },
        archived: {
          content: "Zarchiwizowany",
        },
        tags: {
          content: "Tagi",
        },
        preview: {
          content: "Podgląd",
        },
        metadata: {
          content: "Metadane",
        },
        createdAt: {
          content: "Utworzono",
        },
        updatedAt: {
          content: "Zaktualizowano",
        },
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Podano nieprawidłowe ID wątku",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Musisz być zalogowany, aby wyświetlić wątki",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do wyświetlenia tego wątku",
      },
      notFound: {
        title: "Wątek nie znaleziony",
        description: "Żądany wątek nie został znaleziony",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z serwerem",
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
        description: "Wystąpił konflikt",
      },
    },
    success: {
      title: "Sukces",
      description: "Wątek został pomyślnie pobrany",
    },
  },
  patch: {
    title: "Aktualizuj wątek czatu",
    description: "Aktualizuj istniejący wątek czatu",
    container: {
      title: "Aktualizuj wątek",
      description: "Modyfikuj ustawienia wątku",
    },
    id: {
      label: "ID wątku",
      description: "Unikalny identyfikator wątku do aktualizacji",
      placeholder: "Wprowadź ID wątku...",
    },
    sections: {
      updates: {
        title: "Aktualizacje wątku",
        description: "Pola do aktualizacji",
      },
    },
    threadTitle: {
      label: "Tytuł",
      description: "Tytuł wątku",
      placeholder: "Wprowadź tytuł wątku...",
    },
    folderId: {
      label: "Folder",
      description: "Folder dla wątku",
    },
    status: {
      label: "Status",
      description: "Status wątku",
    },
    defaultModel: {
      label: "Domyślny model",
      description: "Domyślny model AI dla tego wątku",
    },
    defaultTone: {
      label: "Domyślny ton",
      description: "Domyślna persona/ton dla tego wątku",
    },
    systemPrompt: {
      label: "Prompt systemowy",
      description: "Niestandardowy prompt systemowy dla tego wątku",
    },
    pinned: {
      label: "Przypięty",
      description: "Przypnij ten wątek na górze",
    },
    archived: {
      label: "Zarchiwizowany",
      description: "Zarchiwizuj ten wątek",
    },
    tags: {
      label: "Tagi",
      description: "Tagi do organizacji",
    },
    response: {
      thread: {
        title: "Zaktualizowany wątek",
        description: "Szczegóły wątku po aktualizacji",
        id: {
          content: "ID wątku",
        },
        userId: {
          content: "ID użytkownika",
        },
        threadTitle: {
          content: "Tytuł",
        },
        folderId: {
          content: "ID folderu",
        },
        status: {
          content: "Status",
        },
        defaultModel: {
          content: "Domyślny model",
        },
        defaultTone: {
          content: "Domyślny ton",
        },
        systemPrompt: {
          content: "Prompt systemowy",
        },
        pinned: {
          content: "Przypięty",
        },
        archived: {
          content: "Zarchiwizowany",
        },
        tags: {
          content: "Tagi",
        },
        preview: {
          content: "Podgląd",
        },
        metadata: {
          content: "Metadane",
        },
        createdAt: {
          content: "Utworzono",
        },
        updatedAt: {
          content: "Zaktualizowano",
        },
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Podano nieprawidłowe dane wątku",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Musisz być zalogowany, aby aktualizować wątki",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do aktualizacji tego wątku",
      },
      notFound: {
        title: "Wątek nie znaleziony",
        description: "Wątek do aktualizacji nie został znaleziony",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z serwerem",
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
        description: "Wystąpił konflikt podczas aktualizacji",
      },
    },
    success: {
      title: "Sukces",
      description: "Wątek został pomyślnie zaktualizowany",
    },
  },
  delete: {
    title: "Usuń wątek czatu",
    description: "Usuń wątek czatu",
    container: {
      title: "Usuń wątek",
      description: "Trwale usuń wątek",
    },
    id: {
      label: "ID wątku",
      description: "Unikalny identyfikator wątku do usunięcia",
      placeholder: "Wprowadź ID wątku...",
      helpText: "OSTRZEŻENIE: Ta akcja nie może być cofnięta",
    },
    response: {
      success: {
        content: "Usunięcie pomy śl ne",
      },
      deletedId: {
        content: "ID usuniętego wątku",
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Podano nieprawidłowe ID wątku",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Musisz być zalogowany, aby usuwać wątki",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do usunięcia tego wątku",
      },
      notFound: {
        title: "Wątek nie znaleziony",
        description: "Wątek do usunięcia nie został znaleziony",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z serwerem",
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
        description: "Nie można usunąć wątku z powodu istniejących zależności",
      },
    },
    success: {
      title: "Sukces",
      description: "Wątek został pomyślnie usunięty",
    },
  },
};
