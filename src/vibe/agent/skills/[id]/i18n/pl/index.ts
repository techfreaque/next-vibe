import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Narzędzia AI",
  tags: {
    skills: "Skille",
  },
  voices: {
    MALE: "Męski głos",
    FEMALE: "Damski głos",
  },
  enums: {
    category: {
      companion: "Towarzysze",
      assistant: "Asystenci",
      coding: "Programowanie",
      creative: "Kreatywne",
      writing: "Pisanie",
      analysis: "Analiza",
      roleplay: "Odgrywanie ról",
      education: "Edukacja",
      controversial: "Kontrowersyjne",
      background: "W tle",
      custom: "Niestandardowe",
    },
    ownershipType: {
      system: "Wbudowana umiejętność",
      user: "Stworzone przez Ciebie",
      public: "Ze społeczności",
    },
  },

  get: {
    title: "Pobierz skill",
    titleShort: "Szczegóły skilla",
    dynamicTitle: "Skill: {{name}}",
    description: "Pobierz konkretną skill według ID",
    container: {
      title: "Szczegóły skilla",
      description: "Szczegóły żądanej skilla",
    },
    backButton: {
      label: "Powrót do skilli",
    },
    openFullPage: "Otwórz pełną stronę",
    editButton: {
      label: "Edytuj skill",
    },
    customizeButton: {
      label: "Dostosuj skill",
    },
    deleteButton: {
      label: "Usuń skill",
    },
    addToFavoritesButton: {
      label: "Dodaj do ulubionych",
    },
    inCollection: "W kolekcji",
    useNow: "Użyj teraz",
    goToChat: "Przejdź do czatu",
    addAnother: "Dodaj kolejną",
    addAnotherTooltip: "Dodaj kolejną instancję tego skilla do swojej kolekcji",
    variants: {
      title: "Wybierz model",
      strength: "Mocna strona",
      weakness: "Słaba strona",
    },
    addToCollection: "Dodaj do swojej kolekcji:",
    addAllToFavorites: "Dodaj wszystkie modele",
    quickAdd: "Dodaj",
    tweakAndAdd: "Dostosuj i dodaj",
    edit: "Edytuj",
    copyAndCustomize: "Stwórz własną wersję",
    delete: "Usuń",
    vote: "Oceń",
    report: "Zgłoś",
    actions: "Akcje",
    designSelector: {
      label: "Design:",
      current: "Obecny",
      a: "A: App Store",
      b: "B: Split Header",
      c: "C: Card Hero",
      d: "D: Two-Row",
    },
    addVariant: "Dodaj kolejny model",
    addVariantHint: "Inny model, osobowość lub styl",
    yourskill: "Twój skill",
    signupPrompt: {
      title: "Dostosuj ten skill",
      description:
        "Stwórz spersonalizowaną wersję z własnymi ustawieniami i preferencjami. Zarejestruj się, aby rozpocząć.",
      backButton: "Wstecz",
      signupButton: "Utwórz konto",
      loginButton: "Zaloguj się",
    },
    id: {
      label: "ID skilla",
      description: "Slug lub przyjazne ID skilla",
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
      copy: "Kopiuj",
      copied: "Skopiowano!",
      view: "Zobacz pełny prompt",
    },
    response: {
      skill: {
        title: "Skill",
        id: { content: "ID skilla" },
        name: { content: "Nazwa skilla" },
        description: { content: "Opis skilla" },
        icon: { content: "Ikona skilla" },
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
        title: "Skill nie zostaÅ znaleziony",
        description: "Żądany skill nie istnieje",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas pobierania skilla",
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
      description: "Skill pobrana pomyślnie",
    },
    share: {
      button: "Udostepnij i zarabiaj",
      titleNamed: "Udostępnij {{name}} i zarabiaj",
      title: "Udostępnij ten skill i zarabiaj",
      description:
        "Udostępnij ten skill swoim linkiem polecającym. Zarabiaj 10% prowizji od każdego nowego użytkownika.",
      selectCode: "Wybierz kod polecajacy:",
      noCodesYet: "Brak kodow polecajacych",
      createCode: "Stworz kod",
      codePlaceholder: "np. MOJKOD",
      creating: "Tworzenie...",
      createFailed: "Nie udało się utworzyć kodu. Spróbuj innego.",
      linkReady: "Twoj link do udostepnienia:",
      copied: "Skopiowano!",
      copyLink: "Kopiuj link",
      close: "Zamknij",
      authRequired:
        "Zaloz darmowe konto, aby otrzymac link polecajacy i zaczac zarabiac.",
      signup: "Zaloz konto za darmo",
      login: "Masz juz konto? Zaloguj sie",
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
      copyright: "\u00A9",
      allSkills: "Wszystkie skille",
      featuredSkill: "Wyrozniany skill",
      aboutSkill: "O tym skillu",
      modelsVariants: "Modele i warianty",
    },
  },
  patch: {
    title: "Aktualizuj skill",
    titleShort: "Edytuj skill",
    dynamicTitle: "Edycja: {{name}}",
    container: {
      title: "Aktualizuj skill",
      description: "Modyfikuj istniejącą niestandardowy skill",
    },
    backButton: {
      label: "Powrót do skilli",
    },
    deleteButton: {
      label: "Usuń skill",
    },
    submitButton: {
      label: "Aktualizuj skill",
      loadingText: "Aktualizowanie skilla...",
    },
    actions: {
      update: "Aktualizuj skill",
      updating: "Aktualizowanie skilla",
    },
    response: {
      success: {
        content: "Skill zaktualizowany pomyślnie",
      },
    },
    id: {
      label: "ID skilla",
      description: "Slug lub przyjazne ID skilla do aktualizacji",
    },
    name: {
      label: "Nazwa",
      description: "Nazwa skilla",
      placeholder: "Wprowadź nazwę skilla",
      validation: {
        minLength: "Nazwa musi mieć co najmniej 2 znaki",
        maxLength: "Nazwa musi mieć mniej niż 100 znaków",
      },
    },
    description: {
      label: "Opis",
      description: "Krótki opis skilla",
      placeholder: "Opisz cel i możliwości skilla",
      validation: {
        minLength: "Opis musi mieć co najmniej 10 znaków",
        maxLength: "Opis musi mieć mniej niż 500 znaków",
      },
    },
    icon: {
      label: "Ikona",
      description: "Ikona emoji dla skilla",
    },
    systemPrompt: {
      label: "Prompt systemowy",
      description: "Prompt systemowy definiujący zachowanie skilla",
      placeholder: "Wprowadź prompt systemowy",
      validation: {
        minLength: "Prompt systemowy musi mieć co najmniej 10 znaków",
        maxLength: "Prompt systemowy musi mieć mniej niż 5000 znaków",
      },
    },
    category: {
      label: "Kategoria",
      description: "Kategoria, do której należy ten skill",
    },
    tagline: {
      label: "Slogan",
      description: "Krótki slogan opisujący skill",
      placeholder: "Wprowadź slogan",
      validation: {
        minLength: "Slogan musi mieć co najmniej 2 znaki",
        maxLength: "Slogan musi mieć mniej niż 500 znaków",
      },
    },
    source: {
      label: "Źródło",
      description:
        "Źródło tego skilla (wbudowane, niestandardowe lub społecznościowe)",
    },
    isPublic: {
      label: "Udostępnij publicznie",
      description:
        "Włącz, aby udostępnić swój skill społeczności. Po wyłączeniu skill pozostaje prywatny i widoczny tylko dla Ciebie.",
    },
    chatModel: {
      label: "Model czatu",
      placeholder: "Domyślny systemowy",
    },
    voice: {
      label: "Głos",
      description: "Głos tekstu na mowę dla tego skilla",
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
    modelSelection: {
      label: "Wybór modelu",
      description: "Jak model AI jest wybierany dla tego skilla",
    },
    variants: {
      label: "Warianty",
      description:
        "Nazwane warianty z własnymi ustawieniami modelu. Każdy wariant wymaga: id, modelSelection (wymagane), isDefault (dokładnie jeden true).",
      addButton: "Dodaj wariant",
      setDefault: "Ustaw jako domyślny",
      remove: "Usuń",
      defaultBadge: "Domyślny",
      namePlaceholder: "Nazwa wariantu (opcjonalna)",
      skillDefaults: "Domyślne ustawienia skillu",
      skillDefaultsHint: "Fallback gdy wariant nie konfiguruje modalności",
    },
    preferredModel: {
      label: "Preferowany model",
      description: "Preferowany model AI dla tego skilla",
    },
    availableTools: {
      label: "Dozwolone narzędzia",
      description:
        "Narzędzia dla tego skilla. Każdy wpis wymaga toolId. Null = ustawienia globalne.",
    },
    pinnedTools: {
      label: "Przypięte narzędzia",
      description:
        "Przypięte narzędzia paska narzędzi dla tego skilla. Null = ustawienia globalne.",
    },
    compactTrigger: {
      label: "Próg kompresji (tokeny)",
      description:
        "Liczba tokenów wyzwalająca kompresję rozmowy. Null = domyślna globalna.",
    },

    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Dane skilla są nieprawidłowe",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie udało się połączyć z serwerem",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Musisz być zalogowany, aby aktualizować skille",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do aktualizacji tego skilla",
      },
      notFound: {
        title: "Skill nie zostaÅ znaleziony",
        description: "Skill, którą próbujesz zaktualizować, nie istnieje",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas aktualizacji skilla",
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
      title: "Skill zaktualizowany",
      description: "Twój niestandardowy skill został pomyślnie zaktualizowany",
    },
  },
  delete: {
    title: "Usuń skill",
    titleShort: "Usuń skill",
    dynamicTitle: "Usuń: {{name}}",
    description: "Usuń niestandardowy skill",
    container: {
      title: "Usuń skill",
      description: "Trwale usuń tę niestandardowy skill",
    },
    backButton: {
      label: "Powrót do skilli",
    },
    actions: {
      delete: "Usuń skill",
      deleting: "Usuwanie skilla",
    },
    id: {
      label: "ID skilla",
      description: "Slug lub przyjazne ID skilla do usunięcia",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Dane skilla są nieprawidłowe",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z serwerem",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Nie masz uprawnień do usunięcia tego skilla",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do usunięcia tego skilla",
      },
      notFound: {
        title: "Skill nie zostaÅ znaleziony",
        description: "Skill, którą próbujesz usunąć, nie istnieje",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas usuwania skilla",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd podczas usuwania skilla",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Skill został zmodyfikowany przez innego użytkownika",
      },
    },
    success: {
      title: "Skill usunięty",
      description: "Skill został pomyślnie usunięty",
      content: "Skill usunięty pomyślnie",
    },
  },
};
