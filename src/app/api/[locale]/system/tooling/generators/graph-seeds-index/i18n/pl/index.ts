import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Generatory",

  errors: {
    validation: {
      title: "Błąd walidacji",
      description: "Walidacja pliku graph-seeds nie powiodła się",
    },
    internal: {
      title: "Błąd wewnętrzny",
      description: "Wystąpił błąd wewnętrzny podczas generowania",
    },
  },
};
