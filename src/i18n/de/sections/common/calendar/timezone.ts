import type { timezoneTranslations as EnglishTimezoneTranslations } from "../../../../en/sections/common/calendar/timezone";

export const timezoneTranslations: typeof EnglishTimezoneTranslations = {
  label: "Zeitzone",
  current: "Aktuelle Zeitzone",
  select: "Zeitzone auswählen",
  zones: {
    DE: "Europe/Berlin",
    PL: "Europe/Warsaw",
    global: "UTC",
  },
  options: {
    "Europe/Berlin": {
      label: "Berlin (CET/CEST)",
      country: "Deutschland",
      flag: "🇩🇪",
    },
    "Europe/Warsaw": {
      label: "Warschau (CET/CEST)",
      country: "Polen",
      flag: "🇵🇱",
    },
    "UTC": {
      label: "UTC (Koordinierte Weltzeit)",
      country: "Global",
      flag: "🌐",
    },
    "America/New_York": {
      label: "New York (EST/EDT)",
      country: "Vereinigte Staaten",
      flag: "🇺🇸",
    },
    "America/Los_Angeles": {
      label: "Los Angeles (PST/PDT)",
      country: "Vereinigte Staaten",
      flag: "🇺🇸",
    },
    "Asia/Dubai": {
      label: "Dubai (GST)",
      country: "VAE",
      flag: "🇦🇪",
    },
  },
};
