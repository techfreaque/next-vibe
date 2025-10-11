import type { getTranslations as EnglishGetTranslations } from "../../../../en/sections/leadsErrors/leadsExport/get";

export const getTranslations: typeof EnglishGetTranslations = {
  error: {
    validation: {
      title: "Lead-Export-Validierung fehlgeschlagen",
      description:
        "Bitte überprüfen Sie Ihre Export-Parameter und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Lead-Export nicht autorisiert",
      description: "Sie haben keine Berechtigung zum Exportieren von Leads",
    },
    server: {
      title: "Lead-Export-Serverfehler",
      description:
        "Leads können aufgrund eines Serverfehlers nicht exportiert werden",
    },
    unknown: {
      title: "Lead-Export fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Exportieren von Leads aufgetreten",
    },
  },
  success: {
    title: "Leads exportiert",
    description: "Leads erfolgreich exportiert",
  },
};
