import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Pobierz Statystyki E-maili",
    description: "Pobierz kompleksowe statystyki i metryki e-maili",
    form: {
      title: "Żądanie Statystyk E-maili",
      description: "Parametry dla zapytania o statystyki e-maili",
    },
    startDate: {
      label: "Data Początkowa",
      description: "Data początkowa dla okresu statystyk",
    },
    endDate: {
      label: "Data Końcowa",
      description: "Data końcowa dla okresu statystyk",
    },
    accountId: {
      label: "ID Konta",
      description: "Filtruj statystyki według konkretnego konta",
    },
    type: {
      label: "Typ E-maila",
      description: "Filtruj według typu e-maila",
      options: {
        all: "Wszystkie",
        sent: "Wysłane",
        received: "Odebrane",
        draft: "Szkic",
        trash: "Kosz",
      },
    },
    groupBy: {
      label: "Grupuj Według",
      description: "Jak grupować statystyki",
      options: {
        day: "Według Dnia",
        week: "Według Tygodnia",
        month: "Według Miesiąca",
        account: "Według Konta",
        type: "Według Typu",
      },
    },
    includeDetails: {
      label: "Uwzględnij Szczegóły",
      description: "Uwzględnij szczegółowy podział w wynikach",
    },
    status: {
      label: "Status E-maila",
      description: "Filtruj według statusu e-maila",
    },
    search: {
      label: "Szukaj",
      description: "Szukaj e-maili według tematu lub odbiorcy",
    },
    response: {
      title: "Odpowiedź Statystyk E-maili",
      description: "Kompleksowe dane statystyk i metryk e-maili",
      totalEmails: "Łączna Liczba E-maili",
      sentEmails: "Wysłane E-maile",
      deliveredEmails: "Dostarczone E-maile",
      openedEmails: "Otwarte E-maile",
      clickedEmails: "Kliknięte E-maile",
      bouncedEmails: "Odrzucone E-maile",
      failedEmails: "Nieudane E-maile",
      openRate: "Wskaźnik Otwarć",
      clickRate: "Wskaźnik Kliknięć",
      deliveryRate: "Wskaźnik Dostaw",
    },
    errors: {
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Wymagana autoryzacja do dostępu do statystyk e-maili",
      },
      validation: {
        title: "Błąd Walidacji",
        description: "Podano nieprawidłowe parametry żądania",
      },
      server: {
        title: "Błąd Serwera",
        description: "Wewnętrzny błąd serwera podczas pobierania statystyk",
      },
      unknown: {
        title: "Nieznany Błąd",
        description: "Wystąpił nieznany błąd",
      },
      network: {
        title: "Błąd Sieci",
        description: "Błąd sieci podczas pobierania statystyk",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp do statystyk e-maili jest zabroniony",
      },
      notFound: {
        title: "Nie Znaleziono",
        description: "Statystyki e-maili nie zostały znalezione",
      },
      unsavedChanges: {
        title: "Niezapisane Zmiany",
        description: "Są niezapisane zmiany, które muszą być najpierw zapisane",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych podczas pobierania statystyk",
      },
    },
    success: {
      title: "Sukces",
      description: "Statystyki e-maili pobrano pomyślnie",
    },
  },
};
