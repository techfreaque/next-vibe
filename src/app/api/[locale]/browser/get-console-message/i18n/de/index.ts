import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Konsolen-Nachricht abrufen",
  description: "Eine Konsolen-Nachricht nach ihrer ID abrufen",
  form: {
    label: "Konsolen-Nachricht abrufen",
    description: "Eine bestimmte Konsolen-Nachricht abrufen",
    fields: {
      msgid: {
        label: "Nachrichten-ID",
        description: "Die msgid einer Konsolen-Nachricht aus den aufgelisteten Konsolen-Nachrichten",
        placeholder: "Nachrichten-ID eingeben",
      },
    },
  },
  response: {
    success: "Konsolen-Nachricht erfolgreich abgerufen",
    result: "Ergebnis des Abrufs der Konsolen-Nachricht",
    error: "Fehlermeldung",
    executionId: "Ausführungs-ID zur Verfolgung",
  },
  errors: {
    validation: { title: "Validierungsfehler", description: "Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut" },
    network: { title: "Netzwerkfehler", description: "Ein Netzwerkfehler ist beim Abrufen der Konsolen-Nachricht aufgetreten" },
    unauthorized: { title: "Nicht autorisiert", description: "Sie sind nicht berechtigt, Konsolen-Nachrichten abzurufen" },
    forbidden: { title: "Verboten", description: "Abrufen von Konsolen-Nachrichten ist verboten" },
    notFound: { title: "Nicht gefunden", description: "Die angeforderte Ressource wurde nicht gefunden" },
    serverError: { title: "Serverfehler", description: "Ein interner Serverfehler ist beim Abrufen der Konsolen-Nachricht aufgetreten" },
    unknown: { title: "Unbekannter Fehler", description: "Ein unbekannter Fehler ist beim Abrufen der Konsolen-Nachricht aufgetreten" },
    unsavedChanges: { title: "Nicht gespeicherte Änderungen", description: "Sie haben nicht gespeicherte Änderungen, die verloren gehen können" },
    conflict: { title: "Konflikt", description: "Ein Konflikt ist beim Abrufen der Konsolen-Nachricht aufgetreten" },
  },
  success: {
    title: "Konsolen-Nachricht erfolgreich abgerufen",
    description: "Die Konsolen-Nachricht wurde erfolgreich abgerufen",
  },
};
