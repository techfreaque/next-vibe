import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  app: {
    _layout: {
      failedToLoadLayout: "Nie udało się załadować układu",
    },
    index: {
      failedToLoadPage: "Nie udało się załadować strony",
    },
  },
  utils: {
    "nextjs-compat-wrapper": {
      failedToLoadPage: "Nie udało się załadować strony",
    },
  },
  errors: {
    missingUrlParam: "Brak wymaganego parametru URL",
    urlConstructionFailed: "Nie udało się skonstruować URL",
    validationFailed: "Walidacja nie powiodła się",
    htmlResponseReceived: "Otrzymano odpowiedź HTML zamiast JSON",
    networkError: "Wystąpił błąd sieci",
  },
};
