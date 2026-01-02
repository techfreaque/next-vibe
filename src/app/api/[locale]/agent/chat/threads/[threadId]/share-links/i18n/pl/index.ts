import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Pobierz linki udostępniania",
    description: "Pobierz wszystkie linki udostępniania dla wątku",
    container: {
      title: "Linki udostępniania",
      description: "Wszystkie linki udostępniania dla tego wątku",
    },
    response: {
      shareLink: {
        title: "Link udostępniania",
        id: {
          content: "ID linku",
        },
        token: {
          content: "Token udostępniania",
        },
        label: {
          content: "Etykieta",
        },
        allowPosting: {
          content: "Zezwalaj na publikowanie",
        },
        requireAuth: {
          content: "Wymagaj uwierzytelnienia",
        },
        active: {
          content: "Aktywny",
        },
        accessCount: {
          content: "Liczba dostępów",
        },
        lastAccessedAt: {
          content: "Ostatni dostęp",
        },
        createdAt: {
          content: "Utworzono",
        },
        editAction: {
          text: "Edytuj",
        },
        deleteAction: {
          text: "Odwołaj",
        },
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Musisz być zalogowany, aby wyświetlić linki udostępniania",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do wyświetlenia tych linków",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Wątek lub link udostępniania nie został znaleziony",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się pobrać linków udostępniania",
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
        description: "Ten zasób został zmodyfikowany",
      },
    },
    success: {
      title: "Sukces",
      description: "Linki udostępniania pobrane pomyślnie",
    },
  },
  post: {
    title: "Utwórz link udostępniania",
    description: "Utwórz nowy link udostępniania dla wątku",
    container: {
      title: "Nowy link udostępniania",
      description: "Skonfiguruj swój nowy link udostępniania",
    },
    label: {
      label: "Etykieta",
      description: "Opcjonalna etykieta do identyfikacji tego linku",
    },
    allowPosting: {
      label: "Zezwalaj na publikowanie",
      description: "Zezwalaj odbiorcom na publikowanie wiadomości w tym wątku",
    },
    requireAuth: {
      label: "Wymagaj uwierzytelnienia",
      description: "Wymagaj od użytkowników zalogowania się, aby uzyskać dostęp do tego linku",
    },
    response: {
      id: {
        content: "ID linku",
      },
      token: {
        content: "Token udostępniania",
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry linku udostępniania",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Musisz być zalogowany, aby tworzyć linki udostępniania",
      },
      forbidden: {
        title: "Zabronione",
        description: "Tylko wątki w folderze Udostępnione mogą być udostępniane przez linki",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Wątek nie został znaleziony",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się utworzyć linku udostępniania",
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
        description: "Ten zasób został zmodyfikowany",
      },
    },
    success: {
      title: "Sukces",
      description: "Link udostępniania utworzony pomyślnie",
    },
  },
  patch: {
    title: "Zaktualizuj link udostępniania",
    description: "Zaktualizuj istniejący link udostępniania",
    container: {
      title: "Zaktualizuj link udostępniania",
      description: "Zmodyfikuj ustawienia linku udostępniania",
    },
    linkId: {
      label: "ID linku",
      description: "ID linku do zaktualizowania",
    },
    label: {
      label: "Etykieta",
      description: "Opcjonalna etykieta do identyfikacji tego linku",
    },
    allowPosting: {
      label: "Zezwalaj na publikowanie",
      description: "Zezwalaj odbiorcom na publikowanie wiadomości w tym wątku",
    },
    requireAuth: {
      label: "Wymagaj uwierzytelnienia",
      description: "Wymagaj od użytkowników zalogowania się, aby uzyskać dostęp do tego linku",
    },
    deleteAction: {
      text: "Odwołaj link",
    },
    response: {
      id: {
        content: "ID linku",
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry aktualizacji",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Musisz być zalogowany, aby aktualizować linki udostępniania",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do aktualizacji tego linku",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Link udostępniania nie został znaleziony",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się zaktualizować linku udostępniania",
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
        description: "Ten zasób został zmodyfikowany",
      },
    },
    success: {
      title: "Sukces",
      description: "Link udostępniania zaktualizowany pomyślnie",
    },
  },
  delete: {
    title: "Unieważnij link udostępniania",
    description: "Unieważnij aktywny link udostępniania",
    container: {
      title: "Unieważnij link udostępniania",
      description: "To spowoduje trwałe dezaktywowanie linku",
    },
    linkId: {
      label: "ID linku",
      description: "ID linku do unieważnienia",
    },
    response: {
      id: {
        content: "ID linku",
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe ID linku",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Musisz być zalogowany, aby unieważnić linki udostępniania",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do unieważnienia tego linku",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Link udostępniania nie został znaleziony",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się unieważnić linku udostępniania",
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
        description: "Ten zasób został zmodyfikowany",
      },
    },
    success: {
      title: "Sukces",
      description: "Link udostępniania unieważniony pomyślnie",
    },
  },
};
