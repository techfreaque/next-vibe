import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/consultationErrors/create/form";

export const formTranslations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Walidacja tworzenia konsultacji nie powiodła się",
      description: "Sprawdź szczegóły swojej konsultacji i spróbuj ponownie",
    },
    unauthorized: {
      title: "Tworzenie konsultacji nieautoryzowane",
      description: "Nie masz uprawnień do tworzenia konsultacji",
    },
    server: {
      title: "Błąd serwera tworzenia konsultacji",
      description: "Nie można utworzyć konsultacji z powodu błędu serwera",
    },
    unknown: {
      title: "Tworzenie konsultacji nie powiodło się",
      description: "Wystąpił nieoczekiwany błąd podczas tworzenia konsultacji",
    },
  },
  success: {
    title: "Konsultacja utworzona pomyślnie",
    description: "Twoje żądanie konsultacji zostało przesłane",
  },
};
