export const translations = {
  category: "SSH",

  enums: {
    shell: {
      bash: "/bin/bash",
      zsh: "/usr/bin/zsh",
      sh: "/bin/sh",
      fish: "/usr/bin/fish",
      dash: "/bin/dash",
      nologin: "Kein Login-Shell",
    },
  },

  errors: {
    localModeOnly: {
      title: "Nur im lokalen Modus verfügbar",
    },
    invalidUsername:
      "Ungültiger Benutzername: Muss mit einem Buchstaben beginnen, dann Kleinbuchstaben, Ziffern oder Bindestriche (max. 32 Zeichen)",
    userAlreadyExists: "Ein Benutzer mit diesem Namen existiert bereits",
    connectionNotFound: "SSH-Verbindung nicht gefunden",
    encryptionFailed:
      "Verschlüsselung fehlgeschlagen — SSH_SECRET_KEY möglicherweise ungültig",
    connectTimeout: "Verbindung hat Zeitlimit überschritten",
    sshAuthFailed: "SSH-Authentifizierung fehlgeschlagen",
    sshConnectionFailed: "SSH-Verbindung fehlgeschlagen",
    fingerprintMismatch:
      "Host-Fingerabdruck hat sich geändert. Möglicher MITM-Angriff. Bestätigen Sie, um fortzufahren.",
  },

  post: {
    title: "Linux-Benutzer erstellen",
    description:
      "Neues OS-Benutzerkonto erstellen. Führt useradd auf dem Zielhost aus. Nur für Admins.",
    fields: {
      connectionId: {
        label: "SSH-Verbindung",
        description:
          "Auf welchem Server der Benutzer erstellt werden soll. Leer lassen für die Standardverbindung oder lokalen Modus.",
        placeholder: "Verbindung wählen…",
      },
      username: {
        label: "Benutzername",
        description:
          "Muss mit einem Buchstaben beginnen, dann Kleinbuchstaben, Ziffern oder Bindestriche. Max. 32 Zeichen.",
        placeholder: "alice",
      },
      groups: {
        label: "Zusätzliche Gruppen",
        description:
          "Optionale zusätzliche Gruppen für den Benutzer (kommagetrennt). Beispiel: docker, www-data.",
        placeholder: "docker,www-data",
      },
      shell: {
        label: "Login-Shell",
        description: "Die Shell, die bei interaktivem Login geöffnet wird.",
      },
      homeDir: {
        label: "Heimverzeichnis",
        description:
          "Pfad für das Heimverzeichnis. Standard: /home/<Benutzername>, wenn leer gelassen.",
        placeholder: "/home/alice",
      },
      sudoAccess: {
        label: "Sudo-Zugang gewähren",
        description:
          "Benutzer zur sudo-Gruppe hinzufügen, damit er Befehle als Root ausführen kann. Mit Vorsicht verwenden.",
      },
    },
    response: {
      ok: { title: "Erfolgreich" },
      uid: { title: "UID" },
      gid: { title: "GID" },
      homeDirectory: { title: "Heimverzeichnis" },
      shell: { title: "Shell" },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Felder prüfen und erneut versuchen",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Admin-Zugang erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Lokaler Modus ist auf diesem Server nicht aktiviert",
      },
      server: {
        title: "Serverfehler",
        description: "Benutzerkonto konnte nicht erstellt werden",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "SSH-Verbindung nicht gefunden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Unerwarteter Fehler aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: {
        title: "Benutzername bereits vergeben",
        description:
          "Ein Benutzer mit diesem Namen existiert bereits auf dem Server",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Server konnte nicht erreicht werden",
      },
      timeout: { title: "Timeout", description: "Zeitlimit überschritten" },
    },
    success: {
      title: "Benutzer erstellt",
      description: "OS-Benutzerkonto erfolgreich erstellt",
    },
    submitButton: {
      text: "Benutzer erstellen",
      loadingText: "Erstellt…",
    },
  },
  widget: {
    title: "Linux-Benutzer erstellen",
    createButton: "Benutzer erstellen",
    creating: "Erstellt…",
    sudoWarning:
      "Sudo-Zugang zu gewähren gibt dem Benutzer Root-Rechte. Nur bei vollständigem Vertrauen.",
  },
};
