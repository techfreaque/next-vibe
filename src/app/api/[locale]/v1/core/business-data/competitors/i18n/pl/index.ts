import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Punkt końcowy API",
  tags: {
    competitors: "Konkurenci",
    market: "Analiza rynku",
    update: "Aktualizuj",
  },

  // GET endpoint translations
  get: {
    title: "Pobierz dane konkurentów",
    description: "Pobierz informacje i analizy konkurentów",
    form: {
      title: "Informacje o konkurentach",
      description: "Dostęp do danych analizy konkurencji",
    },
    response: {
      title: "Dane konkurentów",
      description: "Informacje o konkurentach i analiza rynku",
      competitors: {
        title: "Lista konkurentów",
      },
      mainCompetitors: {
        title: "Główni konkurenci",
      },
      competitiveAdvantages: {
        title: "Przewagi konkurencyjne",
      },
      competitiveDisadvantages: {
        title: "Wady konkurencyjne",
      },
      marketPosition: {
        title: "Pozycja rynkowa",
      },
      differentiators: {
        title: "Kluczowe wyróżniki",
      },
      competitorStrengths: {
        title: "Mocne strony konkurentów",
      },
      competitorWeaknesses: {
        title: "Słabe strony konkurentów",
      },
      marketGaps: {
        title: "Luki rynkowe",
      },
      additionalNotes: {
        title: "Dodatkowe notatki",
      },
      completionStatus: {
        title: "Status ukończenia sekcji",
        description: "Status ukończenia sekcji konkurencji",
        isComplete: "Sekcja ukończona",
        completedFields: "Ukończone pola",
        totalFields: "Całkowita liczba pól",
        completionPercentage: "Procent ukończenia",
        missingRequiredFields: "Brakujące wymagane pola",
      },
    },
    errors: {
      unauthorized: {
        title: "Odmowa dostępu",
        description: "Nie masz uprawnień do dostępu do tych danych konkurentów",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Dane żądania są nieprawidłowe",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      network: {
        title: "Błąd sieci",
        description: "Połączenie sieciowe nie powiodło się",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Dane konkurentów nie zostały znalezione",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
    },
    success: {
      title: "Sukces",
      description: "Dane konkurentów pobrane pomyślnie",
    },
  },

  // PUT endpoint translations
  put: {
    title: "Aktualizuj dane konkurentów",
    description: "Aktualizuj informacje i analizy konkurentów",
    form: {
      title: "Aktualizuj informacje o konkurentach",
      description: "Modyfikuj dane analizy konkurencji",
    },
    response: {
      title: "Zaktualizowane dane konkurentów",
      description: "Zaktualizowane informacje o konkurentach",
      message: {
        title: "Komunikat statusu aktualizacji",
      },
      competitors: {
        title: "Konkurenci zaktualizowani",
      },
      mainCompetitors: {
        title: "Główni konkurenci zaktualizowani",
      },
      competitiveAdvantages: {
        title: "Przewagi konkurencyjne zaktualizowane",
      },
      competitiveDisadvantages: {
        title: "Wady konkurencyjne zaktualizowane",
      },
      marketPosition: {
        title: "Pozycja rynkowa zaktualizowana",
      },
      differentiators: {
        title: "Wyróżniki zaktualizowane",
      },
      competitorStrengths: {
        title: "Mocne strony konkurentów zaktualizowane",
      },
      competitorWeaknesses: {
        title: "Słabe strony konkurentów zaktualizowane",
      },
      marketGaps: {
        title: "Luki rynkowe zaktualizowane",
      },
      additionalNotes: {
        title: "Dodatkowe notatki zaktualizowane",
      },
      completionStatus: {
        title: "Status ukończenia zaktualizowany",
        description: "Zaktualizowany status ukończenia konkurencji",
        isComplete: "Sekcja ukończona",
        completedFields: "Ukończone pola",
        totalFields: "Całkowita liczba pól",
        completionPercentage: "Procent ukończenia",
        missingRequiredFields: "Brakujące wymagane pola",
      },
    },

    // Field labels, descriptions, and placeholders
    competitors: {
      label: "Konkurenci",
      description: "Wymień głównych konkurentów na rynku",
      placeholder: "Wprowadź nazwy konkurentów oddzielone przecinkami",
    },
    mainCompetitors: {
      label: "Główni konkurenci",
      description: "Zidentyfikuj głównych konkurentów i ich pozycję rynkową",
      placeholder: "Opisz głównych konkurentów i ich mocne strony",
    },
    competitiveAdvantages: {
      label: "Przewagi konkurencyjne",
      description: "Jakie przewagi masz nad konkurentami?",
      placeholder: "Wymień kluczowe przewagi konkurencyjne",
    },
    competitiveDisadvantages: {
      label: "Wady konkurencyjne",
      description: "Jakie wady masz w porównaniu z konkurentami?",
      placeholder: "Opisz obszary, gdzie konkurenci mają przewagę",
    },
    marketPosition: {
      label: "Pozycja rynkowa",
      description: "Opisz swoją pozycję na rynku względem konkurentów",
      placeholder: "Wyjaśnij obecną pozycję rynkową i strategię",
    },
    differentiators: {
      label: "Kluczowe wyróżniki",
      description: "Co czyni Twój biznes wyjątkowym od konkurentów?",
      placeholder: "Opisz, co Cię wyróżnia od konkurencji",
    },
    competitorStrengths: {
      label: "Mocne strony konkurentów",
      description: "Jakie są główne mocne strony Twoich konkurentów?",
      placeholder: "Przeanalizuj kluczowe mocne strony konkurentów",
    },
    competitorWeaknesses: {
      label: "Słabe strony konkurentów",
      description: "Jakie słabości widzisz u swoich konkurentów?",
      placeholder: "Zidentyfikuj możliwości, gdzie konkurenci są słabi",
    },
    marketGaps: {
      label: "Luki rynkowe",
      description: "Jakie luki istnieją na rynku, które mógłbyś wypełnić?",
      placeholder: "Opisz niezaspokojone potrzeby lub możliwości rynkowe",
    },
    additionalNotes: {
      label: "Dodatkowe notatki",
      description: "Dodatkowe spostrzeżenia dotyczące krajobrazu konkurencji",
      placeholder: "Dodaj inne istotne notatki z analizy konkurencji",
    },

    errors: {
      unauthorized: {
        title: "Odmowa dostępu",
        description:
          "Nie masz uprawnień do aktualizacji tych danych konkurentów",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Podane dane są nieprawidłowe",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera podczas aktualizacji",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd podczas aktualizacji",
      },
      network: {
        title: "Błąd sieci",
        description:
          "Połączenie sieciowe nie powiodło się podczas aktualizacji",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp do aktualizacji zabroniony",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Dane konkurentów nie zostały znalezione do aktualizacji",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych podczas aktualizacji",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
    },
    success: {
      title: "Sukces",
      description: "Dane konkurentów zaktualizowane pomyślnie",
      message: "Informacje o konkurentach zostały zaktualizowane",
    },
  },

  // Enum translations
  enums: {
    competitorType: {
      direct: "Bezpośredni konkurent",
      indirect: "Pośredni konkurent",
      substitute: "Produkt zastępczy",
      potential: "Potencjalny konkurent",
    },
    marketPosition: {
      leader: "Lider rynku",
      challenger: "Pretendent rynkowy",
      follower: "Naśladowca rynkowy",
      niche: "Gracz niszowy",
      disruptor: "Dysruptor rynkowy",
    },
    competitiveAdvantage: {
      price: "Przewaga cenowa",
      quality: "Przewaga jakościowa",
      service: "Doskonałość usług",
      innovation: "Innowacyjność",
      brand: "Siła marki",
      distribution: "Sieć dystrybucji",
      technology: "Technologia",
      expertise: "Ekspertyza",
      speed: "Szybkość wprowadzania na rynek",
      customization: "Personalizacja",
    },
    analysisArea: {
      pricing: "Strategia cenowa",
      productFeatures: "Cechy produktu",
      marketing: "Podejście marketingowe",
      customerService: "Obsługa klienta",
      distribution: "Kanały dystrybucji",
      technology: "Stos technologiczny",
      brandPositioning: "Pozycjonowanie marki",
      targetAudience: "Grupa docelowa",
      strengths: "Mocne strony",
      weaknesses: "Słabe strony",
    },
  },

  // Individual completion status field translations
  isComplete: "Analiza konkurencji zakończona",
  completedFields: "Ukończone pola konkurencji",
  totalFields: "Całkowita liczba pól konkurencji",
  completionPercentage: "Procent ukończenia konkurencji",
  missingRequiredFields: "Brakujące wymagane pola konkurencji",
};
