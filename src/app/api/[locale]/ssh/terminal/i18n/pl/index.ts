export const translations = {
  get: {
    title: "Terminal",
    description: "Pełny terminal PTY w przeglądarce",
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagany dostęp administratora",
      },
      server: { title: "Błąd serwera", description: "Terminal niedostępny" },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      notFound: { title: "Nie znaleziono", description: "Nie znaleziono" },
      conflict: { title: "Konflikt", description: "Wystąpił konflikt" },
      network: { title: "Błąd sieci", description: "Wystąpił błąd sieci" },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry",
      },
      forbidden: { title: "Zabronione", description: "Brak uprawnień" },
    },
    success: {
      title: "Terminal gotowy",
      description: "Sesja terminala otwarta",
    },
  },
  widget: {
    title: "Terminal",
    connectButton: "Połącz",
    disconnectButton: "Rozłącz",
    localLabel: "Lokalnie (bieżący użytkownik)",
    connectionLabel: "Połączenie",
    connecting: "Łączenie...",
    connected: "Połączono",
    disconnected: "Rozłączono",
    sessionError: "Błąd sesji",
    connectPrompt: "Kliknij Połącz, aby rozpocząć sesję terminala.\n",
    prompt: "$ ",
    inputPlaceholder: "Wpisz polecenie i naciśnij Enter...",
  },
};
