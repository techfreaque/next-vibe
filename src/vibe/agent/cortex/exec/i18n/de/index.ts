import type { translations as enTranslations } from "../en";
export const translations: typeof enTranslations = {
  post: {
    title: "Befehl ausführen",
    titleShort: "Befehl ausführen",
    description:
      "Shell-Befehl auf einer Maschine ausführen. Nur für /ssh/-Pfade. Persistentes Terminal — Arbeitsverzeichnis bleibt erhalten. Neue Sitzungen starten im Standard-Einhängepunkt, falls konfiguriert.",
    dynamicTitle: "{{path}}: {{command}}",
    status: {
      loading: "Läuft...",
      done: "Fertig",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Maschine",
        description:
          'SSH-Maschinenpfad. Muss mit /ssh/ beginnen. cortex-list(path="/ssh") zeigt Maschinen und Einhängepunkte.',
      },
      command: {
        label: "Befehl",
        description: "Shell-Befehl zum Ausführen",
        placeholder: "echo hallo",
      },
      workingDir: {
        label: "Arbeitsverzeichnis",
        description:
          "Arbeitsverzeichnis überschreiben. Wenn leer, wird das aktuelle Verzeichnis des Terminals verwendet.",
        placeholder: "/home/user/projekt",
      },
      terminalId: {
        label: "Terminal-ID",
        description:
          "Bestehende Terminal-Sitzung wiederverwenden. Wenn leer, wird das Standard-Terminal verwendet.",
      },
      timeoutMs: {
        label: "Zeitlimit (ms)",
        description:
          "Maximale Ausführungszeit. Standard 30000ms. Max 300000ms.",
        placeholder: "30000",
      },
    },
    submitButton: {
      label: "Ausführen",
      loadingText: "Wird ausgeführt...",
    },
    response: {
      output: { content: "Ausgabe" },
      exitCode: { title: "Exit-Code" },
      cwd: { content: "Arbeitsverzeichnis" },
      terminalId: { content: "Terminal-ID" },
      backend: { title: "Backend" },
      truncated: { title: "Gekürzt" },
    },
    errors: {
      validation: {
        title: "Ungültige Eingabe",
        description: "Pfad und Befehl prüfen",
      },
      network: { title: "Offline", description: "Server nicht erreichbar" },
      unauthorized: { title: "Nicht eingeloggt", description: "Erst anmelden" },
      forbidden: {
        title: "Kein Zugriff",
        description: "Keine Berechtigung für diese Maschine",
      },
      notFound: {
        title: "Maschine nicht gefunden",
        description:
          "Keine SSH-Verbindung oder Remote-Instanz unter diesem Pfad",
      },
      server: {
        title: "Ausführung fehlgeschlagen",
        description: "Befehlsausführung fehlgeschlagen",
      },
      unknown: { title: "Fehler", description: "Etwas ist schiefgelaufen" },
      unsavedChanges: {
        title: "Nicht gespeichert",
        description: "Erst speichern oder verwerfen",
      },
      conflict: {
        title: "Sitzungskonflikt",
        description: "Terminal-Sitzung ist beschäftigt",
      },
    },
    success: {
      title: "Befehl abgeschlossen",
      description: "Befehl ausgeführt",
    },
  },
  errors: {
    invalidWorkingDir:
      "Arbeitsverzeichnis muss ein absoluter Pfad ohne '..' sein",
    commandTimedOut: "Befehl hat das Zeitlimit überschritten",
    invalidPath: "Pfad muss mit /ssh/ beginnen",
    noConnection: "Keine Verbindung unter diesem Pfad gefunden",
    connectionNotFound: "Verbindung nicht gefunden",
    encryptionFailed:
      "Verschlüsselung fehlgeschlagen - JWT_SECRET_KEY möglicherweise ungültig",
    connectTimeout: "Verbindung hat Zeitlimit überschritten",
    sshAuthFailed: "SSH-Authentifizierung fehlgeschlagen",
    sshConnectionFailed: "SSH-Verbindung fehlgeschlagen",
    fingerprintMismatch:
      "Host-Fingerabdruck geändert - mögliches Sicherheitsrisiko. Verbindung löschen und neu anlegen.",
    remoteNotSupported:
      "Remote-Verbindungen werden noch nicht unterstützt. Nutze eine direkte SSH-Verbindung.",
  },
  log: {
    execComplete: "Befehl ausgeführt",
    openedLocal: "Lokales Terminal geöffnet",
    failedLocal: "Lokales Terminal konnte nicht geöffnet werden",
    openedSsh: "SSH-Terminal geöffnet",
    failedFingerprint: "Fingerabdruck konnte nicht gespeichert werden",
    failedPty: "SSH-PTY konnte nicht geöffnet werden",
    escalated: "Langläufer-Befehl an Hintergrundaufgabe eskaliert",
  },
  widget: {
    title: "Terminal",
    back: "Zurück",
    machineLabel: "Maschine",
    machinePlaceholder: "/ssh/local-machine",
    placeholder: "Befehl eingeben...",
    runButton: "Ausführen",
    running: "Läuft...",
    clearButton: "Löschen",
    ctrlEnterHint: "Strg+Enter zum Ausführen",
    exitCodeLabel: "Exit-Code",
    backendLabel: "Backend",
    cwdLabel: "Arbeitsverzeichnis",
    terminalLabel: "Terminal",
    truncatedWarning: "Ausgabe gekürzt",
    emptyOutput: "Keine Ausgabe",
    outputLabel: "Ausgabe erscheint hier",
    outputTitle: "Ausgabe",
    historyTitle: "Verlauf",
    noHistory: "Noch keine Befehle",
    manageConnections: "Verbindungen",
    viewTerminals: "Terminals",
    successStatus: "Erfolg",
    failedStatus: "Fehlgeschlagen",
    picker: {
      browse: "Durchsuchen",
      cancel: "Abbrechen",
      machinesTitle: "Maschine wählen",
      machines: "Maschinen",
      loading: "Lädt...",
      noMachines: "Keine Maschinen konfiguriert",
      defaultBadge: "Standard",
      useDir: "Verzeichnis verwenden",
      emptyDir: "Leeres Verzeichnis",
    },
  },
};
