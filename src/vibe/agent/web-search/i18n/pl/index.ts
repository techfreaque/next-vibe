import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Informacja",
  enums: {
    provider: {
      AUTO: "Automatycznie (zalecane)",
      BRAVE: "Brave Search",
      KAGI: "Kagi FastGPT",
    },
  },
  get: {
    title: "Wyszukaj w sieci",
    titleShort: "Szukaj w sieci",
    dynamicTitle: "Szukaj: {{query}}",
    description:
      "Przeszukuje internet w poszukiwaniu aktualnych informacji, wiadomości, faktów lub wydarzeń. Automatycznie kieruje do preferowanego dostawcy wyszukiwania.",
    form: {
      title: "Wyszukiwanie w sieci",
      description: "Szukaj w sieci za pomocą preferowanego dostawcy",
    },
    submitButton: {
      label: "Szukaj",
      loadingText: "Wyszukiwanie...",
    },
    backButton: {
      label: "Wstecz",
    },
    fields: {
      query: {
        title: "Zapytanie",
        description:
          "Jasne i konkretne zapytanie. Używaj słów kluczowych zamiast pytań.",
        placeholder: "Wpisz zapytanie...",
      },
      provider: {
        title: "Dostawca wyszukiwania",
        description:
          "Która wyszukiwarka zostanie użyta. Auto wybiera domyślną lub najtańszą dostępną.",
        options: {
          auto: "Automatycznie (zalecane)",
          brave: "Brave Search",
          kagi: "Kagi FastGPT",
        },
      },
      maxResults: {
        title: "Maks. wyniki",
        description: "Liczba wyników do zwrócenia (1-10). Tylko Brave.",
      },
      includeNews: {
        title: "Uwzględnij wiadomości",
        description:
          "Uwzględnij wyniki wiadomości dla bieżących wydarzeń. Tylko Brave.",
      },
      freshness: {
        title: "Świeżość",
        description: "Filtruj wyniki według aktualności. Tylko Brave.",
        options: {
          day: "Ostatni dzień",
          week: "Ostatni tydzień",
          month: "Ostatni miesiąc",
          year: "Ostatni rok",
        },
      },
    },
    response: {
      provider: {
        title: "Dostawca",
        description: "Który dostawca wyszukiwania został użyty",
      },
      output: {
        title: "Odpowiedź AI",
        description: "Podsumowanie wygenerowane przez AI (tylko Kagi)",
      },
      results: {
        title: "Wyniki",
        description: "Wyniki wyszukiwania w sieci",
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
    },
    errors: {
      queryEmpty: {
        title: "Zapytanie jest wymagane",
        description: "Podaj zapytanie wyszukiwania",
      },
      queryTooLong: {
        title: "Zapytanie jest zbyt długie (maks. {{maxLength}} znaków)",
        description: "Zapytanie może mieć maksymalnie 400 znaków",
      },
      noProvider: {
        title: "Brak dostępnego dostawcy",
        description:
          "Brak skonfigurowanych kluczy API. Skonfiguruj Brave Search lub Kagi w pliku .env.",
      },
      noProviderAdmin: {
        title:
          "Brak skonfigurowanego dostawcy. Dodaj BRAVE_SEARCH_API_KEY lub KAGI_API_KEY do pliku .env.",
        description:
          "Brave Search: https://api.search.brave.com/app/keys — Kagi: https://kagi.com/settings?p=api",
      },
      noProviderUser: {
        title: "Wyszukiwanie w sieci jest teraz niedostępne.",
        description:
          "Administrator nie skonfigurował jeszcze dostawcy wyszukiwania.",
      },
      providerUnavailable: {
        title: "Dostawca niedostępny",
        description:
          "Wybrany dostawca nie jest skonfigurowany. Wybierz innego lub użyj trybu auto.",
      },
      timeout: {
        title: "Upłynął limit czasu",
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
        description: "Nie udało się ukończyć wyszukiwania. Spróbuj ponownie",
      },
    },
    success: {
      title: "Wyszukiwanie zakończone",
      description: "Wyszukiwanie w sieci zakończyło się pomyślnie",
    },
  },
  tags: {
    search: "Wyszukiwanie",
    web: "Sieć",
    internet: "Internet",
  },
};
