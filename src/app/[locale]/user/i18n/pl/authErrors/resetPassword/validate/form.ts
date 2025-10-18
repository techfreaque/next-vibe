import type { translations as EnglishFormTranslations } from "../../../../en/authErrors/resetPassword/validate/form";

export const translations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Walidacja tokenu nie powiodła się",
      description: "Token resetowania hasła jest nieprawidłowy lub uszkodzony",
    },
    unauthorized: {
      title: "Token nieautoryzowany",
      description: "Twój token resetowania hasła jest nieprawidłowy lub wygasł",
    },
    server: {
      title: "Błąd serwera walidacji tokenu",
      description: "Nie można zwalidować tokenu z powodu błędu serwera",
    },
    unknown: {
      title: "Walidacja tokenu nie powiodła się",
      description: "Wystąpił nieoczekiwany błąd podczas walidacji tokenu",
    },
  },
  success: {
    title: "Walidacja tokenu pomyślna",
    description: "Token resetowania hasła jest prawidłowy i gotowy do użycia",
  },
};
