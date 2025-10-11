import type { errorTranslations as EnglishErrorTranslations } from "../../../../../en/sections/businessInfo/challenges/form/error";

export const errorTranslations: typeof EnglishErrorTranslations = {
  title: "Błąd podczas zapisywania wyzwań biznesowych",
  description: "Nie udało się zaktualizować wyzwań biznesowych",
  validation: {
    title: "Walidacja wyzwań nie powiodła się",
    description: "Sprawdź wyzwania biznesowe i spróbuj ponownie",
  },
  unauthorized: {
    title: "Dostęp zabroniony",
    description: "Nie masz uprawnień do aktualizacji wyzwań biznesowych",
  },
  server: {
    title: "Błąd serwera",
    description: "Nie można zapisać wyzwań biznesowych z powodu błędu serwera",
  },
  unknown: {
    title: "Nieoczekiwany błąd",
    description:
      "Wystąpił nieoczekiwany błąd podczas zapisywania wyzwań biznesowych",
  },
};
