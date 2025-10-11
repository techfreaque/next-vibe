import type { healthTranslations as EnglishHealthTranslations } from "../../../en/sections/imapErrors/health";

export const healthTranslations: typeof EnglishHealthTranslations = {
  get: {
    success: {
      title: "Status zdrowia pobrany",
      description: "Status zdrowia serwera IMAP został pomyślnie pobrany.",
    },
  },
  unauthorized: {
    title: "Brak autoryzacji",
    description: "Nie masz uprawnień do przeglądania statusu zdrowia.",
  },
  server: {
    title: "Błąd serwera",
    description: "Wystąpił błąd podczas pobierania statusu zdrowia.",
  },
  unknown: {
    title: "Nieznany błąd",
    description: "Wystąpił nieznany błąd podczas pobierania statusu zdrowia.",
  },
  accounts: {
    failed: "Nie udało się pobrać statystyk kont do monitorowania zdrowia",
  },
};
