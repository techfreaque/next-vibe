import type { translations as EnglishGetTranslations } from "../../../en/leadsErrors/leadsStats/get";

export const translations: typeof EnglishGetTranslations = {
  error: {
    validation: {
      title: "Walidacja statystyk potencjalnych klientów nie powiodła się",
      description:
        "Nie można zwalidować żądania statystyk potencjalnych klientów",
    },
    unauthorized: {
      title: "Dostęp do statystyk potencjalnych klientów odmówiony",
      description:
        "Nie masz uprawnień do dostępu do statystyk potencjalnych klientów",
    },
    server: {
      title: "Błąd serwera statystyk potencjalnych klientów",
      description:
        "Nie można załadować statystyk potencjalnych klientów z powodu błędu serwera",
    },
    unknown: {
      title: "Dostęp do statystyk potencjalnych klientów nie powiódł się",
      description:
        "Wystąpił nieoczekiwany błąd podczas ładowania statystyk potencjalnych klientów",
    },
    forbidden: {
      title: "Dostęp do statystyk potencjalnych klientów zabroniony",
      description:
        "Nie masz uprawnień do dostępu do statystyk potencjalnych klientów",
    },
  },
  success: {
    title: "Statystyki potencjalnych klientów załadowane",
    description: "Statystyki potencjalnych klientów pobrane pomyślnie",
  },
};
