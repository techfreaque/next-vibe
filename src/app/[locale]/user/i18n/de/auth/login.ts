import type { translations as EnglishLoginTranslations } from "../../en/auth/login";

export const translations: typeof EnglishLoginTranslations = {
  title: "Willkommen zurück",
  subtitle: "Melden Sie sich in Ihr Konto an",
  emailLabel: "E-Mail-Adresse",
  emailPlaceholder: "E-Mail eingeben",
  passwordLabel: "Passwort",
  passwordPlaceholder: "Passwort eingeben",
  forgotPassword: "Passwort vergessen?",
  rememberMe: "Angemeldet bleiben",
  signInButton: "Anmelden",
  orContinueWith: "Oder fortfahren mit",
  doNotHaveAccount: "Noch kein Konto?",
  createAccount: "Konto erstellen",
  providers: {
    google: "Google",
    github: "Github",
    facebook: "Facebook",
  },
  errors: {
    title: "Anmeldung fehlgeschlagen",
    unknown: "Ein unbekannter Fehler ist aufgetreten",
    invalid_credentials:
      "Ungültige E-Mail oder Passwort. Bitte versuchen Sie es erneut.",
    accountLocked: "Ihr Konto wurde vorübergehend gesperrt!",
    accountLockedDescription:
      "Zu viele fehlgeschlagene Anmeldeversuche. Bitte versuchen Sie es später erneut.",
    two_factor_required:
      "Zwei-Faktor-Authentifizierung erforderlich. Bitte prüfen Sie Ihre E-Mail oder Authentifizierungs-App.",
    serverError:
      "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.",
    token_save_failed:
      "Authentifizierungs-Token konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.",
  },
  success: {
    title: "Anmeldung erfolgreich",
    description: "Willkommen zurück in Ihr Konto",
  },
};
