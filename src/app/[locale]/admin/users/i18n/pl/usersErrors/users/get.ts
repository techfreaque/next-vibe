import type { translations as EnglishGetTranslations } from "../../../en/usersErrors/users/get";

export const translations: typeof EnglishGetTranslations = {
  error: {
    validation: {
      title: "Walidacja pobierania użytkownika nie powiodła się",
      description: "Sprawdź parametry żądania i spróbuj ponownie",
    },
    unauthorized: {
      title: "Pobieranie użytkownika nieautoryzowane",
      description: "Nie masz uprawnień do dostępu do danych użytkownika",
    },
    forbidden: {
      title: "Dostęp do użytkownika zabroniony",
      description: "Nie masz uprawnień do dostępu do tego użytkownika",
    },
    not_found: {
      title: "Użytkownik nie znaleziony",
      description: "Żądany użytkownik nie mógł zostać znaleziony",
    },
    server: {
      title: "Błąd serwera pobierania użytkownika",
      description: "Nie można pobrać użytkownika z powodu błędu serwera",
    },
    unknown: {
      title: "Pobieranie użytkownika nie powiodło się",
      description: "Wystąpił nieoczekiwany błąd podczas pobierania użytkownika",
    },
  },
  success: {
    title: "Użytkownicy pobrani pomyślnie",
    description: "Dane użytkowników zostały załadowane pomyślnie",
  },
};
