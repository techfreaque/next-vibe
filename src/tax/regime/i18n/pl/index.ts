import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    validation: {
      title: "Błąd walidacji",
      description:
        "Sprawdź kraj firmy, sposób rozliczania VAT i datę obowiązywania.",
    },
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Musisz być zalogowany",
    },
    forbidden: {
      title: "Brak dostępu",
      description:
        "Tylko właściciel lub administrator firmy może zmienić sposób rozliczania VAT.",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Firma nie została znaleziona",
    },
    conflict: {
      title: "Data obowiązywania jest już zajęta",
      description: "Dla tej daty zapisano już sposób rozliczania VAT.",
    },
    server: {
      title: "Błąd serwera",
      description: "Wystąpił błąd wewnętrzny",
    },
    network: { title: "Błąd sieci", description: "Wystąpił błąd sieci" },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieoczekiwany błąd",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany",
    },
  },
  reviewDescription:
    "Sprawdź, jakie zasady VAT obowiązują firmę w wybranym dniu.",
  view: "Sprawdź zasady VAT",
  asOf: "Na dzień",
  change: "Zmień zasady rozliczania",
  regimes: {
    standard: "Rozliczenie VAT na zasadach ogólnych",
    german: "Niemcy: zwolnienie dla małych firm (§ 19 UStG)",
    austrian: "Austria: zwolnienie dla małych firm (§ 6 ust. 1 pkt 27 UStG)",
    slovak: "Słowacja: firma niezarejestrowana jako podatnik VAT",
  },
  title: "Rozliczenie VAT firmy",
  description:
    "Wybierz sposób rozliczania VAT dla dokumentów od wskazanej daty.",
  company: "Firma",
  from: "Obowiązuje od",
  save: "Zapisz sposób rozliczania",
  regime: "Rozliczenie VAT",
  saved: "Wybrane zasady obowiązują od wskazanej daty.",
  conflict: "Wybierz inną datę lub sprawdź zapisane zasady.",
  foreign:
    "Skonsultuj zagraniczne usługi z doradcą podatkowym. Odwrotne obciążenie może dotyczyć również firm zwolnionych z VAT.",
  saleConflict:
    "Naliczony VAT jest sprzeczny ze zwolnieniem firmy. Sprawdź pozycje przed wystawieniem faktury.",
};
