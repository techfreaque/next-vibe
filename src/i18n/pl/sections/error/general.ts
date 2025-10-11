import type { generalTranslations as EnglishGeneralTranslations } from "../../../en/sections/error/general";

export const generalTranslations: typeof EnglishGeneralTranslations = {
  missing_required_fields: "Brak wymaganych pól w Twoim żądaniu",
  email_sending_failed: "Nie udało się wysłać jednego lub więcej emaili",
  submission_failed:
    "Przesłanie formularza nie powiodło się z powodu błędu serwera",
  unexpected_error: "Wystąpił nieoczekiwany błąd, spróbuj ponownie później",
  validation_failed:
    "Walidacja nie powiodła się dla jednego lub więcej pól: {{error}}",
  unexpected_validation_error:
    "Wystąpił nieoczekiwany błąd walidacji: {{error}}",
  unauthorized_access: "Nie masz uprawnień do dostępu do tego zasobu",
  required_fields: "Brak wymaganych pól: {fields}",
  internal_server_error:
    "Wystąpił wewnętrzny błąd serwera podczas przetwarzania Twojego żądania",
  database_error: "Operacja bazy danych nie powiodła się",
  user_not_found: "Żądany użytkownik nie został znaleziony",
  unsupported_provider: "Nieobsługiwany dostawca: {{name}}",
};
