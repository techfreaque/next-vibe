import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "sql",
  post: {
    title: "Wykonaj SQL",
    description: "Wykonaj zapytania SQL na bazie danych",
    form: {
      title: "Konfiguracja zapytania SQL",
      description: "Skonfiguruj parametry zapytania SQL",
    },
    response: {
      title: "Odpowiedź zapytania",
      description: "Wyniki wykonania zapytania SQL",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja do wykonania SQL",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe zapytanie SQL lub parametry",
      },
      server: {
        title: "Błąd serwera",
        description: "Wewnętrzny błąd serwera podczas wykonywania SQL",
      },
      internal: {
        title: "Błąd wewnętrzny",
        description: "Wykonanie zapytania SQL nie powiodło się",
      },
      database: {
        title: "Błąd bazy danych",
        description: "Wystąpił błąd bazy danych podczas wykonywania zapytania",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd podczas wykonywania SQL",
      },
      network: {
        title: "Błąd sieci",
        description: "Błąd sieci podczas wykonywania SQL",
      },
      forbidden: {
        title: "Zabronione",
        description: "Niewystarczające uprawnienia do wykonania SQL",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasoby SQL nie zostały znalezione",
      },
      conflict: {
        title: "Konflikt",
        description: "Wykryto konflikt SQL",
      },
    },
    success: {
      title: "Zapytanie wykonane",
      description: "Zapytanie SQL wykonane pomyślnie",
    },
  },
  fields: {
    query: {
      title: "Zapytanie SQL",
      description: "Zapytanie SQL do wykonania",
    },
    dryRun: {
      title: "Próbny przebieg",
      description: "Podgląd zapytania bez wykonywania",
    },
    verbose: {
      title: "Szczegółowe wyjście",
      description: "Pokaż szczegółowe informacje o zapytaniu",
    },
    limit: {
      title: "Limit wierszy",
      description: "Maksymalna liczba wierszy do zwrócenia (1-1000)",
    },
    success: {
      title: "Status sukcesu",
    },
    output: {
      title: "Wyjście",
    },
    results: {
      title: "Wyniki zapytania",
    },
    rowCount: {
      title: "Liczba wierszy",
    },
    queryType: {
      title: "Typ zapytania",
    },
  },
};
