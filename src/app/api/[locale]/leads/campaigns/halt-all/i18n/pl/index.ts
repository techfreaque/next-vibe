import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Zatrzymaj wszystkie kampanie",
  description: "Zatrzymaj wszystkie aktywne kampanie e-mailowe",
  post: {
    title: "Zatrzymaj wszystkie kampanie",
    description:
      "Natychmiast zatrzymaj wszystkie aktywne kampanie e-mailowe i anuluj oczekujące wysyłki",
    fields: {
      confirm: {
        label: "Potwierdź zatrzymanie",
        description:
          "Zaznacz, aby potwierdzić, że chcesz zatrzymać wszystkie kampanie",
      },
      reason: {
        label: "Powód",
        description: "Powód zatrzymania (opcjonalnie)",
      },
    },
    response: {
      halted: "Zatrzymane kampanie",
      emailsCancelled: "Anulowane e-maile",
    },
    errors: {
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Wymagane uprawnienia administratora",
      },
      forbidden: {
        title: "Zabroniony",
        description: "Brak uprawnień",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się zatrzymać kampanii",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Potwierdzenie musi być zaznaczone",
      },
      notFound: { title: "Nie znaleziono", description: "Nie znaleziono" },
      conflict: { title: "Konflikt", description: "Konflikt" },
      network: { title: "Błąd sieci", description: "Błąd sieci" },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Niezapisane zmiany",
      },
    },
    success: {
      title: "Kampanie zatrzymane",
      description: "Wszystkie kampanie zostały pomyślnie zatrzymane",
    },
  },
  widget: {
    title: "Zatrzymanie awaryjne",
    description:
      "Natychmiast zatrzymaj wszystkie aktywne kampanie e-mail. Użyj w przypadku błędów lub pilnych problemów.",
    haltButton: "Zatrzymaj wszystkie kampanie",
    halting: "Zatrzymywanie...",
    confirmTitle: "Zatrzymać wszystkie kampanie?",
    confirmDescription:
      "Spowoduje to natychmiastowe zatrzymanie wszystkich aktywnych kampanii e-mail i anulowanie oczekujących wiadomości. Tej operacji nie można cofnąć.",
    confirmButton: "Tak, zatrzymaj wszystko",
    cancelButton: "Anuluj",
    done: "Zatrzymano",
  },
};
