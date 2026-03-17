import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Konto",
  tags: {
    remoteConnection: "Fernverbindung",
  },
  post: {
    title: "Erneut authentifizieren",
    description: "Anmeldedaten für diese Fernverbindung erneuern",
    instanceId: {
      label: "Instanz-ID",
      description: "Die Instanz für die erneute Authentifizierung",
    },
    email: {
      label: "E-Mail",
      description: "Deine E-Mail auf der Remote-Instanz",
      placeholder: "du@example.com",
      validation: {
        required: "E-Mail ist erforderlich",
        invalid: "Ungültige E-Mail-Adresse",
      },
    },
    password: {
      label: "Passwort",
      description: "Dein Passwort auf der Remote-Instanz",
      placeholder: "••••••••",
      validation: {
        required: "Passwort ist erforderlich",
      },
    },
    actions: {
      submit: "Erneut authentifizieren",
      submitting: "Authentifiziere…",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Remote-Server fehlgeschlagen",
      },
      unauthorized: {
        title: "Ungültige Anmeldedaten",
        description: "E-Mail oder Passwort ist falsch",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Du hast keine Berechtigung",
      },
      notFound: {
        title: "Nicht verbunden",
        description: "Keine Fernverbindung für diese Instanz gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Fehler bei der erneuten Authentifizierung",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
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
      title: "Erneut authentifiziert",
      description: "Deine Anmeldedaten wurden erfolgreich erneuert",
    },
  },
};
