import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    unexpectedError:
      "Wystąpił nieoczekiwany błąd: {{error}}. Spróbuj ponownie.",
  },
  post: {
    title: "Wznowienie",
    titleShort: "Wznowienie",
    description:
      "Kontynuuje istniejący wątek po zakończeniu asynchronicznego zadania (callbackMode=wait lub wakeUp).",
    fields: {
      threadId: {
        title: "ID wątku",
        description: "UUID wątku do kontynuowania.",
      },
      favoriteId: {
        title: "ID ulubionego",
        description: "Ulubiony do załadowania modelu i postaci.",
      },
      modelId: {
        title: "ID modelu",
        description: "Model AI dla wznowionego kroku.",
      },
      skillId: {
        title: "ID postaci",
        description: "Postać/persona dla wznowionego kroku.",
      },
      callbackMode: {
        title: "Tryb callback",
        description: "wait lub wakeUp — określa zachowanie przy wznowieniu.",
      },
      wakeUpToolMessageId: {
        title: "ID wiadomości narzędzia",
        description: "ID oryginalnej wiadomości narzędzia z wynikiem.",
      },
      wakeUpTaskId: {
        title: "ID zadania wakeUp",
        description: "Zadanie cron wyzwalające, usuwane po wznowieniu.",
      },
      resumeTaskId: {
        title: "ID zadania wznowienia",
        description: "To zadanie cron, usuwane po wznowieniu.",
      },
      resumed: {
        title: "Wznowiony",
        description: "Czy wątek został pomyślnie kontynuowany.",
      },
      lastAiMessageId: {
        title: "ID ostatniej wiadomości AI",
        description: "UUID ostatniej wygenerowanej wiadomości asystenta.",
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry.",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagane uwierzytelnienie.",
      },
      forbidden: { title: "Zabronione", description: "Odmowa dostępu." },
      notFound: {
        title: "Nie znaleziono",
        description: "Wątek lub model nie znaleziony.",
      },
      internal: {
        title: "Błąd serwera",
        description: "Wewnętrzny błąd podczas wznawiania wątku.",
      },
      network: { title: "Błąd sieci", description: "Wystąpił błąd sieci." },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd.",
      },
      unsaved: {
        title: "Niezapisane zmiany",
        description: "Konflikt niezapisanych zmian.",
      },
      conflict: { title: "Konflikt", description: "Wystąpił konflikt." },
    },
    success: {
      title: "Wątek wznowiony",
      description: "Wątek AI został pomyślnie kontynuowany.",
    },
  },
};
