import type { fieldsTranslations as EnglishFieldsTranslations } from "../../../../../en/sections/businessInfo/audience/form/fields";

export const fieldsTranslations: typeof EnglishFieldsTranslations = {
  targetAudience: {
    label: "Zielgruppe",
    placeholder: "Beschreiben Sie Ihre idealen Kunden...",
    description: "Eine detaillierte Beschreibung Ihrer Zielgruppe",
  },
  ageRange: {
    label: "Altersbereich",
    placeholder: "z.B. 25-45",
    description: "Der Altersbereich Ihrer Zielgruppe",
  },
  gender: {
    label: "Geschlecht",
    placeholder: "Zielgeschlecht auswählen",
    description: "Geschlechterverteilung Ihrer Zielgruppe",
    options: {
      "all": "Alle Geschlechter",
      "male": "Männlich",
      "female": "Weiblich",
      "non-binary": "Nicht-binär",
      "other": "Andere",
    },
  },
  location: {
    label: "Standort",
    placeholder: "z.B. Deutschland, Europa",
    description: "Geografischer Standort Ihrer Zielgruppe",
  },
  income: {
    label: "Einkommensniveau",
    placeholder: "z.B. 40.000€-80.000€",
    description: "Einkommensbereich Ihrer Zielgruppe",
  },
  interests: {
    label: "Interessen",
    placeholder: "Wofür interessieren sie sich?",
    description: "Hauptinteressen und Hobbys Ihrer Zielgruppe",
  },
  values: {
    label: "Werte",
    placeholder: "Was ist ihnen wichtig?",
    description: "Kernwerte, die Ihrer Zielgruppe wichtig sind",
  },
  painPoints: {
    label: "Schmerzpunkte",
    placeholder: "Welche Probleme haben sie?",
    description: "Hauptherausforderungen, die Ihre Zielgruppe erlebt",
  },
  motivations: {
    label: "Motivation",
    placeholder: "Was motiviert sie?",
    description: "Was Ihre Zielgruppe antreibt und motiviert",
  },
  lifestyle: {
    label: "Lebensstil",
    placeholder: "Beschreiben Sie ihren Lebensstil...",
    description: "Lebensstil-Merkmale Ihrer Zielgruppe",
  },
  onlineBehavior: {
    label: "Online-Verhalten",
    placeholder: "Wie verhalten sie sich online?",
    description: "Digitale Gewohnheiten und Online-Verhaltensmuster",
  },
  purchaseBehavior: {
    label: "Kaufverhalten",
    placeholder: "Wie treffen sie Kaufentscheidungen?",
    description: "Kaufmuster und Entscheidungsprozess",
  },
  preferredChannels: {
    label: "Bevorzugte Kanäle",
    placeholder: "Wo verbringen sie Zeit online?",
    description: "Bevorzugte Kommunikations- und Medienkanäle",
  },
  additionalNotes: {
    label: "Zusätzliche Notizen",
    placeholder: "Weitere Informationen zu Ihrer Zielgruppe...",
    description: "Zusätzliche Erkenntnisse über Ihre Zielgruppe",
  },
};
