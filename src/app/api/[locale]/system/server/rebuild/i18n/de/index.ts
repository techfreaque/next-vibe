import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Server-Management",
  tags: {
    rebuild: "Rebuild",
  },
  post: {
    title: "Neu bauen & Neustarten",
    description:
      "Anwendung neu bauen und den laufenden Next.js-Server ohne vollständige Ausfallzeit hot-restarten",
    form: {
      title: "Rebuild-Konfiguration",
      description: "Rebuild- und Neustart-Optionen konfigurieren",
    },
    fields: {
      generate: {
        title: "Code generieren",
        description: "Code-Generierung vor dem Build ausführen",
      },
      nextBuild: {
        title: "Next.js-Build",
        description: "Next.js-Produktions-Build ausführen",
      },
      migrate: {
        title: "Migrationen ausführen",
        description: "Datenbank-Migrationen nach dem Build ausführen",
      },
      seed: {
        title: "Seeding ausführen",
        description: "Datenbank-Seeding nach Migrationen ausführen",
      },
      restart: {
        title: "Server neustarten",
        description:
          "SIGUSR1 an den laufenden vibe start-Prozess senden, um Next.js hot-neuzustarten",
      },
      force: {
        title: "Rebuild erzwingen",
        description: "Rebuild auch bei Fehlern fortsetzen",
      },
      success: {
        title: "Rebuild erfolgreich",
      },
      output: {
        title: "Rebuild-Ausgabe",
      },
      duration: {
        title: "Rebuild-Dauer (ms)",
      },
      errors: {
        title: "Rebuild-Fehler",
      },
      restarted: {
        title: "Server neugestartet",
      },
    },
    errors: {
      validation: {
        title: "Validierung fehlgeschlagen",
        description: "Ungültige Rebuild-Parameter angegeben",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkverbindung während Rebuild fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie müssen angemeldet sein, um die Anwendung neu zu bauen",
      },
      forbidden: {
        title: "Verboten",
        description: "Sie haben keine Berechtigung, die Anwendung neu zu bauen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Rebuild-Ressourcen nicht gefunden",
      },
      server: {
        title: "Server-Fehler",
        description:
          "Ein interner Server-Fehler ist während des Rebuilds aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unbekannter Fehler ist während des Rebuilds aufgetreten",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Rebuild läuft bereits",
      },
    },
    success: {
      title: "Rebuild abgeschlossen",
      description: "Anwendung neu gebaut und Server erfolgreich neugestartet",
    },
  },
};
