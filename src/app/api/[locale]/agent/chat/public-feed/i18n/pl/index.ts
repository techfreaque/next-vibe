export const translations = {
  tags: {
    publicFeed: "Publiczny Feed",
  },
  get: {
    title: "Feed społeczności",
    description: "Publiczne wątki udostępnione społeczności",
    sortMode: {
      label: "Sortowanie",
      description: "Jak sortować feed (gorące, nowe, rosnące)",
    },
    page: {
      label: "Strona",
      description: "Numer strony",
    },
    limit: {
      label: "Limit",
      description: "Liczba wątków na stronę",
    },
    search: {
      label: "Szukaj",
      description: "Szukaj wątków po tytule",
    },
    response: {
      title: "Odpowiedź feedu",
      description: "Wzbogacona lista publicznych wątków",
      items: {
        item: {
          title: "Element feedu",
          id: { content: "ID wątku" },
          threadTitle: { content: "Tytuł" },
          preview: { content: "Podgląd" },
          folderId: { content: "ID folderu" },
          folderName: { content: "Kategoria" },
          authorId: { content: "ID autora" },
          authorName: { content: "Autor" },
          messageCount: { content: "Wiadomości" },
          authorCount: { content: "Uczestnicy" },
          upvotes: { content: "Głosy za" },
          downvotes: { content: "Głosy przeciw" },
          score: { content: "Wynik" },
          modelNames: { content: "Użyte modele" },
          streamingState: { content: "Stan strumieniowania" },
          createdAt: { content: "Utworzono" },
          updatedAt: { content: "Zaktualizowano" },
        },
      },
      totalCount: { content: "Łączna liczba" },
      pageCount: { content: "Liczba stron" },
      currentPage: { content: "Bieżąca strona" },
      pageSize: { content: "Rozmiar strony" },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Musisz być zalogowany",
      },
      forbidden: {
        title: "Zabroniony",
        description: "Brak uprawnień",
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
      description: "Feed pobrany pomyślnie",
    },
  },
  sortMode: {
    hot: "Gorące",
    new: "Nowe",
    rising: "Rosnące",
  },
};
