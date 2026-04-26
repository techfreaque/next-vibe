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
    viewMode: {
      label: "Tryb widoku",
    },
    contextMemory: {
      title: "Budżet pamięci kontekstu",
      description:
        "Jak daleko wstecz AI pamięta rozmowę, zanim zacznie streszczać starsze wiadomości.",
      costNote: "Mniej = taniej",
      costExplain:
        "(do pewnego stopnia) – zamieniasz trochę pamięci na niższy koszt wiadomości.",
      tooltipTitle: "Ile historii rozmowy zachowuje AI",
      tooltipBody:
        "Gdy rozmowa przekroczy ten limit, starsze wiadomości są automatycznie streszczane. AI pozostaje spójne, ale zużywa mniej tokenów – obniżając koszty.",
      tooltipModelCap: "Aktualny model obsługuje do {cap} tokenów.",
      default: "domyślny",
      tokens: "tokeny",
      modelMax: "maks. modelu",
      resetToDefault: "Przywróć domyślne ({value})",
      cheaper: "taniej",
      moreMemory: "więcej pamięci",
      barCheap: "Niższy koszt · krótsza pamięć",
      barBalanced: "Zrównoważony koszt i pamięć",
      barRich: "Bogatsza pamięć · wyższy koszt",
      barMax: "Maksymalna pamięć · najwyższy koszt",
      tools: "Narzędzia",
      toolsInherited: "odziedziczone",
    },
    searchProvider: {
      label: "Dostawca wyszukiwania",
      description:
        "Preferowana wyszukiwarka. Auto wybiera najtańszego dostępnego dostawcę.",
      auto: "Automatycznie",
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
    dreaming: {
      title: "Śnienie",
      description:
        "AI porządkuje twoją głowę podczas snu — scala wspomnienia, sprząta dokumenty, wyciąga to, co ważne.",
      toggle: {
        label: "Włącz śnienie",
      },
      schedule: {
        label: "Harmonogram",
        options: {
          nightlyAt2: "2:00 każdej nocy",
          weekdaysAt2: "2:00 w dni robocze",
          weekdaysAt8: "8:00 w dni robocze",
          every6h: "Co 6 godzin",
          every12h: "Co 12 godzin",
        },
      },
      favoriteId: {
        label: "Slot ulubiony",
        defaultOption: "Domyślny (Thea)",
      },
      prompt: {
        label: "Komunikat sesji",
        placeholder:
          "Na czym ma się skupić Thea w tej sesji? Pozostaw puste, aby użyć domyślnego.",
        defaultPrompt:
          "Uruchom sesję śnienia. Zreorganizuj i scal korteks — wspomnienia, dokumenty, wątki. Zostaw wszystko czystsze i lepiej uporządkowane.",
      },
      lastRun: "Ostatnie uruchomienie:",
      neverRun: "Nigdy nie uruchomiono",
    },
    autopilot: {
      title: "Autopilot",
      description:
        "AI pracuje nad twoją kolejką, gdy cię nie ma — kolejne kroki, projekty w toku, zaległe zadania.",
      toggle: {
        label: "Włącz autopilota",
      },
      schedule: {
        label: "Harmonogram",
        options: {
          nightlyAt2: "2:00 każdej nocy",
          weekdaysAt2: "2:00 w dni robocze",
          weekdaysAt8: "8:00 w dni robocze",
          every6h: "Co 6 godzin",
          every12h: "Co 12 godzin",
        },
      },
      favoriteId: {
        label: "Slot ulubiony",
        defaultOption: "Domyślny (Thea)",
      },
      prompt: {
        label: "Komunikat sesji",
        placeholder:
          "Na czym ma się skupić Hermes w tej sesji? Pozostaw puste, aby użyć domyślnego.",
        defaultPrompt:
          "Uruchom sesję autopilota. Kontynuuj aktywne projekty — realizuj kolejne kroki, obsługuj zaległą pracę, nie zatrzymuj się.",
      },
      lastRun: "Ostatnie uruchomienie:",
      neverRun: "Nigdy nie uruchomiono",
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
