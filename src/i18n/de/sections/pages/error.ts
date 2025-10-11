import type { errorTranslations as EnglishErrorTranslations } from "../../../en/sections/pages/error";

export const errorTranslations: typeof EnglishErrorTranslations = {
  title: "Ups! Etwas ist schiefgelaufen.",
  message:
    "Es tut uns leid, aber etwas ist schiefgelaufen. Bitte versuchen Sie es später erneut.",
  errorId: "Fehler-ID: {{id}}",
  error_message: "Fehler: {{message}}",
  stackTrace: "Stack Trace: {{stack}}",
  backToHome: "Zurück zur Startseite",
  tryAgain: "Erneut versuchen",
};
