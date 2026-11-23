import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Benutzer",

  title: "Passwort-Reset bestätigen",
  description: "Schließ das Zurücksetzen mit einem neuen Passwort ab",
  tag: "Passwort-Reset",
  email: {
    title: "Passwort erfolgreich zurückgesetzt",
    subject: "Dein {{appName}} Passwort ist zurückgesetzt",
    previewText:
      "Dein {{appName}} Passwort ist zurückgesetzt. Melde dich an und chatte mit {{modelCount}} KI-Modellen.",
    greeting: "Hey {{name}},",
    successMessage:
      "Dein Passwort ist zurückgesetzt. Melde dich an und mach da weiter, wo du aufgehört hast.",
    loginButton: "Bei {{appName}} anmelden",
    promoText: "{{modelCount}} KI-Modelle. Keine Filter. Keine Lektionen.",
    securityWarning:
      "Das warst nicht du? Schreib sofort dem Support. Dein Konto könnte gefährdet sein.",
  },
  groups: {
    verification: {
      title: "Verifizierung",
      description: "Bestätige deine Anfrage zum Zurücksetzen",
    },
    newPassword: {
      title: "Neues Passwort",
      description: "Leg dein neues Passwort fest",
    },
  },
  fields: {
    token: {
      label: "Reset-Token",
      description: "Der Reset-Token aus deiner E-Mail",
      placeholder: "Reset-Token eingeben",
      help: "Schau in deine E-Mail und gib den Reset-Token hier ein",
      validation: {
        required: "Reset-Token ist erforderlich",
      },
    },
    email: {
      label: "E-Mail-Adresse",
      description: "Deine E-Mail-Adresse",
      placeholder: "E-Mail-Adresse eingeben",
      validation: {
        invalid: "Gib eine gültige E-Mail-Adresse ein",
      },
    },
    password: {
      label: "Neues Passwort",
      description: "Dein neues Passwort",
      placeholder: "Neues Passwort eingeben",
      help: "Wähl ein starkes Passwort mit mindestens 8 Zeichen, aus Buchstaben, Zahlen und Symbolen",
      validation: {
        minLength: "Passwort muss mindestens 8 Zeichen lang sein",
      },
    },
    confirmPassword: {
      label: "Passwort bestätigen",
      description: "Bestätige dein neues Passwort",
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
      "Aktivier die Zwei-Faktor-Authentifizierung für mehr Sicherheit",
    nextSteps: [
      "Melde dich mit deinem neuen Passwort an",
      "Aktualisier gespeicherte Passwörter in deinem Browser",
      "Aktivier 2FA für zusätzliche Sicherheit",
    ],
  },
  errors: {
    title: "Fehler beim Zurücksetzen des Passworts",
    no_email: "Kein Konto mit dieser E-Mail-Adresse gefunden",
    validation: {
      title: "Validierungsfehler",
      description: "Prüf deine Eingabe und versuch es noch mal",
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
      description: "Du hast keine Berechtigung für diese Aktion",
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
      description: "Bei deiner Anfrage ist ein Konflikt aufgetreten",
    },
  },
  success: {
    title: "Passwort-Reset erfolgreich",
    description: "Dein Passwort ist zurückgesetzt",
    message: "Passwort wurde erfolgreich zurückgesetzt",
    password_reset: "Dein Passwort ist zurückgesetzt",
  },
  actions: {
    requestNewLink: "Neuen Reset-Link anfordern",
  },
  emailTemplates: {
    confirm: {
      name: "E-Mail zur Passwort-Reset-Bestätigung",
      description:
        "E-Mail, die an Benutzer gesendet wird, nachdem ihr Passwort erfolgreich zurückgesetzt wurde",
      category: "Authentifizierung",
      preview: {
        publicName: {
          label: "Öffentlicher Name",
          description: "Der öffentliche Anzeigename des Benutzers",
        },
        userId: {
          label: "Benutzer-ID",
          description: "Die eindeutige Kennung des Benutzers",
        },
      },
    },
  },
};
