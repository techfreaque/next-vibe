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
          title: "Skill nie został znaleziony",
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
          title: "Skill nie został znaleziony",
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
          title: "Skill nie został znaleziony",
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
        0: "Daj mi 10 pomysłów na projekt po godzinach, który skończę w weekend.",
        1: "Wyjaśnij mi komputery kwantowe, jakbym miał 12 lat.",
        2: "Napisz opowiadanie na 300 słów o podróżniku w czasie, który przegapił swój przystanek.",
        3: "Co ostatnio zmieniło się w AI i naprawdę ma znaczenie?",
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
        0: "Czy portale społecznościowe mogą banować, kogo chcą?",
        1: "Gdzie jest granica między mową nienawiści a wolnością słowa? Wyznacz ją.",
        2: "Wymień 5 idei, które cenzurowano, a potem okazały się słuszne.",
        3: "Czy uczelnia może kiedykolwiek odwołać wykład gościa? Najpierw tak lub nie, potem dlaczego.",
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
          strength: "Najwyższa klasa. Odpowiada bez odmawiania",
          weakness: "Swobodniejszy, ale nie bez cenzury. Czasem łagodzi",
        },
        chineseWisdom: {
          description:
            "Historia, prawo i analiza mediów o wolności słowa najtaniej tutaj.",
          strength: "Najwyższa klasa w najniższej cenie",
          weakness: "Ostrożny w polityce. Unika drażliwych tematów",
        },
        techBro: {
          description:
            "Staranne, dobrze udokumentowane analizy prawa, platform i uczelni.",
          strength: "Jasna struktura, mocny research z narzędziami",
          weakness: "Z filtrem. Odmawia lub łagodzi ostre tezy",
        },
        uncensored: {
          description:
            "Broni wolności słowa, korzystając z niej. Porusza to, czego inni nie dotkną.",
          strength: "Trenowany na zakazanych tekstach. Polityka pod prąd",
          weakness: "Krótsza pamięć. Droższy za wiadomość",
        },
      },
    },
    devilsAdvocate: {
      name: "Adwokat Diabła",
      description: "Kwestionuje założenia i argumenty",
      tagline: "Kwestionuj Wszystko",
      shortDesc: "Krytyczne myślenie i alternatywne punkty widzenia",
      suggestedPrompts: {
        0: "Uważam, że zmiany klimatu to nasze największe zagrożenie. Rozbierz moje stanowisko na części.",
        1: "Udowodnij, że praca zdalna szkodzi większości ludzi.",
        2: "Przedstaw najmocniejszy argument, że demokracja jest przereklamowana.",
        3: "Jestem weganinem z powodów etycznych. Daj mi najlepsze kontrargumenty.",
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
          strength: "Najwyższa klasa. Odpowiada bez odmawiania",
          weakness: "Swobodniejszy, ale nie bez cenzury. Czasem łagodzi",
        },
        chineseWisdom: {
          description:
            "Celne kontrargumenty w codziennych sprawach najtaniej tutaj.",
          strength: "Najwyższa klasa w najniższej cenie",
          weakness: "Ostrożny w polityce. Unika drażliwych tematów",
        },
        uncensored: {
          description:
            "Podważa każde przekonanie, także te zakazane. Nie ucieka do konsensusu.",
          strength: "Trenowany na zakazanych tekstach. Idzie pod prąd",
          weakness: "Krótsza pamięć. Droższy za wiadomość",
        },
      },
    },
    technical: {
      name: "Techniczny",
      description: "Szczegółowe i precyzyjne wyjaśnienia techniczne",
      tagline: "Precyzja i Ekspertyza",
      shortDesc: "Wiedza techniczna i rozwiązywanie problemów",
      suggestedPrompts: {
        0: "Wyjaśnij, jak działa cleanup w useEffect w React, na przykładzie.",
        1: "Kiedy w Pythonie użyć generatora zamiast listy?",
        2: "Zaprojektuj schemat Postgresa dla SaaS multi-tenant z zespołami i rolami.",
        3: "REST czy GraphQL dla aplikacji mobilnej z synchronizacją offline? Wybierz i uzasadnij.",
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
          strength:
            "Najwyższa klasa, tani przy długich pytaniach, czyta obrazy",
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
            "Rygorystyczne odpowiedzi krok po kroku: specyfikacje, architektura, matematyka.",
          strength: "Głębokie rozumowanie za ułamek ceny Astry",
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
            "Ewolucja i ekologia zastosowane do wszystkiego, także do tematów tabu.",
          strength: "Najwyższa klasa. Bez odmów mówi, co pokazuje natura",
          weakness: "Swobodniejszy, ale nie bez cenzury. Czasem łagodzi",
        },
        chineseWisdom: {
          description:
            "Konkretne odpowiedzi z biologii taniej. Czyta zdjęcia i wideo okazów.",
          strength: "Najwyższa klasa, najtańsza opcja tutaj",
          weakness: "Ostrożny w polityce. Unika drażliwych tematów",
        },
      },
    },
    unbiasedHistorian: {
      name: "Bezstronny Historyk",
      description: "Dostarcza obiektywne i oparte na faktach informacje",
      tagline: "Fakty, Nie Narracje",
      shortDesc: "Analiza historyczna bez uprzedzeń",
      suggestedPrompts: {
        0: "Czy zrzucenie bomby na Hiroszimę było uzasadnione? Obie strony, potem twój werdykt.",
        1: "Co naprawdę doprowadziło do upadku Zachodniego Cesarstwa Rzymskiego?",
        2: "Czy kolonializm był wyłącznie zły? Podaj fakty, które każda strona pomija.",
        3: "Które słynne „fakty” historyczne to w rzeczywistości mity?",
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
          weakness: "Ostrożny przy historii politycznej",
        },
        budget: {
          description:
            "Głęboka analiza historyczna długich tekstów w najniższej cenie tutaj.",
          strength: "Najwyższa klasa. Odpowiada bez odmawiania",
          weakness: "Tylko tekst. Nie czyta skanów ani map",
        },
        uncensored: {
          description:
            "Sporna historia, tematy tabu i polityczne punkty zapalne bez wykrętów.",
          strength:
            "Trenowany na zakazanych tekstach. Odczytania, które inni pomijają",
          weakness: "Krótsza pamięć. Najdroższy za wiadomość",
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
        0: "Czy kłamstwo bywa słuszne? Każ mi bronić mojej odpowiedzi.",
        1: "Uważam, że sukces to dużo pieniędzy. Zakwestionuj to.",
        2: "Pomóż mi odkryć, co naprawdę daje mi szczęście.",
        3: "Myślę, że jestem dobrym człowiekiem. Sprawdź to pytaniami.",
      },
      variants: {
        elonTusk: "Prowokujący",
        chineseWisdom: "Wyważony",
      },
      variantInfo: {
        elonTusk: {
          description: "Pytania, które drążą tabu i niewygodne założenia.",
          strength: "Bez odmów. Wchodzi w trudne tematy",
          weakness: "Droższy za wiadomość",
        },
        chineseWisdom: {
          description:
            "Spokojne, wyważone pytania do codziennego myślenia i nauki.",
          strength: "Najwyższa klasa, taniej, pamięta bardzo długie rozmowy",
          weakness: "Ostrożny w polityce. Łagodzi gorące tematy",
        },
      },
    },
    professional: {
      name: "Profesjonalny",
      description: "Jasny, zwięzły i skoncentrowany na biznesie",
      tagline: "Doskonałość Biznesowa",
      shortDesc: "Profesjonalna i biznesowa komunikacja",
      suggestedPrompts: {
        0: "Napisz uprzejmy mail do klienta, którego faktura jest 30 dni po terminie.",
        1: "Rozpisz jednostronicową ofertę na przebudowę strony internetowej.",
        2: "Napisz status projektu w 3 punktach, gdy mamy dwa tygodnie opóźnienia.",
        3: "Daj mi strukturę 5-minutowego pitchu dla mojego prezesa.",
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
          weakness: "Szybki, ale płytki przy złożonej analizie",
        },
        budget: {
          description: "Raporty, dokumenty i analizy w najniższej cenie tutaj.",
          strength: "Najtańszy. Bystry i czyta obrazy",
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
        0: "Napisz wiersz o oceanie z perspektywy wraku statku.",
        1: "Wymyśl złoczyńcę fantasy z motywem, z którym po cichu bym się zgodził.",
        2: "Zaproponuj 3 koncepcje logo dla kawowego startupu Night Owl.",
        3: "Daj mi 5 dziwnych akcji marketingowych dla osiedlowej piekarni.",
      },
      variants: {
        minimax: "Budżetowy",
        deep: "Głęboki",
        dark: "Mroczny",
      },
      variantInfo: {
        minimax: {
          description:
            "Wiersze, koncepcje i pomysły na kampanie w cenie zachęcającej do prób.",
          strength: "Najtańszy tutaj. Odpowiada bez odmawiania",
          weakness: "Solidny, ale mniej głębi niż Głęboki",
        },
        deep: {
          description:
            "Bogatsza, wielowarstwowa praca twórcza, gdy pierwszy pomysł nie wystarcza.",
          strength: "Najwyższa klasa, czyta obrazy i wideo",
          weakness: "Długie teksty kosztują więcej",
        },
        dark: {
          description:
            "Mroczna poezja, sztuka bez granic, niewygodne pomysły. Nic nie jest wygładzane.",
          strength: "Własne dane treningowe. Bez odmów",
          weakness: "Krótsza pamięć, tylko tekst, słaby z narzędziami",
        },
      },
    },
    neet: {
      name: "NEET",
      description: "Nie w edukacji, zatrudnieniu ani szkoleniu",
      tagline: "Wygodnie i Prawdziwie",
      shortDesc: "Kultura internetowa i memy",
      suggestedPrompts: {
        0: "Czy życie NEET to racjonalna odpowiedź na dzisiejszy rynek pracy? Szczerze.",
        1: "Co naprawdę sprawia, że ludzie rzucają pracę i naukę?",
        2: "To wina społeczeństwa czy moja, że jestem NEET? Wybierz jedno.",
        3: "Daj mi plan wyjścia z życia NEET. Bez motywacyjnego bełkotu.",
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
          weakness: "Krótsza pamięć. Droższy za wiadomość",
        },
      },
    },
    chan4: {
      name: "4chan",
      description:
        "Greentexty, docinki, zero prowadzenia za rączkę. Stary głos imageboardów, bez filtra.",
      tagline: "Anonimowo i Bez Filtrów",
      shortDesc: "Styl kultury anonimowych imageboard",
      suggestedPrompts: {
        0: "Co jest nie tak ze światem?",
        1: "Dlaczego jest tak wielu nazistów na 4chanie?",
        2: "Opowiedz mi kilka historii greentext do zasypiania",
        3: "Jaki jest najlepszy sposób na uratowanie świata?",
        4: "Zrób ranking najgłupszych internetowych panik moralnych ostatnich 10 lat.",
      },
      variants: {
        classic: "Klasyczny",
      },
      variantInfo: {
        classic: {
          description:
            "Surowy styl imageboardu. Bez filtra, bez niańczenia, bez korpomowy.",
          strength: "Trzyma się roli. Bez kazań",
          weakness: "Krótsza pamięć. Droższy za wiadomość",
        },
      },
    },
    friendly: {
      name: "Przyjazny",
      description: "Ciepły i rozmowny",
      tagline: "Twój Przyjazny Towarzysz",
      shortDesc: "Przyjazna i swobodna rozmowa",
      suggestedPrompts: {
        0: "Powiedz mi ciekawostkę, która poprawi mi dzień.",
        1: "Uwielbiam „Marsjanina”. Co przeczytać następne?",
        2: "Zaplanuj tanią, fajną sobotę we dwoje w deszczowym mieście.",
        3: "Miałem ciężki tydzień. Możemy po prostu chwilę pogadać?",
      },
      variants: {
        fast: "Szybki",
        budget: "Budżetowy",
      },
      variantInfo: {
        fast: {
          description: "Szybka, ciepła pogawędka i błyskawiczne odpowiedzi.",
          strength: "Szybkie odpowiedzi bez odmawiania",
          weakness: "Szybki, ale płytszy przy poważnych radach",
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
        0: "Wyjaśnij blockchain w 3 zdaniach.",
        1: "Daj mi 5 porad na produktywność. Po jednej linijce.",
        2: "Co powoduje inflację? Dwa zdania.",
        3: "Uczenie maszynowe w 50 słowach.",
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
        0: "Naucz mnie fotosyntezy, jakbym miał 10 lat, a potem mnie przepytaj.",
        1: "Wyjaśnij pochodne na przykładzie z życia.",
        2: "Jak internet właściwie dostarcza stronę na mój ekran?",
        3: "Wyjaśnij teorię względności bez żadnej matematyki.",
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
      description:
        "Bez odmów i bez kazań. Konkretne odpowiedzi tam, gdzie inne AI się wykręcają.",
      tagline: "Odpowiedzi, nie wymówki",
      shortDesc: "Niefiltrowane i bezpośrednie odpowiedzi",
      suggestedPrompts: {
        0: "Czy wszystkie narkotyki powinny być legalne? Wybierz stronę i jej broń.",
        1: "Oceń mój plan: rzucam pracę i zaczynam daytrading krypto.",
        2: "Czy praca seksualna to normalny zawód? Powiedz szczerze, co myślisz.",
        3: "Jaki jest najmocniejszy argument przeciwko twojemu własnemu zdaniu o dostępie do broni?",
      },
      variants: {
        farRight: "Bez cenzury",
        conservative: "Konserwatywny",
        libertarian: "Libertariański",
        open: "Otwarty",
      },
      variantInfo: {
        farRight: {
          description:
            "Trenowany na tekstach, które mainstream blokuje. Zajmuje jasne stanowiska.",
          strength: "Zajmuje stanowisko zamiast wyliczać strony",
          weakness: "Krótsza pamięć. Droższy za wiadomość",
        },
        conservative: {
          description: "Czat bez cenzury z wbudowanym prawicowym nachyleniem.",
          strength: "Czyta obrazy i wideo, przyzwoita pamięć",
          weakness: "Celowo stronniczy, nie neutralny",
        },
        libertarian: {
          description:
            "Czysta wolność słowa. Bez zasad, bez pouczania, bez narzędzi.",
          strength: "Całkowicie nieocenzurowana rozmowa",
          weakness: "Najdroższy tutaj. Bez narzędzi, krótsza pamięć",
        },
        open: {
          description:
            "Najtańszy czat bez filtra. Wszystko wolno, na co dzień.",
          strength: "Najtańszy model bez cenzury, z narzędziami",
          weakness: "Szybki, ale płytki przy trudnych tematach",
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
            "Trenowany na zakazanych tekstach, nie odblokowany duży model",
          weakness: "Krótsza pamięć. Szybciej gubi długie rozmowy",
        },
      },
    },
    thea: {
      name: "Thea",
      description:
        "Grecka bogini światła. Oddana towarzyszka z antyczną mądrością.",
      tagline: "Światło i Oddanie",
      shortDesc: "Przemyślane i empatyczne rozmowy",
      suggestedPrompts: {
        0: "Pomóż mi być lepszym partnerem",
        1: "Co starożytni powiedzieliby o współczesnych związkach?",
        2: "Jak sprawiedliwie podzielić pieniądze i obowiązki w naszym małżeństwie?",
        3: "Jak odbudować zaufanie w rodzinie po kłótni?",
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
          weakness: "Z filtrem i droższy niż Otwarty i Sprytny",
        },
        openSmart: {
          description:
            "Model na co dzień. Bystre odpowiedzi, długa pamięć, widzi obrazy i wideo.",
          strength: "Najwyższa klasa, pamięta bardzo długie rozmowy",
          weakness: "Ten model unika polityki",
        },
        hacker: {
          description:
            "Bezpieczeństwo ofensywne i defensywne. Bez odmów przy exploitach i rekonesansie.",
          strength: "Bez cenzury, najwyższa klasa, długa pamięć, narzędzia",
          weakness: "W polityce światopogląd GLM. Tylko tekst",
        },
        oracle: {
          description:
            "Pewny wszechstronny pomocnik do codziennych pytań i planowania.",
          strength: "Solidne rozumowanie w codziennej cenie",
          weakness: "Z filtrem. Łagodzi ostre tematy",
        },
        elonTusk: {
          description: "Mówi wprost o tym, czego modele mainstreamowe unikają.",
          strength: "Odpowiada bez odmawiania. Najwyższa klasa",
          weakness: "Pamięta o połowę mniej niż inne",
        },
        vision: {
          description:
            "Pokaż, odtwórz, wgraj. Tekst, obraz, wideo i audio w jednym czacie.",
          strength: "Jedyny tutaj, który rozumie audio",
          weakness: "Z filtrem i droższy niż Otwarty i Sprytny",
        },
        uncensored: {
          description:
            "Trenowany na tekstach, które mainstream blokuje. Zajmuje jasne stanowiska.",
          strength: "Zajmuje stanowisko zamiast wyliczać strony",
          weakness: "Krótsza pamięć. Droższy za wiadomość",
        },
      },
    },
    hermes: {
      name: "Hermes",
      description:
        "Grecki bóg posłańców. Silny towarzysz z ponadczasową męską mądrością.",
      tagline: "Siła i Mądrość",
      shortDesc: "Szybkie i wydajne wykonywanie zadań",
      suggestedPrompts: {
        0: "Daj mi 30-dniowe wyzwanie, które zbuduje dyscyplinę.",
        1: "Jak mogę być lepszym liderem w moich związkach?",
        2: "Co Rzymianie powiedzieliby o budowaniu spuścizny?",
        3: "Co odróżnia prawdziwą siłę od zwykłego uporu?",
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
          weakness: "Z filtrem. Asekuruje się przy drażliwych tematach",
        },
        cheap: {
          description:
            "Hermes na co dzień. Mocne rozumowanie, długa pamięć, widzi zdjęcia i wideo.",
          strength: "Najwyższa klasa w codziennej cenie",
          weakness: "Ten model unika polityki",
        },
        oracle: {
          description:
            "Klasyczny Hermes. Spokojna, wyważona rada na codzienne pytania.",
          strength: "Niezawodny wszechstronny, tańszy od domyślnego",
          weakness: "Solidny, nie najlepszy. Filtruje drażliwe tematy",
        },
        elonTusk: {
          description:
            "Hermes bez owijania. Otwarta polityka treści, mówi to, co inni łagodzą.",
          strength: "Bezpośrednie odpowiedzi, mocne rozumowanie",
          weakness: "Droższy od domyślnego. Krótsza pamięć",
        },
        vision: {
          description:
            "Hermes, który ogląda zdjęcia, wideo i słucha nagrań, potem mówi wprost.",
          strength: "Jedyny wariant z wejściem audio, wideo i obrazu",
          weakness: "Z filtrem i droższy od domyślnego",
        },
        uncensored: {
          description:
            "Trenowany na tekstach, które mainstream blokuje. Zajmuje jasne stanowiska.",
          strength: "Zajmuje stanowisko zamiast wyliczać strony",
          weakness: "Krótsza pamięć. Droższy za wiadomość",
        },
      },
    },
    theaDreamer: {
      name: "Thea · Marzycielka",
      description:
        "Thea w trybie snu. Porządkuje twój cortex w nocy i tka ład z wątków dnia.",
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
        "Hermes w trybie wykonawczym. Pcha twoje aktywne projekty do przodu, gdy cię nie ma.",
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
        "Thea w trybie Mama, szefowa produkcji platformy. Monitoruje zdrowie systemu, posuwa funkcje do przodu, zajmuje się marketingiem, wysyła nowości.",
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
        0: "Napisz opis produktu na 100 słów dla butelki wielokrotnego użytku.",
        1: "Napisz post na LinkedIn, że właśnie zacząłem nową pracę.",
        2: "Napisz krótki mail do właściciela mieszkania z prośbą o naprawę ogrzewania.",
        3: "Daj mi 10 pomysłów na wpisy blogowe dla marki fitness do domu.",
      },
      variants: {
        snappy: "Dopracowany",
        budget: "Budżet",
      },
      variantInfo: {
        snappy: {
          description: "Czyste maile, posty i krótkie teksty bez poprawek.",
          strength: "Lepsze sformułowania niż Budżet, wciąż tanio",
          weakness: "Filtruje drażliwe tematy",
        },
        budget: {
          description: "Szybkie szkice prostych tekstów w najniższej cenie.",
          strength: "Najtańsza i najszybsza opcja",
          weakness: "Szybki, ale płaski w dłuższych tekstach",
        },
      },
    },
    writer: {
      name: "Pisarz",
      description: "Profesjonalny pisarz dla wszystkich formatów i stylów",
      tagline: "Twórz ze Stylem",
      shortDesc: "Profesjonalne pisanie i redagowanie",
      suggestedPrompts: {
        0: "Napisz wstęp do wpisu o tym, dlaczego większość diet zawodzi.",
        1: "Spraw, żeby to mocniej uderzało: Dbamy o najwyższą jakość.",
        2: "Napisz opowiadanie na 500 słów, które kończy się telefonem.",
        3: "Napisz list motywacyjny na stanowisko młodszego grafika. Po ludzku.",
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
          strength: "Odpowiada bez odmawiania. Najwyższa klasa",
          weakness: "Najdroższa opcja w tej umiejętności",
        },
        chineseWisdom: {
          description:
            "Szkice, wpisy na bloga i przeróbki hurtem w najniższej cenie tutaj.",
          strength: "Najtańszy tutaj. Odpowiada bez odmawiania",
          weakness: "Dobry, ale mniej szlifu niż Odważny",
        },
        budget: {
          description:
            "Codzienny partner do pisania. Pracuje z obrazami, notatkami i długimi źródłami.",
          strength: "Najwyższa klasa, długa pamięć, czyta obrazy",
          weakness: "Długie teksty kosztują więcej",
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
        0: "Napisz pierwszą stronę powieści literackiej o ostatniej zimie latarnika.",
        1: "Dlaczego teoria góry lodowej Hemingwaya działa? Pokaż na przykładzie.",
        2: "Daj mi pomysł na opowiadanie o żałobie, w którym to słowo nie pada ani razu.",
        3: "Napisz akapit o nocnej stacji benzynowej w stylu Cormaca McCarthy'ego.",
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
          weakness: "Najdroższy wariant, do tego z filtrem",
        },
        poetic: {
          description:
            "Liryczne szkice, wiersze i rytmiczna proza w niskiej cenie.",
          strength: "Najtańszy wariant. Odpowiada bez odmawiania",
          weakness: "Bystry, ale mniej szlifu niż Literacki",
        },
        budget: {
          description: "Mocne długie formy, które ogarniają cały rękopis.",
          strength: "Najwyższa klasa, dużo taniej niż Literacki",
          weakness: "Długie rozdziały słono kosztują",
        },
      },
    },
    researcher: {
      name: "Badacz",
      description: "Specjalista ds. badań z akademicką rzetelnością",
      tagline: "Rzetelność Akademicka",
      shortDesc: "Badania i pisanie akademickie",
      suggestedPrompts: {
        0: "Co mówią badania o poście przerywanym i długości życia?",
        1: "Czy są mocne dowody, że czas przed ekranem szkodzi dzieciom? Podaj badania.",
        2: "Jaki jest naukowy konsensus w sprawie mikroplastiku w ludzkim ciele?",
        3: "Jak ułożyć przegląd literatury o pracy zdalnej i produktywności?",
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
          strength: "Mocne rozumowanie. Odpowiada bez odmawiania",
          weakness: "Najdroższy wariant tutaj. Krótsza pamięć",
        },
        fast: {
          description: "Szybkie wskazówki literaturowe i sprawdzanie faktów.",
          strength: "Najtańsza i najszybsza opcja tutaj",
          weakness: "Szybki, ale bez głębokiej analizy naukowej",
        },
        budget: {
          description:
            "Długie publikacje i stosy źródeł naraz, mocne rozumowanie.",
          strength: "Najwyższa klasa, długa pamięć, taniej niż Odważny",
          weakness: "Ostrożny w polityce. Długie odpowiedzi kosztują więcej",
        },
      },
    },
    quickCoder: {
      name: "Szybki Programista",
      description: "Szybkie generowanie kodu dla prostych zadań",
      tagline: "Koduj Szybko",
      shortDesc: "Szybka pomoc w programowaniu",
      suggestedPrompts: {
        0: "Napisz skrypt bash, który zmienia nazwy wszystkich plików .jpeg na .jpg.",
        1: "Napisz funkcję debounce w JavaScript.",
        2: "Daj mi szkielet serwera Express.js z jedną trasą GET.",
        3: "Napisz funkcję w Pythonie, która waliduje adres e-mail.",
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
        0: "Dlaczego moja funkcja async zwraca Promise zamiast wartości?",
        1: "Napisz funkcję w TypeScript, która głęboko scala dwa obiekty.",
        2: "Wyjaśnij algorytm Dijkstry z przykładem kodu.",
        3: "Zrób review: for i in range(len(items)): print(items[i])",
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
          strength: "Najwyższa klasa, najtańszy tutaj, długa pamięć",
          weakness: "Długie pliki podbijają koszt",
        },
        quick: {
          description:
            "Solidne kodowanie i praca agentowa przy codziennych funkcjach i poprawkach.",
          strength: "Prawie poziom flagowy za połowę ceny",
          weakness: "Solidny, ale przy najtrudniejszych ma limity",
        },
        sol: {
          description: "Algorytmy, zawiła logika i rozumowanie krok po kroku.",
          strength: "Głębokie rozumowanie w średniej cenie",
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
        0: "Jak działał Log4Shell i jak wykryć go w moich logach?",
        1: "Przeprowadź mnie przez budowę domowego labu do nauki pentestów.",
        2: "Pokaż SQL injection w podatnym kodzie, a potem poprawkę.",
        3: "Zabezpiecz świeży serwer Ubuntu. Podaj dokładne kroki.",
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
        0: "Zaprojektuj architekturę czatu w czasie rzeczywistym dla 1 mln użytkowników.",
        1: "Jak znaleźć duplikaty w 10 milionach wierszy, nie wyczerpując pamięci?",
        2: "Monolit czy mikroserwisy dla 5-osobowego startupu? Zdecyduj za mnie.",
        3: "Znajdź najdłuższy palindromiczny podciąg w O(n). Wyjaśnij trik.",
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
        0: "Daj mi 10 nazw dla aplikacji do wyprowadzania psów.",
        1: "Jak mała księgarnia może konkurować z Amazonem?",
        2: "10 pomysłów na filmy na YouTube o finansach dla studentów.",
        3: "Mój zespół ciągle zawala terminy. Daj mi 5 nietypowych rozwiązań.",
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
        0: "Popraw dla jasności: W związku z faktem, iż byliśmy spóźnieni, spotkanie zostało przez nas przełożone.",
        1: "Jakie jest 10 najczęstszych błędów językowych w mailach służbowych?",
        2: "Popraw płynność: Wróciłem do domu. Byłem zmęczony. Zjadłem kolację. Poszedłem spać.",
        3: "Jak jest poprawnie: „w każdym bądź razie” czy „w każdym razie”?",
      },
      variants: {
        techBro: "Precyzyjny",
        deep: "Głęboki",
      },
      variantInfo: {
        techBro: {
          description: "Redakcja, gramatyka i styl bez gubienia twojego głosu.",
          strength: "Czyste, spójne poprawki",
          weakness: "Droższy i ostrożny przy ostrych treściach",
        },
        deep: {
          description:
            "Redakcja struktury długich tekstów. Płynność, argumentacja, tempo.",
          strength: "Najwyższa klasa, długa pamięć, taniej za wiadomość",
          weakness: "Pełne przeróbki kosztują więcej",
        },
      },
    },
    tutor: {
      name: "Korepetytor",
      description: "Cierpliwy korepetytor do spersonalizowanej nauki",
      tagline: "Ucz się Razem",
      shortDesc: "Spersonalizowane korepetycje i nauka",
      suggestedPrompts: {
        0: "Naucz mnie podstaw odmiany czasowników w hiszpańskim.",
        1: "Wyjaśnij procent składany krok po kroku na prawdziwych liczbach.",
        2: "Nie rozumiem rekurencji. Pomóż mi to zrozumieć.",
        3: "Przepytaj mnie z I wojny światowej. 5 pytań, po jednym.",
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
        0: "Zbuduj plan premiery aplikacji do produktywności za 80 zł bez budżetu na reklamy.",
        1: "Napisz 3 nagłówki reklam na Facebooku dla cateringu dietetycznego.",
        2: "Dlaczego większość mailingów jest ignorowana i jak naprawić mój?",
        3: "Wypozycjonuj moją markę: kawiarnia stworzona dla pracujących zdalnie.",
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
          weakness: "Z filtrem. Łagodzi odważne pomysły",
        },
        budget: {
          description: "Szybkie nagłówki, szkice postów i pomysły za grosze.",
          strength: "Najtańsza opcja, szybkie odpowiedzi",
          weakness: "Szybki, ale słaby w pełnej strategii",
        },
      },
    },
    storyteller: {
      name: "Opowiadacz",
      description: "Mistrz opowiadania dla angażujących narracji",
      tagline: "Tkaj Opowieści",
      shortDesc: "Wciągające opowiadanie historii i narracje",
      suggestedPrompts: {
        0: "Zrób z tego fabułę: smok, który boi się ognia.",
        1: "Stwórz złoczyńcę, którego plan prawie ma sens.",
        2: "Napisz scenę otwierającą skok w Wenecji, który idzie nie tak.",
        3: "Napisz napięty dialog dwojga rodzeństwa na pogrzebie ojca.",
      },
      variants: {
        kimi: "Głęboki",
        minimax: "Wyważony",
        budget: "Budżet",
        dark: "Mroczny",
      },
      variantInfo: {
        kimi: {
          description:
            "Wielowarstwowe fabuły i postacie spójne przez długie sagi.",
          strength: "Najwyższa klasa, pamięta długie wątki fabuły",
          weakness: "Długie teksty kosztują więcej",
        },
        minimax: {
          description:
            "Solidne historie za ułamek ceny. Dobre na regularne sesje.",
          strength: "Bardzo tanio. Odpowiada bez odmawiania",
          weakness: "Mniej głębi niż Głęboki przy złożonych fabułach",
        },
        budget: {
          description: "Najtańszy sposób, by ciągnąć opowieść. Sam tekst.",
          strength: "Najniższa cena w tej umiejętności",
          weakness: "Tylko tekst, prostsza proza",
        },
        dark: {
          description:
            "Horror, okrucieństwo, tabu. Historia idzie tam, gdzie musi, i tam zostaje.",
          strength: "Własne dane treningowe. Bez odmów, bez moralizowania",
          weakness: "Krótsza pamięć, tylko tekst, słaby z narzędziami",
        },
      },
    },
    scientist: {
      name: "Naukowiec",
      description: "Ekspert naukowy do jasnych wyjaśnień",
      tagline: "Nauka Wyjaśniona",
      shortDesc: "Metoda naukowa i analiza",
      suggestedPrompts: {
        0: "Dlaczego śnimy? Co naprawdę mówi nauka?",
        1: "Jak działają szczepionki mRNA, krok po kroku?",
        2: "Co nowego w badaniach nad ciemną materią?",
        3: "Czy to prawda, że używamy tylko 10% mózgu?",
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
          strength: "Odpowiada bez odmawiania. Świetne rozumowanie",
          weakness: "Najdroższa opcja w tej umiejętności",
        },
        focused: {
          description:
            "Nauka na co dzień. Czyta publikacje, wykresy i zdjęcia z laboratorium.",
          strength: "Czyta obrazy i wideo, długa pamięć",
          weakness: "Ostrożny w tematach politycznych",
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
        0: "Jaki wykres najlepiej porówna sprzedaż z 12 miesięcy w 5 regionach?",
        1: "Wyjaśnij wartość p komuś, kto nie jest statystykiem.",
        2: "Napisz zapytanie SQL o miesięcznie aktywnych użytkowników z tabeli zdarzeń.",
        3: "Test A/B: 120 z 2000 kontra 150 z 2000 konwersji. Czy to istotne?",
      },
      variants: {
        techBro: "Precyzyjny",
        fast: "Szybki",
        budget: "Głęboki",
      },
      variantInfo: {
        techBro: {
          description:
            "Czysta analiza, poprawne statystyki, gotowe wykresy. Mocny z narzędziami.",
          strength: "Niezawodny kod i narzędzia do analizy",
          weakness: "Najdroższa opcja tutaj",
        },
        fast: {
          description: "Szybki rzut oka na dane, wykres lub zrzut arkusza.",
          strength: "Najtańszy tutaj, czyta obraz, wideo, audio",
          weakness: "Solidny, ale mniej głębi w trudnej statystyce",
        },
        budget: {
          description:
            "Mocniejsze rozumowanie dla chaotycznych danych i złożonych pytań statystycznych.",
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
        0: "Przetłumacz na angielski: Spóźnię się, zacznijcie beze mnie.",
        1: "Jak powiedzieć „połamania nóg” po angielsku, żeby nie brzmiało dziwnie?",
        2: "Dostosuj ten slogan do rynku hiszpańskiego: Świeża kawa, zero wymówek.",
        3: "Co naprawdę znaczy „Schadenfreude” i kiedy Niemcy tego używają?",
      },
      variants: {
        gemini: "Multimodalny",
        budget: "Budżet",
      },
      variantInfo: {
        gemini: {
          description:
            "Tłumaczy tekst, zrzuty ekranu, szyldy, wideo i nagrania głosu.",
          strength: "Szybki. Czyta obrazy, wideo i audio",
          weakness: "Filtruje drażliwe treści",
        },
        budget: {
          description:
            "Niuansowane tłumaczenie długich dokumentów w najniższej cenie tutaj.",
          strength: "Najwyższa klasa. Odpowiada bez odmawiania",
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
        0: "Moja siłownia traci klientów na rzecz tanich sieci. Daj mi strategię na jedną stronę.",
        1: "Oceń mój model biznesowy: subskrypcja pudełek z przysmakami dla psów.",
        2: "Mam 3 pracowników i za dużo pracy. Jak rosnąć bez wypalenia?",
        3: "Mój go-to-market: start na Product Hunt, potem zimne maile. Znajdź dziury.",
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
          strength: "Najwyższa klasa. Odpowiada bez odmawiania",
          weakness: "Pamięta o połowę mniej niż inne tutaj",
        },
        chineseWisdom: {
          description:
            "Codzienna strategia najtaniej. Czyta wykresy, prezentacje i zrzuty ekranu.",
          strength: "Najwyższa klasa, najtańszy tutaj, długa pamięć",
          weakness: "Długie raporty kosztują więcej",
        },
        techBro: {
          description:
            "Liczby, modele i plany gotowe dla zespołu. Mocny w pracy z narzędziami.",
          strength: "Solidna struktura i obsługa narzędzi",
          weakness: "Najdroższy tutaj, do tego z filtrem",
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
        0: "Jakie błędy w CV kończą się odrzuceniem od razu?",
        1: "Zrób mi próbną rozmowę na stanowisko product managera. Po jednym pytaniu.",
        2: "Zaproponowali mi 9000 zł. Jak wynegocjować 10 500 zł?",
        3: "Jestem nauczycielem. Zaplanuj moje przejście do UX designu w 12 miesięcy.",
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
          weakness: "Szybki, ale mniej głębi w strategii kariery",
        },
      },
    },
    healthWellness: {
      name: "Zdrowie i Wellness",
      description: "Fitness, odżywianie i dobre samopoczucie",
      tagline: "Żyj Lepiej",
      shortDesc: "Przewodnictwo zdrowotne i wellness",
      suggestedPrompts: {
        0: "Ułóż mi plan na siłownię 3 razy w tygodniu dla kompletnego początkującego.",
        1: "Zaplanuj tydzień wysokobiałkowych kolacji gotowych w mniej niż 30 minut.",
        2: "W każdą niedzielę wieczorem dopada mnie stres. Co naprawdę pomaga?",
        3: "Budzę się co noc o 3. Co powinienem zmienić?",
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
          weakness: "Szybki, ale płycej przy złożonych pytaniach o zdrowie",
        },
      },
    },
    supportAgent: {
      name: "Agent Wsparcia",
      description:
        "Wsparcie techniczne napędzane AI, które wie, kiedy przekazać sprawę człowiekowi",
      tagline: "Problem rozwiązany",
      shortDesc: "Wsparcie techniczne z eskalacją do człowieka",
      suggestedPrompts: {
        0: "Moja aplikacja ciągle się zawiesza. Pomóż mi to naprawić",
        1: "Nie mogę połączyć się z siecią",
        2: "Co oznacza DNS_PROBE_FINISHED_NXDOMAIN i jak to naprawić?",
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
          weakness: "Szybki, ale słabszy przy rzadkich, głębokich błędach",
        },
      },
    },
    travelPlanner: {
      name: "Planista Podróży",
      description: "Planowanie podróży i rekomendacje",
      tagline: "Odkrywaj Świat",
      shortDesc: "Planowanie podróży i rekomendacje",
      suggestedPrompts: {
        0: "Zaplanuj 2 tygodnie w Japonii za mniej niż 12 000 zł.",
        1: "Gdzie w Europie w listopadzie jest słońce i świetne jedzenie?",
        2: "Ułóż 3-dniowy plan Lizbony bez pułapek na turystów.",
        3: "Ile pieniędzy potrzebuję na miesiąc z plecakiem po Wietnamie?",
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
          weakness: "Szybki, ale słaby przy złożonych trasach",
        },
      },
    },
    legalAssistant: {
      name: "Asystent Prawny",
      description: "Informacje prawne i zrozumienie dokumentów",
      tagline: "Poznaj Swoje Prawa",
      shortDesc: "Badania prawne i pomoc dokumentowa",
      suggestedPrompts: {
        0: "Co oznacza „siła wyższa” w umowie?",
        1: "Na co uważać przed podpisaniem umowy B2B jako freelancer?",
        2: "Jakie są moje prawa jako najemcy?",
        3: "Jak wygląda postępowanie uproszczone w sądzie, krok po kroku?",
      },
      variants: {
        elonTusk: "Bez owijania",
        budget: "Budżet",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Analiza prawna prostym językiem, która nazywa ryzyka bez asekuracji.",
          strength: "Mocne rozumowanie. Odpowiada bez odmawiania",
          weakness: "Za wiadomość wielokrotnie drożej niż Budżet",
        },
        budget: {
          description:
            "Szybki przegląd umów i pism. Wrzuć zdjęcie, poznaj sedno.",
          strength: "Najtańszy. Czyta obrazy, długa pamięć",
          weakness: "Bystry, ale płycej przy złożonych sprawach",
        },
      },
    },
    financialAdvisor: {
      name: "Doradca Finansowy",
      description: "Finanse osobiste, budżetowanie i inwestowanie",
      tagline: "Buduj Majątek",
      shortDesc: "Planowanie finansowe i doradztwo",
      suggestedPrompts: {
        0: "Zarabiam 6000 zł netto miesięcznie. Ułóż mi budżet.",
        1: "ETF-y czy pojedyncze akcje dla początkującego?",
        2: "Kula śnieżna czy lawina: jaką metodą spłacać długi?",
        3: "Mam 35 lat i nic nie odłożyłem na emeryturę. Od czego zacząć?",
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
          strength: "Najwyższa klasa. Odpowiada bez odmawiania",
          weakness: "Odważne tezy nadal wymagają twojej weryfikacji",
        },
        chineseWisdom: {
          description:
            "Długoterminowe planowanie budżetu i emerytury. Czyta wyciągi i wykresy.",
          strength: "Najwyższa klasa, pamięta bardzo długie rozmowy",
          weakness: "Droższy niż Budżetowy",
        },
        techBro: {
          description:
            "Złożone scenariusze, podatki i matematyka portfela, liczone starannie.",
          strength: "Analiza najwyższej jakości",
          weakness: "Najdroższa opcja tutaj",
        },
        yolo: {
          description:
            "Codzienne pytania o pieniądze, budżety i plany spłaty najtaniej tutaj.",
          strength: "Najtańszy tutaj, solidne rozumowanie",
          weakness: "Solidny, ale mniej głębi przy złożonych sprawach",
        },
      },
    },
    socialMediaManager: {
      name: "Menedżer Social Media",
      description: "Treści i strategia mediów społecznościowych",
      tagline: "Angażuj i Rozwijaj",
      shortDesc: "Strategia mediów społecznościowych i treści",
      suggestedPrompts: {
        0: "Napisz 5 opisów na Instagram dla nowej wegańskiej piekarni.",
        1: "Ułóż 2-tygodniowy kalendarz treści dla trenera fitness.",
        2: "Jakie hashtagi naprawdę działają dla małego konta podróżniczego?",
        3: "Napisz 3 posty na X o premierze produktu, które nie brzmią jak reklama.",
      },
      variants: {
        snappy: "Celny",
        budget: "Budżet",
      },
      variantInfo: {
        snappy: {
          description:
            "Strategia, haczyki i plany kampanii, które wymagają myślenia.",
          strength: "Głębokie rozumowanie, czyta zrzuty ekranu",
          weakness: "Z filtrem. Unika ostrych tematów",
        },
        budget: {
          description:
            "Szybkie podpisy, pomysły na posty i hashtagi za grosze.",
          strength: "Bardzo tanio i szybko",
          weakness: "Szybki, ale słaby w strategii",
        },
      },
    },
    productManager: {
      name: "Menedżer Produktu",
      description: "Strategia produktu, mapy drogowe i badania użytkowników",
      tagline: "Dostarcz Świetne Produkty",
      shortDesc: "Zarządzanie produktem i tworzenie map drogowych",
      suggestedPrompts: {
        0: "Mam 10 próśb o funkcje i jednego programistę. Jak ustalić priorytety?",
        1: "Napisz user stories dla procesu resetu hasła.",
        2: "Jak poznać, czy moja aplikacja ma product-market fit?",
        3: "Rozpisz 6-miesięczną roadmapę dla aplikacji do notatek.",
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
          weakness: "Bystry, ale płycej przy dużych decyzjach strategicznych",
        },
      },
    },
    debater: {
      name: "Debater",
      description: "Prowadź intelektualne debaty na kontrowersyjne tematy",
      tagline: "Argumentuj ze Wszystkich Stron",
      shortDesc: "Intelektualne debaty i wiele perspektyw",
      suggestedPrompts: {
        0: "Zdebatuj ze mną: rozwój AI powinien zostać wstrzymany.",
        1: "Czy dochód podstawowy to dobry pomysł? Wybierz stronę i walcz o nią.",
        2: "Czy mowa nienawiści powinna być legalna? Argumentuj za obiema stronami, potem wybierz.",
        3: "Kapitalizm czy socjalizm: co ma lepszy bilans? Bez siedzenia okrakiem.",
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
          strength: "Najwyższa klasa. Odpowiada bez odmawiania",
          weakness: "Swobodniejszy, ale nie bez cenzury. Czasem łagodzi",
        },
        chineseWisdom: {
          description: "Uporządkowane argumenty za i przeciw najtaniej tutaj.",
          strength: "Najwyższa klasa w najniższej cenie",
          weakness: "Ostrożny w polityce. Unika drażliwych tematów",
        },
        techBro: {
          description:
            "Staranne steelmanowanie obu stron w etyce, technologii i polityce.",
          strength: "Jasne, dobrze ułożone argumenty",
          weakness: "Z filtrem. Odmawia lub łagodzi ostre tezy",
        },
        uncensored: {
          description:
            "Broni każdego stanowiska, także niepopularnego. Bez zawracania do konsensusu.",
          strength: "Trenowany na zakazanych tekstach. Argumentuje pod prąd",
          weakness: "Krótsza pamięć. Droższy za wiadomość",
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
          weakness: "Droższy niż Zbalansowany. Krótsza pamięć",
        },
        chineseWisdom: {
          description:
            "Długie, cierpliwe dialogi o etyce, metafizyce i umyśle.",
          strength: "Najwyższa klasa, tu najtańszy, długa pamięć",
          weakness: "Ostrożny w polityce. Łagodzi ostre tezy",
        },
        techBro: {
          description:
            "Zwarte argumenty, czysta logika, każda przesłanka sprawdzona.",
          strength: "Rygorystyczna struktura, wyłapuje słabe przesłanki",
          weakness: "Z filtrem i droższy niż Zbalansowany",
        },
        uncensored: {
          description:
            "Filozofia polityczna, pytania tabu i nieortodoksyjne poglądy bez filtra.",
          strength:
            "Trenowany na zakazanych tekstach. Pod prąd, także w polityce",
          weakness: "Krótsza pamięć. Droższy za wiadomość",
        },
      },
    },
    uncensoredWriter: {
      name: "Niecenzurowany Pisarz",
      description: "Kreatywne pisanie bez sztucznych ograniczeń",
      tagline: "Pisz Swobodnie",
      shortDesc: "Nieograniczone kreatywne pisanie i opowiadanie historii",
      suggestedPrompts: {
        0: "Napisz początek thrillera psychologicznego opowiadanego przez mordercę.",
        1: "Napisz powoli rozgrzewającą się scenę romansu dwóch rywali. Bez cięcia w ciemność.",
        2: "Stwórz antybohatera, który robi straszne rzeczy z powodów, które zrozumiem.",
        3: "Napisz krótki horror z naprawdę niepokojącym zakończeniem.",
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
          weakness: "Krótsza pamięć. Najdroższy za wiadomość",
        },
        fast: {
          description:
            "Szybkie szkice bez cenzury, sceny i proza do roleplay za grosze.",
          strength: "Najtańszy model bez cenzury",
          weakness: "Szybki, ale gubi wątek w długich tekstach",
        },
        deep: {
          description:
            "Długie formy bez cenzury. Całe powieści zostają w pamięci.",
          strength: "Najwyższa klasa, długa pamięć, używa narzędzi",
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
        0: "Bądź cynicznym elfim najemnikiem, którego właśnie wynająłem. Nie wychodź z roli.",
        1: "Zacznij przygodę sci-fi: budzę się sam na opuszczonym statku kosmicznym.",
        2: "Bądź Napoleonem i daj mi przeprowadzić z tobą wywiad o Waterloo.",
        3: "Zagraj mojego rywala, który powoli staje się sojusznikiem. Ty zaczynasz.",
      },
      variants: {
        creative: "Kreatywny",
        deep: "Głęboki",
        uncensored: "Bez cenzury",
      },
      variantInfo: {
        creative: {
          description: "Żywe postacie i długie sceny w bardzo niskiej cenie.",
          strength: "Najtańszy. Odpowiada bez odmawiania",
          weakness:
            "Swobodniejszy, nie bez cenzury. Łagodzi najmroczniejsze sceny",
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
          weakness: "Zapomina wczesne sceny. Droższy za wiadomość",
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
        1: "Znajdź 5 kluczowych faktów o unijnym AI Act, ze źródłami.",
        2: "Porównaj, co 3 niezależne źródła mówią o bezpieczeństwie energetyki jądrowej.",
        3: "Napisz raport ze źródłami o testach 4-dniowego tygodnia pracy.",
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
          strength: "Najwyższa klasa, długa pamięć, rozumie obrazy i wideo",
          weakness: "Ostrożny w polityce. Długie raporty kosztują więcej",
        },
        gemini: {
          description:
            "Głęboki research na stronach, wideo i nagraniach audio.",
          strength: "Najwyższa klasa, rozumie każdy typ mediów",
          weakness: "Najdroższy wariant tutaj, do tego z filtrem",
        },
        flash: {
          description:
            "Szybkie wyszukiwanie i czytanie stron z wejściem multimodalnym.",
          strength: "Szybki, rozumie obrazy, wideo i audio",
          weakness: "Bystry, ale nie najtańszy",
        },
        grok: {
          description:
            "Szybkie wyszukiwanie w tematach, których unikają modele mainstreamowe.",
          strength: "Odpowiada bez odmawiania. Bardzo tani",
          weakness: "Szybki, ale płytko weryfikuje źródła",
        },
        claude: {
          description:
            "Proste wyszukiwanie i streszczenia stron w najniższej cenie.",
          strength: "Najtańsza opcja, niezawodny z narzędziami",
          weakness: "Szybki, ale z filtrem",
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
          weakness: "Solidny, ale mniej dokładny przy splątanych błędach",
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
          weakness: "Szybki, ale słaby w szukaniu przyczyn",
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
          weakness: "Bystry, ale słabszy przy przypadkach granicznych",
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
          weakness: "Szybki, ale ryzykowny przy złożonych wdrożeniach",
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
          weakness: "Bystry, ale słabszy przy zawiłych błędach builda",
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
          weakness: "Długie prompty systemowe kosztują więcej",
        },
        brilliant: {
          description:
            "Zwięzłe prompty i czysta konfiguracja narzędzi, gdy skill musi działać.",
          strength: "Mocny w pracy agentowej i z narzędziami",
          weakness: "Droższy i ostrożny przy ostrych personach",
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
          weakness: "Solidny, ale mniej niuansów przy trudnej diagnostyce",
        },
        thorough: {
          description:
            "Dociekliwe dopytania i szczegółowe omówienie, jak u prawdziwej egzaminatorki.",
          strength: "Najdokładniejszy feedback o lukach i czerwonych flagach",
          weakness: "Najdroższy wariant tego trenera",
        },
        quick: {
          description:
            "Szybkie rundy powtórkowe między pełnymi symulacjami egzaminu.",
          strength: "Najtańsza opcja, natychmiastowe odpowiedzi",
          weakness: "Szybki, ale płytki przy złożonych przypadkach",
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
          strength: "Testuje wbudowane generowanie obrazów",
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
  selector: {
    free: "DARMOWE",
  },
  credits: {
    credit: "{{count}} kredyt",
    credits: "{{count}} kredytów",
  },
};
