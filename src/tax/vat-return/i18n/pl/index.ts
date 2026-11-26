import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { tax: "Podatki", vatReturn: "Deklaracja VAT" },
  title: "Słowacka deklaracja VAT i raport kontrolny",
  titleShort: "Deklaracja VAT (SK)",
  description:
    "Przygotuj pozycje deklaracji DPH i plik XML raportu kontrolnego (kontrolný výkaz) za miesiąc lub kwartał.",
  company: { label: "Firma", description: "Firma zarejestrowana do VAT" },
  period: {
    label: "Okres",
    description: "Miesiąc lub kwartał deklaracji",
    month: "{{month}} {{year}}",
    quarter: "Q{{quarter}} {{year}}",
  },
  unsupportedCountry:
    "Deklaracja VAT jest dostępna tylko dla firm słowackich. Ustaw kraj firmy na Słowację, aby z niej korzystać.",
  disclaimer:
    "Dostarczamy narzędzia, nie doradztwo podatkowe. Zanim złożysz deklaracje w eDane, skonsultuj je z doradcą podatkowym.",
  summary: "{{company}}, od {{from}} do {{to}}",
  due: "Termin: 25. dzień następnego miesiąca, elektronicznie.",
  lines: {
    title: "Pozycje deklaracji DPH (DPHv25)",
    line: "Pozycja",
    meaning: "Opis",
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
    title: "Raport kontrolny (KV DPH)",
    section: "Sekcja",
    count: "Wiersze",
    A1: "A.1 Faktury wystawione dla podatników VAT",
    A2: "A.2 Faktury wystawione z krajowym odwrotnym obciążeniem",
    B1: "B.1 Faktury otrzymane, podatek płacisz Ty",
    B2: "B.2 Krajowe faktury otrzymane z odliczeniem",
    B31: "B.3.1 Otrzymane faktury uproszczone (suma)",
    C1: "C.1 Wystawione faktury korygujące",
    D1: "D.1 Obrót z eKasa",
    D2: "D.2 Pozostałe dostawy (klienci bez IČ DPH)",
  },
  warnings: {
    noVatId:
      "Firma nie ma ważnego numeru VAT UE (IČ DPH). Plik KV XML wymaga go przed złożeniem.",
    customerVatIds:
      "{{count}} faktur dla klientów bez IČ DPH trafia do sekcji D.2.",
    unmappedRates:
      "{{count}} wierszy ma stawki inne niż 23 / 19 / 5 % i nie trafia do deklaracji. Sprawdź je.",
    b32Required:
      "VAT odliczony z faktur uproszczonych osiągnął 3000 EUR. Przed złożeniem wykaż je w B.3.2 osobno dla każdego dostawcy.",
  },
  actions: {
    downloadKv: "Pobierz KV DPH XML",
    downloadCsv: "Pobierz pozycje deklaracji (CSV)",
    showXml: "Pokaż XML",
    hideXml: "Ukryj XML",
    copy: "Kopiuj",
    copied: "Skopiowano",
    copyError: "Nie udało się skopiować. Zaznacz tekst i skopiuj go ręcznie.",
  },
  pickCompany: "Wybierz firmę, aby przygotować jej deklarację VAT.",
  empty: "Brak dokumentów istotnych dla VAT w tym okresie.",
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
    description: "Pozycje i raport kontrolny odpowiadają zapisanym dokumentom.",
  },
};
