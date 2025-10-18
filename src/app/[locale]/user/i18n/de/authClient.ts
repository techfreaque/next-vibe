import type { translations as EnglishAuthClientTranslations } from "../../en/authClient";

export const translations: typeof EnglishAuthClientTranslations = {
  errors: {
    token_save_failed:
      "Fehler beim Speichern des Authentifizierungstokens: {{error}}",
    status_save_failed: "Fehler beim Speichern des Authentifizierungsstatus",
    status_remove_failed: "Fehler beim Entfernen des Authentifizierungsstatus",
    status_check_failed: "Fehler beim Überprüfen des Authentifizierungsstatus",
  },
};
