import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Analityka",
  tags: {
    performance: "Wydajność",
    seo: "SEO",
  },

  enums: {
    metric: {
      lcp: "Largest Contentful Paint",
      inp: "Interaction to Next Paint",
      cls: "Cumulative Layout Shift",
      ttfb: "Time to First Byte",
      fcp: "First Contentful Paint",
    },
    rating: {
      good: "Dobrze",
      needsImprovement: "Do poprawy",
      poor: "Słabo",
    },
    device: {
      mobile: "Mobile",
      desktop: "Desktop",
    },
    pageType: {
      storyHome: "Strona główna",
      storyPage: "Strona story",
      blogIndex: "Lista wpisów",
      blogPost: "Wpis na blogu",
      storyCompare: "Porównanie",
      models: "Lista modeli",
      modelDetail: "Strona modelu",
      modelCompare: "Model kontra model",
      modelChangelog: "Zmiany modeli",
      skill: "Strona skilla",
      skills: "Lista skilli",
      docs: "Dokumentacja",
      help: "Pomoc",
      pricing: "Cennik",
      create: "Tworzenie mediów",
      threads: "Czat",
      account: "Konto",
      tools: "Narzędzia",
      other: "Inne",
    },
  },

  fields: {
    metric: "Metryka",
    value: "Wartość",
    rating: "Ocena",
    navigationType: "Typ nawigacji",
    path: "Ścieżka strony",
    device: "Urządzenie",
    metrics: "Pomiary",
    days: "Dni",
    pageType: "Typ strony",
    samples: "Pomiary",
    p75: "p75",
    goodShare: "Dobrze",
    poorShare: "Słabo",
  },

  post: {
    title: "Zgłoś Web Vitals",
    titleShort: "Zgłoś vitals",
    description:
      "Zapisuje prawdziwe Core Web Vitals (LCP, INP, CLS, TTFB, FCP) jednego wyświetlenia strony.",
    recorded: "Zapisano",
    success: {
      title: "Vitals zapisane",
      description: "Pomiary zostały zapisane.",
    },
  },

  get: {
    title: "Web Vitals",
    titleShort: "Web Vitals",
    description:
      "Core Web Vitals prawdziwych użytkowników dla każdego typu strony: p75 i udział dobrych oraz słabych wizyt.",
    empty: "Brak pomiarów w tym okresie.",
    since: "Od",
    total: "Pomiary",
    targets:
      "Cele dla p75: LCP poniżej 2,5 s, INP poniżej 200 ms, CLS poniżej 0,1.",
    success: {
      title: "Web Vitals wczytane",
      description: "Pomiary prawdziwych użytkowników według typu strony.",
    },
  },

  errors: {
    validation: {
      title: "Nieprawidłowe pomiary",
      description: "Sprawdź wysłane wartości.",
    },
    network: {
      title: "Błąd sieci",
      description: "Żądanie nie dotarło do serwera.",
    },
    unauthorized: {
      title: "Wymagane logowanie",
      description: "Zaloguj się, aby zobaczyć raport.",
    },
    forbidden: {
      title: "Brak dostępu",
      description: "Tylko dla adminów.",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Nic nie znaleziono.",
    },
    server: {
      title: "Błąd serwera",
      description: "Nie udało się przetworzyć pomiarów.",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Stało się coś nieoczekiwanego.",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Najpierw zapisz lub odrzuć zmiany.",
    },
    conflict: {
      title: "Konflikt",
      description: "Dane zmieniły się w międzyczasie.",
    },
  },
};
