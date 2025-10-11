import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/businessInfo/brand/form";

export const formTranslations: typeof EnglishFormTranslations = {
  title: "Markenidentität",
  description:
    "Definieren Sie Ihre Markenwerte, Persönlichkeit und visuellen Richtlinien.",
  validation: {
    brandDescriptionRequired: "Markenbeschreibung ist erforderlich",
  },
  success: {
    title: "Markenidentität erfolgreich aktualisiert",
    description: "Ihre Markenidentität wurde gespeichert.",
  },
  error: {
    title: "Fehler beim Speichern der Markenidentität",
    description: "Ihre Markenidentität konnte nicht aktualisiert werden",
    validation: {
      title: "Marken-Validierung fehlgeschlagen",
      description:
        "Bitte überprüfen Sie Ihre Marken-Informationen und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Zugriff verweigert",
      description:
        "Sie haben keine Berechtigung, die Markenidentität zu aktualisieren",
    },
    server: {
      title: "Server-Fehler",
      description:
        "Markenidentität konnte aufgrund eines Server-Fehlers nicht gespeichert werden",
    },
    unknown: {
      title: "Unerwarteter Fehler",
      description:
        "Ein unerwarteter Fehler ist beim Speichern der Markenidentität aufgetreten",
    },
  },
  get: {
    success: {
      title: "Markenidentität erfolgreich geladen",
      description: "Ihre Markenidentitäts-Informationen wurden abgerufen",
    },
  },
  identity: {
    title: "Markenidentität",
    description: "Kernelemente, die Ihre Marke definieren",
  },
  personality: {
    title: "Markenpersönlichkeit",
    description: "Wie Ihre Marke kommuniziert und sich anfühlt",
  },
  sections: {
    identity: {
      title: "Markenidentität",
      description: "Kernelemente, die Ihre Marke definieren",
    },
    personality: {
      title: "Markenpersönlichkeit",
      description: "Wie Ihre Marke kommuniziert und sich anfühlt",
    },
  },
  fields: {
    brandDescription: {
      label: "Markenbeschreibung",
      placeholder:
        "Beschreiben Sie, wofür Ihre Marke steht und was sie repräsentiert...",
      description: "Eine umfassende Beschreibung Ihrer Marke",
    },
    brandMission: {
      label: "Markenmission",
      placeholder: "Was ist die Mission und der Zweck Ihrer Marke?",
      description: "Die Kernmission und der Zweck Ihrer Marke",
    },
    brandVision: {
      label: "Markenvision",
      placeholder: "Was ist Ihre langfristige Vision für die Marke?",
      description: "Die langfristige Vision und Bestrebungen Ihrer Marke",
    },
    brandValues: {
      label: "Markenwerte",
      placeholder: "Welche Kernwerte repräsentiert Ihre Marke?",
      description: "Die grundlegenden Werte, für die Ihre Marke steht",
    },
    brandPersonality: {
      label: "Markenpersönlichkeit",
      placeholder: "Wie würden Sie die Persönlichkeit Ihrer Marke beschreiben?",
      description: "Die Persönlichkeitsmerkmale, die Ihre Marke verkörpert",
    },
    brandVoice: {
      label: "Markenstimme",
      placeholder: "Wie spricht Ihre Marke zu ihrer Zielgruppe?",
      description: "Der Ton und Stil der Kommunikation Ihrer Marke",
    },
    brandTone: {
      label: "Markenton",
      placeholder: "Welchen Ton sollte Ihre Markenkommunikation verwenden?",
      description: "Der spezifische Ton für die Botschaften Ihrer Marke",
    },
    brandColors: {
      label: "Markenfarben",
      placeholder:
        "Welche Farben repräsentieren Ihre Marke? (z.B. #FF5733, Blau, etc.)",
      description: "Ihre Markenfarbpalette und Farbschema",
    },
    brandFonts: {
      label: "Marken-Schriftarten",
      placeholder:
        "Welche Schriftarten verwendet Ihre Marke? (z.B. Arial, Helvetica, etc.)",
      description: "Typografie und Schriftauswahl für Ihre Marke",
    },
    logoDescription: {
      label: "Logo-Beschreibung",
      placeholder: "Beschreiben Sie Ihr Logo-Design, Stil und Bedeutung...",
      description:
        "Details über das Logo und die visuelle Identität Ihrer Marke",
    },
    visualStyle: {
      label: "Visueller Stil",
      placeholder:
        "Beschreiben Sie den visuellen Stil und die Ästhetik Ihrer Marke...",
      description:
        "Der visuelle Designansatz und die Stilrichtlinien Ihrer Marke",
    },
    brandPromise: {
      label: "Markenversprechen",
      placeholder: "Welches Versprechen gibt Ihre Marke den Kunden?",
      description:
        "Die Verpflichtung, die Ihre Marke gegenüber ihrer Zielgruppe eingeht",
    },
    brandDifferentiators: {
      label: "Marken-Differenzierungsmerkmale",
      placeholder:
        "Was macht Ihre Marke einzigartig und anders als die Konkurrenz?",
      description:
        "Schlüsselfaktoren, die Ihre Marke von anderen unterscheiden",
    },
    brandGuidelines: {
      label: "Ich habe Markenrichtlinien",
      description:
        "Markieren Sie, wenn Sie bereits Markenrichtlinien oder Styleguides haben",
    },
    hasStyleGuide: {
      label: "Style Guide",
      description: "Ich habe einen umfassenden Style Guide",
    },
    hasLogoFiles: {
      label: "Logo-Dateien",
      description: "Ich habe Logo-Dateien in verschiedenen Formaten",
    },
    hasBrandAssets: {
      label: "Marken-Assets",
      description: "Ich habe andere Marken-Assets (Bilder, Vorlagen, etc.)",
    },
    additionalNotes: {
      label: "Zusätzliche Notizen",
      placeholder: "Weitere Informationen zu Ihrer Markenidentität...",
      description: "Zusätzliche markenbezogene Informationen oder Notizen",
    },
  },
  visual: {
    title: "Visuelle Identität",
    description:
      "Definieren Sie die visuellen Elemente und das Designsystem Ihrer Marke",
  },
  positioning: {
    title: "Markenpositionierung",
    description:
      "Definieren Sie, was Ihre Marke einzigartig und wertvoll macht",
  },
  assets: {
    title: "Marken-Assets",
    description:
      "Verwalten Sie Ihre vorhandenen Markenmaterialien und Richtlinien",
  },
  submit: {
    save: "Markenidentität speichern",
    saving: "Speichern...",
  },
};
