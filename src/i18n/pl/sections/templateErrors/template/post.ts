import type { postTranslations as EnglishPostTranslations } from "../../../../en/sections/templateErrors/template/post";

export const postTranslations: typeof EnglishPostTranslations = {
  error: {
    validation: {
      title: "Walidacja tworzenia szablonu nie powiodła się",
      description: "Sprawdź informacje o swoim szablonie i spróbuj ponownie",
    },
    unauthorized: {
      title: "Tworzenie szablonu nieautoryzowane",
      description: "Nie masz uprawnień do tworzenia szablonów",
    },
    server: {
      title: "Błąd serwera tworzenia szablonu",
      description: "Nie można utworzyć szablonu z powodu błędu serwera",
    },
    unknown: {
      title: "Tworzenie szablonu nie powiodło się",
      description: "Wystąpił nieoczekiwany błąd podczas tworzenia szablonu",
    },
  },
};
