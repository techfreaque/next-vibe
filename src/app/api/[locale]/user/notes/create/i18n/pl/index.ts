import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Utwórz notatkę użytkownika",
    description:
      "Dodaj notatkę CRM, log rozmowy, e-mail, spotkanie lub zadanie dla użytkownika",
    fields: {
      userId: {
        label: "Użytkownik",
        description: "Użytkownik, którego dotyczy ta notatka",
        placeholder: "Wybierz użytkownika",
      },
      type: {
        label: "Typ aktywności",
        description: "Rodzaj rejestrowanej interakcji",
        placeholder: "Wybierz typ",
      },
      content: {
        label: "Treść",
        description: "Szczegóły aktywności",
        placeholder: "Opisz co się stało...",
      },
      isPrivate: {
        label: "Prywatna",
        description: "Prywatne notatki widoczne są tylko dla Ciebie",
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Sprawdź pola i spróbuj ponownie",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Musisz być zalogowany",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Nie masz dostępu do tego użytkownika",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Użytkownik nie istnieje",
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
      title: "Notatka utworzona",
      description: "Notatka została zapisana",
    },
    widget: {
      created: "Notatka utworzona",
      noteId: "ID notatki",
      backToNotes: "Wróć do notatek",
    },
    response: {
      id: "ID notatki",
      userId: "ID użytkownika",
      authorUserId: "ID autora",
      type: "Typ",
      content: "Treść",
      isPrivate: "Prywatna",
      createdAt: "Utworzono",
      updatedAt: "Zaktualizowano",
    },
  },
  tag: "CRM",
};
