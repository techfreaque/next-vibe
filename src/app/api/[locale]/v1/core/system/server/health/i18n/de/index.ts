import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "Gesundheit",
  get: {
    title: "Gesundheitsprüfung",
    description: "Server-Gesundheitsstatus und Diagnose abrufen",
    form: {
      title: "Gesundheitsprüfungsoptionen",
      description: "Gesundheitsprüfungsparameter konfigurieren",
    },
    fields: {
      detailed: {
        title: "Detaillierter Bericht",
        description: "Detaillierte Systeminformationen einschließen",
      },
      includeDatabase: {
        title: "Datenbank einschließen",
        description: "Datenbank-Gesundheitsprüfungen einschließen",
      },
      includeTasks: {
        title: "Aufgaben einschließen",
        description: "Task-Runner-Gesundheitsprüfungen einschließen",
      },
      includeSystem: {
        title: "System einschließen",
        description: "System-Ressourceninformationen einschließen",
      },
    },
    response: {
      status: {
        title: "Status",
        description: "Gesamtgesundheitsstatus",
      },
      timestamp: {
        title: "Zeitstempel",
        description: "Zeit der Gesundheitsprüfung",
      },
      uptime: {
        title: "Betriebszeit",
        description: "Server-Betriebszeit in Sekunden",
      },
      environment: {
        title: "Umgebung",
        description: "Server-Umgebungsinformationen",
        name: {
          title: "Umgebungsname",
        },
        nodeEnv: {
          title: "Node-Umgebung",
        },
        platform: {
          title: "Plattform",
        },
        supportsSideTasks: {
          title: "Unterstützt Seitenaufgaben",
        },
      },
      database: {
        title: "Datenbankstatus",
        description: "Datenbankverbindungsstatus",
        status: {
          title: "Verbindungsstatus",
        },
        responseTime: {
          title: "Antwortzeit (ms)",
        },
        error: {
          title: "Fehlermeldung",
        },
      },
      tasks: {
        title: "Aufgabenstatus",
        description: "Task-Runner-Status",
        runnerStatus: {
          title: "Runner-Status",
        },
        activeTasks: {
          title: "Aktive Aufgaben",
        },
        totalTasks: {
          title: "Gesamtaufgaben",
        },
        errors: {
          title: "Fehleranzahl",
        },
        lastError: {
          title: "Letzter Fehler",
        },
      },
      system: {
        title: "Systeminfo",
        description: "System-Ressourceninformationen",
        memory: {
          title: "Speicherverbrauch",
          description: "System-Speicherinformationen",
          used: {
            title: "Verwendeter Speicher",
          },
          total: {
            title: "Gesamtspeicher",
          },
          percentage: {
            title: "Speicherverbrauch %",
          },
        },
        cpu: {
          title: "CPU-Verbrauch",
          description: "System-CPU-Informationen",
          usage: {
            title: "CPU-Verbrauch %",
          },
          loadAverage: {
            title: "Durchschnittslast",
          },
        },
        disk: {
          title: "Festplattenverbrauch",
          description: "System-Festplatteninformationen",
          available: {
            title: "Verfügbarer Speicherplatz",
          },
          total: {
            title: "Gesamtspeicherplatz",
          },
          percentage: {
            title: "Festplattenverbrauch %",
          },
        },
      },
      checks: {
        title: "Gesundheitsprüfungen",
        description: "Einzelne Komponenten-Gesundheitsprüfungen",
        item: {
          title: "Gesundheitsprüfung",
          description: "Einzelnes Gesundheitsprüfungsergebnis",
          name: {
            title: "Prüfungsname",
          },
          status: {
            title: "Prüfungsstatus",
          },
          message: {
            title: "Prüfungsmeldung",
          },
          duration: {
            title: "Dauer (ms)",
          },
        },
      },
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Ressource nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Erfolg",
      description: "Gesundheitsprüfung erfolgreich abgeschlossen",
    },
  },
};
