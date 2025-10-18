import type { translations as EnglishFormTranslations } from "../../../en/authErrors/signup/form";

export const translations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Walidacja rejestracji nie powiodła się",
      description: "Sprawdź swoje dane rejestracyjne i spróbuj ponownie",
    },
    unauthorized: {
      title: "Rejestracja niedozwolona",
      description: "Nie masz uprawnień do utworzenia konta",
    },
    server: {
      title: "Błąd serwera rejestracji",
      description: "Nie można utworzyć konta z powodu błędu serwera",
    },
    unknown: {
      title: "Rejestracja nie powiodła się",
      description: "Wystąpił nieoczekiwany błąd podczas rejestracji",
    },
  },
  success: {
    title: "Rejestracja pomyślna",
    description: "Twoje konto zostało pomyślnie utworzone",
  },
};
