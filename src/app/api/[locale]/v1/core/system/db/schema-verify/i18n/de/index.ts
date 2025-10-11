import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "schema-verify",
  post: {
    title: "Schema-Verifizierung",
    description:
      "Datenbankschema-Integrität prüfen und optional Probleme beheben",
    form: {
      title: "Schema-Verifizierungskonfiguration",
      description: "Schema-Verifizierungsparameter konfigurieren",
    },
    response: {
      title: "Schema-Verifizierungsantwort",
      description: "Ergebnisse der Schema-Verifizierung",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung für Schema-Verifizierung erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Schema-Verifizierungsparameter",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler während der Schema-Verifizierung",
      },
      internal: {
        title: "Interner Fehler",
        description: "Schema-Verifizierungsvorgang fehlgeschlagen",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unbekannter Fehler ist während der Schema-Verifizierung aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler während der Schema-Verifizierung",
      },
      forbidden: {
        title: "Verboten",
        description: "Unzureichende Berechtigungen für Schema-Verifizierung",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Schema-Verifizierungsressourcen nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Schema-Verifizierungskonflikt erkannt",
      },
    },
    success: {
      title: "Schema verifiziert",
      description: "Datenbankschema-Verifizierung erfolgreich abgeschlossen",
    },
  },
  fields: {
    fixIssues: {
      title: "Probleme beheben",
      description: "Erkannte Schema-Probleme automatisch beheben",
    },
    silent: {
      title: "Stiller Modus",
      description: "Ausgabemeldungen unterdrücken",
    },
    success: {
      title: "Erfolgsstatus",
    },
    valid: {
      title: "Schema gültig",
    },
    output: {
      title: "Ausgabe",
    },
    issues: {
      title: "Gefundene Probleme",
    },
    fixedIssues: {
      title: "Behobene Probleme",
    },
  },
};
