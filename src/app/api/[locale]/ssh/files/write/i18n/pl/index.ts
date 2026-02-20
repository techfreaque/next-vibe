export const translations = {
  post: {
    title: "Zapisz plik",
    description: "Zapisz lub nadpisz plik na lokalnej maszynie lub przez SSH",
    fields: {
      connectionId: {
        label: "Połączenie",
        description: "Połączenie SSH (zostaw puste dla lokalnego)",
        placeholder: "Lokalnie",
      },
      path: {
        label: "Ścieżka",
        description: "Ścieżka pliku do zapisania",
        placeholder: "/tmp/output.txt",
      },
      content: {
        label: "Zawartość",
        description: "Zawartość pliku do zapisania",
        placeholder: "Wpisz zawartość pliku...",
      },
      createDirs: {
        label: "Utwórz katalogi",
        description: "Utwórz katalogi nadrzędne jeśli nie istnieją",
        placeholder: "",
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
      forbidden: {
        title: "Zabronione",
        description: "Brak uprawnień do zapisu",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się zapisać pliku",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Katalog nadrzędny nie znaleziony",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: { title: "Niezapisane zmiany" },
      conflict: { title: "Konflikt", description: "Wystąpił konflikt" },
      network: { title: "Błąd sieci", description: "Wystąpił błąd sieci" },
      timeout: { title: "Timeout", description: "Przekroczono limit czasu" },
    },
    success: { title: "Plik zapisany", description: "Plik zapisany pomyślnie" },
  },
  widget: {
    title: "Zapis pliku",
    writeButton: "Zapisz plik",
    writing: "Zapisywanie...",
    bytesWritten: "Zapisanych bajtów",
    placeholder: "Wpisz zawartość pliku...",
  },
};
