import type { deleteTranslations as EnglishDeleteTranslations } from "../../../../en/sections/leadsErrors/leadsImport/delete";

export const deleteTranslations: typeof EnglishDeleteTranslations = {
  success: {
    title: "Import-Job gelöscht",
    description: "Import-Job wurde erfolgreich gelöscht",
  },
  error: {
    unauthorized: {
      title: "Löschen des Import-Jobs nicht autorisiert",
      description: "Sie haben keine Berechtigung, Import-Jobs zu löschen",
    },
    forbidden: {
      title: "Löschen des Import-Jobs verboten",
      description: "Sie haben keine Berechtigung, diesen Import-Job zu löschen",
    },
    not_found: {
      title: "Import-Job nicht gefunden",
      description: "Der Import-Job konnte nicht gefunden werden",
    },
    server: {
      title: "Server-Fehler beim Löschen des Import-Jobs",
      description:
        "Import-Job konnte aufgrund eines Server-Fehlers nicht gelöscht werden",
    },
  },
};
