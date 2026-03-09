export const translations = {
  category: "SSH",

  errors: {
    invalidWorkingDir:
      "Ungültiges Arbeitsverzeichnis: Muss absoluter Pfad ohne '..' sein",
    commandTimedOut: "Befehl hat das Zeitlimit überschritten",
    connectionNotFound: "Verbindung nicht gefunden",
    encryptionFailed:
      "Verschlüsselung fehlgeschlagen — SSH_SECRET_KEY möglicherweise ungültig",
    connectTimeout: "Verbindung hat Zeitlimit überschritten",
    sshAuthFailed: "SSH-Authentifizierung fehlgeschlagen",
    sshConnectionFailed: "SSH-Verbindung fehlgeschlagen",
    fingerprintMismatch:
      "Host-Fingerabdruck hat sich geändert. Möglicher MITM-Angriff. acknowledgeNewFingerprint=true setzen.",
    notImplemented: {
      local:
        "SSH-Backend noch nicht implementiert. Lassen Sie connectionId leer für lokale Ausführung.",
    },
  },

  post: {
    title: "Befehl ausführen",
    description:
      "Shell-Befehl auf dem lokalen Rechner oder einer SSH-Verbindung ausführen",
    fields: {
      connectionId: {
        label: "Verbindung",
        description:
          "SSH-Verbindung. Leer lassen für lokale Ausführung als aktueller Benutzer.",
        placeholder: "Lokal (aktueller Benutzer)",
      },
      command: {
        label: "Befehl",
        description: "Auszuführender Shell-Befehl",
        placeholder: "ls -la",
      },
      workingDir: {
        label: "Arbeitsverzeichnis",
        description: "Verzeichnis, in dem der Befehl ausgeführt wird",
        placeholder: "/home/benutzer",
      },
      timeoutMs: {
        label: "Timeout (ms)",
        description: "Maximale Wartezeit für den Befehl",
        placeholder: "30000",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Befehlsparameter",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Admin-Zugang erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Keine Berechtigung zum Ausführen von Befehlen",
      },
      server: {
        title: "Serverfehler",
        description: "Befehl konnte nicht ausgeführt werden",
      },
      timeout: {
        title: "Timeout",
        description: "Befehl hat das Zeitlimit überschritten",
      },
      notFound: {
        title: "Verbindung nicht gefunden",
        description: "SSH-Verbindung nicht gefunden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: { title: "Nicht gespeicherte Änderungen" },
      conflict: { title: "Konflikt", description: "Konflikt aufgetreten" },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
    },
    success: {
      title: "Befehl ausgeführt",
      description: "Befehl erfolgreich abgeschlossen",
    },
  },
  widget: {
    title: "Befehlsausführer",
    runButton: "Ausführen",
    clearButton: "Leeren",
    running: "Läuft...",
    localLabel: "Lokal (aktueller Benutzer)",
    connectionLabel: "Verbindung",
    workingDirLabel: "Arbeitsverzeichnis",
    timeoutLabel: "Timeout",
    outputLabel: "Ausgabe",
    stdoutLabel: "stdout",
    stderrLabel: "stderr",
    exitCodeLabel: "Exit-Code",
    durationLabel: "Dauer",
    backendLabel: "Backend",
    emptyOutput: "Keine Ausgabe",
    truncatedWarning: "Ausgabe wurde abgeschnitten.",
    historyLabel: "Verlauf",
    noHistory: "Noch keine Befehle ausgeführt",
    placeholder: "Befehl eingeben...",
    ctrlEnterHint: "Strg+Enter zum Ausführen",
  },
};
