import type { settingsTranslations as EnglishSettingsTranslations } from "../../../../../en/sections/admin/dashboard/cron/settings";

export const settingsTranslations: typeof EnglishSettingsTranslations = {
  execution: {
    title: "Ustawienia Wykonania",
    maxConcurrentTasks: "Maksymalna Liczba Równoczesnych Zadań",
    defaultTimeout: "Domyślny Timeout (ms)",
    maxRetries: "Maksymalna Liczba Ponownych Prób",
    retryDelay: "Opóźnienie Ponownej Próby (ms)",
  },
  system: {
    title: "Ustawienia Systemu",
    systemTimezone: "Strefa Czasowa Systemu",
    logRetentionDays: "Przechowywanie Logów (dni)",
    enableLogging: "Włącz Logowanie",
    enableNotifications: "Włącz Powiadomienia",
    cleanupOldLogs: "Automatyczne Czyszczenie Starych Logów",
    maintenanceMode: "Tryb Konserwacji",
  },
  actions: {
    resetToDefaults: "Przywróć Domyślne",
    saveSettings: "Zapisz Ustawienia",
    saving: "Zapisywanie...",
  },
};
