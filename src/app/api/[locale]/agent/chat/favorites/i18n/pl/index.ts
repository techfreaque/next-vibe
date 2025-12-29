import { translations as idTranslations } from "../../[id]/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  id: idTranslations,
  enums: {
    mode: {
      auto: "Auto",
      manual: "Ręczny",
    },
    intelligence: {
      any: "Dowolny",
      quick: "Szybki",
      smart: "Inteligentny",
      brilliant: "Genialny",
    },
    price: {
      any: "Dowolny",
      cheap: "Tani",
      standard: "Standardowy",
      premium: "Premium",
    },
    content: {
      any: "Dowolny",
      mainstream: "Główny nurt",
      open: "Otwarty",
      uncensored: "Bez cenzury",
    },
    speed: {
      any: "Dowolny",
      fast: "Szybki",
      balanced: "Zrównoważony",
      thorough: "Dokładny",
    },
  },
  get: {
    title: "Pobierz ulubione",
    description: "Pobierz wszystkie zapisane ulubione konfiguracje postaci",
    container: {
      title: "Twoje ulubione",
      description: "Zarządzaj ulubionymi konfiguracjami postaci i modeli",
    },
    response: {
      favorite: {
        title: "Ulubiona konfiguracja",
        id: {
          content: "ID: {{value}}",
        },
        characterId: {
          content: "Postać: {{value}}",
        },
        customName: {
          content: "Nazwa niestandardowa: {{value}}",
        },
        customIcon: {
          content: "Ikona niestandardowa: {{value}}",
        },
        voice: {
          content: "Głos: {{value}}",
        },
        mode: {
          content: "Tryb: {{value}}",
        },
        intelligence: {
          content: "Inteligencja: {{value}}",
        },
        maxPrice: {
          content: "Maksymalna cena: {{value}}",
        },
        content: {
          content: "Poziom treści: {{value}}",
        },
        manualModelId: {
          content: "Model ręczny: {{value}}",
        },
        position: {
          content: "Pozycja: {{value}}",
        },
        color: {
          content: "Kolor: {{value}}",
        },
        isActive: {
          content: "Aktywny: {{value}}",
        },
        useCount: {
          content: "Użycia: {{value}}",
        },
      },
      hasCompanion: {
        content: "Ma towarzysza: {{value}}",
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
        title: "Brak autoryzacji",
        description: "Musisz być zalogowany, aby wyświetlić ulubione",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do tego zasobu",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono ulubionych",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się załadować ulubionych",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, które zostaną utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas przetwarzania żądania",
      },
    },
    success: {
      title: "Sukces",
      description: "Ulubione załadowane pomyślnie",
    },
  },
  post: {
    title: "Utwórz ulubiony",
    description: "Utwórz nową ulubioną konfigurację postaci",
    container: {
      title: "Nowy ulubiony",
      description: "Zapisz konfigurację postaci jako ulubioną",
    },
    characterId: {
      label: "Postać",
      description: "Wybierz postać dla tego ulubionego",
    },
    customName: {
      label: "Nazwa niestandardowa",
      description: "Opcjonalna nazwa niestandardowa dla tego ulubionego",
    },
    voice: {
      label: "Głos",
      description: "Preferencje głosu text-to-speech",
    },
    mode: {
      label: "Tryb wyboru",
      description: "Sposób wyboru modelu",
    },
    intelligence: {
      label: "Poziom inteligencji",
      description: "Minimalny wymagany poziom inteligencji",
    },
    maxPrice: {
      label: "Maksymalna cena",
      description: "Maksymalny poziom cenowy",
    },
    content: {
      label: "Poziom treści",
      description: "Poziom moderacji treści",
    },
    manualModelId: {
      label: "Model ręczny",
      description: "Konkretny model (dla trybu ręcznego)",
    },
    response: {
      id: {
        content: "Utworzono ulubiony z ID: {{value}}",
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Sprawdź wprowadzone dane i spróbuj ponownie",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z serwerem",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Musisz być zalogowany, aby dodać ulubione",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do tworzenia ulubionych",
      },
      notFound: {
        title: "Nie znaleziono",
        description:
          "Element, który próbujesz dodać do ulubionych, nie istnieje",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się dodać do ulubionych",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, które zostaną utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "Ten ulubiony już istnieje",
      },
    },
    success: {
      title: "Sukces",
      description: "Ulubiony utworzony pomyślnie",
    },
  },
};
