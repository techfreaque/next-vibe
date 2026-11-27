import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Księgowość, CRM i AI na własnym serwerze | {{appName}}",
    description:
      "Pełna księgowość, faktury, zakupy, magazyn, kasa, CRM i newslettery w jednej aplikacji open source. Działa na twoim serwerze. Każda funkcja to narzędzie dla twojego AI.",
    category: "Biznes",
    imageAlt: "{{appName}} na własnym serwerze: księgowość, CRM i AI",
    keywords:
      "program do księgowości self-hosted, ERP open source, księgowość open source, pełna księgowość, program do faktur, księgowość z AI, CRM na własnym serwerze, {{appName}}",
  },
  hero: {
    badge: "Oprogramowanie dla firm, open source",
    title: "Twoje księgi. Twój serwer.",
    titleHighlight: "AI w zestawie.",
    subtitle:
      "Pełna księgowość, faktury, zakupy, magazyn, kasa, CRM i newslettery w jednej aplikacji open source. Działa na twoim serwerze. Każda funkcja to narzędzie, z którego korzysta twoje AI.",
    ctaStart: "Uruchom u siebie",
    ctaGithub: "Zobacz na GitHubie",
    shotAlt: "Zestawienie obrotów i sald firmy demo: Winien równa się Ma",
    stats: {
      actions: "akcji, które wykona twoje AI",
      reports: "raportów prosto z księgi",
      charts: "plany kont: SKR03, ÖKR, SK, IFRS",
      languages: "wbudowanych języków",
    },
  },
  ledger: {
    eyebrow: "Księgi",
    title: "Podwójny zapis. Bez wyjątków.",
    intro:
      "Faktury sprzedaży i zakupu, płatności i sprzedaż z kasy same trafiają do księgi głównej, w tym zapisy wielowalutowe z dziennymi kursami EBC, zrealizowanymi różnicami kursowymi i wyceną na koniec okresu. Winien musi równać się Ma, inaczej nic się nie zaksięguje.",
    points: {
      balanced: {
        title: "Zbilansowane albo odrzucone",
        body: "Każdy dekret wymaga co najmniej dwóch pozycji i pełnego bilansu. Sprawdzane przy tworzeniu, księgowaniu i stornie.",
      },
      final: {
        title: "Zaksięgowane znaczy ostateczne",
        body: "Żadnych cichych poprawek. Błąd koryguje storno, które odwzorowuje oryginał i do niego linkuje.",
      },
      periods: {
        title: "Okresy, które się zamykają",
        body: "Zapisy muszą trafić do otwartego okresu. Zamknięcie jest zablokowane, dopóki są szkice, i zapisuje, kto zamknął.",
      },
      templates: {
        title: "Start od twojego kraju",
        body: "Niemcy (SKR03), Austria (ÖKR) albo Słowacja (SK): stawki VAT, kasa i konto bankowe w komplecie. Wszędzie indziej: ogólny plan kont IFRS, stawki dodajesz sam.",
      },
    },
    reportsLabel: "Raporty prosto z księgi głównej",
    reports: {
      balanceSheet: "Bilans",
      profitLoss: "Rachunek zysków i strat",
      trialBalance: "Zestawienie obrotów i sald",
      aging: "Wiekowanie należności",
      vat: "Raport VAT",
      payablesAging: "Wiekowanie zobowiązań",
      journalExport: "Eksport dziennika do CSV",
      taxFilings:
        "Deklaracje podatkowe wg kraju (DE UStVA/EÜR, AT UVA, SK DPH/KV, ogólny VAT)",
    },
    shotAlt: "Faktury zakupu ze statusem i kwotami w panelu {{appName}}",
  },
  flows: {
    eyebrow: "Pieniądze na wejściu i wyjściu",
    title: "Od oferty do księgi bez przepisywania.",
    intro:
      "Każdy dokument przechodzi w następny jednym kliknięciem. Księgowanie dzieje się po drodze.",
    posted: "Zaksięgowane",
    sales: {
      title: "Sprzedaż",
      steps: {
        estimate: "Oferta",
        invoice: "Faktura",
        payment: "Wpłata zapisana",
      },
      note: "Faktury korygujące, firmowe PDF-y z ZUGFeRD i kodem QR płatności, wysyłka e-mail z dziennikiem dostarczeń, harmonogramy faktur cyklicznych i linki płatności Stripe.",
    },
    purchasing: {
      title: "Zakupy",
      steps: {
        order: "Zamówienie",
        receipt: "Przyjęcie towaru",
        bill: "Faktura zakupu",
        payment: "Opłacona",
      },
      note: "Dostawcy z domyślną stawką VAT. Dostawy częściowe śledzone dla każdej pozycji. Przyjęcie towaru księguje stan w magazynie.",
    },
    pos: {
      title: "Kasa",
      steps: {
        session: "Otwórz kasę",
        order: "Nabij sprzedaż",
        payment: "Gotówka, karta lub przelew",
      },
      note: "Sprzedaż i zwroty automatycznie księgują ruch magazynowy i koszt własny sprzedaży (COGS) z konfigurowalną polityką ujemnych stanów. Zamknięcie kasy rozlicza gotówkę.",
    },
    inventory: {
      title: "Magazyn",
      body: "Magazyny, przyjęcia, wydania i korekty, przesunięcia między lokalizacjami. Każdy ruch trafia do niezmiennego dziennika razem z autorem.",
    },
  },
  suite: {
    eyebrow: "Wokół ksiąg",
    title: "Reszta firmy w tej samej aplikacji.",
    intro:
      "Jedno logowanie, jedna baza danych, jeden panel. Zero synchronizacji między pięcioma abonamentami.",
    aiLabel: "Dowolny model",
    toolCount: "Akcje: {{count}}",
    cards: {
      crm: {
        title: "CRM i leady",
        body: "Import kontaktów z CSV, śledzenie szans sprzedaży i kontaktów, eksport kiedy chcesz.",
      },
      newsletter: {
        title: "Newsletter i kampanie",
        body: "Podwójna zgoda, wypis jednym kliknięciem, obsługa odbić, sekwencje e-maili.",
      },
      messaging: {
        title: "Skrzynka i wiadomości",
        body: "Twoja poczta przez IMAP i SMTP, do tego SMS, Telegram i WhatsApp Business.",
      },
      payments: {
        title: "Rozliczanie subskrypcji",
        body: "Płatności przez Stripe i kryptowaluty, webhooki i zwroty dla planów subskrypcyjnych.",
      },
      team: {
        title: "Firmy i role",
        body: "Kilka firm w jednej instancji. Zaproś zespół jako właściciela, admina, księgowego, członka lub obserwatora.",
      },
      ai: {
        title: "Agenci według harmonogramu",
        body: "Agenci robią raporty i kontrole według harmonogramu. Z kontem {{appName}} albo własnym kluczem dostawcy.",
      },
    },
  },
  ai: {
    eyebrow: "AI, które pracuje",
    title: "Zapytaj swoje księgi. Dostaniesz odpowiedź, nie wykres.",
    intro:
      "Każda operacja księgowa to typowane narzędzie. Twoje AI wywołuje ten sam kod co przyciski w panelu, z tymi samymi kontrolami.",
    points: {
      chat: "Pytaj zwykłymi słowami. Model uruchamia raport i go wyjaśnia.",
      cli: "Zamknięcie miesiąca jako skrypt w terminalu. Każde narzędzie to polecenie CLI.",
      mcp: "Claude Code, Cursor i Codex sięgają po te same narzędzia przez MCP.",
      permissions:
        "Agent działa jako użytkownik, który go uruchomił. Ta sama rola w firmie, te same kontrole.",
    },
    demo: {
      label: "Przykład",
      question: "Kto jest nam winien pieniądze i jak bardzo się spóźnia?",
      tool: "Wiekowanie należności",
      answer:
        "Trzech klientów zalega łącznie 4180 EUR. Największa kwota, 2380 EUR, jest opóźniona o 47 dni. Podać numery faktur?",
    },
    tabs: {
      cli: "CLI",
      mcp: "MCP",
    },
  },
  compare: {
    eyebrow: "Różnica",
    title: "Typowa księgowość w chmurze kontra twój własny serwer.",
    intro:
      "Narzędzia w chmurze są wygodne. Oto, co za to oddajesz, i gdzie nadal wygrywają.",
    colSaas: "Typowa księgowość SaaS",
    colUs: "{{appName}} na własnym serwerze",
    colSaasShort: "SaaS",
    colUsShort: "Własny serwer",
    rows: {
      data: {
        label: "Gdzie leżą twoje księgi",
        saas: "W ich chmurze, na ich zasadach",
        us: "Na twoim serwerze, w twoim Postgresie",
      },
      seats: {
        label: "Cena za użytkownika",
        saas: "Miesięczna opłata za stanowisko",
        us: "Bez opłat za stanowisko. Płacisz za hosting i AI, którego używasz.",
      },
      ai: {
        label: "AI",
        saas: "Dodatek albo wcale",
        us: "Każda funkcja to narzędzie AI, dowolny model",
      },
      code: {
        label: "Kod źródłowy",
        saas: "Zamknięty",
        us: "Otwarty na GitHubie",
      },
      missing: {
        label: "Brakuje ci funkcji",
        saas: "Czekasz na roadmapę",
        us: "Zbuduj ją: jeden plik definicji",
      },
      exit: {
        label: "Odejście",
        saas: "Eksport w granicach, na jakie pozwolą",
        us: "To już jest twoja baza danych",
      },
      filings: {
        label: "Integracja z bankiem i deklaracje",
        saas: "Często wbudowane",
        us: "Wbudowane: połączenie z bankiem (Enable Banking), import wyciągów (CAMT.053, MT940, CSV) i parowanie, plus eksporty DE UStVA/EÜR, AT UVA, SK DPH/KV i ogólny VAT.",
      },
      hosting: {
        label: "Utrzymanie",
        saas: "Robią to za ciebie",
        us: "Utrzymujesz sam. Pomożemy, jeśli poprosisz.",
      },
    },
  },
  start: {
    eyebrow: "Instalacja",
    title: "Trzy polecenia. Potem zakładasz firmę.",
    intro:
      "Sklonuj, zainstaluj, uruchom. Kreator ustawi login admina i AI. Potem dodajesz firmę w panelu. Niemcy, Austria albo Słowacja: plan kont, stawki VAT, kasa i konto bankowe w jednym kroku. Wszędzie indziej: ogólny plan kont IFRS jako baza.",
    terminalTitle: "Uruchom instancję",
    guide: "Pełny poradnik self-hostingu",
    developers: "Buduj własne moduły",
  },
  code: {
    copy: "Kopiuj",
    copied: "Skopiowano",
    wrap: "Zawijaj wiersze",
  },
  help: {
    title: "Przenosisz firmę?",
    description:
      "Pomoc przy wdrożeniu, migracja danych, własne moduły. Każdą wiadomość czyta człowiek.",
  },
};
