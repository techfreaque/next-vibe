import type { translations as EnglishAuthClientTranslations } from "../../en/authClient";

export const translations: typeof EnglishAuthClientTranslations = {
  errors: {
    token_save_failed:
      "Nie udało się zapisać tokenu uwierzytelniania: {{error}}",
    status_save_failed: "Nie udało się zapisać statusu uwierzytelniania",
    status_remove_failed: "Nie udało się usunąć statusu uwierzytelniania",
    status_check_failed: "Nie udało się sprawdzić statusu uwierzytelniania",
  },
};
