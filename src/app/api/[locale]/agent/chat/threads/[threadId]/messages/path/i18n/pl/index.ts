import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    messages: "Wiadomości",
  },
  get: {
    title: "Pobierz ścieżkę konwersacji",
    description: "Pobierz wiadomości wzdłuż określonej ścieżki konwersacji",
    container: {
      title: "Ścieżka konwersacji",
      description: "Wiadomości w wybranej gałęzi konwersacji",
    },
    threadId: {
      label: "ID wątku",
      description: "ID wątku, z którego ma zostać pobrana ścieżka",
    },
    branchIndices: {
      label: "Indeksy gałęzi",
      description:
        "Mapa głębokości do indeksu gałęzi dla wyboru ścieżki konwersacji",
    },
    response: {
      title: "Wiadomości ścieżki",
      description: "Wiadomości w ścieżce konwersacji",
      messages: {
        message: {
          title: "Wiadomość",
          id: {
            content: "ID wiadomości",
          },
          threadId: {
            content: "ID wątku",
          },
          role: {
            content: "Rola",
          },
          content: {
            content: "Treść",
          },
          parentId: {
            content: "ID wiadomości nadrzędnej",
          },
          depth: {
            content: "Głębokość",
          },
          authorId: {
            content: "ID autora",
          },
          isAI: {
            content: "Czy AI",
          },
          model: {
            content: "Model",
          },
          tokens: {
            content: "Tokeny",
          },
          createdAt: {
            content: "Utworzono o",
          },
          updatedAt: {
            content: "Zaktualizowano o",
          },
        },
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z serwerem",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description:
          "Musisz być zalogowany, aby przeglądać ścieżki konwersacji",
      },
      forbidden: {
        title: "Zabronione",
        description:
          "Nie masz uprawnień do przeglądania tej ścieżki konwersacji",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Wątek nie został znaleziony",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera",
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
      threadNotFound: {
        title: "Wątek nie znaleziony",
        description: "Podany wątek nie istnieje",
      },
      noRootMessage: {
        title: "Brak wiadomości głównej",
        description: "Wątek nie ma wiadomości głównej",
      },
      getFailed: {
        title: "Pobieranie nie powiodło się",
        description: "Nie udało się pobrać ścieżki konwersacji",
      },
    },
    success: {
      title: "Sukces",
      description: "Ścieżka konwersacji pobrana pomyślnie",
    },
  },
};

export default translations;
