import type { timezoneTranslations as EnglishTimezoneTranslations } from "../../../../en/sections/common/calendar/timezone";

export const timezoneTranslations: typeof EnglishTimezoneTranslations = {
  label: "Strefa czasowa",
  current: "Aktualna strefa czasowa",
  select: "Wybierz strefę czasową",
  zones: {
    DE: "Europe/Berlin",
    PL: "Europe/Warsaw",
    global: "UTC",
  },
  options: {
    "Europe/Berlin": {
      label: "Berlin (CET/CEST)",
      country: "Niemcy",
      flag: "🇩🇪",
    },
    "Europe/Warsaw": {
      label: "Warszawa (CET/CEST)",
      country: "Polska",
      flag: "🇵🇱",
    },
    "UTC": {
      label: "UTC (Uniwersalny Czas Koordynowany)",
      country: "Globalny",
      flag: "🌐",
    },
    "America/New_York": {
      label: "Nowy Jork (EST/EDT)",
      country: "Stany Zjednoczone",
      flag: "🇺🇸",
    },
    "America/Los_Angeles": {
      label: "Los Angeles (PST/PDT)",
      country: "Stany Zjednoczone",
      flag: "🇺🇸",
    },
    "Asia/Dubai": {
      label: "Dubaj (GST)",
      country: "ZEA",
      flag: "🇦🇪",
    },
  },
};
