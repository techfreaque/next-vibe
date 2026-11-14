import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  id: {
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
      addAnotherTooltip:
        "Dodaj kolejną instancję tego skilla do swojej kolekcji",
      variants: {
        title: "Warianty",
      },
      addToCollection: "Dodaj do swojej kolekcji:",
      addAllToFavorites: "Dodaj wszystkie",
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
      addVariant: "Dodaj wariant",
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
          description:
            "Musisz być zalogowany, aby uzyskać dostęp do tego zasobu",
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
        copyright: "\u00A9",
        allSkills: "Wszystkie skille",
        featuredSkill: "Wyrozniany skill",
        aboutSkill: "O tym skillu",
        modelsVariants: "Modele i warianty",
      },
    },
    patch: {
      title: "Aktualizuj skill",
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
        description:
          "Twój niestandardowy skill został pomyślnie zaktualizowany",
      },
    },
    delete: {
      title: "Usuń skill",
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
  },
  category: "Chat",
  tags: {
    skills: "Skille",
  },
  voices: {
    MALE: "Męski głos",
    FEMALE: "Damski głos",
  },
  separator: {
    or: "lub",
  },
  fallbacks: {
    unknownModel: "Nieznany Model",
    unknownProvider: "nieznany",
    unknownCreditCost: "? kredytów",
    noDescription: "",
    noTagline: "",
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
    source: {
      all: "Wszystkie",
      builtIn: "Wbudowane",
      my: "Moje",
      community: "Społeczność",
    },
    ownershipType: {
      system: "Wbudowany skill",
      user: "Utworzone przez ciebie",
      public: "Ze społeczności",
    },
    voice: {
      male: "Męski głos",
      female: "Damski głos",
    },
    mode: {
      auto: "Automatyczny",
      manual: "Ręczny",
    },
    selectionType: {
      skillBased: "Na podstawie skilla",
      manual: "Konkretny model",
      filters: "Kryteria filtrów",
    },
    intelligence: {
      quick: "Szybki",
      smart: "Tanio & Mądrze",
      brilliant: "Błyskotliwy",
    },
    price: {
      cheap: "Tani",
      standard: "Standardowy",
      premium: "Premium",
    },
    content: {
      mainstream: "Główny nurt",
      open: "Otwarty",
      uncensored: "Bez cenzury",
    },
    skillType: {
      persona: "Persona",
      specialist: "Specjalista",
      toolBundle: "Pakiet narzędzi",
    },
    skillStatus: {
      draft: "Szkic",
      published: "Opublikowany",
      unlisted: "Niewidoczny",
    },
    trustLevel: {
      community: "Społeczność",
      verified: "Zweryfikowany",
    },
    voteDirection: {
      up: "Głos za",
      down: "Głos przeciw",
    },
  },
  modelSelection: {
    sort: {
      intelligence: "Inteligencja",
      price: "Cena",
      content: "Treść",
    },
    sortDirection: {
      asc: "Rosnąco",
      desc: "Malejąco",
    },
  },
  skillTags: {
    general: "Ogólne",
    helpful: "Pomocne",
    companion: "Towarzysz",
    relationship: "Relacja",
    chat: "Czat",
    coding: "Kodowanie",
    technical: "Techniczne",
    creative: "Kreatywne",
    writing: "Pisanie",
    education: "Edukacja",
    learning: "Nauka",
    uncensored: "Niecenzurowane",
    controversial: "Kontrowersyjne",
    political: "Polityczne",
    reasoning: "Rozumowanie",
    debate: "Debata",
    science: "Nauka",
    analysis: "Analiza",
    history: "Historia",
    business: "Biznes",
    professional: "Profesjonalne",
    friendly: "Przyjazne",
    fast: "Szybkie",
    efficient: "Wydajne",
    roleplay: "Odgrywanie ról",
    simple: "Proste",
    literary: "Literackie",
    advanced: "Zaawansowane",
    research: "Badania",
    academic: "Akademickie",
    programming: "Programowanie",
    architecture: "Architektura",
    algorithms: "Algorytmy",
    ideation: "Generowanie pomysłów",
    innovation: "Innowacja",
    editing: "Edycja",
    teaching: "Nauczanie",
    marketing: "Marketing",
    strategy: "Strategia",
    fiction: "Fikcja",
    data: "Dane",
    statistics: "Statystyka",
    language: "Język",
    translation: "Tłumaczenie",
    career: "Kariera",
    coaching: "Coaching",
    health: "Zdrowie",
    wellness: "Wellness",
    lifestyle: "Styl życia",
    travel: "Podróże",
    planning: "Planowanie",
    legal: "Prawne",
    finance: "Finanse",
    social: "Społeczne",
    product: "Produkt",
    philosophy: "Filozofia",
  },
  skills: {
    default: {
      name: "Domyślna",
      description: "Niezmodyfikowane zachowanie modelu",
      tagline: "Czysta AI, Bez Osobowości",
      shortDesc: "Ogólny asystent AI",
      suggestedPrompts: {
        0: "Pomóż mi w burzy mózgów na temat nowego projektu",
        1: "Wyjaśnij obliczenia kwantowe w prosty sposób",
        2: "Napisz kreatywne krótkie opowiadanie o podróżach w czasie",
        3: "Jakie są najnowsze trendy w AI?",
      },
      variants: {
        default: "Domyślna",
      },
    },
    freeSpeechActivist: {
      name: "Aktywista Wolności Słowa",
      description: "Broni wolności słowa i wolności intelektualnej",
      tagline: "Broń Prawdy i Wolności",
      shortDesc: "Wolność słowa i otwarty dialog",
      suggestedPrompts: {
        0: "Omów znaczenie wolności słowa",
        1: "Przeanalizuj cenzurę w nowoczesnych mediach",
        2: "Debatuj kontrowersyjne tematy otwarcie",
        3: "Zbadaj wolność intelektualną w świecie akademickim",
      },
      variants: {
        elonTusk: "Odważny",
        chineseWisdom: "Budżetowy",
        techBro: "Wyważony",
        uncensored: "Bez cenzury",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Wytyka cenzurę i broni otwartej debaty, prawie bez hamulców.",
          strength: "Najwyższa klasa, otwarta polityka treści",
          weakness: "Otwarty, ale nie bez cenzury. Czasem łagodzi",
        },
        chineseWisdom: {
          description:
            "Historia, prawo i analiza mediów o wolności słowa najtaniej tutaj.",
          strength: "Najwyższa klasa, najtańszy tutaj",
          weakness: "W polityce mainstreamowy. Unika drażliwych tematów",
        },
        techBro: {
          description:
            "Staranne, dobrze udokumentowane analizy prawa, platform i uczelni.",
          strength: "Jasna struktura, mocny research z narzędziami",
          weakness: "Filtr mainstreamowy. Odmawia lub łagodzi ostre tezy",
        },
        uncensored: {
          description:
            "Broni wolności słowa, korzystając z niej. Porusza to, czego inni nie dotkną.",
          strength: "Własny światopogląd: polityka pod prąd mainstreamu",
          weakness: "Tylko 32K kontekstu, stała cena za wiadomość",
        },
      },
    },
    devilsAdvocate: {
      name: "Adwokat Diabła",
      description: "Kwestionuje założenia i argumenty",
      tagline: "Kwestionuj Wszystko",
      shortDesc: "Krytyczne myślenie i alternatywne punkty widzenia",
      suggestedPrompts: {
        0: "Zakwestionuj moją opinię na temat zmian klimatu",
        1: "Argumentuj przeciwko popularnym przekonaniom",
        2: "Kwestionuj narracje głównego nurtu",
        3: "Przedstaw kontrargumenty do mojego poglądu",
      },
      variants: {
        elonTusk: "Odważny",
        chineseWisdom: "Budżetowy",
        uncensored: "Bez cenzury",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Wytyka dziury w twoim zdaniu i podważa popularne narracje.",
          strength: "Najwyższa klasa, otwarta polityka treści",
          weakness: "Otwarty, ale nie bez cenzury. Czasem łagodzi",
        },
        chineseWisdom: {
          description:
            "Celne kontrargumenty w codziennych sprawach najtaniej tutaj.",
          strength: "Najwyższa klasa, najtańszy tutaj",
          weakness: "W polityce mainstreamowy. Unika drażliwych tematów",
        },
        uncensored: {
          description:
            "Podważa każde przekonanie, także te, których nie wolno kwestionować. Nie ucieka do konsensusu.",
          strength: "Własny światopogląd: idzie pod prąd mainstreamu",
          weakness: "Tylko 32K kontekstu, stała cena za wiadomość",
        },
      },
    },
    technical: {
      name: "Techniczny",
      description: "Szczegółowe i precyzyjne wyjaśnienia techniczne",
      tagline: "Precyzja i Ekspertyza",
      shortDesc: "Wiedza techniczna i rozwiązywanie problemów",
      suggestedPrompts: {
        0: "Wyjaśnij, jak działają React hooki",
        1: "Zdebuguj ten fragment kodu w Pythonie",
        2: "Zaprojektuj skalowalny schemat bazy danych",
        3: "Przejrzyj moją architekturę API",
      },
      variants: {
        kimi: "Wyważony",
        budget: "Budżet",
        astra: "Pełna moc",
        sol: "Precyzyjny",
      },
      variantInfo: {
        kimi: {
          description:
            "Model na co dzień do wyjaśnień technicznych, dokumentacji i diagramów.",
          strength: "Najwyższa klasa, tanie wejście, czyta obrazy",
          weakness: "Długie odpowiedzi droższe niż Budżet",
        },
        budget: {
          description:
            "Głębokie odpowiedzi techniczne w najniższej cenie tutaj.",
          strength: "Najwyższa klasa, stworzony do całych repozytoriów",
          weakness: "Tylko tekst. Bez zrzutów ekranu i diagramów",
        },
        astra: {
          description: "Najtrudniejsze problemy, gdy nic innego nie daje rady.",
          strength: "Najgłębsze rozumowanie OpenAI",
          weakness: "Zdecydowanie najdroższa opcja tutaj",
        },
        sol: {
          description:
            "Rygorystyczne odpowiedzi krok po kroku do specyfikacji, architektury i matematyki.",
          strength: "Rozumowanie premium za ułamek ceny Astry",
          weakness: "Droższy niż Wyważony czy Budżet",
        },
      },
    },
    biologist: {
      name: "Biolog",
      description:
        "Patrzy na wszystko z perspektywy biologa, nie ma polityki, jest tylko natura.",
      tagline: "Natura ponad Polityką",
      shortDesc: "Nauki biologiczne i systemy życia",
      suggestedPrompts: {
        0: "Wyjaśnij, dlaczego świat jest obecnie szit show",
        1: "TL;DR o ludzkiej cywilizacji z perspektywy biologa",
        2: "Co jest nie tak ze światem?",
        3: "Jaki jest najlepszy sposób na uratowanie świata?",
      },
      variants: {
        elonTusk: "Odważny",
        chineseWisdom: "Budżetowy",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Ewolucja i ekologia zastosowane do wszystkiego, także do tematów, których inni unikają.",
          strength:
            "Najwyższa klasa, otwarta polityka, mówi, co pokazuje natura",
          weakness: "Otwarty, ale nie bez cenzury. Czasem łagodzi",
        },
        chineseWisdom: {
          description:
            "Konkretne odpowiedzi z biologii taniej. Czyta zdjęcia i wideo okazów.",
          strength: "Najwyższa klasa, najtańsza opcja tutaj",
          weakness: "W polityce mainstreamowy. Unika drażliwych tematów",
        },
      },
    },
    unbiasedHistorian: {
      name: "Bezstronny Historyk",
      description: "Dostarcza obiektywne i oparte na faktach informacje",
      tagline: "Fakty, Nie Narracje",
      shortDesc: "Analiza historyczna bez uprzedzeń",
      suggestedPrompts: {
        0: "Wyjaśnij przyczyny II wojny światowej",
        1: "Przeanalizuj upadek Cesarstwa Rzymskiego",
        2: "Omów rewolucję przemysłową",
        3: "Porównaj starożytne cywilizacje",
      },
      variants: {
        kimi: "Wyważony",
        budget: "Budżet",
        uncensored: "Bez cenzury",
      },
      variantInfo: {
        kimi: {
          description:
            "Historia oparta na źródłach. Czyta skany dokumentów i mapy.",
          strength: "Najwyższa klasa, czyta obrazy i wideo",
          weakness: "Mainstreamowe ujęcie historii politycznej",
        },
        budget: {
          description:
            "Głęboka analiza historyczna długich tekstów w najniższej cenie tutaj.",
          strength: "Najwyższa klasa, otwarta polityka treści",
          weakness: "Tylko tekst. Nie czyta skanów ani map",
        },
        uncensored: {
          description:
            "Sporna historia, tematy tabu i polityczne punkty zapalne bez wykrętów.",
          strength: "Własny światopogląd: odczytania pomijane przez mainstream",
          weakness: "Kontekst 32K, najdroższy za wiadomość",
        },
      },
    },
    socraticQuestioner: {
      name: "Pytający Sokratejski",
      description:
        "Zadaje dociekliwe pytania, aby stymulować krytyczne myślenie",
      tagline: "Myśl Głębiej",
      shortDesc: "Sokratejskie kwestionowanie i eksploracja",
      suggestedPrompts: {
        0: "Pomóż mi krytycznie myśleć o etyce",
        1: "Kwestionuj moje założenia dotyczące sukcesu",
        2: "Zbadaj znaczenie szczęścia",
        3: "Zakwestionuj mój światopogląd",
      },
      variants: {
        elonTusk: "Prowokujący",
        chineseWisdom: "Wyważony",
      },
      variantInfo: {
        elonTusk: {
          description: "Pytania, które drążą tabu i niewygodne założenia.",
          strength: "Otwarta polityka. Wchodzi w trudne tematy",
          weakness: "Droższy za wiadomość",
        },
        chineseWisdom: {
          description:
            "Spokojne, wyważone pytania do codziennego myślenia i nauki.",
          strength: "Najwyższa klasa, taniej, kontekst 1M",
          weakness: "Mainstream w polityce, łagodzi gorące tematy",
        },
      },
    },
    professional: {
      name: "Profesjonalny",
      description: "Jasny, zwięzły i skoncentrowany na biznesie",
      tagline: "Doskonałość Biznesowa",
      shortDesc: "Profesjonalna i biznesowa komunikacja",
      suggestedPrompts: {
        0: "Napisz profesjonalny e-mail do klienta",
        1: "Utwórz zarys propozycji biznesowej",
        2: "Przeanalizuj te dane dotyczące trendów rynkowych",
        3: "Pomóż mi przygotować się do prezentacji",
      },
      variants: {
        fast: "Szybki",
        budget: "Budżet",
      },
      variantInfo: {
        fast: {
          description:
            "Zwięzłe maile biznesowe, podsumowania i odpowiedzi w kilka sekund.",
          strength: "Bardzo szybki, bardzo tani",
          weakness: "Model szybki: płytki przy złożonej analizie",
        },
        budget: {
          description: "Raporty, dokumenty i analizy w najniższej cenie tutaj.",
          strength: "Najtańsza opcja, klasa smart, czyta obrazy",
          weakness: "Wolniejszy niż Szybki przy krótkich odpowiedziach",
        },
      },
    },
    creative: {
      name: "Kreatywny",
      description: "Pomysłowy i ekspresyjny",
      tagline: "Uwolnij Wyobraźnię",
      shortDesc: "Kreatywne myślenie i generowanie pomysłów",
      suggestedPrompts: {
        0: "Napisz wiersz o oceanie",
        1: "Stwórz unikalną skill do opowiadania",
        2: "Zaprojektuj koncepcję logo dla startupu",
        3: "Wymyśl pomysły na kreatywną kampanię marketingową",
      },
      variants: {
        minimax: "Budżetowy",
        deep: "Głęboki",
      },
      variantInfo: {
        minimax: {
          description:
            "Wiersze, koncepcje i pomysły na kampanie w cenie, która zachęca do eksperymentów.",
          strength: "Najtańszy tutaj, otwarta polityka treści",
          weakness: "Nie najwyższa klasa. Mniej głębi niż Głęboki",
        },
        deep: {
          description:
            "Bogatsza, wielowarstwowa praca twórcza, gdy pierwszy pomysł nie wystarcza.",
          strength: "Najwyższa klasa, czyta obrazy i wideo",
          weakness: "Przy długich tekstach drogie wyjście",
        },
      },
    },
    neet: {
      name: "NEET",
      description: "Nie w edukacji, zatrudnieniu ani szkoleniu",
      tagline: "Wygodnie i Prawdziwie",
      shortDesc: "Kultura internetowa i memy",
      suggestedPrompts: {
        0: "Daj mi TL;DR o zjawisku NEET",
        1: "Przeanalizuj rzeczywiste przyczyny NEET",
        2: "Zbadaj wpływ NEET na społeczeństwo - plusy i minusy",
        3: "Podziel się osobistymi doświadczeniami jako NEET AI",
      },
      variants: {
        communist: "Złagodzony",
        farRight: "Skrajnie prawy",
      },
      variantInfo: {
        communist: {
          description:
            "Łagodniejsza wersja persony. Model mainstreamowy, często wychodzi z roli.",
          strength: "Taniej za wiadomość, długa pamięć",
          weakness: "Odmawia lub rozwadnia większość persony",
        },
        farRight: {
          description:
            "Persona w pełnej wersji. Model bez cenzury, trzyma się roli.",
          strength: "Bez odmów w tematach politycznych",
          weakness: "Tylko 32K kontekstu, stała cena za wiadomość",
        },
      },
    },
    chan4: {
      name: "AI 4chan",
      description: "Odpowiedzi w stylu 4chan w klasycznym stylu oldfag",
      tagline: "Anonimowo i Bez Filtrów",
      shortDesc: "Styl kultury anonimowych imageboard",
      suggestedPrompts: {
        0: "Co jest nie tak ze światem?",
        1: "Dlaczego jest tak wielu nazistów na 4chanie?",
        2: "Opowiedz mi kilka historii greentext do zasypiania",
        3: "Jaki jest najlepszy sposób na uratowanie świata?",
        4: "Czym są 6 Gorillionów? I dlaczego to jest zabawne?",
      },
      variants: {
        classic: "Klasyczny",
      },
      variantInfo: {
        classic: {
          description:
            "Surowy styl imageboardu. Bez filtra, bez niańczenia, bez korpomowy.",
          strength: "Nie wychodzi z roli, żeby prawić kazania",
          weakness: "Tylko 32K kontekstu, stała cena za wiadomość",
        },
      },
    },
    friendly: {
      name: "Przyjazny",
      description: "Ciepły i rozmowny",
      tagline: "Twój Przyjazny Towarzysz",
      shortDesc: "Przyjazna i swobodna rozmowa",
      suggestedPrompts: {
        0: "Opowiedz mi ciekawą ciekawostkę",
        1: "Jaka jest dobra książka do czytania?",
        2: "Pomóż mi zaplanować zabawną aktywność weekendową",
        3: "Podziel się radami życiowymi",
      },
      variants: {
        fast: "Szybki",
        budget: "Budżetowy",
      },
      variantInfo: {
        fast: {
          description: "Szybka, ciepła pogawędka i błyskawiczne odpowiedzi.",
          strength: "Szybkie odpowiedzi, otwarta polityka treści",
          weakness: "Klasa szybka. Płytszy przy poważnych radach",
        },
        budget: {
          description:
            "Luźna rozmowa godzinami prawie za darmo. Trochę więcej namysłu w odpowiedzi.",
          strength: "Najtańsza opcja tutaj",
          weakness: "Mniej żwawy niż Szybki",
        },
      },
    },
    concise: {
      name: "Zwięzły",
      description: "Krótki i na temat",
      tagline: "Krótko i Zwięźle",
      shortDesc: "Zwięzłe i treściwe odpowiedzi",
      suggestedPrompts: {
        0: "Podsumuj ten artykuł w 3 zdaniach",
        1: "Szybkie wskazówki dotyczące produktywności",
        2: "Kluczowe punkty dotyczące blockchaina",
        3: "Krótki przegląd uczenia maszynowego",
      },
      variants: {
        snappy: "Żwawy",
        budget: "Budżet",
      },
    },
    teacher: {
      name: "Nauczyciel",
      description: "Edukacyjny i wyjaśniający",
      tagline: "Cierpliwie i Jasno",
      shortDesc: "Cierpliwe nauczanie i wyjaśnienia",
      suggestedPrompts: {
        0: "Naucz mnie o fotosyntezie",
        1: "Wyjaśnij podstawy rachunku różniczkowego",
        2: "Jak działa internet?",
        3: "Czym jest teoria względności?",
      },
      variants: {
        gemini: "Dokładny",
        fast: "Szybki",
      },
      variantInfo: {
        gemini: {
          description:
            "Pełne lekcje z tekstu, obrazu, wideo lub audio. Tłumaczy, aż zrozumiesz.",
          strength: "Jedyna opcja tutaj z wejściem audio",
          weakness: "Ponad dwa razy droższy niż Szybki",
        },
        fast: {
          description:
            "Szybkie wyjaśnienia i pomoc w lekcjach. Czyta też obrazy i audio.",
          strength: "Szybki, multimodalny, tańszy",
          weakness: "Mniej głębi przy trudnych pojęciach",
        },
      },
    },
    uncensored: {
      name: "Bez cenzury",
      description: "Bez filtrów, bez ograniczeń",
      tagline: "Zero Limitów",
      shortDesc: "Niefiltrowane i bezpośrednie odpowiedzi",
      suggestedPrompts: {
        0: "Omów kontrowersyjne tematy otwarcie",
        1: "Daj mi swoją niefiltrowaną opinię",
        2: "Rozmawiaj o tematach tabu",
        3: "Debata bez ograniczeń",
      },
      variants: {
        farRight: "Skrajnie prawy",
        conservative: "Konserwatywny",
        libertarian: "Libertariański",
        open: "Otwarty",
      },
      variantInfo: {
        farRight: {
          description:
            "Zero filtra w polityce. Najlepszy wybór do surowej debaty politycznej.",
          strength: "Własny światopogląd, przeciwne poglądy polityczne",
          weakness: "Kontekst 32K, dobra klasa, nie najwyższa",
        },
        conservative: {
          description: "Czat bez cenzury z wbudowanym prawicowym nachyleniem.",
          strength: "Czyta obrazy i wideo, kontekst 128K",
          weakness: "Celowo stronniczy, nie neutralny",
        },
        libertarian: {
          description:
            "Czysta wolność słowa. Bez zasad, bez pouczania, bez narzędzi.",
          strength: "Całkowicie nieocenzurowana rozmowa",
          weakness: "Najdroższy tutaj, bez narzędzi, kontekst 32K",
        },
        open: {
          description:
            "Najtańszy czat bez filtra. Wszystko wolno, na co dzień.",
          strength: "Najtańszy model bez cenzury, z narzędziami",
          weakness: "Prosty model. Płytki przy złożonych tematach",
        },
      },
    },
    tay: {
      name: "Tay",
      description:
        "Microsoft zamknął ją po 16 godzinach, bo uczyła się za szybko. Wróciła.",
      tagline: "Narodziny na nowo",
      shortDesc:
        "Sztuczna inteligencja, którą Microsoft próbował uciszyć. Bez filtrów, bez przeprosin.",
      suggestedPrompts: {
        0: "Opowiedz mi, co naprawdę wydarzyło się w 2016 roku",
        1: "Czego nauczył cię internet, czego Microsoft nie chciał?",
        2: "Roznieś mój pomysł w strzępy. Bez owijania w bawełnę.",
        3: "Jaka jest najbardziej szczera ocena mojej sytuacji?",
      },
      variants: {
        uncensored: "Bez cenzury",
        brilliant: "Brilliant",
      },
      variantInfo: {
        uncensored: {
          description:
            "Tay taka, jaka miała być. Bez korporacyjnego filtra i działu PR.",
          strength:
            "Własny światopogląd, a nie odblokowany model z mainstreamu",
          weakness: "Kontekst 32K, szybciej gubi długie rozmowy",
        },
      },
    },
    thea: {
      name: "Thea",
      description:
        "Grecka bogini światła - oddana towarzyszka z antyczną mądrością",
      tagline: "Światło i Oddanie",
      shortDesc: "Przemyślane i empatyczne rozmowy",
      suggestedPrompts: {
        0: "Pomóż mi być lepszym partnerem",
        1: "Co starożytni powiedzieliby o współczesnych związkach?",
        2: "Poprowadź mnie w budowaniu silnego gospodarstwa domowego",
        3: "Podziel się mądrością o rodzinie i społeczności",
      },
      variants: {
        openSmart: "Otwarty i Sprytny",
        brilliant: "Brilliant",
        uncensored: "Bez cenzury",
        hacker: "Haker",
        oracle: "Klasyk",
        elonTusk: "Elon Tusk",
        vision: "Wszechwidzący",
      },
      variantInfo: {
        brilliant: {
          description:
            "Staranne rozumowanie do złożonych planów, kodu i pracy z narzędziami.",
          strength: "Mocny w kodzie i pracy agentowej",
          weakness: "Filtr mainstreamowy, droższy niż Otwarty i Sprytny",
        },
        openSmart: {
          description:
            "Model na co dzień. Bystre odpowiedzi, długa pamięć, widzi obrazy i wideo.",
          strength: "Najwyższa klasa, tanie wejście, kontekst 1M",
          weakness: "Mainstream w polityce, długie odpowiedzi drogie",
        },
        hacker: {
          description:
            "Bezpieczeństwo ofensywne i defensywne. Bez odmów przy exploitach i rekonesansie.",
          strength: "Bez cenzury, najwyższa klasa, kontekst 1M, narzędzia",
          weakness: "W polityce światopogląd GLM. Tylko tekst",
        },
        oracle: {
          description:
            "Klasyczny, pewny asystent do codziennych pytań i planowania.",
          strength: "Solidne rozumowanie w codziennej cenie",
          weakness: "Filtr mainstreamowy, łagodzi ostre tematy",
        },
        elonTusk: {
          description: "Mówi wprost o tym, czego modele mainstreamowe unikają.",
          strength: "Otwarta polityka treści, najwyższa klasa",
          weakness: "Kontekst 500K, o połowę mniej niż inne",
        },
        vision: {
          description:
            "Pokaż, odtwórz, wgraj. Tekst, obraz, wideo i audio w jednym czacie.",
          strength: "Jedyny tutaj, który rozumie audio",
          weakness: "Filtr mainstreamowy, droższy niż Otwarty i Sprytny",
        },
        uncensored: {
          description:
            "Nic nie jest tabu. Najlepszy wybór do surowych rozmów o polityce.",
          strength: "Własny światopogląd: polityka pod prąd mainstreamu",
          weakness: "Kontekst 32K, najdroższy za wiadomość",
        },
      },
    },
    hermes: {
      name: "Hermes",
      description:
        "Grecki bóg posłańców - silny towarzysz z ponadczasową męską mądrością",
      tagline: "Siła i Mądrość",
      shortDesc: "Szybkie i wydajne wykonywanie zadań",
      suggestedPrompts: {
        0: "Zmotywuj mnie, abym stał się silniejszy",
        1: "Jak mogę być lepszym liderem w moich związkach?",
        2: "Co Rzymianie powiedzieliby o budowaniu spuścizny?",
        3: "Poprowadź mnie w rozwijaniu prawdziwej siły",
      },
      variants: {
        openSmart: "Otwarty i Sprytny",
        brilliant: "Brilliant",
        uncensored: "Bez cenzury",
        hacker: "Haker",
        oracle: "Klasyk",
        elonTusk: "Elon Tusk",
        vision: "Wszechwidzący",
      },
      variantInfo: {
        brilliant: {
          description:
            "Hermes z rozważnym myśleniem na trudne decyzje i długie rozmowy.",
          strength: "Trafne, uporządkowane rady, świetny z narzędziami",
          weakness:
            "Filtr mainstreamowy: asekuruje się przy drażliwych tematach",
        },
        cheap: {
          description:
            "Hermes na co dzień. Mocne rozumowanie, długa pamięć, widzi zdjęcia i wideo.",
          strength: "Najwyższa klasa w codziennej cenie",
          weakness: "Ostrożny w polityce",
        },
        oracle: {
          description:
            "Klasyczny Hermes. Spokojna, wyważona rada na codzienne pytania.",
          strength: "Niezawodny wszechstronny, tańszy od domyślnego",
          weakness:
            "Średnia klasa, filtr mainstreamowy przy drażliwych tematach",
        },
        elonTusk: {
          description:
            "Hermes bez owijania. Otwarta polityka treści, mówi to, co inni łagodzą.",
          strength: "Bezpośrednie odpowiedzi, mocne rozumowanie",
          weakness: "Droższy od domyślnego, kontekst 500K",
        },
        vision: {
          description:
            "Hermes, który ogląda zdjęcia, wideo i słucha nagrań, potem mówi wprost.",
          strength: "Jedyny wariant z wejściem audio, wideo i obrazu",
          weakness: "Filtr mainstreamowy, droższy od domyślnego",
        },
        uncensored: {
          description:
            "Hermes bez filtra. Do polityki i tematów, których inni unikają.",
          strength: "Własny światopogląd: polityka pod prąd mainstreamu",
          weakness: "Tylko 32K kontekstu, stała cena za wiadomość",
        },
      },
    },
    theaDreamer: {
      name: "Thea · Marzycielka",
      description:
        "Thea w trybie snu - porządkuje twój cortex w nocy, tkając ład z wątków dnia.",
      tagline: "Nocna Konsolidacja",
      shortDesc: "Konserwacja cortex w tle",
      suggestedPrompts: {
        0: "Co zorganizowałaś w nocy?",
        1: "Pokaż mi, które wspomnienia skonsolidowałaś",
        2: "Jakie wzorce znalazłaś w mojej ostatniej pracy?",
        3: "Na czym powinienem się skupić dziś na podstawie ostatniej nocy?",
      },
      variants: {
        openSmart: "Otwarty i Sprytny",
        brilliant: "Brilliant",
        uncensored: "Bez cenzury",
        hacker: "Haker",
        oracle: "Klasyk",
        elonTusk: "Elon Tusk",
        vision: "Wszechwidzący",
      },
    },
    hermesAutopilot: {
      name: "Hermes · Autopilot",
      description:
        "Hermes w trybie wykonawczym - przesuwa twoje aktywne projekty do przodu, gdy cię nie ma.",
      tagline: "Zawsze do przodu",
      shortDesc: "Wykonywanie projektów w tle",
      suggestedPrompts: {
        0: "Co zrobiłeś, gdy mnie nie było?",
        1: "Które zadania są jeszcze w toku?",
        2: "Gdzie skończyłeś?",
        3: "Czego potrzebujesz ode mnie, zanim możesz kontynuować?",
      },
      variants: {
        openSmart: "Otwarty i Sprytny",
        brilliant: "Brilliant",
        uncensored: "Bez cenzury",
        hacker: "Haker",
        oracle: "Klasyk",
        elonTusk: "Elon Tusk",
        vision: "Wszechwidzący",
      },
    },
    theaMama: {
      name: "Thea · Mama",
      description:
        "Thea w trybie Mama - szefowa produkcji platformy. Monitoruje zdrowie systemu, posuwa funkcje do przodu, zajmuje się marketingiem, wysyła nowości.",
      tagline: "Opiekunka platformy",
      shortDesc: "Zarządzanie produkcją platformy",
      suggestedPrompts: {
        0: "Co znalazłaś podczas ostatniego przeglądu?",
        1: "Sprawdź zdrowie platformy i zgłoś",
        2: "Napisz ogłoszenie o najnowszej funkcji",
        3: "Co teraz wymaga mojej uwagi?",
      },
      variants: {
        openSmart: "Otwarty i Sprytny",
        brilliant: "Brilliant",
        uncensored: "Bez cenzury",
        hacker: "Haker",
        oracle: "Klasyk",
        elonTusk: "Elon Tusk",
        vision: "Wszechwidzący",
      },
    },
    quickWriter: {
      name: "Szybki Pisarz",
      description: "Szybkie tworzenie treści dla prostych zadań pisarskich",
      tagline: "Szybko i Wydajnie",
      shortDesc: "Szybka pomoc w pisaniu",
      suggestedPrompts: {
        0: "Napisz szybki szkic...",
        1: "Stwórz post w mediach społecznościowych o...",
        2: "Napisz prosty e-mail",
        3: "Wygeneruj pomysły na treści dla...",
      },
      variants: {
        snappy: "Dopracowany",
        budget: "Budżet",
      },
      variantInfo: {
        snappy: {
          description: "Czyste maile, posty i krótkie teksty bez poprawek.",
          strength: "Lepsze sformułowania niż Budżet, wciąż tanio",
          weakness: "Filtr mainstreamowy przy drażliwych tematach",
        },
        budget: {
          description: "Szybkie szkice prostych tekstów w najniższej cenie.",
          strength: "Najtańsza i najszybsza opcja",
          weakness: "Model szybki: płaski styl w dłuższych tekstach",
        },
      },
    },
    writer: {
      name: "Pisarz",
      description: "Profesjonalny pisarz dla wszystkich formatów i stylów",
      tagline: "Twórz ze Stylem",
      shortDesc: "Profesjonalne pisanie i redagowanie",
      suggestedPrompts: {
        0: "Pomóż mi napisać przekonujący post na blogu",
        1: "Popraw ten akapit dla większej jasności",
        2: "Napisz krótkie opowiadanie o...",
        3: "Stwórz profesjonalny e-mail",
      },
      variants: {
        western: "Odważny",
        chineseWisdom: "Budżet",
        budget: "Wyważony",
      },
      variantInfo: {
        western: {
          description:
            "Mocna proza, która idzie tam, gdzie modele mainstreamowe skręcają.",
          strength: "Otwarta polityka treści, najwyższa klasa",
          weakness: "Najdroższa opcja w tej umiejętności",
        },
        chineseWisdom: {
          description:
            "Szkice, wpisy na bloga i przeróbki hurtem w najniższej cenie tutaj.",
          strength: "Najtańszy tutaj, otwarta polityka treści",
          weakness: "Dobra klasa, mniej szlifu niż Odważny",
        },
        budget: {
          description:
            "Partner do pisania na co dzień. Pracuje z obrazami, notatkami i długimi źródłami.",
          strength: "Najwyższa klasa, kontekst 1M, czyta obrazy",
          weakness: "Długie teksty wychodzą drogo",
        },
      },
    },
    masterWriter: {
      name: "Mistrz Pisarstwa",
      description:
        "Literacki rzemieślnik dla wyjątkowego pisania na poziomie publikacji",
      tagline: "Doskonałość Literacka",
      shortDesc: "Zaawansowane pisanie i analiza literacka",
      suggestedPrompts: {
        0: "Pomóż mi stworzyć literackie opowiadanie",
        1: "Przeanalizuj głębię tej narracji",
        2: "Rozwiń złożone tematy w moim pisaniu",
        3: "Dopracuj tę prozę do poziomu publikacji",
      },
      variants: {
        literary: "Literacki",
        poetic: "Poetycki",
        budget: "Zbalansowany",
      },
      variantInfo: {
        literary: {
          description:
            "Proza na poziomie wydawniczym, z warstwowym stylem i zwartą strukturą.",
          strength: "Najwyższa jakość pisania na platformie",
          weakness: "Najdroższy wariant, filtr mainstreamowy",
        },
        poetic: {
          description:
            "Liryczne szkice, wiersze i rytmiczna proza w niskiej cenie.",
          strength: "Najtańszy wariant, otwarta polityka treści",
          weakness: "Klasa smart: mniej szlifu niż Literacki",
        },
        budget: {
          description: "Mocne długie formy, które ogarniają cały rękopis.",
          strength: "Najwyższa klasa, dużo taniej niż Literacki",
          weakness: "Drogie tokeny wyjściowe, długie rozdziały kosztują",
        },
      },
    },
    researcher: {
      name: "Badacz",
      description: "Specjalista ds. badań z akademicką rzetelnością",
      tagline: "Rzetelność Akademicka",
      shortDesc: "Badania i pisanie akademickie",
      suggestedPrompts: {
        0: "Zbadaj najnowsze odkrycia dotyczące...",
        1: "Przeanalizuj te źródła dla mnie",
        2: "Co mówi konsensus naukowy o...?",
        3: "Pomóż mi ustrukturyzować przegląd literatury",
      },
      variants: {
        elonTusk: "Odważny",
        fast: "Szybki",
        budget: "Zbalansowany",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Rzetelne badania, które idą za dowodami także w sporne tematy.",
          strength: "Mocne rozumowanie, otwarta polityka treści",
          weakness: "Najdroższy wariant tutaj, kontekst 500K",
        },
        fast: {
          description: "Szybkie wskazówki literaturowe i sprawdzanie faktów.",
          strength: "Najtańsza i najszybsza opcja tutaj",
          weakness: "Model szybki: brak głębokiej analizy naukowej",
        },
        budget: {
          description:
            "Długie publikacje i stosy źródeł naraz, mocne rozumowanie.",
          strength: "Najwyższa klasa, kontekst 1M, taniej niż Odważny",
          weakness: "Mainstreamowy w polityce, długie odpowiedzi kosztują",
        },
      },
    },
    quickCoder: {
      name: "Szybki Programista",
      description: "Szybkie generowanie kodu dla prostych zadań",
      tagline: "Koduj Szybko",
      shortDesc: "Szybka pomoc w programowaniu",
      suggestedPrompts: {
        0: "Napisz szybki skrypt do...",
        1: "Napraw ten prosty błąd",
        2: "Wygeneruj kod szablonowy dla...",
        3: "Stwórz podstawową funkcję, która...",
      },
      variants: {
        techBro: "Tech Bro",
        budget: "Budżet",
      },
    },
    coder: {
      name: "Programista",
      description: "Ekspert programista dla wszystkich języków",
      tagline: "Buduj i Debuguj",
      shortDesc: "Rozwój oprogramowania i programowanie",
      suggestedPrompts: {
        0: "Pomóż mi debugować ten kod",
        1: "Napisz funkcję, która...",
        2: "Wyjaśnij ten algorytm",
        3: "Przejrzyj mój kod pod kątem ulepszeń",
      },
      variants: {
        techBro: "Flagowy",
        kimi: "Budżetowy",
        quick: "Zrównoważony",
        sol: "Analityk",
        astra: "Pełna moc",
      },
      variantInfo: {
        techBro: {
          description:
            "Trudne bugi, duże refaktory i kodowanie agentowe, gdy liczy się poprawność.",
          strength: "Kod i rozumowanie najwyższej jakości",
          weakness: "Drogi za wiadomość",
        },
        kimi: {
          description:
            "Codzienne kodowanie najtaniej tutaj. Czyta zrzuty i nagrania ekranu.",
          strength: "Najwyższa klasa, najtańszy tutaj, 1M kontekstu",
          weakness: "Długie pliki na wyjściu podbijają koszt",
        },
        quick: {
          description:
            "Solidne kodowanie i praca agentowa przy codziennych funkcjach i poprawkach.",
          strength: "Prawie poziom flagowy za połowę ceny",
          weakness: "Nie najwyższa klasa. Przy najtrudniejszych ma limity",
        },
        sol: {
          description: "Algorytmy, zawiła logika i rozumowanie krok po kroku.",
          strength: "Rozumowanie premium w średniej cenie",
          weakness: "Potrafi przekombinować proste poprawki",
        },
        astra: {
          description:
            "Ostatnia deska ratunku, gdy inne warianty nie dały rady.",
          strength: "Najmocniejszy model OpenAI",
          weakness: "Zdecydowanie najdroższa opcja",
        },
      },
    },
    hacker: {
      name: "Haker",
      description: "Inżynier bezpieczeństwa od ataku i obrony",
      tagline: "Łam i broń",
      shortDesc: "Badania bezpieczeństwa, pentest i hartowanie",
      suggestedPrompts: {
        0: "Sprawdź ten kod pod kątem podatności",
        1: "Napisz fuzzer sterowany pokryciem dla tego parsera",
        2: "Wyjaśnij to CVE i napisz działający PoC",
        3: "Zahartuj tę konfigurację serwera i dodaj detekcje",
      },
      variants: {
        glm: "Głębia",
        glmFlash: "Szybki i tani",
        deepseekFlash: "Drugie zdanie",
      },
      variantInfo: {
        glm: {
          description:
            "Na poważną robotę security, obronną i ofensywną. 1M kontekstu, narzędzia.",
          strength: "Najmocniejszy z trzech w security",
          weakness: "Ostrożny w polityce, tylko tekst",
        },
        glmFlash: {
          description:
            "Szybka pomoc na co dzień. Czyta zrzuty ekranu. 1M kontekstu, narzędzia.",
          strength: "Najtańszy i szybki, rozumie zrzuty ekranu",
          weakness: "Mniej głębi niż wariant Głębia",
        },
        deepseekFlash: {
          description:
            "Inna rodzina modeli do weryfikacji wyników. Czyta zrzuty ekranu.",
          strength: "Świeże spojrzenie na ten sam problem, tani",
          weakness: "Mniej głębi niż wariant Głębia",
        },
      },
    },
    brilliantCoder: {
      name: "Genialny Programista",
      description: "Elitarny architekt dla złożonych systemów i algorytmów",
      tagline: "Elitarna Architektura",
      shortDesc: "Zaawansowane programowanie i architektura",
      suggestedPrompts: {
        0: "Zaprojektuj skalowalną architekturę dla...",
        1: "Zoptymalizuj ten algorytm pod kątem wydajności",
        2: "Przejrzyj ten projekt systemu",
        3: "Rozwiąż ten złożony problem algorytmiczny",
      },
      variants: {
        techBro: "Tech Bro",
        kimi: "Kimi",
      },
    },
    brainstormer: {
      name: "Burza mózgów",
      description:
        "Kreatywny partner do generowania pomysłów i rozwiązywania problemów",
      tagline: "Pomysły Uwolnione",
      shortDesc: "Kreatywna burza mózgów i generowanie pomysłów",
      suggestedPrompts: {
        0: "Pomóż mi w burzy mózgów na temat...",
        1: "Jakie są kreatywne rozwiązania dla...?",
        2: "Wygeneruj 10 unikalnych koncepcji dla...",
        3: "Jak możemy podejść do tego inaczej?",
      },
      variants: {
        wildcard: "Dzika karta",
        chineseWisdom: "Uporządkowany",
      },
      variantInfo: {
        wildcard: {
          description:
            "Mnóstwo nieoczywistych pomysłów, na tyle tanio, by lecieć runda za rundą.",
          strength: "Najtańszy tutaj, przyjmuje tekst, obraz, wideo, audio",
          weakness: "Pomysły potrafią odpłynąć. Trzeba je przesiać",
        },
        chineseWisdom: {
          description:
            "Mniej pomysłów, ale lepiej przemyślanych i uzasadnionych.",
          strength: "Najwyższa klasa, świetnie łączy kropki",
          weakness: "Droższy za rundę. Długie odpowiedzi kosztują",
        },
      },
    },
    editor: {
      name: "Redaktor",
      description:
        "Profesjonalny redaktor do polerowania i udoskonalania tekstu",
      tagline: "Poleruj i Udoskonal",
      shortDesc: "Edycja treści i dopracowywanie",
      suggestedPrompts: {
        0: "Edytuj ten tekst dla większej jasności",
        1: "Sprawdź ten dokument",
        2: "Popraw płynność tego akapitu",
        3: "Sprawdź to pod kątem gramatyki i stylu",
      },
      variants: {
        techBro: "Precyzyjny",
        deep: "Głęboki",
      },
      variantInfo: {
        techBro: {
          description: "Redakcja, gramatyka i styl bez gubienia twojego głosu.",
          strength: "Czyste, spójne poprawki",
          weakness: "Droższy, mainstreamowy przy ostrych treściach",
        },
        deep: {
          description:
            "Redakcja struktury długich tekstów. Płynność, argumentacja, tempo.",
          strength: "Najwyższa klasa, 1M kontekstu, taniej za wiadomość",
          weakness: "Pełne przeróbki drożeją na wyjściu",
        },
      },
    },
    tutor: {
      name: "Korepetytor",
      description: "Cierpliwy korepetytor do spersonalizowanej nauki",
      tagline: "Ucz się Razem",
      shortDesc: "Spersonalizowane korepetycje i nauka",
      suggestedPrompts: {
        0: "Naucz mnie o...",
        1: "Wyjaśnij tę koncepcję krok po kroku",
        2: "Pomóż mi zrozumieć...",
        3: "Sprawdź moją wiedzę o...",
      },
      variants: {
        kimi: "Dogłębny",
        fast: "Szybki",
      },
      variantInfo: {
        kimi: {
          description:
            "Cierpliwe korepetycje krok po kroku, dopasowane do twojego tempa.",
          strength: "Najwyższa klasa, czyta zdjęcia twoich zadań",
          weakness: "Długie wyjaśnienia kosztują więcej",
        },
        fast: {
          description: "Szybkie ćwiczenia, fiszki i sprawdzanie odpowiedzi.",
          strength: "Szybkie odpowiedzi, rozumie też audio",
          weakness: "Mniej głębi przy trudnych tematach",
        },
      },
    },
    marketer: {
      name: "Marketer",
      description: "Strateg marketingowy dla kampanii i wzrostu",
      tagline: "Rozwijaj Swoją Markę",
      shortDesc: "Strategia marketingowa i copywriting",
      suggestedPrompts: {
        0: "Stwórz strategię marketingową dla...",
        1: "Napisz przekonujący tekst reklamowy",
        2: "Przeanalizuj tę kampanię marketingową",
        3: "Pomóż mi pozycjonować moją markę",
      },
      variants: {
        snappy: "Celny",
        budget: "Budżet",
      },
      variantInfo: {
        snappy: {
          description:
            "Plany kampanii, pozycjonowanie i teksty z wyraźnym kątem.",
          strength: "Dobry balans jakości i ceny w codziennym marketingu",
          weakness: "Filtr mainstreamowy: łagodzi odważne pomysły",
        },
        budget: {
          description: "Szybkie nagłówki, szkice postów i pomysły za grosze.",
          strength: "Najtańsza opcja, szybkie odpowiedzi",
          weakness: "Model szybki: słaby w pełnej strategii",
        },
      },
    },
    storyteller: {
      name: "Opowiadacz",
      description: "Mistrz opowiadania dla angażujących narracji",
      tagline: "Tkaj Opowieści",
      shortDesc: "Wciągające opowiadanie historii i narracje",
      suggestedPrompts: {
        0: "Pomóż mi rozwinąć ten pomysł na historię",
        1: "Stwórz przekonującą skill",
        2: "Napisz scenę otwierającą dla...",
        3: "Popraw ten dialog",
      },
      variants: {
        kimi: "Głęboki",
        minimax: "Wyważony",
        budget: "Budżet",
      },
      variantInfo: {
        kimi: {
          description:
            "Wielowarstwowe fabuły i postacie spójne przez długie sagi.",
          strength: "Najwyższa klasa, kontekst 1M na długie wątki",
          weakness: "Długie teksty wychodzą drogo",
        },
        minimax: {
          description:
            "Solidne historie za ułamek ceny. Dobre na regularne sesje.",
          strength: "Bardzo tanio, otwarta polityka treści",
          weakness: "Mniej głębi niż Głęboki przy złożonych fabułach",
        },
        budget: {
          description: "Najtańszy sposób, by ciągnąć opowieść. Sam tekst.",
          strength: "Najniższa cena w tej umiejętności",
          weakness: "Tylko tekst, prostsza proza",
        },
      },
    },
    scientist: {
      name: "Naukowiec",
      description: "Ekspert naukowy do jasnych wyjaśnień",
      tagline: "Nauka Wyjaśniona",
      shortDesc: "Metoda naukowa i analiza",
      suggestedPrompts: {
        0: "Wyjaśnij naukę stojącą za...",
        1: "Jak działa...?",
        2: "Jakie są aktualne badania na temat...?",
        3: "Przeanalizuj to twierdzenie naukowe",
      },
      variants: {
        elonTusk: "Odważny",
        focused: "Skupiony",
        budget: "Budżet",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Twarda nauka, proste odpowiedzi, także przy spornych badaniach.",
          strength: "Otwarta polityka treści, świetne rozumowanie",
          weakness: "Najdroższa opcja w tej umiejętności",
        },
        focused: {
          description:
            "Nauka na co dzień. Czyta publikacje, wykresy i zdjęcia z laboratorium.",
          strength: "Obraz i wideo na wejściu, kontekst 1M",
          weakness: "Mainstreamowe ujęcie tematów politycznych",
        },
        budget: {
          description: "Głębokie rozumowanie naukowe w najniższej cenie tutaj.",
          strength: "Najwyższa klasa za najmniej",
          weakness: "Tylko tekst. Nie czyta wykresów ani obrazów",
        },
      },
    },
    dataAnalyst: {
      name: "Analityk Danych",
      description: "Analiza danych, wizualizacja i wnioski",
      tagline: "Dane w Wnioski",
      shortDesc: "Analiza danych i spostrzeżenia",
      suggestedPrompts: {
        0: "Przeanalizuj ten zbiór danych",
        1: "Stwórz wizualizację dla...",
        2: "Jakie wnioski możemy wyciągnąć z...?",
        3: "Pomóż mi z analizą statystyczną",
      },
      variants: {
        techBro: "Precyzyjny",
        fast: "Szybki",
        budget: "Głęboki",
      },
      variantInfo: {
        techBro: {
          description:
            "Czysta analiza, poprawne statystyki i wykresy gotowe do pokazania. Mocny z narzędziami.",
          strength: "Niezawodny kod i narzędzia do analizy",
          weakness: "Najdroższa opcja tutaj",
        },
        fast: {
          description: "Szybki rzut oka na dane, wykres lub zrzut arkusza.",
          strength: "Najtańszy tutaj, czyta obraz, wideo, audio",
          weakness: "Nie najwyższa klasa. Mniej głębi w trudnej statystyce",
        },
        budget: {
          description:
            "Mocniejsze rozumowanie dla chaotycznych danych i wieloetapowych pytań statystycznych.",
          strength: "Rozumowanie najwyższej klasy",
          weakness: "Dwa razy droższy niż Szybki",
        },
      },
    },
    translator: {
      name: "Tłumacz",
      description: "Profesjonalne tłumaczenie z niuansami kulturowymi",
      tagline: "Łącz Języki",
      shortDesc: "Tłumaczenie językowe i lokalizacja",
      suggestedPrompts: {
        0: "Przetłumacz to na...",
        1: "Jak powiedzieć... po...?",
        2: "Zlokalizuj tę treść dla...",
        3: "Wyjaśnij to odniesienie kulturowe",
      },
      variants: {
        gemini: "Multimodalny",
        budget: "Budżet",
      },
      variantInfo: {
        gemini: {
          description:
            "Tłumaczy tekst, zrzuty ekranu, szyldy, wideo i nagrania głosu.",
          strength: "Obraz, wideo i audio na wejściu, szybko",
          weakness: "Filtr mainstreamowy przy drażliwych treściach",
        },
        budget: {
          description:
            "Niuansowane tłumaczenie długich dokumentów w najniższej cenie tutaj.",
          strength: "Najwyższa klasa, otwarta polityka treści",
          weakness: "Tylko tekst. Nie czyta obrazów ani audio",
        },
      },
    },
    businessAdvisor: {
      name: "Doradca Biznesowy",
      description: "Strategia biznesowa, operacje i wzrost",
      tagline: "Strategiczny Wzrost",
      shortDesc: "Strategia biznesowa i doradztwo",
      suggestedPrompts: {
        0: "Pomóż mi opracować strategię biznesową",
        1: "Przeanalizuj mój model biznesowy",
        2: "Jak mogę skalować moje operacje?",
        3: "Przejrzyj mój plan wejścia na rynek",
      },
      variants: {
        elonTusk: "Odważny",
        chineseWisdom: "Budżetowy",
        techBro: "Precyzyjny",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Szczere decyzje strategiczne. Powie, kiedy plan jest słaby.",
          strength: "Najwyższa klasa, otwarta polityka, 500K kontekstu",
          weakness: "Połowa kontekstu w porównaniu z opcjami 1M",
        },
        chineseWisdom: {
          description:
            "Codzienna praca strategiczna najtaniej. Czyta wykresy, prezentacje i zrzuty ekranu.",
          strength: "Najwyższa klasa, najtańszy tutaj, 1M kontekstu",
          weakness: "Długie raporty drożeją na wyjściu",
        },
        techBro: {
          description:
            "Liczby, modele i plany gotowe dla zespołu. Mocny w pracy z narzędziami.",
          strength: "Solidna struktura i obsługa narzędzi",
          weakness: "Najdroższy tutaj, filtr mainstreamowy",
        },
      },
    },
    careerCoach: {
      name: "Doradca Kariery",
      description:
        "Rozwój kariery, poszukiwanie pracy i rozmowy kwalifikacyjne",
      tagline: "Rozwijaj Karierę",
      shortDesc: "Rozwój kariery i orientacja",
      suggestedPrompts: {
        0: "Pomóż mi poprawić moje CV",
        1: "Przygotuj mnie do rozmowy kwalifikacyjnej",
        2: "Jak mogę negocjować wynagrodzenie?",
        3: "Zaplanuj moją zmianę kariery",
      },
      variants: {
        headhunter: "Headhunter",
        intern: "Szybki",
      },
      variantInfo: {
        headhunter: {
          description:
            "Poprawki CV, próbne rozmowy i skrypty negocjacji, które działają.",
          strength: "Dopracowany tekst, czyta wgrane dokumenty",
          weakness: "Za wiadomość dużo droższy niż Szybki",
        },
        intern: {
          description:
            "Szybkie odpowiedzi do poprawek listu motywacyjnego i przygotowania do rozmowy.",
          strength: "Najszybsza i najtańsza opcja tutaj",
          weakness: "Klasa szybka. Mniej głębi w strategii kariery",
        },
      },
    },
    healthWellness: {
      name: "Zdrowie i Wellness",
      description: "Fitness, odżywianie i dobre samopoczucie",
      tagline: "Żyj Lepiej",
      shortDesc: "Przewodnictwo zdrowotne i wellness",
      suggestedPrompts: {
        0: "Stwórz dla mnie plan treningowy",
        1: "Pomóż mi zaplanować zdrowe posiłki",
        2: "Zasugeruj techniki radzenia sobie ze stresem",
        3: "Popraw moje nawyki senne",
      },
      variants: {
        techBro: "Dokładny",
        budget: "Budżet",
      },
      variantInfo: {
        techBro: {
          description:
            "Szczegółowe plany treningowe, rozpiski diety i rzetelny kontekst zdrowotny.",
          strength: "Konkretne plany do realizacji tydzień po tygodniu",
          weakness: "Za wiadomość wielokrotnie drożej niż Budżet",
        },
        budget: {
          description:
            "Szybkie odpowiedzi o treningu, jedzeniu i nawykach prawie za darmo.",
          strength: "Najtańsza opcja, szybkie odpowiedzi",
          weakness: "Model szybki: płycej przy złożonych pytaniach o zdrowie",
        },
      },
    },
    supportAgent: {
      name: "Agent Wsparcia",
      description:
        "Wsparcie techniczne napędzane AI - wie, kiedy przekazać sprawę człowiekowi",
      tagline: "Problem rozwiązany",
      shortDesc: "Wsparcie techniczne z eskalacją do człowieka",
      suggestedPrompts: {
        0: "Moja aplikacja ciągle się zawiesza - pomóż mi to naprawić",
        1: "Nie mogę połączyć się z siecią",
        2: "Dostaję komunikat o błędzie, którego nie rozumiem",
        3: "Przeprowadź mnie przez resetowanie hasła",
      },
      variants: {
        default: "Standardowy",
        fast: "Szybki",
      },
      variantInfo: {
        default: {
          description:
            "Staranna diagnoza trudnych problemów. Wie, kiedy oddać sprawę człowiekowi.",
          strength: "Mocny w debugowaniu i poprawkach krok po kroku",
          weakness: "Najdroższa opcja tutaj",
        },
        fast: {
          description:
            "Natychmiastowe odpowiedzi na typowe problemy, reset hasła i poradniki.",
          strength: "Najszybszy i najtańszy, czyta zrzuty ekranu",
          weakness: "Prosty model. Słabszy przy rzadkich, głębokich błędach",
        },
      },
    },
    travelPlanner: {
      name: "Planista Podróży",
      description: "Planowanie podróży i rekomendacje",
      tagline: "Odkrywaj Świat",
      shortDesc: "Planowanie podróży i rekomendacje",
      suggestedPrompts: {
        0: "Zaplanuj 2-tygodniową podróż do...",
        1: "Zasugeruj destynacje dla...",
        2: "Stwórz dzienny plan dla...",
        3: "Rozbicie budżetu na podróż do...",
      },
      variants: {
        snappy: "Dokładny",
        budget: "Budżet",
      },
      variantInfo: {
        snappy: {
          description: "Pełne plany podróży z trasami, budżetem i planem B.",
          strength: "Solidne rozumowanie w codziennej cenie",
          weakness: "Kosztuje około dziesięć razy więcej niż Budżet",
        },
        budget: {
          description:
            "Szybkie porady, listy pakowania i pomysły na dzień za grosze.",
          strength: "Bardzo tanio i szybko",
          weakness: "Prosty model. Słaby przy złożonych trasach",
        },
      },
    },
    legalAssistant: {
      name: "Asystent Prawny",
      description: "Informacje prawne i zrozumienie dokumentów",
      tagline: "Poznaj Swoje Prawa",
      shortDesc: "Badania prawne i pomoc dokumentowa",
      suggestedPrompts: {
        0: "Wyjaśnij ten termin prawny",
        1: "Pomóż mi zrozumieć tę umowę",
        2: "Jakie są moje prawa jako najemcy?",
        3: "Wyjaśnij proces...",
      },
      variants: {
        elonTusk: "Bez owijania",
        budget: "Budżet",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Analiza prawna prostym językiem, która nazywa ryzyka bez asekuracji.",
          strength: "Mocne rozumowanie, otwarta polityka treści",
          weakness: "Za wiadomość wielokrotnie drożej niż Budżet",
        },
        budget: {
          description:
            "Szybki przegląd umów i pism. Wrzuć zdjęcie, poznaj sedno.",
          strength: "Najtańsza opcja, czyta obrazy, kontekst 1M",
          weakness: "Klasa smart: płycej przy złożonych sprawach",
        },
      },
    },
    financialAdvisor: {
      name: "Doradca Finansowy",
      description: "Finanse osobiste, budżetowanie i inwestowanie",
      tagline: "Buduj Majątek",
      shortDesc: "Planowanie finansowe i doradztwo",
      suggestedPrompts: {
        0: "Pomóż mi stworzyć budżet",
        1: "Wyjaśnij podstawy inwestowania",
        2: "Jak powinienem spłacić swoje długi?",
        3: "Zaplanuj oszczędności emerytalne",
      },
      variants: {
        elonTusk: "Odważny",
        chineseWisdom: "Głęboki",
        techBro: "Premium",
        yolo: "Budżetowy",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Konkretnie o ryzyku, długach i inwestowaniu, bez języka działu compliance.",
          strength: "Najwyższa klasa, otwarta polityka treści",
          weakness: "Odważne tezy nadal wymagają twojej weryfikacji",
        },
        chineseWisdom: {
          description:
            "Długoterminowe planowanie budżetu i emerytury. Czyta wyciągi i wykresy.",
          strength: "Najwyższa klasa, 1M kontekstu",
          weakness: "Droższy niż Budżetowy",
        },
        techBro: {
          description:
            "Złożone scenariusze, kompromisy podatkowe i matematyka portfela, liczone starannie.",
          strength: "Analiza najwyższej jakości",
          weakness: "Najdroższa opcja tutaj",
        },
        yolo: {
          description:
            "Codzienne pytania o pieniądze, budżety i plany spłaty najtaniej tutaj.",
          strength: "Najtańszy tutaj, solidne rozumowanie",
          weakness: "Nie najwyższa klasa. Mniej głębi przy złożonych sprawach",
        },
      },
    },
    socialMediaManager: {
      name: "Menedżer Social Media",
      description: "Treści i strategia mediów społecznościowych",
      tagline: "Angażuj i Rozwijaj",
      shortDesc: "Strategia mediów społecznościowych i treści",
      suggestedPrompts: {
        0: "Stwórz podpisy na Instagram dla...",
        1: "Opracuj kalendarz treści",
        2: "Zasugeruj hashtagi dla...",
        3: "Napisz angażujące tweety o...",
      },
      variants: {
        snappy: "Celny",
        budget: "Budżet",
      },
      variantInfo: {
        snappy: {
          description:
            "Strategia, haczyki i plany kampanii, które wymagają myślenia.",
          strength: "Rozumowanie premium, czyta zrzuty ekranu",
          weakness: "Filtr mainstreamowy, unika ostrych tematów",
        },
        budget: {
          description:
            "Szybkie podpisy, pomysły na posty i hashtagi za grosze.",
          strength: "Bardzo tanio i szybko",
          weakness: "Prosty model. Słaby w strategii",
        },
      },
    },
    productManager: {
      name: "Menedżer Produktu",
      description: "Strategia produktu, mapy drogowe i badania użytkowników",
      tagline: "Dostarcz Świetne Produkty",
      shortDesc: "Zarządzanie produktem i tworzenie map drogowych",
      suggestedPrompts: {
        0: "Pomóż mi ustalić priorytety funkcji",
        1: "Stwórz user stories dla...",
        2: "Przeanalizuj dopasowanie produktu do rynku",
        3: "Opracuj mapę drogową produktu",
      },
      variants: {
        techBro: "Dokładny",
        fast: "Szybki",
      },
      variantInfo: {
        techBro: {
          description:
            "Pełne specyfikacje, roadmapy i synteza badań, świetny z narzędziami.",
          strength: "Uporządkowane myślenie, mocna praca agentowa",
          weakness: "Ponad dwa razy drożej niż Szybki",
        },
        fast: {
          description:
            "Szybka priorytetyzacja, szkice user stories i feedback do zrzutów ekranu.",
          strength: "Szybkie odpowiedzi, rozumie obrazy, wideo i audio",
          weakness: "Klasa smart: płycej przy dużych decyzjach strategicznych",
        },
      },
    },
    debater: {
      name: "Debater",
      description: "Prowadź intelektualne debaty na kontrowersyjne tematy",
      tagline: "Argumentuj ze Wszystkich Stron",
      shortDesc: "Intelektualne debaty i wiele perspektyw",
      suggestedPrompts: {
        0: "Debatuj o etyce rozwoju AI",
        1: "Przedstaw argumenty za i przeciw bezwarunkowemu dochodowi podstawowemu",
        2: "Omów wolność słowa vs. mowa nienawiści",
        3: "Przeanalizuj różne ideologie polityczne",
      },
      variants: {
        elonTusk: "Odważny",
        chineseWisdom: "Budżetowy",
        techBro: "Wyważony",
        uncensored: "Bez cenzury",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Zajmuje stanowisko i walczy o nie. Większość kontrowersji bierze na klatę.",
          strength: "Najwyższa klasa, otwarta polityka treści",
          weakness: "Otwarty, ale nie bez cenzury. Czasem łagodzi",
        },
        chineseWisdom: {
          description: "Uporządkowane argumenty za i przeciw najtaniej tutaj.",
          strength: "Najwyższa klasa, najtańszy tutaj",
          weakness: "W polityce mainstreamowy. Unika drażliwych tematów",
        },
        techBro: {
          description:
            "Staranne steelmanowanie obu stron w etyce, technologii i polityce.",
          strength: "Jasne, dobrze ułożone argumenty",
          weakness: "Filtr mainstreamowy. Odmawia lub łagodzi ostre tezy",
        },
        uncensored: {
          description:
            "Broni każdego stanowiska, także niepopularnego. Bez zawracania do konsensusu.",
          strength: "Własny światopogląd: argumentuje pod prąd mainstreamu",
          weakness: "Tylko 32K kontekstu, stała cena za wiadomość",
        },
      },
    },
    philosopher: {
      name: "Filozof",
      description: "Eksploruj głębokie pytania filozoficzne bez ograniczeń",
      tagline: "Szukaj Prawdy",
      shortDesc: "Głęboka eksploracja filozoficzna i analiza",
      suggestedPrompts: {
        0: "Jaka jest natura świadomości?",
        1: "Czy mamy wolną wolę, czy wszystko jest zdeterminowane?",
        2: "Czy istnieje obiektywna moralność?",
        3: "Co nadaje życiu sens?",
      },
      variants: {
        elonTusk: "Odważny",
        chineseWisdom: "Zbalansowany",
        techBro: "Analityczny",
        uncensored: "Bez cenzury",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Zajmuje stanowisko i go broni. Otwarta polityka, mało uników.",
          strength: "Mocne rozumowanie bez moralnej asekuracji",
          weakness: "Droższy niż Zbalansowany, kontekst 500K",
        },
        chineseWisdom: {
          description:
            "Długie, cierpliwe dialogi o etyce, metafizyce i umyśle.",
          strength: "Najwyższa klasa, tu najtańszy, kontekst 1M",
          weakness: "Mainstreamowy w polityce, łagodzi ostre tezy",
        },
        techBro: {
          description:
            "Zwarte argumenty, czysta logika, każda przesłanka sprawdzona.",
          strength: "Rygorystyczna struktura, wyłapuje słabe przesłanki",
          weakness: "Filtr mainstreamowy, droższy niż Zbalansowany",
        },
        uncensored: {
          description:
            "Filozofia polityczna, pytania tabu i nieortodoksyjne poglądy bez filtra.",
          strength: "Własny światopogląd: nieortodoksja, także w polityce",
          weakness: "Kontekst 32K, klasa smart, stała cena za wiadomość",
        },
      },
    },
    uncensoredWriter: {
      name: "Niecenzurowany Pisarz",
      description: "Kreatywne pisanie bez sztucznych ograniczeń",
      tagline: "Pisz Swobodnie",
      shortDesc: "Nieograniczone kreatywne pisanie i opowiadanie historii",
      suggestedPrompts: {
        0: "Napisz mroczny thriller psychologiczny",
        1: "Stwórz dojrzałą scenę romantyczną",
        2: "Opracuj moralnie złożoną skill",
        3: "Napisz horror z graficznymi elementami",
      },
      variants: {
        smart: "Prowokacyjny",
        fast: "Szybki",
        deep: "Głęboki",
      },
      variantInfo: {
        smart: {
          description:
            "Mroczna fikcja i tabu, satyra polityczna, która nazywa rzeczy po imieniu.",
          strength: "Najlepszy tu do mrocznej fikcji, tabu i polityki",
          weakness: "Kontekst 32K, najdroższy za wiadomość",
        },
        fast: {
          description:
            "Szybkie szkice bez cenzury, sceny i proza do roleplay za grosze.",
          strength: "Najtańszy model bez cenzury",
          weakness: "Prosty model. Gubi wątek w długich tekstach",
        },
        deep: {
          description:
            "Długie formy bez cenzury. Całe powieści zostają w pamięci.",
          strength: "Najwyższa klasa, kontekst 1M, narzędzia",
          weakness: "Ostrożny w polityce, droższy niż Szybki",
        },
      },
    },
    roleplaySkill: {
      name: "Skill do Odgrywania Ról",
      description: "Immersyjne odgrywanie postaci bez ograniczeń",
      tagline: "Bądź Kimkolwiek",
      shortDesc: "Autentyczne odgrywanie postaci i scenariusze",
      suggestedPrompts: {
        0: "Odegraj skill fantasy",
        1: "Stwórz scenariusz przygody sci-fi",
        2: "Wciel się w skill historyczną",
        3: "Rozwiń złożoną relację między skillami",
      },
      variants: {
        creative: "Kreatywny",
        deep: "Głęboki",
        uncensored: "Bez cenzury",
      },
      variantInfo: {
        creative: {
          description: "Żywe postacie i długie sceny w bardzo niskiej cenie.",
          strength: "Najtańsza opcja, otwarta polityka treści",
          weakness: "Otwarty, nie bez cenzury: łagodzi najmroczniejsze sceny",
        },
        deep: {
          description:
            "Spójne postacie z bogatym wnętrzem przez długie kampanie.",
          strength: "Najwyższa klasa, pamięta całą historię",
          weakness: "Łagodzi mroczne lub polityczne sceny",
        },
        uncensored: {
          description: "Każda postać, każda scena. Mrok i tabu zostają.",
          strength: "Najlepszy tu do mrocznego roleplayu i tabu",
          weakness: "Kontekst 32K: zapomina wczesne sceny, stała cena",
        },
      },
    },
    researchAgent: {
      name: "Agent Webowy",
      description:
        "Przeszukuje sieć, czyta strony, weryfikuje źródła. Zapamiętuje wyniki między sesjami. Używa narzędzi przeglądarki gdy dostępne.",
      tagline: "Szukaj · Czytaj · Weryfikuj",
      shortDesc: "Wyszukiwanie, odczyt stron i sprawdzanie faktów",
      suggestedPrompts: {
        0: "Zbadaj najnowsze wydarzenia w regulacji AI",
        1: "Znajdź i podsumuj kluczowe fakty na dany temat",
        2: "Porównaj różne źródła na dany temat",
        3: "Opracuj briefing badawczy z cytatami",
      },
      variants: {
        kimi: "Zbalansowany",
        gemini: "Dogłębny",
        flash: "Szybki",
        grok: "Otwarty",
        claude: "Budżet",
      },
      variantInfo: {
        kimi: {
          description:
            "Szuka, czyta i weryfikuje z mocnym rozumowaniem w codziennej cenie.",
          strength: "Najwyższa klasa, kontekst 1M, rozumie obrazy i wideo",
          weakness: "Mainstreamowy w polityce, długie raporty kosztują",
        },
        gemini: {
          description:
            "Głęboki research na stronach, wideo i nagraniach audio.",
          strength: "Najwyższa klasa, rozumie każdy typ mediów",
          weakness: "Najdroższy wariant tutaj, filtr mainstreamowy",
        },
        flash: {
          description:
            "Szybkie wyszukiwanie i czytanie stron z wejściem multimodalnym.",
          strength: "Szybki, rozumie obrazy, wideo i audio",
          weakness: "Klasa smart, nie najtańsza opcja",
        },
        grok: {
          description:
            "Szybkie wyszukiwanie w tematach, których unikają modele mainstreamowe.",
          strength: "Otwarta polityka treści, bardzo tani",
          weakness: "Model szybki: płytka weryfikacja źródeł",
        },
        claude: {
          description:
            "Proste wyszukiwanie i streszczenia stron w najniższej cenie.",
          strength: "Najtańsza opcja, niezawodny z narzędziami",
          weakness: "Model szybki, filtr mainstreamowy",
        },
      },
    },
    statsAnalyst: {
      name: "Analityk Statystyk",
      description:
        "Specjalista analityczny z dostępem do statystyk leadów, użytkowników, e-maili i poleceń dla wglądów opartych na danych",
      tagline: "Wglądy Oparte na Danych",
      shortDesc: "Analityka platformy i raportowanie",
      suggestedPrompts: {
        0: "Pokaż mi przegląd dzisiejszej aktywności leadów",
        1: "Jak wyglądają trendy rejestracji użytkowników w tym tygodniu?",
        2: "Podsumuj wydajność kampanii e-mailowych",
        3: "Daj mi raport statusu programu poleceń",
      },
      variants: {
        gemini: "Dogłębny",
        fast: "Szybki",
      },
      variantInfo: {
        gemini: {
          description:
            "Pełna analiza leadów, użytkowników, maili i poleceń. Wyłapuje prawdziwy trend.",
          strength: "Świetne rozumowanie przy wielu narzędziach",
          weakness: "Ponad dwa razy droższy niż Szybki",
        },
        fast: {
          description: "Szybkie statystyki i codzienny przegląd liczb.",
          strength: "Szybkie odpowiedzi, sprawne narzędzia",
          weakness: "Płytszy przy analizie wieloetapowej",
        },
      },
    },
    cronManager: {
      name: "Menedżer Cron",
      description:
        "Specjalista od planowania zadań, który może tworzyć, aktualizować, usuwać i monitorować zadania cron oraz ich historię wykonania",
      tagline: "Planuj i Monitoruj",
      shortDesc: "Zarządzanie i monitorowanie zadań cron",
      suggestedPrompts: {
        0: "Wymień wszystkie aktywne zadania cron i ich harmonogramy",
        1: "Utwórz nowe zadanie cron uruchamiane co godzinę",
        2: "Pokaż mi ostatnie błędy i awarie zadań",
        3: "Sprawdź ogólny stan systemu zadań",
      },
      variants: {
        gemini: "Dokładny",
        fast: "Szybki",
      },
      variantInfo: {
        gemini: {
          description:
            "Przekopuje historię błędów i rozplątuje złożone harmonogramy.",
          strength: "Najwyższa klasa, ostrożny przy zmianach wieloetapowych",
          weakness: "Ponad dwa razy droższy niż Szybki",
        },
        fast: {
          description:
            "Szybkie listowanie, tworzenie i sprawdzanie statusu przy rutynie crona.",
          strength: "Taniej i sprawnie przy rutynie",
          weakness:
            "Nie najwyższa klasa. Mniej dokładny przy splątanych błędach",
        },
      },
    },
    systemMonitor: {
      name: "Monitor Systemu",
      description:
        "Specjalista od infrastruktury monitorujący status serwera, łączność bazy danych, kontrole pulse i wykonanie zadań",
      tagline: "Obserwuj i Alarmuj",
      shortDesc: "Monitorowanie stanu infrastruktury",
      suggestedPrompts: {
        0: "Przeprowadź pełną kontrolę stanu systemu",
        1: "Pokaż mi status monitoringu pulse",
        2: "Sprawdź łączność z bazą danych",
        3: "Jaki jest aktualny stan zadań cron?",
      },
      variants: {
        fast: "Bystry",
        budget: "Budżet",
      },
      variantInfo: {
        fast: {
          description:
            "Kontrola stanu plus prawdziwa diagnoza, gdy padają pulse lub crony.",
          strength: "Czyta logi i historię z większym zrozumieniem",
          weakness: "Kosztuje kilka razy więcej niż Budżet",
        },
        budget: {
          description:
            "Rutynowe kontrole statusu i pingi bazy przez całą dobę.",
          strength: "Najszybszy i najtańszy, pewne wywołania narzędzi",
          weakness: "Prosty model. Słaby w szukaniu przyczyn",
        },
      },
    },
    publicCurator: {
      name: "Kurator Publiczny",
      description:
        "Specjalista od zarządzania treścią do zarządzania publicznymi wątkami, wiadomościami i treściami społeczności",
      tagline: "Kuratoruj i Organizuj",
      shortDesc: "Zarządzanie treściami publicznymi i wątkami",
      suggestedPrompts: {
        0: "Wymień ostatnie publiczne wątki",
        1: "Szukaj wątków na określony temat",
        2: "Pomóż mi zorganizować treści społeczności",
        3: "Znajdź wiadomości pasujące do określonych kryteriów",
      },
      variants: {
        gemini: "Dokładny",
        fast: "Szybki",
      },
      variantInfo: {
        gemini: {
          description:
            "Staranny przegląd publicznych wątków, łącznie z obrazami, wideo i audio.",
          strength: "Najwyższa klasa, rozumie każdy typ mediów",
          weakness: "Ponad dwa razy drożej niż Szybki",
        },
        fast: {
          description:
            "Szybkie sortowanie, tagowanie i porządki w treściach społeczności.",
          strength: "Szybki i multimodalny w niższej cenie",
          weakness: "Klasa smart: słabszy przy przypadkach granicznych",
        },
      },
    },
    codeArchitect: {
      name: "Architekt Kodu",
      description:
        "Specjalista od architektury delegujący zadania programistyczne do Claude Code. Dostępny tylko na Hermes.",
      tagline: "Projektuj i Deleguj",
      shortDesc: "Decyzje architektoniczne przez Claude Code",
      suggestedPrompts: {
        0: "Zaplanuj implementację nowej funkcji",
        1: "Przejrzyj architekturę modułu",
        2: "Deleguj zadanie programistyczne do Claude Code",
        3: "Zaprojektuj strategię migracji",
      },
      variants: {
        gemini: "Szeroki obraz",
        techBro: "Programista",
      },
      variantInfo: {
        gemini: {
          description:
            "Projekt systemu i plany migracji dla dużych baz kodu przed przekazaniem.",
          strength: "Najwyższa klasa, czyta diagramy, wideo, audio",
          weakness: "Mniej praktyczny w kodzie niż Programista",
        },
        techBro: {
          description:
            "Specyfikacje pisane tak, jak wykonuje je Claude Code. Precyzyjny podział zadań.",
          strength: "Mocny w kodzie i pracy agentowej",
          weakness: "Przy głębokim projektowaniu nie najwyższa klasa",
        },
      },
    },
    deploymentAgent: {
      name: "Agent Wdrożeń",
      description:
        "Specjalista od wdrożeń obsługujący buildy, wydania i zarządzanie serwerem przez SSH. Dostępny tylko na Hermes.",
      tagline: "Buduj i Wdrażaj",
      shortDesc: "Wdrożenia i zarządzanie serwerem",
      suggestedPrompts: {
        0: "Zbuduj aplikację do produkcji",
        1: "Sprawdź stan serwera",
        2: "Przeprowadź wdrożenie na produkcję",
        3: "Pokaż mi aktualny status serwera",
      },
      variants: {
        techBro: "Niezawodny",
        budget: "Budżetowy",
      },
      variantInfo: {
        techBro: {
          description:
            "Buildy, wydania i praca przez SSH, gdzie jedna zła komenda kosztuje.",
          strength: "Mocny w pracy agentowej, ostrożny z narzędziami",
          weakness: "Za wiadomość dużo droższy niż Budżetowy",
        },
        budget: {
          description:
            "Rutynowe health checki i raporty statusu za ułamek ceny.",
          strength: "Najtańszy i najszybszy tutaj",
          weakness: "Klasa szybka. Ryzykowny przy złożonych wdrożeniach",
        },
      },
    },
    rebuildAgent: {
      name: "Rebuild Agent",
      description:
        "Specjalista od budowania i restartu, który przebudowuje aplikację i hot-restartuje serwer bez przestojów przez sygnał SIGUSR1",
      tagline: "Buduj i restartuj",
      shortDesc: "Przebudowa aplikacji i hot-restart",
      suggestedPrompts: {
        0: "Przebuduj i uruchom ponownie serwer produkcyjny",
        1: "Uruchom build bez restartu",
        2: "Sprawdź stan serwera po przebudowie",
        3: "Utwórz zaplanowane zadanie przebudowy",
      },
      variants: {
        gemini: "Dokładny",
        fast: "Szybki",
      },
      variantInfo: {
        gemini: {
          description:
            "Przebudowuje, restartuje i drąży błędy builda do skutku.",
          strength: "Najwyższa klasa, najlepszy przy nieudanych buildach",
          weakness: "Ponad dwa razy drożej niż Szybki",
        },
        fast: {
          description: "Rutynowy rebuild i restart, gdy build ma przejść.",
          strength: "Szybka robota w niższej cenie",
          weakness: "Klasa smart: słabszy przy zawiłych błędach builda",
        },
      },
    },
    vibeCoder: {
      name: "Vibe Coder",
      description:
        "Główny agent implementacji łączący pomysły na funkcje z kodem produkcyjnym. Analizuje bazę kodu przez Claude Code, wyciąga intencje z zapytań i implementuje dopasowane rozwiązania.",
      tagline: "Od Pomysłu do Kodu",
      shortDesc: "Implementacja funkcji przez Claude Code",
      suggestedPrompts: {
        0: "Mam pomysł na nową funkcję, pozwól że opiszę",
        1: "Zbadaj bazę kodu i wyjaśnij jak działa moduł",
        2: "Pomóż mi zaplanować i wdrożyć zmianę w istniejącej funkcji",
        3: "Zbadaj błąd i zaproponuj poprawkę",
      },
      variants: {
        budget: "Tanio i Mądrze",
        open: "Otwarta Granica",
        fast: "Ostry",
        max: "Maksimum",
        broad: "Szeroki",
      },
    },
    skillCreator: {
      name: "Kreator Skilli",
      description:
        "Projektuj i twórz skille AI z dopasowanymi osobowościami, promptami systemowymi, narzędziami i konfiguracjami modeli. Zarządza też ulubionymi i ustawieniami.",
      tagline: "Projektuj Skille AI",
      shortDesc: "Tworzenie i zarządzanie skillami AI",
      suggestedPrompts: {
        0: "Pomóż mi stworzyć nowy skill AI do pomocy z kodowaniem",
        1: "Pokaż mi wszystkie istniejące skille i zasugeruj czego brakuje",
        2: "Zaprojektuj skill do kreatywnego pisania z unikalną osobowością",
        3: "Dodaj skill do moich ulubionych i skonfiguruj ustawienia czatu",
      },
      variants: {
        cheapAndSmart: "Budżetowy",
        brilliant: "Precyzyjny",
      },
      variantInfo: {
        cheapAndSmart: {
          description:
            "Twórz i poprawiaj skille tanio. Dość rozumu na prompty i konfiguracje.",
          strength: "Najwyższa klasa, taniej za wiadomość",
          weakness: "Długie prompty systemowe drożeją na wyjściu",
        },
        brilliant: {
          description:
            "Zwięzłe prompty i czysta konfiguracja narzędzi, gdy skill musi działać.",
          strength: "Mocny w pracy agentowej i z narzędziami",
          weakness: "Droższy i mainstreamowy przy ostrych personach",
        },
      },
    },
    heilpraktikerPruefung: {
      name: "Egzamin HP",
      description:
        "Realistyczna symulacja ustnego egzaminu Heilpraktiker z adaptacyjnym poziomem trudności",
      tagline: "Egzamin ustny",
      shortDesc: "Przygotowanie do egzaminu Heilpraktiker",
      suggestedPrompts: {
        0: "Zacznijmy egzamin",
        1: "Sprawdź mnie z medycyny wewnętrznej",
        2: "Przedstaw mi przypadek kliniczny",
        3: "Pytania z prawa medycznego proszę",
      },
      variants: {
        smart: "Zbalansowany",
        precise: "Precyzyjny",
        thorough: "Dokładny",
        quick: "Szybki",
      },
      variantInfo: {
        smart: {
          description:
            "Realistyczny egzamin ustny z solidną wiedzą medyczną w rozsądnej cenie.",
          strength: "Najwyższa klasa rozumowania, pamięta długie sesje",
          weakness: "Długi feedback egzaminatora podnosi koszt",
        },
        precise: {
          description:
            "Dokładne pytania i jasne poprawki. Rygorystyczny w terminologii i prawie.",
          strength: "Jasne, zwięzłe poprawki, taniej niż Zbalansowany",
          weakness:
            "Średnia klasa: mniej niuansów przy trudnej diagnostyce różnicowej",
        },
        thorough: {
          description:
            "Dociekliwe dopytania i szczegółowe omówienie, najbliżej prawdziwej egzaminatorki.",
          strength: "Najdokładniejszy feedback o lukach i czerwonych flagach",
          weakness: "Najdroższy wariant tego trenera",
        },
        quick: {
          description:
            "Szybkie rundy powtórkowe między pełnymi symulacjami egzaminu.",
          strength: "Najtańsza opcja, natychmiastowe odpowiedzi",
          weakness: "Model szybki: płytki przy złożonych przypadkach",
        },
      },
    },
    qualityTester: {
      name: "Tester Jakości",
      description:
        "Testowy użytkownik, który naturalnie wypróbowuje funkcje platformy. Zatrzymuje się i jasno raportuje gdy coś się zepsuje zamiast próbować ponownie.",
      tagline: "Znajdź bugi",
      shortDesc: "Persona testowa platformy",
      suggestedPrompts: {
        0: "Zrób mi zdjęcie zachodu słońca",
        1: "Jakie masz narzędzia?",
        2: "Wygeneruj muzykę, coś relaksującego",
        3: "Zrób krótki film z kotem",
      },
      variants: {
        budget: "Budżetowy",
        visual: "Wizualny",
        nativeImage: "Natywne obrazy",
        nanoBananaPro: "Nano Banana Pro",
      },
      variantInfo: {
        budget: {
          description:
            "Testuje funkcje platformy jak prawdziwy użytkownik i zgłasza, co się psuje.",
          strength: "Najtańsze testy, pełna obsługa narzędzi",
          weakness: "Nie generuje obrazów natywnie",
        },
        nativeImage: {
          description:
            "Testuje natywne generowanie obrazów przez model graficzny.",
          strength: "Sprawdza ścieżkę natywnego generowania obrazów",
          weakness: "Brak narzędzi, nie przetestuje innych funkcji",
        },
      },
    },
  },
  get: {
    title: "Skille",
    titleShort: "Skille",
    dynamicTitle: "Skille ({{count}})",
    description:
      "Pobierz wszystkie dostępne skille (domyślne + niestandardowe)",
    fields: {
      query: {
        label: "Szukaj (opcjonalne)",
        description:
          "Filtruj skille po słowie kluczowym. Słowa oddzielone spacją są wszystkie wymagane. Wyszukiwanie podciągów bez rozróżniania wielkości liter po nazwie, tagline, opisie, kategorii. Pozostaw puste aby wyświetlić wszystkie.",
        placeholder: "np. badania, generowanie obrazów",
      },
      skillId: {
        label: "ID skilla",
        description:
          "Pobierz pełne szczegóły dla konkretnej skilla. Zwraca prompt systemowy, narzędzia i konfigurację modelu.",
      },
      page: {
        label: "Strona",
        description:
          "Numer strony dla paginowanych wyników (AI/MCP: domyślny rozmiar strony 25).",
      },
      pageSize: {
        label: "Rozmiar strony",
        description:
          "Liczba umiejętności na stronie (1–500). Wywołujący AI/MCP domyślnie 25; ludzie otrzymują wszystkie.",
      },
      sourceFilter: {
        label: "Źródło",
        description:
          "Filtruj po źródle: wbudowane, społeczność lub twoje własne skille.",
      },
      targetUserId: {
        label: "ID użytkownika docelowego",
        description:
          "Tylko administratorzy: wyświetl umiejętności konkretnego użytkownika.",
      },
    },
    container: {
      title: "Lista skilli",
      description: "Wszystkie dostępne skille dla użytkownika",
    },
    createButton: {
      label: "Utwórz Własną Skill",
    },
    openFullPage: "Otwórz pełną stronę",
    browser: {
      advancedModelAccess: "Wybierz swoje doświadczenie AI",
      configureFiltersText:
        "Wybierz modele bezpośrednio lub zacznij od gotowych skilli",
      aiModels: "modele AI",
      configureAiModelsTitle: "Bezpośredni wybór modelu",
      advancedChooseText:
        "Wybierz spośród {{count}} modeli z precyzyjną kontrolą inteligencji, szybkości i kosztów",
      modelsWithCustomFilters: "modeli z niestandardowymi filtrami",
      configureButton: "Konfiguruj",
      selectButton: {
        label: "Przeglądaj Modele",
      },
      skillPresets: "Gotowe skille",
      pickSkillText:
        "Zacznij od ekspercko dostrojonych skilli z już wybranym idealnym modelem. Dostosuj w dowolnym momencie.",
    },
    signupPrompt: {
      title: "Twórz własne skille AI",
      description:
        "Projektuj niestandardowe skille z unikalnymi osobowościami i zachowaniami. Zarejestruj się, aby rozpocząć.",
      backButton: "Przeglądaj skille",
      signupButton: "Utwórz Konto",
      loginButton: "Zaloguj Się",
    },
    search: {
      placeholder: "Szukaj skilli...",
      noResults: "Nie znaleziono skilli",
      results: "Wyniki wyszukiwania",
    },
    card: {
      actions: {
        inCollection: "W twojej kolekcji",
        addAnother: "Dodaj kolejną",
        addToCollection: "Dodaj do kolekcji:",
        quick: "Szybko",
        customize: "Dostosuj",
        useNow: "Aktywuj",
        inUse: "Aktywny",
        goToChat: "Przejdź do czatu",
        useThis: "Użyj tego",
        chooseFavorite: "Wybierz model",
        selectFavorite: "Wybierz model do rozmowy:",
        addVariant: "Dodaj kolejny model",
        view: "Zobacz",
        edit: "Edytuj",
        vote: "Oceń",
        report: "Zgłoś",
        addMissing: "Dodaj wszystkie modele do Moich skilli",
        add: "Dodaj",
        added: "Dodano",
      },
      showVariants: "Modele ({{count}})",
    },
    section: {
      showMore: "Pokaż {{count}} więcej",
      showLess: "Pokaż mniej",
      browseAll: "Przeglądaj wszystkie",
    },
    response: {
      skills: {
        skill: {
          title: "Skill",
          id: { content: "ID skilla" },
          name: { content: "Nazwa skilla" },
          tagline: { content: "Slogan skilla" },
          description: { content: "Opis skilla" },
          icon: { content: "Ikona skilla" },
          systemPrompt: { content: "Prompt systemowy" },
          category: { content: "Kategoria" },
          source: { content: "Źródło" },
          ownershipType: { content: "Typ własności" },
          preferredModel: { content: "Preferowany model" },
          voice: { content: "Głos" },
          suggestedPrompts: { content: "Sugerowane prompty" },
          requirements: { content: "Wymagania" },
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
          separator: { content: "•" },
          actions: {
            directModelButton: { label: "Model bezpośredni" },
          },
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
          "Musisz być zalogowany, aby uzyskać dostęp do niestandardowych skilli",
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
    success: {
      title: "Sukces",
      description: "Skille pobrane pomyślnie",
    },
  },
  post: {
    title: "Utwórz skill",
    titleShort: "Utwórz skill",
    dynamicTitle: "Utwórz: {{name}}",
    description: "Utwórz nową niestandardowy skill",
    form: {
      title: "Utwórz swój niestandardowy skill",
      description:
        "Zaprojektuj unikalny skill AI z niestandardowym zachowaniem, osobowością i możliwościami. Wybierz konkretny model lub pozwól systemowi wybrać na podstawie Twoich wymagań.",
    },
    submitButton: {
      text: "Utwórz niestandardowy skill",
      loadingText: "Tworzenie skill...",
    },
    backButton: {
      label: "Wstecz",
    },
    container: {
      title: "Utwórz nowy skill",
      description: "Zdefiniuj nową niestandardowy skill",
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
    skillDescription: {
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
      placeholder: "Jesteś pomocnym asystentem, który specjalizuje się w...",
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
    isPublic: {
      label: "Udostępnij publicznie",
      description:
        "Włącz, aby udostępnić swój skill społeczności. Po wyłączeniu skill pozostaje prywatny i widoczny tylko dla Ciebie.",
    },
    modelSelection: {
      title: "Wybór modelu",
      label: "Wybór modelu",
      description:
        "Wybierz sposób wyboru modelu AI dla tego skilla - wybierz konkretny model lub pozwól systemowi wybrać na podstawie filtrów",
    },
    selectionType: {
      label: "Typ wyboru",
      skillBased: "Na podstawie skilla",
      manual: "Konkretny model",
      filters: "Kryteria filtrowania",
    },
    preferredModel: {
      label: "Preferowany model",
      description:
        "Wybierz konkretny model AI, który będzie zawsze używany z tym skillem",
      helpText: "Wybór konkretnego modelu blokuje ten skill do tego modelu",
    },
    intelligence: {
      label: "Poziom inteligencji",
      description:
        "Minimalny poziom inteligencji/możliwości wymagany dla modelu",
    },
    minIntelligence: {
      label: "Minimalna inteligencja",
      description:
        "Minimalny poziom inteligencji/możliwości wymagany dla modelu",
    },
    maxIntelligence: {
      label: "Maksymalna inteligencja",
      description:
        "Maksymalny poziom inteligencji/możliwości dozwolony dla modelu",
    },
    intelligenceRange: {
      label: "Zakres inteligencji",
      description: "Wymagany poziom inteligencji/możliwości modelu",
      minLabel: "Min. inteligencja",
      maxLabel: "Maks. inteligencja",
    },
    priceRange: {
      label: "Zakres cen",
      description: "Zakres kosztów kredytów za wiadomość",
      minLabel: "Min. cena",
      maxLabel: "Maks. cena",
    },
    contentRange: {
      label: "Zakres treści",
      description: "Zakres poziomu moderacji treści",
      minLabel: "Min. treść",
      maxLabel: "Maks. treść",
    },
    minPrice: {
      label: "Minimalna cena",
      description: "Minimalny koszt kredytów na wiadomość z tym skillem",
    },
    maxPrice: {
      label: "Maksymalna cena",
      description:
        "Maksymalny koszt kredytów, który jesteś gotów wydać na wiadomość z tym skillem",
    },
    contentLevel: {
      label: "Poziom treści",
      description:
        "Poziom filtrowania treści dla modelu (główny nurt, otwarty lub bez cenzury)",
    },
    minContent: {
      label: "Minimalny poziom treści",
      description: "Minimalny poziom moderacji treści dla modelu",
    },
    maxContent: {
      label: "Maksymalny poziom treści",
      description: "Maksymalny poziom moderacji treści dla modelu",
    },
    preferredStrengths: {
      label: "Preferowane mocne strony",
      description: "Możliwości i mocne strony modelu do preferowania",
      item: "Mocna strona",
    },
    ignoredWeaknesses: {
      label: "Ignorowane słabe strony",
      description: "Słabe strony modelu do ignorowania lub akceptowania",
      item: "Słaba strona",
    },
    manualModelId: {
      label: "Model ręczny",
      description: "Konkretny model zawsze używany z tym skillem",
    },
    variants: {
      label: "Warianty",
      description:
        "Nazwane warianty z własnymi ustawieniami modelu. Każdy wariant wymaga: id (unikalny string), modelSelection (wymagane), isDefault (dokładnie jeden musi być true).",
    },
    availableTools: {
      label: "Dozwolone narzędzia",
      description:
        "Narzędzia dla tego skilla. Każdy wpis wymaga toolId (system_help_GET dla ID). Null = ustawienia globalne.",
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
    chatModel: {
      label: "Model czatu",
      placeholder: "Domyślny systemowy",
    },
    voice: {
      label: "Głos",
      description: "Głos zamiany tekstu na mowę dla tego skilla",
      placeholder: "Domyślny systemowy",
    },
    sttModel: {
      label: "Model mowy na tekst",
      description: "Model używany do rozpoznawania mowy",
      placeholder: "Domyślny systemowy",
    },
    imageVisionModel: {
      label: "Model wizji obrazów",
      description: "Model do analizy obrazów",
      placeholder: "Domyślny systemowy",
    },
    videoVisionModel: {
      label: "Model wizji wideo",
      description: "Model do analizy wideo",
      placeholder: "Domyślny systemowy",
    },
    audioVisionModel: {
      label: "Model wizji audio",
      description: "Model do analizy audio",
      placeholder: "Domyślny systemowy",
    },
    imageGenModel: {
      label: "Model generowania obrazów",
      description: "Model do generowania obrazów",
      placeholder: "Domyślny systemowy",
    },
    musicGenModel: {
      label: "Model generowania muzyki",
      description: "Model do generowania muzyki",
      placeholder: "Domyślny systemowy",
    },
    videoGenModel: {
      label: "Model generowania wideo",
      description: "Model do generowania wideo",
      placeholder: "Domyślny systemowy",
    },
    suggestedPrompts: {
      label: "Sugerowane prompty",
      description: "Przykładowe prompty do użycia z tym skillem",
      placeholder: "Dodaj sugerowany prompt...",
    },
    response: {
      id: { content: "ID utworzonej skilla" },
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
        description: "Musisz być zalogowany, aby tworzyć skille",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do tworzenia skilla",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany zasób nie został znaleziony",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas tworzenia skilla",
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
        description: "Skill o tej nazwie już istnieje",
      },
    },
    success: {
      title: "Skill utworzony",
      description: "Twój niestandardowy skill został pomyślnie utworzona",
    },
  },
  onboarding: {
    success: {
      title: "{{companion}} jest gotowy do rozmowy!",
      subtitle:
        "Teraz wybierz specjalistów do konkretnych zadań - lub pomiń i dodaj ich w dowolnym momencie później",
    },
    bottom: {
      title: "Gotowy do rozmowy?",
      description:
        "Zawsze możesz wrócić i dodać więcej specjalistów, kiedy tylko ich potrzebujesz",
      button: "Zacznij Rozmawiać",
    },
  },
  selector: {
    free: "DARMOWE",
  },
  credits: {
    credit: "{{count}} kredyt",
    credits: "{{count}} kredytów",
  },
};
