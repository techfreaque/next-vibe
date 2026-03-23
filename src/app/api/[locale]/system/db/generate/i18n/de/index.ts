import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Datenbankoperationen",
  tag: "migration",
  post: {
    title: "Migrationen generieren",
    description: "Drizzle-Migrationsdateien aus Schema-Änderungen generieren",
    form: {
      title: "Generierungskonfiguration",
      description: "Optionen für die Migrationsgenerierung konfigurieren",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Parameter",
      },
      network: {
        title: "Generierung fehlgeschlagen",
        description: "drizzle-kit generate fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Unzureichende Berechtigungen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Ressourcen nicht gefunden",
      },
      server: { title: "Serverfehler", description: "Interner Serverfehler" },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      conflict: { title: "Konflikt", description: "Konflikt erkannt" },
    },
    success: {
      title: "Generierung erfolgreich",
      description: "Migrationsdateien erfolgreich generiert",
    },
  },
  fields: {
    success: { title: "Erfolgsstatus" },
    output: { title: "Ausgabe" },
    duration: { title: "Dauer (ms)" },
  },
};
