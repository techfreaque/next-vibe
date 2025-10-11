import type { updateTranslations as EnglishUpdateTranslations } from "../../../../en/sections/imapErrors/messages/update";

export const updateTranslations: typeof EnglishUpdateTranslations = {
  error: {
    not_found: {
      title: "Wiadomość nie znaleziona",
      description: "Wiadomość do aktualizacji nie mogła zostać znaleziona.",
    },
    server: {
      title: "Błąd serwera",
      description: "Wystąpił błąd podczas aktualizacji wiadomości.",
    },
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Nie masz uprawnień do aktualizacji tej wiadomości.",
    },
    forbidden: {
      title: "Zabronione",
      description: "Aktualizacja tej wiadomości jest zabroniona.",
    },
    validation: {
      title: "Błąd walidacji",
      description: "Dane aktualizacji są nieprawidłowe.",
    },
  },
  success: {
    title: "Wiadomość zaktualizowana",
    description: "Wiadomość została pomyślnie zaktualizowana.",
  },
};
