import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  id: {
    category: "Chat",
    tags: {
      favorites: "Ulubione",
    },
    voices: {
      MALE: "Męski głos",
      FEMALE: "Damski głos",
    },

    get: {
      title: "Pobierz ulubiony",
      description: "Pobierz konkretną ulubioną konfigurację",
      container: {
        title: "Szczegóły ulubionego",
      },
      editButton: {
        label: "Edytuj ulubiony",
      },
      deleteButton: {
        label: "Usuń ulubiony",
      },
      viewSkillButton: {
        label: "Zobacz skill",
      },
      signupPrompt: {
        title: "Dostosuj osobowość postaci",
        description:
          "Edytuj prompt systemowy i zachowanie postaci. Zarejestruj się, aby rozpocząć.",
        backButton: "Wstecz",
        signupButton: "Utwórz konto",
        loginButton: "Zaloguj się",
      },
      id: {
        label: "ID ulubionego",
      },
      response: {
        skillId: {
          content: "Postać: {{value}}",
        },
        customVariantName: {
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
        modelSelection: {
          title: "Wybór modelu",
        },
        selectionType: {
          content: "Typ wyboru: {{value}}",
        },
        minIntelligence: {
          content: "Min. inteligencja: {{value}}",
        },
        maxIntelligence: {
          content: "Maks. inteligencja: {{value}}",
        },
        minPrice: {
          content: "Minimalna cena: {{value}}",
        },
        maxPrice: {
          content: "Maksymalna cena: {{value}}",
        },
        minContent: {
          content: "Min. poziom treści: {{value}}",
        },
        maxContent: {
          content: "Maks. poziom treści: {{value}}",
        },
        content: {
          content: "Poziom treści: {{value}}",
        },
        preferredStrengths: {
          content: "Preferowane mocne strony: {{value}}",
        },
        ignoredWeaknesses: {
          content: "Ignorowane słabe strony: {{value}}",
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
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe ID ulubionego",
        },
        network: {
          title: "Błąd sieci",
          description: "Nie można połączyć się z serwerem",
        },
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Musisz być zalogowany, aby wyświetlić ten ulubiony",
        },
        forbidden: {
          title: "Zabronione",
          description: "Nie masz uprawnień do wyświetlenia tego ulubionego",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Ulubiony nie znaleziony",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się załadować ulubionego",
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
        description: "Ulubiony załadowany pomyślnie",
      },
    },
    patch: {
      title: "Aktualizuj ulubiony",
      description: "Aktualizuj istniejącą ulubioną konfigurację",
      container: {
        title: "Edytuj ulubiony",
      },
      backButton: {
        label: "Wróć do ulubionego",
      },
      deleteButton: {
        label: "Usuń ulubiony",
      },
      viewSkillButton: {
        label: "Zobacz skill",
      },
      useThisSkillButton: {
        label: "Użyj tej postaci",
      },
      useThisModelButton: {
        label: "Użyj tego modelu",
      },
      currentlyActiveButton: {
        label: "Obecnie aktywne",
      },
      signupPrompt: {
        title: "Dostosuj osobowość postaci",
        description:
          "Edytuj prompt systemowy i zachowanie postaci. Zarejestruj się, aby rozpocząć.",
        backButton: "Wstecz",
        signupButton: "Utwórz konto",
        loginButton: "Zaloguj się",
      },
      saveButton: {
        label: "Zapisz",
        loadingText: "Zapisywanie...",
      },
      saveAndUseButton: {
        label: "Zapisz i Użyj",
        loadingText: "Zapisywanie i aktywacja...",
      },
      id: {
        label: "ID ulubionego",
      },
      skillId: {
        label: "Postać",
        description:
          'ID umiejętności. „skillSlug" dla domyślnego wariantu, „skillSlug__variantId" dla konkretnego wariantu.',
      },
      customVariantName: {
        label: "Nazwa wariantu",
        description:
          "Własna nazwa dla tego wariantu (pozostaw puste, aby użyć domyślnej)",
      },
      chatModel: {
        label: "Model czatu",
        placeholder: "Odziedzicz z umiejętności",
      },
      voice: {
        label: "Głos AI",
        description: "Wybierz głos dla swojego asystenta AI",
        placeholder: "Dziedzicz z postaci",
      },
      sttModel: {
        label: "Model mowy na tekst",
        description: "Model używany do rozpoznawania mowy",
        placeholder: "Dziedzicz z postaci",
      },
      imageVisionModel: {
        label: "Model wizji obrazu",
        description: "Model używany do analizy obrazów",
        placeholder: "Dziedzicz z postaci",
      },
      videoVisionModel: {
        label: "Model wizji wideo",
        description: "Model używany do analizy wideo",
        placeholder: "Dziedzicz z postaci",
      },
      audioVisionModel: {
        label: "Model wizji audio",
        description: "Model używany do analizy audio",
        placeholder: "Dziedzicz z postaci",
      },
      imageGenModel: {
        label: "Model generowania obrazów",
        description: "Model do generowania obrazów",
        placeholder: "Dziedzicz z postaci",
      },
      musicGenModel: {
        label: "Model generowania muzyki",
        description: "Model do generowania muzyki",
        placeholder: "Dziedzicz z postaci",
      },
      videoGenModel: {
        label: "Model generowania wideo",
        description: "Model do generowania wideo",
        placeholder: "Dziedzicz z postaci",
      },
      mode: {
        label: "Tryb wyboru",
      },
      modelSelection: {
        title: "Wybór modelu",
        label: "Wybór modelu",
        description:
          "Wybierz sposób wyboru modelu AI - wybierz konkretny model lub pozwól systemowi wybrać na podstawie filtrów",
      },
      selectionType: {
        label: "Typ wyboru",
        characterBased: "Na podstawie postaci",
        manual: "Konkretny model",
        filters: "Kryteria filtrowania",
      },
      intelligence: {
        label: "Poziom inteligencji",
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
      minPrice: {
        label: "Minimalna cena",
        description: "Minimalny koszt kredytów na wiadomość",
      },
      maxPrice: {
        label: "Maksymalna cena",
      },
      minContent: {
        label: "Minimalny poziom treści",
        description: "Minimalny poziom moderacji treści dla modelu",
      },
      maxContent: {
        label: "Maksymalny poziom treści",
        description: "Maksymalny poziom moderacji treści dla modelu",
      },
      content: {
        label: "Poziom treści",
      },
      preferredStrengths: {
        label: "Preferowane mocne strony",
        description: "Możliwości i mocne strony modelu do preferowania",
      },
      ignoredWeaknesses: {
        label: "Ignorowane słabe strony",
        description: "Słabe strony modelu do ignorowania lub akceptowania",
      },
      manualModelId: {
        label: "Model ręczny",
      },
      isActive: {
        label: "Aktywny",
      },
      position: {
        label: "Pozycja",
      },
      color: {
        label: "Kolor",
        description: "Niestandardowy kolor dla tego ulubionego",
      },
      customIcon: {
        label: "Niestandardowa ikona",
        description: "Niestandardowa ikona dla tego ulubionego",
      },
      icon: {
        label: "Niestandardowa ikona",
        description: "Zastąp domyślną ikonę postaci dla tego slotu ulubionych",
      },
      compactTrigger: {
        label: "Próg kompresji (tokeny)",
        description:
          "Liczba tokenów wyzwalająca automatyczną kompresję rozmowy. Null = postać lub domyślna globalna.",
      },
      availableTools: {
        label: "Dozwolone narzędzia",
        description:
          "Zastąp narzędzia dla tego slotu. Każdy wpis wymaga toolId. Null = postać lub ustawienia globalne.",
      },
      pinnedTools: {
        label: "Przypięte narzędzia",
        description:
          "Zastąp przypięte narzędzia paska narzędzi dla tego slotu. Null = postać lub ustawienia globalne.",
      },
      deniedTools: {
        label: "Zablokowane narzędzia",
        description:
          "Zablokuj określone narzędzia dla tego slotu - dodatkowo do listy blokad skilla. Te narzędzia nie mogą być wywoływane niezależnie od innych ustawień.",
        clearAll: "Wyczyść wszystko",
        noToolsFound: "Nie znaleziono narzędzi",
        blockedNote:
          "Zablokowane narzędzia nie mogą być wywoływane niezależnie od innych ustawień.",
        searchPlaceholder: "Szukaj narzędzi...",
        blocked: "zablokowane",
      },
      promptAppend: {
        label: "Dołączenie do promptu",
        description:
          "Dodatkowe instrukcje dołączane do systemowego promptu skilla tylko dla tego slotu. Pozwala spersonalizować zachowanie AI bez zmiany wspólnego skilla.",
        placeholder: "np. Zawsze odpowiadaj w przyjaznym, swobodnym tonie.",
      },
      memoryLimit: {
        label: "Limit pamięci (tokeny)",
        description:
          "Maksymalna łączna liczba tokenów treści pamięci dla tego slotu. Null = skill lub domyślna globalna.",
      },
      changeSkill: {
        label: "Zmień postać",
      },
      modifySkill: {
        label: "Modyfikuj postać",
      },
      response: {
        success: {
          content: "Zaktualizowano: {{value}}",
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
          description: "Musisz być zalogowany, aby zaktualizować ten ulubiony",
        },
        forbidden: {
          title: "Zabronione",
          description: "Nie masz uprawnień do aktualizacji tego ulubionego",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Ulubiony nie znaleziony",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się zaktualizować ulubionego",
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
          description: "Wystąpił konflikt podczas aktualizacji ulubionego",
        },
      },
      slotOverride: {
        label: "Nadpisanie dla tego slotu",
      },
      globalDefault: {
        label: "Mój domyślny (zapasowy)",
      },
      success: {
        title: "Sukces",
        description: "Ulubiony zaktualizowany pomyślnie",
      },
    },
    delete: {
      title: "Usuń ulubiony",
      description: "Usuń ulubioną konfigurację",
      container: {
        title: "Usuń ulubiony",
        description: "Trwale usuń tę ulubioną konfigurację",
      },
      backButton: {
        label: "Anuluj",
      },
      actions: {
        delete: "Usuń ulubiony",
        deleting: "Usuwanie ulubionego...",
      },
      id: {
        label: "ID ulubionego",
        description: "Slug lub przyjazne ID ulubionego do usunięcia",
      },
      response: {
        success: {
          content: "Usunięto: {{value}}",
        },
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe ID ulubionego",
        },
        network: {
          title: "Błąd sieci",
          description: "Nie można połączyć się z serwerem",
        },
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Musisz być zalogowany, aby usunąć ten ulubiony",
        },
        forbidden: {
          title: "Zabronione",
          description: "Nie masz uprawnień do usunięcia tego ulubionego",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Ulubiony nie znaleziony",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się usunąć ulubionego",
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
          description: "Nie można usunąć ulubionego z powodu konfliktu",
        },
      },
      success: {
        title: "Sukces",
        description: "Ulubiony usunięty pomyślnie",
      },
    },
  },
  category: "Chat",
  tags: {
    favorites: "Ulubione",
  },
  active: "Aktywny",
  fallbacks: {
    unknownSkill: "Nieznana postać",
    unknownModel: "Nieznany model",
    unknown: "Nieznany",
    unknownProvider: "nieznany",
    noTagline: "",
    noDescription: "",
    zeroCredits: "0 kredytów",
    noModelConfiguration: "Błąd: Brak konfiguracji modelu",
    configurationMissing: "Brak konfiguracji",
    noModel: "Brak modelu",
    dash: "—",
  },
  enums: {
    selectionType: {
      characterBased: "Na podstawie postaci",
      manual: "Konkretny model",
      filters: "Kryteria filtrowania",
    },
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
  },
  modelSelection: {
    sort: {
      intelligence: "Sortuj według poziomu inteligencji",
      price: "Sortuj według ceny",
      content: "Sortuj według polityki treści",
    },
    sortDirection: {
      asc: "Od niskiego do wysokiego",
      desc: "Od wysokiego do niskiego",
    },
    sortField: {
      intelligence: "Inteligencja",
      price: "Cena",
      content: "Treść",
    },
  },
  get: {
    title: "Pobierz ulubione",
    titleShort: "Ulubione",
    description: "Pobierz wszystkie zapisane ulubione konfiguracje postaci",
    userId: {
      label: "ID użytkownika",
      description:
        "Tylko dla adminów: pobierz ulubione określonego użytkownika. Pozostaw puste, aby pobrać własne ulubione.",
    },
    fields: {
      query: {
        label: "Szukaj",
        description:
          "Szukaj ulubionych po nazwie, tagline lub ID umiejętności.",
      },
      page: {
        label: "Strona",
        description:
          "Numer strony dla paginowanych wyników (AI/MCP: domyślny rozmiar strony 25).",
      },
      pageSize: {
        label: "Rozmiar strony",
        description:
          "Liczba ulubionych na stronie (1–500). Wywołujący AI/MCP domyślnie 25; ludzie otrzymują wszystkie.",
      },
    },
    addVariant: "Dodaj wariant",
    deleteGroup: {
      trigger: "Usuń wszystkie warianty",
      confirm: "Usunąć wszystkie {{count}} warianty?",
      cancel: "Anuluj",
      action: "Usuń wszystkie",
    },
    emptyState: "Nie dodałeś jeszcze żadnych ulubionych",
    tabs: {
      myFavorites: "Moje ulubione",
      browseSkills: "Przeglądaj umiejętności",
    },
    sections: {
      companion: "Towarzysze",
      skills: "Umiejętności",
      model: "Bezpośrednie modele",
      background: "Agenci w tle",
    },
    container: {
      title: "Twoje ulubione",
      description: "Zarządzaj ulubionymi konfiguracjami postaci i modeli",
    },
    createButton: {
      label: "Odkryj postacie",
    },
    response: {
      favorite: {
        title: "Ulubiona konfiguracja",
        id: {
          content: "ID: {{value}}",
        },
        skillId: {
          content: "Postać: {{value}}",
        },
        customVariantName: {
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
        modelSelection: {
          title: "Wybór modelu",
        },
        selectionType: {
          content: "Typ wyboru: {{value}}",
        },
        minIntelligence: {
          content: "Min. inteligencja: {{value}}",
        },
        maxIntelligence: {
          content: "Maks. inteligencja: {{value}}",
        },
        minPrice: {
          content: "Minimalna cena: {{value}}",
        },
        maxPrice: {
          content: "Maksymalna cena: {{value}}",
        },
        minContent: {
          content: "Min. poziom treści: {{value}}",
        },
        maxContent: {
          content: "Maks. poziom treści: {{value}}",
        },
        content: {
          content: "Poziom treści: {{value}}",
        },
        preferredStrengths: {
          content: "Preferowane mocne strony: {{value}}",
        },
        ignoredWeaknesses: {
          content: "Ignorowane słabe strony: {{value}}",
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
        separator: {
          content: "•",
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
    backButton: {
      label: "Anuluj",
    },
    useWithoutSavingButton: {
      label: "Użyj bez dodawania do ulubionych",
      loadingText: "Stosowanie...",
    },
    submitButton: {
      label: "Dodaj do ulubionych",
      loadingText: "Dodawanie...",
    },
    skillId: {
      label: "Postać",
      description: "Wybierz postać dla tego ulubionego",
    },
    customVariantName: {
      label: "Nazwa wariantu",
      description:
        "Własna nazwa dla tego wariantu (pozostaw puste, aby użyć domyślnej)",
    },
    customIcon: {
      label: "Ikona niestandardowa",
      description: "Opcjonalna ikona niestandardowa dla tego ulubionego",
    },
    voice: {
      label: "Głos",
      description: "Preferencje głosu text-to-speech",
    },
    mode: {
      label: "Tryb wyboru",
      description: "Sposób wyboru modelu",
    },
    modelSelection: {
      title: "Wybór modelu",
      description:
        "Wybierz sposób wyboru modelu AI - wybierz konkretny model lub pozwól systemowi wybrać na podstawie filtrów",
    },
    selectionType: {
      label: "Typ wyboru",
      manual: "Konkretny model",
      filters: "Kryteria filtrowania",
    },
    intelligence: {
      label: "Poziom inteligencji",
      description: "Minimalny wymagany poziom inteligencji",
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
      description: "Minimalny koszt kredytów na wiadomość",
    },
    maxPrice: {
      label: "Maksymalna cena",
      description: "Maksymalny poziom cenowy",
    },
    minContent: {
      label: "Minimalny poziom treści",
      description: "Minimalny poziom moderacji treści dla modelu",
    },
    maxContent: {
      label: "Maksymalny poziom treści",
      description: "Maksymalny poziom moderacji treści dla modelu",
    },
    content: {
      label: "Poziom treści",
      description: "Poziom moderacji treści",
    },
    preferredStrengths: {
      label: "Preferowane mocne strony",
      description: "Możliwości i mocne strony modelu do preferowania",
    },
    ignoredWeaknesses: {
      label: "Ignorowane słabe strony",
      description: "Słabe strony modelu do ignorowania lub akceptowania",
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
  reorder: {
    post: {
      title: "Zmień kolejność ulubionych",
      description: "Zaktualizuj kolejność swoich ulubionych konfiguracji",
      errors: {
        validation: {
          title: "Nieprawidłowa kolejność",
          description: "Sprawdź ustawienia i spróbuj ponownie",
        },
        network: {
          title: "Błąd połączenia",
          description:
            "Nie udało się zapisać nowej kolejności. Spróbuj ponownie",
        },
        unauthorized: {
          title: "Wymagane logowanie",
          description: "Zaloguj się, aby zmienić kolejność ulubionych",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Nie masz uprawnień do zmiany kolejności ulubionych",
        },
        notFound: {
          title: "Nie znaleziono ulubionych",
          description: "Nie mogliśmy znaleźć Twoich ulubionych",
        },
        server: {
          title: "Coś poszło nie tak",
          description:
            "Nie udało się zapisać nowej kolejności. Spróbuj ponownie",
        },
        unknown: {
          title: "Nieoczekiwany błąd",
          description: "Coś nieoczekiwanego się wydarzyło. Spróbuj ponownie",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Twoje zmiany nie zostały jeszcze zapisane",
        },
        conflict: {
          title: "Konflikt kolejności",
          description:
            "Kolejność się zmieniła. Odśwież stronę i spróbuj ponownie",
        },
      },
      success: {
        title: "Kolejność zapisana",
        description: "Twoje ulubione zostały pomyślnie uporządkowane",
      },
    },
  },
};
