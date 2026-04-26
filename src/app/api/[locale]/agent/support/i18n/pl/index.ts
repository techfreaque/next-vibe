/**
 * Support API translations (Polish)
 */

export const translations = {
  endpointCategories: {
    support: "Wsparcie",
  },

  sessions: {
    title: "Kolejka wsparcia",
    description: "Oczekujące i aktywne sesje wsparcia.",
    tags: { support: "Wsparcie", queue: "Kolejka" },
    success: {
      title: "Sesje załadowane",
      description: "Lista sesji wsparcia pobrana.",
    },
    errors: {
      fetchFailed: "Nie udało się załadować sesji wsparcia.",
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Żądanie było nieprawidłowe.",
      },
      network: { title: "Błąd sieci", description: "Serwer niedostępny." },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Musisz być zalogowany.",
      },
      forbidden: { title: "Brak dostępu", description: "Tylko dla adminów." },
      notFound: { title: "Nie znaleziono", description: "Brak sesji." },
      server: { title: "Błąd serwera", description: "Błąd wewnętrzny." },
      unknown: { title: "Nieznany błąd", description: "Nieoczekiwany błąd." },
      unsaved: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany.",
      },
      conflict: { title: "Konflikt", description: "Wystąpił konflikt." },
    },
    widget: {
      noSessions: "Brak aktywnych sesji wsparcia",
      pending: "Oczekująca",
      active: "Aktywna",
      join: "Dołącz",
      close: "Zamknij",
      ago: "temu",
      from: "z",
    },
  },

  join: {
    title: "Dołącz do sesji",
    description: "Dołącz do oczekującej sesji wsparcia.",
    tags: { support: "Wsparcie", join: "Dołącz" },
    fields: {
      sessionId: {
        label: "ID sesji",
        description: "Sesja wsparcia, do której dołączasz.",
      },
      threadId: { label: "ID wątku", description: "Wątek sesji." },
      initiatorInstanceUrl: {
        label: "URL inicjatora",
        description: "URL instancji otwierającej sesję.",
      },
    },
    systemMessage: "Supporter dołączył do sesji.",
    success: {
      title: "Dołączono",
      description: "Dołączyłeś do sesji wsparcia.",
    },
    errors: {
      sessionNotFound: "Sesja wsparcia nie znaleziona.",
      alreadyJoined: "Ta sesja ma już aktywnego supportera.",
      callbackFailed: "Nie udało się powiadomić inicjującej instancji.",
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Żądanie było nieprawidłowe.",
      },
      network: { title: "Błąd sieci", description: "Serwer niedostępny." },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Musisz być zalogowany.",
      },
      forbidden: { title: "Brak dostępu", description: "Tylko dla adminów." },
      notFound: {
        title: "Nie znaleziono",
        description: "Sesja nie znaleziona.",
      },
      server: { title: "Błąd serwera", description: "Błąd wewnętrzny." },
      unknown: { title: "Nieznany błąd", description: "Nieoczekiwany błąd." },
      unsaved: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany.",
      },
      conflict: { title: "Konflikt", description: "Sesja już aktywna." },
    },
  },

  sessionJoined: {
    title: "Callback dołączenia",
    description:
      "Wewnętrzny callback — powiadamia inicjującą instancję o dołączeniu.",
    tags: { support: "Wsparcie", callback: "Callback" },
    fields: {
      sessionId: {
        label: "ID sesji",
        description: "Sesja, do której dołączono.",
      },
      threadId: {
        label: "ID wątku",
        description: "Wątek dla wiadomości systemowej.",
      },
      joinedMessage: {
        label: "Wiadomość dołączenia",
        description: "Treść wiadomości systemowej.",
      },
    },
    success: { title: "Potwierdzono", description: "Dołączenie potwierdzone." },
    errors: {
      failed: "Nie udało się przetworzyć callbacku.",
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Żądanie było nieprawidłowe.",
      },
      network: { title: "Błąd sieci", description: "Serwer niedostępny." },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Musisz być zalogowany.",
      },
      forbidden: { title: "Brak dostępu", description: "Tylko dla adminów." },
      notFound: {
        title: "Nie znaleziono",
        description: "Sesja nie znaleziona.",
      },
      server: { title: "Błąd serwera", description: "Błąd wewnętrzny." },
      unknown: { title: "Nieznany błąd", description: "Nieoczekiwany błąd." },
      unsaved: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany.",
      },
      conflict: { title: "Konflikt", description: "Wystąpił konflikt." },
    },
  },

  close: {
    title: "Zamknij sesję",
    description: "Zakończ aktywną sesję wsparcia.",
    tags: { support: "Wsparcie", close: "Zamknij" },
    fields: {
      sessionId: { label: "ID sesji", description: "Sesja do zamknięcia." },
      closed: {
        label: "Zamknięta",
        description: "Czy sesja została zamknięta.",
      },
    },
    systemMessage: "Sesja wsparcia została zakończona.",
    success: {
      title: "Zamknięto",
      description: "Sesja wsparcia została zakończona.",
    },
    errors: {
      sessionNotFound: "Sesja wsparcia nie znaleziona.",
      alreadyClosed: "Ta sesja jest już zamknięta.",
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Żądanie było nieprawidłowe.",
      },
      network: { title: "Błąd sieci", description: "Serwer niedostępny." },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Musisz być zalogowany.",
      },
      forbidden: { title: "Brak dostępu", description: "Tylko dla adminów." },
      notFound: {
        title: "Nie znaleziono",
        description: "Sesja nie znaleziona.",
      },
      server: { title: "Błąd serwera", description: "Błąd wewnętrzny." },
      unknown: { title: "Nieznany błąd", description: "Nieoczekiwany błąd." },
      unsaved: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany.",
      },
      conflict: { title: "Konflikt", description: "Sesja już zamknięta." },
    },
  },
} as const;

export type SupportTranslations = typeof translations;
