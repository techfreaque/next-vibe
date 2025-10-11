import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Wylogowanie Użytkownika",
  description: "Wylogowuje bieżącego użytkownika i unieważnia jego sesję",
  category: "Zarządzanie Użytkownikami",
  tag: "wylogowanie",
  response: {
    title: "Odpowiedź Wylogowania",
    description: "Odpowiedź wskazująca pomyślne wylogowanie",
    success: "Sukces",
    message: "Wiadomość",
    sessionsCleaned: "Sesje wyczyszczone",
    nextSteps: "Zalecane kolejne kroki po wylogowaniu",
  },
  errors: {
    validation: {
      title: "Błąd Walidacji",
      description: "Żądanie wylogowania zawiera nieprawidłowe dane",
    },
    unauthorized: {
      title: "Brak Autoryzacji",
      description: "Musisz być zalogowany, aby się wylogować",
    },
    internal: {
      title: "Wewnętrzny Błąd Serwera",
      description: "Wystąpił błąd wewnętrzny podczas wylogowywania",
    },
    unknown: {
      title: "Nieznany Błąd",
      description: "Wystąpił nieoczekiwany błąd podczas wylogowywania",
    },
    session_deletion_failed: {
      title: "Usuwanie Sesji Nie Powiodło Się",
      description: "Nie udało się usunąć sesji użytkownika",
    },
    conflict: {
      title: "Konflikt Wylogowania",
      description: "Wystąpił konflikt podczas wylogowywania",
    },
    forbidden: {
      title: "Zabronione",
      description: "Akcja wylogowania jest zabroniona",
    },
    network_error: {
      title: "Błąd Sieci",
      description: "Błąd sieci podczas wylogowywania",
    },
    not_found: {
      title: "Nie Znaleziono",
      description: "Sesja nie została znaleziona",
    },
    server_error: {
      title: "Błąd Serwera",
      description: "Wewnętrzny błąd serwera podczas wylogowywania",
    },
    unsaved_changes: {
      title: "Niezapisane Zmiany",
      description: "Istnieją niezapisane zmiany",
    },
    invalid_user: {
      title: "Nieprawidłowy Użytkownik",
      description: "Użytkownik jest nieprawidłowy lub nie istnieje",
    },
  },
  success: {
    title: "Wylogowanie Pomyślne",
    description: "Zostałeś pomyślnie wylogowany",
    message: "Użytkownik został pomyślnie wylogowany",
  },
};
