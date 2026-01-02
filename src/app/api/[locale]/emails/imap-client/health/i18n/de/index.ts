import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "IMAP-Client",
  tags: {
    health: "Gesundheit",
    monitoring: "Überwachung",
  },
  get: {
    title: "IMAP Gesundheitsstatus Abrufen",
    description: "Aktuellen IMAP-Server Gesundheitsstatus und Metriken abrufen",
    form: {
      title: "IMAP Gesundheitsstatus Anfrage",
      description: "Anfrageformular für IMAP-Server Gesundheitsüberwachung",
    },
    response: {
      title: "IMAP Gesundheitsstatus Antwort",
      description: "Aktueller IMAP-Server Gesundheitsstatus und Leistungsmetriken",
      data: {
        title: "Gesundheitsdaten",
        description: "Gesundheitsstatus-Daten und Metriken",
        accountsHealthy: "Gesunde Konten",
        accountsTotal: "Gesamte Konten",
        connectionsActive: "Aktive Verbindungen",
        connectionErrors: "Verbindungsfehler",
        lastSyncAt: "Letzte Synchronisation",
      },
      message: "Gesundheitsstatus erfolgreich abgerufen",
    },
  },
  health: {
    get: {
      title: "IMAP Gesundheitsstatus Abrufen",
      description: "Aktuellen IMAP-Server Gesundheitsstatus und Metriken abrufen",
      form: {
        title: "IMAP Gesundheitsstatus Anfrage",
        description: "Anfrageformular für IMAP-Server Gesundheitsüberwachung",
      },
      response: {
        title: "IMAP Gesundheitsstatus Antwort",
        description: "Aktueller IMAP-Server Gesundheitsstatus und Leistungsmetriken",
        success: "Erfolgreich",
        message: "Gesundheitsstatus erfolgreich abgerufen",
        data: {
          title: "Gesundheitsdaten",
          description: "Gesundheitsstatus-Daten und Metriken",
          status: "Gesundheitsstatus",
          accountsHealthy: "Gesunde Konten",
          accountsTotal: "Gesamte Konten",
          connectionsActive: "Aktive Verbindungen",
          connectionErrors: "Verbindungsfehler",
          lastSyncAt: "Letzte Synchronisation",
          syncStats: {
            title: "Synchronisationsstatistiken",
            description: "Synchronisationsstatistiken und Metriken",
            totalSyncs: "Gesamtsynchronisationen",
            lastSyncTime: "Letzte Synchronisationszeit",
          },
          serverStatus: "Serverstatus",
          uptime: "Betriebszeit",
          syncedAccounts: "Synchronisierte Konten",
          totalAccounts: "Gesamtkonten",
          activeConnections: "Aktive Verbindungen",
          performanceMetrics: {
            title: "Leistungsmetriken",
            description: "Leistungsmetriken und Statistiken",
            avgResponseTime: "Durchschnittliche Antwortzeit",
          },
        },
      },
      errors: {
        unauthorized: {
          title: "Nicht Autorisiert",
          description: "Authentifizierung erforderlich für Zugriff auf IMAP-Gesundheitsstatus",
        },
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Anfrageparameter bereitgestellt",
        },
        server: {
          title: "Server Fehler",
          description: "Interner Serverfehler beim Abrufen des Gesundheitsstatus",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unbekannter Fehler ist aufgetreten",
        },
        network: {
          title: "Netzwerk Fehler",
          description: "Netzwerkfehler beim Abrufen des Gesundheitsstatus",
        },
        forbidden: {
          title: "Verboten",
          description: "Zugriff auf IMAP-Gesundheitsstatus ist verboten",
        },
        notFound: {
          title: "Nicht Gefunden",
          description: "IMAP-Gesundheitsstatus nicht gefunden",
        },
        unsavedChanges: {
          title: "Nicht Gespeicherte Änderungen",
          description:
            "Es gibt nicht gespeicherte Änderungen, die zuerst gespeichert werden müssen",
        },
        conflict: {
          title: "Konflikt",
          description: "Datenkonflikt beim Abrufen des Gesundheitsstatus",
        },
      },
      success: {
        title: "Erfolg",
        description: "IMAP-Gesundheitsstatus erfolgreich abgerufen",
      },
    },
  },
};
