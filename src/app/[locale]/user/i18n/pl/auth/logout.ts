import type { translations as EnglishLogoutTranslations } from "../../en/auth/logout";

export const translations: typeof EnglishLogoutTranslations = {
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
