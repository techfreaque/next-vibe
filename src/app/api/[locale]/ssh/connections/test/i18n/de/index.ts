export const translations = {
  category: "SSH",

  errors: {
    connectionNotFound: "Verbindung nicht gefunden",
    encryptionFailed:
      "Verschlüsselung fehlgeschlagen - JWT_SECRET_KEY möglicherweise ungültig",
    connectTimeout: "Verbindung hat Zeitlimit überschritten",
    sshAuthFailed: "SSH-Authentifizierung fehlgeschlagen",
    sshConnectionFailed: "SSH-Verbindung fehlgeschlagen",
    fingerprintMismatch:
      "Host-Fingerabdruck hat sich geändert. Möglicher MITM-Angriff. acknowledgeNewFingerprint=true setzen.",
    notImplemented: {
      test: "SSH-Backend noch nicht implementiert. Fernverbindungen können noch nicht getestet werden.",
    },
  },

  post: {
    title: "SSH-Verbindung testen",
    description: "Verbindung zu einem SSH-Server testen",
    fields: {
      connectionId: {
        label: "Verbindungs-ID",
        description: "Zu testende SSH-Verbindung",
        placeholder: "",
      },
      acknowledgeNewFingerprint: {
        label: "Neuen Fingerprint bestätigen",
        description: "Fingerprint-Änderung akzeptieren",
        placeholder: "",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Parameter",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Admin-Zugriff erforderlich",
      },
      forbidden: { title: "Verboten", description: "Keine Berechtigung" },
      server: { title: "Serverfehler", description: "Test fehlgeschlagen" },
      notFound: {
        title: "Nicht gefunden",
        description: "Verbindung nicht gefunden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: { title: "Nicht gespeicherte Änderungen" },
      conflict: {
        title: "Fingerprint geändert",
        description:
          "Der Fingerprint des Servers hat sich seit der letzten Verbindung geändert",
      },
      network: {
        title: "Netzwerkfehler",
        description: "SSH-Server nicht erreichbar",
      },
      timeout: {
        title: "Timeout",
        description: "Verbindung hat das Zeitlimit überschritten",
      },
    },
    success: {
      title: "Verbindung erfolgreich",
      description: "SSH-Verbindungstest bestanden",
    },
  },
  widget: {
    title: "Verbindung testen",
    testButton: "Jetzt testen",
    testing: "Teste...",
    successLabel: "Verbunden",
    failedLabel: "Fehlgeschlagen",
    latencyLabel: "Latenz",
    fingerprintLabel: "Fingerprint",
  },
};
