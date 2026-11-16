import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Benutzer",

  post: {
    title: "Erinnerung E-Mail-Bestätigung",
    titleShort: "Bestätigungs-Erinnerung",
    description:
      "Schickt Konten, die ihre E-Mail 24 Stunden nach der Registrierung noch nicht bestätigt haben, eine Erinnerung. Gratis-Credits brauchen eine bestätigte E-Mail.",
    tag: "Bestätigungs-Erinnerung",
    container: {
      title: "Erinnerung E-Mail-Bestätigung",
      description: "Vor 24-25 Stunden erstellte, noch unbestätigte Konten",
    },
    fields: {
      batchSize: {
        label: "Batchgröße",
        description: "Maximale Erinnerungen pro Lauf",
      },
      dryRun: {
        label: "Testlauf",
        description: "Nur zählen, wer eine Erinnerung bekäme, nichts senden",
      },
    },
    response: {
      candidates: "Unbestätigte Konten im Zeitfenster",
      sent: "Gesendete Erinnerungen",
      skipped: "Übersprungen",
      failed: "Fehlgeschlagen",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Nur Admins dürfen Bestätigungs-Erinnerungen senden",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verweigert",
      },
      server: {
        title: "Serverfehler",
        description: "Senden der Bestätigungs-Erinnerungen fehlgeschlagen",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Einstellungen",
      },
    },
    success: {
      title: "Erinnerungen verarbeitet",
      description: "Bestätigungs-Erinnerungen verarbeitet",
    },
  },
  task: {
    name: "verify-email-reminder",
    description:
      "Stündlich: eine Erinnerung an Konten, die 24 Stunden nach der Registrierung noch unbestätigt sind",
  },
};
