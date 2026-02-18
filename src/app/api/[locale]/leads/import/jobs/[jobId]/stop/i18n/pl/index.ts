import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Zatrzymaj zadanie importu",
    description: "Zatrzymaj uruchomione zadanie importu",
    jobId: {
      label: "ID zadania",
      description: "Unikalny identyfikator zadania importu do zatrzymania",
    },
    form: {
      title: "Zatrzymaj zadanie importu",
      description: "Zatrzymaj uruchomione zadanie importu",
    },
    response: {
      title: "Wynik zatrzymania",
      description: "Wynik operacji zatrzymania",
      success: {
        content: "Status sukcesu",
      },
      message: {
        content: "Wiadomość o zatrzymaniu",
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Podane ID zadania jest nieprawidłowe",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja do zatrzymania zadań",
      },
      forbidden: {
        title: "Dostęp zabroniony",
        description: "Nie masz uprawnień do zatrzymania tego zadania",
      },
      notFound: {
        title: "Zadanie nie znalezione",
        description: "Nie znaleziono zadania importu o podanym ID",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas zatrzymywania zadania",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z serwerem",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt zatrzymania",
        description:
          "Nie można zatrzymać zadania, które nie jest obecnie przetwarzane",
      },
    },
    success: {
      title: "Sukces",
      description: "Zadanie importu zostało pomyślnie zatrzymane",
    },
  },
  widget: {
    title: "Zatrzymaj zadanie importu",
    successMessage: "Zadanie zostało pomyślnie zatrzymane",
  },
};
