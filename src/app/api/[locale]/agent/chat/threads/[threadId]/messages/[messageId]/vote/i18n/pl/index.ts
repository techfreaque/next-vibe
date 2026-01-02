import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Głosuj na wiadomość",
    description: "Zagłosuj za lub przeciw wiadomości",
    container: {
      title: "Głosowanie",
      description: "Oddaj swój głos na tę wiadomość",
    },
    form: {
      title: "Głosuj na wiadomość",
      description: "Zagłosuj za, przeciw lub usuń głos",
    },
    threadId: {
      label: "ID wątku",
      description: "ID wątku zawierającego wiadomość",
    },
    messageId: {
      label: "ID wiadomości",
      description: "ID wiadomości do głosowania",
    },
    vote: {
      label: "Głos",
      description: "Twój głos: za, przeciw lub usuń",
      placeholder: "Wybierz typ głosu...",
      options: {
        upvote: "Za",
        downvote: "Przeciw",
        remove: "Usuń głos",
      },
    },
    response: {
      title: "Wynik głosowania",
      description: "Zaktualizowane liczby głosów",
      upvotes: {
        content: "Głosy za",
      },
      downvotes: {
        content: "Głosy przeciw",
      },
      userVote: {
        content: "Twój głos",
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Podano nieprawidłowe dane głosowania",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z serwerem",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Musisz być zalogowany, aby głosować na wiadomości",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do głosowania na tę wiadomość",
        incognitoNotAllowed: "Wątki incognito nie mogą być dostępne na serwerze",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Wiadomość nie została znaleziona",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się zapisać głosu",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt głosowania",
      },
    },
    success: {
      title: "Głos zapisany",
      description: "Twój głos został pomyślnie zapisany",
    },
  },
};
