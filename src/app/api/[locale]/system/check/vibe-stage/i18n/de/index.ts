import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Vibe Stage",
  titleShort: "Vibe Stage",
  description:
    "Stagt automatisch Boilerplate-Dateien (route.ts, i18n/*/index.ts), die das Muster-Check bestehen. Führt das Boilerplate-Oxlint-Plugin auf allen nicht-gestagten Kandidaten aus und git-addet nur Dateien ohne Verstöße.",

  fields: {
    dryRun: {
      label: "Probelauf",
      description:
        "Zeigt an, welche Dateien gestagt würden, ohne tatsächlich git add auszuführen",
    },
    paths: {
      label: "Pfade einschränken",
      description:
        "Nur Kandidaten unter diesen Pfaden berücksichtigen. Leer lassen, um alle nicht-gestagten Änderungen zu scannen.",
      placeholder: "z.B. src/app/api",
    },
  },

  response: {
    staged: "Gestagt",
    skipped: "Übersprungen (Verstöße)",
    noChanges:
      "Keine stagbaren Boilerplate-Dateien im Arbeitsverzeichnis gefunden",
    dryRunNote: "Probelauf - es wurden keine Dateien tatsächlich gestagt",
  },

  errors: {
    validation: {
      title: "Ungültige Parameter",
      description: "Die Vibe-Stage-Parameter sind ungültig",
    },
    internal: {
      title: "Interner Fehler",
      description: "Beim Ausführen von vibe stage ist ein Fehler aufgetreten",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Sie müssen angemeldet sein, um vibe stage auszuführen",
    },
    forbidden: {
      title: "Verboten",
      description: "Zugriff auf vibe stage ist nicht gestattet",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Kein Git-Repository gefunden",
    },
    server: {
      title: "Serverfehler",
      description: "Ein Serverfehler ist bei vibe stage aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unbekannter Fehler ist bei vibe stage aufgetreten",
    },
    unsaved: {
      title: "Nicht gespeicherte Änderungen",
      description: "Nicht gespeicherte Änderungen erkannt",
    },
    conflict: {
      title: "Konflikt",
      description: "Ein Konflikt ist bei vibe stage aufgetreten",
    },
  },

  success: {
    title: "Stage abgeschlossen",
    description: "Boilerplate-Dateien erfolgreich gestagt",
  },

  widget: {
    title: "Vibe Stage",
    subtitle:
      "Boilerplate-Dateien automatisch stagen, die den Muster-Check bestehen",
    submit: "Stage ausführen",
    dryRun: "Probelauf",
    staged: "Gestagt",
    skipped: "Übersprungen",
    stagedCount: "Dateien gestagt",
    skippedCount: "Dateien übersprungen (Verstöße)",
    noChanges: "Keine stagbaren Boilerplate-Dateien gefunden",
    noChangesHint:
      "Geänderte route.ts und i18n/*/index.ts Dateien, die den Muster-Check bestehen, erscheinen hier",
    dryRunBadge: "Probelauf",
    dryRunNote: "Nur Vorschau — keine Dateien wurden gestagt",
    cleanFile: "sauber",
    violationsFile: "Verstöße",
    loading: "Arbeitsverzeichnis wird gescannt...",
  },
};
