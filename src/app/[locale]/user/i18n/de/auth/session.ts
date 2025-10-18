import type { translations as EnglishSessionTranslations } from "../../en/auth/session";

export const translations: typeof EnglishSessionTranslations = {
  sessionExpired: "Ihre Sitzung ist abgelaufen",
  loginAgain: "Bitte melden Sie sich erneut an, um fortzufahren",
  sessionExpiring: "Ihre Sitzung läuft bald ab",
  stayLoggedIn: "Angemeldet bleiben",
  loggingOut: "Sie werden in {seconds} Sekunden abgemeldet",
  errors: {
    session_not_found: "Sitzung nicht gefunden oder abgelaufen",
    invalid_token: "Ungültiger Sitzungs-Token",
    expired: "Sitzung ist abgelaufen",
    already_expired: "Sitzung bereits abgelaufen",
    user_mismatch: "Sitzung gehört einem anderen Benutzer",
    unauthorized: "Unbefugter Sitzungszugriff",
  },
};
