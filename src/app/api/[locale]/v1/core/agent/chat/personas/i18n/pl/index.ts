import { translations as idTranslations } from "../../[id]/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  id: idTranslations,
  category: {
    general: "Ogólne",
    creative: "Kreatywne",
    technical: "Techniczne",
    education: "Edukacja",
    controversial: "Kontrowersyjne",
    lifestyle: "Styl życia",
  },
  get: {
    title: "Lista person",
    description:
      "Pobierz wszystkie dostępne persony (domyślne + niestandardowe)",
    container: {
      title: "Lista person",
      description: "Wszystkie dostępne persony dla użytkownika",
    },
    response: {
      personas: {
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
        description:
          "Musisz być zalogowany, aby uzyskać dostęp do niestandardowych person",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do dostępu do tego zasobu",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany zasób nie został znaleziony",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas pobierania person",
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
      description: "Persony pobrane pomyślnie",
    },
  },
  post: {
    title: "Utwórz personę",
    description: "Utwórz nową niestandardową personę",
    container: {
      title: "Utwórz nową personę",
      description: "Zdefiniuj nową niestandardową personę",
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
    response: {
      id: { content: "ID utworzonej persony" },
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
        description: "Musisz być zalogowany, aby tworzyć persony",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do tworzenia person",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany zasób nie został znaleziony",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas tworzenia persony",
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
        description: "Persona o tej nazwie już istnieje",
      },
    },
    success: {
      title: "Persona utworzona",
      description: "Twoja niestandardowa persona została pomyślnie utworzona",
    },
  },
};
