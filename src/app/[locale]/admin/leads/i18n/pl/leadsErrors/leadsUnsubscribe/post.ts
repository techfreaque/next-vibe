import type { translations as EnglishPostTranslations } from "../../../en/leadsErrors/leadsUnsubscribe/post";

export const translations: typeof EnglishPostTranslations = {
  error: {
    validation: {
      title: "Walidacja wypisania potencjalnego klienta nie powiodła się",
      description: "Sprawdź swoje żądanie wypisania i spróbuj ponownie",
    },
    unauthorized: {
      title: "Wypisanie potencjalnego klienta nieautoryzowane",
      description: "Nie masz uprawnień do wypisywania potencjalnych klientów",
    },
    server: {
      title: "Błąd serwera wypisania potencjalnego klienta",
      description:
        "Nie można wypisać potencjalnego klienta z powodu błędu serwera",
    },
    unknown: {
      title: "Wypisanie potencjalnego klienta nie powiodło się",
      description:
        "Wystąpił nieoczekiwany błąd podczas wypisywania potencjalnego klienta",
    },
    forbidden: {
      title: "Wypisanie potencjalnego klienta zabronione",
      description: "Nie masz uprawnień do wypisywania potencjalnych klientów",
    },
  },
  success: {
    title: "Potencjalny klient wypisany",
    description: "Potencjalny klient pomyślnie wypisany",
  },
};
