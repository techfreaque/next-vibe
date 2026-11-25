import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Czat AI za darmo bez rejestracji, bez maila | {{appName}}",
    description:
      "Czat AI bez rejestracji i logowania na {{appName}}: darmowe kredyty co miesiąc, modele od mainstreamu po nieocenzurowane, historia incognito w przeglądarce.",
    category: "Poradnik",
    imageAlt: "Czat AI, który startuje bez formularza rejestracji",
    keywords:
      "czat AI bez rejestracji, czat AI za darmo, AI za darmo bez rejestracji, AI bez logowania, czat AI bez konta, anonimowy czat AI, darmowy czat AI bez rejestracji, prywatny czat AI, chatbot bez rejestracji, nieocenzurowany czat AI bez rejestracji, czat AI incognito, AI bez maila, {{appName}}",
  },
  hero: {
    backToBlog: "Wróć do bloga",
    category: "Poradnik",
    readTime: "6 min czytania",
    title:
      "Czat AI za darmo i bez rejestracji. Bez maila. Bez numeru telefonu.",
    subtitle:
      "{{guestCredits}} darmowych kredytów miesięcznie, {{modelCount}} modeli czatu, historia incognito, która zostaje w twojej przeglądarce. I uczciwa lista tego, czego anonimowość nie obejmuje.",
  },
  intro: {
    lead: "Chcesz zadać jedno pytanie. Chatbot najpierw chce twojego maila, hasła, numeru telefonu i kliknięcia w baner cookies. Zanim wejdziesz, pytanie wyleciało ci z głowy.",
    p2: "Na {{appName}} otwierasz czat i piszesz. Żadnego formularza. Ten poradnik pokazuje, co dostajesz bez konta, co anonimowość tu naprawdę znaczy i kiedy darmowe konto się opłaca.",
  },
  guest: {
    title: "Co dostajesz bez konta",
    intro:
      "Bez rejestracji nie znaczy wersja demo. To pełny produkt, z limitem.",
    credits:
      "{{guestCredits}} darmowych kredytów co miesiąc, bez konta, bez karty. Pula odnawia się co miesiąc.",
    models:
      "Pełny wybór: {{modelCount}} modeli czatu od {{labCount}} laboratoriów. Z głównego nurtu, otwarte i nieocenzurowane, w jednym selektorze modeli.",
    uncensored:
      "Także {{uncensored}} nieocenzurowanych modeli, po jednorazowym potwierdzeniu 18+.",
    media:
      "Generowanie obrazów, wideo, muzyki i głosu z tych samych kredytów: {{imageModels}} modeli obrazu, {{videoModels}} modeli wideo.",
    mediaLink: "Twórz obrazy, wideo i muzykę",
  },
  starters: {
    title: "Najtańsze modele na start",
    intro:
      "Dwa najtańsze modele tekstowe z każdej grupy, prosto z naszego rejestru. Tani nie znaczy słaby: to z nimi {{guestCredits}} kredytów starczy na najdłużej.",
    footnote:
      "Za wiadomość oznacza jedną referencyjną wymianę na najtańszej trasie. {{guestCredits}} kredytów gościa to na modelu {{cheapestModel}} około {{guestMessages}} krótkich wiadomości. Długie rozmowy i długie odpowiedzi kosztują więcej.",
  },
  table: {
    model: "Model",
    context: "Kontekst",
    price: "Za wiadomość",
    chat: "Wypróbuj",
    chatLink: "Czatuj z {{model}}",
  },
  anonymous: {
    title: "Co tu znaczy anonimowo, a co nie",
    intro:
      "Prywatnie to nie niewidzialnie. Oto uczciwa wersja, bez obietnic, których nie ma w naszej polityce prywatności.",
    yesTitle: "Co zostaje u ciebie",
    noEmail:
      "Bez imienia, bez maila, bez numeru telefonu. Żeby ci odpowiedzieć, nie potrzebujemy żadnego z nich.",
    incognito:
      "Czaty incognito są zapisane w twojej przeglądarce, nie na naszych serwerach. Wyczyść dane przeglądarki i historii nie ma.",
    trackers:
      "Żadnych trackerów zewnętrznych, żadnych pikseli reklamowych, żadnego fingerprintingu. Jedno własne ciasteczko mówi naszemu serwerowi, z którą przeglądarką rozmawia.",
    noTitle: "Kto mimo to widzi twoją wiadomość",
    provider:
      "Dostawca AI: każda wiadomość przechodzi przez nasz serwer do firmy, która uruchamia model. Ta widzi prompt, żeby na niego odpowiedzieć. Tak działa każda hostowana AI.",
    media:
      "Wygenerowane media: obrazy, audio i wideo utworzone bez konta przechowujemy na naszych serwerach, żebyś mógł je oglądać i pobierać. Jeśli nigdy się nie zarejestrujesz, usuwamy je automatycznie po 4 miesiącach.",
    network:
      "Sieć: jak każda strona, nasz serwer widzi połączenie, które nawiązuje twoja przeglądarka. VPN ukrywa twój adres także przed nami.",
    callout:
      "Potrzebujesz promptu, który nigdy nie opuści twojego komputera? Żaden hostowany czat tego nie obieca. Uruchom model lokalnie albo hostuj sam.",
    policyLink: "Przeczytaj politykę prywatności",
  },
  steps: {
    title: "Od zera do odpowiedzi w niecałą minutę",
    intro: "Cztery kroki. Żaden z nich to nie formularz.",
    open: {
      title: "Otwórz czat incognito",
      body: "Jedno kliknięcie z dowolnej strony. Żadnego ekranu konta po drodze.",
    },
    pick: {
      title: "Wybierz model",
      body: "Zacznij tanio, zmieniaj, kiedy chcesz. Czat zachowuje historię przy zmianie modelu.",
    },
    confirm: {
      title: "Potwierdź 18+, jeśli wybierasz bez cenzury",
      body: "Nieocenzurowane modele raz proszą o potwierdzenie 18+ i akceptację regulaminu. Modele z głównego nurtu i otwarte nie potrzebują niczego.",
    },
    ask: {
      title: "Pytaj",
      body: "{{guestCredits}} kredytów miesięcznie. Kiedy się skończą, poczekaj na kolejny miesiąc albo załóż darmowe konto.",
    },
  },
  account: {
    title: "Kiedy darmowe konto się opłaca",
    intro: "Nigdy nie jest wymagane. Czasem się przydaje.",
    credits:
      "Do {{freeCredits}} darmowych kredytów miesięcznie z potwierdzonym mailem, zamiast {{guestCredits}}.",
    sync: "Czaty zapisane w twoich prywatnych folderach, na każdym urządzeniu, na którym się zalogujesz.",
    control:
      "Wyeksportuj wszystkie swoje dane jako JSON albo usuń konto w Ustawieniach. Usunięcie kasuje twoje dane osobowe.",
    plans:
      "Plany od {{subPrice}} miesięcznie, gdy darmowe kredyty nie wystarczają.",
  },
  stricter: {
    title: "Potrzebujesz większej prywatności?",
    intro: "Wybierz konfigurację dopasowaną do ryzyka.",
    selfHost: "Hostuj {{appName}} sam: twój serwer, twoje logi, twoje zasady",
    local: "Uruchom nieocenzurowany model lokalnie albo online bez GPU",
    venice: "Alternatywy dla Venice AI w porównaniu prywatności",
  },
  faq: {
    title: "FAQ",
    exists: {
      q: "Czy jest czat AI bez rejestracji?",
      a: "Tak. Na {{appName}} otwierasz czat i piszesz, bez konta i bez maila. Goście dostają {{guestCredits}} darmowych kredytów miesięcznie na każdy z {{modelCount}} modeli czatu.",
    },
    anonymous: {
      q: "Czy czat AI bez konta jest naprawdę anonimowy?",
      a: "Anonimowy wobec nas w tym sensie, że nigdy nie pytamy, kim jesteś, a historia incognito zostaje w twojej przeglądarce. Nie niewidzialny: dostawca AI widzi każdy prompt, żeby na niego odpowiedzieć, a nasz serwer widzi twoje połączenie jak każda strona.",
    },
    free: {
      q: "Czy to jest darmowe?",
      a: "{{guestCredits}} kredytów miesięcznie masz za darmo bez konta, do {{freeCredits}} z potwierdzonym darmowym kontem. Na ile starczą, zależy od modelu: najtańszy, {{cheapestModel}}, kosztuje {{cheapestPrice}} za wiadomość.",
    },
    uncensored: {
      q: "Czy mogę używać nieocenzurowanej AI bez rejestracji?",
      a: "Tak. Każdy z {{uncensored}} nieocenzurowanych modeli działa bez konta po jednorazowym potwierdzeniu 18+.",
    },
    saved: {
      q: "Czy moje czaty są zapisywane?",
      a: "Czaty incognito są zapisywane tylko w twojej przeglądarce, więc wrócisz do nich na tym samym urządzeniu. Wyczyść dane przeglądarki i ich nie ma. Z kontem możesz też zapisywać czaty w prywatnych folderach, które synchronizują się między urządzeniami.",
    },
    runOut: {
      q: "Co się dzieje, gdy skończą mi się darmowe kredyty?",
      a: "Poczekaj na pulę z kolejnego miesiąca albo załóż darmowe konto i potwierdź mail, a dostaniesz do {{freeCredits}} kredytów miesięcznie. Kredyty wydane w tym miesiącu jako gość wliczają się do tej sumy.",
    },
    chatLink: "Nieocenzurowany czat AI w przeglądarce",
    chatgptLink: "Alternatywa dla ChatGPT z nieocenzurowanymi modelami",
  },
  cta: {
    title: "Bez formularza. Po prostu pytaj.",
    subtitle:
      "{{guestCredits}} darmowych kredytów miesięcznie, każdy model, domyślnie incognito.",
    start: "Zacznij czat incognito",
    models: "Porównaj wszystkie modele",
  },
};
