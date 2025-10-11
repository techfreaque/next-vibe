import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/consultationErrors/list/form";

export const formTranslations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Walidacja listy konsultacji nie powiodła się",
      description: "Nie można zwalidować żądania listy konsultacji",
    },
    unauthorized: {
      title: "Lista konsultacji nieautoryzowana",
      description: "Nie masz uprawnień do przeglądania konsultacji",
    },
    server: {
      title: "Błąd serwera listy konsultacji",
      description: "Nie można załadować konsultacji z powodu błędu serwera",
    },
    unknown: {
      title: "Lista konsultacji nie powiodła się",
      description: "Wystąpił nieoczekiwany błąd podczas ładowania konsultacji",
    },
  },
  success: {
    title: "Konsultacje załadowane pomyślnie",
    description: "Twoja lista konsultacji została pobrana",
  },
};
