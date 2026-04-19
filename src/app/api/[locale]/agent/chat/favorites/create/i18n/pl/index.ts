import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    favorites: "Ulubione",
  },
  voices: {
    MALE: "Męski głos",
    FEMALE: "Damski głos",
  },

  post: {
    title: "Utwórz ulubiony",
    description: "Utwórz nową ulubioną konfigurację postaci",
    container: {
      title: "Nowy ulubiony",
      description: "Zapisz konfigurację postaci jako ulubioną",
    },
    backButton: {
      label: "Wróć do ulubionych",
    },
    submitButton: {
      label: "Utwórz ulubiony",
      loadingText: "Tworzenie...",
    },
    useWithoutSavingButton: {
      label: "Użyj bez zapisywania",
      loadingText: "Stosowanie...",
    },
    skillId: {
      label: "Postać",
      description:
        'ID umiejętności w połączonym formacie: „skillSlug" dla domyślnego wariantu, „skillSlug__variantId" dla konkretnego (np. „thea__brilliant"). Wywołaj listę umiejętności, by zobaczyć dostępne ID.',
    },
    customVariantName: {
      label: "Nazwa niestandardowa",
      description: "Opcjonalna nazwa niestandardowa dla tego ulubionego",
    },
    customIcon: {
      label: "Ikona niestandardowa",
      description: "Opcjonalna ikona niestandardowa dla tego ulubionego",
    },
    chatModel: {
      label: "Model czatu",
      placeholder: "Odziedzicz z umiejętności",
    },
    voice: {
      label: "Głos",
      description: "Preferencje głosu text-to-speech",
      placeholder: "Dziedzicz ze skilla",
    },
    sttModel: {
      label: "Model mowy na tekst",
      description: "Model do rozpoznawania mowy",
      placeholder: "Dziedzicz ze skilla",
    },
    imageVisionModel: {
      label: "Model wizji obrazu",
      description: "Model używany do analizy obrazów",
      placeholder: "Dziedzicz ze skilla",
    },
    videoVisionModel: {
      label: "Model wizji wideo",
      description: "Model używany do analizy wideo",
      placeholder: "Dziedzicz ze skilla",
    },
    audioVisionModel: {
      label: "Model wizji audio",
      description: "Model używany do analizy audio",
      placeholder: "Dziedzicz ze skilla",
    },
    imageGenModel: {
      label: "Model generowania obrazów",
      description: "Model do generowania obrazów",
      placeholder: "Dziedzicz ze skilla",
    },
    musicGenModel: {
      label: "Model generowania muzyki",
      description: "Model do generowania muzyki",
      placeholder: "Dziedzicz ze skilla",
    },
    videoGenModel: {
      label: "Model generowania wideo",
      description: "Model do generowania wideo",
      placeholder: "Dziedzicz ze skilla",
    },
    mode: {
      label: "Tryb wyboru",
      description: "Sposób wyboru modelu",
    },
    modelSelection: {
      title: "Wybór modelu",
      label: "Wybór modelu",
      description:
        "Wybierz sposób wyboru modelu AI - wybierz konkretny model lub pozwól systemowi wybrać na podstawie filtrów",
    },
    selectionType: {
      label: "Typ wyboru",
      characterBased: "W oparciu o postać",
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
    icon: {
      label: "Niestandardowa ikona",
      description: "Zastąp domyślną ikonę postaci dla tego slotu ulubionych",
    },
    compactTrigger: {
      label: "Próg kompresji (tokeny)",
      description:
        "Liczba tokenów wyzwalająca kompresję rozmowy. Null = postać lub domyślna globalna.",
    },
    availableTools: {
      label: "Dozwolone narzędzia",
      description:
        "Narzędzia dla tego slotu. Każdy wpis wymaga toolId. Null = postać lub ustawienia globalne.",
    },
    pinnedTools: {
      label: "Przypięte narzędzia",
      description:
        "Przypięte narzędzia paska narzędzi. Null = postać lub ustawienia globalne.",
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
    changeSkill: {
      label: "Zmień postać",
    },
    modifySkill: {
      label: "Modyfikuj postać",
    },
    character: {
      name: "Nazwa",
      tagline: "Slogan",
      description: "Opis",
    },
  },
};
