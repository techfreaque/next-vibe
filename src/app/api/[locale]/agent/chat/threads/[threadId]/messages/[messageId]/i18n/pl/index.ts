import { translations as voteTranslations } from "../../vote/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    messages: "Wiadomości",
  },
  get: {
    title: "Pobierz wiadomość",
    description: "Pobierz konkretną wiadomość według ID",
    container: {
      title: "Szczegóły wiadomości",
      description: "Wyświetl informacje o wiadomości",
    },
    threadId: {
      label: "ID wątku",
      description: "ID wątku zawierającego wiadomość",
    },
    messageId: {
      label: "ID wiadomości",
      description: "ID wiadomości do pobrania",
    },
    rootFolderId: {
      label: "Folder główny",
      description:
        "Główny folder wątku (używany do routingu po stronie klienta)",
    },
    response: {
      title: "Odpowiedź wiadomości",
      description: "Szczegóły wiadomości",
      message: {
        title: "Wiadomość",
        id: { content: "ID wiadomości" },
        threadId: { content: "ID wątku" },
        role: { content: "Rola" },
        content: { content: "Treść" },
        parentId: { content: "ID wiadomości nadrzędnej" },
        authorId: { content: "ID autora" },
        isAI: { content: "Jest AI" },
        model: { content: "Model" },
        tokens: { content: "Tokeny" },
        createdAt: { content: "Utworzono" },
        updatedAt: { content: "Zaktualizowano" },
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z serwerem",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Musisz być zalogowany, aby przeglądać wiadomości",
      },
      forbidden: {
        title: "Zabroniony",
        description: "Nie masz uprawnień do przeglądania tej wiadomości",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Wiadomość nie znaleziona",
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
      conflict: { title: "Konflikt", description: "Wystąpił konflikt" },
      threadNotFound: {
        title: "Wątek nie znaleziony",
        description: "Określony wątek nie istnieje",
      },
      messageNotFound: {
        title: "Wiadomość nie znaleziona",
        description: "Określona wiadomość nie istnieje",
      },
    },
    success: { title: "Sukces", description: "Wiadomość pobrana pomyślnie" },
  },
  patch: {
    title: "Aktualizuj wiadomość",
    description: "Aktualizuj treść wiadomości",
    container: {
      title: "Edytuj wiadomość",
      description: "Aktualizuj treść wiadomości",
    },
    form: {
      title: "Edytuj wiadomość",
      description: "Aktualizuj treść wiadomości",
    },
    sections: {
      message: {
        title: "Treść wiadomości",
        description: "Edytuj wiadomość",
      },
    },
    threadId: {
      label: "ID wątku",
      description: "ID wątku zawierającego wiadomość",
    },
    messageId: {
      label: "ID wiadomości",
      description: "ID wiadomości do aktualizacji",
    },
    rootFolderId: {
      label: "Folder główny",
      description:
        "Główny folder wątku (używany do routingu po stronie klienta)",
    },
    content: {
      label: "Treść",
      description: "Zaktualizowana treść wiadomości",
      placeholder: "Wprowadź treść wiadomości...",
    },
    role: {
      label: "Rola",
      description: "Rola wiadomości (użytkownik, asystent, system)",
    },
    response: {
      title: "Zaktualizowana wiadomość",
      description: "Szczegóły zaktualizowanej wiadomości",
      message: {
        title: "Wiadomość",
        id: { content: "ID wiadomości" },
        threadId: { content: "ID wątku" },
        role: { content: "Rola" },
        content: { content: "Treść" },
        parentId: { content: "ID wiadomości nadrzędnej" },
        createdAt: { content: "Utworzono" },
        updatedAt: { content: "Zaktualizowano" },
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Podano nieprawidłowe dane wiadomości",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z serwerem",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Musisz być zalogowany, aby aktualizować wiadomości",
      },
      forbidden: {
        title: "Zabroniony",
        description: "Nie masz uprawnień do aktualizacji tej wiadomości",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Wiadomość nie znaleziona",
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
      conflict: { title: "Konflikt", description: "Wystąpił konflikt" },
      threadNotFound: {
        title: "Wątek nie znaleziony",
        description: "Określony wątek nie istnieje",
      },
      messageNotFound: {
        title: "Wiadomość nie znaleziona",
        description: "Określona wiadomość nie istnieje",
      },
    },
    success: {
      title: "Sukces",
      description: "Wiadomość zaktualizowana pomyślnie",
    },
  },
  delete: {
    title: "Usuń wiadomość",
    description: "Usuń wiadomość z wątku",
    container: {
      title: "Usuń wiadomość",
      description: "Usuń wiadomość z wątku",
    },
    confirmTitle: "Usuń wiadomość",
    confirmText:
      "Czy na pewno chcesz usunąć tę wiadomość? Tej akcji nie można cofnąć.",
    backButton: {
      label: "Anuluj",
    },
    deleteButton: {
      label: "Usuń",
      loadingText: "Usuwanie…",
    },
    threadId: {
      label: "ID wątku",
      description: "ID wątku zawierającego wiadomość",
    },
    messageId: {
      label: "ID wiadomości",
      description: "ID wiadomości do usunięcia",
    },
    rootFolderId: {
      label: "Folder główny",
      description:
        "Główny folder wątku (używany do routingu po stronie klienta)",
    },
    response: {
      success: { content: "Sukces" },
      role: { content: "Rola" },
      content: { content: "Treść" },
      parentId: { content: "ID wiadomości nadrzędnej" },
      authorId: { content: "ID autora" },
      isAI: { content: "Jest AI" },
      model: { content: "Model" },
      createdAt: { content: "Utworzono" },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z serwerem",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Musisz być zalogowany, aby usuwać wiadomości",
      },
      forbidden: {
        title: "Zabroniony",
        description: "Nie masz uprawnień do usunięcia tej wiadomości",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Wiadomość nie znaleziona",
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
        description: "Nie można usunąć wiadomości z podrzędnymi wiadomościami",
      },
      threadNotFound: {
        title: "Wątek nie znaleziony",
        description: "Określony wątek nie istnieje",
      },
      messageNotFound: {
        title: "Wiadomość nie znaleziona",
        description: "Określona wiadomość nie istnieje",
      },
    },
    success: { title: "Sukces", description: "Wiadomość usunięta pomyślnie" },
  },
  vote: voteTranslations,
};
