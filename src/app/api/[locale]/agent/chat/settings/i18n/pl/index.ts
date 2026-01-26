import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Pobierz ustawienia czatu",
    description: "Pobierz ustawienia i preferencje użytkownika",
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
        title: "Brak autoryzacji",
        description: "Musisz być zalogowany, aby uzyskać dostęp do ustawień",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do tego zasobu",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Ustawienia nie znalezione",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas pobierania ustawień",
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
      description: "Ustawienia pobrane pomyślnie",
    },
  },
  post: {
    title: "Aktualizuj ustawienia czatu",
    description: "Aktualizuj ustawienia i preferencje użytkownika",
    container: {
      title: "Ustawienia czatu",
    },
    selectedModel: {
      label: "Wybrany model",
    },
    selectedCharacter: {
      label: "Wybrany charakter",
    },
    activeFavoriteId: {
      label: "Aktywny ulubiony",
    },
    ttsAutoplay: {
      label: "Automatyczne odtwarzanie TTS",
    },
    ttsVoice: {
      label: "Głos TTS",
    },
    viewMode: {
      label: "Tryb widoku",
    },
    enabledTools: {
      label: "Włączone narzędzia",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe ustawienia",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie udało się zapisać ustawień",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Musisz być zalogowany, aby aktualizować ustawienia",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do aktualizacji ustawień",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Ustawienia nie znalezione",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się zapisać ustawień",
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
        description: "Wystąpił konflikt ustawień",
      },
    },
    success: {
      title: "Ustawienia zapisane",
      description: "Twoje ustawienia zostały pomyślnie zapisane",
    },
  },
};
