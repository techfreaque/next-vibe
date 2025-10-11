export const cronSettingsTranslations = {
  label: "Cron Task Settings",
  description: "Configure the cron job execution settings",
  schedule: {
    label: "Schedule",
    placeholder: "Enter cron expression (e.g., */3 * * * *)",
  },
  timezone: {
    label: "Timezone",
    placeholder: "Enter timezone (e.g., UTC)",
  },
  enabled: {
    label: "Enabled",
  },
  priority: {
    label: "Priority",
    options: {
      low: "Low",
      normal: "Normal",
      high: "High",
      critical: "Critical",
    },
  },
  timeout: {
    label: "Timeout (ms)",
    placeholder: "Enter timeout in milliseconds",
  },
  retries: {
    label: "Retries",
    placeholder: "Number of retry attempts",
  },
  retryDelay: {
    label: "Retry Delay (ms)",
    placeholder: "Delay between retries in milliseconds",
  },
};
