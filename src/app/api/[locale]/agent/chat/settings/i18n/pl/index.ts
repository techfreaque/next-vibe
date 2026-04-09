import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    settings: "Ustawienia",
  },
  voices: {
    MALE: "Męski głos",
    FEMALE: "Damski głos",
  },
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
    selectedSkill: {
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
    voiceModelSelection: {
      label: "Model głosu",
      placeholder: "Domyślny systemu",
    },
    sttModel: {
      label: "Model mowy na tekst",
      placeholder: "Domyślny systemu",
    },
    imageVisionModel: {
      label: "Model wizji obrazu",
      placeholder: "Domyślny systemu",
    },
    videoVisionModel: {
      label: "Model wizji wideo",
      placeholder: "Domyślny systemu",
    },
    audioVisionModel: {
      label: "Model wizji audio",
      placeholder: "Domyślny systemu",
    },
    imageGenModel: {
      label: "Model generowania obrazów",
      placeholder: "Domyślny systemu",
    },
    musicGenModel: {
      label: "Model generowania muzyki",
      placeholder: "Domyślny systemu",
    },
    videoGenModel: {
      label: "Model generowania wideo",
      placeholder: "Domyślny systemu",
    },
    defaultChatMode: {
      label: "Domyślny tryb czatu",
    },
    viewMode: {
      label: "Tryb widoku",
    },
    availableTools: {
      label: "Dozwolone narzędzia",
    },
    pinnedTools: {
      label: "Przypięte narzędzia",
    },
    compactTrigger: {
      label: "Wyzwalacz kompresji (tokeny)",
    },
    memoryLimit: {
      label: "Limit pamięci (tokeny)",
      description:
        "Maksymalna łączna liczba tokenów treści pamięci wstrzykiwanych na turę. Pozostaw puste, aby użyć domyślnego systemu (1000 tokenów).",
    },
    codingAgent: {
      label: "Agent kodowania",
      description:
        "Który CLI agenta kodowania używać, gdy AI wywołuje narzędzie agenta kodowania. Tylko dla adminów.",
      options: {
        claudeCode: "Claude Code (domyślny)",
        openCode: "OpenCode",
      },
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
  patch: {
    chatModel: {
      label: "Model czatu",
      placeholder: "Domyślny systemowy",
    },
  },
};
