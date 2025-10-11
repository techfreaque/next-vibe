import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Dane Biznesowe",
  tags: {
    goals: "Cele",
    objectives: "Cele",
    update: "Aktualizacja",
  },

  // Completion status field translations
  isComplete: "Cele kompletne",
  completedFields: "Wypełnione pola",
  totalFields: "Wszystkie pola",
  completionPercentage: "Procent ukończenia",
  missingRequiredFields: "Brakujące pola wymagane",

  // GET endpoint translations
  get: {
    title: "Pobierz Cele",
    description: "Pobierz cele i zadania biznesowe",

    form: {
      title: "Żądanie Celów",
      description: "Żądanie pobrania celów biznesowych",
    },

    response: {
      title: "Cele Biznesowe",
      description: "Twoje cele i zadania biznesowe",
      primaryGoals: {
        title: "Główne cele biznesowe",
      },
      budgetRange: {
        title: "Zakres budżetu",
      },
      shortTermGoals: {
        title: "Cele krótkoterminowe",
      },
      longTermGoals: {
        title: "Cele długoterminowe",
      },
      revenueGoals: {
        title: "Cele przychodowe",
      },
      growthGoals: {
        title: "Cele wzrostu",
      },
      marketingGoals: {
        title: "Cele marketingowe",
      },
      successMetrics: {
        title: "Wskaźniki sukcesu",
      },
      priorities: {
        title: "Priorytety biznesowe",
      },
      timeline: {
        title: "Harmonogram i kamienie milowe",
      },
      additionalNotes: {
        title: "Dodatkowe notatki",
      },
      completionStatus: {
        title: "Status ukończenia sekcji",
        description: "Aktualne informacje o statusie ukończenia",
      },
    },

    errors: {
      unauthorized: {
        title: "Nieautoryzowany Dostęp",
        description: "Nie masz uprawnień do dostępu do tych celów",
      },
      validation: {
        title: "Błąd Walidacji",
        description: "Nieprawidłowe parametry żądania dla celów",
      },
      server: {
        title: "Błąd Serwera",
        description: "Wystąpił błąd podczas pobierania celów",
      },
      unknown: {
        title: "Nieznany Błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      network: {
        title: "Błąd Sieci",
        description: "Nie można połączyć się w celu pobrania celów",
      },
      forbidden: {
        title: "Dostęp Zabroniony",
        description: "Nie masz uprawnień do wyświetlenia tych celów",
      },
      notFound: {
        title: "Cele Nie Znalezione",
        description: "Nie znaleziono celów dla tego użytkownika",
      },
      conflict: {
        title: "Konflikt Danych",
        description: "Dane celów są w konflikcie z istniejącymi informacjami",
      },
      unsavedChanges: {
        title: "Niezapisane Zmiany",
        description: "Masz niezapisane zmiany w swoich celach",
      },
    },

    success: {
      title: "Cele Pobrane",
      description: "Pomyślnie pobrano cele biznesowe",
    },
  },

  // PUT endpoint translations
  put: {
    title: "Aktualizuj Cele",
    description: "Aktualizuj cele i zadania biznesowe",

    form: {
      title: "Aktualizuj Cele",
      description: "Zaktualizuj swoje cele i zadania biznesowe",
    },

    response: {
      title: "Zaktualizowane Cele",
      description: "Twoje cele zostały pomyślnie zaktualizowane",
      message: {
        title: "Wiadomość Aktualizacji",
        description: "Komunikat statusu aktualizacji",
      },
      primaryGoals: {
        title: "Główne cele zaktualizowane",
      },
      budgetRange: {
        title: "Zakres budżetu zaktualizowany",
      },
      shortTermGoals: {
        title: "Cele krótkoterminowe zaktualizowane",
      },
      longTermGoals: {
        title: "Cele długoterminowe zaktualizowane",
      },
      revenueGoals: {
        title: "Cele przychodowe zaktualizowane",
      },
      growthGoals: {
        title: "Cele wzrostu zaktualizowane",
      },
      marketingGoals: {
        title: "Cele marketingowe zaktualizowane",
      },
      successMetrics: {
        title: "Wskaźniki sukcesu zaktualizowane",
      },
      priorities: {
        title: "Priorytety zaktualizowane",
      },
      timeline: {
        title: "Harmonogram zaktualizowany",
      },
      additionalNotes: {
        title: "Dodatkowe notatki zaktualizowane",
      },
      completionStatus: {
        title: "Status ukończenia zaktualizowany",
        description: "Status ukończenia celów został zaktualizowany",
      },
    },

    // Field labels and descriptions
    primaryGoals: {
      label: "Główne Cele",
      description: "Wybierz swoje główne cele biznesowe",
      placeholder: "Wybierz swoje główne cele",
    },

    budgetRange: {
      label: "Zakres Budżetu",
      description: "Twój dostępny budżet na osiągnięcie tych celów",
      placeholder: "np. 10 000 zł - 50 000 zł",
    },

    shortTermGoals: {
      label: "Cele Krótkoterminowe (6 miesięcy)",
      description: "Co chcesz osiągnąć w ciągu najbliższych 6 miesięcy",
      placeholder: "Opisz swoje krótkoterminowe cele...",
    },

    longTermGoals: {
      label: "Cele Długoterminowe (1-2 lata)",
      description: "Twoja wizja na najbliższe 1-2 lata",
      placeholder: "Opisz swoją długoterminową wizję...",
    },

    revenueGoals: {
      label: "Cele Przychodowe",
      description: "Twoje cele przychodowe i finansowe",
      placeholder: "np. Zwiększenie przychodów o 30%",
    },

    growthGoals: {
      label: "Cele Wzrostu",
      description: "Cele rozwoju i ekspansji biznesu",
      placeholder: "np. Ekspansja na 3 nowe rynki",
    },

    marketingGoals: {
      label: "Cele Marketingowe",
      description: "Cele marketingowe i świadomości marki",
      placeholder: "np. Podwojenie obserwujących w mediach społecznościowych",
    },

    successMetrics: {
      label: "Metryki Sukcesu",
      description: "Jak będziesz mierzyć sukces",
      placeholder: "np. Miesięczni aktywni użytkownicy, współczynnik konwersji",
    },

    priorities: {
      label: "Priorytety",
      description: "Twoje najważniejsze priorytety w kolejności ważności",
      placeholder: "Wymień swoje priorytety...",
    },

    timeline: {
      label: "Harmonogram",
      description: "Kluczowe kamienie milowe i terminy",
      placeholder:
        "np. Q1: Wprowadzenie nowego produktu, Q2: Rozbudowa zespołu",
    },

    additionalNotes: {
      label: "Dodatkowe Uwagi",
      description: "Wszelkie inne cele lub uwagi",
      placeholder: "Dodaj dodatkowe informacje...",
    },

    errors: {
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnień do aktualizacji tych celów",
      },
      validation: {
        title: "Błąd Walidacji",
        description: "Sprawdź swoje dane i spróbuj ponownie",
      },
      server: {
        title: "Błąd Serwera",
        description: "Nie udało się zaktualizować celów",
      },
      unknown: {
        title: "Nieznany Błąd",
        description: "Wystąpił nieoczekiwany błąd podczas aktualizacji",
      },
      network: {
        title: "Błąd Sieci",
        description: "Nie można połączyć się w celu aktualizacji celów",
      },
      forbidden: {
        title: "Dostęp Zabroniony",
        description: "Nie masz uprawnień do aktualizacji tych celów",
      },
      notFound: {
        title: "Nie Znaleziono",
        description: "Rekord celów nie został znaleziony",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Aktualizacja celów jest w konflikcie z istniejącymi danymi",
      },
      unsavedChanges: {
        title: "Niezapisane Zmiany",
        description: "Masz niezapisane zmiany w swoich celach",
      },
    },

    success: {
      title: "Cele Zaktualizowane",
      description: "Twoje cele zostały pomyślnie zaktualizowane",
      message: "Cele zapisane",
    },
  },

  // Enum translations
  enums: {
    businessGoal: {
      increaseRevenue: "Zwiększyć Przychody",
      growCustomerBase: "Rozszerzyć Bazę Klientów",
      improveBrandAwareness: "Poprawić Świadomość Marki",
      enhanceCustomerEngagement: "Zwiększyć Zaangażowanie Klientów",
      expandMarketReach: "Rozszerzyć Zasięg Rynkowy",
      optimizeOperations: "Optymalizować Operacje",
      launchNewProducts: "Wprowadzić Nowe Produkty",
      improveCustomerRetention: "Poprawić Retencję Klientów",
      reduceCosts: "Zmniejszyć Koszty",
      digitalTransformation: "Transformacja Cyfrowa",
      improveOnlinePresence: "Poprawić Obecność Online",
      generateLeads: "Generować Leady",
    },
    goalCategory: {
      revenue: "Przychody",
      growth: "Wzrost",
      marketing: "Marketing",
      operations: "Operacje",
      customer: "Klient",
      product: "Produkt",
      team: "Zespół",
      brand: "Marka",
      efficiency: "Wydajność",
      expansion: "Ekspansja",
    },
    goalTimeframe: {
      shortTerm: "Krótkoterminowe (0-6 miesięcy)",
      mediumTerm: "Średnioterminowe (6-12 miesięcy)",
      longTerm: "Długoterminowe (1+ lat)",
      ongoing: "Ciągłe",
    },
    goalPriority: {
      low: "Niski",
      medium: "Średni",
      high: "Wysoki",
      critical: "Krytyczny",
    },
    metricType: {
      revenue: "Przychody",
      customers: "Klienci",
      traffic: "Ruch",
      conversions: "Konwersje",
      engagement: "Zaangażowanie",
      retention: "Retencja",
      satisfaction: "Satysfakcja",
      efficiency: "Wydajność",
      reach: "Zasięg",
      brandAwareness: "Świadomość Marki",
    },
  },
};
