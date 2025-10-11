import type { adminTranslations as EnglishAdminTranslations } from "../../../en/sections/imap/admin";

export const adminTranslations: typeof EnglishAdminTranslations = {
  overview: {
    title: "IMAP-Server-Übersicht",
    description: "IMAP-Server-Status und -Leistung überwachen",
    dashboard: {
      title: "Server-Dashboard",
    },
  },
  accounts: {
    title: "IMAP-Kontenverwaltung",
    description: "IMAP-Konten verwalten und überwachen",
    management: {
      title: "Kontenverwaltung",
    },
  },
  folders: {
    title: "IMAP-Ordnerverwaltung",
    description: "IMAP-Ordner verwalten und überwachen",
    management: {
      title: "Ordnerverwaltung",
    },
    stats: {
      title: "Ordnerstatistiken",
    },
    no_folders: "Keine Ordner für dieses Konto gefunden",
  },
  messages: {
    title: "IMAP-Nachrichtenverwaltung ({{count}})",
    description: "IMAP-Nachrichten anzeigen und verwalten",
    filters: "Nachrichtenfilter",
    management: {
      title: "Nachrichtenverwaltung",
    },
    error: {
      title: "Fehler beim Laden der Nachrichten: {{error}}",
    },
    actions: {
      markAsRead: "Als gelesen markieren",
      markAsUnread: "Als ungelesen markieren",
      toggleFlag: "Markierung umschalten",
      delete: "Löschen",
      move: "Verschieben",
      copy: "Kopieren",
    },
    selected: "{{count}} Nachrichten ausgewählt",
    no_messages: "Keine Nachrichten gefunden",
    pagination: {
      showing: "Zeige {{start}}-{{end}} von {{total}} Nachrichten",
    },
    statistics: "Nachrichtenstatistiken",
  },
  config: {
    title: "IMAP-Server-Konfiguration",
    description: "IMAP-Server-Einstellungen konfigurieren",
    settings: {
      title: "Konfigurationseinstellungen",
    },
    resilience: {
      title: "Ausfallsicherheitseinstellungen",
    },
    monitoring: {
      title: "Überwachungseinstellungen",
    },
    development: {
      title: "Entwicklungseinstellungen",
    },
    status: {
      title: "Konfigurationsstatus",
    },
  },
  sync: {
    title: "IMAP-Synchronisationsvorgänge",
    description: "E-Mail-Synchronisation überwachen und verwalten",
    operations: {
      title: "Synchronisationsvorgänge",
    },
  },
  health: {
    title: "IMAP-Gesundheitsüberwachung",
    description: "Server-Gesundheit und Leistungsmetriken überwachen",
    monitoring: {
      title: "Gesundheitsüberwachung",
    },
    error: {
      title: "Fehler beim Laden der Gesundheitsdaten",
    },
    errors: "Fehler",
    serverStatus: "Server-Status",
    uptime: "Betriebszeit",
    lastUpdate: "Zuletzt aktualisiert {{time}}",
    lastHealthCheck: "Letzte Gesundheitsprüfung",
    responseTime: "Antwortzeit",
    memoryUsage: "Speicherverbrauch",
    cpuUsage: "CPU-Auslastung",
    diskUsage: "Festplattenverbrauch",
    activeConnections: "Aktive Verbindungen",
    connections: "{{count}} Verbindungen",
    accounts: "{{healthy}}/{{total}} Konten",
    accountHealthSummary: "Konto-Gesundheitsübersicht",
    healthyAccounts: "Gesunde Konten",
    failedAccounts: "Fehlgeschlagene Konten",
    syncedAccounts: "Synchronisierte Konten",
    systemResources: "Systemressourcen",
    version: "Version",
    lastRestart: "Letzter Neustart",
    connectedAccounts: "Verbundene Konten",
    disconnectedAccounts: "Getrennte Konten",
    statusValues: {
      healthy: "Gesund",
      warning: "Warnung",
      error: "Fehler",
      offline: "Offline",
    },
    uptimeValues: {
      zero: "0 Tage, 0 Stunden",
    },
    lastCheckValues: {
      never: "Nie",
    },
  },
  status: {
    title: "IMAP-Server-Status",
    description: "Echtzeit-Server- und Kontostatus-Überwachung",
    monitoring: {
      title: "Status-Überwachung",
    },
    accountStatusDetails: "Konto-Status-Details",
  },
};
