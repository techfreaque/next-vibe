import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Status Zadań Importu",
    description: "Wyświetl i monitoruj zadania importu CSV",
    form: {
      title: "Filtry Zadań",
      description: "Filtruj zadania importu według statusu i paginacji",
    },
    filters: {
      title: "Filtry",
      description: "Opcje filtrowania dla zadań importu",
    },
    status: {
      label: "Status Zadania",
      description: "Filtruj według statusu zadania",
      placeholder: "Wybierz status",
    },
    limit: {
      label: "Wyników na Stronę",
      description: "Liczba zadań do zwrócenia",
      placeholder: "50",
    },
    offset: {
      label: "Przesunięcie Strony",
      description: "Liczba zadań do pominięcia",
      placeholder: "0",
    },
    response: {
      title: "Zadania Importu",
      description: "Lista zadań importu z ich aktualnym statusem",
      items: {
        title: "Lista Zadań",
      },
    },
    errors: {
      validation: {
        title: "Błąd Walidacji",
        description: "Nieprawidłowe parametry filtrowania",
      },
      unauthorized: {
        title: "Brak Autoryzacji",
        description: "Wymagana autoryzacja do wyświetlania zadań importu",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony dla zadań importu",
      },
      notFound: {
        title: "Nie Znaleziono",
        description: "Nie znaleziono zadań importu",
      },
      server: {
        title: "Błąd Serwera",
        description: "Wewnętrzny błąd serwera podczas pobierania zadań",
      },
      unknown: {
        title: "Nieznany Błąd",
        description: "Wystąpił nieznany błąd",
      },
      network: {
        title: "Błąd Sieci",
        description: "Błąd sieci podczas pobierania zadań",
      },
      unsavedChanges: {
        title: "Niezapisane Zmiany",
        description: "Są niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych",
      },
    },
    success: {
      title: "Pobrano Zadania",
      description: "Lista zadań importu została pobrana pomyślnie",
    },
  },
};
