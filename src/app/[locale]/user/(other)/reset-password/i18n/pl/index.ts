import { translations as requestTranslations } from "@/app/api/[locale]/user/public/reset-password/request/i18n/pl";

import { translations as tokenTranslations } from "../../[token]/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  request: requestTranslations,
  token: tokenTranslations,
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
      title: "Zresetuj swoje hasło",
      subtitle: "Wprowadź swój adres e-mail, a wyślemy Ci link do resetowania",
      sendResetLink: "Wyślij link resetujący",
      backToLogin: "Powrót do logowania",
      emailSent: "E-mail wysłany!",
      successTitle: "Sprawdź swoją pocztę",
      successMessage: "Wysłaliśmy Ci link do resetowania hasła. Sprawdź swoją skrzynkę odbiorczą.",
      requestNewLink: "Poproś o nowy link",
      createNewPasswordTitle: "Utwórz nowe hasło",
      createNewPasswordSubtitle: "Wprowadź poniżej swoje nowe hasło",
      resetPasswordButton: "Zresetuj hasło",
      emailLabel: "Adres e-mail",
      emailPlaceholder: "Wprowadź swój e-mail",
      newPasswordLabel: "Nowe hasło",
      newPasswordPlaceholder: "Wprowadź swoje nowe hasło",
      confirmPasswordLabel: "Potwierdź hasło",
      confirmPasswordPlaceholder: "Potwierdź swoje nowe hasło",
      errors: {
        loadingError: "Nie udało się załadować formularza resetowania hasła",
      },
    },
  },
};
