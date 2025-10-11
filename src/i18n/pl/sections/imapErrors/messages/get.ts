import type { getTranslations as EnglishGetTranslations } from "../../../../en/sections/imapErrors/messages/get";

export const getTranslations: typeof EnglishGetTranslations = {
  error: {
    not_found: {
      title: "Wiadomość nie znaleziona",
      description: "Żądana wiadomość nie mogła zostać znaleziona.",
    },
    server: {
      title: "Błąd serwera",
      description: "Wystąpił błąd podczas pobierania wiadomości.",
    },
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Nie masz uprawnień do przeglądania tej wiadomości.",
    },
    forbidden: {
      title: "Zabronione",
      description: "Dostęp do tej wiadomości jest zabroniony.",
    },
    validation: {
      title: "Błąd walidacji",
      description: "Dane wiadomości są nieprawidłowe.",
    },
  },
  success: {
    title: "Wiadomość pobrana",
    description: "Wiadomość została pomyślnie pobrana.",
  },
};
