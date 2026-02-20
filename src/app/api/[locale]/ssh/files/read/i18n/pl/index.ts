export const translations = {
  get: {
    title: "Odczytaj plik",
    description: "Odczytaj plik tekstowy z lokalnej maszyny lub przez SSH",
    fields: {
      connectionId: {
        label: "Połączenie",
        description: "Połączenie SSH (zostaw puste dla lokalnego)",
        placeholder: "Lokalnie",
      },
      path: {
        label: "Ścieżka",
        description: "Ścieżka pliku do odczytania",
        placeholder: "/etc/nginx/nginx.conf",
      },
      maxBytes: {
        label: "Maks. bajtów",
        description: "Maksymalna liczba bajtów do odczytania (domyślnie 64 KB)",
        placeholder: "65536",
      },
      offset: {
        label: "Przesunięcie",
        description: "Przesunięcie bajtowe od którego zacząć czytać",
        placeholder: "0",
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
        description: "Nie udało się odczytać pliku",
      },
      notFound: { title: "Nie znaleziono", description: "Plik nie znaleziony" },
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
      title: "Plik odczytany",
      description: "Zawartość pliku pobrana",
    },
  },
  widget: {
    title: "Podgląd pliku",
    editButton: "Edytuj",
    saveButton: "Zapisz",
    cancelButton: "Anuluj",
    truncatedWarning:
      "Plik został obcięty. Użyj przesunięcia, aby odczytać więcej.",
    size: "Rozmiar",
    encoding: "Kodowanie",
    loading: "Ładowanie...",
    empty: "Pusty plik",
  },
};
