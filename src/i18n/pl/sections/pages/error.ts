import type { errorTranslations as EnglishErrorTranslations } from "../../../en/sections/pages/error";

export const errorTranslations: typeof EnglishErrorTranslations = {
  title: "Ups! Coś poszło nie tak.",
  message: "Przepraszamy, ale coś poszło nie tak. Spróbuj ponownie później.",
  errorId: "ID Błędu: {{id}}",
  error_message: "Błąd: {{message}}",
  stackTrace: "Ślad Stosu: {{stack}}",
  backToHome: "Powrót do Strony Głównej",
  tryAgain: "Spróbuj Ponownie",
};
