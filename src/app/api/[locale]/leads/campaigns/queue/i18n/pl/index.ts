import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Kolejka kampanii",
  description: "Leady aktualnie aktywne w kampaniach e-mail",
  get: {
    title: "Kolejka kampanii",
    description:
      "Wyświetl paginowaną listę leadów aktualnie w kampaniach e-mail",
    fields: {
      page: {
        label: "Strona",
        description: "Numer strony",
      },
      pageSize: {
        label: "Rozmiar strony",
        description: "Liczba rekordów na stronę",
      },
      campaignType: {
        label: "Typ kampanii",
        description: "Filtruj według typu kampanii",
      },
    },
    response: {
      leadId: "ID leada",
      leadEmail: "E-mail",
      businessName: "Firma",
      campaignType: "Typ kampanii",
      journeyVariant: "Wariant ścieżki",
      currentStage: "Bieżący etap",
      nextScheduledAt: "Następny e-mail",
      emailsSent: "Wysłane",
      emailsOpened: "Otwarte",
      emailsClicked: "Kliknięte",
      startedAt: "Rozpoczęto",
      total: "Łącznie",
      page: "Strona",
      pageSize: "Rozmiar strony",
      items: "Elementy kolejki",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Musisz być zalogowany, aby wyświetlić kolejkę kampanii",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do wyświetlania kolejki kampanii",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas pobierania kolejki kampanii",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry wejściowe",
      },
    },
    success: {
      title: "Kolejka pobrana",
      description: "Kolejka kampanii pobrana pomyślnie",
    },
  },
  widget: {
    title: "Kolejka kampanii",
    refresh: "Odśwież",
    noData: "Brak leadów aktualnie w kampaniach",
    emptyDescription:
      "Gdy leady zostaną zapisane do kampanii e-mail, pojawią się tutaj. Użyj Startera kampanii na Panelu lub skonfiguruj harmonogram w Ustawieniach.",
    empty: "Nie znaleziono leadów",
    columnEmail: "E-mail",
    columnBusiness: "Firma",
    columnType: "Typ",
    columnStage: "Etap",
    columnVariant: "Wariant",
    columnNext: "Następny e-mail",
    columnSent: "Wysłane",
    columnOpen: "Otwarte",
    columnClick: "Kliknięte",
    columnStarted: "Rozpoczęto",
    never: "—",
    pagination: "Strona {{page}} z {{totalPages}} · {{total}} leadów",
  },
};
