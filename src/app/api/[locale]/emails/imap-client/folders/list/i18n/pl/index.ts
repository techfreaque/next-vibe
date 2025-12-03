import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Lista folderów IMAP",
  description: "Pobierz listę folderów IMAP",
  category: "Punkt końcowy API",
  tag: "Foldery",
  tags: {
    list: "Lista",
  },
  container: {
    title: "Kontener folderów",
    description: "Kontener dla danych listy folderów",
  },
  page: {
    label: "Strona",
    description: "Numer strony dla paginacji",
    placeholder: "Wprowadź numer strony",
  },
  limit: {
    label: "Limit",
    description: "Liczba elementów na stronę",
    placeholder: "Wprowadź limit",
  },
  accountId: {
    label: "ID konta",
    description: "Filtruj po konkretnym ID konta",
    placeholder: "Wprowadź ID konta",
  },
  search: {
    label: "Szukaj",
    description: "Szukaj folderów po nazwie",
    placeholder: "Szukaj folderów...",
  },
  specialUseType: {
    label: "Typ specjalnego użytku",
    description: "Filtruj po typie folderu specjalnego użytku",
    placeholder: "Wybierz typ folderu",
  },
  syncStatus: {
    label: "Status synchronizacji",
    description: "Filtruj po statusie synchronizacji",
    placeholder: "Wybierz status synchronizacji",
  },
  sortBy: {
    label: "Sortuj według",
    description: "Pole do sortowania",
    placeholder: "Wybierz pole sortowania",
  },
  sortOrder: {
    label: "Kolejność sortowania",
    description: "Kierunek sortowania (rosnąco lub malejąco)",
    placeholder: "Wybierz kolejność sortowania",
  },
  response: {
    folders: {
      title: "Foldery",
    },
    folder: {
      title: "Folder",
      description: "Szczegóły folderu",
      id: "ID folderu",
      name: "Nazwa folderu",
      displayName: "Nazwa wyświetlana",
      path: "Ścieżka folderu",
      isSelectable: "Możliwy do wyboru",
      hasChildren: "Ma podfoldery",
      specialUseType: "Typ specjalnego użycia",
      messageCount: "Liczba wiadomości",
      unseenCount: "Liczba nieprzeczytanych",
      syncStatus: "Status synchronizacji",
      createdAt: "Utworzono",
    },
    pagination: {
      title: "Paginacja",
      description: "Informacje o paginacji",
      page: "Strona",
      limit: "Limit",
      total: "Całkowicie",
      totalPages: "Całkowite strony",
    },
  },
  info: {
    start: "Rozpoczynanie pobierania listy folderów",
  },
  errors: {
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Nie masz uprawnień do dostępu do tego zasobu",
    },
    server: {
      title: "Błąd serwera",
      description: "Wystąpił wewnętrzny błąd serwera",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieznany błąd",
    },
  },
  success: {
    title: "Sukces",
    description: "Foldery pobrane pomyślnie",
  },
};
