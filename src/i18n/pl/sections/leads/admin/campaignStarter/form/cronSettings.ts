import type { cronSettingsTranslations as EnglishCronSettingsTranslations } from "../../../../../../en/sections/leads/admin/campaignStarter/form/cronSettings";

export const cronSettingsTranslations: typeof EnglishCronSettingsTranslations =
  {
    label: "Ustawienia Zadania Cron",
    description: "Konfiguruj ustawienia wykonywania zadania cron",
    schedule: {
      label: "Harmonogram",
      placeholder: "Wprowadź wyrażenie cron (np. */3 * * * *)",
    },
    timezone: {
      label: "Strefa Czasowa",
      placeholder: "Wprowadź strefę czasową (np. UTC)",
    },
    enabled: {
      label: "Włączone",
    },
    priority: {
      label: "Priorytet",
      options: {
        low: "Niski",
        normal: "Normalny",
        high: "Wysoki",
        critical: "Krytyczny",
      },
    },
    timeout: {
      label: "Limit Czasu (ms)",
      placeholder: "Wprowadź limit czasu w milisekundach",
    },
    retries: {
      label: "Ponowne Próby",
      placeholder: "Liczba prób ponowienia",
    },
    retryDelay: {
      label: "Opóźnienie Ponowienia (ms)",
      placeholder: "Opóźnienie między próbami w milisekundach",
    },
  };
