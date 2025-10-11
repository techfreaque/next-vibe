import type { databaseTranslations as EnglishDatabaseTranslations } from "../../../en/sections/error/database";

export const databaseTranslations: typeof EnglishDatabaseTranslations = {
  resource_not_found: "Żądany zasób nie został znaleziony: {{error}}",
  permission_denied: "Nie masz uprawnień do wykonania tej operacji: {{error}}",
  validation_failed: "Walidacja nie powiodła się: {{error}}",
  operation_failed: "Operacja bazy danych nie powiodła się: {{error}}",
  unexpected: "Wystąpił nieoczekiwany błąd bazy danych",
  constraint_violation:
    "Ta operacja naruszyłaby ograniczenia integralności danych",
  connection_error: "Nie udało się połączyć z bazą danych",
  query_error: "Błąd wykonywania zapytania bazy danych: {{error}}",
};
