import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { pos: "Kasa", fiscal: "Paragony fiskalne" },
  enums: {
    adapter: {
      sandbox: "Sandbox (tylko do testów, bez certyfikatu)",
    },
    deviceKind: {
      orp: "ORP (kasa ze sprzętową pamięcią)",
      sorp: "SORP (kasa programowa, pamięć u producenta)",
      vrp: "VRP (bezpłatna wirtualna kasa Finančná správa)",
    },
    receiptStatus: {
      pending: "Czeka na rejestrację",
      registered: "Zarejestrowany",
      offline: "Wystawiony offline",
      failed: "Nieudany",
    },
  },
  block: {
    ekasaRequired:
      "Prawo słowackie wymaga rejestracji każdej sprzedaży gotówkowej i kartowej w systemie eKasa. Przed sprzedażą prosimy podłączyć certyfikowaną kasę eKasa w ustawieniach fiskalnych kasy.",
  },
  title: "Paragony fiskalne",
  description:
    "Sprawdź, czy kraj firmy wymaga paragonów fiskalnych online i która kasa rejestruje sprzedaż.",
  saveTitle: "Kasa fiskalna",
  saveDescription:
    "Podłącz kasę, która rejestruje sprzedaż w administracji skarbowej.",
  company: "Firma",
  adapter: "Dostawca",
  adapterPlaceholder: "Wybierz dostawcę",
  adapterDescription:
    "Prawdziwą sprzedaż rejestrują wyłącznie certyfikowani dostawcy. Sandbox służy do testów i nigdy nie odblokowuje sprzedaży.",
  deviceKind: "Typ kasy",
  deviceKindDescription:
    "ORP zapisuje paragony w sprzętowej pamięci CHDÚ. SORP trzyma chronioną pamięć na serwerach producenta. VRP to bezpłatna usługa Finančná správa.",
  cashRegisterCode: "Kod kasy",
  cashRegisterCodeDescription:
    "Kod nadany tej kasie przez administrację skarbową (kód pokladnice).",
  cashRegisterCodePlaceholder: "np. 88812345678900001",
  isEnabled: "Rejestruj sprzedaż przez tego dostawcę",
  isEnabledDescription:
    "Po włączeniu każda zakończona sprzedaż trafia do kolejki rejestracji.",
  certifiedUntil: "Certyfikat ważny do",
  certifiedUntilDescription:
    "Ostatni dzień ważności certyfikatu kasy. Po tym dniu sprzedaż jest zablokowana.",
  credentialRef: "Odwołanie do danych dostępowych",
  credentialRefDescription:
    "Nazwa zapisanego klucza lub certyfikatu. Nigdy nie wklejaj tu klucza prywatnego ani hasła.",
  offlineDeadlineHours: "Termin wysłania offline (godziny)",
  offlineDeadlineHoursDescription:
    "Paragony wystawione offline muszą trafić do administracji skarbowej w tym czasie.",
  response: {
    required: "Paragony fiskalne wymagane",
    blocked: "Sprzedaż zablokowana",
    provider: "Kasa",
    counts: "Kolejka paragonów",
    adapters: "Dostępni dostawcy",
    companyName: "Firma",
    country: "Kraj",
    saved: "Zapisano",
  },
  widget: {
    requiredTitle: "eKasa jest obowiązkowa dla tej firmy",
    requiredMessage:
      "Każdą sprzedaż gotówkową i kartową trzeba zarejestrować online w eKasa (zákon 384/2025 Z. z.). Paragony niepotwierdzone w ciągu 5 sekund są zapisywane offline i trzeba je wysłać w ciągu 96 godzin.",
    notRequiredTitle: "Paragony fiskalne online nie są wymagane",
    notRequiredMessage:
      "Dla kraju tej firmy nasza biblioteka nie przewiduje systemu fiskalnego online. Sprzedaż w kasie działa jak dotąd.",
    blockedTitle: "Sprzedaż w kasie jest zablokowana",
    blockedMessage:
      "Podłącz i włącz certyfikowaną kasę eKasa. Do tego czasu kasa nie zakończy żadnej sprzedaży.",
    readyTitle: "Sprzedaż jest rejestrowana",
    readyMessage:
      "Zakończona sprzedaż trafia do kolejki i jest rejestrowana przez podłączoną kasę.",
    noCertifiedProvider:
      "W tej instalacji nie ma jeszcze certyfikowanego dostawcy eKasa.",
    noProvider: "Brak podłączonej kasy",
    configure: "Podłącz kasę",
    edit: "Zmień kasę",
    certified: "Certyfikowana",
    notCertified: "Bez certyfikatu",
    enabled: "Włączona",
    disabled: "Wyłączona",
    certifiedUntilValue: "Certyfikat ważny do {{date}}",
    pending: "Oczekujące",
    offline: "Offline",
    failed: "Nieudane",
    overdue: "Po terminie",
    queueHint: "Paragony jeszcze niepotwierdzone przez administrację skarbową.",
    disclaimer: "Dostarczamy narzędzia, nie doradztwo podatkowe.",
    pickCompany: {
      title: "Wybierz firmę",
      message: "Zasady fiskalne zależą od kraju firmy.",
    },
    savedTitle: "Kasa zapisana",
    savedBlocked:
      "Sprzedaż pozostaje zablokowana: ten dostawca nie ma certyfikatu eKasa.",
    savedReady: "Zakończona sprzedaż będzie rejestrowana przez tę kasę.",
    back: "Wstecz",
    save: "Zapisz kasę",
    sectionProvider: "Dostawca",
    sectionDevice: "Kasa",
  },
  errors: {
    validation: {
      title: "Sprawdź dane kasy",
      description: "Niektórych danych brakuje lub są nieprawidłowe.",
    },
    unauthorized: {
      title: "Wymagane logowanie",
      description: "Zaloguj się, aby zarządzać paragonami fiskalnymi.",
    },
    forbidden: {
      title: "Brak dostępu",
      description:
        "Ustawienia fiskalne mogą zmieniać tylko właściciele i administratorzy firmy.",
    },
    notFound: {
      title: "Nie znaleziono firmy",
      description: "Firma nie istnieje lub nie jesteś jej członkiem.",
    },
    conflict: {
      title: "Ustawienia się zmieniły",
      description: "Odśwież stronę i spróbuj ponownie.",
    },
    server: {
      title: "Ustawienia fiskalne niedostępne",
      description: "Spróbuj ponownie za chwilę.",
    },
    network: {
      title: "Brak połączenia",
      description: "Sprawdź połączenie i spróbuj ponownie.",
    },
    unknown: {
      title: "Coś poszło nie tak",
      description: "Spróbuj ponownie za chwilę.",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Najpierw zapisz lub odrzuć zmiany.",
    },
    deviceKindUnsupported: "Ten dostawca nie obsługuje wybranego typu kasy.",
    adapterUnknown: "Taki dostawca nie istnieje.",
    sandboxProduction:
      "Sandboxa nie można używać na produkcji. Wybierz certyfikowanego dostawcę.",
  },
  success: {
    title: "Wczytano ustawienia fiskalne",
    description: "Stan paragonów fiskalnych firmy.",
    savedTitle: "Kasa zapisana",
    savedDescription: "Ustawienia kasy fiskalnej zostały zapisane.",
  },
};
