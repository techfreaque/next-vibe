import type { generalTranslations as EnglishGeneralTranslations } from "../../../en/sections/error/general";

export const generalTranslations: typeof EnglishGeneralTranslations = {
  missing_required_fields: "Fehlende Pflichtfelder in Ihrer Anfrage",
  email_sending_failed: "Fehler beim Senden einer oder mehrerer E-Mails",
  submission_failed:
    "Formular-Einreichung aufgrund eines Serverfehlers fehlgeschlagen",
  unexpected_error:
    "Ein unerwarteter Fehler ist aufgetreten, bitte versuchen Sie es später erneut",
  validation_failed:
    "Validierung für ein oder mehrere Felder fehlgeschlagen: {{error}}",
  unexpected_validation_error:
    "Ein unerwarteter Validierungsfehler ist aufgetreten: {{error}}",
  unauthorized_access:
    "Sie haben keine Berechtigung, auf diese Ressource zuzugreifen",
  required_fields: "Pflichtfelder fehlen: {fields}",
  internal_server_error:
    "Ein interner Serverfehler ist bei der Verarbeitung Ihrer Anfrage aufgetreten",
  database_error: "Eine Datenbankoperation ist fehlgeschlagen",
  user_not_found: "Der angeforderte Benutzer konnte nicht gefunden werden",
  unsupported_provider: "Nicht unterstützter Anbieter: {{name}}",
};
