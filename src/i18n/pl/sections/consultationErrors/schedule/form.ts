import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/consultationErrors/schedule/form";

export const formTranslations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Walidacja planowania nie powiodła się",
      description: "Sprawdź szczegóły swojej wizyty i spróbuj ponownie",
    },
    unauthorized: {
      title: "Planowanie nieautoryzowane",
      description: "Nie masz uprawnień do planowania konsultacji",
    },
    server: {
      title: "Błąd serwera planowania",
      description: "Nie można zaplanować konsultacji z powodu błędu serwera",
    },
    unknown: {
      title: "Planowanie nie powiodło się",
      description: "Wystąpił nieoczekiwany błąd podczas planowania konsultacji",
    },
  },
  success: {
    title: "Konsultacja zaplanowana pomyślnie",
    description: "Twoja konsultacja została zaplanowana",
  },
};
