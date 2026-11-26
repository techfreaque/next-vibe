import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    pos: "Kasa",
    order: "Sprzedaż",
    removePayment: "Usuń płatność",
  },
  enums: {
    paymentMethod: {
      cash: "Gotówka",
      card: "Karta",
      transfer: "Przelew",
      other: "Inne",
    },
  },
  post: {
    title: "Usuń płatność",
    titleShort: "Usuń płatność",
    description:
      "Cofnij płatność z otwartej sprzedaży. Przydaje się, gdy płatność wbito przez pomyłkę.",
    orderId: {
      label: "Sprzedaż",
      description: "Otwarta sprzedaż z tą płatnością",
    },
    paymentId: {
      label: "Płatność",
      description: "Płatność do usunięcia ze sprzedaży",
    },
    response: {
      orderId: "Sprzedaż",
      paymentId: "Usunięta płatność",
      sessionId: "Zmiana kasowa",
      currency: "Waluta",
      totalPaid: "Zapłacono dotąd",
      outstanding: "Pozostało do zapłaty",
      remainingPayments: "Pozostałe płatności",
    },
    widget: {
      back: "Wróć do sprzedaży",
      pickPayment: "Wybierz płatność do usunięcia",
      noPayments: "Ta sprzedaż nie ma płatności do usunięcia.",
      notOpen: "Płatności można usuwać tylko z otwartej sprzedaży.",
      loading: "Ładowanie sprzedaży",
      change: "Reszta {{amount}}",
      selected: "Wybrana",
      amount: "Kwota",
      confirmTitle: "Usunąć tę płatność?",
      confirmDescription:
        "Sprzedaż zostaje otwarta. Potem przyjmij właściwą płatność.",
      confirm: "Usuń płatność",
      cancel: "Anuluj",
      stillDue: "Pozostało do zapłaty",
      paidSoFar: "Zapłacono dotąd",
      nothingPaid: "Na tej sprzedaży nie ma już płatności.",
    },
    success: {
      title: "Płatność usunięta",
      description: "Sprzedaż czeka na nową płatność.",
    },
  },
  errors: {
    validation: {
      title: "Sprawdź płatność",
      description: "Wybierz płatność z tej sprzedaży.",
    },
    unauthorized: {
      title: "Wymagane logowanie",
      description: "Zaloguj się, aby zmieniać sprzedaż.",
    },
    forbidden: {
      title: "Brak dostępu",
      description: "Nie możesz zmieniać sprzedaży tej firmy.",
    },
    notFound: {
      title: "Nie znaleziono płatności",
      description: "Tej płatności nie ma już na sprzedaży.",
    },
    conflict: {
      title: "Sprzedaż nie jest otwarta",
      description:
        "Płatność można usunąć tylko wtedy, gdy sprzedaż i zmiana kasowa są otwarte.",
    },
    server: {
      title: "Nie usunięto płatności",
      description: "Coś poszło nie tak. Spróbuj ponownie.",
    },
    unknown: {
      title: "Nie usunięto płatności",
      description: "Coś poszło nie tak. Spróbuj ponownie.",
    },
    network: {
      title: "Brak połączenia",
      description: "Sprawdź połączenie i spróbuj ponownie.",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Najpierw zakończ albo odrzuć zmiany.",
    },
  },
};
