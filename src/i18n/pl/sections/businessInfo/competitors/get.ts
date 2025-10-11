import type { getTranslations as EnglishGetTranslations } from "../../../../en/sections/businessInfo/competitors/get";

export const getTranslations: typeof EnglishGetTranslations = {
  success: {
    title: "Analiza konkurencji została pomyślnie załadowana",
    description: "Twoja analiza konkurencji została pobrana",
  },
  error: {
    validation: {
      title: "Błąd walidacji konkurencji",
      description:
        "Nieprawidłowe parametry żądania do pobrania analizy konkurencji.",
    },
    unauthorized: {
      title: "Odmowa dostępu do analizy konkurencji",
      description:
        "Nie masz uprawnień do dostępu do informacji o analizie konkurencji.",
    },
    server: {
      title: "Błąd serwera analizy konkurencji",
      description:
        "Nie można pobrać informacji o analizie konkurencji z powodu błędu serwera.",
    },
    unknown: {
      title: "Pobieranie analizy konkurencji nie powiodło się",
      description:
        "Wystąpił nieoczekiwany błąd podczas pobierania informacji o analizie konkurencji.",
    },
  },
};
