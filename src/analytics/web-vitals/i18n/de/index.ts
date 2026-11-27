import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Analytik",
  tags: {
    performance: "Performance",
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
      good: "Gut",
      needsImprovement: "Verbesserungsbedarf",
      poor: "Schlecht",
    },
    device: {
      mobile: "Mobil",
      desktop: "Desktop",
    },
    pageType: {
      storyHome: "Startseite",
      storyPage: "Story-Seite",
      blogIndex: "Blog-Übersicht",
      blogPost: "Blogartikel",
      storyCompare: "Vergleichsseite",
      models: "Modellliste",
      modelDetail: "Modellseite",
      modelCompare: "Modellvergleich",
      modelChangelog: "Modell-Changelog",
      skill: "Skill-Seite",
      skills: "Skill-Liste",
      docs: "Doku",
      help: "Hilfe",
      pricing: "Preise",
      create: "Medien erstellen",
      threads: "Chat",
      account: "Konto",
      tools: "Tools",
      other: "Sonstige",
    },
  },

  fields: {
    metric: "Metrik",
    value: "Wert",
    rating: "Bewertung",
    navigationType: "Navigationsart",
    path: "Seitenpfad",
    device: "Gerät",
    metrics: "Messwerte",
    days: "Tage",
    pageType: "Seitentyp",
    samples: "Messungen",
    p75: "p75",
    goodShare: "Gut",
    poorShare: "Schlecht",
  },

  post: {
    title: "Web Vitals melden",
    titleShort: "Vitals melden",
    description:
      "Speichert echte Core Web Vitals (LCP, INP, CLS, TTFB, FCP) eines Seitenaufrufs.",
    recorded: "Gespeichert",
    success: {
      title: "Vitals gespeichert",
      description: "Die Messwerte sind gespeichert.",
    },
  },

  get: {
    title: "Web Vitals",
    titleShort: "Web Vitals",
    description:
      "Core Web Vitals echter Besucher pro Seitentyp: p75 und Anteil guter und schlechter Aufrufe.",
    empty: "Für diesen Zeitraum liegen noch keine Messwerte vor.",
    since: "Seit",
    total: "Messungen",
    targets: "Ziele bei p75: LCP unter 2,5 s, INP unter 200 ms, CLS unter 0,1.",
    success: {
      title: "Web Vitals geladen",
      description: "Messwerte echter Besucher pro Seitentyp.",
    },
  },

  errors: {
    validation: {
      title: "Ungültige Messwerte",
      description: "Prüfen Sie die gesendeten Werte.",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Die Anfrage hat den Server nicht erreicht.",
    },
    unauthorized: {
      title: "Anmeldung erforderlich",
      description: "Melden Sie sich an, um den Bericht zu sehen.",
    },
    forbidden: {
      title: "Kein Zugriff",
      description: "Nur für Admins.",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Nichts gefunden.",
    },
    server: {
      title: "Serverfehler",
      description: "Die Messwerte konnten nicht verarbeitet werden.",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Etwas Unerwartetes ist passiert.",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Speichern oder verwerfen Sie zuerst Ihre Änderungen.",
    },
    conflict: {
      title: "Konflikt",
      description: "Die Daten haben sich zwischenzeitlich geändert.",
    },
  },
};
