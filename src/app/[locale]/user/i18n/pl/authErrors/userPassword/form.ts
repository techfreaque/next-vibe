import type { translations as EnglishFormTranslations } from "../../../en/authErrors/userPassword/form";

export const translations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Walidacja hasła nie powiodła się",
      description: "Sprawdź wymagania dotyczące hasła i spróbuj ponownie",
    },
    unauthorized: {
      title: "Zmiana hasła nieautoryzowana",
      description: "Nie masz uprawnień do zmiany tego hasła",
    },
    server: {
      title: "Błąd serwera zmiany hasła",
      description: "Nie można zmienić hasła z powodu błędu serwera",
    },
    unknown: {
      title: "Zmiana hasła nie powiodła się",
      description: "Wystąpił nieoczekiwany błąd podczas zmiany hasła",
    },
  },
  success: {
    title: "Hasło zmienione pomyślnie",
    description: "Twoje hasło zostało zaktualizowane",
  },
};
