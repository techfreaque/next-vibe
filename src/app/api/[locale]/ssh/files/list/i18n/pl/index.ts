export const translations = {
  get: {
    title: "Wylistuj pliki",
    description:
      "Wylistuj zawartość katalogu na lokalnej maszynie lub przez SSH",
    fields: {
      connectionId: {
        label: "Połączenie",
        description: "Połączenie SSH (zostaw puste dla lokalnego)",
        placeholder: "Lokalnie",
      },
      path: {
        label: "Ścieżka",
        description: "Katalog do wylistowania",
        placeholder: "~",
      },
    },
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
        description: "Nie udało się wylistować katalogu",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Katalog nie znaleziony",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: { title: "Niezapisane zmiany" },
      conflict: { title: "Konflikt", description: "Wystąpił konflikt" },
      network: { title: "Błąd sieci", description: "Wystąpił błąd sieci" },
      timeout: {
        title: "Timeout",
        description: "Żądanie przekroczyło limit czasu",
      },
    },
    success: {
      title: "Katalog wylistowany",
      description: "Zawartość katalogu pobrana",
    },
  },
  widget: {
    title: "Przeglądarka plików",
    emptyDir: "Pusty katalog",
    loading: "Ładowanie...",
    backButton: "Wstecz",
    nameCol: "Nazwa",
    sizeCol: "Rozmiar",
    modifiedCol: "Zmodyfikowano",
    permissionsCol: "Uprawnienia",
    file: "Plik",
    directory: "Katalog",
    symlink: "Dowiązanie",
  },
};
