import type { translations as EnglishStopTranslations } from "../../../en/leadsErrors/leadsImport/stop";

export const translations: typeof EnglishStopTranslations = {
  success: {
    title: "Zadanie importu zatrzymane",
    description: "Zadanie importu zostało pomyślnie zatrzymane",
  },
  error: {
    unauthorized: {
      title: "Zatrzymywanie zadania importu nieautoryzowane",
      description: "Nie masz uprawnień do zatrzymywania zadań importu",
    },
    forbidden: {
      title: "Zatrzymywanie zadania importu zabronione",
      description: "Nie masz uprawnień do zatrzymania tego zadania importu",
    },
    not_found: {
      title: "Zadanie importu nie znalezione",
      description: "Nie można znaleźć zadania importu",
    },
    validation: {
      title: "Nie można zatrzymać zadania importu",
      description:
        "To zadanie importu nie może zostać zatrzymane w obecnym stanie",
    },
    server: {
      title: "Błąd serwera zatrzymywania zadania importu",
      description:
        "Zadanie importu nie mogło zostać zatrzymane z powodu błędu serwera",
    },
  },
};
