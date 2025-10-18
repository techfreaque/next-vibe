import type { translations as EnglishGetTranslations } from "../../../en/leadsErrors/leadsImport/get";

export const translations: typeof EnglishGetTranslations = {
  success: {
    title: "Import-Aufträge erfolgreich abgerufen",
    description: "Import-Auftragsliste geladen",
  },
  error: {
    validation: {
      title: "Ungültige Import-Auftragsanfrage",
      description: "Bitte überprüfen Sie Ihre Anfrageparameter",
    },
    unauthorized: {
      title: "Import-Aufträge-Zugriff nicht autorisiert",
      description: "Sie haben keine Berechtigung, Import-Aufträge anzuzeigen",
    },
    server: {
      title: "Import-Aufträge Serverfehler",
      description:
        "Import-Aufträge konnten aufgrund eines Serverfehlers nicht abgerufen werden",
    },
    unknown: {
      title: "Import-Aufträge-Abruf fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler beim Abrufen der Import-Aufträge ist aufgetreten",
    },
  },
};
