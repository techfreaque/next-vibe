import type { formTranslations as EnglishFormTranslations } from "../../../../../en/sections/authErrors/resetPassword/request/form";

export const formTranslations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Walidacja resetowania hasła nie powiodła się",
      description: "Sprawdź swój adres e-mail i spróbuj ponownie",
    },
    unauthorized: {
      title: "Resetowanie hasła niedozwolone",
      description: "Nie masz uprawnień do zresetowania tego hasła",
    },
    server: {
      title: "Błąd serwera resetowania hasła",
      description:
        "Nie można wysłać e-maila resetującego hasło z powodu błędu serwera",
    },
    unknown: {
      title: "Resetowanie hasła nie powiodło się",
      description:
        "Wystąpił nieoczekiwany błąd podczas żądania resetowania hasła",
    },
  },
  success: {
    title: "E-mail resetujący hasło wysłany",
    description:
      "Sprawdź swoją skrzynkę e-mail w poszukiwaniu instrukcji resetowania hasła",
  },
};
