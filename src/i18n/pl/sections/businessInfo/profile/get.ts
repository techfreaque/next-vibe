import type { getTranslations as EnglishGetTranslations } from "../../../../en/sections/businessInfo/profile/get";

export const getTranslations: typeof EnglishGetTranslations = {
  error: {
    validation: {
      title: "Walidacja profilu nie powiodła się",
      description: "Nieprawidłowe parametry żądania dla pobierania profilu.",
    },
    unauthorized: {
      title: "Odmowa dostępu do profilu",
      description: "Nie masz uprawnień do dostępu do informacji profilu.",
    },
    server: {
      title: "Błąd serwera profilu",
      description:
        "Nie można pobrać informacji profilu z powodu błędu serwera.",
    },
    unknown: {
      title: "Pobieranie profilu nie powiodło się",
      description:
        "Wystąpił nieoczekiwany błąd podczas pobierania informacji profilu.",
    },
  },
  success: {
    title: "Profil pobrany",
    description: "Informacje profilu zostały pomyślnie pobrane.",
  },
};
