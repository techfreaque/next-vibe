import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    messages: "Wiadomości",
  },
  post: {
    title: "Rozgałęź wiadomość",
    description: "Utwórz nowe rozgałęzienie z tej wiadomości",
    container: {
      title: "Utwórz rozgałęzienie",
      description: "Rozgałęź konwersację od tego punktu",
    },
    form: {
      title: "Rozgałęź wiadomość",
      description: "Utwórz alternatywną ścieżkę konwersacji",
    },
    sections: {
      branch: {
        title: "Szczegóły rozgałęzienia",
        description: "Nowa treść wiadomości",
      },
    },
    threadId: {
      label: "ID wątku",
      description: "ID wątku zawierającego wiadomość",
    },
    messageId: {
      label: "ID wiadomości",
      description: "ID wiadomości, od której ma nastąpić rozgałęzienie",
    },
    content: {
      label: "Treść",
      description: "Treść nowej wiadomości rozgałęzienia",
      placeholder: "Wprowadź treść wiadomości...",
    },
    role: {
      label: "Rola",
      description: "Rola wiadomości (użytkownik, asystent, system)",
    },
    model: {
      label: "Model",
      description: "Model AI do użycia dla odpowiedzi",
    },
    response: {
      title: "Rozgałęziona wiadomość",
      description: "Nowo utworzona wiadomość rozgałęzienia",
      message: {
        title: "Wiadomość",
        id: {
          content: "ID wiadomości",
        },
        threadId: {
          content: "ID wątku",
        },
        role: {
          content: "Rola",
        },
        content: {
          content: "Treść",
        },
        parentId: {
          content: "ID wiadomości nadrzędnej",
        },
        depth: {
          content: "Głębokość",
        },
        authorId: {
          content: "ID autora",
        },
        isAI: {
          content: "Czy AI",
        },
        model: {
          content: "Model",
        },
        tokens: {
          content: "Tokeny",
        },
        createdAt: {
          content: "Utworzono o",
        },
        updatedAt: {
          content: "Zaktualizowano o",
        },
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Podano nieprawidłowe dane rozgałęzienia",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z serwerem",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Musisz być zalogowany, aby rozgałęziać wiadomości",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do rozgałęziania tej wiadomości",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Wiadomość nadrzędna nie została znaleziona",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera",
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
        description: "Wystąpił konflikt",
      },
      threadNotFound: {
        title: "Wątek nie znaleziony",
        description: "Podany wątek nie istnieje",
      },
      messageNotFound: {
        title: "Wiadomość nie znaleziona",
        description: "Podana wiadomość nie istnieje",
      },
      cannotBranchFromRoot: {
        title: "Nie można rozgałęzić od korzenia",
        description: "Nie można tworzyć rozgałęzień od wiadomości głównej",
      },
      createFailed: {
        title: "Tworzenie nie powiodło się",
        description: "Nie udało się utworzyć wiadomości rozgałęzienia",
      },
    },
    success: {
      title: "Sukces",
      description: "Rozgałęzienie zostało pomyślnie utworzone",
    },
  },
};
