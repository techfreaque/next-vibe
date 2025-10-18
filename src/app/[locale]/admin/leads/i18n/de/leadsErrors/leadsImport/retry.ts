import type { translations as EnglishRetryTranslations } from "../../../en/leadsErrors/leadsImport/retry";

export const translations: typeof EnglishRetryTranslations = {
  success: {
    title: "Import-Job wiederholt",
    description:
      "Import-Job wurde zur Wiederholung in die Warteschlange eingereiht",
  },
  error: {
    unauthorized: {
      title: "Wiederholung des Import-Jobs nicht autorisiert",
      description: "Sie haben keine Berechtigung, Import-Jobs zu wiederholen",
    },
    forbidden: {
      title: "Wiederholung des Import-Jobs verboten",
      description:
        "Sie haben keine Berechtigung, diesen Import-Job zu wiederholen",
    },
    not_found: {
      title: "Import-Job nicht gefunden",
      description: "Der Import-Job konnte nicht gefunden werden",
    },
    validation: {
      title: "Import-Job kann nicht wiederholt werden",
      description:
        "Dieser Import-Job kann in seinem aktuellen Zustand nicht wiederholt werden",
    },
    server: {
      title: "Server-Fehler bei der Wiederholung des Import-Jobs",
      description:
        "Import-Job konnte aufgrund eines Server-Fehlers nicht wiederholt werden",
    },
  },
};
