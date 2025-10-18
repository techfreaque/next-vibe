import type { translations as EnglishGetTranslations } from "../../../en/leadsErrors/leadsExport/get";

export const translations: typeof EnglishGetTranslations = {
  error: {
    validation: {
      title: "Walidacja eksportu potencjalnych klientów nie powiodła się",
      description: "Sprawdź parametry eksportu i spróbuj ponownie",
    },
    unauthorized: {
      title: "Eksport potencjalnych klientów nieautoryzowany",
      description: "Nie masz uprawnień do eksportowania potencjalnych klientów",
    },
    server: {
      title: "Błąd serwera eksportu potencjalnych klientów",
      description:
        "Nie można wyeksportować potencjalnych klientów z powodu błędu serwera",
    },
    unknown: {
      title: "Eksport potencjalnych klientów nie powiódł się",
      description:
        "Wystąpił nieoczekiwany błąd podczas eksportowania potencjalnych klientów",
    },
  },
  success: {
    title: "Potencjalni klienci wyeksportowani",
    description: "Potencjalni klienci zostali pomyślnie wyeksportowani",
  },
};
