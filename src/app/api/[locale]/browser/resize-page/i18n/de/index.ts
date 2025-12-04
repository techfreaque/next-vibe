import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Seite skalieren",
  description: "Das Fenster der ausgewählten Seite skalieren",
  form: {
    label: "Seite skalieren",
    description: "Seite auf angegebene Abmessungen skalieren",
    fields: {
      width: {
        label: "Breite",
        description: "Seitenbreite in Pixeln",
        placeholder: "Breite eingeben",
      },
      height: {
        label: "Höhe",
        description: "Seitenhöhe in Pixeln",
        placeholder: "Höhe eingeben",
      },
    },
  },
  response: {
    success: "Seitenskalierung erfolgreich",
    result: "Ergebnis der Seitenskalierung",
    error: "Fehlermeldung",
    executionId: "Ausführungs-ID zur Verfolgung",
  },
  errors: {
    validation: { title: "Validierungsfehler", description: "Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut" },
    network: { title: "Netzwerkfehler", description: "Ein Netzwerkfehler ist beim Skalieren der Seite aufgetreten" },
    unauthorized: { title: "Nicht autorisiert", description: "Sie sind nicht berechtigt, Seiten zu skalieren" },
    forbidden: { title: "Verboten", description: "Seitenskalierung ist verboten" },
    notFound: { title: "Nicht gefunden", description: "Die angeforderte Ressource wurde nicht gefunden" },
    serverError: { title: "Serverfehler", description: "Ein interner Serverfehler ist beim Skalieren der Seite aufgetreten" },
    unknown: { title: "Unbekannter Fehler", description: "Ein unbekannter Fehler ist beim Skalieren der Seite aufgetreten" },
    unsavedChanges: { title: "Nicht gespeicherte Änderungen", description: "Sie haben nicht gespeicherte Änderungen, die verloren gehen können" },
    conflict: { title: "Konflikt", description: "Ein Konflikt ist beim Skalieren der Seite aufgetreten" },
  },
  success: {
    title: "Seite erfolgreich skaliert",
    description: "Die Seite wurde erfolgreich skaliert",
  },
};
