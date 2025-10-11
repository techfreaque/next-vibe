import type { deleteTranslations as EnglishDeleteTranslations } from "../../../../en/sections/templateErrors/template/delete";

export const deleteTranslations: typeof EnglishDeleteTranslations = {
  error: {
    validation: {
      title: "Walidacja usunięcia szablonu nie powiodła się",
      description: "Sprawdź swoje żądanie usunięcia i spróbuj ponownie",
    },
    unauthorized: {
      title: "Usunięcie szablonu nieautoryzowane",
      description: "Nie masz uprawnień do usuwania szablonów",
    },
    server: {
      title: "Błąd serwera usunięcia szablonu",
      description: "Nie można usunąć szablonu z powodu błędu serwera",
    },
    unknown: {
      title: "Usunięcie szablonu nie powiodło się",
      description: "Wystąpił nieoczekiwany błąd podczas usuwania szablonu",
    },
  },
};
