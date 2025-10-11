import type { getTranslations as EnglishGetTranslations } from "../../../../en/sections/authErrors/userMe/get";

export const getTranslations: typeof EnglishGetTranslations = {
  error: {
    validation: {
      title: "Walidacja pobierania profilu nie powiodła się",
      description: "Nieprawidłowe parametry żądania pobierania profilu",
    },
    unauthorized: {
      title: "Dostęp do pobierania profilu zabroniony",
      description: "Nie masz uprawnień do pobierania informacji o profilu",
    },
    server: {
      title: "Błąd serwera pobierania profilu",
      description: "Nie można pobrać profilu z powodu błędu serwera",
    },
    unknown: {
      title: "Pobieranie profilu nie powiodło się",
      description: "Wystąpił nieoczekiwany błąd podczas pobierania profilu",
    },
  },
  success: {
    title: "Profil załadowany pomyślnie",
    description: "Informacje o Twoim profilu zostały załadowane",
  },
};
