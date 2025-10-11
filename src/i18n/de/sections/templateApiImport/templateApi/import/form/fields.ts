import type { fieldsTranslations as EnglishFieldsTranslations } from "../../../../../../en/sections/templateApiImport/templateApi/import/form/fields";

export const fieldsTranslations: typeof EnglishFieldsTranslations = {
  format: {
    label: "Import-Format",
    placeholder: "Import-Format auswählen",
    description: "Wählen Sie das Format Ihrer Import-Daten",
    options: {
      csv: "CSV (Komma-getrennte Werte)",
      json: "JSON (JavaScript Object Notation)",
      xml: "XML (Extensible Markup Language)",
    },
  },
  mode: {
    label: "Import-Modus",
    placeholder: "Import-Modus auswählen",
    description:
      "Wählen Sie, wie mit vorhandenen Vorlagen umgegangen werden soll",
    options: {
      createonly: "Nur erstellen - Vorhandene Vorlagen überspringen",
      updateonly: "Nur aktualisieren - Nur vorhandene Vorlagen aktualisieren",
      createorupdate:
        "Erstellen oder aktualisieren - Neue erstellen und vorhandene aktualisieren",
    },
  },
  data: {
    label: "Import-Daten",
    placeholder: "Fügen Sie hier Ihre CSV-, JSON- oder XML-Daten ein...",
    description: "Die zu importierenden Vorlagendaten",
    help: "Stellen Sie sicher, dass Ihre Daten dem korrekten Format für den ausgewählten Import-Typ entsprechen",
  },
  validateOnly: {
    label: "Nur validieren",
    description: "Nur die Daten validieren, ohne zu importieren",
    help: "Verwenden Sie dies, um Ihr Datenformat zu überprüfen, bevor Sie den tatsächlichen Import durchführen",
  },
  skipErrors: {
    label: "Fehler überspringen",
    description:
      "Verarbeitung fortsetzen, auch wenn einige Zeilen Fehler haben",
    help: "Wenn aktiviert, werden Zeilen mit Fehlern übersprungen und der Import wird fortgesetzt",
  },
  defaultStatus: {
    label: "Standard-Status",
    placeholder: "Standard-Status auswählen",
    description: "Standard-Status für importierte Vorlagen",
    options: {
      draft: "Entwurf",
      published: "Veröffentlicht",
      archived: "Archiviert",
    },
  },
};
