import type { getTranslations as EnglishGetTranslations } from "../../../../en/sections/businessInfo/social/get";

export const getTranslations: typeof EnglishGetTranslations = {
  error: {
    validation: {
      title: "Walidacja mediów społecznościowych nie powiodła się",
      description:
        "Nieprawidłowe parametry żądania dla mediów społecznościowych.",
    },
    unauthorized: {
      title: "Dostęp do mediów społecznościowych zabroniony",
      description:
        "Nie masz uprawnień do dostępu do informacji o mediach społecznościowych.",
    },
    server: {
      title: "Błąd serwera mediów społecznościowych",
      description:
        "Nie można pobrać informacji o mediach społecznościowych z powodu błędu serwera.",
    },
    unknown: {
      title: "Pobieranie mediów społecznościowych nie powiodło się",
      description:
        "Wystąpił nieoczekiwany błąd podczas pobierania informacji o mediach społecznościowych.",
    },
  },
  success: {
    title: "Media społecznościowe pobrane",
    description:
      "Informacje o mediach społecznościowych zostały pomyślnie pobrane.",
  },
};
