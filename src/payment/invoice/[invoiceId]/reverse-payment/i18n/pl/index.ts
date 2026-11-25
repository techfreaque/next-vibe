import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Cofnij wpłatę klienta",
  description: "Podaj powód korekty. Pierwotny zapis pozostanie w dzienniku.",
  invoiceId: "Numer referencyjny faktury",
  entryId: "Numer księgowania wpłaty",
  date: "Data korekty",
  reason: "Powód korekty",
  reasonPlaceholder: "Na przykład: bank zwrócił wpłatę",
  datePlaceholder: "Dzisiaj",
  viewInvoice: "Zobacz fakturę",
  reversal: "Zapis korygujący",
  originalDate: "Data wpłaty",
  receiptAmount: "Kwota wpłaty",
  postingStatus: "Status księgowania",
  viewReversal: "Otwórz zapis odwracający",
  cancel: "Anuluj",
  confirmTitle: "Zaksięgować odwrócenie tej wpłaty?",
  confirm: "Zaksięguj odwrócenie",
  success: {
    title: "Wpłata cofnięta",
    description: "Saldo faktury uwzględnia korektę.",
  },
  invalidDate: "Podaj datę od dnia wpłaty do dzisiaj.",
  noPeriod: "Dla tej daty nie ma otwartego okresu księgowego.",
  invalidReceipt: "Tej wpłaty nie można cofnąć dla tej faktury.",
  invalidLines:
    "Zapisane pozycje wpłaty są niepełne lub dotyczą innej waluty albo firmy.",
  errors: {
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Wymagana autoryzacja",
    },
    validation: {
      title: "Błąd walidacji",
      description: "Nieprawidłowe parametry płatności",
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
      description: "Faktura nie istnieje",
    },
    conflict: {
      title: "Konflikt",
      description: "Faktura jest już opłacona lub unieważniona",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Są niezapisane zmiany",
    },
  },
  tags: { payment: "payment", invoice: "invoice" },
};
