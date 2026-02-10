import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Informacja",
  get: {
    title: "Wyszukaj z Kagi",
    description:
      "Przeszukuj internet lub uzyskaj odpowiedzi generowane przez AI za pomocą Kagi. Tryb FastGPT zapewnia kompleksowe odpowiedzi ze źródłami, podczas gdy tryb wyszukiwania zwraca bezpośrednie wyniki.",
    form: {
      title: "Parametry wyszukiwania",
      description: "Skonfiguruj zapytanie wyszukiwania Kagi",
    },
    submitButton: {
      label: "Szukaj",
      loadingText: "Wyszukiwanie...",
    },
    fields: {
      query: {
        title: "Zapytanie wyszukiwania",
        description: "Jasne i konkretne zapytanie wyszukiwania lub pytanie.",
        placeholder: "Wprowadź zapytanie wyszukiwania...",
      },
      mode: {
        title: "Tryb wyszukiwania",
        description:
          "Wybierz między odpowiedziami generowanymi przez AI (FastGPT) a bezpośrednimi wynikami wyszukiwania",
        options: {
          fastgpt: "FastGPT (Odpowiedzi generowane przez AI)",
          search: "Wyszukiwanie (Bezpośrednie wyniki)",
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
      output: {
        title: "Odpowiedź",
        description: "Odpowiedź wygenerowana przez AI z FastGPT",
      },
      query: {
        title: "Zapytanie",
        description: "Zapytanie wyszukiwania, które zostało wykonane",
      },
      references: {
        title: "Referencje",
        description: "Referencje źródłowe i cytaty",
        reference: "Referencja",
        item: {
          title: "Referencja",
          description: "Referencja źródłowa z cytatem",
          url: "URL",
          snippet: "Fragment",
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
    },
    success: {
      title: "Wyszukiwanie zakończone sukcesem",
      description: "Wyszukiwanie Kagi zakończyło się pomyślnie",
    },
  },
  tags: {
    search: "Wyszukiwanie",
    web: "Sieć",
    ai: "AI",
  },
};
