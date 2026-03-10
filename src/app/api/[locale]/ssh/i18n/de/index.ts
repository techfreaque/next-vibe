export const translations = {
  category: "SSH",
  type: "SSH",

  enums: {
    authType: {
      password: "Passwort",
      privateKey: "Privater Schlüssel (PEM)",
      keyAgent: "SSH-Agent",
      local: "Lokaler Rechner",
    },
    shell: {
      bash: "/bin/bash",
      zsh: "/usr/bin/zsh",
      sh: "/bin/sh",
      fish: "/usr/bin/fish",
      dash: "/bin/dash",
      nologin: "/usr/sbin/nologin (kein Login)",
    },
  },

  errors: {
    localModeOnly: {
      title: "Nur im lokalen Modus",
      description: "Diese Funktion ist nur im LOCAL_MODE verfügbar",
    },
    adminOnly: {
      title: "Nur für Admins",
      description: "Nur Admins können auf Maschinenfunktionen zugreifen",
    },
    connectionNotFound: "Verbindung nicht gefunden",
    sessionNotFound: "Sitzung nicht gefunden",
    fileNotFound: "Datei nicht gefunden",
    directoryNotFound: "Verzeichnis nicht gefunden",
    permissionDenied: "Berechtigung verweigert",
    sshSecretKeyNotSet: "SSH_SECRET_KEY Umgebungsvariable nicht gesetzt.",
    encryptionFailed: "Verschlüsselung fehlgeschlagen",
    noRowReturned: "Kein Datensatz vom Insert zurückgegeben",
    notImplemented: {
      test: "SSH-Backend noch nicht implementiert. Verbindungstest nicht möglich.",
      local:
        "SSH-Backend noch nicht implementiert. connectionId leer lassen für lokale Ausführung.",
      fileList: "SSH-Backend für Dateilisting noch nicht implementiert",
      fileRead: "SSH-Backend für Dateilesen noch nicht implementiert",
      fileWrite: "SSH-Backend für Dateischreiben noch nicht implementiert",
      session: "SSH-PTY-Sitzungen noch nicht implementiert.",
    },
    fingerprintMismatch:
      "Host-Fingerabdruck hat sich geändert. Möglicher MITM-Angriff. acknowledgeNewFingerprint=true setzen.",
    noDefaultConnection:
      "Keine Standard-SSH-Verbindung konfiguriert. Verbindung erstellen und als Standard setzen.",
    sshConnectionFailed: "SSH-Verbindung fehlgeschlagen",
    sshAuthFailed: "SSH-Authentifizierung fehlgeschlagen",
    connectTimeout: "Verbindung hat Zeitlimit überschritten",
    invalidWorkingDir:
      "Ungültiges Arbeitsverzeichnis: muss absoluter Pfad ohne '..' sein",
    invalidPath: "Ungültiger Pfad: muss absolut ohne '..' sein",
    parentDirNotFound: "Übergeordnetes Verzeichnis nicht gefunden.",
    commandTimedOut: "Befehl hat Zeitlimit überschritten",
    cannotDeleteCurrentUser:
      "Der aktuelle Prozessbenutzer kann nicht gelöscht werden",
    cannotDeleteSystemUser:
      "Systembenutzer (uid < 1000) können nicht gelöscht werden",
    userNotFound: "Benutzer nicht gefunden",
    userAlreadyExists: "Benutzer existiert bereits",
    invalidUsername:
      "Ungültiger Benutzername: muss kleinbuchstabige alphanumerische Zeichen + Bindestrich enthalten",
  },

  session: {
    read: {
      get: {
        title: "SSH-Sitzungsausgabe lesen",
        description: "Gepufferte Ausgabe einer aktiven SSH-Sitzung lesen",
        fields: {
          sessionId: {
            label: "Sitzungs-ID",
            description: "ID der SSH-Sitzung zum Lesen",
          },
          waitMs: {
            label: "Warten (ms)",
            description: "Millisekunden auf Ausgabe warten",
          },
          maxBytes: {
            label: "Max. Bytes",
            description: "Maximale Anzahl zu lesender Bytes",
          },
        },
        response: {
          output: { title: "Ausgabe" },
          eof: { title: "EOF" },
          status: { title: "Status" },
        },
        success: {
          title: "Sitzungsausgabe gelesen",
          description: "Sitzungsausgabe erfolgreich gelesen",
        },
        errors: {
          validation: {
            title: "Validierungsfehler",
            description: "Ungültige Parameter",
          },
          unauthorized: {
            title: "Nicht autorisiert",
            description: "Authentifizierung erforderlich",
          },
          forbidden: {
            title: "Verboten",
            description: "Zugriff verweigert",
          },
          server: {
            title: "Serverfehler",
            description: "Fehler beim Lesen der Sitzungsausgabe",
          },
          notFound: {
            title: "Sitzung nicht gefunden",
            description: "SSH-Sitzung nicht gefunden",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Ein unerwarteter Fehler ist aufgetreten",
          },
          unsavedChanges: {
            title: "Nicht gespeicherte Änderungen",
            description: "Nicht gespeicherte Änderungen erkannt",
          },
          conflict: {
            title: "Konflikt",
            description: "Ein Konflikt ist aufgetreten",
          },
          network: {
            title: "Netzwerkfehler",
            description: "Netzwerkfehler aufgetreten",
          },
        },
      },
    },
    close: {
      post: {
        title: "SSH-Sitzung schließen",
        description: "Eine aktive SSH-Sitzung schließen",
        fields: {
          sessionId: {
            label: "Sitzungs-ID",
            description: "ID der zu schließenden SSH-Sitzung",
          },
        },
        response: {
          ok: { title: "Erfolg" },
        },
        success: {
          title: "Sitzung geschlossen",
          description: "SSH-Sitzung erfolgreich geschlossen",
        },
        errors: {
          validation: {
            title: "Validierungsfehler",
            description: "Ungültige Parameter",
          },
          unauthorized: {
            title: "Nicht autorisiert",
            description: "Authentifizierung erforderlich",
          },
          forbidden: {
            title: "Verboten",
            description: "Zugriff verweigert",
          },
          server: {
            title: "Serverfehler",
            description: "Fehler beim Schließen der Sitzung",
          },
          notFound: {
            title: "Sitzung nicht gefunden",
            description: "SSH-Sitzung nicht gefunden",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Ein unerwarteter Fehler ist aufgetreten",
          },
          unsavedChanges: {
            title: "Nicht gespeicherte Änderungen",
            description: "Nicht gespeicherte Änderungen erkannt",
          },
          conflict: {
            title: "Konflikt",
            description: "Ein Konflikt ist aufgetreten",
          },
          network: {
            title: "Netzwerkfehler",
            description: "Netzwerkfehler aufgetreten",
          },
        },
      },
    },
    write: {
      post: {
        title: "In SSH-Sitzung schreiben",
        description: "Eingabe in eine aktive SSH-Sitzung senden",
        fields: {
          sessionId: {
            label: "Sitzungs-ID",
            description: "ID der SSH-Sitzung zum Schreiben",
          },
          input: {
            label: "Eingabe",
            description: "Eingabetext an die Sitzung senden",
          },
          raw: {
            label: "Roh",
            description: "Eingabe als Rohbytes ohne Zeilenumbruch senden",
          },
        },
        response: {
          ok: { title: "Erfolg" },
        },
        success: {
          title: "Eingabe gesendet",
          description: "Eingabe erfolgreich in Sitzung geschrieben",
        },
        errors: {
          validation: {
            title: "Validierungsfehler",
            description: "Ungültige Parameter",
          },
          unauthorized: {
            title: "Nicht autorisiert",
            description: "Authentifizierung erforderlich",
          },
          forbidden: {
            title: "Verboten",
            description: "Zugriff verweigert",
          },
          server: {
            title: "Serverfehler",
            description: "Fehler beim Schreiben in die Sitzung",
          },
          notFound: {
            title: "Sitzung nicht gefunden",
            description: "SSH-Sitzung nicht gefunden",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Ein unerwarteter Fehler ist aufgetreten",
          },
          unsavedChanges: {
            title: "Nicht gespeicherte Änderungen",
            description: "Nicht gespeicherte Änderungen erkannt",
          },
          conflict: {
            title: "Konflikt",
            description: "Ein Konflikt ist aufgetreten",
          },
          network: {
            title: "Netzwerkfehler",
            description: "Netzwerkfehler aufgetreten",
          },
        },
      },
    },
    open: {
      post: {
        title: "SSH-Sitzung öffnen",
        description: "Eine interaktive SSH-Terminalsitzung öffnen",
        fields: {
          connectionId: {
            label: "Verbindungs-ID",
            description: "ID der zu verwendenden SSH-Verbindung",
          },
          name: {
            label: "Sitzungsname",
            description: "Optionaler Name für die Sitzung",
          },
          cols: {
            label: "Spalten",
            description: "Terminalbreite in Spalten",
          },
          rows: {
            label: "Zeilen",
            description: "Terminalhöhe in Zeilen",
          },
        },
        disconnected: "Getrennt",
        response: {
          sessionId: { title: "Sitzungs-ID" },
          status: { title: "Status" },
          shell: { title: "Shell" },
        },
        success: {
          title: "Sitzung geöffnet",
          description: "SSH-Sitzung erfolgreich geöffnet",
        },
        errors: {
          validation: {
            title: "Validierungsfehler",
            description: "Ungültige Parameter",
          },
          unauthorized: {
            title: "Nicht autorisiert",
            description: "Authentifizierung erforderlich",
          },
          forbidden: {
            title: "Verboten",
            description: "Zugriff verweigert",
          },
          server: {
            title: "Serverfehler",
            description: "Fehler beim Öffnen der Sitzung",
          },
          notFound: {
            title: "Verbindung nicht gefunden",
            description: "SSH-Verbindung nicht gefunden",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Ein unerwarteter Fehler ist aufgetreten",
          },
          unsavedChanges: {
            title: "Nicht gespeicherte Änderungen",
            description: "Nicht gespeicherte Änderungen erkannt",
          },
          conflict: {
            title: "Konflikt",
            description: "Ein Konflikt ist aufgetreten",
          },
          network: {
            title: "Netzwerkfehler",
            description: "Netzwerkfehler aufgetreten",
          },
        },
      },
    },
  },

  terminal: {
    get: {
      title: "SSH-Terminal",
      description: "Interaktives SSH-Terminal-Widget",
      response: {
        ok: { title: "Terminal bereit" },
      },
      success: {
        title: "Terminal bereit",
        description: "SSH-Terminal ist bereit",
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        server: { title: "Serverfehler", description: "Terminalfehler" },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        unsavedChanges: {
          title: "Nicht gespeicherte Änderungen",
          description: "Nicht gespeicherte Änderungen erkannt",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Ressource nicht gefunden",
        },
        conflict: {
          title: "Konflikt",
          description: "Ein Konflikt ist aufgetreten",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Netzwerkfehler aufgetreten",
        },
        validation: {
          title: "Validierungsfehler",
          description: "Validierung fehlgeschlagen",
        },
        forbidden: { title: "Verboten", description: "Zugriff verweigert" },
      },
    },
  },

  files: {
    read: {
      get: {
        title: "Remote-Datei lesen",
        description: "Inhalt einer Datei über SSH lesen",
        fields: {
          connectionId: {
            label: "Verbindungs-ID",
            description: "Zu verwendende SSH-Verbindung",
            placeholder: "uuid",
          },
          path: {
            label: "Dateipfad",
            description: "Absoluter Pfad zur Datei",
            placeholder: "/etc/hosts",
          },
          maxBytes: {
            label: "Max. Bytes",
            description: "Maximale Anzahl zu lesender Bytes",
            placeholder: "102400",
          },
          offset: {
            label: "Offset",
            description: "Byte-Offset, ab dem gelesen wird",
            placeholder: "0",
          },
        },
        response: {
          content: { title: "Inhalt" },
          size: { title: "Größe" },
          truncated: { title: "Abgeschnitten" },
          encoding: { title: "Kodierung" },
        },
        success: {
          title: "Datei gelesen",
          description: "Dateiinhalt erfolgreich abgerufen",
        },
        errors: {
          validation: {
            title: "Validierungsfehler",
            description: "Ungültige Parameter",
          },
          unauthorized: {
            title: "Nicht autorisiert",
            description: "Authentifizierung erforderlich",
          },
          forbidden: {
            title: "Verboten",
            description: "Zugriff verweigert",
          },
          server: {
            title: "Serverfehler",
            description: "Fehler beim Lesen der Datei",
          },
          notFound: {
            title: "Datei nicht gefunden",
            description: "Datei oder Verbindung nicht gefunden",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Ein unerwarteter Fehler ist aufgetreten",
          },
          unsavedChanges: {
            title: "Nicht gespeicherte Änderungen",
            description: "Nicht gespeicherte Änderungen erkannt",
          },
          conflict: {
            title: "Konflikt",
            description: "Ein Konflikt ist aufgetreten",
          },
          network: {
            title: "Netzwerkfehler",
            description: "Netzwerkfehler aufgetreten",
          },
        },
      },
    },
    list: {
      get: {
        title: "Remote-Dateien auflisten",
        description: "Dateien in einem Remote-Verzeichnis über SSH auflisten",
        fields: {
          connectionId: {
            label: "Verbindungs-ID",
            description: "Zu verwendende SSH-Verbindung",
            placeholder: "uuid",
          },
          path: {
            label: "Verzeichnispfad",
            description: "Absoluter Pfad zum Verzeichnis",
            placeholder: "/",
          },
        },
        response: {
          entries: { title: "Einträge" },
          currentPath: { title: "Aktueller Pfad" },
        },
        success: {
          title: "Verzeichnis aufgelistet",
          description: "Verzeichnisinhalt erfolgreich abgerufen",
        },
        errors: {
          validation: {
            title: "Validierungsfehler",
            description: "Ungültige Parameter",
          },
          unauthorized: {
            title: "Nicht autorisiert",
            description: "Authentifizierung erforderlich",
          },
          forbidden: {
            title: "Verboten",
            description: "Zugriff verweigert",
          },
          server: {
            title: "Serverfehler",
            description: "Fehler beim Auflisten des Verzeichnisses",
          },
          notFound: {
            title: "Nicht gefunden",
            description: "Verzeichnis oder Verbindung nicht gefunden",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Ein unerwarteter Fehler ist aufgetreten",
          },
          unsavedChanges: {
            title: "Nicht gespeicherte Änderungen",
            description: "Nicht gespeicherte Änderungen erkannt",
          },
          conflict: {
            title: "Konflikt",
            description: "Ein Konflikt ist aufgetreten",
          },
          network: {
            title: "Netzwerkfehler",
            description: "Netzwerkfehler aufgetreten",
          },
        },
      },
    },
    write: {
      post: {
        title: "Remote-Datei schreiben",
        description: "Inhalt in eine Datei über SSH schreiben",
        fields: {
          connectionId: {
            label: "Verbindungs-ID",
            description: "Zu verwendende SSH-Verbindung",
            placeholder: "uuid",
          },
          path: {
            label: "Dateipfad",
            description: "Absoluter Pfad zum Schreiben",
            placeholder: "/tmp/file.txt",
          },
          content: {
            label: "Inhalt",
            description: "Inhalt, der in die Datei geschrieben werden soll",
            placeholder: "Dateiinhalt",
          },
          createDirs: {
            label: "Verzeichnisse erstellen",
            description:
              "Übergeordnete Verzeichnisse erstellen, falls nicht vorhanden",
          },
        },
        response: {
          ok: { title: "Erfolg" },
          bytesWritten: { title: "Geschriebene Bytes" },
        },
        success: {
          title: "Datei geschrieben",
          description: "Datei erfolgreich geschrieben",
        },
        errors: {
          validation: {
            title: "Validierungsfehler",
            description: "Ungültige Parameter",
          },
          unauthorized: {
            title: "Nicht autorisiert",
            description: "Authentifizierung erforderlich",
          },
          forbidden: {
            title: "Verboten",
            description: "Zugriff verweigert",
          },
          server: {
            title: "Serverfehler",
            description: "Fehler beim Schreiben der Datei",
          },
          notFound: {
            title: "Nicht gefunden",
            description: "Pfad oder Verbindung nicht gefunden",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Ein unerwarteter Fehler ist aufgetreten",
          },
          unsavedChanges: {
            title: "Nicht gespeicherte Änderungen",
            description: "Nicht gespeicherte Änderungen erkannt",
          },
          conflict: {
            title: "Konflikt",
            description: "Ein Konflikt ist aufgetreten",
          },
          network: {
            title: "Netzwerkfehler",
            description: "Netzwerkfehler aufgetreten",
          },
        },
      },
    },
  },

  linux: {
    users: {
      list: {
        get: {
          title: "Linux-Benutzer auflisten",
          description:
            "Linux-Benutzer auf einem Remote-Server über SSH auflisten",
          response: {
            users: { title: "Benutzer" },
          },
          success: {
            title: "Benutzer aufgelistet",
            description: "Linux-Benutzer erfolgreich abgerufen",
          },
          errors: {
            validation: {
              title: "Validierungsfehler",
              description: "Validierung fehlgeschlagen",
            },
            unauthorized: {
              title: "Nicht autorisiert",
              description: "Authentifizierung erforderlich",
            },
            forbidden: {
              title: "Verboten",
              description: "Zugriff verweigert",
            },
            server: {
              title: "Serverfehler",
              description: "Fehler beim Auflisten der Benutzer",
            },
            notFound: {
              title: "Nicht gefunden",
              description: "Ressource nicht gefunden",
            },
            unknown: {
              title: "Unbekannter Fehler",
              description: "Ein unerwarteter Fehler ist aufgetreten",
            },
            unsavedChanges: {
              title: "Nicht gespeicherte Änderungen",
              description: "Nicht gespeicherte Änderungen erkannt",
            },
            conflict: {
              title: "Konflikt",
              description: "Ein Konflikt ist aufgetreten",
            },
            network: {
              title: "Netzwerkfehler",
              description: "Netzwerkfehler aufgetreten",
            },
          },
        },
      },
      username: {
        delete: {
          title: "Linux-Benutzer löschen",
          description:
            "Einen Linux-Benutzer von einem Remote-Server über SSH löschen",
          fields: {
            removeHome: {
              label: "Home entfernen",
              description: "Auch das Home-Verzeichnis des Benutzers entfernen",
            },
          },
          response: {
            ok: { title: "Erfolg" },
          },
          success: {
            title: "Benutzer gelöscht",
            description: "Linux-Benutzer erfolgreich gelöscht",
          },
          errors: {
            validation: {
              title: "Validierungsfehler",
              description: "Validierung fehlgeschlagen",
            },
            unauthorized: {
              title: "Nicht autorisiert",
              description: "Authentifizierung erforderlich",
            },
            forbidden: {
              title: "Verboten",
              description: "Zugriff verweigert",
            },
            server: {
              title: "Serverfehler",
              description: "Fehler beim Löschen des Benutzers",
            },
            notFound: {
              title: "Benutzer nicht gefunden",
              description: "Linux-Benutzer nicht gefunden",
            },
            unknown: {
              title: "Unbekannter Fehler",
              description: "Ein unerwarteter Fehler ist aufgetreten",
            },
            unsavedChanges: {
              title: "Nicht gespeicherte Änderungen",
              description: "Nicht gespeicherte Änderungen erkannt",
            },
            conflict: {
              title: "Konflikt",
              description: "Ein Konflikt ist aufgetreten",
            },
            network: {
              title: "Netzwerkfehler",
              description: "Netzwerkfehler aufgetreten",
            },
          },
        },
      },
      create: {
        post: {
          title: "Linux-Benutzer erstellen",
          description:
            "Einen Linux-Benutzer auf einem Remote-Server über SSH erstellen",
          fields: {
            username: {
              label: "Benutzername",
              description: "Benutzername für das neue Konto",
              placeholder: "deploy",
            },
            groups: {
              label: "Gruppen",
              description: "Zusätzliche Gruppen für den Benutzer",
              placeholder: "sudo,docker",
            },
            shell: {
              label: "Shell",
              description: "Login-Shell für den Benutzer",
              placeholder: "/bin/bash",
            },
            homeDir: {
              label: "Home-Verzeichnis",
              description: "Pfad zum Home-Verzeichnis",
              placeholder: "/home/deploy",
            },
            sudoAccess: {
              label: "Sudo-Zugriff",
              description: "Sudo-Zugriff für den Benutzer gewähren",
            },
          },
          response: {
            ok: { title: "Erfolg" },
            uid: { title: "UID" },
            gid: { title: "GID" },
            homeDirectory: { title: "Home-Verzeichnis" },
            shell: { title: "Shell" },
          },
          success: {
            title: "Benutzer erstellt",
            description: "Linux-Benutzer erfolgreich erstellt",
          },
          errors: {
            validation: {
              title: "Validierungsfehler",
              description: "Validierung fehlgeschlagen",
            },
            unauthorized: {
              title: "Nicht autorisiert",
              description: "Authentifizierung erforderlich",
            },
            forbidden: {
              title: "Verboten",
              description: "Zugriff verweigert",
            },
            server: {
              title: "Serverfehler",
              description: "Fehler beim Erstellen des Benutzers",
            },
            notFound: {
              title: "Nicht gefunden",
              description: "Verbindung nicht gefunden",
            },
            unknown: {
              title: "Unbekannter Fehler",
              description: "Ein unerwarteter Fehler ist aufgetreten",
            },
            unsavedChanges: {
              title: "Nicht gespeicherte Änderungen",
              description: "Nicht gespeicherte Änderungen erkannt",
            },
            conflict: {
              title: "Konflikt",
              description: "Ein Konflikt ist aufgetreten",
            },
            network: {
              title: "Netzwerkfehler",
              description: "Netzwerkfehler aufgetreten",
            },
          },
        },
      },
    },
  },

  exec: {
    post: {
      title: "SSH-Befehl ausführen",
      description: "Einen Befehl auf einem Remote-Server über SSH ausführen",
      fields: {
        connectionId: {
          label: "Verbindungs-ID",
          description: "Zu verwendende SSH-Verbindung",
          placeholder: "uuid",
        },
        command: {
          label: "Befehl",
          description: "Auszuführender Befehl",
          placeholder: "ls -la",
        },
        workingDir: {
          label: "Arbeitsverzeichnis",
          description: "Arbeitsverzeichnis für den Befehl",
          placeholder: "/home/user",
        },
        timeoutMs: {
          label: "Timeout (ms)",
          description: "Befehlstimeout in Millisekunden",
          placeholder: "30000",
        },
      },
      response: {
        stdout: { title: "Stdout" },
        stderr: { title: "Stderr" },
        exitCode: { title: "Exit-Code" },
        status: { title: "Status" },
        durationMs: { title: "Dauer (ms)" },
        backend: { title: "Backend" },
        truncated: { title: "Abgeschnitten" },
      },
      success: {
        title: "Befehl ausgeführt",
        description: "Befehl erfolgreich ausgeführt",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Parameter",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        forbidden: { title: "Verboten", description: "Zugriff verweigert" },
        server: {
          title: "Serverfehler",
          description: "Befehlsausführung fehlgeschlagen",
        },
        notFound: {
          title: "Verbindung nicht gefunden",
          description: "SSH-Verbindung nicht gefunden",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        unsavedChanges: {
          title: "Nicht gespeicherte Änderungen",
          description: "Nicht gespeicherte Änderungen erkannt",
        },
        conflict: {
          title: "Konflikt",
          description: "Ein Konflikt ist aufgetreten",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Netzwerkfehler aufgetreten",
        },
      },
    },
  },

  connections: {
    id: {
      get: {
        title: "SSH-Verbindung abrufen",
        description: "Details einer SSH-Verbindung abrufen",
        response: {
          id: { title: "ID" },
          label: { title: "Bezeichnung" },
          host: { title: "Host" },
          port: { title: "Port" },
          username: { title: "Benutzername" },
          authType: { title: "Authentifizierungstyp" },
          isDefault: { title: "Standard" },
          fingerprint: { title: "Fingerabdruck" },
          notes: { title: "Notizen" },
          createdAt: { title: "Erstellt am" },
        },
        success: {
          title: "Verbindung gefunden",
          description: "SSH-Verbindung erfolgreich abgerufen",
        },
        errors: {
          validation: {
            title: "Validierungsfehler",
            description: "Validierung fehlgeschlagen",
          },
          unauthorized: {
            title: "Nicht autorisiert",
            description: "Authentifizierung erforderlich",
          },
          forbidden: {
            title: "Verboten",
            description: "Zugriff verweigert",
          },
          server: {
            title: "Serverfehler",
            description: "Fehler beim Abrufen der Verbindung",
          },
          notFound: {
            title: "Verbindung nicht gefunden",
            description: "SSH-Verbindung nicht gefunden",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Ein unerwarteter Fehler ist aufgetreten",
          },
          unsavedChanges: {
            title: "Nicht gespeicherte Änderungen",
            description: "Nicht gespeicherte Änderungen erkannt",
          },
          conflict: {
            title: "Konflikt",
            description: "Ein Konflikt ist aufgetreten",
          },
          network: {
            title: "Netzwerkfehler",
            description: "Netzwerkfehler aufgetreten",
          },
        },
      },
    },
    list: {
      get: {
        title: "SSH-Verbindungen auflisten",
        description: "Alle SSH-Verbindungen auflisten",
        response: {
          connections: { title: "Verbindungen" },
        },
        success: {
          title: "Verbindungen aufgelistet",
          description: "SSH-Verbindungen erfolgreich abgerufen",
        },
        errors: {
          validation: {
            title: "Validierungsfehler",
            description: "Validierung fehlgeschlagen",
          },
          unauthorized: {
            title: "Nicht autorisiert",
            description: "Authentifizierung erforderlich",
          },
          forbidden: {
            title: "Verboten",
            description: "Zugriff verweigert",
          },
          server: {
            title: "Serverfehler",
            description: "Fehler beim Auflisten der Verbindungen",
          },
          notFound: {
            title: "Nicht gefunden",
            description: "Keine Verbindungen gefunden",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Ein unerwarteter Fehler ist aufgetreten",
          },
          unsavedChanges: {
            title: "Nicht gespeicherte Änderungen",
            description: "Nicht gespeicherte Änderungen erkannt",
          },
          conflict: {
            title: "Konflikt",
            description: "Ein Konflikt ist aufgetreten",
          },
          network: {
            title: "Netzwerkfehler",
            description: "Netzwerkfehler aufgetreten",
          },
        },
      },
    },
    create: {
      post: {
        title: "SSH-Verbindung erstellen",
        description: "Eine neue SSH-Verbindung erstellen",
        fields: {
          label: {
            label: "Bezeichnung",
            description: "Anzeigename für die Verbindung",
            placeholder: "prod-web-01",
          },
          host: {
            label: "Host",
            description: "SSH-Server-Hostname oder IP",
            placeholder: "192.168.1.1",
          },
          port: {
            label: "Port",
            description: "SSH-Server-Port",
            placeholder: "22",
          },
          username: {
            label: "Benutzername",
            description: "SSH-Benutzername",
            placeholder: "deploy",
          },
          authType: {
            label: "Authentifizierungstyp",
            description: "Authentifizierungsmethode",
          },
          secret: {
            label: "Geheimnis",
            description: "Passwort oder privater Schlüssel",
          },
          passphrase: {
            label: "Passphrase",
            description: "Passphrase für den privaten Schlüssel (falls nötig)",
          },
          isDefault: {
            label: "Standard",
            description: "Als Standardverbindung festlegen",
          },
          notes: {
            label: "Notizen",
            description: "Optionale Notizen zu dieser Verbindung",
          },
        },
        response: {
          id: { title: "ID" },
        },
        success: {
          title: "Verbindung erstellt",
          description: "SSH-Verbindung erfolgreich erstellt",
        },
        errors: {
          validation: {
            title: "Validierungsfehler",
            description: "Ungültige Verbindungsparameter",
          },
          unauthorized: {
            title: "Nicht autorisiert",
            description: "Authentifizierung erforderlich",
          },
          forbidden: {
            title: "Verboten",
            description: "Zugriff verweigert",
          },
          server: {
            title: "Serverfehler",
            description: "Fehler beim Erstellen der Verbindung",
          },
          notFound: {
            title: "Nicht gefunden",
            description: "Ressource nicht gefunden",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Ein unerwarteter Fehler ist aufgetreten",
          },
          unsavedChanges: {
            title: "Nicht gespeicherte Änderungen",
            description: "Nicht gespeicherte Änderungen erkannt",
          },
          conflict: {
            title: "Konflikt",
            description: "Ein Konflikt ist aufgetreten",
          },
          network: {
            title: "Netzwerkfehler",
            description: "Netzwerkfehler aufgetreten",
          },
        },
      },
    },
    test: {
      post: {
        title: "SSH-Verbindung testen",
        description: "Eine SSH-Verbindung testen",
        fields: {
          connectionId: {
            label: "Verbindungs-ID",
            description: "ID der zu testenden SSH-Verbindung",
            placeholder: "uuid",
          },
          acknowledgeNewFingerprint: {
            label: "Fingerabdruck bestätigen",
            description: "Neuen Host-Fingerabdruck bestätigen",
            placeholder: "false",
          },
        },
        response: {
          ok: { title: "Erfolg" },
          latencyMs: { title: "Latenz (ms)" },
          fingerprint: { title: "Fingerabdruck" },
          fingerprintChanged: { title: "Fingerabdruck geändert" },
        },
        success: {
          title: "Verbindung erfolgreich",
          description: "SSH-Verbindungstest bestanden",
        },
        errors: {
          validation: {
            title: "Validierungsfehler",
            description: "Ungültige Testparameter",
          },
          unauthorized: {
            title: "Nicht autorisiert",
            description: "Authentifizierung erforderlich",
          },
          forbidden: {
            title: "Verboten",
            description: "Zugriff verweigert",
          },
          server: {
            title: "Serverfehler",
            description: "Verbindungstest fehlgeschlagen",
          },
          notFound: {
            title: "Verbindung nicht gefunden",
            description: "SSH-Verbindung nicht gefunden",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Ein unerwarteter Fehler ist aufgetreten",
          },
          unsavedChanges: {
            title: "Nicht gespeicherte Änderungen",
            description: "Nicht gespeicherte Änderungen erkannt",
          },
          conflict: {
            title: "Konflikt",
            description: "Ein Konflikt ist aufgetreten",
          },
          network: {
            title: "Netzwerkfehler",
            description: "Netzwerkfehler aufgetreten",
          },
        },
      },
    },
  },
};
