import type { errorsTranslations as EnglishErrorsTranslations } from "../../../../../../en/sections/templateApiImport/templateApi/import/form/errors";

export const errorsTranslations: typeof EnglishErrorsTranslations = {
  title: "Import fehlgeschlagen",
  description: "Beim Importieren Ihrer Vorlagen ist ein Fehler aufgetreten",
  validation: {
    title: "Validierungsfehler",
    description:
      "Bitte überprüfen Sie Ihr Datenformat und versuchen Sie es erneut",
  },
  server: {
    title: "Server-Fehler",
    description: "Während des Imports ist ein unerwarteter Fehler aufgetreten",
  },
  fileFormat: {
    title: "Ungültiges Dateiformat",
    description: "Das ausgewählte Format stimmt nicht mit Ihren Daten überein",
  },
  dataEmpty: {
    title: "Keine Daten",
    description: "Import-Daten können nicht leer sein",
  },
  csvFormat: {
    title: "Ungültiges CSV-Format",
    description: "CSV-Daten sollten Kommas und Zeilenumbrüche enthalten",
  },
  jsonFormat: {
    title: "Ungültiges JSON-Format",
    description: "Die bereitgestellten JSON-Daten sind nicht gültig",
  },
  xmlFormat: {
    title: "Ungültiges XML-Format",
    description: "XML-Daten sollten gültige XML-Tags enthalten",
  },
  unsupported_format: "Nicht unterstütztes Format",
  csv_min_rows: "CSV muss Kopfzeile und mindestens eine Datenzeile haben",
  xml_not_implemented: "XML-Parsing ist in dieser Demo nicht implementiert",
  missing_required_fields:
    "Fehlende Pflichtfelder: Name und Inhalt sind erforderlich",
  invalid_status: "Ungültiger Status",
  database_error: "Datenbankfehler aufgetreten: {{error}}",
};
