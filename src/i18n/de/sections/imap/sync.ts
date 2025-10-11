import type { syncTranslations as EnglishSyncTranslations } from "../../../en/sections/imap/sync";

export const syncTranslations: typeof EnglishSyncTranslations = {
  title: "E-Mail-Synchronisation",
  start: "Synchronisation starten",
  stop: "Synchronisation stoppen",
  pause: "Synchronisation pausieren",
  resume: "Synchronisation fortsetzen",
  manual: "Manuelle Synchronisation",
  controlPanel: "Sync-Kontrollpanel",
  currentStatus: "Aktueller Status",
  lastSync: "Letzte Synchronisation",
  nextSync: "Nächste Synchronisation",
  currentOperation: "Aktuelle Operation",
  progress: "Sync-Fortschritt",
  idle: "Inaktiv",
  timeAgo: "vor {{time}}",
  timeIn: "in {{time}}",
  status: {
    synced: "Synchronisiert",
    syncing: "Synchronisiert",
    pending: "Ausstehend",
    error: "Fehler",
    unknown: "Unbekannt",
  },
  statistics: {
    totalSyncsToday: "Synchronisationen heute",
    successfulSyncs: "Erfolgreiche Synchronisationen",
    failedSyncs: "Fehlgeschlagene Synchronisationen",
    avgDuration: "Durchschnittsdauer",
  },
  history: {
    title: "Letzte Synchronisationshistorie",
    startTime: "Startzeit",
    status: "Status",
    duration: "Dauer",
    accounts: "Konten",
    folders: "Ordner",
    messages: "Nachrichten",
    errors: "Fehler",
  },
  performance: {
    responseTime: "Antwortzeit",
    throughput: "Durchsatz",
    errorRate: "Fehlerrate",
    queueSize: "Warteschlangengröße",
  },
  folders: {
    success: "Ordner erfolgreich synchronisiert",
  },
  messages: {
    accounts: {
      success: "Konten erfolgreich synchronisiert",
      successWithErrors: "Konten mit Fehlern synchronisiert",
    },
    account: {
      success: "Konto erfolgreich synchronisiert",
      successWithErrors: "Konto mit Fehlern synchronisiert",
    },
    folders: {
      success: "Ordner erfolgreich synchronisiert",
      successWithErrors: "Ordner mit Fehlern synchronisiert",
    },
    messages: {
      success: "Nachrichten erfolgreich synchronisiert",
      successWithErrors: "Nachrichten mit Fehlern synchronisiert",
    },
    cancel: {
      success: "Synchronisationsvorgänge erfolgreich abgebrochen",
    },
  },
  errors: {
    account_failed: "Konto-Synchronisation fehlgeschlagen",
    folder_sync_failed: "Ordner-Synchronisation fehlgeschlagen",
    message_sync_failed: "Nachrichten-Synchronisation fehlgeschlagen",
    message_sync_error: "Fehler bei der Nachrichten-Synchronisation",
    folder_error: "Fehler bei der Ordner-Verarbeitung",
    unknown_error: "Unbekannter Synchronisationsfehler",
    sync_cancelled: "Synchronisation wurde abgebrochen",
  },
};
