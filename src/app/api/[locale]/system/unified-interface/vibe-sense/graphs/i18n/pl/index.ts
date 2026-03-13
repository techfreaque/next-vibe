import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: {
    vibeSense: "vibe-sense",
  },

  list: {
    title: "Grafy potokow",
    description: "Lista wszystkich grafow widocznych dla biezacego uzytkownika",
    container: {
      title: "Grafy",
      description: "Wszystkie grafy potokow",
    },
    response: {
      graphs: "Grafy",
      graph: {
        id: "ID",
        slug: "Slug",
        name: "Nazwa",
        description: "Opis",
        ownerType: "Typ wlasciciela",
        ownerId: "ID wlasciciela",
        isActive: "Aktywny",
        createdAt: "Utworzono",
      },
    },
    success: {
      title: "Grafy zaladowane",
      description: "Grafy potokow pobrane pomyslnie",
    },
    errors: {
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Wymagane uwierzytelnienie do wylistowania grafow",
      },
      forbidden: {
        title: "Zabroniony",
        description: "Wymagany dostep administratora",
      },
      server: {
        title: "Blad serwera",
        description: "Nie udalo sie zaladowac grafow",
      },
      unknown: {
        title: "Nieznany blad",
        description: "Wystapil nieoczekiwany blad podczas ladowania grafow",
      },
      validation: {
        title: "Blad walidacji",
        description: "Nieprawidlowe parametry zadania",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono grafow",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystapil konflikt zasobow",
      },
      network: {
        title: "Blad sieci",
        description:
          "Zadanie sieciowe nie powiodlo sie podczas ladowania grafow",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Zapisz zmiany przed kontynuacja",
      },
    },
  },

  widget: {
    refresh: "Odswiez",
    createGraph: "Nowy graf",
    active: "Aktywny",
    inactive: "Nieaktywny",
    empty: "Brak grafow. Utworz pierwszy graf potoku.",
    error: "Nie udalo sie zaladowac grafow. Sprobuj ponownie.",
    archive: "Archiwizuj",
    searchPlaceholder: "Szukaj po nazwie, slugu lub opisie\u2026",
    noMatchTitle: "Brak pasujacych grafow",
    noMatchHint: "Sprobuj innego hasla wyszukiwania",
    clearSearch: "Wyczysc wyszukiwanie",
    searchResults: "wynikow dla",
    stats: {
      total: "Razem",
      active: "Aktywne",
      system: "Systemowe",
      admin: "Admin",
    },
  },

  create: {
    title: "Utworz graf",
    description: "Utworz nowy graf potoku",
    fields: {
      name: {
        label: "Nazwa",
        description: "Nazwa wyswietlana grafu",
        placeholder: "Moj graf",
      },
      slug: {
        label: "Slug",
        description: "Unikalny identyfikator (male litery, myslniki)",
        placeholder: "moj-graf",
      },
      description: {
        label: "Opis",
        description: "Opcjonalny opis",
        placeholder: "",
      },
      config: {
        label: "Konfiguracja",
        description: "Konfiguracja DAG grafu",
      },
    },
    response: {
      id: "ID grafu",
    },
    success: {
      title: "Graf utworzony",
      description: "Graf potoku utworzony pomyslnie",
    },
    errors: {
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Wymagane uwierzytelnienie do tworzenia grafow",
      },
      forbidden: {
        title: "Zabroniony",
        description: "Wymagany dostep administratora",
      },
      server: {
        title: "Blad serwera",
        description: "Nie udalo sie utworzyc grafu",
      },
      unknown: {
        title: "Nieznany blad",
        description: "Wystapil nieoczekiwany blad podczas tworzenia grafu",
      },
      validation: {
        title: "Blad walidacji",
        description: "Nieprawidlowa konfiguracja grafu",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasob nie znaleziony",
      },
      conflict: {
        title: "Konflikt",
        description: "Slug grafu juz istnieje",
      },
      network: {
        title: "Blad sieci",
        description:
          "Zadanie sieciowe nie powiodlo sie podczas tworzenia grafu",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Zapisz zmiany przed kontynuacja",
      },
    },
  },
};
