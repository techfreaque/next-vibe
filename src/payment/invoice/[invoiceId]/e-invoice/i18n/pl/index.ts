import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "E-faktura",
  titleShort: "E-faktura",
  description:
    "Wyeksportuj wystawioną fakturę lub fakturę korygującą jako plik Peppol BIS Billing 3.0 (UBL, EN 16931).",
  invoiceId: {
    label: "Faktura",
    description: "Wystawiona faktura lub korekta do eksportu",
  },
  buyerReference: {
    label: "Numer referencyjny nabywcy",
    description:
      "Wpisz numer podany przez nabywcę. Dla urzędu w Niemczech wpisz jego Leitweg-ID.",
  },
  response: {
    invoiceNumber: "Numer dokumentu",
    isCreditNote: "Faktura korygująca",
    fileName: "Nazwa pliku",
    ready: "Gotowe do wysyłki",
    missingFields: "Brakujące dane",
    xml: "XML",
  },
  widget: {
    peppol: "Pobierz XML Peppol",
    slovak: "Pobierz XML eFaktúra",
    xrechnung: "XML XRechnung",
    sendHint: "Wyślij pobrany plik XML przez swojego dostawcę e-fakturowania.",
    back: "Wstecz",
    submit: "Przygotuj e-fakturę",
    invoice: "Faktura {{number}}",
    creditNote: "Faktura korygująca {{number}}",
    ready: "Gotowe. Wszystkie obowiązkowe dane EN 16931 są uzupełnione.",
    missing: "Przed wysłaniem pliku proszę uzupełnić te dane:",
    download: "Pobierz XML",
    copy: "Kopiuj XML",
    copied: "Skopiowano XML",
    copyFailed: "Nie udało się skopiować XML",
    preview: "Pokaż XML",
    disclaimer: "Dostarczamy narzędzia, nie doradztwo podatkowe.",
  },
  fields: {
    bt10: "Numer referencyjny nabywcy",
    bt35: "Ulica wystawcy",
    bt37: "Miejscowość wystawcy",
    bt38: "Kod pocztowy wystawcy",
    bt42: "Telefon wystawcy",
    bt43: "E-mail wystawcy",
    bt50: "Ulica nabywcy",
    bt52: "Miejscowość nabywcy",
    bt53: "Kod pocztowy nabywcy",
    bt1: "Numer dokumentu",
    bt2: "Data wystawienia",
    bt5: "Waluta",
    bt9: "Termin płatności",
    bt27: "Nazwa Państwa firmy",
    bt31: "Numer VAT UE Państwa firmy",
    bt34: "Adres elektroniczny Państwa firmy (numer VAT, NIP lub numer rejestrowy)",
    bt40: "Kraj Państwa firmy",
    bt44: "Nazwa klienta",
    bt48: "Numer VAT UE klienta",
    bt49: "Adres elektroniczny klienta (numer VAT, NIP lub numer rejestrowy)",
    bt55: "Adres klienta z krajem",
    bt153: "Opis w każdej pozycji",
    bg25: "Co najmniej jedna pozycja",
  },
  errors: {
    validation: {
      title: "Nieprawidłowe żądanie",
      description: "Proszę sprawdzić odwołanie do faktury.",
    },
    network: {
      title: "Błąd sieci",
      description: "Nie udało się wczytać e-faktury.",
    },
    unauthorized: {
      title: "Wymagane logowanie",
      description: "Proszę się zalogować, aby eksportować e-faktury.",
    },
    forbidden: {
      title: "Brak dostępu",
      description: "Nie mają Państwo dostępu do tego dokumentu.",
    },
    notFound: {
      title: "Nie znaleziono dokumentu",
      description: "Ta faktura nie istnieje.",
    },
    server: {
      title: "Eksport nie powiódł się",
      description:
        "Nie udało się utworzyć e-faktury. Proszę spróbować ponownie.",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Coś poszło nie tak.",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Proszę najpierw zapisać zmiany.",
    },
    conflict: {
      title: "Jeszcze nie wystawiona",
      description: "Proszę wystawić fakturę przed eksportem jako e-faktura.",
    },
  },
  success: {
    title: "E-faktura gotowa",
    description: "Plik Peppol jest gotowy.",
  },
  tags: { payment: "płatność", invoice: "faktura", eInvoice: "e-faktura" },
};
