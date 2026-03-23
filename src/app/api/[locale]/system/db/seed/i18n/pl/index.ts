import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Operacje bazodanowe",

  tag: "seed",
  post: {
    title: "Zasiew bazy danych",
    description: "Wypełnij bazę danych danymi",
    form: {
      title: "Konfiguracja zasiewu",
      description: "Skonfiguruj parametry zasiewu",
    },
    response: {
      title: "Odpowiedź zasiewu",
      description: "Wyniki operacji zasiewu bazy danych",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja do zasiewu bazy danych",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Podano nieprawidłowe parametry zasiewu",
      },
      server: {
        title: "Błąd serwera",
        description: "Wewnętrzny błąd serwera podczas zasiewu",
      },
      internal: {
        title: "Błąd wewnętrzny",
        description: "Operacja zasiewu bazy danych nie powiodła się",
      },
      database: {
        title: "Błąd bazy danych",
        description: "Wystąpił błąd bazy danych podczas zasiewu",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd podczas zasiewu",
      },
      network: {
        title: "Błąd sieci",
        description: "Błąd sieci podczas zasiewu",
      },
      forbidden: {
        title: "Zabronione",
        description: "Niewystarczające uprawnienia do zasiewu bazy danych",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasoby zasiewu nie zostały znalezione",
      },
      conflict: {
        title: "Konflikt",
        description: "Wykryto konflikt danych podczas zasiewu",
      },
    },
    success: {
      title: "Baza danych zasilona",
      description: "Zasiew bazy danych zakończony pomyślnie",
    },
  },
  fields: {
    environment: {
      title: "Środowisko",
      description: "Docelowe środowisko zasiewu (dev, test, prod)",
    },
    success: {
      title: "Status sukcesu",
    },
    seedsExecuted: {
      title: "Wykonane seedy",
    },
    collections: {
      title: "Kolekcje seedów",
      item: {
        title: "Kolekcja",
      },
      name: {
        title: "Nazwa kolekcji",
      },
      status: {
        title: "Status",
      },
      recordsCreated: {
        title: "Utworzone rekordy",
      },
    },
    totalRecords: {
      title: "Wszystkie rekordy",
    },
    duration: {
      title: "Czas trwania (ms)",
    },
  },
};
