import type { warningsTranslations as EnglishWarningsTranslations } from "../../../../../../en/sections/templateApiImport/templateApi/import/form/warnings";

export const warningsTranslations: typeof EnglishWarningsTranslations = {
  title: "Validierungswarnungen",
  description: "Überprüfen Sie die folgenden Warnungen, bevor Sie fortfahren",
  csvMinRows: "CSV sollte mindestens eine Kopfzeile und eine Datenzeile haben",
  csvInconsistentColumns:
    "{{count}} Zeilen haben inkonsistente Spaltenanzahlen",
  jsonArrayRequired: "JSON sollte ein Array von Vorlagenobjekten sein",
  jsonArrayEmpty: "JSON-Array ist leer",
  jsonMissingFields: "{{count}} Elemente fehlen das erforderliche 'name'-Feld",
  xmlMalformed:
    "XML-Struktur möglicherweise fehlerhaft (nicht übereinstimmende Tags)",
};
