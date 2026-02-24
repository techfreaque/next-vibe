export const translations = {
  selector: {
    bestForFilter: "Najlepszy dla tego filtra",
    setupRequired: "Wymagana konfiguracja",
    providerUnconfigured: "Klucz API dostawcy nie skonfigurowany",
    addEnvKey: "Dodaj do .env",
    noMatchingModels: "Żadne modele nie pasują do filtrów",
    noModelsWarning:
      "Żadne modele nie pasują do tych filtrów. Dostosuj ustawienia.",
    allModelsCount: "{{count}} dostępnych modeli",
    filteredModelsCount: "{{count}} pasujących modeli",
    showAllModels: "Pokaż wszystkie {{count}} modeli",
    showFiltered: "Pokaż przefiltrowane",
    creditsExact: "{{cost}} kredytów",
    creditsSingle: "1 kredyt",
    free: "Bezpłatny",
    autoSelectedModel: "Auto-wybrany:",
    manualSelectedModel: "Wybrany:",
    characterSelectedModel: "Model postaci:",
    selectModelBelow: "Wybierz model poniżej",
    sortBy: "Sortuj według",
    showLess: "Pokaż mniej",
    showMore: "Pokaż {{count}} więcej",
    showLegacyModels: "Pokaż {{count}} Modeli Legacy",
    autoMode: "Automatyczny wybór",
    manualMode: "Wybór ręczny",
    characterMode: "Domyślny postaci",
    autoModeDescription:
      "Automatycznie wybiera najlepszy model według Twoich preferencji",
    manualModeDescription: "Wybierz dowolny model samodzielnie",
    characterBasedModeDescription:
      "Używa modelu, do którego ta postać została zaprojektowana",
  },
  tiers: {
    intelligence: {
      quick: "Szybki",
      smart: "Inteligentny",
      brilliant: "Genialny",
      quickDesc: "Szybki i wydajny",
      smartDesc: "Zrównoważona jakość",
      brilliantDesc: "Głębokie rozumowanie",
    },
    price: {
      cheap: "Tani",
      standard: "Standardowy",
      premium: "Premium",
      cheapDesc: "0-3 kredytów za wiadomość",
      standardDesc: "3-9 kredytów za wiadomość",
      premiumDesc: "9+ kredytów za wiadomość",
    },
    content: {
      mainstream: "Mainstream",
      open: "Otwarty",
      uncensored: "Niecenzurowany",
      mainstreamDesc: "Standardowe bezpieczeństwo",
      openDesc: "Mniej ograniczeń",
      uncensoredDesc: "Brak ograniczeń",
    },
    speed: {
      fast: "Szybki",
      balanced: "Zrównoważony",
      thorough: "Dokładny",
      fastDesc: "Szybkie odpowiedzi",
      balancedDesc: "Dobra równowaga",
      thoroughDesc: "Szczegółowa analiza",
    },
  },
  sort: {
    intelligence: "Inteligencja",
    price: "Cena",
    speed: "Prędkość",
    content: "Treść",
  },
  ranges: {
    intelligenceRange: {
      minLabel: "Min. inteligencja",
      maxLabel: "Maks. inteligencja",
    },
    priceRange: {
      minLabel: "Min. cena",
      maxLabel: "Maks. cena",
    },
    contentRange: {
      minLabel: "Min. treść",
      maxLabel: "Maks. treść",
    },
    speedRange: {
      minLabel: "Min. prędkość",
      maxLabel: "Maks. prędkość",
    },
  },
  credits: {
    credit: "{{count}} kredyt",
    credits: "{{count}} kredytów",
  },
  creditDisplay: {
    tokenBased: {
      header: "Koszt za wiadomość",
      costRangeLabel: "Typowy zakres:",
      costRangeValue: "{{min}} - {{max}} kredytów",
      examplesLabel: "Przykłady:",
      examples: {
        short: "Krótka rozmowa",
        medium: "Średnia rozmowa",
        long: "Długa rozmowa",
      },
      triggersCompacting: "⚡ Aktywuje kompresję",
      tokensCount: "{{count}} tokenów",
      explanation:
        "AI przetwarza całą historię rozmowy przy każdej wiadomości. Dłuższe rozmowy kosztują więcej, ponieważ jest więcej kontekstu do przetworzenia.",
      compactingLabel: "✨ Auto-kompresja:",
      compactingExplanation:
        " Przy {{threshold}} tokenów starsze wiadomości są automatycznie streszczane, aby zmniejszyć koszty przy zachowaniu kontekstu.",
    },
    fixed: {
      title: "Cennik dla {{model}}",
      freeDescription: "Ten model jest całkowicie darmowy, bez kosztów.",
      fixedDescription:
        "Ten model ma stały koszt na wiadomość, niezależnie od długości.",
      costPerMessage: "Koszt za wiadomość:",
      freeExplanation: "To darmowy model bez ograniczeń użytkowania.",
      freeHighlight: "Idealny do testowania i eksperymentowania.",
      simpleLabel: "Prosty cennik:",
      simpleExplanation:
        " Każda wiadomość kosztuje tyle samo, niezależnie czy krótka czy długa. Nie trzeba liczyć tokenów.",
    },
    creditValue: "1 kredyt = {{value}}",
  },
} as const;
