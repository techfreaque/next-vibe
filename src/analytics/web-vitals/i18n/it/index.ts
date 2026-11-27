import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Analisi",
  tags: {
    performance: "Prestazioni",
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
      good: "Buono",
      needsImprovement: "Da migliorare",
      poor: "Scarso",
    },
    device: {
      mobile: "Mobile",
      desktop: "Desktop",
    },
    pageType: {
      storyHome: "Home",
      storyPage: "Pagina story",
      blogIndex: "Elenco blog",
      blogPost: "Articolo del blog",
      storyCompare: "Pagina confronto",
      models: "Elenco modelli",
      modelDetail: "Pagina modello",
      modelCompare: "Modello contro modello",
      modelChangelog: "Changelog modelli",
      skill: "Pagina skill",
      skills: "Elenco skill",
      docs: "Documentazione",
      help: "Aiuto",
      pricing: "Prezzi",
      create: "Creazione media",
      threads: "Chat",
      account: "Account",
      tools: "Strumenti",
      other: "Altro",
    },
  },

  fields: {
    metric: "Metrica",
    value: "Valore",
    rating: "Valutazione",
    navigationType: "Tipo di navigazione",
    path: "Percorso pagina",
    device: "Dispositivo",
    metrics: "Misurazioni",
    days: "Giorni",
    pageType: "Tipo di pagina",
    samples: "Misurazioni",
    p75: "p75",
    goodShare: "Buono",
    poorShare: "Scarso",
  },

  post: {
    title: "Invia Web Vitals",
    titleShort: "Invia vitals",
    description:
      "Salva i Core Web Vitals reali (LCP, INP, CLS, TTFB, FCP) di una visualizzazione di pagina.",
    recorded: "Salvato",
    success: {
      title: "Vitals salvati",
      description: "Le misurazioni sono state salvate.",
    },
  },

  get: {
    title: "Web Vitals",
    titleShort: "Web Vitals",
    description:
      "Core Web Vitals dei visitatori reali per tipo di pagina: p75 e quota di visite buone e scarse.",
    empty: "Nessuna misurazione in questo periodo.",
    since: "Dal",
    total: "Misurazioni",
    targets:
      "Obiettivi al p75: LCP sotto 2,5 s, INP sotto 200 ms, CLS sotto 0,1.",
    success: {
      title: "Web Vitals caricati",
      description: "Misurazioni dei visitatori reali per tipo di pagina.",
    },
  },

  errors: {
    validation: {
      title: "Misurazioni non valide",
      description: "Controlli i valori inviati.",
    },
    network: {
      title: "Errore di rete",
      description: "La richiesta non ha raggiunto il server.",
    },
    unauthorized: {
      title: "Accesso richiesto",
      description: "Acceda per vedere il report.",
    },
    forbidden: {
      title: "Accesso negato",
      description: "Solo per admin.",
    },
    notFound: {
      title: "Non trovato",
      description: "Nessun risultato.",
    },
    server: {
      title: "Errore del server",
      description: "Non è stato possibile elaborare le misurazioni.",
    },
    unknown: {
      title: "Errore sconosciuto",
      description: "Si è verificato un imprevisto.",
    },
    unsavedChanges: {
      title: "Modifiche non salvate",
      description: "Salvi o annulli prima le modifiche.",
    },
    conflict: {
      title: "Conflitto",
      description: "I dati sono cambiati nel frattempo.",
    },
  },
};
