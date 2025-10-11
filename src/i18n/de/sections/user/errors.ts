import type { errorsTranslations as EnglishErrorsTranslations } from "../../../en/sections/user/errors";

export const errorsTranslations: typeof EnglishErrorsTranslations = {
  not_found: "Benutzer nicht gefunden",
  user_not_found: "Benutzer nicht gefunden",
  auth_required:
    "Authentifizierung erforderlich, um diese Operation durchzuführen",
  auth_retrieval_failed:
    "Abrufen der Authentifizierungsinformationen fehlgeschlagen",
  roles_lookup_failed: "Abrufen der Benutzerrollen fehlgeschlagen",
  id_lookup_failed: "Suche nach Benutzer anhand der ID fehlgeschlagen",
  email_lookup_failed: "Suche nach Benutzer anhand der E-Mail fehlgeschlagen",
  existence_check_failed: "Überprüfung der Benutzerexistenz fehlgeschlagen",
  email_check_failed: "Überprüfung der E-Mail-Verfügbarkeit fehlgeschlagen",
  email_duplicate_check_failed:
    "Überprüfung auf doppelte E-Mail fehlgeschlagen",
  search_failed: "Benutzersuche fehlgeschlagen",
  email_already_in_use: "E-Mail-Adresse wird bereits verwendet",
  creation_failed: "Erstellung des neuen Benutzerkontos fehlgeschlagen",
  profile_update_failed: "Aktualisierung des Benutzerprofils fehlgeschlagen",
  account_deletion_failed: "Löschung des Benutzerkontos fehlgeschlagen",
  password_hashing_failed: "Sicherung des Passworts fehlgeschlagen",
};
