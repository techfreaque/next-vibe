import type { getTranslations as EnglishGetTranslations } from "../../../../en/sections/businessInfo/challenges/get";

export const getTranslations: typeof EnglishGetTranslations = {
  success: {
    title: "Wyzwania biznesowe zostały pomyślnie załadowane",
    description: "Twoje wyzwania biznesowe zostały pobrane",
  },
  error: {
    validation: {
      title: "Błąd walidacji wyzwań",
      description: "Nieprawidłowe parametry żądania do pobrania wyzwań.",
    },
    unauthorized: {
      title: "Odmowa dostępu do wyzwań",
      description: "Nie masz uprawnień do dostępu do informacji o wyzwaniach.",
    },
    server: {
      title: "Błąd serwera wyzwań",
      description:
        "Nie można pobrać informacji o wyzwaniach z powodu błędu serwera.",
    },
    unknown: {
      title: "Pobieranie wyzwań nie powiodło się",
      description:
        "Wystąpił nieoczekiwany błąd podczas pobierania informacji o wyzwaniach.",
    },
  },
};
