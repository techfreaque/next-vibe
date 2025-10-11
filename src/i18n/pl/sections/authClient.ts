import type { authClientTranslations as EnglishAuthClientTranslations } from "../../en/sections/authClient";

export const authClientTranslations: typeof EnglishAuthClientTranslations = {
  errors: {
    token_save_failed:
      "Nie udało się zapisać tokenu uwierzytelniania: {{error}}",
    status_save_failed: "Nie udało się zapisać statusu uwierzytelniania",
    status_remove_failed: "Nie udało się usunąć statusu uwierzytelniania",
    status_check_failed: "Nie udało się sprawdzić statusu uwierzytelniania",
  },
};
