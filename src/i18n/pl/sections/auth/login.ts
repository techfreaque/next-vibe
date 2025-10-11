import type { loginTranslations as EnglishLoginTranslations } from "../../../en/sections/auth/login";

export const loginTranslations: typeof EnglishLoginTranslations = {
  title: "Witaj ponownie",
  subtitle: "Zaloguj się do swojego konta",
  emailLabel: "Adres email",
  emailPlaceholder: "Wprowadź swój email",
  passwordLabel: "Hasło",
  passwordPlaceholder: "Wprowadź swoje hasło",
  forgotPassword: "Zapomniałeś hasła?",
  rememberMe: "Zapamiętaj mnie",
  signInButton: "Zaloguj się",
  orContinueWith: "Lub kontynuuj z",
  doNotHaveAccount: "Nie masz konta?",
  createAccount: "Utwórz konto",
  providers: {
    google: "Google",
    github: "Github",
    facebook: "Facebook",
  },
  errors: {
    title: "Logowanie nie powiodło się",
    unknown: "Wystąpił nieznany błąd",
    invalid_credentials: "Nieprawidłowy email lub hasło. Spróbuj ponownie.",
    accountLocked: "Twoje konto zostało tymczasowo zablokowane!",
    accountLockedDescription:
      "Zbyt wiele nieudanych prób logowania. Spróbuj ponownie później.",
    two_factor_required:
      "Wymagane jest uwierzytelnianie dwuskładnikowe. Sprawdź swój email lub aplikację uwierzytelniającą.",
    serverError: "Wystąpił błąd. Spróbuj ponownie później.",
    token_save_failed:
      "Nie udało się zapisać tokenu uwierzytelniania. Spróbuj ponownie.",
  },
  success: {
    title: "Logowanie pomyślne",
    description: "Witaj ponownie w swoim koncie",
  },
};
