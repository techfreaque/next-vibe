import type { translations as EnglishLogoutTranslations } from "../../en/auth/logout";

export const translations: typeof EnglishLogoutTranslations = {
  confirmationTitle: "Abmelden",
  confirmationMessage: "Sind Sie sicher, dass Sie sich abmelden möchten?",
  confirmButton: "Ja, abmelden",
  cancelButton: "Abbrechen",
  successMessage: "Sie wurden erfolgreich abgemeldet",
  logoutFailed: "Abmeldung fehlgeschlagen, Fehler: {{error}}",
  success: {
    title: "Abgemeldet",
    description: "Sie wurden erfolgreich abgemeldet",
  },
};
