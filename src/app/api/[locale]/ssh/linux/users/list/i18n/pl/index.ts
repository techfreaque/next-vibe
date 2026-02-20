export const translations = {
  get: {
    title: "Wylistuj użytkowników Linux",
    description: "Wylistuj konta użytkowników OS na hoście (uid >= 1000)",
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagany dostęp administratora",
      },
      forbidden: { title: "Zabronione", description: "Wymagany LOCAL_MODE" },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się wylistować użytkowników",
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
      title: "Użytkownicy wylistowani",
      description: "Użytkownicy OS pobrani",
    },
  },
  widget: {
    title: "Użytkownicy Linux",
    createButton: "Utwórz użytkownika",
    lockButton: "Zablokuj",
    unlockButton: "Odblokuj",
    deleteButton: "Usuń",
    usernameCol: "Nazwa użytkownika",
    uidCol: "UID",
    homeDirCol: "Katalog domowy",
    shellCol: "Shell",
    groupsCol: "Grupy",
    statusCol: "Status",
    locked: "Zablokowany",
    active: "Aktywny",
    localModeOnly: "Dostępne tylko w LOCAL_MODE",
    confirmDelete:
      "Usunąć użytkownika {username}? Tej operacji nie można cofnąć.",
  },
};
