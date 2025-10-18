import type { translations as EnglishPostTranslations } from "../../../en/leadsErrors/leads/post";

export const translations: typeof EnglishPostTranslations = {
  error: {
    validation: {
      title: "Walidacja tworzenia potencjalnego klienta nie powiodła się",
      description:
        "Sprawdź informacje o potencjalnym kliencie i spróbuj ponownie",
    },
    unauthorized: {
      title: "Tworzenie potencjalnego klienta nieautoryzowane",
      description: "Nie masz uprawnień do tworzenia potencjalnych klientów",
    },
    server: {
      title: "Błąd serwera tworzenia potencjalnego klienta",
      description:
        "Nie można utworzyć potencjalnego klienta z powodu błędu serwera",
    },
    unknown: {
      title: "Tworzenie potencjalnego klienta nie powiodło się",
      description:
        "Wystąpił nieoczekiwany błąd podczas tworzenia potencjalnego klienta",
    },
    forbidden: {
      title: "Tworzenie potencjalnego klienta zabronione",
      description: "Nie masz uprawnień do tworzenia potencjalnych klientów",
    },
    duplicate: {
      title: "Potencjalny klient już istnieje",
      description:
        "Potencjalny klient z tym adresem e-mail już istnieje w systemie",
    },
    conflict: {
      title: "Potencjalny klient już istnieje",
      description:
        "Potencjalny klient z tym adresem e-mail już istnieje w systemie",
    },
  },
  success: {
    title: "Potencjalny klient utworzony",
    description: "Potencjalny klient utworzony pomyślnie",
  },
};
