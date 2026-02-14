import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Informacja",
  get: {
    title: "Wyszukaj w sieci",
    description:
      "Przeszukuj internet w poszukiwaniu aktualnych informacji, wiadomości, faktów lub ostatnich wydarzeń. Użyj tego, gdy potrzebujesz aktualnych informacji lub chcesz zweryfikować fakty.",
    form: {
      title: "Parametry wyszukiwania",
      description: "Skonfiguruj zapytanie wyszukiwania w sieci",
    },
    submitButton: {
      label: "Szukaj",
      loadingText: "Wyszukiwanie...",
    },
    fields: {
      query: {
        title: "Zapytanie wyszukiwania",
        description:
          "Jasne i konkretne zapytanie wyszukiwania. Używaj słów kluczowych zamiast pytań.",
        placeholder: "Wprowadź zapytanie wyszukiwania...",
      },
      maxResults: {
        title: "Maks. wyniki",
        description: "Liczba wyników do zwrócenia (1-10)",
      },
      includeNews: {
        title: "Uwzględnij wiadomości",
        description: "Uwzględnij wyniki wiadomości dla bieżących wydarzeń",
      },
      freshness: {
        title: "Świeżość",
        description: "Filtruj wyniki według tego, jak są aktualne",
        options: {
          day: "Ostatni dzień",
          week: "Ostatni tydzień",
          month: "Ostatni miesiąc",
          year: "Ostatni rok",
        },
      },
    },
    response: {
      success: {
        title: "Sukces",
        description: "Czy wyszukiwanie zakończyło się sukcesem",
      },
      message: {
        title: "Wiadomość",
        description: "Komunikat o statusie wyszukiwania",
      },
      query: {
        title: "Zapytanie",
        description: "Zapytanie wyszukiwania, które zostało wykonane",
      },
      results: {
        title: "Wyniki",
        description: "Tablica wyników wyszukiwania",
        result: "Wynik",
        item: {
          title: "Wynik wyszukiwania",
          description: "Pojedynczy wynik wyszukiwania",
          url: "URL",
          snippet: "Fragment",
          age: "Wiek",
          source: "Źródło",
        },
      },
      cached: {
        title: "W pamięci podręcznej",
        description: "Czy wyniki zostały pobrane z pamięci podręcznej",
      },
      timestamp: {
        title: "Znacznik czasu",
        description: "Kiedy wykonano wyszukiwanie",
      },
    },
    errors: {
      queryEmpty: {
        title: "Zapytanie wyszukiwania jest wymagane",
        description: "Proszę podać zapytanie wyszukiwania",
      },
      queryTooLong: {
        title: "Zapytanie wyszukiwania jest zbyt długie",
        description: "Zapytanie może mieć maksymalnie 400 znaków",
      },
      timeout: {
        title: "Upłynął limit czasu wyszukiwania",
        description: "Wyszukiwanie trwało zbyt długo",
      },
      searchFailed: {
        title: "Wyszukiwanie nie powiodło się",
        description: "Wystąpił błąd podczas wyszukiwania",
      },
      validation: {
        title: "Nieprawidłowe wyszukiwanie",
        description: "Sprawdź parametry wyszukiwania i spróbuj ponownie",
      },
      internal: {
        title: "Coś poszło nie tak",
        description: "Nie mogliśmy ukończyć wyszukiwania. Spróbuj ponownie",
      },
    },
    success: {
      title: "Wyszukiwanie zakończone sukcesem",
      description: "Wyszukiwanie w sieci zakończyło się pomyślnie",
    },
  },
  tags: {
    search: "Wyszukiwanie",
    web: "Sieć",
    internet: "Internet",
  },
};
