import type { sessionTranslations as EnglishSessionTranslations } from "../../../en/sections/auth/session";

export const sessionTranslations: typeof EnglishSessionTranslations = {
  sessionExpired: "Twoja sesja wygasła",
  loginAgain: "Zaloguj się ponownie, aby kontynuować",
  sessionExpiring: "Twoja sesja wkrótce wygaśnie",
  stayLoggedIn: "Pozostań zalogowany",
  loggingOut: "Zostaniesz wylogowany za {seconds} sekund",
  errors: {
    session_not_found: "Sesja nie została znaleziona lub wygasła",
    invalid_token: "Nieprawidłowy token sesji",
    expired: "Sesja wygasła",
    already_expired: "Sesja już wygasła",
    user_mismatch: "Sesja należy do innego użytkownika",
    unauthorized: "Nieautoryzowany dostęp do sesji",
  },
};
