import type { settingsTranslations as EnglishSettingsTranslations } from "../../../../../en/sections/admin/dashboard/cron/settings";

export const settingsTranslations: typeof EnglishSettingsTranslations = {
  execution: {
    title: "Ausführungseinstellungen",
    maxConcurrentTasks: "Max. gleichzeitige Aufgaben",
    defaultTimeout: "Standard-Timeout (ms)",
    maxRetries: "Max. Wiederholungen",
    retryDelay: "Wiederholungsverzögerung (ms)",
  },
  system: {
    title: "Systemeinstellungen",
    systemTimezone: "System-Zeitzone",
    logRetentionDays: "Log-Aufbewahrungstage",
    enableLogging: "Protokollierung aktivieren",
    enableNotifications: "Benachrichtigungen aktivieren",
    cleanupOldLogs: "Alte Logs bereinigen",
    maintenanceMode: "Wartungsmodus",
  },
  actions: {
    resetToDefaults: "Auf Standard zurücksetzen",
    saveSettings: "Einstellungen speichern",
    saving: "Speichern...",
  },
};
