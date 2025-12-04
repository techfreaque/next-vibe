import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Screenshot aufnehmen",
  description: "Nimmt einen Screenshot der Seite oder eines bestimmten Elements auf",
  form: {
    label: "Screenshot aufnehmen",
    description: "Einen Screenshot der Browser-Seite oder eines Elements aufnehmen",
    fields: {
      uid: {
        label: "Element-UID",
        description: "Die UID eines Elements für den Screenshot (weglassen für Screenshot der gesamten Seite)",
        placeholder: "Element-UID eingeben",
      },
      fullPage: {
        label: "Ganze Seite",
        description: "Wenn auf true gesetzt, wird ein Screenshot der gesamten Seite anstelle des aktuell sichtbaren Viewports aufgenommen (inkompatibel mit uid)",
        placeholder: "false",
      },
      format: {
        label: "Format",
        description: "Formattyp zum Speichern des Screenshots (Standard: png)",
        placeholder: "png",
        options: {
          png: "PNG",
          jpeg: "JPEG",
          webp: "WebP",
        },
      },
      quality: {
        label: "Qualität",
        description: "Kompressionsqualität für JPEG- und WebP-Formate (0-100). Höhere Werte bedeuten bessere Qualität, aber größere Dateigrößen. Wird für PNG-Format ignoriert.",
        placeholder: "80",
      },
      filePath: {
        label: "Dateipfad",
        description: "Der absolute Pfad oder ein Pfad relativ zum aktuellen Arbeitsverzeichnis, um den Screenshot zu speichern, anstatt ihn an die Antwort anzuhängen",
        placeholder: "/pfad/zum/screenshot.png",
      },
    },
  },
  response: {
    success: "Screenshot erfolgreich aufgenommen",
    result: "Ergebnis der Screenshot-Aufnahme",
    error: "Fehlermeldung",
    executionId: "Ausführungs-ID zur Verfolgung",
  },
  errors: {
    validation: { title: "Validierungsfehler", description: "Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut" },
    network: { title: "Netzwerkfehler", description: "Ein Netzwerkfehler ist beim Aufnehmen des Screenshots aufgetreten" },
    unauthorized: { title: "Nicht autorisiert", description: "Sie sind nicht berechtigt, Screenshots aufzunehmen" },
    forbidden: { title: "Verboten", description: "Aufnehmen von Screenshots ist verboten" },
    notFound: { title: "Nicht gefunden", description: "Die angeforderte Ressource wurde nicht gefunden" },
    serverError: { title: "Serverfehler", description: "Ein interner Serverfehler ist beim Aufnehmen des Screenshots aufgetreten" },
    unknown: { title: "Unbekannter Fehler", description: "Ein unbekannter Fehler ist beim Aufnehmen des Screenshots aufgetreten" },
    unsavedChanges: { title: "Nicht gespeicherte Änderungen", description: "Sie haben nicht gespeicherte Änderungen, die verloren gehen können" },
    conflict: { title: "Konflikt", description: "Ein Konflikt ist beim Aufnehmen des Screenshots aufgetreten" },
  },
  success: {
    title: "Screenshot erfolgreich aufgenommen",
    description: "Der Screenshot wurde erfolgreich aufgenommen",
  },
};
