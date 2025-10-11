import type { getTranslations as EnglishGetTranslations } from "../../../../../en/sections/cronErrors/pulse/status/get";

export const getTranslations: typeof EnglishGetTranslations = {
  error: {
    validation: {
      title: "Walidacja statusu pulsu nie powiodła się",
      description: "Nieprawidłowe parametry żądania pobierania statusu pulsu",
    },
    unauthorized: {
      title: "Dostęp do statusu pulsu zabroniony",
      description: "Nie masz uprawnień do dostępu do statusu pulsu",
    },
    server: {
      title: "Błąd serwera statusu pulsu",
      description: "Nie można pobrać statusu pulsu z powodu błędu serwera",
    },
    unknown: {
      title: "Pobieranie statusu pulsu nie powiodło się",
      description:
        "Wystąpił nieoczekiwany błąd podczas pobierania statusu pulsu",
    },
  },
  success: {
    title: "Status pulsu pobrany",
    description: "Status pulsu systemu został pomyślnie pobrany",
  },
};
