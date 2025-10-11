import type { logoutTranslations as EnglishLogoutTranslations } from "../../../en/sections/auth/logout";

export const logoutTranslations: typeof EnglishLogoutTranslations = {
  confirmationTitle: "Wyloguj się",
  confirmationMessage: "Czy na pewno chcesz się wylogować?",
  confirmButton: "Tak, wyloguj się",
  cancelButton: "Anuluj",
  successMessage: "Zostałeś pomyślnie wylogowany",
  logoutFailed: "Wylogowanie nie powiodło się, błąd: {{error}}",
  success: {
    title: "Wylogowano",
    description: "Zostałeś pomyślnie wylogowany",
  },
};
