import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Pobierz personę",
    description: "Pobierz konkretną personę według ID",
    container: {
      title: "Szczegóły persony",
      description: "Szczegóły żądanej persony",
    },
    id: {
      label: "ID persony",
      description: "Unikalny identyfikator persony",
    },
    response: {
      persona: {
        title: "Persona",
        id: { content: "ID persony" },
        name: { content: "Nazwa persony" },
        description: { content: "Opis persony" },
        icon: { content: "Ikona persony" },
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
        title: "Persona nie znaleziona",
        description: "Żądana persona nie istnieje",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas pobierania persony",
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
      description: "Persona pobrana pomyślnie",
    },
  },
  patch: {
    title: "Aktualizuj personę",
    description: "Aktualizuj istniejącą niestandardową personę",
    container: {
      title: "Aktualizuj personę",
      description: "Modyfikuj istniejącą niestandardową personę",
    },
    response: {
      success: {
        content: "Persona zaktualizowana pomyślnie",
      },
    },
    id: {
      label: "ID persony",
      description: "Unikalny identyfikator persony do aktualizacji",
    },
    name: {
      label: "Nazwa",
      description: "Nazwa persony",
    },
    personaDescription: {
      label: "Opis",
      description: "Krótki opis persony",
    },
    icon: {
      label: "Ikona",
      description: "Ikona emoji dla persony",
    },
    systemPrompt: {
      label: "Prompt systemowy",
      description: "Prompt systemowy definiujący zachowanie persony",
    },
    category: {
      label: "Kategoria",
      description: "Kategoria, do której należy ta persona",
    },
    preferredModel: {
      label: "Preferowany model",
      description: "Preferowany model AI dla tej persony",
    },
    suggestedPrompts: {
      label: "Sugerowane prompty",
      description: "Przykładowe prompty do użycia z tą personą",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Dane persony są nieprawidłowe",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie udało się połączyć z serwerem",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Musisz być zalogowany, aby aktualizować persony",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do aktualizacji tej persony",
      },
      notFound: {
        title: "Persona nie znaleziona",
        description: "Persona, którą próbujesz zaktualizować, nie istnieje",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas aktualizacji persony",
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
      title: "Persona zaktualizowana",
      description:
        "Twoja niestandardowa persona została pomyślnie zaktualizowana",
    },
  },
};
