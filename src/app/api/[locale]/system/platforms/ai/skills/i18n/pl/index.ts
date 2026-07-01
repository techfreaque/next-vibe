import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  agent: {
    get: {
      title: "Manifest umiejętności agenta (AGENT.md)",
      description:
        "Zwraca dokument markdown z listą narzędzi AI dostępnych dla nieuwierzytelnionych agentów",
      response: {
        title: "Manifest umiejętności",
        description:
          "Dokument markdown ze wszystkimi dostępnymi narzędziami agenta",
      },
      success: {
        title: "Manifest umiejętności pobrany",
        description: "Manifest umiejętności agenta wygenerowany pomyślnie",
      },
      errors: {
        server: {
          title: "Błąd serwera",
          description:
            "Nie udało się wygenerować manifestu umiejętności agenta",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe parametry żądania",
        },
        network: {
          title: "Błąd sieci",
          description: "Nie udało się połączyć z serwerem",
        },
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Wymagana autoryzacja",
        },
        forbidden: {
          title: "Zabronione",
          description: "Odmowa dostępu",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Manifest umiejętności nie znaleziony",
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
      },
    },
  },
  publicUser: {
    get: {
      title:
        "Manifest umiejętności publicznego użytkownika (PUBLIC_USER_SKILL.md)",
      description:
        "Zwraca dokument markdown z listą narzędzi AI dostępnych dla uwierzytelnionych użytkowników",
      response: {
        title: "Manifest umiejętności",
        description:
          "Dokument markdown z narzędziami dla zalogowanych użytkowników",
      },
      success: {
        title: "Manifest umiejętności pobrany",
        description:
          "Manifest umiejętności publicznego użytkownika wygenerowany pomyślnie",
      },
      errors: {
        server: {
          title: "Błąd serwera",
          description:
            "Nie udało się wygenerować manifestu umiejętności publicznego użytkownika",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe parametry żądania",
        },
        network: {
          title: "Błąd sieci",
          description: "Nie udało się połączyć z serwerem",
        },
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Wymagana autoryzacja",
        },
        forbidden: {
          title: "Zabronione",
          description: "Odmowa dostępu",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Manifest umiejętności nie znaleziony",
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
      },
    },
  },
  userWithAccount: {
    get: {
      title:
        "Manifest umiejętności użytkownika z kontem (USER_WITH_ACCOUNT_SKILL.md)",
      description:
        "Zwraca dokument markdown z narzędziami wymagającymi uwierzytelnionego konta",
      response: {
        title: "Manifest umiejętności",
        description: "Dokument markdown z narzędziami wymagającymi konta",
      },
      success: {
        title: "Manifest umiejętności pobrany",
        description:
          "Manifest umiejętności użytkownika z kontem wygenerowany pomyślnie",
      },
      errors: {
        server: {
          title: "Błąd serwera",
          description:
            "Nie udało się wygenerować manifestu umiejętności użytkownika z kontem",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe parametry żądania",
        },
        network: {
          title: "Błąd sieci",
          description: "Nie udało się połączyć z serwerem",
        },
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Wymagana autoryzacja",
        },
        forbidden: {
          title: "Zabronione",
          description: "Odmowa dostępu",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Manifest umiejętności nie znaleziony",
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
      },
    },
  },
  category: "Umiejętności AI",
  tags: {
    skills: "skills",
    manifest: "manifest",
    agent: "agent",
  },
};
