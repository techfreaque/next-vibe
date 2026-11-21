import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    payment: "płatność",
    dashboard: "pulpit",
  },
  get: {
    title: "Pulpit płatności",
    titleShort: "Pulpit płatności",
    description: "Przegląd faktur, rachunków i aktywności płatniczej",
    form: {
      title: "Pulpit",
      description: "Przegląd płatności dla Twojej firmy",
    },
    response: {
      estimates: "Oferty",
      byCurrency: "Sumy według waluty",
      openInvoices: "Otwarte faktury",
      overdueInvoices: "Przeterminowane",
      unpaidBills: "Nieopłacone rachunki",
      draftInvoices: "Szkice",
      currency: "Waluta",
      recentInvoices: "Ostatnie faktury",
      openCount: "Liczba otwartych",
      openTotal: "Suma otwartych",
      overdueCount: "Liczba przeterminowanych",
      overdueTotal: "Suma przeterminowanych",
      unpaidCount: "Liczba nieopłaconych",
      unpaidTotal: "Suma nieopłaconych",
      draftCount: "Liczba szkiców",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      network: {
        title: "Błąd sieci",
        description: "Błąd połączenia sieciowego",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja",
      },
      forbidden: {
        title: "Zabronione",
        description: "Musisz być członkiem tej firmy",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Firma nie została znaleziona",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd wewnętrzny serwera",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Są niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt",
      },
    },
    success: {
      title: "Sukces",
      description: "Dane pulpitu załadowane",
    },
  },
  companyId: {
    label: "ID firmy",
    description: "Firma do wyświetlenia danych pulpitu",
    placeholder: "Wprowadź ID firmy",
  },
  widget: {
    subtitle:
      "Faktury, oferty i rachunki wystawiane przez Ciebie. Płatności kartą i krypto są w transakcjach płatności.",
    estimatesSent: "Wysłane oferty",
    estimateDrafts: "Szkice: {{count}}",
    recentEstimates: "Ostatnie oferty",
    noRecentEstimates: "Brak ofert",
    validUntil: "Ważna do {{date}}",
    notInvoicesHint:
      "Płatności kartą i kryptowalutą to transakcje operatora, nie faktury. Tutaj są tylko faktury wystawione przez Ciebie.",
    openTransactions: "Otwórz transakcje płatności",
    commercialDocuments: "Dokumenty handlowe",
    processorDiagnostics: "Transakcje płatności",
    loading: "Ładowanie pulpitu...",
    noData: "Nie wybrano firmy.",
    noDataHint: "Wybierz firmę, aby zobaczyć przegląd płatności.",
    openInvoices: "Otwarte faktury",
    overdue: "Przeterminowane",
    unpaidBills: "Nieopłacone rachunki",
    draftInvoices: "Szkice faktur",
    quickActions: "Szybkie akcje",
    newInvoice: "Nowa faktura",
    allInvoices: "Wszystkie faktury",
    newEstimate: "Nowa oferta",
    allEstimates: "Oferty",
    allBills: "Rachunki",
    recentInvoices: "Ostatnie faktury",
    noRecentInvoices: "Nie wystawiono jeszcze faktur",
    view: "Otwórz",
    due: "Termin",
    status: {
      draft: "Szkic",
      open: "Otwarta",
      paid: "Opłacona",
      void: "Nieważna",
      uncollectible: "Nieściągalna",
    },
  },
};
