import type { translations as EnglishUserRolesTranslations } from "../../en/userRoles";

export const translations: typeof EnglishUserRolesTranslations = {
  errors: {
    role_not_found: "Rolle nicht gefunden",
    user_not_found: "Benutzer nicht gefunden",
    permission_denied: "Berechtigung für diese Operation verweigert",
    role_assignment_failed: "Rollenzuweisung fehlgeschlagen: {{error}}",
    role_removal_failed: "Rollenentfernung fehlgeschlagen: {{error}}",
    roles_retrieval_failed: "Abrufen der Rollen fehlgeschlagen: {{error}}",
    user_roles_retrieval_failed:
      "Abrufen der Benutzerrollen fehlgeschlagen: {{error}}",
    find_failed: "Suche nach Benutzerrollen fehlgeschlagen",
    not_found: "Benutzerrollen nicht gefunden",
    lookup_failed: "Suche nach Benutzerrollen fehlgeschlagen",
    add_failed: "Hinzufügen der Benutzerrolle fehlgeschlagen",
    remove_failed: "Entfernen der Benutzerrolle fehlgeschlagen",
    check_failed: "Überprüfung der Benutzerrolle fehlgeschlagen",
    delete_failed: "Löschung der Benutzerrolle fehlgeschlagen",
  },
};
