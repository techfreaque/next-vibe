import type { getTranslations as EnglishGetTranslations } from "../../../../en/sections/leadsErrors/leadsImport/get";

export const getTranslations: typeof EnglishGetTranslations = {
  success: {
    title: "Zadania importu pobrane pomyślnie",
    description: "Lista zadań importu została załadowana",
  },
  error: {
    validation: {
      title: "Nieprawidłowe żądanie zadania importu",
      description: "Sprawdź parametry żądania",
    },
    unauthorized: {
      title: "Dostęp do zadań importu nieautoryzowany",
      description: "Nie masz uprawnień do przeglądania zadań importu",
    },
    server: {
      title: "Błąd serwera zadań importu",
      description: "Nie można pobrać zadań importu z powodu błędu serwera",
    },
    unknown: {
      title: "Pobieranie zadań importu nie powiodło się",
      description:
        "Wystąpił nieoczekiwany błąd podczas pobierania zadań importu",
    },
  },
};
