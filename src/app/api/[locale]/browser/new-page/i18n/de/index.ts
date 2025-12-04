import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Neue Seite",
  description: "Eine neue Seite erstellen",
  form: {
    label: "Neue Seite",
    description: "Eine neue Browser-Seite erstellen und eine URL laden",
    fields: {
      url: {
        label: "URL",
        description: "URL, die in der neuen Seite geladen werden soll",
        placeholder: "URL eingeben",
      },
      timeout: {
        label: "Zeitlimit",
        description: "Maximale Wartezeit in Millisekunden (0 für Standard)",
        placeholder: "Zeitlimit eingeben",
      },
    },
  },
  response: {
    success: "Neue Seite erfolgreich erstellt",
    result: "Ergebnis der Seitenerstellung",
    error: "Fehlermeldung",
    executionId: "Ausführungs-ID zur Verfolgung",
  },
  errors: {
    validation: { title: "Validierungsfehler", description: "Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut" },
    network: { title: "Netzwerkfehler", description: "Ein Netzwerkfehler ist beim Erstellen der neuen Seite aufgetreten" },
    unauthorized: { title: "Nicht autorisiert", description: "Sie sind nicht berechtigt, neue Seiten zu erstellen" },
    forbidden: { title: "Verboten", description: "Seitenerstellung ist verboten" },
    notFound: { title: "Nicht gefunden", description: "Die angeforderte Ressource wurde nicht gefunden" },
    serverError: { title: "Serverfehler", description: "Ein interner Serverfehler ist beim Erstellen der neuen Seite aufgetreten" },
    unknown: { title: "Unbekannter Fehler", description: "Ein unbekannter Fehler ist beim Erstellen der neuen Seite aufgetreten" },
    unsavedChanges: { title: "Nicht gespeicherte Änderungen", description: "Sie haben nicht gespeicherte Änderungen, die verloren gehen können" },
    conflict: { title: "Konflikt", description: "Ein Konflikt ist beim Erstellen der neuen Seite aufgetreten" },
  },
  success: {
    title: "Neue Seite erfolgreich erstellt",
    description: "Die neue Seite wurde erfolgreich erstellt",
  },
};
