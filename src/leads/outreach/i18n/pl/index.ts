import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Outreach",
  tags: {
    outreach: "outreach",
    crm: "crm",
    deals: "deale",
    import: "import",
  },
  enums: {
    currency: { eur: "EUR", usd: "USD", pln: "PLN" },
    contactStatus: {
      sent: "Wysłano",
      replied: "Odpisał",
      interested: "Zainteresowany",
      deal: "Deal",
      declined: "Odmówił",
      optOut: "Wypisał się",
      bounced: "Nie doręczono",
    },
    contactKind: {
      creator: "Twórca",
      newsletter: "Newsletter",
      directory: "Katalog",
      other: "Inne",
    },
    direction: {
      out: "Wysłane przez nas",
      in: "Odpowiedź od nich",
    },
    dealStatus: {
      proposed: "Zaproponowany",
      committed: "Potwierdzony",
      paid: "Opłacony",
      canceled: "Anulowany",
    },
    angleGroup: {
      affiliate: "A · Afiliacja",
      audienceFit: "B · Dopasowanie do widowni",
      mission: "C · Wolność słowa / prywatność",
      tryIt: "D · Przetestuj / wpis w katalogu",
      video: "Zapytanie o wideo",
      infoFirst: "Najpierw stawki",
      negotiation: "Negocjacje",
      other: "Inne",
    },
    attributionBasis: {
      tracked: "Link śledzący / kod polecający",
      channel: "Cały kanał",
      none: "Bez śledzenia",
    },
  },
  crm: {
    get: {
      title: "Outreach CRM",
      titleShort: "Outreach",
      description:
        "Każdy kontakt, do którego pisaliśmy, jego etap i to, co płatne deale dały w rejestracjach i przychodzie.",
      fields: {
        status: {
          label: "Status",
          description: "Tylko kontakty z tym statusem",
        },
        kind: {
          label: "Rodzaj",
          description: "Twórca, newsletter, katalog lub inne",
        },
        angle: {
          label: "Podejście",
          description: "Początek podejścia, np. A, B-audience-fit, VIDEO",
          placeholder: "B-audience-fit",
        },
        search: {
          label: "Szukaj",
          description: "Nazwa, e-mail, temat lub notatki",
          placeholder: "Szukaj nazwy, e-maila, tematu…",
        },
        page: { label: "Strona", description: "Numer strony" },
        limit: { label: "Na stronę", description: "Kontaktów na stronę" },
      },
      response: {
        summary: "Podsumowanie",
        angles: "Podejścia",
        contacts: "Kontakty",
        deals: "Deale",
        dealTotals: "Sumy deali",
      },
      widget: {
        title: "Outreach",
        subtitle: "Do kogo pisaliśmy, kto odpisał, co dały pieniądze.",
        refresh: "Odśwież",
        addContact: "Dodaj kontakt",
        addDeal: "Dodaj deal",
        import: "Importuj log",
        loading: "Ładowanie outreachu…",
        allStatuses: "Wszystkie",
        clearFilters: "Wyczyść filtry",
        kpi: {
          contacts: "Kontakty",
          replyRate: "Odsetek odpowiedzi",
          replyRateHint: "{{replied}} z {{total}} odpisało",
          deals: "Opłacone deale",
          spent: "Wydane",
          spentHint: "{{committed}} potwierdzone, jeszcze nieopłacone",
        },
        angles: {
          title: "Podejścia",
          hint: "Odsetek odpowiedzi na podejście. Idź w to, co działa.",
          row: "{{contacts}} wysłanych · {{replied}} odpowiedzi",
        },
        contacts: {
          title: "Kontakty",
          columns: {
            contact: "Kontakt",
            status: "Status",
            angle: "Podejście",
            last: "Ostatni kontakt",
            touches: "E-maile",
          },
          showing: "{{start}}–{{end}} z {{total}}",
          never: "nigdy",
          replied: "odpowiedź {{date}}",
        },
        deals: {
          title: "Opłacone deale",
          hint: "Wydatki kontra wizyty, rejestracje i przychód z linku śledzącego lub kodu polecającego danego deala.",
          columns: {
            deal: "Deal",
            status: "Status",
            spend: "Wydatek",
            visits: "Wizyty",
            signups: "Rejestracje",
            paying: "Płacący",
            revenue: "Przychód",
            costPerSignup: "Koszt / rejestracja",
          },
          live: "od {{date}}",
          basisChannel: "cały kanał, nie tylko ten deal",
          basisNone: "brak linku, kampanii i kodu do dopasowania",
          empty: {
            title: "Brak opłaconych deali",
            hint: "Dodaj deal, gdy tylko twórca zgodzi się na cenę. Podepnij link śledzący lub kod polecający, a wyniki trafią tutaj.",
          },
        },
        empty: {
          title: "Brak outreachu",
          hint: "Zaimportuj log wysyłek albo zapisuj każdy wysłany e-mail.",
          cta: "Importuj log wysyłek",
          filtered: "Brak kontaktów dla tych filtrów",
        },
        text: {
          header:
            "{{total}} kontaktów · {{replied}} odpowiedzi ({{rate}}) · {{deals}} opłaconych deali",
          statusLine: "Status: {{counts}}",
          anglesTitle: "Podejścia (wysłane / odpowiedzi):",
          contactsTitle: "Kontakty {{start}}-{{end}} z {{total}}:",
          dealsTitle: "Opłacone deale:",
          dealLine:
            "{{name}} · {{deliverable}} · {{amount}} {{status}} · wizyty {{visits}} · rejestracje {{signups}} · płacący {{paying}} · przychód {{revenue}} · koszt/rejestracja {{cps}}",
          pageHint: "Strona {{page}}/{{pages}} - dalej: --page={{next}}",
          noContacts: "Brak pasujących kontaktów.",
          noDeals: "Brak opłaconych deali.",
        },
      },
    },
  },
  contact: {
    post: {
      title: "Zapisz kontakt outreach",
      titleShort: "Zapisz kontakt",
      description:
        "Utwórz lub zaktualizuj kontakt po adresie e-mail. Z tematem zapisze też właśnie wysłany (lub otrzymany) e-mail.",
      fields: {
        email: {
          label: "E-mail",
          description: "E-mail kontaktu. Wielkość liter bez znaczenia",
          placeholder: "hello@creator.com",
        },
        name: {
          label: "Nazwa",
          description: "Twórca, medium lub osoba",
          placeholder: "AI Anytime (Sonu)",
        },
        kind: {
          label: "Rodzaj",
          description: "Twórca, newsletter, katalog lub inne",
        },
        url: {
          label: "URL",
          description: "Kanał, strona lub newsletter",
          placeholder: "https://youtube.com/@creator",
        },
        angle: {
          label: "Podejście",
          description: "Podejście w pitchu, np. A-affiliate, B-audience-fit",
          placeholder: "B-audience-fit",
        },
        status: {
          label: "Status",
          description:
            "Tylko do przodu (wysłano → odpisał → zainteresowany → deal). Wyjścia działają zawsze",
        },
        forceStatus: {
          label: "Wymuś status",
          description: "Ustaw status dokładnie, nawet wstecz",
        },
        notes: {
          label: "Notatki",
          description: "Zastępuje notatki kontaktu",
          placeholder: "Cennik 550 $ za integrację, 20-150 tys. wyświetleń",
        },
        refCode: {
          label: "Kod polecający",
          description: "Kod polecający przekazany temu kontaktowi",
          placeholder: "moemoe",
        },
        channel: {
          label: "Kanał",
          description: "Klucz kanału growth, np. youtube, newsletter",
          placeholder: "youtube",
        },
        campaignLinkId: {
          label: "ID linku kampanii",
          description: "utm_id ich linku śledzącego. Nieznane ID są pomijane",
        },
        subject: {
          label: "Temat e-maila",
          description: "Podaj, by zapisać ten e-mail",
          placeholder: "Twoi widzowie już tego chcą",
        },
        direction: {
          label: "Kierunek",
          description: "Wysłane przez nas (domyślnie) lub odpowiedź od nich",
        },
        at: {
          label: "Wysłano",
          description: "Kiedy poszedł e-mail. Domyślnie teraz",
        },
        touchNote: {
          label: "Notatka do e-maila",
          description: "Co e-mail mówił lub o co pytał",
          placeholder: "Poprosiliśmy o cennik",
        },
      },
      response: {
        id: "ID kontaktu",
        created: "Utworzono",
        status: "Status",
        previousStatus: "Poprzedni status",
        touchLogged: "E-mail zapisany",
        contactCount: "Wysłane e-maile",
        warning: "Ostrzeżenie",
      },
      widget: {
        back: "Wstecz",
        hint: "Jedno wywołanie na wysłany e-mail. Ten sam adres to ten sam kontakt.",
        touchSection: "Ten e-mail",
        contactSection: "Kontakt",
        submit: "Zapisz kontakt",
        warnOptOut: "Ten kontakt się wypisał. Nie pisz do niego więcej.",
        warnBounced: "Ten adres już raz odbił. Sprawdź go przed wysyłką.",
        saved: "{{status}} · wysłane e-maile: {{count}}",
      },
    },
  },
  deal: {
    post: {
      title: "Zapisz deal outreach",
      titleShort: "Zapisz deal",
      description:
        "Utwórz płatny deal dla kontaktu lub zaktualizuj go po ID. Podepnij link kampanii, utm_campaign lub kod polecający, by go zmierzyć.",
      fields: {
        id: {
          label: "ID deala",
          description: "Podaj, by zaktualizować istniejący deal",
        },
        contactEmail: {
          label: "E-mail kontaktu",
          description:
            "Wymagany dla nowego deala. W razie potrzeby tworzy kontakt",
          placeholder: "youtube@creator.com",
        },
        contactName: {
          label: "Nazwa kontaktu",
          description: "Używana tylko, gdy kontakt jeszcze nie istnieje",
          placeholder: "MoeMoe",
        },
        deliverable: {
          label: "Świadczenie",
          description: "Za co płacimy",
          placeholder: "Integracja na YouTube",
        },
        amount: {
          label: "Kwota",
          description: "Cena całkowita w jednostkach waluty",
        },
        currency: {
          label: "Waluta",
          description: "Waluta kwoty",
        },
        status: {
          label: "Status",
          description: "Zaproponowany, potwierdzony, opłacony lub anulowany",
        },
        channel: {
          label: "Kanał",
          description: "Klucz kanału growth, jak w wydatkach na kanały",
          placeholder: "youtube",
        },
        campaignLinkId: {
          label: "ID linku kampanii",
          description:
            "utm_id linku śledzącego. Puste, jeśli linku nie ma na tej instancji",
        },
        utmCampaign: {
          label: "utm_campaign",
          description: "Wartość kampanii w linku śledzącym",
          placeholder: "moemoe-2026-11-14",
        },
        refCode: {
          label: "Kod polecający",
          description: "Kod polecający, którym dzieli się twórca",
          placeholder: "moemoe",
        },
        liveAt: {
          label: "Publikacja",
          description: "Data publikacji. Przychód liczony od tego dnia",
        },
        paidAt: {
          label: "Opłacono",
          description: "Domyślnie teraz, gdy status zmieni się na opłacony",
        },
        notes: {
          label: "Notatki",
          description: "Metoda płatności, faktura, warunki",
          placeholder: "Payoneer, ref. 1059964703",
        },
      },
      response: {
        id: "ID deala",
        created: "Utworzono",
        status: "Status",
        linkFound: "Znaleziono link kampanii",
      },
      widget: {
        back: "Wstecz",
        hint: "Potwierdzony lub opłacony deal przenosi kontakt na etap Deal.",
        submit: "Zapisz deal",
      },
    },
  },
  import: {
    post: {
      title: "Importuj log outreach",
      titleShort: "Importuj log",
      description:
        "Wczytuje log wysyłek (linie rozdzielone tabulatorem lub tabele markdown) do kontaktów i e-maili. Można uruchamiać wielokrotnie: zapisane e-maile są pomijane.",
      fields: {
        content: {
          label: "Treść logu",
          description:
            "Wklej linie sent-log lub tabele sent-log.md. Działa też ze zdalnymi instancjami",
          placeholder:
            "2026-11-10\tModelFit\tpartnerships@modelfit.io\tA-affiliate\tA recurring cut\tSENT",
        },
        filePaths: {
          label: "Pliki na serwerze",
          description:
            "Ścieżki pod .tmp/ na serwerze, rozdzielone przecinkami, np. .tmp/outreach/sent-log",
          placeholder: ".tmp/outreach/sent-log.md,.tmp/outreach/sent-log",
        },
        ignoreEmails: {
          label: "Pomiń adresy",
          description:
            "Adresy rozdzielone przecinkami, które nie są outreachem",
          placeholder: "max@example.com",
        },
        dryRun: {
          label: "Próba",
          description: "Tylko przeanalizuj i policz, nic nie zapisuj",
        },
      },
      response: {
        rowsParsed: "Wczytane wiersze",
        contactsCreated: "Nowe kontakty",
        contactsUpdated: "Zaktualizowane kontakty",
        touchesAdded: "Nowe e-maile",
        touchesDuplicate: "Już zapisane",
        statusChanges: "Zmiany statusu",
        skipped: "Pominięte linie",
        skippedLines: "Szczegóły pominiętych",
      },
      widget: {
        back: "Wstecz",
        hint: "Wklej log lub wskaż pliki na serwerze. Każdy e-mail zapisuje się raz, niezależnie od liczby importów.",
        submit: "Importuj",
        line: "{{source}}:{{line}} {{reason}}",
      },
    },
  },
  skip: {
    noEmail: "brak poprawnego e-maila",
    noDate: "brak poprawnej daty",
    skippedStatus: "oznaczone jako SKIPPED",
    ignored: "pominięty adres",
    columns: "za mało kolumn",
    unreadable: "nie można odczytać pliku",
    outsideTmp: "ścieżka poza .tmp/",
  },
  errors: {
    validation: {
      title: "Błędne dane",
      description: "Sprawdź zaznaczone pola",
    },
    unauthorized: {
      title: "Niezalogowany",
      description: "Zaloguj się jako admin",
    },
    forbidden: {
      title: "Tylko dla adminów",
      description: "Narzędzia outreach wymagają roli admina",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Taki wpis nie istnieje",
    },
    conflict: {
      title: "Konflikt",
      description:
        "Wpis zmienił się w międzyczasie, odśwież i spróbuj ponownie",
    },
    server: {
      title: "Błąd serwera",
      description: "Nie udało się wykonać żądania",
    },
    network: {
      title: "Błąd sieci",
      description: "Żądanie nie dotarło do serwera",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Coś nieoczekiwanego poszło nie tak",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Najpierw zapisz lub odrzuć zmiany",
    },
    dealNotFound: "Brak deala o ID {{id}}",
    dealNeedsContact: "Nowy deal wymaga e-maila kontaktu",
    dealNeedsFields: "Nowy deal wymaga świadczenia i kwoty",
    importEmpty: "Podaj treść logu lub co najmniej jeden plik na serwerze",
  },
  success: {
    title: "Gotowe",
    description: "Zapisano",
  },
};
