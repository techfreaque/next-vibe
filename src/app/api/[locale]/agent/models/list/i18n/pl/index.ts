export const translations = {
  tags: {
    models: "Modele",
  },
  endpointCategories: {
    ai: "AI",
  },
  get: {
    title: "Lista modeli AI",
    description:
      "Przeglądaj i wyszukuj wszystkie dostępne modele AI. Filtruj według typu, poziomu treści, inteligencji, ceny lub możliwości.",
    dynamicTitle: "{{count}} modeli",

    fields: {
      query: {
        label: "Szukaj",
        description:
          "Filtruj modele według nazwy, dostawcy lub możliwości (np. 'coding', 'uncensored', 'image').",
        placeholder: "np. GPT, Gemini, coding…",
      },
      modelType: {
        label: "Typ",
        description:
          "Filtruj według typu modelu: text, image, video lub audio. Pozostaw puste dla wszystkich typów.",
        placeholder: "Wszystkie typy",
      },
      contentLevel: {
        label: "Poziom treści",
        description:
          "Filtruj według polityki treści. Mainstream = standardowe filtry. Open = mniej ograniczeń. Uncensored = brak filtrów.",
        placeholder: "Wszystkie poziomy treści",
      },
      intelligence: {
        label: "Inteligencja",
        description:
          "Minimalny poziom inteligencji. Quick = szybki. Smart = zrównoważony. Brilliant = głębokie rozumowanie.",
        placeholder: "Dowolna inteligencja",
      },
      page: {
        label: "Strona",
        description: "Numer strony dla paginacji (zaczyna się od 1).",
      },
      pageSize: {
        label: "Rozmiar strony",
        description: "Liczba modeli na stronie (domyślnie 50, max 200).",
      },
    },

    response: {
      models: "Modele",
      totalCount: "Łącznie",
      matchedCount: "Dopasowane",
      currentPage: "Strona",
      totalPages: "Stron",
      hint: "Wskazówka",
      model: {
        id: "ID modelu",
        name: "Nazwa",
        provider: "Dostawca",
        type: "Typ",
        description: "Opis",
        contextWindow: "Kontekst",
        parameterCount: "Parametry",
        intelligence: "Inteligencja",
        content: "Treść",
        price: "Cena (kredyty)",
        supportsTools: "Narzędzia",
        utilities: "Możliwości",
        inputs: "Wejścia",
        outputs: "Wyjścia",
      },
    },

    errors: {
      server: {
        title: "Błąd serwera",
        description: "Nie udało się pobrać listy modeli.",
      },
      network: {
        title: "Błąd sieci",
        description: "Połączenie sieciowe nieudane.",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd.",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry filtra.",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Musisz być zalogowany.",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono modeli.",
      },
      conflict: {
        title: "Konflikt",
        description: "Konflikt żądania.",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany.",
      },
    },

    success: {
      title: "Modele załadowane",
      description: "Lista modeli AI pobrana pomyślnie.",
    },

    browser: {
      supportsTools: "✓ narzędzia",
      noModels: "Żadne modele nie pasują do filtrów.",
      allLabel: "Wszystkie",
      pageLabel: "strona {{current}}/{{total}}",
      statsLabel: "{{matched}} z {{total}} modeli",
      statsLabelFiltered: "{{matched}} przefiltrowane",
      free: "Darmowy",
      credits: "~{{cost}} kr.",
      ctx: "kontekst",
    },
  },
} as const;
