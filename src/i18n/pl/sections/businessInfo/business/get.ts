import type { getTranslations as EnglishGetTranslations } from "../../../../en/sections/businessInfo/business/get";

export const getTranslations: typeof EnglishGetTranslations = {
  error: {
    validation: {
      title: "Walidacja biznesu nie powiodła się",
      description:
        "Nieprawidłowe parametry żądania dla informacji biznesowych.",
    },
    unauthorized: {
      title: "Dostęp do informacji biznesowych zabroniony",
      description: "Nie masz uprawnień do dostępu do informacji biznesowych.",
    },
    server: {
      title: "Błąd serwera informacji biznesowych",
      description:
        "Nie można pobrać informacji biznesowych z powodu błędu serwera.",
    },
    unknown: {
      title: "Pobieranie informacji biznesowych nie powiodło się",
      description:
        "Wystąpił nieoczekiwany błąd podczas pobierania informacji biznesowych.",
    },
  },
  success: {
    title: "Informacje biznesowe pobrane",
    description: "Informacje biznesowe zostały pomyślnie pobrane.",
  },
};
