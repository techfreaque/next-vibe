import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Połącz bank",
  description:
    "Wybierz bank i konto księgowe. Bank może zezwolić na odczyt przez maksymalnie 180 dni.",
  company: "Firma",
  ledgerAccount: "Konto bankowe w księdze",
  bankCountry: "Kod kraju banku",
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
};
