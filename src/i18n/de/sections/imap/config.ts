import type { configTranslations as EnglishConfigTranslations } from "../../../en/sections/imap/config";

export const configTranslations: typeof EnglishConfigTranslations = {
  resetConfirm:
    "Sind Sie sicher, dass Sie alle Konfigurationen auf die Standardwerte zurücksetzen möchten? Diese Aktion kann nicht rückgängig gemacht werden.",
  server: {
    enabled: "Server aktiviert",
    maxConnections: "Maximale Verbindungen",
    connectionTimeout: "Verbindungs-Timeout (ms)",
    poolIdleTimeout: "Pool-Leerlauf-Timeout (ms)",
    keepAlive: "Verbindung aufrechterhalten",
  },
  sync: {
    enabled: "Synchronisation aktiviert",
    interval: "Synchronisationsintervall (Sekunden)",
    batchSize: "Batch-Größe",
    maxMessages: "Maximale Nachrichten",
    concurrentAccounts: "Gleichzeitige Konten",
  },
  performance: {
    cacheEnabled: "Cache aktiviert",
    cacheTtl: "Cache TTL (ms)",
    cacheMaxSize: "Cache maximale Größe",
    memoryThreshold: "Speicherschwelle (%)",
  },
  resilience: {
    maxRetries: "Maximale Wiederholungen",
    retryDelay: "Wiederholungsverzögerung (ms)",
    circuitBreakerThreshold: "Circuit-Breaker-Schwelle",
    circuitBreakerTimeout: "Circuit-Breaker-Timeout (ms)",
  },
  monitoring: {
    healthCheckInterval: "Gesundheitsprüfungsintervall (ms)",
    metricsEnabled: "Metriken aktiviert",
    loggingLevel: "Protokollierungsebene",
  },
  development: {
    debugMode: "Debug-Modus",
    testMode: "Test-Modus",
  },
  messages: {
    validation: {
      failed: "Konfigurationsvalidierung fehlgeschlagen",
    },
    update: {
      success: "Konfiguration erfolgreich aktualisiert",
      failed: "Fehler beim Aktualisieren der Konfiguration",
    },
    reset: {
      success: "Konfiguration erfolgreich auf Standardwerte zurückgesetzt",
      failed: "Fehler beim Zurücksetzen der Konfiguration",
    },
    export: {
      success: "Konfiguration erfolgreich exportiert",
      failed: "Fehler beim Exportieren der Konfiguration",
    },
    import: {
      invalid: "Importierte Konfiguration ist ungültig",
      failed: "Fehler beim Importieren der Konfiguration",
    },
    errors: {
      unknown_key: "Unbekannter Konfigurationsschlüssel",
      invalid_boolean: "muss ein Boolean sein",
      invalid_number: "muss eine Zahl sein",
      invalid_string: "muss eine Zeichenkette sein",
      min_value: "muss mindestens sein",
      max_value: "darf höchstens sein",
      invalid_enum: "muss einer von sein",
      unknown_error: "Unbekannter Fehler",
    },
  },
};
