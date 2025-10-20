import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Passwort-Reset bestätigen",
  description: "Bestätigen Sie Ihr Passwort-Reset mit einem neuen Passwort",
  tag: "Passwort-Reset",
  email: {
    title: "Passwort erfolgreich zurückgesetzt",
    subject: "Ihr Passwort wurde zurückgesetzt",
    previewText: "Ihr Passwort wurde erfolgreich zurückgesetzt",
    greeting: "Hallo,",
    confirmationMessage: "Ihr Passwort wurde erfolgreich zurückgesetzt.",
    successMessage: "Ihr Passwort wurde erfolgreich zurückgesetzt.",
    loginInstructions:
      "Sie können sich jetzt mit Ihrem neuen Passwort anmelden.",
    securityWarning:
      "Wenn Sie diese Änderung nicht vorgenommen haben, wenden Sie sich bitte sofort an den Support.",
    securityTip:
      "Zu Ihrer Sicherheit empfehlen wir die Verwendung eines starken, eindeutigen Passworts.",
    securityNote:
      "Wenn Sie diese Änderung nicht vorgenommen haben, wenden Sie sich bitte sofort an den Support.",
  },
  groups: {
    verification: {
      title: "Verifizierung",
      description: "Verifizieren Sie Ihre Passwort-Reset-Anfrage",
    },
    newPassword: {
      title: "Neues Passwort",
      description: "Setzen Sie Ihr neues Passwort",
    },
  },
  fields: {
    token: {
      label: "Reset-Token",
      description: "Der Passwort-Reset-Token aus Ihrer E-Mail",
      placeholder: "Reset-Token eingeben",
      help: "Überprüfen Sie Ihre E-Mail für den Passwort-Reset-Token und geben Sie ihn hier ein",
      validation: {
        required: "Reset-Token ist erforderlich",
      },
    },
    email: {
      label: "E-Mail-Adresse",
      description: "Ihre E-Mail-Adresse",
      placeholder: "E-Mail-Adresse eingeben",
      validation: {
        invalid: "Bitte geben Sie eine gültige E-Mail-Adresse ein",
      },
    },
    password: {
      label: "Neues Passwort",
      description: "Ihr neues Passwort",
      placeholder: "Neues Passwort eingeben",
      help: "Wählen Sie ein starkes Passwort mit mindestens 8 Zeichen, einschließlich Buchstaben, Zahlen und Symbolen",
      validation: {
        minLength: "Passwort muss mindestens 8 Zeichen lang sein",
      },
    },
    confirmPassword: {
      label: "Passwort bestätigen",
      description: "Bestätigen Sie Ihr neues Passwort",
      placeholder: "Neues Passwort bestätigen",
      validation: {
        minLength: "Passwort muss mindestens 8 Zeichen lang sein",
      },
    },
  },
  validation: {
    passwords: {
      mismatch: "Passwörter stimmen nicht überein",
    },
  },
  response: {
    title: "Passwort-Reset-Antwort",
    description: "Passwort-Reset-Bestätigungsantwort",
    message: {
      label: "Nachricht",
      description: "Antwortnachricht",
    },
    securityTip:
      "Erwägen Sie die Aktivierung der Zwei-Faktor-Authentifizierung für bessere Sicherheit",
    nextSteps: [
      "Melden Sie sich mit Ihrem neuen Passwort an",
      "Aktualisieren Sie gespeicherte Passwörter in Ihrem Browser",
      "Erwägen Sie die Aktivierung von 2FA für zusätzliche Sicherheit",
    ],
  },
  errors: {
    title: "Fehler beim Zurücksetzen des Passworts",
    validation: {
      title: "Validierungsfehler",
      description:
        "Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut",
      passwordsDoNotMatch: "Passwörter stimmen nicht überein",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Ungültiger oder abgelaufener Reset-Token",
    },
    internal: {
      title: "Serverfehler",
      description: "Ein interner Serverfehler ist aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unbekannter Fehler ist aufgetreten",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Netzwerkverbindungsfehler",
    },
    forbidden: {
      title: "Zugriff verweigert",
      description: "Sie haben keine Berechtigung für diese Aktion",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Reset-Token nicht gefunden oder abgelaufen",
    },
    unsaved: {
      title: "Ungespeicherte Änderungen",
      description: "Es gibt ungespeicherte Änderungen",
    },
    conflict: {
      title: "Konflikt",
      description:
        "Beim Verarbeiten Ihrer Anfrage ist ein Konflikt aufgetreten",
    },
  },
  success: {
    title: "Passwort-Reset erfolgreich",
    description: "Ihr Passwort wurde erfolgreich zurückgesetzt",
    message: "Passwort wurde erfolgreich zurückgesetzt",
    password_reset: "Ihr Passwort wurde erfolgreich zurückgesetzt",
  },
};
