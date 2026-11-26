import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Zobowiązania z tytułu kredytów klientów",
  description:
    "Sprawdź zaksięgowane zobowiązania za opłacone pakiety kredytów powiązane z firmą.",
  tag: "Zobowiązania za kredyty",
  company: "Firma",
  choose: "Wybierz firmę, aby zobaczyć zaksięgowane zobowiązania za kredyty.",
  empty: "Brak powiązanych zapisów opłaconych kredytów",
  account: "Konto księgowe",
  currency: "Waluta",
  amount: "Saldo księgowe",
  asOf: "Stan na",
  reportDay: "Do {{date}} (UTC)",
  scope:
    "Raport obejmuje powiązaną sprzedaż, zwroty, ujęcie przychodu i storna. Pomija kredyty w portfelach oraz kwoty bez potwierdzonego powiązania z firmą.",
  ledgerScope:
    "Otwórz konto, aby zobaczyć pełną księgę, w tym zapisy spoza raportu.",
  supplierLink: "Sprawdź przedpłaty u dostawców",
  errors: {
    validation: {
      title: "Sprawdź wybraną firmę",
      description: "Wybierz aktywną firmę, do której masz dostęp.",
    },
    forbidden: {
      title: "Wymagany dostęp do firmy",
      description: "Nie masz dostępu do tej firmy.",
    },
    server: {
      title: "Nie udało się wczytać zobowiązań za kredyty",
      description: "Spróbuj ponownie wczytać raport.",
    },
  },
};
