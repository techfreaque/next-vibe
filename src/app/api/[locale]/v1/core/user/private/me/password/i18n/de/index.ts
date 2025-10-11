import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Passwort Ändern",
  description: "Ändern Sie Ihr Kontokennwort sicher",
  tag: "passwort-ändern",
  groups: {
    currentCredentials: {
      title: "Aktuelles Passwort",
      description: "Bestätigen Sie Ihr aktuelles Passwort, um fortzufahren",
    },
    newCredentials: {
      title: "Neues Passwort",
      description: "Wählen Sie ein starkes neues Passwort für Ihr Konto",
    },
  },
  currentPassword: {
    label: "Aktuelles Passwort",
    description: "Geben Sie Ihr aktuelles Passwort ein",
    placeholder: "Aktuelles Passwort eingeben",
    help: "Geben Sie Ihr aktuelles Passwort ein, um Ihre Identität zu bestätigen",
  },
  newPassword: {
    label: "Neues Passwort",
    description: "Geben Sie Ihr neues Passwort ein (mindestens 8 Zeichen)",
    placeholder: "Neues Passwort eingeben",
    help: "Wählen Sie ein starkes Passwort mit mindestens 8 Zeichen, einschließlich Buchstaben, Zahlen und Symbolen",
  },
  confirmPassword: {
    label: "Passwort Bestätigen",
    description: "Bestätigen Sie Ihr neues Passwort",
    placeholder: "Neues Passwort bestätigen",
    help: "Geben Sie Ihr neues Passwort erneut ein, um sicherzustellen, dass es korrekt eingegeben wurde",
  },
  response: {
    title: "Passwort-Änderungsantwort",
    description: "Antwort für die Passwort-Änderungsoperation",
    success: "Passwort erfolgreich aktualisiert",
    message: "Statusnachricht",
    securityTip: "Sicherheitstipp",
    nextSteps: {
      item: "Nächste Schritte",
    },
  },
  validation: {
    currentPassword: {
      minLength: "Aktuelles Passwort muss mindestens 8 Zeichen haben",
    },
    newPassword: {
      minLength: "Neues Passwort muss mindestens 8 Zeichen haben",
    },
    confirmPassword: {
      minLength: "Passwort-Bestätigung muss mindestens 8 Zeichen haben",
    },
    passwords: {
      mismatch: "Passwörter stimmen nicht überein",
    },
  },
  errors: {
    invalid_request: {
      title: "Ungültige Anfrage",
      description: "Die Passwort-Änderungsanfrage ist ungültig",
    },
    validation: {
      title: "Validierungsfehler",
      description:
        "Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Sie müssen angemeldet sein, um Ihr Passwort zu ändern",
    },
    server: {
      title: "Serverfehler",
      description:
        "Passwort konnte aufgrund eines Serverfehlers nicht aktualisiert werden",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description:
        "Ein unerwarteter Fehler ist beim Aktualisieren des Passworts aufgetreten",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Netzwerkverbindung fehlgeschlagen",
    },
    forbidden: {
      title: "Zugriff Verboten",
      description: "Sie haben keine Berechtigung für diese Aktion",
    },
    notFound: {
      title: "Benutzer Nicht Gefunden",
      description: "Benutzerkonto konnte nicht gefunden werden",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Sie haben ungespeicherte Änderungen, die verloren gehen",
    },
    conflict: {
      title: "Datenkonflikt",
      description:
        "Ein Konflikt ist beim Aktualisieren des Passworts aufgetreten",
    },
  },
  success: {
    title: "Passwort Aktualisiert",
    description: "Ihr Passwort wurde erfolgreich aktualisiert",
  },
  update: {
    success: {
      title: "Passwort Aktualisiert",
      description: "Ihr Passwort wurde erfolgreich aktualisiert",
    },
    errors: {
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Beim Aktualisieren des Passworts ist ein unerwarteter Fehler aufgetreten",
      },
    },
  },
};
