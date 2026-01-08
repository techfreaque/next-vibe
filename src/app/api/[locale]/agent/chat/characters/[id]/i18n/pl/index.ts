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
        voice: { content: "Głos" },
        suggestedPrompts: { content: "Sugerowane prompty" },
        modelSelection: { title: "Wybór modelu" },
        selectionType: { content: "Typ wyboru" },
        minIntelligence: { content: "Minimalna inteligencja" },
        maxIntelligence: { content: "Maksymalna inteligencja" },
        minPrice: { content: "Minimalna cena" },
        maxPrice: { content: "Maksymalna cena" },
        minContent: { content: "Minimalny poziom treści" },
        maxContent: { content: "Maksymalny poziom treści" },
        minSpeed: { content: "Minimalna prędkość" },
        maxSpeed: { content: "Maksymalna prędkość" },
        preferredStrengths: { content: "Preferowane mocne strony" },
        ignoredWeaknesses: { content: "Ignorowane słabe strony" },
        manualModelId: { content: "Ręczny model" },
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
    actions: {
      update: "Aktualizuj postacię",
      updating: "Aktualizowanie postaciy",
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
    tagline: {
      label: "Slogan",
      description: "Krótki slogan opisujący postać",
    },
    source: {
      label: "Źródło",
      description: "Źródło tej postaciy (wbudowane, niestandardowe lub społecznościowe)",
    },
    ownershipType: {
      label: "Typ własności",
      description: "Kto jest właścicielem tej postaciy (system, użytkownik lub publiczny)",
    },
    voice: {
      label: "Głos",
      description: "Głos tekstu na mowę dla tej postaciy",
    },
    modelSelection: {
      label: "Wybór modelu",
      description: "Jak model AI jest wybierany dla tej postaciy",
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
      description: "Twoja niestandardowa postać została pomyślnie zaktualizowana",
    },
  },
  delete: {
    title: "Usuń postać",
    description: "Usuń niestandardową postać",
    container: {
      title: "Usuń postać",
      description: "Trwale usuń tę niestandardową postać",
    },
    id: {
      label: "ID postaci",
      description: "Unikalny identyfikator postaci do usunięcia",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Dane postaci są nieprawidłowe",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z serwerem",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Nie masz uprawnień do usunięcia tej postaci",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do usunięcia tej postaci",
      },
      notFound: {
        title: "Postać nie znaleziona",
        description: "Postać, którą próbujesz usunąć, nie istnieje",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas usuwania postaci",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd podczas usuwania postaci",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Postać została zmodyfikowana przez innego użytkownika",
      },
    },
    success: {
      title: "Postać usunięta",
      description: "Postać została pomyślnie usunięta",
      content: "Postać usunięta pomyślnie",
    },
  },
};
