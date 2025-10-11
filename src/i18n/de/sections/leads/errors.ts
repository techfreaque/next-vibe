import type { errorsTranslations as EnglishErrorsTranslations } from "../../../en/sections/leads/errors";

export const errorsTranslations: typeof EnglishErrorsTranslations = {
  create: {
    conflict: {
      title: "Lead existiert bereits",
      description:
        "Ein Lead mit dieser E-Mail-Adresse existiert bereits im System.",
    },
    validation: {
      title: "Ungültige Lead-Daten",
      description:
        "Bitte überprüfen Sie die Lead-Informationen und versuchen Sie es erneut.",
    },
  },
  get: {
    notFound: {
      title: "Lead nicht gefunden",
      description: "Der angeforderte Lead konnte nicht gefunden werden.",
    },
  },
  update: {
    notFound: {
      title: "Lead nicht gefunden",
      description:
        "Der Lead, den Sie zu aktualisieren versuchen, konnte nicht gefunden werden.",
    },
    validation: {
      title: "Ungültige Update-Daten",
      description:
        "Bitte überprüfen Sie die Update-Informationen und versuchen Sie es erneut.",
    },
  },
  import: {
    badRequest: {
      title: "Ungültige CSV-Datei",
      description: "Das CSV-Dateiformat ist ungültig oder leer.",
    },
    validation: {
      title: "CSV-Validierungsfehler",
      description: "Einige Zeilen in der CSV-Datei enthalten ungültige Daten.",
    },
  },
};
