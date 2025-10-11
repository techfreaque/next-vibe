import type { warningsTranslations as EnglishWarningsTranslations } from "../../../../../../en/sections/templateApiImport/templateApi/import/form/warnings";

export const warningsTranslations: typeof EnglishWarningsTranslations = {
  title: "Ostrzeżenia walidacji",
  description: "Sprawdź poniższe ostrzeżenia przed kontynuowaniem",
  csvMinRows:
    "CSV powinien mieć co najmniej wiersz nagłówka i jeden wiersz danych",
  csvInconsistentColumns: "{{count}} wierszy ma niespójną liczbę kolumn",
  jsonArrayRequired: "JSON powinien być tablicą obiektów szablonów",
  jsonArrayEmpty: "Tablica JSON jest pusta",
  jsonMissingFields: "{{count}} elementom brakuje wymaganego pola 'name'",
  xmlMalformed: "Struktura XML może być nieprawidłowa (niedopasowane tagi)",
};
