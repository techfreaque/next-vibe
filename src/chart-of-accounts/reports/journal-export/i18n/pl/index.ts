import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Eksport dziennika do CSV",
  description:
    "Pobierz zaksięgowane pozycje dziennika wraz z korektami dla jednej firmy i waluty.",
  company: "Firma",
  currency: "Waluta",
  currencyHint: "Wpisz trzyliterowy kod waluty, np. EUR.",
  otherCurrency: "Inna waluta",
  debitCount: "Pozycje Wn",
  creditCount: "Pozycje Ma",
  invalidLine: "Zapisana pozycja ma nieprawidłową stronę Wn lub Ma.",
  from: "Od",
  to: "Do",
  prepare: "Przygotuj CSV",
  preparing: "Przygotowywanie CSV…",
  download: "Pobierz CSV",
  copy: "Kopiuj CSV",
  copied: "Skopiowano CSV",
  copyFailed: "Nie udało się skopiować CSV. Spróbuj ponownie.",
  filename: "Nazwa pliku",
  rowCount: "Pozycje dziennika",
  invalidDates:
    "Wybierz poprawny zakres. Data końcowa nie może być wcześniejsza niż data początkowa.",
  tooLarge:
    "Eksport przekracza 10 000 pozycji lub 5 MiB. Wybierz krótszy zakres dat.",
  ready: "CSV gotowy",
  headerEntry: "Numer zapisu",
  headerDate: "Data księgowania",
  headerPosted: "Czas księgowania (UTC)",
  headerSource: "Źródło",
  headerAccountCode: "Numer konta",
  headerAccountName: "Nazwa konta",
  headerDescription: "Opis zapisu",
  headerLineDescription: "Opis pozycji",
  headerCurrency: "Waluta",
  headerDebit: "Wn",
  headerCredit: "Ma",
  errors: {
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Wymagane logowanie",
    },
    validation: {
      title: "Błąd walidacji",
      description: "Sprawdź wszystkie pola",
    },
    forbidden: {
      title: "Odmowa dostępu",
      description: "Niewystarczające uprawnienia",
    },
    server: {
      title: "Błąd serwera",
      description: "Operacja nie powiodła się. Spróbuj ponownie.",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieoczekiwany błąd",
    },
    conflict: { title: "Konflikt", description: "Konflikt danych" },
    network: {
      title: "Błąd sieci",
      description: "Nie można połączyć się z serwerem",
    },
    notFound: { title: "Nie znaleziono", description: "Zasób nie istnieje" },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany",
    },
  },
  tags: { journal: "journal", export: "export" },
};
