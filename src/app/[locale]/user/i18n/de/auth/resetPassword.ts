import type { translations as EnglishResetPasswordTranslations } from "../../en/auth/resetPassword";

export const translations: typeof EnglishResetPasswordTranslations = {
  title: "Passwort zurücksetzen",
  subtitle:
    "Wir senden Ihnen eine E-Mail mit einem Link zum Zurücksetzen Ihres Passworts",
  emailLabel: "E-Mail-Adresse",
  emailPlaceholder: "E-Mail eingeben",
  sendResetLink: "Reset-Link senden",
  backToLogin: "Zurück zur Anmeldung",
  successTitle: "Prüfen Sie Ihre E-Mails",
  successMessage:
    "Falls ein Konto mit dieser E-Mail existiert, haben wir Ihnen Anweisungen zum Zurücksetzen des Passworts gesendet.",
  createNewPasswordTitle: "Neues Passwort erstellen",
  createNewPasswordSubtitle: "Geben Sie Ihr neues Passwort unten ein",
  newPasswordLabel: "Neues Passwort",
  newPasswordPlaceholder: "Neues Passwort eingeben",
  confirmNewPasswordLabel: "Neues Passwort bestätigen",
  confirmNewPasswordPlaceholder: "Neues Passwort bestätigen",
  confirmPasswordPlaceholder: "Passwort bestätigen",
  resetPasswordButton: "Passwort zurücksetzen",
  passwordTips: {
    title: "Sicheres Passwort erstellen",
    description:
      "Verwenden Sie ein starkes Passwort mit mindestens 8 Zeichen aus einer Mischung von Buchstaben, Zahlen und Symbolen.",
  },
  passwordResetSuccessTitle: "Passwort erfolgreich zurückgesetzt",
  passwordResetSuccessMessage:
    "Ihr Passwort wurde zurückgesetzt. Sie können sich jetzt mit Ihrem neuen Passwort anmelden.",
  signInNowButton: "Jetzt anmelden",
  requestNewLink: "Neuen Reset-Link anfordern",
  email: {
    subject: "Passwort-Reset für {{appName}}",
    title: "Passwort-Reset für {{appName}}",
    previewText: "Setzen Sie Ihr Passwort für {{appName}} zurück",
    greeting: "Hallo {{firstName}},",
    requestInfo:
      "Sie haben einen Passwort-Reset für Ihr {{appName}} Konto angefordert.",
    instructions:
      "Klicken Sie auf die Schaltfläche unten, um Ihr Passwort zurückzusetzen:",
    buttonText: "Passwort zurücksetzen",
    expirationInfo:
      "Dieser Link läuft aus Sicherheitsgründen in 24 Stunden ab.",
  },
  success: {
    title: "Passwort erfolgreich zurückgesetzt",
    password_reset:
      "Ihr Passwort wurde erfolgreich zurückgesetzt. Sie können sich jetzt mit Ihrem neuen Passwort anmelden.",
  },
  emailSent: "Passwort-Reset-E-Mail wurde gesendet",
  errors: {
    title: "Passwort-Reset fehlgeschlagen",
    emailRequired: "E-Mail ist erforderlich",
    invalidEmail: "Bitte geben Sie eine gültige E-Mail-Adresse ein",
    invalidToken: "Der Passwort-Reset-Link ist ungültig oder abgelaufen",
    tokenExpired: "Der Passwort-Reset-Link ist abgelaufen",
    passwordRequired: "Passwort ist erforderlich",
    passwordTooShort: "Passwort muss mindestens 8 Zeichen lang sein",
    passwordRequirements:
      "Passwort muss mindestens einen Großbuchstaben, einen Kleinbuchstaben, eine Zahl und ein Sonderzeichen enthalten",
    passwords_do_not_match: "Passwörter stimmen nicht überein",
    confirm_failed: "Fehler beim Zurücksetzen des Passworts: {{error}}",
    loadingError: "Fehler beim Laden der Passwort-Reset-Seite",
    unexpected: "Ein unerwarteter Fehler ist aufgetreten",
    serverError:
      "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.",
  },
  instructions: {
    title: "Anweisungen zum Zurücksetzen des Passworts",
    description:
      "Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link zum Zurücksetzen Ihres Passworts.",
  },
  confirmEmail: {
    subject: "Passwort-Reset-Bestätigung für {{appName}}",
    title: "Passwort-Reset-Bestätigung für {{appName}}",
    previewText:
      "Ihr Passwort für {{appName}} wurde erfolgreich zurückgesetzt.",
    greeting: "Hallo {{firstName}},",
    successMessage:
      "Ihr Passwort für {{appName}} wurde erfolgreich zurückgesetzt.",
    loginInstructions:
      "Sie können sich jetzt mit Ihrem neuen Passwort anmelden.",
    securityWarning:
      "Falls Sie diesen Passwort-Reset nicht angefordert haben, kontaktieren Sie bitte sofort unser Support-Team.",
    securityTip:
      "Aus Sicherheitsgründen empfehlen wir, Ihr Passwort regelmäßig zu ändern und für jeden Dienst ein einzigartiges Passwort zu verwenden.",
  },
};
