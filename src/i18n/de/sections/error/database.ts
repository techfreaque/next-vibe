import type { databaseTranslations as EnglishDatabaseTranslations } from "../../../en/sections/error/database";

export const databaseTranslations: typeof EnglishDatabaseTranslations = {
  resource_not_found:
    "Die angeforderte Ressource konnte nicht gefunden werden: {{error}}",
  permission_denied:
    "Sie haben keine Berechtigung, diese Operation durchzuführen: {{error}}",
  validation_failed: "Validierung fehlgeschlagen: {{error}}",
  operation_failed: "Datenbankoperation fehlgeschlagen: {{error}}",
  unexpected: "Ein unerwarteter Datenbankfehler ist aufgetreten",
  constraint_violation:
    "Diese Operation würde Datenintegritätsbeschränkungen verletzen",
  connection_error: "Fehler beim Verbinden mit der Datenbank",
  query_error: "Fehler beim Ausführen der Datenbankabfrage: {{error}}",
};
