import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    missingUrlParam: "Brak parametru URL",
    urlConstructionFailed: "Konstrukcja URL nie powiodła się",
    validationFailed: "Walidacja nie powiodła się",
    htmlResponseReceived: "Otrzymano odpowiedź HTML zamiast JSON",
    networkError: "Wystąpił błąd sieci",
    failedToLoadPage: "Nie udało się załadować strony",
  },
};
