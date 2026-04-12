import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Narzędzia AI",
  tags: {
    skills: "Postacie",
  },
  voices: {
    MALE: "Męski głos",
    FEMALE: "Damski głos",
  },
  enums: {
    ownershipType: {
      system: "Wbudowana umiejętność",
      user: "Stworzone przez Ciebie",
      public: "Ze społeczności",
    },
  },

  get: {
    title: "Pobierz postacię",
    dynamicTitle: "Postać: {{name}}",
    description: "Pobierz konkretną postacię według ID",
    container: {
      title: "Szczegóły postaciy",
      description: "Szczegóły żądanej postaciy",
    },
    backButton: {
      label: "Powrót do postaci",
    },
    editButton: {
      label: "Edytuj postać",
    },
    customizeButton: {
      label: "Dostosuj postać",
    },
    deleteButton: {
      label: "Usuń postać",
    },
    addToFavoritesButton: {
      label: "Dodaj do ulubionych",
    },
    inCollection: "W kolekcji",
    addAnother: "Dodaj kolejną",
    addAnotherTooltip: "Dodaj kolejną instancję tej postaci do swojej kolekcji",
    variants: {
      title: "Warianty",
    },
    addToCollection: "Dodaj do swojej kolekcji:",
    quickAdd: "Szybko dodaj",
    tweakAndAdd: "Dostosuj i dodaj",
    edit: "Edytuj",
    copyAndCustomize: "Kopiuj i dostosuj",
    delete: "Usuń",
    actions: "Akcje",
    designSelector: {
      label: "Design:",
      current: "Obecny",
      a: "A: App Store",
      b: "B: Split Header",
      c: "C: Card Hero",
      d: "D: Two-Row",
    },
    yourskill: "Twoja postać",
    signupPrompt: {
      title: "Dostosuj tę postać",
      description:
        "Stwórz spersonalizowaną wersję z własnymi ustawieniami i preferencjami. Zarejestruj się, aby rozpocząć.",
      backButton: "Wstecz",
      signupButton: "Utwórz konto",
      loginButton: "Zaloguj się",
    },
    id: {
      label: "ID postaciy",
      description: "Unikalny identyfikator postaciy",
    },
    models: {
      brain: "Mózg",
      eyes: "Oczy",
      ears: "Uszy i głos",
      media: "Media",
      slots: {
        chat: "Chat",
        imageVision: "Wizja obrazu",
        videoVision: "Wizja wideo",
        stt: "Mowa na tekst",
        tts: "Tekst na mowę",
        audioVision: "Wizja audio",
        imageGen: "Generowanie obrazów",
        musicGen: "Generowanie muzyki",
        videoGen: "Generowanie wideo",
      },
    },
    systemPrompt: {
      label: "Prompt systemowy",
    },
    response: {
      skill: {
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
        modelSelection: { title: "Wybór modelu" },
        selectionType: { content: "Typ wyboru" },
        minIntelligence: { content: "Minimalna inteligencja" },
        maxIntelligence: { content: "Maksymalna inteligencja" },
        minPrice: { content: "Minimalna cena" },
        maxPrice: { content: "Maksymalna cena" },
        minContent: { content: "Minimalny poziom treści" },
        maxContent: { content: "Maksymalny poziom treści" },
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
    voiceModelSelection: {
      systemDefault: "Domyślny systemu",
    },
    success: {
      title: "Sukces",
      description: "Postać pobrana pomyślnie",
    },
    share: {
      button: "Udostepnij i zarabiaj",
      title: "Udostepnij ten skill i zarabiaj",
      description:
        "Udostepnij ten skill ze swoim linkiem polecajacym. Zarabiaj 10% prowizji od kazdego nowego uzytkownika.",
      selectCode: "Wybierz kod polecajacy:",
      noCodesYet: "Brak kodow polecajacych",
      createCode: "Stworz kod",
      codePlaceholder: "np. MOJKOD",
      creating: "Tworzenie...",
      linkReady: "Twoj link do udostepnienia:",
      copied: "Skopiowano!",
      copyLink: "Kopiuj link",
      close: "Zamknij",
      authRequired:
        "Zaloz darmowe konto, aby otrzymac link polecajacy i zaczac zarabiac.",
      signup: "Zaloz konto za darmo",
      login: "Masz juz konto? Zaloguj sie",
    },
    leadCapture: {
      fallbackHeadline: "Badz na biezaco",
      namePlaceholder: "Twoje imie",
      emailPlaceholder: "Twoj email",
      fallbackButton: "Subskrybuj",
      sending: "...",
      doneHeading: "Gotowe.",
      doneSub: "Jestes na liscie.",
      error: "Cos poszlo nie tak. Sprobuj ponownie.",
      finePrint: "Bez spamu. Wypisz sie w dowolnym momencie.",
    },
    landing: {
      backToHome: "Strona glowna",
      signIn: "Zaloguj sie",
      joinFree: "Dolacz za darmo",
      viewProfile: "Zobacz pelny profil",
      capabilities: "Mozliwosci",
      tools: "{{count}} narzedzi",
      moreFromCreator: "Wiecej od {{name}}",
      tryCta: "Wyprobuj {{name}} teraz",
      tryCtaSub: "Darmowe konto. Bez karty kredytowej. Gotowe w 30 sekund.",
      startFree: "Zacznij za darmo",
      alreadyHaveAccount: "Masz juz konto?",
      copyright: "\u00a9",
      allSkills: "Wszystkie skille",
      featuredSkill: "Wyrozniany skill",
      aboutSkill: "O tym skillu",
      modelsVariants: "Modele i warianty",
    },
  },
  patch: {
    title: "Aktualizuj postacię",
    dynamicTitle: "Edycja: {{name}}",
    container: {
      title: "Aktualizuj postacię",
      description: "Modyfikuj istniejącą niestandardową postacię",
    },
    backButton: {
      label: "Powrót do postaci",
    },
    deleteButton: {
      label: "Usuń postać",
    },
    submitButton: {
      label: "Aktualizuj postacię",
      loadingText: "Aktualizowanie postaci...",
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
      placeholder: "Wprowadź nazwę postaci",
      validation: {
        minLength: "Nazwa musi mieć co najmniej 2 znaki",
        maxLength: "Nazwa musi mieć mniej niż 100 znaków",
      },
    },
    description: {
      label: "Opis",
      description: "Krótki opis postaciy",
      placeholder: "Opisz cel i możliwości postaci",
      validation: {
        minLength: "Opis musi mieć co najmniej 10 znaków",
        maxLength: "Opis musi mieć mniej niż 500 znaków",
      },
    },
    icon: {
      label: "Ikona",
      description: "Ikona emoji dla postaciy",
    },
    systemPrompt: {
      label: "Prompt systemowy",
      description: "Prompt systemowy definiujący zachowanie postaciy",
      placeholder: "Wprowadź prompt systemowy",
      validation: {
        minLength: "Prompt systemowy musi mieć co najmniej 10 znaków",
        maxLength: "Prompt systemowy musi mieć mniej niż 5000 znaków",
      },
    },
    category: {
      label: "Kategoria",
      description: "Kategoria, do której należy ta postać",
    },
    tagline: {
      label: "Slogan",
      description: "Krótki slogan opisujący postać",
      placeholder: "Wprowadź slogan",
      validation: {
        minLength: "Slogan musi mieć co najmniej 2 znaki",
        maxLength: "Slogan musi mieć mniej niż 500 znaków",
      },
    },
    source: {
      label: "Źródło",
      description:
        "Źródło tej postaciy (wbudowane, niestandardowe lub społecznościowe)",
    },
    isPublic: {
      label: "Udostępnij publicznie",
      description:
        "Włącz, aby udostępnić swoją postać społeczności. Po wyłączeniu postać pozostaje prywatna i widoczna tylko dla Ciebie.",
    },
    chatModel: {
      label: "Model czatu",
      placeholder: "Domyślny systemowy",
    },
    voice: {
      label: "Głos",
      description: "Głos tekstu na mowę dla tej postaciy",
      placeholder: "Domyślny systemu",
    },
    sttModel: {
      label: "Model mowy na tekst",
      description: "Model używany do rozpoznawania mowy",
      placeholder: "Domyślny systemu",
    },
    imageVisionModel: {
      label: "Model wizji obrazów",
      description: "Model do analizy obrazów",
      placeholder: "Domyślny systemu",
    },
    videoVisionModel: {
      label: "Model wizji wideo",
      description: "Model do analizy wideo",
      placeholder: "Domyślny systemu",
    },
    audioVisionModel: {
      label: "Model wizji audio",
      description: "Model do analizy audio",
      placeholder: "Domyślny systemu",
    },
    imageGenModel: {
      label: "Model generowania obrazów",
      description: "Model do generowania obrazów",
      placeholder: "Domyślny systemu",
    },
    musicGenModel: {
      label: "Model generowania muzyki",
      description: "Model do generowania muzyki",
      placeholder: "Domyślny systemu",
    },
    videoGenModel: {
      label: "Model generowania wideo",
      description: "Model do generowania wideo",
      placeholder: "Domyślny systemu",
    },
    defaultChatMode: {
      label: "Domyślny tryb czatu",
      description: "Domyślny tryb przy otwieraniu tego czatu",
    },
    modelSelection: {
      label: "Wybór modelu",
      description: "Jak model AI jest wybierany dla tej postaciy",
    },
    variants: {
      label: "Warianty",
      description:
        "Nazwane warianty z własnymi ustawieniami modelu. Każdy wariant wymaga: id, modelSelection (wymagane), isDefault (dokładnie jeden true).",
    },
    preferredModel: {
      label: "Preferowany model",
      description: "Preferowany model AI dla tej postaciy",
    },
    availableTools: {
      label: "Dozwolone narzędzia",
      description:
        "Narzędzia dla tej postaci. Każdy wpis wymaga toolId. Null = ustawienia globalne.",
    },
    pinnedTools: {
      label: "Przypięte narzędzia",
      description:
        "Przypięte narzędzia paska narzędzi dla tej postaci. Null = ustawienia globalne.",
    },
    compactTrigger: {
      label: "Próg kompresji (tokeny)",
      description:
        "Liczba tokenów wyzwalająca kompresję rozmowy. Null = domyślna globalna.",
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
  delete: {
    title: "Usuń postać",
    dynamicTitle: "Usuń: {{name}}",
    description: "Usuń niestandardową postać",
    container: {
      title: "Usuń postać",
      description: "Trwale usuń tę niestandardową postać",
    },
    backButton: {
      label: "Powrót do postaci",
    },
    actions: {
      delete: "Usuń postać",
      deleting: "Usuwanie postaci",
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
