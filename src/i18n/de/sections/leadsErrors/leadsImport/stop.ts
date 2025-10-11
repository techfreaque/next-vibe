import type { stopTranslations as EnglishStopTranslations } from "../../../../en/sections/leadsErrors/leadsImport/stop";

export const stopTranslations: typeof EnglishStopTranslations = {
  success: {
    title: "Import-Job gestoppt",
    description: "Import-Job wurde erfolgreich gestoppt",
  },
  error: {
    unauthorized: {
      title: "Stoppen des Import-Jobs nicht autorisiert",
      description: "Sie haben keine Berechtigung, Import-Jobs zu stoppen",
    },
    forbidden: {
      title: "Stoppen des Import-Jobs verboten",
      description: "Sie haben keine Berechtigung, diesen Import-Job zu stoppen",
    },
    not_found: {
      title: "Import-Job nicht gefunden",
      description: "Der Import-Job konnte nicht gefunden werden",
    },
    validation: {
      title: "Import-Job kann nicht gestoppt werden",
      description:
        "Dieser Import-Job kann in seinem aktuellen Zustand nicht gestoppt werden",
    },
    server: {
      title: "Server-Fehler beim Stoppen des Import-Jobs",
      description:
        "Import-Job konnte aufgrund eines Server-Fehlers nicht gestoppt werden",
    },
  },
};
