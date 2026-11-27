import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  possibleDuplicateBookings:
    "Operacje mogą pokrywać się z wcześniejszym importem. Przed ponowną próbą sprawdź konto bankowe w księdze. Nie zapisano żadnych operacji.",
  privacyBeforeImport:
    "Ustaw zasady prywatności przed podglądem lub importem operacji.",
  previewResult: "Wynik podglądu",
  importResult: "Wynik importu",
  bookingDay: "Data księgowania {{date}}",
  bookingWindow: "Okres księgowania od {{from}} do {{to}}",
  providerBookings: "Sprawdzone operacje od dostawcy",
  eligibleBookings: "Dopuszczone operacje firmowe",
  savedBookings: "Zapisane operacje",
  previewPrivacyResult:
    "Odrzucone operacje nie spełniały Twoich zasad prywatności. Dopasowanie faktur następuje przy zapisie. Niejednoznaczne dopasowania pozostają otwarte.",
  importPrivacyResult:
    "Odrzucone operacje nie spełniały Twoich zasad prywatności. Niejednoznaczne dopasowania faktur pozostają otwarte.",
  setup: "Skonfiguruj import bankowy",
  setupHint:
    "Zapisz konto księgowe i datę początkową, a następnie ustaw prywatność. Konfiguracja nie odczytuje operacji.",
  privacyAction: "Ustaw prywatność",
  privacyRequired:
    "Zapisz ustawienia prywatności przed pobraniem operacji bankowych.",
  setupSaved: "Ustawienia zapisane. Możesz teraz dodać reguły dla dostawców.",
  supplierTotals: "Sumy dla dopasowanych dostawców w okresie",
  errors: {
    validation: {
      title: "Sprawdź dane",
      description:
        "Wybierz firmę i aktywne księgowe konto bankowe w jej walucie.",
    },
    network: {
      title: "Błąd połączenia",
      description: "Sprawdź połączenie i spróbuj ponownie.",
    },
    unauthorized: {
      title: "Zaloguj się",
      description: "Zaloguj się, aby uzgadniać wyciągi.",
    },
    forbidden: {
      title: "Brak dostępu",
      description: "Twoja rola w firmie nie pozwala na tę operację.",
    },
    notFound: {
      title: "Pozycja bankowa lub konto niedostępne",
      description: "Sprawdź wybraną firmę i konto bankowe.",
    },
    server: {
      title: "Operacja bankowa nie powiodła się",
      description: "Spróbuj ponownie. Po błędzie dane pozostają bez zmian.",
    },
    unknown: {
      title: "Nieoczekiwany błąd bankowy",
      description: "Spróbuj ponownie.",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Zmiany nadal znajdują się w formularzu.",
    },
    conflict: {
      title: "Konflikt uzgadniania",
      description: "Odśwież wyciąg i sprawdź wybrany zapis.",
    },
  },
  maintenance: "Obsługa połączeń bankowych",
  maintenanceHint:
    "Usuwa wygasłe dane prywatne, przypomina właścicielom o odnowieniu zgody i odświeża włączone połączenia.",
  completed: "Zaktualizowane połączenia",
  failedFeeds: "Połączenia do sprawdzenia",
  notified: "Wysłane przypomnienia",
  matchedOnly: "Zachowuj tylko transakcje zgodne z regułami dostawców",
  discardedCount: "Odrzucono",
  autoMatched: "Powiązano z fakturami",
  discardHint:
    "Niedopasowane transakcje są odrzucane bez zapisywania szczegółów. Wyłącz tę opcję, aby korzystać z prywatnej skrzynki weryfikacji.",
  company: "Firma",
  account: "Konto bankowe w księdze",
  start: "Pierwszy dzień księgowania",
  daily: "Pobieraj codziennie",
  connect: "Połącz bank",
  review: "Sprawdź transakcje",
  held: "Do sprawdzenia",
  privateCount: "Prywatne",
  connected:
    "4 z 4 · Dostęp przyznany. Wybierz rachunek do połączenia z księgami.",
  failed: "Nie udało się połączyć z bankiem. Spróbuj ponownie.",
  check: "Sprawdź aplikację",
  active: "Aplikacja ma dostęp do informacji o rachunkach.",
  inactive: "Dostęp aplikacji do informacji o rachunkach jest nieaktywny.",
  appUnavailable: "Nie można sprawdzić stanu aplikacji.",
  linking:
    "Wybierz połączenie banku i zezwól na odczyt. Przed pierwszym importem sprawdzisz reguły prywatności.",
  pick: "Wybierz rachunek, aby zobaczyć podgląd zaksięgowanych transakcji.",
  finishPeriod: "Zakończ ten okres",
  apply: "Wykonaj import",
  previewAction: "Podgląd importu",
  dailyHint:
    "Wybierz datę początkową i sprawdź dopasowania dostawców przed importem.",
  title: "Połączone rachunki bankowe",
  description:
    "Sprawdź lub zaimportuj zaksięgowane operacje z udostępnionego rachunku.",
  select: "Wybierz połączenie bankowe",
  preview: "Tylko podgląd",
  sync: "Pobierz operacje bankowe",
  connection: "Połączenie bankowe",
  consentUntil: "Zgoda ważna do",
  period: "Okres księgowania",
  imported: "Zaimportowano",
  skipped: "Już zaimportowano",
  unavailable:
    "Połączenie z bankiem jest niedostępne. Sprawdź konfigurację i uprawnienia.",
  consent: "Zgoda wygasła. Odnów ją w banku przed pobraniem operacji.",
  rateLimit: "Bank jest zajęty. Spróbuj ponownie później.",
  invalidResponse:
    "Bank zwrócił niepełny wyciąg. Zachowano poprzednią datę importu.",
  windowTooLarge: "Za dużo operacji w tym okresie. Zaimportuj krótszy wyciąg.",
  empty: "Brak połączonych rachunków",
  noBookings: "Brak księgowań w tym okresie.",
  newBookings: "Nowe operacje",
  through: "Ostatni zaimportowany dzień",
  viewTransactions: "Pokaż zaimportowane transakcje",
};
