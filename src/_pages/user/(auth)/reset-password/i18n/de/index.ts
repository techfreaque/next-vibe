import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    unknown: "Ein unbekannter Fehler ist aufgetreten",
    title: "Fehler",
  },
  meta: {
    passwordReset: {
      title: "Passwort zurücksetzen - {{appName}}",
      description: "Setzen Sie Ihr {{appName}} Kontopasswort zurück",
      category: "Authentifizierung",
      imageAlt: "Passwort zurücksetzen",
      keywords: "passwort zurücksetzen, passwort vergessen, {{appName}}",
    },
  },
  auth: {
    resetPassword: {
      errors: {
        loadingError:
          "Fehler beim Laden des Formulars zum Zurücksetzen des Passworts",
      },
    },
  },
};
