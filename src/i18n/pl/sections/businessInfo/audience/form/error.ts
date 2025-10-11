import type { errorTranslations as EnglishErrorTranslations } from "../../../../../en/sections/businessInfo/audience/form/error";

export const errorTranslations: typeof EnglishErrorTranslations = {
  title: "Błąd podczas zapisywania informacji o grupie docelowej",
  description: "Nie udało się zaktualizować informacji o grupie docelowej",
  validation: {
    title: "Walidacja grupy docelowej nie powiodła się",
    description: "Sprawdź informacje o grupie docelowej i spróbuj ponownie",
  },
  unauthorized: {
    title: "Dostęp zabroniony",
    description:
      "Nie masz uprawnień do aktualizacji informacji o grupie docelowej",
  },
  server: {
    title: "Błąd serwera",
    description:
      "Nie można zapisać informacji o grupie docelowej z powodu błędu serwera",
  },
  unknown: {
    title: "Nieoczekiwany błąd",
    description:
      "Wystąpił nieoczekiwany błąd podczas zapisywania informacji o grupie docelowej",
  },
};
