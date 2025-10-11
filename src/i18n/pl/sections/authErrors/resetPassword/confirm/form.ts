import type { formTranslations as EnglishFormTranslations } from "../../../../../en/sections/authErrors/resetPassword/confirm/form";

export const formTranslations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Walidacja potwierdzenia hasła nie powiodła się",
      description: "Sprawdź swoje nowe hasło i spróbuj ponownie",
    },
    unauthorized: {
      title: "Resetowanie hasła nieautoryzowane",
      description: "Twój token resetowania hasła jest nieprawidłowy lub wygasł",
    },
    server: {
      title: "Błąd serwera resetowania hasła",
      description: "Nie można zresetować hasła z powodu błędu serwera",
    },
    unknown: {
      title: "Resetowanie hasła nie powiodło się",
      description: "Wystąpił nieoczekiwany błąd podczas resetowania hasła",
    },
  },
};
