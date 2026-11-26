import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    pos: "POS",
    order: "Zamówienie",
    refund: "Zwrot",
  },
  enums: {
    paymentMethod: {
      cash: "Gotówka",
      card: "Karta",
      transfer: "Przelew",
      other: "Inne",
    },
  },
  get: {
    title: "Zwroty sprzedaży",
    titleShort: "Zwroty",
    description: "Co sprzedano, co wróciło i co jeszcze można zwrócić.",
    orderId: {
      label: "Sprzedaż",
      description: "Zakończona sprzedaż",
    },
    response: {
      orderId: "Sprzedaż",
      orderNumber: "Numer sprzedaży",
      status: "Status",
      currency: "Waluta",
      total: "Suma sprzedaży",
      refundedTotal: "Zwrócono",
      refundableTotal: "Jeszcze do zwrotu",
      journalPosted: "Zaksięgowano",
      lines: "Pozycje",
      orderItemId: "Wiersz",
      description: "Pozycja",
      quantity: "Sprzedano",
      refundedQuantity: "Zwrócono",
      refundableQuantity: "Do zwrotu",
      unitPrice: "Cena jednostkowa",
      lineTotal: "Suma wiersza",
      taxRate: "Stawka VAT",
      refunds: "Zwroty",
      refundId: "Zwrot",
      refundNumber: "Numer zwrotu",
      method: "Zwrot przez",
      reason: "Powód",
      createdAt: "Data",
      cashSession: "Szuflada kasowa",
      sessionId: "Zmiana",
      terminalName: "Kasa",
      available: "Gotówka w szufladzie",
    },
    widget: {
      back: "Wstecz",
      startRefund: "Zwróć pozycje",
      fullyRefunded: "Wszystko z tej sprzedaży zostało zwrócone.",
      notCompleted: "Zwrot jest możliwy tylko dla zakończonych sprzedaży.",
      history: "Historia zwrotów",
      noRefunds: "Ta sprzedaż nie ma jeszcze zwrotów.",
      loading: "Wczytuję sprzedaż",
    },
    success: {
      title: "Zwroty wczytane",
      description: "Sprzedaż i historia zwrotów są aktualne.",
    },
  },
  post: {
    title: "Zwrot sprzedaży",
    titleShort: "Zwrot",
    description:
      "Oddaj pieniądze za zakończoną sprzedaż, w całości lub pozycja po pozycji. Towar wraca na półkę, a księgi nadążają.",
    orderId: {
      label: "Sprzedaż",
      description: "Zakończona sprzedaż do zwrotu",
    },
    lines: {
      label: "Pozycje do zwrotu",
      description:
        "Wiersz i ilość dla każdej pozycji. Zostaw puste, żeby zwrócić wszystko, co zostało.",
    },
    method: {
      label: "Zwrot przez",
      description:
        "Jak pieniądze wrócą do klienta. Gotówka wychodzi z otwartej szuflady kasowej.",
      placeholder: "Wybierz sposób zwrotu",
    },
    sessionId: {
      label: "Szuflada kasowa",
      description:
        "Otwarta zmiana, z której wypłacana jest gotówka. Domyślnie Twoja otwarta zmiana na kasie w walucie sprzedaży.",
    },
    reason: {
      label: "Powód",
      description: "Dlaczego pieniądze wracają. Zapisywany razem ze zwrotem.",
      placeholder: "Na przykład: zwrócono uszkodzony towar",
    },
    response: {
      refundId: "Zwrot",
      refundNumber: "Numer zwrotu",
      orderId: "Sprzedaż",
      sessionId: "Zmiana",
      method: "Zwrot przez",
      currency: "Waluta",
      subtotal: "Netto",
      taxAmount: "VAT",
      total: "Zwrócono teraz",
      refundedTotal: "Zwrócono łącznie",
      fullyRefunded: "Zwrócono w całości",
      journalEntryId: "Zapis księgowy",
      stockReturned: "Produkty wróciły na stan",
    },
    widget: {
      back: "Wróć do sprzedaży",
      items: "Co wraca",
      selectAll: "Zwróć wszystko",
      clear: "Wyczyść",
      decrease: "Jedna sztuka mniej: {{item}}",
      increase: "Jedna sztuka więcej: {{item}}",
      all: "Wszystko",
      sold: "Sprzedano {{quantity}}",
      alreadyRefunded: "Już zwrócono {{quantity}}",
      nothingLeft: "Zwrócono w całości",
      summary: "Zwrot",
      net: "Netto",
      vat: "VAT",
      total: "Suma zwrotu",
      cashFrom: "Wypłata z szuflady na kasie {{terminal}}",
      drawerAvailable: "W szufladzie: {{amount}}",
      noCashSession:
        "Otwórz zmianę na kasie w walucie {{currency}}, żeby zwrócić gotówkę.",
      drawerShort: "W szufladzie jest mniej gotówki niż potrzeba na ten zwrot.",
      confirmTitle: "Zwrócić {{amount}}?",
      confirmDescription:
        "Pieniądze wrócą przez: {{method}}. Stan magazynowy i księgi zostaną zaktualizowane. Zwrotu nie można cofnąć.",
      confirm: "Zwróć",
      cancel: "Anuluj",
      pickItems: "Wybierz co najmniej jedną pozycję.",
      reasonMissing: "Podaj powód.",
      loading: "Wczytuję sprzedaż",
      viewRefunds: "Pokaż zwroty",
      newSale: "Wróć do sprzedaży",
    },
    success: {
      title: "Zwrot gotowy",
      description: "Pieniądze są w drodze do klienta.",
    },
  },
  messages: {
    notCompleted: "Zwrot jest możliwy tylko dla zakończonych sprzedaży.",
    invalidLine: "Wybierz pozycje z tej sprzedaży z ilością większą od zera.",
    nothingLeft: "W tej sprzedaży nie ma już nic do zwrotu.",
    overRefund: "To więcej, niż sprzedano, po odjęciu wcześniejszych zwrotów.",
    rounding:
      "Ten zwrot jest zbyt mały, żeby go wypłacić. Dodaj więcej pozycji.",
    cashSessionRequired:
      "Zwrot gotówki wymaga otwartej zmiany na kasie w walucie sprzedaży.",
    sessionInvalid: "Wybierz otwartą zmianę tej firmy.",
    cashCurrencyMismatch: "Ta kasa działa w innej walucie niż sprzedaż.",
    drawerShort: "W szufladzie jest mniej gotówki niż potrzeba na ten zwrot.",
    postingUnavailable:
      "Nie udało się zaksięgować zwrotu. Sprawdź, czy okres rozliczeniowy jest otwarty.",
    stockUnavailable:
      "Nie udało się przywrócić towaru na stan. Sprawdź, czy magazyn jest aktywny.",
  },
  errors: {
    validation: {
      title: "Sprawdź zwrot",
      description: "Wybierz pozycje, sposób zwrotu i powód.",
    },
    unauthorized: {
      title: "Wymagane logowanie",
      description: "Zaloguj się, żeby zwracać sprzedaże.",
    },
    forbidden: {
      title: "Brak dostępu",
      description: "Nie możesz zwracać sprzedaży tej firmy.",
    },
    notFound: {
      title: "Nie znaleziono sprzedaży",
      description: "Ta sprzedaż nie istnieje lub należy do innej firmy.",
    },
    conflict: {
      title: "Zwrot niemożliwy",
      description: "Sprzedaż lub szuflada nie pozwalają na ten zwrot.",
    },
    server: {
      title: "Zwrot nie powiódł się",
      description: "Nic nie zostało zwrócone. Spróbuj ponownie.",
    },
    unknown: {
      title: "Zwrot nie powiódł się",
      description: "Nic nie zostało zwrócone. Spróbuj ponownie.",
    },
    network: {
      title: "Brak połączenia",
      description: "Sprawdź połączenie i spróbuj ponownie.",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Najpierw dokończ lub odrzuć swoje zmiany.",
    },
  },
};
