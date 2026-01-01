export const translations = {
  get: {
    title: "Pobierz plik",
    description: "Pobierz przesłany plik",
    success: {
      title: "Plik pobrany",
      description: "Plik został pomyślnie pobrany",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania pliku",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie udało się pobrać pliku z powodu błędu sieci",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Wymagana autoryzacja aby uzyskać dostęp do tego pliku",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do dostępu do tego pliku",
      },
      notFound: {
        title: "Plik nie znaleziony",
        description:
          "Żądany plik nie został znaleziony lub dostęp został odmówiony",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się pobrać pliku z powodu błędu serwera",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Istnieją niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt",
      },
    },
  },
  errors: {
    fileNotFound: "Plik nie został znaleziony lub odmowa dostępu",
  },
};
