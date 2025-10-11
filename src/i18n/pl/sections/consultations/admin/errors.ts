import type { errorsTranslations as EnglishErrorsTranslations } from "../../../../en/sections/consultations/admin/errors";

export const errorsTranslations: typeof EnglishErrorsTranslations = {
  not_found: {
    title: "Konsultacja Nie Znaleziona",
    description: "Żądana konsultacja nie mogła zostać znaleziona.",
  },
  unauthorized: {
    title: "Nieautoryzowany Dostęp",
    description: "Nie masz uprawnień do tej konsultacji.",
  },
  unknown: {
    title: "Błąd",
    description: "Wystąpił nieoczekiwany błąd.",
  },
  validation: {
    title: "Błąd Walidacji",
    description: "Proszę sprawdzić wprowadzone dane i spróbować ponownie.",
  },
  server: {
    title: "Błąd Serwera",
    description: "Wystąpił błąd serwera. Proszę spróbować ponownie później.",
  },
};
