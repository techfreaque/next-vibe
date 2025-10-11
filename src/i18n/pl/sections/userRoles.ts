import type { userRolesTranslations as EnglishUserRolesTranslations } from "../../en/sections/userRoles";

export const userRolesTranslations: typeof EnglishUserRolesTranslations = {
  errors: {
    role_not_found: "Rola nie została znaleziona",
    user_not_found: "Użytkownik nie został znaleziony",
    permission_denied: "Brak uprawnień do tej operacji",
    role_assignment_failed: "Nie udało się przypisać roli: {{error}}",
    role_removal_failed: "Nie udało się usunąć roli: {{error}}",
    roles_retrieval_failed: "Nie udało się pobrać ról: {{error}}",
    user_roles_retrieval_failed:
      "Nie udało się pobrać ról użytkownika: {{error}}",
    find_failed: "Nie udało się znaleźć ról użytkownika",
    not_found: "Role użytkownika nie zostały znalezione",
    lookup_failed: "Nie udało się wyszukać ról użytkownika",
    add_failed: "Nie udało się dodać roli użytkownika",
    remove_failed: "Nie udało się usunąć roli użytkownika",
    check_failed: "Nie udało się sprawdzić roli użytkownika",
    delete_failed: "Nie udało się usunąć roli użytkownika",
  },
};
