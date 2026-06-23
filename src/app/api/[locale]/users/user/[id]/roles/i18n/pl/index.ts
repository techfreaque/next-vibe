import type { translations as enTranslations } from "../en";
export const translations: typeof enTranslations = {
  category: "Użytkownicy",

  roles: {
    post: {
      title: "Dodaj rolę użytkownika",
      titleShort: "Dodaj rolę",
      description: "Przyznaj rolę do określonego konta użytkownika",
      container: {
        title: "Dodaj rolę",
        description: "Wybierz rolę do przyznania temu użytkownikowi",
      },
      id: {
        label: "ID użytkownika",
        description:
          "Unikalny identyfikator użytkownika, któremu ma być przyznana rola",
        placeholder: "Wprowadź ID użytkownika...",
      },
      role: {
        label: "Rola",
        description: "Rola do przyznania użytkownikowi",
        placeholder: "Wybierz rolę...",
      },
      submit: {
        label: "Dodaj rolę",
      },
      response: {
        roleId: {
          content: "ID przypisania roli",
        },
        userId: {
          content: "ID użytkownika",
        },
        assignedRole: {
          content: "Przypisana rola",
        },
      },
      errors: {
        unauthorized: {
          title: "Brak autoryzacji",
          description:
            "Musisz być zalogowany, aby zarządzać rolami użytkowników",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Podaj prawidłowe ID użytkownika i rolę",
        },
        forbidden: {
          title: "Brak dostępu",
          description:
            "Tylko administratorzy mogą zarządzać rolami użytkowników",
        },
        notFound: {
          title: "Użytkownik nie znaleziony",
          description: "Nie można znaleźć podanego użytkownika",
        },
        conflict: {
          title: "Rola już przypisana",
          description: "Ten użytkownik ma już podaną rolę",
        },
        network: {
          title: "Błąd sieci",
          description: "Nie można połączyć się z serwerem",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany, które zostaną utracone",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie można dodać roli z powodu błędu serwera",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd podczas dodawania roli",
        },
      },
      success: {
        title: "Rola dodana",
        description: "Rola została pomyślnie przyznana użytkownikowi",
      },
    },
    delete: {
      title: "Usuń rolę użytkownika",
      titleShort: "Usuń rolę",
      description: "Odwołaj rolę od określonego konta użytkownika",
      container: {
        title: "Usuń rolę",
        description: "Wybierz rolę do odwołania od tego użytkownika",
      },
      id: {
        label: "ID użytkownika",
        description:
          "Unikalny identyfikator użytkownika, któremu ma być odwołana rola",
        placeholder: "Wprowadź ID użytkownika...",
      },
      role: {
        label: "Rola",
        description: "Rola do odwołania od użytkownika",
        placeholder: "Wybierz rolę...",
      },
      submit: {
        label: "Usuń rolę",
      },
      response: {
        success: {
          content: "Rola usunięta",
        },
      },
      errors: {
        unauthorized: {
          title: "Brak autoryzacji",
          description:
            "Musisz być zalogowany, aby zarządzać rolami użytkowników",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Podaj prawidłowe ID użytkownika i rolę",
        },
        forbidden: {
          title: "Brak dostępu",
          description:
            "Tylko administratorzy mogą zarządzać rolami użytkowników",
        },
        notFound: {
          title: "Użytkownik nie znaleziony",
          description: "Nie można znaleźć podanego użytkownika",
        },
        conflict: {
          title: "Błąd konfliktu",
          description: "Nie można usunąć roli z powodu istniejących zależności",
        },
        network: {
          title: "Błąd sieci",
          description: "Nie można połączyć się z serwerem",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany, które zostaną utracone",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie można usunąć roli z powodu błędu serwera",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd podczas usuwania roli",
        },
      },
      success: {
        title: "Rola usunięta",
        description: "Rola została pomyślnie odwołana od użytkownika",
      },
    },
  },
  enums: {
    userRole: {
      public: "Publiczny",
      customer: "Klient",
      partnerAdmin: "Administrator partnera",
      partnerEmployee: "Pracownik partnera",
      admin: "Administrator",
      cliOff: "CLI Wyłączone",
      cliAuthBypass: "Obejście autoryzacji CLI",
      aiToolOff: "Narzędzie AI Wyłączone",
      webOff: "Web Wyłączone",
      mcpOff: "MCP Wyłączone",
      mcpVisible: "MCP Widoczne",
      productionOff: "Produkcja Wyłączona",
      skillOff: "Skill Wyłączony",
    },
  },
};
