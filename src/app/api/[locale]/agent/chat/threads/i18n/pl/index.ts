import { translations as threadsThreadIdTranslations } from "../../[threadId]/i18n/pl";
import { translations as searchTranslations } from "../../search/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...searchTranslations,
  errors: {
    count_failed: "Nie udało się pobrać liczby konwersacji: {{error}}",
  },
  get: {
    title: "Lista wątków czatu",
    description:
      "Pobierz stronicowaną listę wątków czatu z opcjami filtrowania",
    container: {
      title: "Lista wątków",
      description: "Przeglądaj i filtruj wątki czatu",
    },
    sections: {
      pagination: {
        title: "Stronicowanie",
        description: "Ustawienia nawigacji stron",
      },
      filters: {
        title: "Filtry",
        description: "Filtruj wątki według kryteriów",
      },
    },
    page: {
      label: "Strona",
      description: "Numer strony do pobrania",
    },
    limit: {
      label: "Limit",
      description: "Liczba wątków na stronę",
    },
    rootFolderId: {
      label: "Folder główny",
      description:
        "Filtruj według folderu głównego (private, shared, public, incognito)",
    },
    subFolderId: {
      label: "Podfolder",
      description: "Filtruj według ID podfolderu (opcjonalnie)",
    },
    status: {
      label: "Status",
      description: "Filtruj według statusu wątku",
    },
    search: {
      label: "Szukaj",
      description: "Szukaj wątków według tytułu lub treści",
      placeholder: "Szukaj wątków...",
    },
    isPinned: {
      label: "Tylko Przypięte",
      description: "Pokaż tylko przypięte wątki",
    },
    dateFrom: {
      label: "Data Od",
      description: "Filtruj wątki utworzone po tej dacie",
    },
    dateTo: {
      label: "Data Do",
      description: "Filtruj wątki utworzone przed tą datą",
    },
    response: {
      title: "Odpowiedź listy wątków",
      description: "Stronicowana lista wątków",
      threads: {
        thread: {
          title: "Wątek",
          id: {
            content: "ID wątku",
          },
          threadTitle: {
            content: "Tytuł",
          },
          rootFolderId: {
            content: "Folder główny",
          },
          folderId: {
            content: "ID folderu",
          },
          status: {
            content: "Status",
          },
          preview: {
            content: "Podgląd",
          },
          pinned: {
            content: "Przypięty",
          },
          createdAt: {
            content: "Utworzono",
          },
          updatedAt: {
          content: "Zaktualizowano",
        },
        canEdit: {
          content: "Może edytować",
        },
        canPost: {
          content: "Może publikować",
        },
        canModerate: {
          content: "Może moderować",
        },
        canDelete: {
          content: "Może usuwać",
        },
        canManagePermissions: {
          content: "Może zarządzać uprawnieniami",
        },
      },
    },
      totalCount: {
        content: "Całkowita liczba",
      },
      pageCount: {
        content: "Liczba stron",
      },
      page: {
        content: "Bieżąca strona",
      },
      limit: {
        content: "Elementów na stronę",
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Musisz być zalogowany, aby wyświetlić wątki",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do wyświetlenia wątków",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono wątków",
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
      description: "Wątki zostały pomyślnie pobrane",
    },
  },
  post: {
    title: "Utwórz wątek czatu",
    description: "Utwórz nowy wątek czatu",
    form: {
      title: "Utwórz wątek",
      description: "Skonfiguruj ustawienia nowego wątku",
    },
    sections: {
      thread: {
        title: "Szczegóły wątku",
        description: "Podstawowe informacje o wątku",
      },
    },
    threadTitle: {
      label: "Tytuł",
      description: "Tytuł wątku",
      placeholder: "Wprowadź tytuł wątku...",
      default: "Nowy czat",
    },
    rootFolderId: {
      label: "Folder główny",
      description: "Folder główny (private, shared, public, incognito)",
    },
    subFolderId: {
      label: "Podfolder",
      description: "Podfolder dla wątku (opcjonalnie)",
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
      placeholder: "Wprowadź prompt systemowy...",
    },
    response: {
      title: "Utworzony wątek",
      description: "Szczegóły nowo utworzonego wątku",
      thread: {
        title: "Wątek",
        id: {
          content: "ID wątku",
        },
        threadTitle: {
          content: "Tytuł",
        },
        rootFolderId: {
          content: "Folder główny",
        },
        subFolderId: {
          content: "ID podfolderu",
        },
        status: {
          content: "Status",
        },
        createdAt: {
          content: "Utworzono",
        },
        updatedAt: {
          content: "Zaktualizowano",
        },
        canEdit: {
          content: "Może edytować",
        },
        canPost: {
          content: "Może publikować",
        },
        canModerate: {
          content: "Może moderować",
        },
        canDelete: {
          content: "Może usuwać",
        },
        canManagePermissions: {
          content: "Może zarządzać uprawnieniami",
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
        description: "Musisz być zalogowany, aby tworzyć wątki",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do tworzenia wątków",
        incognitoNotAllowed:
          "Wątki incognito nie mogą być tworzone na serwerze",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasób nie znaleziony",
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
        description: "Wątek o tej nazwie już istnieje",
      },
    },
    success: {
      title: "Sukces",
      description: "Wątek został pomyślnie utworzony",
    },
  },
  threadId: threadsThreadIdTranslations,
};
