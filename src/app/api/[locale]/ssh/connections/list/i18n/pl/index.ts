export const translations = {
  get: {
    title: "Wylistuj połączenia SSH",
    description:
      "Wylistuj wszystkie zapisane połączenia SSH dla bieżącego użytkownika",
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagany dostęp administratora",
      },
      forbidden: { title: "Zabronione", description: "Brak uprawnień" },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się wylistować połączeń",
      },
      notFound: { title: "Nie znaleziono", description: "Nie znaleziono" },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: { title: "Niezapisane zmiany" },
      conflict: { title: "Konflikt", description: "Wystąpił konflikt" },
      network: { title: "Błąd sieci", description: "Wystąpił błąd sieci" },
      timeout: { title: "Timeout", description: "Przekroczono limit czasu" },
    },
    success: {
      title: "Połączenia wylistowane",
      description: "Połączenia SSH pobrane",
    },
  },
  widget: {
    title: "Połączenia SSH",
    addButton: "Dodaj połączenie",
    testButton: "Testuj",
    deleteButton: "Usuń",
    emptyState:
      "Brak połączeń SSH. Dodaj jedno, aby połączyć się ze zdalnymi maszynami.",
    labelCol: "Nazwa",
    hostCol: "Host",
    userCol: "Użytkownik",
    authTypeCol: "Uwierzytelnianie",
    defaultBadge: "Domyślne",
    testingLabel: "Testowanie...",
    testSuccess: "Połączono",
    testFailed: "Błąd",
  },
};
