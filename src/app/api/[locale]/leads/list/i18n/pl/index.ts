import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Lista leadów",
    description: "Pobierz stronicowanychą listę leadów z filtrowaniem",
    form: {
      title: "Filtry listy leadów",
      description: "Skonfiguruj filtry dla listy leadów",
    },
    page: {
      label: "Numer strony",
      description: "Numer strony dla paginacji",
      placeholder: "Wprowadź numer strony",
    },
    limit: {
      label: "Wyniki na stronę",
      description: "Liczba wyników do pokazania na stronie",
      placeholder: "Wprowadź limit",
    },
    status: {
      label: "Status leada",
      description: "Filtruj według statusu leada",
      placeholder: "Wybierz status",
    },
    currentCampaignStage: {
      label: "Etap kampanii",
      description: "Filtruj według bieżącego etapu kampanii",
      placeholder: "Wybierz etap kampanii",
    },
    source: {
      label: "Źródło leada",
      description: "Filtruj według źródła leada",
      placeholder: "Wybierz źródło",
    },
    country: {
      label: "Kraj",
      description: "Filtruj według kraju",
      placeholder: "Wybierz kraje",
    },
    language: {
      label: "Język",
      description: "Filtruj według języka",
      placeholder: "Wybierz języki",
    },
    search: {
      label: "Szukaj",
      description: "Szukaj leadów według nazwy, e-maila lub firmy",
      placeholder: "Wprowadź frazę wyszukiwania",
    },
    searchPagination: {
      title: "Wyszukiwanie i paginacja",
      description: "Kontrolki wyszukiwania i paginacji",
    },
    statusFilters: {
      title: "Filtry statusu i kampanii",
      description: "Filtruj według statusu, etapu kampanii i źródła",
    },
    locationFilters: {
      title: "Filtry lokalizacji",
      description: "Filtruj według kraju i języka",
    },
    sortingOptions: {
      title: "Opcje sortowania",
      description: "Skonfiguruj sortowanie wyników",
    },
    sortBy: {
      label: "Sortuj według",
      description: "Pole do sortowania wyników",
      placeholder: "Wybierz pole sortowania",
    },
    sortOrder: {
      label: "Kolejność sortowania",
      description: "Kolejność sortowania dla wyników",
      placeholder: "Wybierz kolejność sortowania",
    },
    response: {
      title: "Odpowiedź listy leadów",
      description: "Stronicowana lista leadów z metadanymi",
      leads: {
        title: "Szczegóły leada",
        description: "Informacje o pojedynczym leadzie",
        id: "ID leada",
        email: "Adres e-mail",
        businessName: "Nazwa firmy",
        contactName: "Imię kontaktu",
        phone: "Numer telefonu",
        website: "Strona internetowa",
        country: "Kraj",
        language: "Język",
        status: "Status",
        source: "Źródło",
        notes: "Notatki",
        convertedUserId: "ID przekonwertowanego użytkownika",
        convertedAt: "Data konwersji",
        signedUpAt: "Data rejestracji",
        consultationBookedAt: "Data rezerwacji konsultacji",
        subscriptionConfirmedAt: "Data potwierdzenia subskrypcji",
        currentCampaignStage: "Bieżący etap kampanii",
        emailsSent: "Wysłane e-maile",
        lastEmailSentAt: "Ostatni e-mail wysłany",
        unsubscribedAt: "Data wypisania",
        emailsOpened: "Otwarte e-maile",
        emailsClicked: "Kliknięte e-maile",
        lastEngagementAt: "Ostatnie zaangażowanie",
        metadata: "Metadane",
        createdAt: "Data utworzenia",
        updatedAt: "Data aktualizacji",
      },
      total: "Łącznie leadów",
      page: "Bieżąca strona",
      limit: "Rozmiar strony",
      totalPages: "Łącznie stron",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Autoryzacja wymagana do wylistowania leadów",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry filtrów",
      },
      server: {
        title: "Błąd serwera",
        description:
          "Wystąpił wewnętrzny błąd serwera podczas pobierania leadów",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd podczas pobierania leadów",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci podczas pobierania leadów",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony dla listy leadów",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Leady nie zostali znalezieni",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych podczas pobierania leadów",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Są niezapisane zmiany w liście leadów",
      },
    },
    success: {
      title: "Sukces",
      description: "Lista leadów pobrana pomyślnie",
    },
  },
};
