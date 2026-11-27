import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Połącz bank",
  description:
    "Zezwól na odczyt danych. Po powrocie wybierzesz transakcje firmowe i sprawdzisz podgląd importu.",
  company: "Firma",
  ledgerAccount: "Konto bankowe w księdze",
  bankCountry: "Kraj banku",
  bankName: "Nazwa banku",
  psu: "Typ logowania do banku",
  personal: "Prywatne konto bankowe",
  business: "Firmowe",
  start: "Rozpocznij autoryzację banku",
  ready: "Autoryzacja jest gotowa",
  continueDescription:
    "Przed kontynuowaniem sprawdź wybrany bank i konto księgowe.",
  starting: "Uruchamianie autoryzacji…",
  authorize: "Przejdź do banku",
  unavailable:
    "Nie udało się rozpocząć autoryzacji. Sprawdź wybór banku i spróbuj ponownie.",
  forbidden: "Nie masz dostępu do tej firmy i tego konta bankowego.",
  invalidAccount: "Zgoda bankowa jest niedostępna lub wygasła.",
  expiryTitle: "Zgoda bankowa wkrótce wygaśnie",
  bankStep: "1 z 4 · Wybierz bank",
  ledgerStep: "2 z 4 · Wybierz konto księgowe",
  authorizeStep: "3 z 4 · Zezwól na odczyt",
  next: "Wybierz konto księgowe",
  back: "Wróć do wyboru banku",
  createAccount: "Dodaj konto bankowe do planu kont",
  noLedger:
    "Firma nie ma aktywnego konta bankowego w planie kont. Dodaj je, aby kontynuować.",
  search: "Wyszukaj bank",
  noBanks: "Brak pasujących banków. Zmień nazwę, kraj lub rodzaj dostępu.",
  loading: "Wczytywanie listy banków…",
  unconfigured:
    "Poproś administratora serwera o skonfigurowanie identyfikatora aplikacji Enable Banking i klucza do podpisywania.",
  directoryUnavailable:
    "Lista banków jest chwilowo niedostępna. Spróbuj załadować ją ponownie.",
  retry: "Spróbuj ponownie",
};
