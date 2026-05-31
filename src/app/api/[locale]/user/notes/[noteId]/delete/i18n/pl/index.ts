import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Usuń notatkę użytkownika",
    description:
      "Usuń notatkę CRM — tylko autor lub administrator może to zrobić",
    fields: {
      noteId: {
        label: "ID notatki",
        description: "Notatka do usunięcia",
        placeholder: "UUID notatki",
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe ID notatki",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Musisz być zalogowany",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Tylko autor lub administrator może usunąć tę notatkę",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Notatka nie istnieje",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt",
      },
      network: {
        title: "Błąd sieci",
        description: "Żądanie sieciowe nie powiodło się",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Są niezapisane zmiany",
      },
      internal: {
        title: "Błąd wewnętrzny",
        description: "Błąd serwera — spróbuj ponownie",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
    },
    success: {
      title: "Notatka usunięta",
      description: "Notatka została trwale usunięta",
    },
    widget: {
      warning: "Ta notatka zostanie trwale usunięta.",
      deleted: "Notatka usunięta.",
      backToNotes: "Wróć do notatek",
    },
    response: {
      deleted: "Usunięta",
    },
  },
  tag: "CRM",
};
