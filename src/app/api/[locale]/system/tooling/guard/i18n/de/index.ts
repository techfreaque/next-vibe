import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "System Guard",
  destroy: {
    category: "System Guard",

    title: "Guard zerstören",
    description: "Guard-Umgebungen zerstören und Ressourcen bereinigen",
    tag: "guard-verwaltung",
    container: {
      title: "Guard-Zerstörungskonfiguration",
      description: "Parameter zum Zerstören von Guard-Umgebungen konfigurieren",
    },
    fields: {
      projectPath: {
        title: "Projektpfad",
        description: "Pfad zum Projektverzeichnis",
        placeholder: "/home/user/projects/mein-projekt",
      },
      guardId: {
        title: "Guard-ID",
        description: "Eindeutige Kennung für den Guard",
        placeholder: "guard_mein_projekt_abc123",
      },
      force: {
        title: "Erzwingen",
        description: "Zerstörung erzwingen, auch wenn Guard läuft",
      },
      cleanupFiles: {
        title: "Dateien bereinigen",
        description: "Alle Guard-bezogenen Dateien entfernen",
      },
      dryRun: {
        title: "Probelauf",
        description:
          "Vorschau, was zerstört würde, ohne tatsächlich zu zerstören",
      },
      success: {
        title: "Erfolg",
      },
      output: {
        title: "Ausgabe",
      },
      destroyedGuards: {
        title: "Zerstörte Guards",
      },
      warnings: {
        title: "Warnungen",
      },
      totalDestroyed: {
        title: "Gesamt zerstört",
      },
      username: {
        title: "Benutzername",
      },
      wasRunning: {
        title: "War aktiv",
      },
      filesRemoved: {
        title: "Dateien entfernt",
      },
      userRemoved: {
        title: "Benutzer entfernt",
      },
    },
    form: {
      title: "Konfiguration",
      description: "Parameter konfigurieren",
    },
    response: {
      title: "Antwort",
      description: "Antwortdaten",
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
        description: "Interner Serverfehler",
      },
      internal: {
        title: "Interner Fehler",
        description: "Ein interner Fehler ist aufgetreten",
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
      destruction_failed: {
        title: "Guard-Zerstörung fehlgeschlagen",
        description: "Guard-Umgebung konnte nicht zerstört werden",
      },
      guard_not_found: {
        title: "Guard nicht gefunden",
        description: "Keine Guard-Umgebung für das angegebene Projekt gefunden",
      },
    },
    success: {
      title: "Erfolg",
      description: "Vorgang erfolgreich abgeschlossen",
    },
  },
  start: {
    title: "Guard Starten",
    description: "Guard-Umgebungen für VSCode-Projekte starten",
    tag: "Starten",
    category: "Guard",
    container: {
      title: "Start-Konfiguration",
      description: "Guard-Startparameter konfigurieren",
    },
    fields: {
      projectPath: {
        title: "Projektpfad",
        description: "Pfad zum VSCode-Projekt",
        placeholder: "/home/user/projects/mein-projekt",
      },
      guardId: {
        title: "Guard-ID",
        description: "Eindeutiger Bezeichner für die Guard-Umgebung",
        placeholder: "guard_mein_projekt_abc123",
      },
      startAll: {
        title: "Alle Guards Starten",
        description: "Alle verfügbaren Guard-Umgebungen starten",
      },
      totalStarted: {
        title: "Gesamt Gestartet",
      },
      output: {
        title: "Ausgabe",
      },
      startedGuards: {
        columns: {
          username: "Benutzername",
          projectPath: "Projektpfad",
        },
      },
      summary: {
        title: "Zusammenfassung",
      },
      status: {
        title: "Status",
      },
      hasIssues: {
        title: "Hat Probleme",
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
      internal: {
        title: "Interner Fehler",
        description: "Interner Serverfehler aufgetreten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Guard-Umgebung nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Guard-Umgebung bereits gestartet",
      },
    },
    success: {
      title: "Erfolg",
      description: "Guard erfolgreich gestartet",
    },
  },
  status: {
    category: "Guard",
    post: {
      title: "Guard-Status",
      description: "Guard-Umgebungsstatus prüfen",
      tag: "Status",
      container: {
        title: "Guard-Status-Konfiguration",
        description: "Statusprüfungsparameter konfigurieren",
      },
      fields: {
        projectPath: {
          title: "Projektpfad",
          description: "Pfad zum Guard-Projekt",
          placeholder: "/pfad/zum/projekt",
        },
        guardId: {
          title: "Guard-ID",
          description: "Eindeutige Kennung für den Guard",
          placeholder: "guard-123",
        },
        username: {
          title: "Benutzername",
        },
        status: {
          title: "Status",
        },
        createdAt: {
          title: "Erstellt am",
        },
        securityLevel: {
          title: "Sicherheitsstufe",
        },
        isolationMethod: {
          title: "Isolationsmethode",
        },
        isRunning: {
          title: "Läuft",
        },
        userHome: {
          title: "Benutzerverzeichnis",
        },
        listAll: {
          title: "Alle Guards auflisten",
          description: "Alle Guard-Umgebungen auflisten",
        },
        success: {
          title: "Erfolg",
        },
        output: {
          title: "Ausgabe",
        },
        guards: {
          title: "Guards",
        },
        totalGuards: {
          title: "Gesamt Guards",
        },
        activeGuards: {
          title: "Aktive Guards",
        },
      },
      form: {
        title: "Statuskonfiguration",
        description: "Statusparameter konfigurieren",
      },
      response: {
        title: "Antwort",
        description: "Antwortdaten",
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
          description: "Interner Serverfehler",
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
        internal: {
          title: "Interner Fehler",
          description: "Interner Serverfehler ist aufgetreten",
        },
      },
      success: {
        title: "Erfolg",
        description: "Vorgang erfolgreich abgeschlossen",
      },
    },
  },
  stop: {
    category: "System Guard",

    title: "Guard Stoppen",
    description: "Guard-Umgebungen für VSCode-Projekte stoppen",
    tag: "guard",

    container: {
      title: "Guard Stopp-Konfiguration",
      description: "Parameter zum Stoppen von Guard-Umgebungen konfigurieren",
    },

    fields: {
      projectPath: {
        title: "Projektpfad",
        description: "Pfad zum Projektverzeichnis",
        placeholder: "/pfad/zu/ihrem/projekt",
      },
      guardId: {
        title: "Guard-ID",
        description: "Spezifische Guard-ID zum Stoppen",
        placeholder: "guard_projekt_abc123",
      },
      username: {
        title: "Benutzername",
      },
      wasRunning: {
        title: "War aktiv",
      },
      nowRunning: {
        title: "Jetzt aktiv",
      },
      pid: {
        title: "Prozess-ID",
      },
      forceStopped: {
        title: "Erzwungener Stopp",
      },
      stopAll: {
        title: "Alle Guards Stoppen",
        description: "Alle laufenden Guard-Umgebungen stoppen",
      },
      force: {
        title: "Erzwungen Stoppen",
        description: "Erzwungen stoppen, auch wenn Guard nicht reagiert",
      },
      success: {
        title: "Operation Erfolgreich",
      },
      output: {
        title: "Befehlsausgabe",
      },
      stoppedGuards: {
        title: "Gestoppte Guards",
      },
      totalStopped: {
        title: "Gesamt Gestoppt",
      },
    },

    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      internal: {
        title: "Interner Fehler",
        description: "Interner Serverfehler aufgetreten",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
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
    },

    success: {
      title: "Erfolg",
      description: "Guard Stopp-Operation erfolgreich abgeschlossen",
    },
  },
  operations: {
    create: "Erstellen",
    setup: "Einrichten",
    start: "Starten",
    stop: "Stoppen",
    destroy: "Zerstören",
    status: "Status",
    list: "Liste",
  },
  security: {
    minimal: "Minimale Sicherheit",
    standard: "Standard-Sicherheit",
    strict: "Strenge Sicherheit",
    maximum: "Maximale Sicherheit",
  },
  userTypes: {
    projectUser: "Projektbenutzer",
    restrictedUser: "Eingeschränkter Benutzer",
    chrootUser: "Chroot-Benutzer",
  },
  statusValues: {
    created: "Erstellt",
    running: "Läuft",
    stopped: "Gestoppt",
    error: "Fehler",
    destroyed: "Zerstört",
  },
  isolation: {
    rbash: "Eingeschränkte Bash (rbash)",
    chroot: "Chroot",
    bubblewrap: "Bubblewrap",
    firejail: "Firejail",
  },
};
