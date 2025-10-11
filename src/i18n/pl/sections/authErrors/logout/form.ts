import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/authErrors/logout/form";

export const formTranslations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Walidacja wylogowania nie powiodła się",
      description: "Nie można zwalidować żądania wylogowania",
    },
    unauthorized: {
      title: "Wylogowanie nieautoryzowane",
      description: "Nie masz uprawnień do wykonania tego wylogowania",
    },
    server: {
      title: "Błąd serwera wylogowania",
      description: "Nie można wylogować się z powodu błędu serwera",
    },
    unknown: {
      title: "Wylogowanie nie powiodło się",
      description: "Wystąpił nieoczekiwany błąd podczas wylogowania",
    },
  },
  success: {
    title: "Wylogowanie pomyślne",
    description: "Zostałeś pomyślnie wylogowany",
  },
};
