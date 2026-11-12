import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    threads: "Wątki",
  },
  enums: {
    threadStatus: {
      active: "Aktywny",
      archived: "Zarchiwizowany",
      deleted: "Usunięty",
    },
  },
  errors: {
    count_failed: "Nie udało się pobrać liczby konwersacji: {{error}}",
  },
  get: {
    title: "Wątki",
    titleShort: "Wątki",
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
          archived: {
            content: "Zarchiwizowany",
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
          streamingState: {
            content: "Status strumieniowania",
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
        detail: "Błąd serwera: {{error}}",
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
    title: "Nowy wątek",
    titleShort: "Nowy wątek",
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
    id: {
      label: "ID wątku",
      description: "ID wątku wygenerowane przez klienta",
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
      description: "Domyślny skill/ton dla tego wątku",
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
        cannotCreateHere: "Nie możesz utworzyć wątku w tej lokalizacji",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasób nie znaleziony",
        folderNotFound: "Nie znaleziono folderu",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera",
        detail: "Błąd serwera: {{error}}",
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
  widget: {
    common: {
      noChatsFound: "Nie znaleziono czatów",
      delete: "Usuń",
      cancel: "Anuluj",
    },
    actions: {
      menu: "Akcje wątku",
      rename: "Zmień nazwę",
      unpin: "Odepnij",
      pin: "Przypnij na górze",
      unarchive: "Wyciągnij z archiwum",
      archive: "Archiwizuj",
      manageSharing: "Zarządzaj udostępnianiem",
      moveToFolder: "Przenieś do folderu",
      unfiled: "Bez folderu",
    },
    folderList: {
      managePermissions: "Zarządzaj uprawnieniami",
      today: "Dzisiaj",
      lastWeek: "Ostatnie 7 dni",
      lastMonth: "Ostatnie 30 dni",
      older: "Starsze",
    },
    threadList: {
      deleteDialog: {
        title: "Usuń wątek",
        description:
          'Czy na pewno chcesz usunąć "{{title}}"? Ta akcja jest nieodwracalna i wszystkie wiadomości zostaną trwale usunięte.',
      },
    },
    suggestedPrompts: {
      starters: {
        explain: {
          label: "Wyjaśnij prosto",
          prompt:
            "Wyjaśnij mi inflację, jakbym miał 12 lat. Krótko i konkretnie.",
        },
        search: {
          label: "Szukaj w sieci",
          prompt:
            "Jakie były najważniejsze newsy technologiczne w tym tygodniu? Wyszukaj i podaj źródła.",
        },
        image: {
          label: "Stwórz obraz",
          prompt:
            "Wygeneruj obraz przytulnej chatki w śnieżycy nocą, z ciepłym światłem w oknach.",
        },
        honest: {
          label: "Bez owijania",
          prompt:
            "Daj mi najmocniejsze argumenty za i przeciw kryptowalutom. Bez wykrętów i zastrzeżeń.",
        },
      },
      takeTour: "Krótki przewodnik (1 minuta)",
      backgroundTitle: "Twoi agenci AI pracują",
      backgroundDescription:
        "Subagenci i autonomiczni agenci w tle wykonują zadania tutaj, gdy Ty zajmujesz się czymś innym. Wyniki trafiają tu automatycznie.",
    },
    emptyState: {
      changeCompanion: "Zmień towarzysza lub model. Teraz: {{name}}",
      folder: {
        private: { label: "Prywatny", note: "Zapisany na Twoim koncie." },
        incognito: { label: "Incognito", note: "Tylko w tej przeglądarce." },
        shared: { label: "Udostępniony", note: "Czyta każdy, kto ma link." },
        public: { label: "Publiczny", note: "Widoczny dla wszystkich." },
        cron: { label: "W tle", note: "Tu agenci pracują sami." },
        remote: {
          label: "Zdalny",
          note: "Działa na Twojej połączonej instancji.",
        },
      },
      use: {
        everyday: {
          good: "Research, teksty i codzienne zadania",
          weak: "W polityce gra bezpiecznie",
        },
        politics: {
          good: "Konkretne odpowiedzi o polityce i tematach tabu",
          weak: "Tylko tekst, słabszy w złożonych zadaniach",
        },
        security: {
          good: "Ofensywna i defensywna praca nad bezpieczeństwem",
          weak: "W polityce gra bezpiecznie",
        },
        writing: {
          good: "Staranne teksty, kod i analizy",
          weak: "Kluczy albo odmawia przy drażliwych tematach",
        },
        images: {
          good: "Czyta zrzuty ekranu, zdjęcia i wideo",
          weak: "Ostrożny przy drażliwych tematach",
        },
        classic: {
          good: "Solidny model do kodu i planowania",
          weak: "Ostrożny przy drażliwych tematach",
        },
        bold: {
          good: "Bezpośrednie odpowiedzi z opinią",
          weak: "Nie do polityki",
        },
        general: {
          good: "Ogólne pytania",
          weak: "Nie do polityki",
        },
      },
      mode: {
        autoModel: "Dobierany automatycznie",
        goodAt: "Mocny w:",
        weakAt: "Słaby w:",
      },
      spotlight: {
        title: "Wybierz, jak {{name}} ma pracować.",
        subtitle:
          "Każdy tryb działa na innym modelu. Albo po prostu zacznij pisać.",
        now: "Aktualny tryb",
        runsOn: "Działa na",
        allModes: "Wszystkie tryby",
        more: "Więcej trybów",
        fix: {
          politics: "Polityka? Przełącz na: {{mode}}",
          complex: "Złożone zadanie? Przełącz na: {{mode}}",
        },
      },
      single: {
        title: "{{name}} korzysta z jednego modelu.",
        action: "Przełącz na {{companion}}, by mieć więcej trybów",
      },
      companion: {
        title: "Kto ma odpowiadać?",
        subtitle:
          "Każdy towarzysz ma własną osobowość i modele do różnych zadań.",
        skip: "Albo po prostu pisz, bez towarzysza.",
        skipModel: "Albo po prostu pisz. Odpowie {{model}}, bez persony.",
        about: {
          thea: "Ciepła i uważna. Myśli razem z Tobą.",
          hermes: "Konkretny i szybki. Załatwia sprawy.",
        },
      },
      custom: {
        title: "Twój własny skill jest gotowy.",
        subtitle:
          "Skill albo model zmienisz w selektorze pod polem wiadomości.",
      },
    },
  },
  publicFeed: {
    timestamp: {
      justNow: "Teraz",
      hoursAgo: "{{hours}}h temu",
      daysAgo: "{{days}}d temu",
    },
  },
  config: {
    folders: {
      private: "Prywatne czaty",
      shared: "Udostępnione czaty",
      public: "Publiczne czaty",
      incognito: "Czaty incognito",
      background: "Wątki w tle",
      remote: "Czaty zdalne",
    },
  },
};
