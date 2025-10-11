import type { deleteTranslations as EnglishDeleteTranslations } from "../../../../en/sections/authErrors/userMe/delete";

export const deleteTranslations: typeof EnglishDeleteTranslations = {
  error: {
    validation: {
      title: "Walidacja usunięcia konta nie powiodła się",
      description: "Nieprawidłowe parametry żądania usunięcia konta",
    },
    unauthorized: {
      title: "Dostęp do usunięcia konta zabroniony",
      description: "Nie masz uprawnień do usunięcia tego konta",
    },
    server: {
      title: "Błąd serwera usunięcia konta",
      description: "Nie można usunąć konta z powodu błędu serwera",
    },
    unknown: {
      title: "Usunięcie konta nie powiodło się",
      description: "Wystąpił nieoczekiwany błąd podczas usuwania konta",
    },
  },
  success: {
    title: "Konto usunięte pomyślnie",
    description: "Twoje konto zostało trwale usunięte",
  },
};
