import { translations as statusTranslations } from "../../status/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Main onboarding route translations - typed from English
  get: {
    title: "Pobierz status onboardingu",
    description: "Pobierz aktualne informacje o onboardingu użytkownika",
    form: {
      title: "Informacje o onboardingu",
      description: "Zobacz swój aktualny postęp onboardingu",
    },
    response: {
      title: "Odpowiedź onboardingu",
      description: "Aktualny status i postęp onboardingu",
      userId: {
        content: "ID użytkownika",
      },
      completedSteps: {
        content: "Ukończone kroki",
      },
      currentStep: {
        content: "Aktualny krok",
      },
      isCompleted: {
        content: "Czy ukończony",
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasób nie został znaleziony",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Istnieją niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych",
      },
    },
    success: {
      title: "Sukces",
      description: "Operacja zakończona pomyślnie",
    },
  },
  post: {
    title: "Aktualizuj onboarding",
    description: "Aktualizuj informacje o onboardingu użytkownika",
    form: {
      title: "Aktualizuj onboarding",
      description: "Zaktualizuj swój postęp onboardingu",
    },
    completedSteps: {
      label: "Ukończone kroki",
      description: "Kroki, które zostały ukończone",
      placeholder: "Wybierz ukończone kroki",
    },
    currentStep: {
      label: "Aktualny krok",
      description: "Aktualny krok w procesie onboardingu",
      placeholder: "Wybierz aktualny krok",
    },
    isCompleted: {
      label: "Czy ukończony",
      description: "Czy onboarding jest ukończony",
    },
    response: {
      title: "Odpowiedź aktualizacji",
      description: "Odpowiedź aktualizacji onboardingu",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasób nie został znaleziony",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Istnieją niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych",
      },
    },
    success: {
      title: "Sukces",
      description: "Onboarding zaktualizowany pomyślnie",
    },
  },
  put: {
    title: "Ukończ onboarding",
    description: "Ukończ proces onboardingu użytkownika",
    form: {
      title: "Ukończ onboarding",
      description: "Sfinalizuj swój postęp onboardingu",
    },
    completedSteps: {
      label: "Ukończone kroki",
      description: "Wszystkie kroki, które zostały ukończone",
      placeholder: "Wybierz ukończone kroki",
    },
    currentStep: {
      label: "Aktualny krok",
      description: "Ostatni krok w procesie onboardingu",
      placeholder: "Wybierz aktualny krok",
    },
    isCompleted: {
      label: "Czy ukończony",
      description: "Oznacz onboarding jako ukończony",
    },
    response: {
      title: "Odpowiedź ukończenia",
      description: "Odpowiedź ukończenia onboardingu",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasób nie został znaleziony",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Istnieją niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych",
      },
    },
    success: {
      title: "Sukces",
      description: "Onboarding ukończony pomyślnie",
    },
  },
  category: "Onboarding",
  tags: {
    onboarding: "onboarding",
    status: "status",
    update: "aktualizacja",
  },
  enums: {
    onboardingStatus: {
      notStarted: "Nie rozpoczęty",
      inProgress: "W trakcie",
      completed: "Ukończony",
      skipped: "Pominięty",
    },
    onboardingStep: {
      questions: "Pytania",
      pricing: "Cennik",
      consultation: "Konsultacja",
      complete: "Ukończ",
    },
    businessType: {
      startup: "Startup",
      smallBusiness: "Mała firma",
      mediumBusiness: "Średnia firma",
      enterprise: "Przedsiębiorstwo",
      agency: "Agencja",
      freelancer: "Freelancer",
      nonProfit: "Organizacja non-profit",
      other: "Inne",
    },
    goalType: {
      brandAwareness: "Świadomość marki",
      leadGeneration: "Generowanie leadów",
      customerEngagement: "Zaangażowanie klientów",
      salesGrowth: "Wzrost sprzedaży",
      contentCreation: "Tworzenie treści",
      communityBuilding: "Budowanie społeczności",
      reputationManagement: "Zarządzanie reputacją",
      analyticsInsights: "Analityki i wglądy",
    },
    completedStep: {
      businessData: "Dane biznesowe",
      planSelection: "Wybór planu",
      consultation: "Konsultacja",
    },
  },

  // Global error translations referenced in repository
  errors: {
    authenticationRequired: {
      title: "Wymagana autoryzacja",
      description: "Musisz być zalogowany, aby uzyskać dostęp do tego zasobu",
    },
    dataFetchFailed: {
      title: "Pobranie danych nie powiodło się",
      description: "Nie udało się pobrać danych onboardingu z bazy danych",
    },
    unauthorized: {
      title: "Nieuprawniony dostęp",
      description: "Nie masz uprawnień do dostępu do tego zasobu",
    },
    unexpected: {
      title: "Nieoczekiwany błąd",
      description: "Wystąpił nieoczekiwany błąd podczas przetwarzania żądania",
    },
    notFound: {
      title: "Onboarding nie znaleziony",
      description: "Nie znaleziono rekordu onboardingu dla tego użytkownika",
    },
    paymentProcessingFailed: {
      title: "Przetwarzanie płatności nie powiodło się",
      description: "Nie udało się przetworzyć płatności podczas onboardingu",
    },
    paymentUrlMissing: {
      title: "Brak URL płatności",
      description: "URL płatności nie został podany przez procesor płatności",
    },
    consultationRequestFailed: {
      title: "Żądanie konsultacji nie powiodło się",
      description:
        "Nie udało się utworzyć żądania konsultacji podczas onboardingu",
    },
  },

  // Sub-routes
  status: statusTranslations,
};
