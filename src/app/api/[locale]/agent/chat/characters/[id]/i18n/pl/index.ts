import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Pobierz postacię",
    description: "Pobierz konkretną postacię według ID",
    container: {
      title: "Szczegóły postaciy",
      description: "Szczegóły żądanej postaciy",
    },
    id: {
      label: "ID postaciy",
      description: "Unikalny identyfikator postaciy",
    },
    response: {
      character: {
        title: "Postać",
        id: { content: "ID postaciy" },
        name: { content: "Nazwa postaciy" },
        description: { content: "Opis postaciy" },
        icon: { content: "Ikona postaciy" },
        systemPrompt: { content: "Prompt systemowy" },
        category: { content: "Kategoria" },
        source: { content: "Źródło" },
        preferredModel: { content: "Preferowany model" },
        suggestedPrompts: { content: "Sugerowane prompty" },
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie udało się połączyć z serwerem",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Musisz być zalogowany, aby uzyskać dostęp do tego zasobu",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do dostępu do tego zasobu",
      },
      notFound: {
        title: "Postać nie znaleziona",
        description: "Żądana postać nie istnieje",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas pobierania postaciy",
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
        description: "Wystąpił konflikt z bieżącym stanem",
      },
    },
    success: {
      title: "Sukces",
      description: "Postać pobrana pomyślnie",
    },
  },
  patch: {
    title: "Aktualizuj postacię",
    container: {
      title: "Aktualizuj postacię",
      description: "Modyfikuj istniejącą niestandardową postacię",
    },
    response: {
      success: {
        content: "Postać zaktualizowana pomyślnie",
      },
    },
    id: {
      label: "ID postaciy",
      description: "Unikalny identyfikator postaciy do aktualizacji",
    },
    name: {
      label: "Nazwa",
      description: "Nazwa postaciy",
    },
    description: {
      label: "Opis",
      description: "Krótki opis postaciy",
    },
    icon: {
      label: "Ikona",
      description: "Ikona emoji dla postaciy",
    },
    systemPrompt: {
      label: "Prompt systemowy",
      description: "Prompt systemowy definiujący zachowanie postaciy",
    },
    category: {
      label: "Kategoria",
      description: "Kategoria, do której należy ta postać",
    },
    preferredModel: {
      label: "Preferowany model",
      description: "Preferowany model AI dla tej postaciy",
    },
    suggestedPrompts: {
      label: "Sugerowane prompty",
      description: "Przykładowe prompty do użycia z tą postacią",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Dane postaciy są nieprawidłowe",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie udało się połączyć z serwerem",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Musisz być zalogowany, aby aktualizować postaciy",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do aktualizacji tej postaciy",
      },
      notFound: {
        title: "Postać nie znaleziona",
        description: "Postać, którą próbujesz zaktualizować, nie istnieje",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas aktualizacji postaciy",
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
        description: "Wystąpił konflikt z bieżącym stanem",
      },
    },
    success: {
      title: "Postać zaktualizowana",
      description:
        "Twoja niestandardowa postać została pomyślnie zaktualizowana",
    },
  },
};
