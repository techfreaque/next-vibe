import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Taste drücken",
  description: "Taste oder Tastenkombination drücken",
  form: {
    label: "Taste drücken",
    description: "Taste oder Tastenkombination drücken",
    fields: {
      key: {
        label: "Taste",
        description: "Eine Taste oder eine Kombination (z.B. Eingabe, Steuerung+A, Steuerung+Shift+R)",
        placeholder: "Taste oder Kombination eingeben",
      },
    },
  },
  response: {
    success: "Tastendruck erfolgreich",
    result: "Ergebnis des Tastendrucks",
    error: "Fehlermeldung",
    executionId: "Ausführungs-ID zur Verfolgung",
  },
  errors: {
    validation: { title: "Validierungsfehler", description: "Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut" },
    network: { title: "Netzwerkfehler", description: "Ein Netzwerkfehler ist während des Tastendrucks aufgetreten" },
    unauthorized: { title: "Nicht autorisiert", description: "Sie sind nicht berechtigt, Tastendrücke durchzuführen" },
    forbidden: { title: "Verboten", description: "Tastendruck ist verboten" },
    notFound: { title: "Nicht gefunden", description: "Die angeforderte Ressource wurde nicht gefunden" },
    serverError: { title: "Serverfehler", description: "Ein interner Serverfehler ist während des Tastendrucks aufgetreten" },
    unknown: { title: "Unbekannter Fehler", description: "Ein unbekannter Fehler ist während des Tastendrucks aufgetreten" },
    unsavedChanges: { title: "Nicht gespeicherte Änderungen", description: "Sie haben nicht gespeicherte Änderungen, die verloren gehen können" },
    conflict: { title: "Konflikt", description: "Ein Konflikt ist während des Tastendrucks aufgetreten" },
  },
  success: {
    title: "Tastendruck erfolgreich",
    description: "Die Taste wurde erfolgreich gedrückt",
  },
};
