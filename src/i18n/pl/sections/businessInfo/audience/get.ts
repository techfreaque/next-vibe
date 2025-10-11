import type { getTranslations as EnglishGetTranslations } from "../../../../en/sections/businessInfo/audience/get";

export const getTranslations: typeof EnglishGetTranslations = {
  error: {
    validation: {
      title: "Walidacja grupy docelowej nie powiodła się",
      description:
        "Nieprawidłowe parametry żądania dla pobierania grupy docelowej.",
    },
    unauthorized: {
      title: "Dostęp do grupy docelowej zabroniony",
      description:
        "Nie masz uprawnień do dostępu do informacji o grupie docelowej.",
    },
    server: {
      title: "Błąd serwera grupy docelowej",
      description:
        "Nie można pobrać informacji o grupie docelowej z powodu błędu serwera.",
    },
    unknown: {
      title: "Pobieranie grupy docelowej nie powiodło się",
      description:
        "Wystąpił nieoczekiwany błąd podczas pobierania informacji o grupie docelowej.",
    },
  },
  success: {
    title: "Grupa docelowa pobrana",
    description: "Informacje o grupie docelowej zostały pomyślnie pobrane.",
  },
};
