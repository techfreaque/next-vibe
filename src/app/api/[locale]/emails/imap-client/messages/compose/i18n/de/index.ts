export const translations = {
  post: {
    title: "E-Mail verfassen",
    description: "Neue E-Mail via SMTP senden",
    to: {
      label: "An",
      description: "E-Mail-Adresse des Empfängers",
      placeholder: "empfaenger@beispiel.de",
    },
    toName: {
      label: "Empfängername",
      description: "Anzeigename des Empfängers",
      placeholder: "Max Mustermann",
    },
    subject: {
      label: "Betreff",
      description: "Betreffzeile der E-Mail",
      placeholder: "Betreff eingeben...",
    },
    body: {
      label: "Nachricht",
      description: "E-Mail-Text (Nur-Text)",
      placeholder: "Schreiben Sie hier Ihre Nachricht...",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Parameter",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Keine Berechtigung zum Senden",
      },
      server: {
        title: "Serverfehler",
        description: "E-Mail konnte nicht gesendet werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Unbekannter Fehler beim Senden",
      },
      conflict: {
        title: "Konflikt",
        description: "Konflikt beim Senden",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "SMTP-Konto nicht gefunden",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler beim Senden",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Bitte zuerst speichern",
      },
    },
    success: {
      title: "E-Mail gesendet",
      description: "E-Mail erfolgreich gesendet",
    },
  },
  widget: {
    title: "Neue Nachricht",
    send: "Senden",
    sending: "Wird gesendet...",
    sent: "E-Mail erfolgreich gesendet",
    cancel: "Abbrechen",
    discardConfirm: "Entwurf verwerfen?",
  },
};
