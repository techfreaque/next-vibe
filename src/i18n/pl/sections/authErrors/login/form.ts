import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/authErrors/login/form";

export const formTranslations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Walidacja logowania nie powiodła się",
      description: "Sprawdź swój e-mail i hasło, a następnie spróbuj ponownie",
    },
    unauthorized: {
      title: "Nieprawidłowe dane logowania",
      description: "Wprowadzony e-mail lub hasło jest nieprawidłowy",
    },
    server: {
      title: "Błąd serwera logowania",
      description:
        "Nie można zalogować się z powodu błędu serwera. Spróbuj ponownie później",
    },
    unknown: {
      title: "Logowanie nie powiodło się",
      description: "Wystąpił nieoczekiwany błąd podczas logowania",
    },
  },
  success: {
    title: "Logowanie pomyślne",
    description: "Zostałeś pomyślnie zalogowany",
  },
};
