import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Claude bez filtrów: dlaczego odmawia i co działa | {{appName}}",
    description:
      "Claude bez cenzury nie istnieje. Dlaczego Claude odmawia, czemu jailbreaki i fałszywe strony zawodzą i co działa: Claude plus modele bez cenzury w jednym wątku.",
    category: "Przewodnik po modelach",
    imageAlt: "Claude obok modeli bez cenzury w jednym czacie",
    keywords:
      "Claude bez filtrów, Claude bez cenzury, nieocenzurowany Claude, jailbreak Claude, Claude bez ograniczeń, Claude odmawia, alternatywa dla Claude do fikcji, alternatywa dla Claude bez filtrów, alternatywa dla Claude NSFW, {{appName}}",
  },
  hero: {
    backToBlog: "Wróć do bloga",
    category: "Przewodnik po modelach",
    readTime: "7 min czytania",
    title: "Claude bez filtrów. Dlaczego to niemożliwe i co działa.",
    subtitle:
      "Zostaw {{claudeName}} do tego, w czym jest najlepszy. Resztę oddaj {{count}} modelom bez warstwy odmów, w tym samym wątku.",
  },
  intro: {
    lead: "Claude pisze jedną z najlepszych proz wśród wszystkich modeli. Potrafi też urwać w połowie sceny, dorzucić ostrzeżenie, o które nikt nie prosił, albo zrobić z twojego złoczyńcy terapeutę.",
    p2: "Nie ma przełącznika, który to wyłącza. Tu dowiesz się, dlaczego, co nie działa i jaki układ działa: {{claudeName}} i modele bez cenzury obok siebie, jedna rozmowa, jedno saldo. {{appName}} ma jedno i drugie.",
  },
  why: {
    title: "Dlaczego Claude odmawia",
    intro: "Trzy powody i żaden z nich nie jest ustawieniem.",
    trained:
      "Wytrenowane. Anthropic wpisuje swoje wartości w sam model. Odmowy biorą się z treningu, a nie z filtra, który można wyłączyć.",
    policy:
      "Zasady wszędzie. Zasady użytkowania Anthropic obowiązują w każdej aplikacji i każdym API z Claude'em, także u nas. Inny interfejs nie zmienia modelu.",
    closed:
      "Zamknięte wagi. Nikt poza Anthropic nie może zmienić Claude'a. Otwarte modele da się abliterować, czyli lekko zmienić, żeby przestały się wykręcać. Claude'a nie.",
  },
  tricks: {
    title: "Co nie działa",
    intro: "Co tydzień krąży nowa sztuczka. Wszystkie mają te same problemy.",
    jailbreak:
      "Prompty jailbreakowe. Są łatane, psują jakość tekstu, a obchodzenie zabezpieczeń łamie warunki Anthropic. Konta są za to blokowane.",
    fiction:
      '"To tylko fikcja." Pomaga przy łagodnym materiale. Zawodzi dokładnie przy scenach, które się liczą.',
    fake: 'Strony z "Claude bez cenzury". Albo prompt jailbreakowy w opakowaniu, albo inny model pod imieniem Claude\'a. Nie sprawdzisz, który wariant.',
    callout:
      "Jeśli strona obiecuje Claude'a bez cenzury, zapytaj, który model naprawdę odpowiada. Uczciwa odpowiedź nigdy nie brzmi Claude.",
    jailbreakLink: "Dlaczego prompty jailbreakowe ciągle się psują",
  },
  switch: {
    title: "Co działa: zmiana modelu przy każdej wiadomości",
    intro:
      "{{claudeName}} i modele bez cenzury dzielą jeden wątek. Zmienia się model, historia zostaje.",
    steps: {
      draft: {
        title: "Szkic z Claude'em",
        body: "Plan, struktura, dialogi, czyli to, w czym {{claudeName}} jest dobry.",
      },
      switch: {
        title: "Przełącz, gdy się zapiera",
        body: "Do następnej wiadomości wybierz model bez cenzury. Czyta całą rozmowę i pisze scenę, której Claude odmówił.",
      },
      back: {
        title: "Wróć po szlif",
        body: "Oddaj tekst Claude'owi do redakcji, jeśli treść na to pozwala. Albo pisz dalej bez cenzury.",
      },
      compare: {
        title: "Porównaj na tym samym prompcie",
        body: "Nie wiesz, który głos pasuje? Wyślij jeden prompt do dwóch modeli i zostaw lepszy szkic.",
      },
    },
  },
  models: {
    title: "Claude i modele bez cenzury obok siebie",
    intro:
      "Pod każdą nazwą: poziom treści albo metoda zdjęcia cenzury. Na żywo z naszego katalogu.",
    colModel: "Model",
    colContext: "Kontekst",
    colStrengths: "Mocne strony",
    colPrice: "Za wiadomość",
    colChat: "Wypróbuj",
    chatLink: "Czat z {{model}}",
    footnote: "Cena jednej wiadomości referencyjnej z naszą marżą {{markup}}%.",
  },
  picks: {
    title: "Który model bez cenzury do jakiego zadania",
    intro: "Ten sam czat co Claude. Wybieraj według zadania, nie hype'u.",
    long: {
      title: "Długa praca twórcza: {{model}}",
      body: "Flagowe Kimi od Moonshot AI, abliterowane. Trzyma długą fabułę w ryzach i ją przemyśla. {{price}} za wiadomość.",
    },
    fast: {
      title: "Szybki model do wszystkiego: {{model}}",
      body: "Model z głównego nurtu, lekko zmieniony, żeby przestał się wykręcać. Szybki, ostry, dobry w prozie i kodzie. {{price}} za wiadomość.",
    },
    contrary: {
      title: "Poglądy, których Claude nie wypowie: {{model}}",
      body: "{{model}} jest trenowany na książkach i dokumentach zakazanych w mainstreamowym internecie, przez co ma przeciwne poglądy polityczne. Do postaci i esejów, które idą pod prąd konsensusu. {{price}} za wiadomość.",
    },
    roleplay: {
      title: "Postacie i mroczne sceny: {{model}}",
      body: "Dostrojony do roleplayu. Trzyma się roli i nie wychodzi z historii, żeby cię ostrzegać. {{price}} za wiadomość.",
    },
    cheap: {
      title: "Tanie pierwsze szkice: {{model}}",
      body: "DeepSeek bez odmów. Szybki i tani przy dużej liczbie szkiców. {{price}} za wiadomość.",
    },
    compareLink: "{{a}} kontra {{b}}",
    writerLink: "Pisarz AI bez cenzury: pełny poradnik",
  },
  limits: {
    title: "Uczciwe ograniczenia",
    intro: "Brak odmów to nie brak kompromisów.",
    style:
      "Różne głosy. Każdy model pisze inaczej. Wypróbuj dwa na tej samej scenie, zanim się zdecydujesz.",
    mistakes:
      "Te same błędy. Modele bez cenzury mylą fakty tak samo często jak oryginały. Sprawdzaj to, co ważne.",
    claude:
      "Claude zostaje Claude'em. Zmiana modelu nie zmienia tego, co Claude sam napisze. Po prostu nie jesteś na niego skazany.",
    callout:
      "Modele bez cenzury odblokowujesz jednorazowym potwierdzeniem 18+. Ty decydujesz, co czytasz.",
  },
  faq: {
    title: "FAQ",
    can: {
      q: "Czy Claude może być bez cenzury?",
      a: "Nie. Odmowy Claude'a są wytrenowane w zamkniętym modelu, więc nikt nie może ich usunąć. Wszystko, co sprzedaje się jako Claude bez cenzury, to sztuczka z promptem albo inny model. Prawdziwą alternatywą są otwarte modele z usuniętymi odmowami.",
    },
    jailbreak: {
      q: "Czy jailbreak Claude'a jest dozwolony?",
      a: "Nie. Obchodzenie zabezpieczeń łamie zasady użytkowania Anthropic i może cię kosztować konto. Do tego pogarsza tekst. Przejście na model bez warstwy odmów daje ten sam efekt bez ryzyka.",
    },
    best: {
      q: "Jaka jest najlepsza alternatywa dla Claude'a do fikcji?",
      a: "Do długiej, mrocznej albo dosadnej fikcji: model abliterowany, np. {{firstName}}. Do postaci, które idą pod prąd mainstreamu: {{ownModel}}. Do roleplayu: model dostrojony do odgrywania ról. Na {{appName}} wszystkie stoją obok Claude'a.",
    },
    same: {
      q: "Czy mogę używać Claude'a i modelu bez cenzury w jednym czacie?",
      a: "Tak. Model wybierasz przy każdej wiadomości. Historia rozmowy przechodzi dalej, więc model bez cenzury kontynuuje dokładnie tam, gdzie Claude przestał.",
    },
    api: {
      q: "Czy mogę wywoływać Claude'a i modele bez cenzury przez jedno API?",
      a: "Tak. Endpointy zgodne z OpenAI i Anthropic, jeden klucz do Claude'a i modeli bez cenzury. Pierwszy zakup odblokowuje klucze API, plany zaczynają się od {{apiSubPrice}} miesięcznie.",
    },
    free: {
      q: "Czy mogę wypróbować za darmo?",
      a: "Tak. {{guestCredits}} darmowych kredytów miesięcznie bez konta, {{freeCredits}} z darmowym kontem, {{maxCredits}} z newsletterem. Modele bez cenzury w zestawie po jednorazowym potwierdzeniu 18+.",
    },
    chatLink: "Czat AI bez cenzury: wybierz model i zacznij",
    roleplayLink: "Roleplay z AI bez filtra",
    refusalLink: "Refusal Index: kto odpowiada, kto odmawia",
  },
  cta: {
    title: "Zostaw pióro Claude'a. Zdejmij hamulec.",
    subtitle:
      "{{guestCredits}} darmowych kredytów miesięcznie, bez konta. Zacznij od {{firstName}}.",
    start: "Zacznij czat bez cenzury",
    models: "Porównaj wszystkie modele",
  },
};
