import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    messages: "Wiadomości",
  },
  search: {
    get: {
      title: "Globalne wyszukiwanie wiadomości",
      description:
        "Wyszukiwanie wiadomości we wszystkich wątkach za pomocą wyszukiwania pełnotekstowego",
      container: {
        title: "Globalne wyszukiwanie wiadomości",
        description: "Wyszukaj wiadomości we wszystkich wątkach",
      },
      query: {
        label: "Zapytanie",
        description: "Tekst do wyszukania w wiadomościach",
      },
      sections: {
        filters: {
          title: "Filtry",
          description: "Opcjonalne filtry do zawężenia wyników wyszukiwania",
        },
        pagination: {
          title: "Stronicowanie",
          description: "Ustawienia nawigacji po stronach",
        },
      },
      rootFolderId: {
        label: "Folder główny",
        description:
          "Ogranicz wyszukiwanie do określonego typu folderu (prywatny, udostępniony, publiczny, cron)",
      },
      role: {
        label: "Rola wiadomości",
        description:
          "Filtruj według roli wiadomości (użytkownik, asystent, system, narzędzie, błąd)",
      },
      startDate: {
        label: "Data początkowa",
        description: "Uwzględnij tylko wiadomości utworzone po tej dacie",
      },
      endDate: {
        label: "Data końcowa",
        description: "Uwzględnij tylko wiadomości utworzone przed tą datą",
      },
      page: {
        label: "Strona",
        description: "Numer strony do pobrania",
      },
      limit: {
        label: "Limit",
        description: "Liczba wyników na stronę",
      },
      response: {
        results: {
          message: {
            title: "Wynik wiadomości",
            messageId: {
              content: "ID wiadomości",
            },
            threadId: {
              content: "ID wątku",
            },
            threadTitle: {
              content: "Tytuł wątku",
            },
            role: {
              content: "Rola",
            },
            headline: {
              content: "Fragment treści",
            },
            createdAt: {
              content: "Utworzono",
            },
            rootFolderId: {
              content: "Folder główny",
            },
          },
        },
        total: {
          content: "Łączna liczba wyników",
        },
        page: {
          content: "Bieżąca strona",
        },
      },
      errors: {
        validationFailed: {
          title: "Walidacja nieudana",
          description: "Podano nieprawidłowe parametry wyszukiwania",
        },
        network: {
          title: "Błąd sieci",
          description: "Nie można połączyć się z serwerem",
        },
        unauthorized: {
          title: "Nieautoryzowany",
          description: "Musisz być zalogowany, aby wyszukiwać wiadomości",
        },
        forbidden: {
          title: "Zabronione",
          description: "Nie masz uprawnień do wykonania tego wyszukiwania",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Nie znaleziono wyników pasujących do zapytania",
        },
        serverError: {
          title: "Błąd serwera",
          description: "Wystąpił wewnętrzny błąd serwera podczas wyszukiwania",
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
        description: "Globalne wyszukiwanie wiadomości zakończone pomyślnie",
      },
    },
  },
};
