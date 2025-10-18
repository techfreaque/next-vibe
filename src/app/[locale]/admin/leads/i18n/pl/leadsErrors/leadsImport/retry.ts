import type { translations as EnglishRetryTranslations } from "../../../en/leadsErrors/leadsImport/retry";

export const translations: typeof EnglishRetryTranslations = {
  success: {
    title: "Zadanie importu ponowione",
    description: "Zadanie importu zostało dodane do kolejki ponownych prób",
  },
  error: {
    unauthorized: {
      title: "Ponawianie zadania importu nieautoryzowane",
      description: "Nie masz uprawnień do ponawiania zadań importu",
    },
    forbidden: {
      title: "Ponawianie zadania importu zabronione",
      description: "Nie masz uprawnień do ponowienia tego zadania importu",
    },
    not_found: {
      title: "Zadanie importu nie znalezione",
      description: "Nie można znaleźć zadania importu",
    },
    validation: {
      title: "Nie można ponowić zadania importu",
      description:
        "To zadanie importu nie może zostać ponowione w obecnym stanie",
    },
    server: {
      title: "Błąd serwera ponawiania zadania importu",
      description:
        "Zadanie importu nie mogło zostać ponowione z powodu błędu serwera",
    },
  },
};
