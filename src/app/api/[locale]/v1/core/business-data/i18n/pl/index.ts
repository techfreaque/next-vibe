import { translations as audienceTranslations } from "../../audience/i18n/pl";
import { translations as brandTranslations } from "../../brand/i18n/pl";
import { translations as businessInfoTranslations } from "../../business-info/i18n/pl";
import { translations as challengesTranslations } from "../../challenges/i18n/pl";
import { translations as competitorsTranslations } from "../../competitors/i18n/pl";
import { translations as goalsTranslations } from "../../goals/i18n/pl";
import { translations as profileTranslations } from "../../profile/i18n/pl";
import { translations as socialTranslations } from "../../social/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Main business data aggregation endpoint
  category: "Dane Biznesowe",
  tags: {
    businessData: "Dane Biznesowe",
    aggregation: "Agregacja",
  },
  get: {
    title: "Pobierz Wszystkie Dane Biznesowe",
    description: "Pobierz kompleksowy status kompletności danych biznesowych",
    form: {
      title: "Przegląd Danych Biznesowych",
      description:
        "Zobacz status kompletności dla wszystkich sekcji danych biznesowych",
    },
    response: {
      title: "Status Danych Biznesowych",
      description:
        "Status kompletności dla wszystkich sekcji danych biznesowych",
      completionStatus: {
        title: "Ogólny Status Kompletności",
        description:
          "Status kompletności dla wszystkich sekcji danych biznesowych",
        audience: {
          title: "Sekcja Odbiorców",
          description: "Status kompletności informacji o odbiorcach",
          isComplete: "Sekcja odbiorców ukończona",
          completedFields: "Ukończone pola odbiorców",
          totalFields: "Całkowite pola odbiorców",
          completionPercentage: "Procent kompletności odbiorców",
          missingRequiredFields: "Brakujące wymagane pola odbiorców",
        },
        brand: {
          title: "Sekcja Marki",
          description: "Status kompletności informacji o marce",
          isComplete: "Sekcja marki ukończona",
          completedFields: "Ukończone pola marki",
          totalFields: "Całkowite pola marki",
          completionPercentage: "Procent kompletności marki",
          missingRequiredFields: "Brakujące wymagane pola marki",
        },
        businessInfo: {
          title: "Sekcja Informacji Biznesowych",
          description: "Status kompletności informacji biznesowych",
          isComplete: "Sekcja informacji biznesowych ukończona",
          completedFields: "Ukończone pola informacji biznesowych",
          totalFields: "Całkowite pola informacji biznesowych",
          completionPercentage: "Procent kompletności informacji biznesowych",
          missingRequiredFields:
            "Brakujące wymagane pola informacji biznesowych",
        },
        challenges: {
          title: "Sekcja Wyzwań",
          description: "Status kompletności wyzwań biznesowych",
          isComplete: "Sekcja wyzwań ukończona",
          completedFields: "Ukończone pola wyzwań",
          totalFields: "Całkowite pola wyzwań",
          completionPercentage: "Procent kompletności wyzwań",
          missingRequiredFields: "Brakujące wymagane pola wyzwań",
        },
        competitors: {
          title: "Sekcja Konkurentów",
          description: "Status kompletności informacji o konkurentach",
          isComplete: "Sekcja konkurentów ukończona",
          completedFields: "Ukończone pola konkurentów",
          totalFields: "Całkowite pola konkurentów",
          completionPercentage: "Procent kompletności konkurentów",
          missingRequiredFields: "Brakujące wymagane pola konkurentów",
        },
        goals: {
          title: "Sekcja Celów",
          description: "Status kompletności celów biznesowych",
          isComplete: "Sekcja celów ukończona",
          completedFields: "Ukończone pola celów",
          totalFields: "Całkowite pola celów",
          completionPercentage: "Procent kompletności celów",
          missingRequiredFields: "Brakujące wymagane pola celów",
        },
        profile: {
          title: "Sekcja Profilu",
          description: "Status kompletności profilu biznesowego",
          isComplete: "Sekcja profilu ukończona",
          completedFields: "Ukończone pola profilu",
          totalFields: "Całkowite pola profilu",
          completionPercentage: "Procent kompletności profilu",
          missingRequiredFields: "Brakujące wymagane pola profilu",
        },
        social: {
          title: "Sekcja Mediów Społecznościowych",
          description: "Status kompletności danych mediów społecznościowych",
          isComplete: "Sekcja mediów społecznościowych ukończona",
          completedFields: "Ukończone pola mediów społecznościowych",
          totalFields: "Całkowite pola mediów społecznościowych",
          completionPercentage: "Procent kompletności mediów społecznościowych",
          missingRequiredFields:
            "Brakujące wymagane pola mediów społecznościowych",
        },
        overall: {
          title: "Status Ogólny",
          description: "Ogólny status kompletności danych biznesowych",
          isComplete: "Wszystkie sekcje ukończone",
          completedSections: "Ukończone sekcje",
          totalSections: "Całkowite sekcje",
          completionPercentage: "Ogólny procent kompletności",
        },
      },
    },
  },
  errors: {
    validation: {
      title: "Nieprawidłowe Żądanie",
      description: "Żądanie danych biznesowych nie mogło zostać zweryfikowane",
    },
    unauthorized: {
      title: "Nieautoryzowany Dostęp",
      description: "Nie masz uprawnień do dostępu do danych biznesowych",
    },
    server: {
      title: "Błąd Serwera",
      description: "Wystąpił błąd podczas pobierania danych biznesowych",
    },
    unknown: {
      title: "Nieznany Błąd",
      description: "Wystąpił nieoczekiwany błąd",
    },
    network: {
      title: "Błąd Sieci",
      description: "Nie można połączyć się z usługą danych biznesowych",
    },
    forbidden: {
      title: "Dostęp Zabroniony",
      description: "Nie masz uprawnień do dostępu do tych danych biznesowych",
    },
    notFound: {
      title: "Dane Nie Znalezione",
      description: "Żądane dane biznesowe nie zostały znalezione",
    },
    unsavedChanges: {
      title: "Niezapisane Zmiany",
      description: "Masz niezapisane zmiany w danych biznesowych",
    },
    conflict: {
      title: "Konflikt Danych",
      description: "Dane biznesowe są w konflikcie z istniejącymi informacjami",
    },
  },
  success: {
    title: "Dane Biznesowe Pobrane",
    description: "Dane biznesowe zostały pomyślnie pobrane",
  },

  // Child domain translations
  audience: audienceTranslations,
  brand: brandTranslations,
  businessData: {}, // TODO: Define business-data overview translations
  businessInfo: businessInfoTranslations,
  challenges: challengesTranslations,
  competitors: competitorsTranslations,
  goals: goalsTranslations,
  profile: profileTranslations,
  social: socialTranslations,
};
