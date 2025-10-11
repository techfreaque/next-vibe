import type { getTranslations as EnglishGetTranslations } from "../../../../../en/sections/businessInfo/goals/form/get";

export const getTranslations: typeof EnglishGetTranslations = {
  success: {
    title: "Cele biznesowe zostały pomyślnie załadowane",
    description: "Twoje cele biznesowe zostały pobrane",
  },
  error: {
    validation: {
      title: "Błąd walidacji celów",
      description: "Nieprawidłowe parametry żądania do pobrania celów.",
    },
    unauthorized: {
      title: "Odmowa dostępu do celów",
      description: "Nie masz uprawnień do dostępu do informacji o celach.",
    },
    server: {
      title: "Błąd serwera celów",
      description:
        "Nie można pobrać informacji o celach z powodu błędu serwera.",
    },
    unknown: {
      title: "Pobieranie celów nie powiodło się",
      description:
        "Wystąpił nieoczekiwany błąd podczas pobierania informacji o celach.",
    },
  },
};
