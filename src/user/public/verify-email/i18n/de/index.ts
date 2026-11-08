import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Konto",
  title: "E-Mail bestätigen",
  titleShort: "E-Mail bestätigen",
  description:
    "Bestätige deine E-Mail-Adresse über den Link, den wir dir geschickt haben. Ohne Token wird der Link erneut gesendet.",
  tag: "email-bestaetigen",
  token: {
    label: "Bestätigungs-Token",
    description:
      "Aus dem Link in deiner Bestätigungs-E-Mail. Leer lassen, um die E-Mail erneut zu senden.",
    placeholder: "Token aus der E-Mail",
  },
  response: {
    verified: "Bestätigt",
    message: "Status",
    email: "E-Mail",
  },
  widget: {
    heroTitle: "E-Mail bestätigen",
    heroDescription: "Ein Klick, und deine Adresse ist bestätigt.",
    confirmButton: "E-Mail bestätigen",
    confirming: "Wird bestätigt...",
    doneTitle: "E-Mail bestätigt",
    doneDescription: "Deine Adresse ist bestätigt. Alles erledigt.",
    resend: "Neuen Link senden",
    continue: "Weiter",
  },
  email: {
    subject: "Bestätige deine E-Mail für {{appName}}",
    title: "E-Mail bestätigen",
    previewText: "Ein Klick bestätigt deine {{appName}}-Adresse",
    greeting: "Hallo {{name}},",
    body: "Bestätige diese Adresse, damit wir dich zu Konto, Credits und Sicherheit erreichen können.",
    button: "E-Mail bestätigen",
    expiry:
      "Dieser Link ist {{days}} Tage gültig. Falls du kein Konto erstellt hast, ignoriere diese E-Mail.",
    signoff: "- {{appName}}",
  },
  emailTemplates: {
    name: "E-Mail-Bestätigung",
    description:
      "Wird nach der Registrierung und auf Anfrage gesendet, um die Konto-E-Mail zu bestätigen",
    category: "Konto",
  },
  errors: {
    invalidToken:
      "Dieser Bestätigungslink ist ungültig oder abgelaufen. Fordere in den Einstellungen einen neuen an.",
    userNotFound: "Konto nicht gefunden.",
    failed: "Die E-Mail konnte nicht bestätigt werden.",
    needLogin: "Melde dich an, um die Bestätigungs-E-Mail erneut zu senden.",
    validation: {
      title: "Validierungsfehler",
      description: "Prüfe deine Eingabe und versuche es erneut",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Melde dich an, um die Bestätigungs-E-Mail erneut zu senden",
    },
    server: {
      title: "Serverfehler",
      description: "Bestätigung wegen eines Serverfehlers fehlgeschlagen",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unerwarteter Fehler ist aufgetreten",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Netzwerkverbindung fehlgeschlagen",
    },
    forbidden: {
      title: "Zugriff verweigert",
      description: "Dafür fehlt dir die Berechtigung",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Konto konnte nicht gefunden werden",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Du hast ungespeicherte Änderungen",
    },
    conflict: {
      title: "Konflikt",
      description: "Ein Konflikt ist aufgetreten",
    },
  },
  success: {
    title: "Erledigt",
    description: "E-Mail-Bestätigung aktualisiert",
    verified: "Deine E-Mail ist bestätigt.",
    alreadyVerified: "Deine E-Mail ist bereits bestätigt.",
    sent: "Bestätigungs-E-Mail gesendet. Schau in dein Postfach.",
  },
};
