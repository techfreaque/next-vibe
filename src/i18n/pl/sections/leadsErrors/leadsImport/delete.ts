import type { deleteTranslations as EnglishDeleteTranslations } from "../../../../en/sections/leadsErrors/leadsImport/delete";

export const deleteTranslations: typeof EnglishDeleteTranslations = {
  success: {
    title: "Zadanie importu usunięte",
    description: "Zadanie importu zostało pomyślnie usunięte",
  },
  error: {
    unauthorized: {
      title: "Usuwanie zadania importu nieautoryzowane",
      description: "Nie masz uprawnień do usuwania zadań importu",
    },
    forbidden: {
      title: "Usuwanie zadania importu zabronione",
      description: "Nie masz uprawnień do usunięcia tego zadania importu",
    },
    not_found: {
      title: "Zadanie importu nie znalezione",
      description: "Nie można znaleźć zadania importu",
    },
    server: {
      title: "Błąd serwera usuwania zadania importu",
      description:
        "Zadanie importu nie mogło zostać usunięte z powodu błędu serwera",
    },
  },
};
