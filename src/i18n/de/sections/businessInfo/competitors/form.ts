import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/businessInfo/competitors/form";

export const formTranslations: typeof EnglishFormTranslations = {
  title: "Wettbewerbsanalyse",
  description: "Analysieren Sie Ihre Marktposition und Wettbewerbslandschaft.",
  validation: {
    competitorsRequired: "Bitte identifizieren Sie Ihre Hauptwettbewerber",
  },
  success: {
    title: "Wettbewerbsanalyse erfolgreich aktualisiert",
    description: "Ihre Wettbewerbsanalyse wurde gespeichert.",
  },
  error: {
    title: "Fehler beim Speichern der Wettbewerbsanalyse",
    description: "Ihre Wettbewerbsanalyse konnte nicht aktualisiert werden",
    validation: {
      title: "Wettbewerbsanalyse-Validierung fehlgeschlagen",
      description:
        "Bitte überprüfen Sie Ihre Wettbewerbsanalyse und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Zugriff verweigert",
      description:
        "Sie haben keine Berechtigung, die Wettbewerbsanalyse zu aktualisieren",
    },
    server: {
      title: "Server-Fehler",
      description:
        "Wettbewerbsanalyse konnte aufgrund eines Server-Fehlers nicht gespeichert werden",
    },
    unknown: {
      title: "Unerwarteter Fehler",
      description:
        "Ein unerwarteter Fehler ist beim Speichern der Wettbewerbsanalyse aufgetreten",
    },
  },
  get: {
    success: {
      title: "Wettbewerbsanalyse erfolgreich geladen",
      description: "Ihre Wettbewerbsanalyse-Informationen wurden abgerufen",
    },
  },
  identification: {
    title: "Wettbewerber-Identifikation",
    description: "Wer sind Ihre Hauptwettbewerber?",
  },
  analysis: {
    title: "Wettbewerbsanalyse",
    description: "Analysieren Sie Ihre Position im Vergleich zu Wettbewerbern",
  },
  sections: {
    identification: {
      title: "Wettbewerber-Identifikation",
      description: "Wer sind Ihre Hauptwettbewerber?",
    },
    analysis: {
      title: "Wettbewerbsanalyse",
      description:
        "Analysieren Sie Ihre Position im Vergleich zu Wettbewerbern",
    },
  },
  fields: {
    mainCompetitors: {
      label: "Hauptwettbewerber",
      placeholder: "Listen Sie Ihre 3-5 Hauptwettbewerber auf...",
      description: "Ihre primären direkten Wettbewerber",
    },
    competitors: {
      label: "Alle Wettbewerber",
      placeholder:
        "Listen Sie alle relevanten Wettbewerber in Ihrem Markt auf...",
      description: "Umfassende Liste der Wettbewerber",
    },
    competitiveAdvantages: {
      label: "Wettbewerbsvorteile",
      placeholder: "Welche Vorteile haben Sie gegenüber Wettbewerbern?",
      description: "Ihre Stärken im Vergleich zu Wettbewerbern",
    },
    competitiveDisadvantages: {
      label: "Wettbewerbsnachteile",
      placeholder: "Wo haben Wettbewerber Vorteile gegenüber Ihnen?",
      description: "Bereiche, in denen Wettbewerber stärker sind",
    },
    marketPosition: {
      label: "Marktposition",
      placeholder: "Wie positionieren Sie sich im Markt?",
      description: "Ihre aktuelle Position im Marktplatz",
    },
    differentiators: {
      label: "Schlüssel-Differenzierungsmerkmale",
      placeholder: "Was macht Sie einzigartig gegenüber Wettbewerbern?",
      description: "Was Sie von der Konkurrenz abhebt",
    },
    competitorStrengths: {
      label: "Wettbewerber-Stärken",
      placeholder: "Was sind die Hauptstärken Ihrer Wettbewerber?",
      description: "Schlüsselstärken Ihrer Hauptwettbewerber",
    },
    competitorWeaknesses: {
      label: "Wettbewerber-Schwächen",
      placeholder: "Welche Schwächen haben Ihre Wettbewerber?",
      description: "Bereiche, in denen Ihre Wettbewerber verwundbar sind",
    },
    marketGaps: {
      label: "Marktlücken",
      placeholder: "Welche Lücken existieren im Markt?",
      description:
        "Möglichkeiten, die von Wettbewerbern nicht adressiert werden",
    },
    additionalNotes: {
      label: "Zusätzliche Notizen",
      placeholder: "Weitere Erkenntnisse zu Ihrer Wettbewerbslandschaft...",
      description: "Zusätzliche Wettbewerbsanalyse-Notizen",
    },
  },
  additional: {
    title: "Zusätzliche Erkenntnisse",
    description: "Weitere wettbewerbsbezogene Erkenntnisse oder Beobachtungen",
  },
  submit: {
    save: "Wettbewerbsanalyse speichern",
    saving: "Speichern...",
  },
};
