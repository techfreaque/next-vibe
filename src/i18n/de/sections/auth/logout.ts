import type { logoutTranslations as EnglishLogoutTranslations } from "../../../en/sections/auth/logout";

export const logoutTranslations: typeof EnglishLogoutTranslations = {
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
