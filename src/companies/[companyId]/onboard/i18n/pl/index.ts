import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    country: {
      AT: "Austria (AT)",
      DE: "Niemcy (DE)",
      XX: "Ogólny plan kont (ręczna konfiguracja stawek podatku)",
    },
  },
  tags: { companies: "firmy", onboard: "konfiguracja", setup: "setup" },
  post: {
    title: "Skonfiguruj księgowość",
    titleShort: "Skonfiguruj księgowość",
    description:
      "Dodaj plan kont oraz przygotuj konta kasowe i bankowe do księgowania.",
    companyId: { label: "Firma", description: "Firma" },
    country: {
      genericPreview:
        "Dodaje ogólny plan kont. Ustaw stawki podatku przed wystawieniem faktur.",
      regionalPreview: "Używa planu kont i stawek VAT wybranego kraju.",
      label: "Szablon planu kont",
      description:
        "Dla firmy zarejestrowanej w Austrii lub w Niemczech wybierz szablon tego kraju. Dla pozostałych krajów wybierz plan ogólny.",
      placeholder: "Wybierz szablon",
    },
    period: {
      title: "Pierwszy okres księgowy",
      open: "Otwórz ten okres podczas konfiguracji",
      description:
        "Domyślny okres to bieżący miesiąc. Zmień daty dla własnego okresu lub całego roku.",
      name: "Nazwa okresu",
      start: "Data rozpoczęcia",
      end: "Data zakończenia",
      proposal: "Proponowany okres {{name}}, od {{start}} do {{end}}",
      kept: "Istniejący kalendarz księgowy pozostaje bez zmian.",
      invalid:
        "Wpisz nazwę okresu i datę zakończenia nie wcześniejszą niż początek.",
      opened: "Okres {{name}} jest otwarty do księgowania.",
      view: "Wyświetl okresy księgowe",
      viewHint: "Sprawdź kalendarz księgowy.",
      createHint: "Wybierz daty przed pierwszym księgowaniem.",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Sprawdź wszystkie pola",
      },
      unauthorized: {
        title: "Nie zalogowano",
        description: "Zaloguj się, aby skonfigurować firmę",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Wymagana rola Administrator",
      },
      conflict: {
        title: "Istniejący plan kont używa szablonu innego kraju",
        description: "Sprawdź istniejący plan kont przed zmianą szablonu.",
      },
      profileMismatch:
        "Wybierz szablon planu kont zgodny z krajem w profilu firmy.",
      server: {
        title: "Błąd serwera",
        description: "Nie można ukończyć konfiguracji",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      network: { title: "Błąd sieci", description: "Sprawdź połączenie" },
      notFound: {
        title: "Firma nie znaleziona",
        description: "Ta firma nie istnieje",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
    },
    success: {
      title: "Księgowość skonfigurowana",
      description:
        "Plan kont jest gotowy. Możesz otworzyć okres księgowy i dodawać dokumenty.",
    },
    widget: {
      books: "Konfiguracja ksiąg",
      setupCounts: "Gotowe konta {{accounts}} · Dodane stawki {{rates}}",
      invoiceHint:
        "Przygotuj szkic dla tej firmy i sprawdź go przed wystawieniem.",
      submit: "Skonfiguruj księgowość",
      company: "Firma: {{name}}",
      back: "Wróć",
      cashAndBankReady: "Konta kasowe i bankowe są gotowe do księgowania.",
      nextHint: "Otwórz okres księgowy przed księgowaniem zapisów.",
      period: "Utwórz okres księgowy",
      invoice: "Utwórz szkic faktury",
    },
    response: {
      accountsCreated: "Dodane konta",
      accountsSkipped: "Istniejące konta",
      taxRatesCreated: "Dodane stawki podatku",
      cashAccountId: "ID kasy",
      bankAccountId: "ID konta bankowego",
      success: "Sukces",
    },
  },
};
