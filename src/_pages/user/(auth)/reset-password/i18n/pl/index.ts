import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    unknown: "Wystąpił nieznany błąd",
    title: "Błąd",
  },
  meta: {
    passwordReset: {
      title: "Zresetuj hasło - {{appName}}",
      description: "Zresetuj hasło do swojego konta {{appName}}",
      category: "Uwierzytelnianie",
      imageAlt: "Resetowanie hasła",
      keywords: "zresetuj hasło, zapomniane hasło, {{appName}}",
    },
  },
  auth: {
    resetPassword: {
      errors: {
        loadingError: "Nie udało się załadować formularza resetowania hasła",
      },
    },
  },
};
