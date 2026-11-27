import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Księgowość",
  tags: {
    ledger: "księga",
    fx: "fx",
    rates: "kursy-walut",
  },
  fields: {
    companyId: "Firma",
    baseCurrency: "Waluta bazowa",
    quoteCurrency: "Waluta kwotowana",
    rate: "Kurs wymiany",
    rateDate: "Data kursu",
    source: "Źródło",
    asOfDate: "Data wyceny",
    dryRun: "Tylko podgląd",
    postReversalNextDay: "Automatyczne storno następnego dnia",
    currency: "Waluta",
    limit: "Maks. wierszy",
  },
  list: {
    title: "Kursy walut",
    titleShort: "Kursy FX",
    description:
      "Dzienne kursy referencyjne EBC i ręczne kursy wymiany dla księgi wielowalutowej",
    syncEcbAction: "Pobierz kursy EBC",
    setManualAction: "Dodaj kurs ręczny",
    revalueAction: "Wycena bilansowa FX",
    empty:
      "Brak zapisanych kursów walut. Pobierz dzienne kursy EBC lub dodaj kurs ręczny.",
    countLabel: "Zapisane kursy",
    latestDate: "Ostatnia data kursu",
    success: "Wczytano kursy walut",
  },
  set: {
    title: "Ustaw ręczny kurs waluty",
    description:
      "Zapisz ręczny kurs wymiany (1 waluta bazowa = kurs waluty kwotowanej). Kurs ręczny ma pierwszeństwo przed EBC tego samego dnia.",
    action: "Zapisz kurs",
    success: "Kurs waluty zapisany",
  },
  sync: {
    title: "Synchronizuj dzienne kursy EBC",
    description:
      "Pobierz najnowsze kursy referencyjne euro publikowane przez Europejski Bank Centralny",
    action: "Pobierz kursy EBC teraz",
    success: "Zsynchronizowano dzienne kursy EBC",
    upsertedCount: "Zaktualizowane kursy",
  },
  revaluation: {
    title: "Okresowa wycena różnic kursowych",
    description:
      "Przeszacuj otwarte należności, zobowiązania i salda bankowe w walutach obcych po kursie zamknięcia",
    action: "Uruchom wycenę FX",
    previewAction: "Podgląd wyceny",
    postAction: "Zaksięguj wycenę",
    success: "Wycena FX zakończona",
    noAdjustments: "Brak otwartych sald walutowych wymagających wyceny.",
    functionalCurrency: "Waluta funkcjonalna",
    totalUnrealized: "Niezrealizowane różnice kursowe netto",
    journalEntryId: "Zapis wyceny",
    reversalEntryId: "Storno następnego dnia",
    missingRates: "Waluty bez kursu zamknięcia",
    account: "Konto",
    foreignBalance: "Saldo oryginalne",
    carryingFunctional: "Wartość bilansowa",
    closingRate: "Kurs zamknięcia",
    revaluedFunctional: "Wartość po wycenie",
    unrealizedDelta: "Różnica niezrealizowana",
    previewBanner: "Tylko podgląd. Nie zaksięgowano żadnych zapisów.",
    postedBanner: "Zaksięgowano niezrealizowaną wycenę FX.",
  },
  errors: {
    validation: {
      title: "Nieprawidłowe dane",
      description: "Sprawdź kody walut, datę i wartość kursu.",
    },
    unauthorized: {
      title: "Wymagane logowanie",
      description:
        "Zaloguj się, aby uzyskać dostęp do kursów walut i wyceny FX.",
    },
    forbidden: {
      title: "Brak dostępu",
      description: "Do tej operacji wymagane są uprawnienia księgowe.",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Nie znaleziono wskazanej firmy lub kursów walut.",
    },
    conflict: {
      title: "Konflikt",
      description: "Brak otwartego okresu księgowego lub wymaganych kont FX.",
    },
    network: {
      title: "Błąd sieci",
      description: "Nie udało się połączyć ze źródłem kursów EBC.",
    },
    server: {
      title: "Błąd serwera",
      description:
        "Wystąpił nieoczekiwany błąd podczas przetwarzania danych FX.",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieoczekiwany błąd.",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany.",
    },
  },
};
