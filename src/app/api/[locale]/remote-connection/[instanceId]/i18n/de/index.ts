import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Konto",
  tags: {
    remoteConnection: "Fernverbindung",
  },
  widget: {
    title: "Fernverbindung",
    signInDescription:
      "Melde dich an, um deine Fernverbindung zu konfigurieren",
    back: "Zurück",
    statusSection: "Status",
    connected: {
      title: "Verbunden",
      badge: "Aktiv",
      connectedTo: "Remote-URL",
      transport: "Transport (ausgehend)",
      remoteTransport: "Transport (eingehend)",
      remoteInstance: "Remote-Instanz",
      capabilities: "Capability-Version",
      lastSynced: "Erstsynchronisierung",
      wsConnected: "Verbunden seit",
      refresh: "Aktualisieren",
      transportReverseWs: "Reverse WS (Tunnel)",
      transportDirectHttp: "Direkt HTTP",
    },
    notConnected: {
      title: "Nicht verbunden",
      description:
        "Verbinde dich mit deinem Cloud-Konto (z.B. unbottled.ai), um Erinnerungen zu synchronisieren und KI-Tools von überall aus dem Terminal zu nutzen.",
      benefit1:
        "Erinnerungen synchronisieren sich automatisch zwischen diesem Gerät und deinem Cloud-Konto",
      benefit2: "KI-Tools von der Kommandozeile nutzen mit",
      benefit2Code: "vibe --thea",
      benefit3: "Lokal und Cloud bleiben synchron",
    },
    behaviorSection: "Verhalten",
    syncSection: "Sync & Zugriff",
    syncScope: {
      memories: "Erinnerungen",
      documents: "Dokumente",
      skills: "Skills",
      favorites: "Favoriten",
      threads: "Threads",
    },
    cortexSection: "Cortex",
    cortexDescription: "Gemeinsames Dateisystem dieser Verbindung durchsuchen.",
    cortexLink: "Cortex öffnen",
    sshSection: "SSH & Terminal",
    sshDescription:
      "SSH-Konfigurationen und Terminalsitzungen über diese Verbindung.",
    sshLink: "SSH-Verbindungen öffnen",
    reauthButton: "Erneut authentifizieren",
    renameButton: "Umbenennen",
    editButton: "Bearbeiten",
    disconnectButton: "Trennen",
    disconnectConfirmTitle: "Diese Instanz trennen?",
    disconnectConfirmDescription:
      "Die Verbindung wird entfernt. Du kannst sie jederzeit neu aufbauen.",
    disconnectConfirmCancel: "Abbrechen",
    disconnectConfirmProceed: "Trennen",
    state: {
      tunnelActive: "Tunnel offen",
      bridgeActive: "Verbunden",
      degraded: "Verbindung instabil",
      connectionLost: "Verbindung unterbrochen",
      inactive: "Inaktiv",
      connectedSince: "Seit",
      initialSync: "Synchronisiert",
    },
    reconnectButton: "Neu verbinden",
    edit: {
      identitySection: "Name",
      reauthSection: "Erneut authentifizieren",
      transportSection: "Transport",
      behaviorSection: "Verhalten",
    },
  },
  get: {
    title: "Fernverbindungsstatus",
    titleShort: "Verbindung",
    description:
      "Vollständiger Status und Einstellungen einer bestimmten Fernverbindung",
    instanceId: {
      label: "Instanz-ID",
      description: "Die Verbindungsinstanz, die angezeigt werden soll",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Du musst angemeldet sein, um deine Verbindung zu sehen",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Du hast keine Berechtigung, dies zu sehen",
      },
      notFound: {
        title: "Nicht verbunden",
        description: "Keine Fernverbindung für diese Instanz gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Fehler beim Abrufen deiner Verbindung",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Du hast ungespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist aufgetreten",
      },
    },
    success: {
      title: "Verbindung abgerufen",
      description: "Fernverbindungsstatus erfolgreich abgerufen",
    },
  },
  patch: {
    title: "Fernverbindung aktualisieren",
    titleShort: "Verbindung ändern",
    description:
      "Umbenennen, neu authentifizieren oder Transport- und Sync-Einstellungen konfigurieren",
    newInstanceId: {
      label: "Neuer Name",
      description:
        "Verbindung umbenennen. Aktualisiert die lokale Bezeichnung und wird mit dem Remote synchronisiert.",
    },
    email: {
      label: "E-Mail",
      description: "Deine Konto-E-Mail auf der Remote-Instanz",
    },
    password: {
      label: "Passwort",
      description: "Dein Konto-Passwort auf der Remote-Instanz",
    },
    transportMode: {
      label: "Transportmodus",
      description:
        "Wie diese Verbindung kommuniziert. reverse-ws: persistente ausgehende WS (öffnet sofort beim Speichern). direct-http: direkte HTTP-Aufrufe.",
      options: {
        reverseWs: "Reverse WS",
        directHttp: "Direkt HTTP",
      },
    },
    remoteTransportMode: {
      label: "Ihr Transportmodus",
      description:
        "Wie die Gegenstelle diese Seite erreicht. reverse-ws: wir halten einen ausgehenden Connector, um ihre Sendungen zu empfangen. direct-http: sie senden an unsere Bridge.",
    },
    isInferenceProvider: {
      label: "Inferenz-Provider",
      description:
        "Diese Verbindung als KI-Inferenz-Provider zulassen — die Remote-Instanz führt den LLM-Loop über Reverse-WS aus.",
    },
    forceSystemProvider: {
      label: "System-Provider erzwingen",
      description:
        "Admin-Override: Alle KI-Streams durch diese Verbindung leiten, unabhängig von Kosten oder Benutzerregeln. Nur eine Verbindung gleichzeitig.",
    },
    threadMirrorMode: {
      label: "Thread-Spiegelung",
      description:
        "Ob Threads zwischen dieser und der verbundenen Instanz synchronisiert werden. 'both' spiegelt in beide Richtungen; 'off' belässt jeden Thread dort, wo er erstellt wurde.",
      options: {
        both: "In beide Richtungen spiegeln",
        off: "Keine Spiegelung",
      },
    },
    loopLocation: {
      label: "Loop-Standort",
      description:
        "Wo der KI-Loop eines Remote-Threads läuft. 'target' führt ihn auf der verbundenen Instanz aus (Standard); 'caller' hält den Loop hier, Tools laufen weiterhin remote.",
      options: {
        target: "Auf der verbundenen Instanz",
        caller: "Auf dieser Instanz",
      },
    },
    syncScope: {
      label: "Sync-Umfang",
      description:
        "Welche Datenprovider über diese Verbindung synchronisiert werden: Erinnerungen, Dokumente, Skills, Favoriten, Threads.",
      memories: "Erinnerungen",
      documents: "Dokumente",
      skills: "Skills",
      favorites: "Favoriten",
      threads: "Threads",
    },
    reconnectNow: {
      label: "Jetzt neu verbinden",
      description:
        "Verbindung trennen und neu aufbauen — löst die Pull-on-Connect-Synchronisation aus.",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrage",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Authentifizierung erforderlich",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Adminrolle für dieses Feld erforderlich",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Verbindung nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Aktualisierung fehlgeschlagen",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Du hast ungespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist aufgetreten",
      },
    },
    success: {
      title: "Verbindung aktualisiert",
      description: "Einstellungen erfolgreich gespeichert",
    },
  },
  delete: {
    title: "Trennen",
    titleShort: "Trennen",
    description:
      "Diese Fernverbindung entfernen und den WebSocket-Kanal schließen",
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrage",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Authentifizierung erforderlich",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Keine Berechtigung",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Verbindung nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Trennen fehlgeschlagen",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Du hast ungespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist aufgetreten",
      },
    },
    success: {
      title: "Getrennt",
      description: "Fernverbindung erfolgreich entfernt",
    },
  },
};
