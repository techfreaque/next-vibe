import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Firmy",
  tags: {
    companies: "Firmy",
    create: "Utwórz",
    list: "Lista",
    get: "Pobierz",
    update: "Edytuj",
    members: "Członkowie",
    invite: "Zaproś",
    management: "Zarządzanie",
  },
  endpointCategories: {
    companies: "Firmy",
    companyManagement: "Zarządzanie firmą",
    companyMembers: "Członkowie firmy",
  },
  enums: {
    companyType: {
      b2b: "B2B",
      b2c: "B2C",
      individual: "Osoba fizyczna",
    },
    companyMemberRole: {
      owner: "Właściciel",
      admin: "Administrator",
      member: "Członek",
      accountant: "Księgowy",
      viewer: "Obserwator",
    },
  },

  auth: {
    errors: {
      forbidden: {
        title: "Brak dostępu",
        description: "Nie masz uprawnień do wykonania tej czynności",
      },
      notFound: {
        title: "Firma nie znaleziona",
        description: "Ta firma nie istnieje",
      },
      server: {
        title: "Błąd serwera",
        description: "Coś poszło nie tak — spróbuj ponownie",
      },
      patchNotFound: {
        title: "Firma nie znaleziona",
        description: "Nie znaleziono firmy do zaktualizowania",
      },
      patchServer: {
        title: "Błąd serwera",
        description: "Nie udało się zaktualizować firmy",
      },
    },
  },

  updateRole: {
    patch: {
      title: "Zmień rolę",
      titleShort: "Zmień rolę",
      description: "Zmień rolę członka. Tylko właściciel.",
      companyId: { label: "ID firmy", description: "Firma" },
      memberId: {
        label: "ID członka",
        description: "Członek do zaktualizowania",
      },
      role: {
        label: "Nowa rola",
        description: "Rola do przypisania temu członkowi",
        placeholder: "Wybierz rolę",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe dane",
        },
        unauthorized: {
          title: "Nie zalogowano",
          description: "Zaloguj się, aby zmieniać role",
        },
        forbidden: {
          title: "Tylko właściciel",
          description: "Tylko właściciel firmy może zmieniać role członków",
        },
        conflict: { title: "Konflikt", description: "Konflikt danych" },
        server: {
          title: "Błąd serwera",
          description: "Coś poszło nie tak — spróbuj ponownie",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        network: {
          title: "Błąd sieci",
          description: "Sprawdź połączenie i spróbuj ponownie",
        },
        notFound: {
          title: "Nie znaleziono członka",
          description: "Ten członek nie istnieje w firmie",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
      },
      success: {
        title: "Rola zaktualizowana",
        description: "Rola członka została zmieniona",
      },
      response: {
        memberId: "ID członka",
        role: "Nowa rola",
      },
      widget: {
        back: "Wróć do członków",
        successLabel: "Rola zaktualizowana",
        title: "Zmień rolę członka",
      },
    },
  },

  removeMember: {
    post: {
      title: "Usuń członka",
      titleShort: "Usuń członka",
      description:
        "Usuń członka z firmy. Nie można usunąć ostatniego właściciela.",
      companyId: { label: "ID firmy", description: "Firma" },
      memberId: { label: "ID członka", description: "Członek do usunięcia" },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe dane",
        },
        unauthorized: {
          title: "Nie zalogowano",
          description: "Zaloguj się, aby usuwać członków",
        },
        forbidden: {
          title: "Brak dostępu",
          description:
            "Wymagana rola właściciela lub administratora. Nie można usunąć ostatniego właściciela.",
        },
        conflict: {
          title: "Ostatni właściciel",
          description: "Nie można usunąć ostatniego właściciela firmy",
        },
        server: {
          title: "Błąd serwera",
          description: "Coś poszło nie tak — spróbuj ponownie",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        network: {
          title: "Błąd sieci",
          description: "Sprawdź połączenie i spróbuj ponownie",
        },
        notFound: {
          title: "Nie znaleziono członka",
          description: "Ten członek nie istnieje w firmie",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
      },
      success: {
        title: "Członek usunięty",
        description: "Członek został usunięty z firmy",
      },
      response: {
        removedMemberId: "ID usuniętego członka",
      },
      widget: {
        back: "Wróć do członków",
        successLabel: "Członek usunięty",
        confirmTitle: "Usunąć tego członka?",
        confirmDescription:
          "Natychmiast straci dostęp do tej firmy. Tej operacji nie można cofnąć.",
        confirmButton: "Tak, usuń członka",
        cancelButton: "Anuluj",
      },
    },
  },
};
