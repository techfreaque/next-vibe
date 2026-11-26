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
    slovakSection7:
      "Słowacja: rejestracja VAT na podstawie § 7 (nie jest podatnikiem VAT)",
    slovakSection7a:
      "Słowacja: rejestracja VAT na podstawie § 7a (nie jest podatnikiem VAT)",
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
  choose: "Wybierz sposób rozliczania VAT",
  back: "Wstecz",
  appliesOn: "Rozliczanie VAT na dzień {{date}}",
  invoiceText: "Adnotacja na fakturach",
  savedTitle: "{{regime}} obowiązuje od {{date}}",
  pickCompany: {
    title: "Wybierz firmę",
    message:
      "Sprawdź, jakie zasady VAT obowiązują na jej fakturach w wybranym dniu.",
  },
  hints: {
    standard:
      "Faktury naliczają VAT według stawek firmy. VAT z zakupów podlega odliczeniu.",
    german: "Faktury bez VAT, z adnotacją o zwolnieniu z § 19 UStG.",
    austrian:
      "Faktury bez VAT, z adnotacją o austriackim zwolnieniu dla małych firm.",
    slovak:
      "Faktury bez VAT, bo firma nie jest zarejestrowana jako podatnik VAT.",
    slovakSection7:
      "Faktury krajowe bez VAT. Unijne nabycie towarów powyżej progu rozliczasz sam numerem SK VAT.",
    slovakSection7a:
      "Faktury krajowe bez VAT. Usługi dla firm z UE rozliczasz w odwrotnym obciążeniu numerem SK VAT.",
  },
};
