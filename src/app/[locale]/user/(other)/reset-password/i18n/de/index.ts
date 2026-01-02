import { translations as requestTranslations } from "@/app/api/[locale]/user/public/reset-password/request/i18n/de";

import { translations as tokenTranslations } from "../../[token]/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  request: requestTranslations,
  token: tokenTranslations,
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
      title: "Passwort zurücksetzen",
      subtitle: "Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Reset-Link",
      sendResetLink: "Reset-Link senden",
      backToLogin: "Zurück zur Anmeldung",
      emailSent: "E-Mail gesendet!",
      successTitle: "Überprüfen Sie Ihre E-Mail",
      successMessage:
        "Wir haben Ihnen einen Link zum Zurücksetzen des Passworts gesendet. Bitte überprüfen Sie Ihren Posteingang.",
      requestNewLink: "Neuen Link anfordern",
      createNewPasswordTitle: "Neues Passwort erstellen",
      createNewPasswordSubtitle: "Geben Sie unten Ihr neues Passwort ein",
      resetPasswordButton: "Passwort zurücksetzen",
      emailLabel: "E-Mail-Adresse",
      emailPlaceholder: "Geben Sie Ihre E-Mail ein",
      newPasswordLabel: "Neues Passwort",
      newPasswordPlaceholder: "Geben Sie Ihr neues Passwort ein",
      confirmPasswordLabel: "Passwort bestätigen",
      confirmPasswordPlaceholder: "Bestätigen Sie Ihr neues Passwort",
      errors: {
        loadingError: "Fehler beim Laden des Formulars zum Zurücksetzen des Passworts",
      },
    },
  },
};
