export const translations = {
  get: {
    title: "Wyszukaj w sieci",
    description:
      "Przeszukuj internet w poszukiwaniu aktualnych informacji, wiadomości, faktów lub ostatnich wydarzeń. Użyj tego, gdy potrzebujesz aktualnych informacji lub chcesz zweryfikować fakty.",
    form: {
      title: "Parametry wyszukiwania",
      description: "Skonfiguruj zapytanie wyszukiwania w sieci",
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
      validation: {
        title: "Błąd walidacji",
        description: "Zapytanie wyszukiwania jest nieprawidłowe lub brakuje",
      },
      internal: {
        title: "Błąd wyszukiwania",
        description: "Wystąpił błąd podczas wyszukiwania",
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
