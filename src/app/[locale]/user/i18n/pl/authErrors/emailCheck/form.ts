import type { translations as EnglishFormTranslations } from "../../../en/authErrors/emailCheck/form";

export const translations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Walidacja weryfikacji e-mail nie powiodła się",
      description: "Sprawdź swój adres e-mail i spróbuj ponownie",
    },
    unauthorized: {
      title: "Weryfikacja e-mail nieautoryzowana",
      description: "Nie masz uprawnień do weryfikacji tego e-maila",
    },
    server: {
      title: "Błąd serwera weryfikacji e-mail",
      description: "Nie można zweryfikować e-maila z powodu błędu serwera",
    },
    unknown: {
      title: "Weryfikacja e-mail nie powiodła się",
      description: "Wystąpił nieoczekiwany błąd podczas weryfikacji e-maila",
    },
  },
  success: {
    title: "Weryfikacja e-mail pomyślna",
    description: "Twój adres e-mail został zweryfikowany",
  },
};
