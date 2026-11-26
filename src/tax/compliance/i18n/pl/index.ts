import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { compliance: "Zgodność", tax: "Podatki" },
  enums: {
    vatTreatment: {
      domestic: "Sprzedaż krajowa z VAT",
      reverseChargeDomestic: "Krajowe odwrotne obciążenie",
      euServices: "Usługi dla firmy z UE (odwrotne obciążenie)",
      euGoods: "Wewnątrzwspólnotowa dostawa towarów (zwolniona)",
      export: "Eksport poza UE (zwolniony)",
      exempt: "Sprzedaż zwolniona z VAT",
    },
    severity: {
      error: "Blokuje wystawienie",
      warning: "Do sprawdzenia",
      info: "Uwaga",
    },
  },
  issues: {
    issuerAddressMissing:
      "Uzupełnij ulicę, miejscowość i kod pocztowy firmy. Faktura musi zawierać pełny adres.",
    issuerRegistrationMissing:
      "Uzupełnij numer rejestrowy firmy (IČO, odpowiednik REGON). Musi być na każdej fakturze.",
    issuerRegistrationInvalid:
      "Numer rejestrowy (IČO) jest nieprawidłowy. Ma 8 cyfr, w tym cyfrę kontrolną.",
    issuerTaxIdMissing:
      "Uzupełnij numer podatkowy (DIČ). Musi być na każdej fakturze.",
    issuerTaxIdInvalid: "Numer podatkowy (DIČ) jest nieprawidłowy. Ma 10 cyfr.",
    issuerVatIdMissing:
      "Uzupełnij numer VAT UE (IČ DPH). Czynni podatnicy VAT muszą podawać go na fakturach.",
    issuerVatIdInvalid:
      "Numer VAT UE (IČ DPH) jest nieprawidłowy. Składa się z SK i 10 cyfr.",
    customerVatIdMissing:
      "Dodaj numer VAT UE klienta do adresu rozliczeniowego. Wymagają go odwrotne obciążenie i dostawy w UE.",
    customerVatIdInvalid: "Numer VAT UE klienta jest nieprawidłowy.",
    customerNotForeignEu:
      "Transakcje unijne wymagają numeru VAT UE klienta z innego kraju UE.",
    customerNotDomestic:
      "Krajowe odwrotne obciążenie wymaga numeru VAT klienta z Twojego kraju.",
    treatmentNotAllowed:
      "To rozliczenie VAT nie pasuje do statusu VAT firmy. Wybierz inne rozliczenie lub zmień status.",
    treatmentRequiresZeroRate:
      "Odwrotne obciążenie i sprzedaż zwolniona nie zawierają VAT. Ustaw 0 % we wszystkich pozycjach.",
    rateNotValidOnDate:
      "Stawka {{rate}} % VAT nie obowiązuje w dniu {{date}}. Użyj stawki obowiązującej w dniu dostawy.",
    zeroRateWithoutReason:
      "Pozycja ma 0 % VAT przy sprzedaży krajowej. Wybierz właściwe zwolnienie lub odwrotne obciążenie.",
    issueDeadlinePassed:
      "Wystawiono {{days}} dni po dostawie. Ustawowy termin to {{limit}} dni.",
    regimeNotElected:
      "Brak zapisanego statusu VAT. Dopóki go nie wybierzesz, ERP traktuje firmę jako podatnika VAT.",
    chartTemplateMismatch: "Plan kont nie pochodzi z szablonu dla tego kraju.",
    taxRatesMissing:
      "Brak stawek podatku dla tego kraju. Dodaj je, aby dokumenty mogły z nich korzystać.",
    taxRatesOutdated:
      "Część aktywnych stawek już nie obowiązuje. Wyłącz je lub ustaw datę końcową.",
    fiscalProviderMissing:
      "Sprzedaż za gotówkę i kartą wymaga certyfikowanej kasy eKasa. Sprzedaż POS pozostaje zablokowana, dopóki kasa nie zostanie podłączona.",
    eInvoicingUpcoming:
      "Ustrukturyzowane e-faktury będą obowiązkowe od {{date}}. Eksport Peppol UBL jest gotowy.",
    vatThresholdNear:
      "Obrót w tym roku kalendarzowym wynosi {{turnover}}. Powyżej {{threshold}} rejestracja do VAT jest obowiązkowa.",
    vatThresholdExceeded:
      "Obrót w tym roku kalendarzowym wynosi {{turnover}} i przekracza limit VAT {{threshold}}. Zarejestruj firmę do VAT.",
  },
  review: {
    title: "Kontrola zgodności z przepisami kraju",
    titleShort: "Kontrola zgodności",
    description:
      "Sprawdź, które wymogi prawne kraju firmy są spełnione i co poprawić w pierwszej kolejności.",
    company: {
      label: "Firma",
      description: "Firma do sprawdzenia",
    },
    disclaimer:
      "Dostarczamy narzędzia, nie doradztwo podatkowe. Deklaracje skonsultuj z doradcą podatkowym.",
    country: "Przepisy kraju",
    regime: "Status VAT",
    findings: "Wyniki",
    findingCode: "Wynik",
    findingSeverity: "Waga",
    allClear: "Wszystkie wymogi dla tego kraju są spełnione.",
    countries: {
      SK: "Słowacja",
      DE: "Niemcy",
      AT: "Austria",
      XX: "Ogólne (bez przepisów krajowych)",
    },
    facts: {
      title: "Co przygotowuje ERP",
      vatReturn: "Deklaracja VAT i raport kontrolny",
      statements: "Ustawowe sprawozdanie finansowe",
      fiscal: "Paragony fiskalne (eKasa)",
      eInvoicing: "Obowiązkowe e-faktury od",
      yes: "Dostępne",
      no: "Niedostępne dla tego kraju",
      notRequired: "Niewymagane",
      required: "Wymagane, przez certyfikowaną kasę eKasa",
    },
    actions: {
      company: "Edytuj dane firmy",
      regime: "Wybierz status VAT",
      rates: "Sprawdź stawki podatku",
      chart: "Skonfiguruj plan kont",
      vatReturn: "Otwórz deklarację VAT",
      fiscal: "Otwórz ustawienia fiskalne POS",
    },
    pickCompany: "Wybierz firmę do sprawdzenia.",
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Wybierz firmę, do której należysz.",
      },
      unauthorized: {
        title: "Wymagane logowanie",
        description: "Zaloguj się, aby sprawdzić zgodność.",
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
          "Dane firmy zmieniły się w trakcie kontroli. Spróbuj ponownie.",
      },
      server: {
        title: "Kontrola nie powiodła się",
        description:
          "Nie udało się uruchomić kontroli zgodności. Spróbuj ponownie.",
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
      title: "Zgodność sprawdzona",
      description: "Wyniki odzwierciedlają aktualne dane firmy.",
    },
  },
};
