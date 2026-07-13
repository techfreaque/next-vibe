import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "System",
  tags: {
    remoteSync: "Remote-Synchronisation",
  },
  taskSync: {
    post: {
      title: "Remote-Synchronisation",
      titleShort: "Sync",
      description:
        "Cursorbasierte bidirektionale Synchronisation zwischen Instanzen.",
      instanceId: {
        label: "Instanz-ID",
        description: "Bezeichner der aufrufenden Instanz",
      },
      syncCursors: {
        label: "Sync-Cursor",
        description:
          "Pro-Domain-Cursor für die letzte Synchronisationsposition",
      },
      capabilitiesVersion: {
        label: "Capabilities-Version",
        description: "Aktueller Capabilities-Hash der aufrufenden Instanz",
      },
      senderCapabilitiesVersion: {
        label: "Sender-Capabilities-Version",
        description:
          "Version des eigenen Capability-Snapshots der aufrufenden Instanz",
      },
      capabilitiesJson: {
        label: "Capabilities-JSON",
        description: "Tool-Manifest zur Registrierung auf dieser Instanz",
      },
      pushPayloads: {
        label: "Push-Daten",
        description:
          "Datensätze des Aufrufers seit seinen Push-Cursorn — werden vor der Antwort angewendet (bidirektionales Push-Pull)",
      },
      syncPayloads: {
        label: "Sync-Daten",
        description: "Datensätze nach dem Cursor, pro Domain",
      },
      syncCounts: {
        label: "Sync-Anzahl",
        description: "Anzahl zurückgegebener Datensätze pro Domain",
      },
      remoteCursors: {
        label: "Remote-Cursor",
        description: "Aktuelle Cursor dieser Instanz",
      },
      remoteCapabilitiesVersion: {
        label: "Remote-Capabilities-Version",
        description: "Aktuelle Capabilities-Version dieser Instanz",
      },
      capabilities: {
        label: "Capabilities",
        description: "Tool-Manifest dieser Instanz",
      },
      serverTime: {
        label: "Serverzeit",
        description: "Aktueller Zeitstempel des Servers",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Sync-Anfrage",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        internal: {
          title: "Sync-Fehler",
          description: "Fehler bei der Synchronisation",
        },
        forbidden: {
          title: "Verboten",
          description: "Keine Berechtigung zur Synchronisation",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Sync-Ziel nicht gefunden",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Sync-Endpunkt nicht erreichbar",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        unsaved: {
          title: "Ungespeicherte Änderungen",
          description: "Es gibt ungespeicherte Änderungen",
        },
        conflict: {
          title: "Konflikt",
          description: "Sync-Konflikt erkannt",
        },
      },
      success: {
        title: "Synchronisiert",
        description: "Synchronisation erfolgreich abgeschlossen",
      },
    },
  },
};
