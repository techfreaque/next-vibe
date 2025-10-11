import type { errorsTranslations as EnglishErrorsTranslations } from "../../../en/sections/user/errors";

export const errorsTranslations: typeof EnglishErrorsTranslations = {
  not_found: "Użytkownik nie został znaleziony",
  user_not_found: "Użytkownik nie został znaleziony",
  auth_required: "Uwierzytelnienie wymagane do wykonania tej operacji",
  auth_retrieval_failed: "Nie udało się pobrać informacji uwierzytelniających",
  roles_lookup_failed: "Nie udało się pobrać ról użytkownika",
  id_lookup_failed: "Nie udało się wyszukać użytkownika po ID",
  email_lookup_failed: "Nie udało się wyszukać użytkownika po e-mailu",
  existence_check_failed: "Nie udało się sprawdzić czy użytkownik istnieje",
  email_check_failed: "Nie udało się sprawdzić dostępności e-maila",
  email_duplicate_check_failed: "Nie udało się sprawdzić duplikatu e-maila",
  search_failed: "Wyszukiwanie użytkownika nie powiodło się",
  email_already_in_use: "Adres e-mail jest już w użyciu",
  creation_failed: "Nie udało się utworzyć nowego konta użytkownika",
  profile_update_failed: "Nie udało się zaktualizować profilu użytkownika",
  account_deletion_failed: "Nie udało się usunąć konta użytkownika",
  password_hashing_failed: "Nie udało się zabezpieczyć hasła",
};
