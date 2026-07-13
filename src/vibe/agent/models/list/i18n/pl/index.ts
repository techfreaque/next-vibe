import type { translations as enTranslations } from "../en";
export const translations: typeof enTranslations = {
  tags: {
    models: "Modele",
  },
  endpointCategories: {
    ai: "AI",
  },
  enums: {
    modelType: {
      text: "Tekst",
      image: "Obraz",
      video: "Wideo",
      audio: "Audio",
    },
    content: {
      mainstream: "Główny nurt",
      open: "Otwarty",
      uncensored: "Bez cenzury",
    },
    intelligence: {
      quick: "Szybki",
      smart: "Inteligentny",
      brilliant: "Genialny",
    },
  },
  get: {
    title: "Modele",
    titleShort: "Modele AI",
    description:
      "Przeglądaj wszystkie modele AI. Filtruj według typu (text/image/video/audio), poziomu treści, inteligencji. Dla modeli wideo: supportedDurations = obsługiwane długości klipu w sekundach, supportedAspectRatios = obsługiwane proporcje, supportedFrameImages = akceptowane ramki (first_frame = obraz-do-wideo, last_frame = animacja do obrazu końcowego), allowedPassthroughParameters = dodatkowe opcje (np. negative_prompt, cfg_scale), generateAudio = model generuje audio w wideo. Przekaż id modelu jako parametr model w generate_video.",
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
        supportedDurations: "Czasy trwania (s)",
        supportedAspectRatios: "Proporcje obrazu",
        supportedResolutions: "Rozdzielczości",
        supportedFrameImages: "Typy klatek",
        generateAudio: "Generuje audio",
        supportedSizes: "Dokładne rozmiary",
        allowedPassthroughParameters: "Dodatkowe parametry",
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
      statsLabel: "{{matched}} z {{total}} modeli",
      free: "Darmowy",
      credits: "~{{cost}} kr.",
      ctx: "kontekst",
    },
  },
};
