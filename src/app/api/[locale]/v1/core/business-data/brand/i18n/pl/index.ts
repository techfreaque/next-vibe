import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Dane Biznesowe",
  tags: {
    brand: "Marka",
    businessData: "Dane Biznesowe",
    identity: "Tożsamość",
    update: "Aktualizuj",
  },
  errors: {
    failed_to_get_brand_data: "Nie udało się pobrać danych marki",
    failed_to_update_brand_data: "Nie udało się zaktualizować danych marki",
  },
  // Enum translations
  enums: {
    personality: {
      professional: "Profesjonalny",
      friendly: "Przyjazny",
      innovative: "Innowacyjny",
      trustworthy: "Godny zaufania",
      creative: "Kreatywny",
      authoritative: "Autorytatywny",
      playful: "Zabawny",
      sophisticated: "Wyrafinowany",
      approachable: "Przystępny",
      bold: "Odważny",
      caring: "Opiekuńczy",
      reliable: "Niezawodny",
    },
    voice: {
      formal: "Formalny",
      casual: "Swobodny",
      conversational: "Konwersacyjny",
      authoritative: "Autorytatywny",
      friendly: "Przyjazny",
      professional: "Profesjonalny",
      humorous: "Humorystyczny",
      inspiring: "Inspirujący",
      educational: "Edukacyjny",
      empathetic: "Empatyczny",
    },
    visualStyle: {
      modern: "Nowoczesny",
      classic: "Klasyczny",
      minimalist: "Minimalistyczny",
      bold: "Odważny",
      elegant: "Elegancki",
      playful: "Zabawny",
      corporate: "Korporacyjny",
      creative: "Kreatywny",
      luxury: "Luksusowy",
      rustic: "Rustykalny",
      tech: "Techniczny",
      artistic: "Artystyczny",
    },
    assetType: {
      logo: "Logo",
      colorPalette: "Paleta kolorów",
      typography: "Typografia",
      imagery: "Obrazy",
      icons: "Ikony",
      patterns: "Wzory",
    },
  },

  // GET endpoint translations
  get: {
    title: "Pobierz tożsamość marki",
    description: "Pobierz informacje o tożsamości marki i stylu wizualnym",
    form: {
      title: "Przegląd tożsamości marki",
      description: "Zobacz aktualną tożsamość marki i konfigurację stylu",
    },
    response: {
      title: "Dane tożsamości marki",
      description: "Aktualna tożsamość marki i status ukończenia",
      brandGuidelines: {
        title: "Wytyczne marki",
      },
      brandDescription: {
        title: "Opis marki",
      },
      brandValues: {
        title: "Wartości marki",
      },
      brandPersonality: {
        title: "Osobowość marki",
      },
      brandVoice: {
        title: "Głos marki",
      },
      brandTone: {
        title: "Ton marki",
      },
      brandColors: {
        title: "Kolory marki",
      },
      brandFonts: {
        title: "Czcionki marki",
      },
      logoDescription: {
        title: "Opis logo",
      },
      visualStyle: {
        title: "Styl wizualny",
      },
      brandPromise: {
        title: "Obietnica marki",
      },
      brandDifferentiators: {
        title: "Wyróżniki marki",
      },
      brandMission: {
        title: "Misja marki",
      },
      brandVision: {
        title: "Wizja marki",
      },
      hasStyleGuide: {
        title: "Ma przewodnik stylu",
      },
      hasLogoFiles: {
        title: "Ma pliki logo",
      },
      hasBrandAssets: {
        title: "Ma zasoby marki",
      },
      additionalNotes: {
        title: "Dodatkowe uwagi",
      },
      completionStatus: {
        title: "Status ukończenia",
        description: "Informacje o statusie ukończenia marki",
      },
    },
    errors: {
      unauthorized: {
        title: "Nieautoryzowany dostęp",
        description: "Nie masz uprawnień do dostępu do danych marki",
      },
      validation: {
        title: "Walidacja nie powiodła się",
        description: "Nieprawidłowe żądanie danych marki",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas pobierania danych marki",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z usługą marki",
      },
      forbidden: {
        title: "Dostęp zabroniony",
        description: "Nie masz uprawnień do dostępu do tych danych marki",
      },
      notFound: {
        title: "Nie znaleziono danych",
        description: "Żądane dane marki nie zostały znalezione",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt danych",
        description: "Wystąpił konflikt danych marki",
      },
    },
    success: {
      title: "Dane marki pobrane",
      description: "Dane marki zostały pobrane pomyślnie",
    },
  },

  // PUT endpoint translations
  put: {
    title: "Aktualizuj tożsamość marki",
    description: "Aktualizuj tożsamość marki, głos i styl wizualny",
    form: {
      title: "Konfiguracja tożsamości marki",
      description:
        "Zdefiniuj i zaktualizuj tożsamość swojej marki i styl wizualny",
    },
    response: {
      title: "Wyniki aktualizacji",
      description: "Wyniki aktualizacji tożsamości marki i status ukończenia",
      message: "Komunikat statusu aktualizacji",
      brandName: "Nazwa marki zaktualizowana",
      brandGuidelines: "Wytyczne marki zaktualizowane",
      brandDescription: "Opis marki zaktualizowany",
      brandValues: "Wartości marki zaktualizowane",
      brandPersonality: "Osobowość marki zaktualizowana",
      brandVoice: "Głos marki zaktualizowany",
      brandTone: "Ton marki zaktualizowany",
      brandColors: "Kolory marki zaktualizowane",
      brandFonts: "Czcionki marki zaktualizowane",
      logoDescription: "Opis logo zaktualizowany",
      visualStyle: "Styl wizualny zaktualizowany",
      brandPromise: "Obietnica marki zaktualizowana",
      brandDifferentiators: "Wyróżniki marki zaktualizowane",
      brandMission: "Misja marki zaktualizowana",
      brandVision: "Wizja marki zaktualizowana",
      hasStyleGuide: "Status przewodnika stylu zaktualizowany",
      hasLogoFiles: "Status plików logo zaktualizowany",
      hasBrandAssets: "Status zasobów marki zaktualizowany",
      additionalNotes: "Dodatkowe notatki zaktualizowane",
      colorPalette: "Paleta kolorów zaktualizowana",
      typography: "Preferencje typograficzne zaktualizowane",
      competitorBrands: "Marki konkurencyjne zaktualizowane",
      completionStatus: {
        title: "Status ukończenia zaktualizowany",
        description: "Status ukończenia marki został zaktualizowany",
        isComplete: "Sekcja marki ukończona",
        completedFields: "Ukończone pola marki",
        totalFields: "Całkowite pola marki",
        completionPercentage: "Procent ukończenia marki",
        missingRequiredFields: "Brakujące wymagane pola marki",
      },
    },
    brandName: {
      label: "Nazwa marki",
      description: "Oficjalna nazwa Twojej marki lub firmy",
      placeholder: "np. TechCorp Solutions, Green Garden Co...",
    },
    brandMission: {
      label: "Misja marki",
      description: "Deklaracja misji i podstawowy cel Twojej marki",
      placeholder:
        "np. Wzmacniać firmy poprzez innowacyjne rozwiązania technologiczne...",
    },
    brandVision: {
      label: "Wizja marki",
      description: "Długoterminowa wizja i aspiracje Twojej marki",
      placeholder:
        "np. Być wiodącym dostawcą zrównoważonych rozwiązań biznesowych...",
    },
    brandValues: {
      label: "Wartości marki",
      description: "Podstawowe wartości definiujące zasady Twojej marki",
      placeholder:
        "np. Innowacja, Uczciwość, Koncentracja na kliencie, Zrównoważony rozwój...",
    },
    brandPersonality: {
      label: "Osobowość marki",
      description:
        "Wybierz cechy osobowości, które najlepiej reprezentują Twoją markę",
      placeholder: "Wybierz cechy osobowości marki...",
    },
    brandVoice: {
      label: "Głos marki",
      description: "Ton i styl komunikacji Twojej marki",
      placeholder: "Wybierz styl głosu marki...",
    },
    visualStyle: {
      label: "Styl wizualny",
      description: "Estetyka wizualna i podejście projektowe dla Twojej marki",
      placeholder: "Wybierz preferowany styl wizualny...",
    },
    colorPalette: {
      label: "Paleta kolorów",
      description: "Kolory podstawowe reprezentujące Twoją markę",
      placeholder:
        "np. Głęboki niebieski (#003366), Jasna zieleń (#00CC66), Ciepły szary (#F5F5F5)...",
    },
    logoDescription: {
      label: "Opis logo",
      description: "Opisz swoje obecne logo lub idealną koncepcję logo",
      placeholder:
        "np. Nowoczesny geometryczny projekt z inicjałami firmy, symbol inspirowany naturą...",
    },
    typography: {
      label: "Preferencje typograficzne",
      description:
        "Style czcionek i preferencje typograficzne dla Twojej marki",
      placeholder:
        "np. Czyste czcionki bezszeryfowe, eleganckie szeryfowe do nagłówków, nowoczesne i czytelne...",
    },
    brandGuidelines: {
      label: "Wytyczne marki",
      description: "Konkretne wytyczne lub standardy prezentacji Twojej marki",
      placeholder:
        "np. Zawsze używaj logo na białym tle, zachowaj 10px odstępu wokół logo...",
    },
    competitorBrands: {
      label: "Marki konkurencyjne",
      description: "Marki, które uważasz za konkurencję lub inspirację",
      placeholder:
        "np. Apple (za prostotę), Nike (za odwagę), Patagonia (za wartości)...",
    },
    brandDifferentiators: {
      label: "Wyróżniki marki",
      description: "Co wyróżnia Twoją markę od konkurencji",
      placeholder:
        "np. Osobista obsługa klienta, zrównoważone praktyki, innowacyjna technologia...",
    },
    brandDescription: {
      label: "Opis marki",
      description: "Kompleksowy opis Twojej marki",
      placeholder: "Opisz swoją markę szczegółowo...",
    },
    brandPromise: {
      label: "Obietnica marki",
      description: "Zobowiązanie, które Twoja marka składa klientom",
      placeholder:
        "np. Obiecujemy dostarczać produkty wysokiej jakości na czas...",
    },
    additionalNotes: {
      label: "Dodatkowe notatki",
      description:
        "Wszelkie dodatkowe informacje lub preferencje związane z marką",
      placeholder: "Dodaj inne istotne informacje o marce...",
    },
    errors: {
      unauthorized: {
        title: "Nieautoryzowany dostęp",
        description: "Nie masz uprawnień do aktualizacji danych marki",
      },
      validation: {
        title: "Walidacja nie powiodła się",
        description: "Sprawdź podane informacje o marce i spróbuj ponownie",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas aktualizacji danych marki",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd podczas aktualizacji marki",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z usługą marki",
      },
      forbidden: {
        title: "Dostęp zabroniony",
        description: "Nie masz uprawnień do modyfikacji danych marki",
      },
      notFound: {
        title: "Nie znaleziono danych",
        description: "Nie można znaleźć danych marki",
      },
      conflict: {
        title: "Konflikt danych",
        description: "Dane marki są w konflikcie z istniejącymi informacjami",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany w danych marki",
      },
    },
    success: {
      title: "Marka zaktualizowana",
      description: "Tożsamość Twojej marki została zaktualizowana pomyślnie",
      message: "Tożsamość marki zaktualizowana pomyślnie",
    },
    brandTone: {
      label: "Ton marki",
      description: "Konkretny ton, którego Twoja marka używa w komunikacji",
      placeholder: "np. Profesjonalny, ale przyjazny, ciepły i przystępny...",
    },
    brandColors: {
      label: "Kolory marki",
      description: "Kolory podstawowe i dodatkowe dla Twojej marki",
      placeholder: "np. Podstawowy: #007bff, Dodatkowy: #6c757d...",
    },
    brandFonts: {
      label: "Czcionki marki",
      description: "Rodziny czcionek używane w materiałach Twojej marki",
      placeholder: "np. Nagłówki: Inter, Tekst: Roboto...",
    },
    hasStyleGuide: {
      label: "Przewodnik stylu dostępny",
      description: "Czy posiadasz udokumentowany przewodnik stylu",
    },
    hasLogoFiles: {
      label: "Pliki logo dostępne",
      description: "Czy posiadasz pliki logo w różnych formatach",
    },
    hasBrandAssets: {
      label: "Zasoby marki dostępne",
      description: "Czy posiadasz inne zasoby marki (szablony, grafiki itp.)",
    },
  },

  // Individual completion status field translations
  isComplete: "Marka ukończona",
  completedFields: "Ukończone pola marki",
  totalFields: "Całkowite pola marki",
  completionPercentage: "Procent ukończenia marki",
  missingRequiredFields: "Brakujące wymagane pola marki",
};
