import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "sql",
  post: {
    title: "SQL ausführen",
    description: "SQL-Abfragen auf der Datenbank ausführen",
    form: {
      title: "SQL-Abfragekonfiguration",
      description: "SQL-Abfrageparameter konfigurieren",
    },
    response: {
      title: "Abfrageantwort",
      description: "SQL-Abfrage-Ausführungsergebnisse",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung für SQL-Ausführung erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige SQL-Abfrage oder Parameter",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler bei SQL-Ausführung",
      },
      internal: {
        title: "Interner Fehler",
        description: "SQL-Abfrage-Ausführung fehlgeschlagen",
      },
      database: {
        title: "Datenbankfehler",
        description: "Datenbankfehler bei Abfrageausführung aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist bei SQL-Ausführung aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler bei SQL-Ausführung",
      },
      forbidden: {
        title: "Verboten",
        description: "Unzureichende Berechtigungen für SQL-Ausführung",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "SQL-Ressourcen nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "SQL-Konflikt erkannt",
      },
    },
    success: {
      title: "Abfrage ausgeführt",
      description: "SQL-Abfrage erfolgreich ausgeführt",
    },
  },
  fields: {
    query: {
      title: "SQL-Abfrage",
      description: "Die auszuführende SQL-Abfrage",
    },
    dryRun: {
      title: "Testlauf",
      description: "Abfrage ohne Ausführung anzeigen",
    },
    verbose: {
      title: "Ausführliche Ausgabe",
      description: "Detaillierte Abfrageinformationen anzeigen",
    },
    limit: {
      title: "Zeilenlimit",
      description: "Maximale Anzahl zurückzugebender Zeilen (1-1000)",
    },
    success: {
      title: "Erfolgsstatus",
    },
    output: {
      title: "Ausgabe",
    },
    results: {
      title: "Abfrageergebnisse",
    },
    rowCount: {
      title: "Zeilenanzahl",
    },
    queryType: {
      title: "Abfragetyp",
    },
  },
};
