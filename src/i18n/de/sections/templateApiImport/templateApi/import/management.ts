import type { managementTranslations as EnglishManagementTranslations } from "../../../../../en/sections/templateApiImport/templateApi/import/management";

export const managementTranslations: typeof EnglishManagementTranslations = {
  meta: {
    title: "Vorlagen-Import-Verwaltung - Import-Verlauf verwalten",
    description:
      "Anzeigen und Verwalten Ihres Vorlagen-Import-Verlaufs, Fortschritt verfolgen und Massenoperationen durchführen.",
    category: "Vorlagen-Import-Verwaltung",
    imageAlt: "Vorlagen-Import-Verwaltungs-Dashboard",
    keywords: {
      templateManagement: "Vorlagenverwaltung",
      importHistory: "Import-Verlauf",
      bulkOperations: "Massenoperationen",
      importTracking: "Import-Verfolgung",
      templateDashboard: "Vorlagen-Dashboard",
    },
  },
  title: "Import-Verwaltung",
  description:
    "Verwalten Sie Ihre Vorlagen-Imports und zeigen Sie den Verlauf an",
  history: {
    title: "Import-Verlauf",
    description: "Zeigen Sie alle Ihre vorherigen Vorlagen-Imports an",
    empty: "Keine Imports gefunden",
    columns: {
      date: "Datum",
      format: "Format",
      status: "Status",
      records: "Datensätze",
      actions: "Aktionen",
    },
  },
  actions: {
    view: "Details anzeigen",
    download: "Ergebnisse herunterladen",
    retry: "Import wiederholen",
    cancel: "Import abbrechen",
    delete: "Löschen",
  },
};
