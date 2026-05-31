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
    connected: {
      title: "Mit Cloud-Konto verbunden",
      badge: "Aktiv",
      description:
        "Deine Erinnerungen und KI-Tools synchronisieren sich automatisch mit deinem Cloud-Konto.",
      connectedTo: "Verbunden mit",
      lastSynced: "Zuletzt synchronisiert",
      refresh: "Aktualisieren",
      reauth: "Erneut authentifizieren",
      rename: "Umbenennen",
      settings: "Einstellungen",
      disconnect: "Trennen",
    },
    notConnected: {
      title: "Cloud-Konto verbinden",
      description:
        "Verbinde dich mit deinem Cloud-Konto (z.B. unbottled.ai), um deine Erinnerungen zu synchronisieren und KI-Tools von überall zu nutzen.",
      benefit1:
        "Deine Erinnerungen synchronisieren sich automatisch zwischen diesem Gerät und deinem Cloud-Konto",
      benefit2: "KI-Tools von der Kommandozeile nutzen mit",
      benefit2Code: "vibe --remote",
      benefit3: "Dein Cloud-Konto und deine lokale Instanz bleiben synchron",
    },
  },
  get: {
    title: "Fernverbindungsstatus",
    description: "Status einer bestimmten Fernverbindung abrufen",
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
    description:
      "Transport, Loop und Sync-Einstellungen für diese Verbindung konfigurieren",
    isSystemProvider: {
      label: "System-Provider",
      description:
        "Diese Verbindung als Reverse-WS-Provider für Remote-Tool-Dispatch verwenden",
    },
    loopLocation: {
      label: "KI-Loop-Standort",
      description:
        "Wo der KI-Inferenz-Loop läuft. Client: lokaler Rechner übernimmt den Loop. Server: Remote-Instanz übernimmt ihn.",
    },
    threadMirrorMode: {
      label: "Thread-Speicherung",
      description:
        "Wo Threads im Ordner dieser Verbindung gespeichert werden. Cloud: nur Cloud. Lokal: nur lokal. Beide: gespiegelt. Keine: kein Speicher.",
    },
    toolSource: {
      label: "Tool-Quelle",
      description:
        "Welche Tools in KI-Streams dieser Verbindung verfügbar sind. Lokal: deine lokalen Tools. Remote: nur Remote-Tools. Beide: beide zusammengeführt.",
    },
    routingRules: {
      label: "Routing-Regeln",
      description:
        "Deklarative Routing-Regeln: Ordner-IDs, deren KI-Streams hierher geleitet werden, von dieser Verbindung unterstützte Modellanbieter und ob sie als Standard-Fallback gilt.",
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
        description: "Adminrolle erforderlich",
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
      description:
        "System-Provider-Einstellung aktualisiert und Connector neu geladen",
    },
  },
};
