import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "IMAP-Konfiguration",
  description: "IMAP-Client-Konfigurationseinstellungen verwalten",
  category: "API Endpunkt",
  tags: {
    config: "Config",
  },
  form: {
    title: "IMAP-Konfigurationsformular",
    description: "IMAP-Client-Einstellungen konfigurieren",
  },
  response: {
    host: "Host",
    port: "Port",
    username: "Benutzername",
    password: "Passwort",
    tls: "TLS",
    autoReconnect: "Auto-Wiederverbindung",
    serverEnabled: "Server aktiviert",
    maxConnections: "Max. Verbindungen",
    connectionTimeout: "Verbindungs-Timeout",
    poolIdleTimeout: "Pool-Idle-Timeout",
    keepAlive: "Keep Alive",
    syncEnabled: "Sync aktiviert",
    syncInterval: "Sync-Intervall",
    batchSize: "Batch-Größe",
    maxMessages: "Max. Nachrichten",
    concurrentAccounts: "Gleichzeitige Konten",
    cacheEnabled: "Cache aktiviert",
    cacheTtl: "Cache TTL",
    cacheMaxSize: "Cache Max. Größe",
    memoryThreshold: "Speicherschwelle",
    maxRetries: "Max. Wiederholungen",
    retryDelay: "Wiederholungsverzögerung",
    circuitBreakerThreshold: "Circuit-Breaker-Schwelle",
    circuitBreakerTimeout: "Circuit-Breaker-Timeout",
    healthCheckInterval: "Gesundheitscheck-Intervall",
    metricsEnabled: "Metriken aktiviert",
    loggingLevel: "Logging-Level",
    rateLimitEnabled: "Rate-Limit aktiviert",
    rateLimitRequests: "Rate-Limit-Anfragen",
    rateLimitWindow: "Rate-Limit-Fenster",
    debugMode: "Debug-Modus",
    testMode: "Test-Modus",
  },
  serverEnabled: {
    label: "Server aktiviert",
    description: "IMAP-Server aktivieren oder deaktivieren",
  },
  maxConnections: {
    label: "Max. Verbindungen",
    description: "Maximale Anzahl gleichzeitiger Verbindungen",
  },
  connectionTimeout: {
    label: "Verbindungs-Timeout",
    description: "Verbindungs-Timeout in Millisekunden",
  },
  syncEnabled: {
    label: "Sync aktiviert",
    description: "Automatische Synchronisation aktivieren oder deaktivieren",
  },
  syncInterval: {
    label: "Sync-Intervall",
    description: "Zeitintervall zwischen Sync-Operationen in Minuten",
  },
  batchSize: {
    label: "Batch-Größe",
    description:
      "Anzahl der Nachrichten, die in jedem Batch verarbeitet werden",
  },
  loggingLevel: {
    label: "Logging-Level",
    description: "Logging-Detailgrad festlegen",
    placeholder: "Logging-Level auswählen",
  },
  debugMode: {
    label: "Debug-Modus",
    description: "Debug-Modus für detailliertes Logging aktivieren",
  },
  errors: {
    internal: {
      title: "Interner Fehler",
      description: "Ein interner Serverfehler ist aufgetreten",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Sie sind nicht berechtigt, auf diese Ressource zuzugreifen",
    },
  },
  update: {
    title: "IMAP-Konfiguration aktualisieren",
    description: "IMAP-Client-Konfigurationseinstellungen aktualisieren",
    success: {
      title: "Konfiguration aktualisiert",
      description: "IMAP-Konfiguration wurde erfolgreich aktualisiert",
    },
    form: {
      title: "Konfiguration aktualisieren",
      description: "IMAP-Konfigurationseinstellungen ändern",
    },
    response: {
      message: "IMAP-Konfiguration erfolgreich aktualisiert",
      success: "Konfiguration erfolgreich aktualisiert",
    },
    errors: {
      internal: {
        title: "Aktualisierung fehlgeschlagen",
        description: "Fehler beim Aktualisieren der IMAP-Konfiguration",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Konfigurationsdaten bereitgestellt",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie sind nicht berechtigt, diese Konfiguration zu aktualisieren",
      },
    },
  },
  widget: {
    title: "IMAP-Konfiguration",
    server: "Servereinstellungen",
    connection: "Verbindungseinstellungen",
    sync: "Synchronisierungseinstellungen",
    cache: "Cache-Einstellungen",
    resilience: "Ausfallsicherheitseinstellungen",
    monitoring: "Überwachungseinstellungen",
    submit: "Konfiguration speichern",
    submitting: "Speichern...",
  },
};
