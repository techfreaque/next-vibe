import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  creditPricing: {
    badge: "Elastyczne ceny",
    title: "Wybierz swój plan",
    subtitle: "Płać tylko za to, czego używasz, lub wybierz nielimitowany",
    subscription: {
      badge: "Najpopularniejszy",
      title: "Nielimitowany",
      price: "€10",
      perMonth: "/miesiąc",
      description: "Najlepsza wartość dla zaawansowanych użytkowników",
      expiryInfo: "Rozliczane miesięcznie, anuluj w dowolnym momencie",
      features: {
        credits: "Nielimitowane wiadomości",
        allModels: "Wszystkie 40+ modeli AI",
        allFeatures: "Wszystkie funkcje wliczone",
        cancel: "Anuluj w dowolnym momencie",
      },
      button: "Subskrybuj teraz",
    },
    creditPack: {
      badge: "Płać za użycie",
      title: "Pakiet kredytowy",
      price: "€5",
      description: "Idealny do okazjonalnego użytku",
      permanentInfo: "Kredyty nigdy nie wygasają",
      quantityLabel: "Liczba pakietów",
      pricePerPack: "€5 za pakiet",
      features: {
        credits: "Pakiet kredytowy €5",
        allModels: "Wszystkie modele AI wliczone",
        allFeatures: "Wszystkie funkcje wliczone",
        multiple: "Kup wiele pakietów",
      },
      button: "Kup kredyty",
      buttonPlural: "Kup {{quantity}} pakietów kredytowych",
    },
    common: {
      processing: "Przetwarzanie...",
    },
    costTransparency: {
      title: "Przejrzystość kosztów",
      card: {
        title: "Koszty modeli",
        description:
          "Zobacz dokładnie, ile kredytów kosztuje każdy model AI na wiadomość",
      },
      table: {
        provider: "Dostawca",
        model: "Model",
        costPerMessage: "Koszt na wiadomość",
        free: "Darmowy",
        credits: "{{count}} kredyt",
        creditsPlural: "{{count}} kredytów",
        parameters: "{{count}} parametrów",
        features: "Funkcje",
        braveSearch: "Wyszukiwanie Brave",
        braveSearchCost: "1 kredyt",
        tts: "Tekst na mowę",
        ttsCost: "1 kredyt",
        stt: "Mowa na tekst",
        sttCost: "1 kredyt",
      },
    },
    calculator: {
      title: "Kalkulator kredytów",
      card: {
        title: "Oszacuj swoje użycie",
        description:
          "Oblicz, ile kredytów będziesz potrzebować na podstawie swojego użycia",
      },
      messagesLabel: "Wiadomości miesięcznie",
      estimates: {
        free: "Darmowy poziom (10 wiadomości/dzień)",
        freeCredits: "€0",
        basic: "Modele podstawowe (GPT-3.5, Claude Haiku)",
        basicCredits: "~€{{count}}",
        pro: "Modele Pro (GPT-4, Claude Sonnet)",
        proCredits: "~€{{count}}",
        premium: "Modele Premium (GPT-4 Turbo, Claude Opus)",
        premiumCredits: "~€{{count}}",
      },
      recommendation: {
        title: "Nasza rekomendacja",
        freeTier:
          "Zacznij od naszego darmowego poziomu, aby wypróbować platformę!",
        subscription:
          "Subskrybuj nielimitowane wiadomości (€10/miesiąc pokrywa do €{{credits}} użycia)",
        additionalPacks:
          "Subskrybuj + kup {{packs}} dodatkowy(ch) pakiet(ów) kredytowych dla intensywnego użycia",
      },
    },
    freeTier: {
      title: "Wypróbuj najpierw za darmo!",
      description:
        "Otrzymaj 10 darmowych wiadomości dziennie, aby poznać wszystkie nasze modele AI. Nie wymaga karty kredytowej.",
      button: "Rozpocznij darmowy okres próbny",
    },
    buttons: {
      upgrade: "Ulepsz",
      downgrade: "Obniż",
      currentPlan: "Aktualny plan",
      processing: "Przetwarzanie...",
    },
  },
  comparison: {
    title: "Proste, przejrzyste ceny",
    subtitle: "Wybierz plan, który najlepiej do Ciebie pasuje",
    monthly: "Miesięcznie",
    annually: "Rocznie",
    customNote:
      "Potrzebujesz niestandardowego planu? Skontaktuj się z nami w sprawie cen dla firm.",
  },
  plans: {
    title: "Wybierz swój plan",
    subtitle: "Wybierz idealny plan dla swoich potrzeb",
    badge: "Popularny",
    flexibleBadge: "Elastyczny",
    supportBadge: "Wsparcie 24/7",
    guaranteeBadge: "Gwarancja zwrotu pieniędzy",
    orSeparator: "lub",
    customSolutionText: "Potrzebujesz niestandardowego rozwiązania?",
    tailoredPackageText:
      "Możemy stworzyć dostosowany pakiet dla Twoich konkretnych potrzeb",
    monthly: "Miesięcznie",
    annually: "Rocznie",
    savePercent: "Oszczędź {{percent}}%",
    perMonth: "/miesiąc",
    contactUsLink: "Skontaktuj się z nami",
    STARTER: {
      name: "Darmowy",
      price: "€0",
      description: "Idealny do wypróbowania Unbottled.ai",
      cta: "Zacznij teraz",
      features: [
        "10 wiadomości dziennie",
        "Dostęp do wszystkich 40+ modeli AI",
        "Podstawowe zarządzanie folderami",
        "Persony społeczności",
      ],
    },
  },
  currentPlan: {
    badge: "Aktualny plan",
  },
  upgrade: {
    processing: "Przetwarzanie ulepszenia...",
  },
  subscribe: {
    processing: "Przetwarzanie subskrypcji...",
  },
  downgrade: {
    title: "Obniż plan",
    description: "Czy na pewno chcesz obniżyć swój plan?",
    nextCycle:
      "Zmiany wejdą w życie na koniec bieżącego okresu rozliczeniowego",
  },
};
