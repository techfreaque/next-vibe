import type { errorsTranslations as EnglishErrorsTranslations } from "../../../../../../en/sections/templateApiImport/templateApi/import/form/errors";

export const errorsTranslations: typeof EnglishErrorsTranslations = {
  title: "Import Nieudany",
  description: "Wystąpił błąd podczas importowania twoich szablonów",
  validation: {
    title: "Błąd Walidacji",
    description: "Sprawdź format swoich danych i spróbuj ponownie",
  },
  server: {
    title: "Błąd Serwera",
    description: "Wystąpił nieoczekiwany błąd podczas importu",
  },
  fileFormat: {
    title: "Nieprawidłowy Format Pliku",
    description: "Wybrany format nie pasuje do twoich danych",
  },
  dataEmpty: {
    title: "Brak Danych",
    description: "Dane importu nie mogą być puste",
  },
  csvFormat: {
    title: "Nieprawidłowy Format CSV",
    description: "Dane CSV powinny zawierać przecinki i znaki nowej linii",
  },
  jsonFormat: {
    title: "Nieprawidłowy Format JSON",
    description: "Podane dane JSON nie są prawidłowe",
  },
  xmlFormat: {
    title: "Nieprawidłowy Format XML",
    description: "Dane XML powinny zawierać prawidłowe tagi XML",
  },
  unsupported_format: "Nieobsługiwany format",
  csv_min_rows: "CSV musi mieć nagłówek i co najmniej jeden wiersz danych",
  xml_not_implemented:
    "Parsowanie XML nie jest zaimplementowane w tej wersji demo",
  missing_required_fields: "Brakujące wymagane pola: nazwa i treść są wymagane",
  invalid_status: "Nieprawidłowy status",
  database_error: "Wystąpił błąd bazy danych: {{error}}",
};
