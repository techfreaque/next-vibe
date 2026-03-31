export const translations = {
  category: "Informacja",
  get: {
    title: "Pobierz Zawartość URL",
    description:
      "Pobierz i wyodrębnij zawartość z dowolnego adresu URL, konwertując ją na czytelny format markdown. Użyj tego, gdy potrzebujesz przeczytać lub przeanalizować zawartość strony internetowej.",
    form: {
      title: "Parametry Pobierania URL",
      description:
        "Skonfiguruj adres URL, z którego ma zostać pobrana zawartość",
    },
    fields: {
      url: {
        title: "URL",
        description:
          "Pełny adres URL do pobrania (musi zawierać http:// lub https://)",
        placeholder: "https://przyklad.pl",
      },
      query: {
        title: "Zapytanie (opcjonalne)",
        description:
          "Filtr regex stosowany po pobraniu. Zwracane są tylko akapity pasujące do wzorca, posortowane według liczby dopasowań, do limitu znaków. Pominięcie zwraca pełną stronę (obciętą środkowo przy dużych stronach). Składnia: regex JS — 'uwierzytelnianie', '(login|rejestracja)', 'class\\s+\\w+'. Nieprawidłowy regex wraca do dopasowania dosłownego.",
        placeholder: "uwierzytelnianie",
      },
    },
    response: {
      message: {
        title: "Wiadomość",
        description: "Status operacji pobierania",
      },
      content: {
        title: "Zawartość",
        description: "Wyodrębniona zawartość w formacie markdown",
      },
      truncated: {
        title: "Skrócono",
        description: "Czy zawartość została skrócona ze względu na rozmiar",
      },
      truncatedNote: {
        title: "Informacja o skróceniu",
        description: "Szczegóły skrócenia i jak uzyskać więcej treści",
      },
      url: {
        title: "Zobacz oryginał",
        description: "Pobrany adres URL",
      },
      statusCode: {
        title: "Kod Statusu",
        description: "Kod statusu HTTP odpowiedzi",
      },
      timeElapsed: {
        title: "Czas Wykonania (ms)",
        description: "Czas potrzebny na pobranie zawartości w milisekundach",
      },
    },
    errors: {
      validation: {
        title: "Błąd Walidacji",
        description: "Adres URL jest nieprawidłowy lub brakujący",
      },
      internal: {
        title: "Błąd Pobierania",
        description: "Wystąpił błąd podczas pobierania adresu URL",
      },
    },
    success: {
      title: "Pobieranie Zakończone Sukcesem",
      description: "Zawartość URL została pomyślnie pobrana",
    },
  },
  tags: {
    scraping: "Scraping",
    web: "Internet",
    content: "Zawartość",
  },
  cleanup: {
    post: {
      title: "Czyszczenie Cache URL",
      description: "Usuń stare pliki cache URL starsze niż 7 dni",
      container: {
        title: "Wyniki czyszczenia",
        description: "Podsumowanie usuniętych plików cache",
      },
      response: {
        deletedCount: "Usunięte pliki",
        totalScanned: "Łącznie przeskanowano",
        retentionDays: "Dni przechowywania",
      },
      success: {
        title: "Cache wyczyszczony",
        description: "Stare pliki cache URL zostały usunięte",
      },
    },
    errors: {
      server: {
        title: "Błąd czyszczenia",
        description: "Wystąpił błąd podczas czyszczenia cache URL",
      },
    },
    name: "Czyszczenie Cache URL",
    description: "Tygodniowe czyszczenie starych plików cache URL",
  },
};
