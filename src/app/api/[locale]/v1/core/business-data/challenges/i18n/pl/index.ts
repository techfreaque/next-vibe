import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Dane Biznesowe",
  tags: {
    challenges: "Wyzwania",
    businessData: "Dane Biznesowe",
    business: "Biznes",
    update: "Aktualizacja",
  },

  // GET endpoint translations
  get: {
    title: "Pobierz Wyzwania Biznesowe",
    description: "Pobierz aktualne wyzwania biznesowe i przeszkody",
    form: {
      title: "Przegląd Wyzwań Biznesowych",
      description: "Zobacz aktualne wyzwania biznesowe i ocenę wpływu",
    },
    response: {
      title: "Dane Wyzwań Biznesowych",
      description: "Aktualne wyzwania biznesowe i status ukończenia",
      currentChallenges: {
        title: "Obecne wyzwania",
      },
      marketingChallenges: {
        title: "Wyzwania marketingowe",
      },
      operationalChallenges: {
        title: "Wyzwania operacyjne",
      },
      financialChallenges: {
        title: "Wyzwania finansowe",
      },
      technicalChallenges: {
        title: "Wyzwania techniczne",
      },
      biggestChallenge: {
        title: "Największe wyzwanie",
      },
      challengeImpact: {
        title: "Wpływ wyzwań",
      },
      previousSolutions: {
        title: "Poprzednie rozwiązania",
      },
      resourceConstraints: {
        title: "Ograniczenia zasobowe",
      },
      budgetConstraints: {
        title: "Ograniczenia budżetowe",
      },
      timeConstraints: {
        title: "Ograniczenia czasowe",
      },
      supportNeeded: {
        title: "Potrzebne wsparcie",
      },
      priorityAreas: {
        title: "Obszary priorytetowe",
      },
      additionalNotes: {
        title: "Dodatkowe uwagi",
      },
      completionStatus: {
        title: "Status ukończenia",
        description: "Status ukończenia wyzwań biznesowych",
      },
    },
    errors: {
      unauthorized: {
        title: "Nieautoryzowany Dostęp",
        description:
          "Nie masz uprawnień do dostępu do danych wyzwań biznesowych",
      },
      validation: {
        title: "Niepowodzenie Walidacji",
        description: "Nieprawidłowe żądanie danych wyzwań biznesowych",
      },
      server: {
        title: "Błąd Serwera",
        description: "Wystąpił błąd podczas pobierania wyzwań biznesowych",
      },
      unknown: {
        title: "Nieznany Błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      network: {
        title: "Błąd Sieci",
        description: "Nie można połączyć się z usługą wyzwań biznesowych",
      },
      forbidden: {
        title: "Dostęp Zabroniony",
        description:
          "Nie masz uprawnień do dostępu do tych danych wyzwań biznesowych",
      },
      notFound: {
        title: "Dane Nie Znalezione",
        description: "Żądane dane wyzwań biznesowych nie zostały znalezione",
      },
    },
    success: {
      title: "Wyzwania Pobrane",
      description: "Dane wyzwań biznesowych zostały pomyślnie pobrane",
    },
  },

  // PUT endpoint translations
  put: {
    title: "Aktualizuj Wyzwania Biznesowe",
    description: "Aktualizuj wyzwania biznesowe i informacje o ograniczeniach",
    form: {
      title: "Konfiguracja Wyzwań Biznesowych",
      description:
        "Zdefiniuj i zaktualizuj swoje wyzwania biznesowe i ograniczenia",
    },
    response: {
      title: "Wyniki Aktualizacji",
      description: "Wyniki aktualizacji wyzwań biznesowych i status ukończenia",
      completionStatus: {
        title: "Status ukończenia zaktualizowany",
        description: "Status ukończenia wyzwań został zaktualizowany",
        isComplete: "Sekcja wyzwań ukończona",
        completedFields: "Ukończone pola wyzwań",
        totalFields: "Całkowita liczba pól wyzwań",
        completionPercentage: "Procent ukończenia wyzwań",
        missingRequiredFields: "Brakujące wymagane pola wyzwań",
      },
    },
    currentChallenges: {
      label: "Aktualne Wyzwania Biznesowe",
      description:
        "Opisz główne wyzwania, przed którymi stoi obecnie Twoja firma",
      placeholder:
        "np. Niska świadomość marki, trudności w pozyskiwaniu klientów, konkurencyjny rynek...",
    },
    marketingChallenges: {
      label: "Wyzwania Marketingowe",
      description: "Konkretne wyzwania związane z marketingiem i promocją",
      placeholder:
        "np. Ograniczony zasięg, wysokie koszty pozyskania, niskie współczynniki konwersji...",
    },
    operationalChallenges: {
      label: "Wyzwania Operacyjne",
      description:
        "Wewnętrzne wyzwania operacyjne wpływające na wydajność biznesową",
      placeholder:
        "np. Nieefektywności procesowe, alokacja zasobów, wąskie gardła przepływu pracy...",
    },
    financialChallenges: {
      label: "Wyzwania Finansowe",
      description: "Ograniczenia finansowe i wyzwania monetarne",
      placeholder:
        "np. Problemy z przepływem środków pieniężnych, ograniczenia finansowania, presja cenowa...",
    },
    technicalChallenges: {
      label: "Wyzwania Techniczne",
      description: "Wyzwania związane z technologią i przeszkody techniczne",
      placeholder:
        "np. Przestarzałe systemy, brak automatyzacji, dług techniczny...",
    },
    biggestChallenge: {
      label: "Największe Wyzwanie",
      description:
        "Jedno najbardziej znaczące wyzwanie, przed którym stoi obecnie Twoja firma",
      placeholder:
        "np. Zatrzymanie klientów, skalowanie operacji, penetracja rynku...",
    },
    challengeImpact: {
      label: "Wpływ Wyzwań",
      description: "Jak te wyzwania wpływają na wydajność Twojej firmy",
      placeholder:
        "np. Wolniejszy wzrost, zmniejszona rentowność, wypalenie pracowników...",
    },
    previousSolutions: {
      label: "Wcześniej Próbowane Rozwiązania",
      description:
        "Rozwiązania lub strategie, które już próbowałeś zastosować do tych wyzwań",
      placeholder:
        "np. Zatrudniono konsultantów, wdrożono nowe oprogramowanie, zmieniono procesy...",
    },
    resourceConstraints: {
      label: "Ograniczenia Zasobów",
      description: "Ograniczenia w zasobach ludzkich lub możliwościach",
      placeholder:
        "np. Mały zespół, brak wiedzy specjalistycznej, ograniczona przepustowość...",
    },
    budgetConstraints: {
      label: "Ograniczenia Budżetowe",
      description:
        "Ograniczenia finansowe wpływające na zdolność do radzenia sobie z wyzwaniami",
      placeholder:
        "np. Ograniczony budżet marketingowy, ograniczenia przepływu środków pieniężnych...",
    },
    timeConstraints: {
      label: "Ograniczenia Czasowe",
      description: "Ograniczenia czasowe i wymagania pilności",
      placeholder:
        "np. Potrzeba szybkich wyników, terminy sezonowe, timing rynkowy...",
    },
    supportNeeded: {
      label: "Potrzebne Wsparcie",
      description:
        "Rodzaj wsparcia lub pomocy potrzebnej do pokonania tych wyzwań",
      placeholder:
        "np. Doradztwo strategiczne, wiedza techniczna, dodatkowe zasoby...",
    },
    priorityAreas: {
      label: "Obszary Priorytetowe",
      description:
        "Obszary wymagające natychmiastowej uwagi lub mające najwyższy priorytet",
      placeholder:
        "np. Pozyskiwanie klientów, efektywność operacyjna, redukcja kosztów...",
    },
    painPoints: {
      label: "Punkty Bólu",
      description:
        "Konkretne punkty bólu powodujące trudności w Twoim biznesie",
      placeholder:
        "np. Odejścia klientów, niskie współczynniki konwersji, wysokie koszty operacyjne...",
    },
    obstacles: {
      label: "Przeszkody Biznesowe",
      description:
        "Główne przeszkody uniemożliwiające Twojej firmie osiągnięcie celów",
      placeholder:
        "np. Bariery regulacyjne, ograniczenia technologiczne, luki kompetencyjne...",
    },
    marketChallenges: {
      label: "Wyzwania Rynkowe",
      description:
        "Wyzwania związane z Twoim rynkiem i krajobrazem konkurencyjnym",
      placeholder:
        "np. Nasycenie rynku, presja konkurencyjna, zmieniające się preferencje klientów...",
    },
    technologyChallenges: {
      label: "Wyzwania Technologiczne",
      description:
        "Wyzwania związane z technologią i infrastrukturą techniczną",
      placeholder:
        "np. Systemy legacy, problemy z integracją, obawy dotyczące cyberbezpieczeństwa...",
    },
    additionalNotes: {
      label: "Dodatkowe Uwagi",
      description:
        "Dodatkowy kontekst lub szczegóły dotyczące Twoich wyzwań biznesowych",
      placeholder: "Dodaj inne istotne informacje o swoich wyzwaniach...",
    },
    errors: {
      unauthorized: {
        title: "Nieautoryzowany Dostęp",
        description: "Nie masz uprawnień do aktualizacji wyzwań biznesowych",
      },
      validation: {
        title: "Niepowodzenie Walidacji",
        description:
          "Sprawdź podane informacje o wyzwaniach biznesowych i spróbuj ponownie",
      },
      server: {
        title: "Błąd Serwera",
        description: "Wystąpił błąd podczas aktualizacji wyzwań biznesowych",
      },
      unknown: {
        title: "Nieznany Błąd",
        description:
          "Wystąpił nieoczekiwany błąd z aktualizacją wyzwań biznesowych",
      },
      network: {
        title: "Błąd Sieci",
        description: "Nie można połączyć się z usługą wyzwań biznesowych",
      },
      forbidden: {
        title: "Dostęp Zabroniony",
        description:
          "Nie masz uprawnień do modyfikacji danych wyzwań biznesowych",
      },
      notFound: {
        title: "Dane Nie Znalezione",
        description: "Dane wyzwań biznesowych nie zostały znalezione",
      },
      conflict: {
        title: "Konflikt Danych",
        description:
          "Dane wyzwań biznesowych są w konflikcie z istniejącymi informacjami",
      },
      unsavedChanges: {
        title: "Niezapisane Zmiany",
        description: "Masz niezapisane zmiany w swoich wyzwaniach biznesowych",
      },
    },
    success: {
      title: "Wyzwania Zaktualizowane",
      description: "Twoje wyzwania biznesowe zostały pomyślnie zaktualizowane",
      message: "Wyzwania biznesowe zostały pomyślnie zaktualizowane",
    },
  },

  // Response field translations
  response: {
    currentChallenges: "Aktualne wyzwania biznesowe",
    marketingChallenges: "Wyzwania marketingowe",
    operationalChallenges: "Wyzwania operacyjne",
    financialChallenges: "Wyzwania finansowe",
    technicalChallenges: "Wyzwania techniczne",
    biggestChallenge: "Największe wyzwanie",
    challengeImpact: "Wpływ wyzwań",
    previousSolutions: "Wcześniej próbowane rozwiązania",
    resourceConstraints: "Ograniczenia zasobów",
    budgetConstraints: "Ograniczenia budżetowe",
    timeConstraints: "Ograniczenia czasowe",
    supportNeeded: "Potrzebne wsparcie",
    priorityAreas: "Obszary priorytetowe",
    additionalNotes: "Dodatkowe uwagi",
    message: "Wiadomość odpowiedzi",
    completionStatus: "Status ukończenia sekcji",
  },

  // Enum translations
  enums: {
    challengeCategory: {
      marketing: "Marketing",
      operations: "Operacje",
      financial: "Finansowe",
      technical: "Techniczne",
      humanResources: "Zasoby ludzkie",
      customerService: "Obsługa klienta",
      productDevelopment: "Rozwój produktu",
      sales: "Sprzedaż",
      strategy: "Strategia",
      compliance: "Zgodność",
    },
    challengeSeverity: {
      low: "Niski",
      medium: "Średni",
      high: "Wysoki",
      critical: "Krytyczny",
    },
    resourceConstraint: {
      budget: "Budżet",
      time: "Czas",
      staff: "Personel",
      skills: "Umiejętności",
      technology: "Technologia",
      equipment: "Sprzęt",
      space: "Przestrzeń",
      knowledge: "Wiedza",
    },
    supportArea: {
      strategy: "Strategia",
      marketing: "Marketing",
      technology: "Technologia",
      operations: "Operacje",
      finance: "Finanse",
      humanResources: "Zasoby ludzkie",
      legal: "Prawne",
      training: "Szkolenia",
      consulting: "Doradztwo",
      implementation: "Wdrożenie",
    },
  },

  // Individual completion status field translations
  isComplete: "Wyzwania biznesowe ukończone",
  completedFields: "Ukończone pola wyzwań",
  totalFields: "Całkowita liczba pól wyzwań",
  completionPercentage: "Procent ukończenia wyzwań",
  missingRequiredFields: "Brakujące wymagane pola wyzwań",
};
