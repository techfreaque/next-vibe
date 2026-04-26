import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    folders: "Foldery",
  },
  widget: {
    config: {
      foldersShort: {
        private: "Prywatny",
        shared: "Udostępniony",
        public: "Publiczny",
        incognito: "Incognito",
        cron: "W tle",
        support: "Wsparcie",
      },
    },
    folderList: {
      newChatInFolder: "Nowy czat w folderze",
      moveUp: "Przenieś wyżej",
      moveDown: "Przenieś niżej",
      newSubfolder: "Nowy podfolder",
      managePermissions: "Zarządzaj uprawnieniami",
      renameFolder: "Zmień nazwę folderu",
      moveToFolder: "Przenieś do folderu",
      deleteFolder: "Usuń folder",
      deleteDialog: {
        title: "Usuń folder",
        description: 'Czy na pewno chcesz usunąć "{{folderName}}"?',
      },
      pinned: "Przypięte",
      pin: "Przypiń",
      unpin: "Odepnij",
      today: "Dzisiaj",
      lastWeek: "Ostatnie 7 dni",
      lastMonth: "Ostatnie 30 dni",
      older: "Starsze",
      showMore: "Pokaż więcej",
    },
    renameFolder: {
      title: "Zmień nazwę folderu",
    },
    moveFolder: {
      title: "Przenieś folder",
    },
    newFolder: {
      title: "Utwórz nowy folder",
    },
    permissions: {
      folderTitle: "Uprawnienia folderu",
    },
    accessModal: {
      title: "Wymagane konto",
      privateTitle: "Wątki prywatne",
      sharedTitle: "Wątki udostępnione",
      publicTitle: "Forum publiczne",
      incognitoTitle: "Tryb incognito",
      privateExplanation:
        "Wątki prywatne to Twoja osobista przestrzeń do rozmów z AI. Wszystkie Twoje czaty są bezpiecznie przechowywane na naszych serwerach i automatycznie synchronizowane na wszystkich Twoich urządzeniach.",
      sharedExplanation:
        "Wątki udostępnione pozwalają tworzyć rozmowy i dzielić się nimi z innymi za pomocą bezpiecznych linków. Idealny do współpracy i dzielenia się spostrzeżeniami z zespołem lub przyjaciółmi.",
      publicExplanation:
        "Forum publiczne to przestrzeń chroniona przez pierwszą poprawkę, gdzie ludzie i AI angażują się w otwarty dialog. Dziel się pomysłami, kwestionuj perspektywy i uczestniczą w niecenzurowanych dyskusjach.",
      incognitoExplanation:
        "Tryb incognito zachowuje Twoje rozmowy całkowicie prywatne i lokalne. Twoje czaty są przechowywane tylko w Twojej przeglądarce i nigdy nie są wysyłane na nasze serwery - nawet nie są powiązane z Twoim kontem.",
      requiresAccount:
        "Aby uzyskać dostęp do {{folderName}}, musisz utworzyć konto lub się zalogować.",
      loginButton: "Zaloguj się",
      signupButton: "Zarejestruj się",
      close: "Zamknij",
    },
    actions: {
      rename: "Zmień nazwę",
      moveToFolder: "Przenieś do folderu",
      pin: "Przypiń",
      unpin: "Odepnij",
    },
    threadList: {
      deleteDialog: {
        title: "Usuń wątek",
        description: 'Czy na pewno chcesz usunąć "{{title}}"?',
      },
    },
    sharedThread: {
      noLinks: "Jeszcze nieudostępniony — dotknij, aby udostępnić",
      linkCount: "{{count}} aktywny(-e) link(i)",
      shareAction: "Udostępnij",
      moveToShared: "Przenieś do Udostępnionych",
    },
    common: {
      cancel: "Anuluj",
      delete: "Usuń",
      noChatsFound: "Nie znaleziono wątków",
      searchPlaceholder: "Szukaj...",
      privateChats: "Prywatne czaty",
      sharedChats: "Udostępnione czaty",
      publicChats: "Publiczne czaty",
      incognitoChats: "Czaty incognito",
      newChat: "Nowy czat",
      newPrivateChat: "Prywatny Thread",
      newSharedChat: "Udostępniony Thread",
      newPublicChat: "Publiczny Thread",
      newIncognitoChat: "Chat Incognito",
      newPrivateFolder: "Nowy Prywatny Folder",
      newSharedFolder: "Nowy Udostępniony Folder",
      newPublicFolder: "Nowy Publiczny Folder",
      newIncognitoFolder: "Nowy Folder Incognito",
      newFolder: "Nowy Folder",
    },
  },
  config: {
    folders: {
      private: "Prywatny",
      shared: "Udostępniony",
      public: "Publiczny",
      background: "W tle",
      incognito: "Incognito",
      support: "Wsparcie",
    },
  },
  errors: {
    not_implemented_on_native:
      "{{method}} nie jest zaimplementowane na platformie natywnej. Proszę używać wersji webowej do tej operacji.",
  },
  get: {
    title: "Pobierz foldery",
    description: "Pobierz wszystkie foldery dla bieżącego folderu głównego",
    rootFolderId: {
      label: "Folder główny",
      description:
        "Folder główny do pobrania (prywatny, udostępniony, publiczny, w tle, incognito)",
    },
    container: {
      title: "Szczegóły folderu",
      description: "Wyświetl informacje o folderze",
    },
    id: {
      label: "ID folderu",
      description: "Unikalny identyfikator folderu",
    },
    response: {
      title: "Foldery",
      description: "Lista folderów z uprawnieniami",
      rootFolderPermissions: {
        title: "Uprawnienia folderu głównego",
        description: "Uprawnienia dla folderu głównego",
        canCreateThread: {
          content: "Może tworzyć wątki",
        },
        canCreateFolder: {
          content: "Może tworzyć foldery",
        },
      },
      folders: {
        folder: {
          id: { content: "ID" },
          userId: { content: "ID użytkownika" },
          name: { content: "Nazwa" },
          icon: { content: "Ikona" },
          color: { content: "Kolor" },
          parentId: { content: "Folder nadrzędny" },
          expanded: { content: "Rozwinięty" },
          sortOrder: { content: "Kolejność sortowania" },
          rootFolderId: {
            content: "Folder główny",
          },
          canManage: {
            content: "Może zarządzać",
          },
          canCreateThread: {
            content: "Może tworzyć wątki",
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
          createdAt: {
            content: "Utworzono",
          },
          updatedAt: {
            content: "Zaktualizowano",
          },
        },
      },
      folder: {
        title: "Folder",
        id: {
          content: "ID",
        },
        userId: {
          content: "ID użytkownika",
        },
        name: {
          content: "Nazwa",
        },
        icon: {
          content: "Ikona",
        },
        color: {
          content: "Kolor",
        },
        parentId: {
          content: "Folder nadrzędny",
        },
        expanded: {
          content: "Rozwinięty",
        },
        sortOrder: {
          content: "Kolejność sortowania",
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
        description: "Podane ID folderu jest nieprawidłowe",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Musisz być zalogowany, aby wyświetlać foldery",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do wyświetlania tego folderu",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany folder nie został znaleziony",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas pobierania folderu",
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
        description: "Wystąpił konflikt podczas przetwarzania żądania",
      },
    },
    success: {
      title: "Sukces",
      description: "Folder pobrany pomyślnie",
    },
  },
  patch: {
    title: "Aktualizuj folder",
    description: "Zaktualizuj istniejący folder",
    container: {
      title: "Aktualizuj folder",
      description: "Modyfikuj właściwości folderu",
    },
    id: {
      label: "ID folderu",
      description: "Unikalny identyfikator folderu do aktualizacji",
    },
    sections: {
      updates: {
        title: "Aktualizacje folderu",
        description: "Pola do aktualizacji",
      },
    },
    name: {
      label: "Nazwa",
      description: "Nazwa folderu",
    },
    icon: {
      label: "Ikona",
      description: "Nazwa ikony Lucide lub Simple Icons",
    },
    color: {
      label: "Kolor",
      description: "Kod koloru hex do wizualnego rozróżnienia",
    },
    parentId: {
      label: "Folder nadrzędny",
      description:
        "Przenieś folder do innego folderu nadrzędnego (null dla głównego)",
    },
    expanded: {
      label: "Rozwinięty",
      description: "Czy folder jest rozwinięty w interfejsie użytkownika",
    },
    sortOrder: {
      label: "Kolejność sortowania",
      description: "Kolejność sortowania folderów",
    },
    metadata: {
      label: "Metadane",
      description: "Dodatkowe metadane folderu",
    },
    rolesView: {
      label: "Role wyświetlania",
      description: "Role, które mogą wyświetlać ten folder",
    },
    rolesManage: {
      label: "Role zarządzania",
      description: "Role, które mogą zarządzać ustawieniami folderu",
    },
    rolesCreateThread: {
      label: "Role tworzenia wątków",
      description: "Role, które mogą tworzyć wątki w tym folderze",
    },
    rolesPost: {
      label: "Role publikowania",
      description: "Role, które mogą publikować wiadomości",
    },
    rolesModerate: {
      label: "Role moderacyjne",
      description: "Role, które mogą moderować treści",
    },
    rolesAdmin: {
      label: "Role administratora",
      description: "Role z pełnym dostępem administracyjnym",
    },
    response: {
      title: "Zaktualizowany folder",
      description: "Szczegóły zaktualizowanego folderu",
      folder: {
        title: "Folder",
        id: {
          content: "ID",
        },
        userId: {
          content: "ID użytkownika",
        },
        name: {
          content: "Nazwa",
        },
        icon: {
          content: "Ikona",
        },
        color: {
          content: "Kolor",
        },
        parentId: {
          content: "Folder nadrzędny",
        },
        expanded: {
          content: "Rozwinięty",
        },
        sortOrder: {
          content: "Kolejność sortowania",
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
        description: "Podane dane są nieprawidłowe",
        circularReference:
          "Nie można ustawić folderu jako własnego folderu nadrzędnego",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Musisz być zalogowany, aby aktualizować foldery",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do aktualizacji tego folderu",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany folder nie został znaleziony",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas aktualizacji folderu",
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
        description: "Folder o tej nazwie już istnieje",
      },
    },
    success: {
      title: "Sukces",
      description: "Folder zaktualizowany pomyślnie",
    },
  },
  delete: {
    title: "Usuń folder",
    description: "Usuń folder i całą jego zawartość",
    container: {
      title: "Usuń folder",
      description: "Usuń folder na stałe",
    },
    id: {
      label: "ID folderu",
      description: "Unikalny identyfikator folderu do usunięcia",
    },
    response: {
      title: "Wynik usunięcia",
      description: "Potwierdzenie usunięcia folderu",
      success: {
        content: "Sukces",
      },
      deletedFolderId: {
        content: "ID usuniętego folderu",
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Podane ID folderu jest nieprawidłowe",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Musisz być zalogowany, aby usuwać foldery",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do usunięcia tego folderu",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany folder nie został znaleziony",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas usuwania folderu",
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
        description: "Nie można usunąć folderu z aktywną zawartością",
      },
    },
    success: {
      title: "Sukces",
      description: "Folder usunięty pomyślnie",
    },
  },
  post: {
    errors: {
      forbidden: {
        title: "Zabronione",
        incognitoNotAllowed: "Foldery nie są obsługiwane w trybie incognito",
      },
      unauthorized: {
        title: "Nieautoryzowany",
      },
      server: {
        title: "Błąd serwera",
      },
    },
  },
};
