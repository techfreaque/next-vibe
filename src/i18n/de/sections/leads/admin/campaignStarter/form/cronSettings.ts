import type { cronSettingsTranslations as EnglishCronSettingsTranslations } from "../../../../../../en/sections/leads/admin/campaignStarter/form/cronSettings";

export const cronSettingsTranslations: typeof EnglishCronSettingsTranslations =
  {
    label: "Cron-Aufgaben-Einstellungen",
    description: "Konfigurieren Sie die Ausführungseinstellungen des Cron-Jobs",
    schedule: {
      label: "Zeitplan",
      placeholder: "Cron-Ausdruck eingeben (z.B. */3 * * * *)",
    },
    timezone: {
      label: "Zeitzone",
      placeholder: "Zeitzone eingeben (z.B. UTC)",
    },
    enabled: {
      label: "Aktiviert",
    },
    priority: {
      label: "Priorität",
      options: {
        low: "Niedrig",
        normal: "Normal",
        high: "Hoch",
        critical: "Kritisch",
      },
    },
    timeout: {
      label: "Timeout (ms)",
      placeholder: "Timeout in Millisekunden eingeben",
    },
    retries: {
      label: "Wiederholungen",
      placeholder: "Anzahl der Wiederholungsversuche",
    },
    retryDelay: {
      label: "Wiederholungsverzögerung (ms)",
      placeholder: "Verzögerung zwischen Wiederholungen in Millisekunden",
    },
  };
