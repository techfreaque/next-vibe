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
    rootFolderId: {
      label: "Folder główny",
      description:
        "Folder główny wątku (używany do routingu po stronie klienta)",
    },
    branchIndices: {
      label: "Indeksy gałęzi",
      description:
        "Mapa ID wiadomości nadrzędnej do indeksu gałęzi dla wyboru ścieżki konwersacji",
    },
    before: {
      label: "Przed ID wiadomości",
      description:
        "Załaduj blok historii przed tym ID wiadomości (paginacja kursorem)",
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
          sequenceId: {
            content: "ID sekwencji",
          },
          authorId: {
            content: "ID autora",
          },
          authorName: {
            content: "Nazwa autora",
          },
          isAI: {
            content: "Czy AI",
          },
          model: {
            content: "Model",
          },
          character: {
            content: "Postać",
          },
          errorType: {
            content: "Typ błędu",
          },
          errorMessage: {
            content: "Komunikat błędu",
          },
          errorCode: {
            content: "Kod błędu",
          },
          metadata: {
            content: "Metadane",
          },
          upvotes: {
            content: "Głosy za",
          },
          downvotes: {
            content: "Głosy przeciw",
          },
          searchVector: {
            content: "Wektor wyszukiwania",
          },
          createdAt: {
            content: "Utworzono o",
          },
          updatedAt: {
            content: "Zaktualizowano o",
          },
        },
      },
      branchMeta: {
        title: "Metadane gałęzi",
        item: {
          title: "Punkt rozgałęzienia",
          parentId: {
            content: "ID nadrzędny",
          },
          siblingCount: {
            content: "Liczba rodzeństwa",
          },
          currentIndex: {
            content: "Bieżący indeks",
          },
        },
      },
      hasOlderHistory: {
        content: "Ma starszą historię",
      },
      oldestLoadedMessageId: {
        content: "ID najstarszej załadowanej wiadomości",
      },
      compactionBoundaryId: {
        content: "ID granicy kompakcji",
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
