import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Powiadomienia",

  tags: {
    notifications: "powiadomienia",
    list: "lista",
    unread: "nieprzeczytane",
    read: "przeczytane",
  },

  enums: {
    type: {
      taskComplete: "Zadanie gotowe",
      taskFailed: "Zadanie nieudane",
      earning: "Zarobek",
      dreamerResult: "Wynik Dreamera",
      creditLow: "Mało środków",
      system: "System",
    },
  },

  templates: {
    taskComplete: {
      title: "{{name}} gotowe",
      body: "Twoje zadanie w tle jest skończone. Otwórz wynik.",
    },
    taskFailed: {
      title: "{{name}} nie wyszło",
      body: "Zadanie w tle trafiło na błąd. Otwórz, żeby zobaczyć powód.",
    },
    earning: {
      title: "Zarabiasz {{amount}} kredytów",
      body: "Zarobek z poleceń przeszedł okres wstrzymania i możesz go już wydać.",
    },
    dreamerResult: {
      title: "{{name}} ma wynik",
      body: "Twój przebieg Dreamera się zakończył.",
    },
    creditLow: {
      title: "Kończą się kredyty",
      body: "Zostało {{amount}} kredytów. Doładuj, zanim kolejny przebieg utknie.",
    },
    system: {
      title: "{{name}}",
      body: "",
    },
    fallbackTaskName: "Zadanie w tle",
  },

  list: {
    get: {
      title: "Powiadomienia",
      titleShort: "Powiadomienia",
      description:
        "Wszystko, co skończyło się pod Twoją nieobecność. Nieprzeczytane na górze.",
      emptyTitle: "Nic nowego",
      emptyHint: "Skończone zadania i zarobki pojawią się tutaj.",
      markAllRead: "Oznacz wszystko",
      unread: "Nieprzeczytane",
      response: {
        notifications: {
          id: "ID",
          type: "Typ",
          title: "Tytuł",
          body: "Wiadomość",
          link: "Link",
          read: "Przeczytane",
          createdAt: "Otrzymano",
        },
        unreadCount: "Nieprzeczytane",
      },
      paginationInfo: {
        label: "Paginacja",
      },
    },
  },

  unreadCount: {
    get: {
      title: "Liczba nieprzeczytanych powiadomień",
      titleShort: "Nieprzeczytane",
      description: "Ile powiadomień jeszcze nie otworzyłeś.",
      response: {
        unreadCount: "Nieprzeczytane powiadomienia",
      },
    },
  },

  read: {
    post: {
      title: "Oznacz powiadomienia jako przeczytane",
      titleShort: "Oznacz jako przeczytane",
      description:
        "Oznacz jedno lub wszystkie powiadomienia jako przeczytane. Podaj id albo all=true.",
      id: {
        label: "ID powiadomienia",
        description: "Powiadomienie do oznaczenia jako przeczytane",
      },
      all: {
        label: "Oznacz wszystko jako przeczytane",
        description: "Wyczyść całą listę nieprzeczytanych",
      },
      response: {
        updatedCount: "Oznaczono",
      },
      submit: {
        label: "Oznacz jako przeczytane",
        loading: "Aktualizuję...",
      },
    },
  },

  bell: {
    label: "Powiadomienia",
    empty: "Wszystko ogarnięte.",
    markAllRead: "Oznacz wszystko",
    viewAll: "Zobacz wszystkie",
    loading: "Ładowanie...",
    unreadBadge: "{{count}} nieprzeczytanych powiadomień",
  },

  errors: {
    validation: {
      title: "Błąd walidacji",
      description: "Podaj id powiadomienia albo all=true",
    },
    network: {
      title: "Błąd sieci",
      description: "Błąd połączenia sieciowego",
    },
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Zaloguj się, aby zobaczyć powiadomienia",
    },
    forbidden: {
      title: "Zabronione",
      description: "Dostęp zabroniony",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Nie znaleziono powiadomienia",
    },
    server: {
      title: "Błąd serwera",
      description: "Wystąpił wewnętrzny błąd serwera",
    },
    serverError: {
      title: "Błąd serwera",
      description: "Wystąpił wewnętrzny błąd serwera",
      detail: "Coś poszło nie tak po naszej stronie: {{error}}",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieznany błąd",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany",
    },
    conflict: {
      title: "Konflikt",
      description: "Konflikt stanu powiadomienia",
    },
    idOrAllRequired: "Podaj id powiadomienia albo all=true.",
  },

  success: {
    title: "Sukces",
    description: "Operacja zakończona pomyślnie",
  },
};
