import type { getTranslations as EnglishGetTranslations } from "../../../../en/sections/businessDataErrors/businessData/get";

export const getTranslations: typeof EnglishGetTranslations = {
  error: {
    validation: {
      title: "Walidacja pobierania danych biznesowych nie powiodła się",
      description: "Nie można zwalidować żądania pobierania danych biznesowych",
    },
    unauthorized: {
      title: "Pobieranie danych biznesowych nieautoryzowane",
      description: "Nie masz uprawnień do pobierania danych biznesowych",
    },
    server: {
      title: "Błąd serwera pobierania danych biznesowych",
      description: "Nie można pobrać danych biznesowych z powodu błędu serwera",
    },
    unknown: {
      title: "Pobieranie danych biznesowych nie powiodło się",
      description:
        "Wystąpił nieoczekiwany błąd podczas pobierania danych biznesowych",
    },
  },
  success: {
    title: "Dane biznesowe pobrane pomyślnie",
    description: "Twoje informacje biznesowe zostały załadowane",
  },
};
