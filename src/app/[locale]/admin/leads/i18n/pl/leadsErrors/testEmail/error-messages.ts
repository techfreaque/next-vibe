import type { translations as EnglishErrorTranslations } from "../../en/leadsErrors/testEmail/error";

export const translations: typeof EnglishErrorTranslations = {
  validation: {
    title: "Walidacja e-maila testowego nie powiodła się",
    description: "Sprawdź dane e-maila testowego i spróbuj ponownie",
  },
  unauthorized: {
    title: "E-mail testowy nieautoryzowany",
    description: "Nie masz uprawnień do wysyłania e-maili testowych",
  },
  server: {
    title: "Błąd serwera e-maila testowego",
    description: "Nie można wysłać e-maila testowego z powodu błędu serwera",
  },
  unknown: {
    title: "E-mail testowy nie powiódł się",
    description:
      "Wystąpił nieoczekiwany błąd podczas wysyłania e-maila testowego",
  },
  templateNotFound: {
    title: "Szablon e-maila nie został znaleziony",
    description: "Żądany szablon e-maila nie mógł zostać znaleziony",
  },
  sendingFailed: {
    title: "Wysyłanie e-maila nie powiodło się",
    description: "Nie udało się wysłać e-maila testowego",
  },
  invalidConfiguration: {
    title: "Nieprawidłowa konfiguracja e-maila",
    description: "Konfiguracja e-maila jest nieprawidłowa lub niekompletna",
  },
};
