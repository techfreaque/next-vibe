import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { tax: "Podatki", vatReturn: "Deklaracja VAT" },
  title: "Deklaracja VAT",
  titleShort: "Deklaracja VAT",
  description:
    "Twoja deklaracja VAT za okres w urzędowym formacie Twojego kraju.",
  company: {
    label: "Firma",
    description: "Firma, dla której przygotowujesz deklarację",
  },
  period: {
    label: "Okres",
    description: "Miesiąc lub kwartał deklaracji",
    month: "{{month}} {{year}}",
    quarter: "Q{{quarter}} {{year}}",
  },
  disclaimer:
    "Dostarczamy narzędzia, nie doradztwo podatkowe. Przed złożeniem sprawdź rozliczenie z doradcą podatkowym.",
  summary: "{{company}}, od {{from}} do {{to}}",
  formats: {
    SK_DPH: "Pozycje deklaracji DPH (DPHv25)",
    DE_USTVA: "Umsatzsteuer-Voranmeldung (UStVA)",
    DE_EUR_SMALL_BUSINESS: "Podsumowanie EÜR (§ 19 UStG mały przedsiębiorca)",
    AT_UVA: "Umsatzsteuervoranmeldung (U30)",
    AT_EA_SMALL_BUSINESS:
      "Zestawienie przychodów i kosztów (§ 6 ust. 1 Z 27 UStG)",
    GENERIC_VAT: "Podsumowanie VAT według stawek",
  },
  dueByFormat: {
    SK_DPH: "Termin: 25. dzień następnego miesiąca, elektronicznie.",
    DE_USTVA: "Termin: 10. dzień następnego miesiąca przez ELSTER.",
    DE_EUR_SMALL_BUSINESS: "Roczne zestawienie EÜR z zeznaniem dochodowym.",
    AT_UVA:
      "Termin: 15. dzień drugiego następnego miesiąca przez FinanzOnline.",
    AT_EA_SMALL_BUSINESS: "Roczne zestawienie przychodów i kosztów.",
    GENERIC_VAT: "Sprawdź lokalny termin składania deklaracji VAT.",
  },
  smallBusiness: {
    title: "Deklaracja VAT nie jest wymagana (zwolnienie podmiotowe)",
    body: {
      SK_DPH: "Firma nie jest czynnym podatnikiem VAT.",
      DE_USTVA: "Regularna deklaracja UStVA nie jest wymagana.",
      DE_EUR_SMALL_BUSINESS:
        "Firma korzysta ze zwolnienia § 19 UStG. Regularna deklaracja UStVA nie jest potrzebna. Poniżej znajduje się podsumowanie przychodów i kosztów (EÜR).",
      AT_UVA: "Regularna deklaracja UVA nie jest wymagana.",
      AT_EA_SMALL_BUSINESS:
        "Firma korzysta ze zwolnienia dla małych firm (§ 6 ust. 1 Z 27 UStG). Poniżej znajduje się zestawienie przychodów i kosztów.",
      GENERIC_VAT:
        "Dla tego statusu podatkowego deklaracja VAT nie jest wymagana.",
    },
  },
  xmlSection: {
    SK_DPH: "Raport kontrolny (KV DPH)",
    DE_USTVA: "ELSTER UStVA XML",
    DE_EUR_SMALL_BUSINESS: "Eksport XML",
    AT_UVA: "FinanzOnline UVA XML (U30)",
    AT_EA_SMALL_BUSINESS: "Eksport XML",
    GENERIC_VAT: "Eksport XML",
  },
  xmlNote: {
    SK_DPH: "Wgraj plik KVDPHv25 XML w portalu eDane.",
    DE_USTVA:
      "Plik XML ELSTER UStVA gotowy do importu u doradcy lub wysyłki ERiC. Bezpośrednia wysyłka wymaga certyfikatu ERiC; kwoty możesz też przepisać w Mein ELSTER lub pobrać CSV.",
    DE_EUR_SMALL_BUSINESS: "Użyj ustrukturyzowanego pliku CSV powyżej.",
    AT_UVA:
      "Plik XML FinanzOnline U30 gotowy do wgrania w portalu lub przekazania doradcy.",
    AT_EA_SMALL_BUSINESS: "Użyj ustrukturyzowanego pliku CSV powyżej.",
    GENERIC_VAT: "Użyj ustrukturyzowanego pliku CSV powyżej.",
  },
  lines: {
    title: "Pozycje deklaracji",
    line: "Pozycja",
    meaning: "Opis",
    base: "Podstawa",
    amount: "Kwota",
    r01: "Podstawa opodatkowania 19 %",
    r02: "VAT należny 19 %",
    r01a: "Podstawa opodatkowania 5 %",
    r02a: "VAT należny 5 %",
    r03: "Podstawa opodatkowania 23 %",
    r04: "VAT należny 23 %",
    r09: "Odwrotne obciążenie, podstawa 19 % (podatek płacisz Ty)",
    r10: "Odwrotne obciążenie, VAT 19 %",
    r09a: "Odwrotne obciążenie, podstawa 5 %",
    r10a: "Odwrotne obciążenie, VAT 5 %",
    r09b: "Odwrotne obciążenie, podstawa 23 %",
    r10b: "Odwrotne obciążenie, VAT 23 %",
    r13: "Sprzedaż zwolniona",
    r14: "w tym wewnątrzwspólnotowe dostawy towarów (§ 43)",
    r15: "w tym eksport (§§ 46, 47)",
    r17: "VAT należny razem",
    r18: "VAT naliczony do odliczenia 19 %",
    r18a: "VAT naliczony do odliczenia 5 %",
    r19: "VAT naliczony do odliczenia 23 %",
    r20: "w tym faktury krajowe 19 %",
    r20a: "w tym faktury krajowe 5 %",
    r21: "w tym faktury krajowe 23 %",
    r24: "Korekty podstawy (faktury korygujące, § 25)",
    r25: "Korekty VAT (faktury korygujące, § 25)",
    r32: "VAT do zapłaty",
    r33: "Nadwyżka VAT naliczonego (zwrot)",
  },
  sections: {
    title: "Raport kontrolny",
    section: "Sekcja",
    count: "Wiersze",
    A1: "A.1 Faktury wystawione dla podatników VAT",
    A2: "A.2 Faktury wystawione z krajowym odwrotnym obciążeniem",
    B1: "B.1 Faktury otrzymane, podatek płacisz Ty",
    B2: "B.2 Krajowe faktury otrzymane z odliczeniem",
    B31: "B.3.1 Otrzymane faktury uproszczone (suma)",
    C1: "C.1 Wystawione faktury korygujące",
    D1: "D.1 Obrót z kasy fiskalnej",
    D2: "D.2 Pozostałe dostawy (klienci bez numeru VAT)",
  },
  warnings: {
    noVatId:
      "Firma nie ma ważnego numeru VAT. Uzupełnij go w ustawieniach firmy przed złożeniem.",
    noTaxId:
      "Firma nie ma wpisanego numeru podatkowego. Uzupełnij go w ustawieniach firmy przed eksportem.",
    customerVatIds:
      "{{count}} faktur dla klientów bez numeru VAT trafia do sekcji D.2.",
    unmappedRates:
      "{{count}} wierszy ma niestandardowe stawki i nie trafia do przypisanych pozycji. Sprawdź je.",
    b32Required:
      "VAT odliczony z faktur uproszczonych osiągnął 3000 EUR. Przed złożeniem wykaż je w B.3.2 osobno dla każdego dostawcy.",
  },
  actions: {
    downloadXml: "Pobierz XML",
    downloadCsv: "Pobierz CSV",
    showXml: "Pokaż XML",
    hideXml: "Ukryj XML",
    copy: "Kopiuj",
    copied: "Skopiowano",
    copyError: "Nie udało się skopiować. Zaznacz tekst i skopiuj go ręcznie.",
  },
  pickCompany: "Wybierz firmę, aby przygotować jej deklarację VAT.",
  empty: "Brak dokumentów w tym okresie.",
  errors: {
    validation: {
      title: "Nieprawidłowe żądanie",
      description: "Wybierz firmę oraz prawidłowy miesiąc lub kwartał.",
    },
    unauthorized: {
      title: "Wymagane logowanie",
      description: "Zaloguj się, aby przygotować deklaracje VAT.",
    },
    forbidden: {
      title: "Brak dostępu",
      description: "Nie jesteś członkiem tej firmy.",
    },
    notFound: {
      title: "Nie znaleziono firmy",
      description: "Firma nie istnieje lub jest nieaktywna.",
    },
    conflict: {
      title: "Konflikt",
      description:
        "Dane zmieniły się w trakcie przygotowania. Spróbuj ponownie.",
    },
    server: {
      title: "Deklaracja nie została przygotowana",
      description:
        "Nie udało się przygotować deklaracji VAT. Spróbuj ponownie.",
    },
    network: {
      title: "Błąd sieci",
      description: "Sprawdź połączenie i spróbuj ponownie.",
    },
    unknown: {
      title: "Nieoczekiwany błąd",
      description: "Coś poszło nie tak. Spróbuj ponownie.",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Najpierw zapisz lub odrzuć zmiany.",
    },
  },
  success: {
    title: "Deklaracja VAT przygotowana",
    description: "Pozycje i pliki eksportu odpowiadają zapisanym dokumentom.",
  },
};
