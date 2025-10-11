import type { getTranslations as EnglishGetTranslations } from "../../../../../en/sections/businessInfo/social/form/get";

export const getTranslations: typeof EnglishGetTranslations = {
  success: {
    title: "Media społecznościowe zostały pomyślnie załadowane",
    description:
      "Informacje o Twoich mediach społecznościowych zostały pobrane",
  },
  error: {
    validation: {
      title: "Błąd walidacji mediów społecznościowych",
      description:
        "Nieprawidłowe parametry żądania do pobrania mediów społecznościowych.",
    },
    unauthorized: {
      title: "Odmowa dostępu do mediów społecznościowych",
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
};
