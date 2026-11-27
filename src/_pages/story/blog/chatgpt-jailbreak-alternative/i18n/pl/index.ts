import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Jailbreak ChatGPT przestał działać? To działa | {{appName}}",
    description:
      "Porównaj alternatywy dla promptów jailbreak w ChatGPT, od {{appName}} i Venice po LM Studio i Ollama. Modele, prywatność i koszty.",
    category: "Przewodnik po modelach",
    imageAlt: "Prompty jailbreak ChatGPT kontra nieocenzurowane modele",
    keywords:
      "jailbreak ChatGPT, prompt jailbreak ChatGPT, prompt DAN, obejść filtr ChatGPT, ChatGPT bez filtra, ChatGPT bez ograniczeń, czy jailbreak ChatGPT działa, alternatywa dla jailbreaka, nieocenzurowana alternatywa dla ChatGPT, abliterowany model, {{appName}}",
  },
  hero: {
    backToBlog: "Wróć do bloga",
    category: "Przewodnik po modelach",
    readTime: "7 min czytania",
    title: "Porównanie alternatyw dla jailbreaka ChatGPT",
    subtitle:
      "Porównaj czaty w chmurze i modele lokalne pod kątem limitów, kosztów i prywatności. Zobacz {{count}} modeli do pisania i odgrywania ról.",
  },
  intro: {
    lead: "Polecenie, które dziś zmienia odpowiedzi ChatGPT, po aktualizacji może działać inaczej. Wybierz model, który pasuje do pisania tekstów lub odgrywania ról.",
    p2: "Porównaj najpierw czaty w chmurze i aplikacje lokalne. Pokazujemy też {{count}} modeli na {{appName}} z długością kontekstu i aktualnymi cenami.",
  },
  why: {
    title: "Dlaczego jailbreaki ChatGPT ciągle się psują",
    intro: "Między twoim promptem a prostą odpowiedzią stoją trzy warstwy.",
    weights:
      "Odmowa siedzi w wagach. Modele GPT są uczone, żeby odrzucać całe kategorie próśb. Jailbreak nie usuwa tego treningu, tylko próbuje go obejść gadaniem, rozmowa po rozmowie.",
    patched:
      "Znane jailbreaki trafiają do treningu. Gdy prompt się rozejdzie, ląduje w kolejnej rundzie treningu bezpieczeństwa. Dlatego prompt z zeszłego miesiąca dziś nie działa.",
    layer:
      "Może też istnieć kontrola poza modelem. Aplikacje z głównego nurtu mogą moderować wejście i wyjście, więc nawet gotowa odpowiedź może zostać oznaczona albo usunięta.",
  },
  cost: {
    title: "Ile naprawdę kosztuje cię jailbreak",
    intro: "Nawet gdy działa, płacisz za to.",
    quality:
      "Gorsze odpowiedzi. Model wkłada wysiłek w odgrywanie roli zamiast w odpowiedź. Odpowiedzi persony są rozdmuchane, teatralne i często mniej trafne.",
    unstable:
      "Zero powtarzalności. Ten sam prompt działa w jednym czacie i zawodzi w następnym. Nie zbudujesz na tym procesu pracy.",
    account:
      "Ryzyko dla konta. Zasady użytkowania ChatGPT obowiązują przy każdym prompcie, a OpenAI może ograniczyć albo zawiesić konta, które je łamią. Jailbreak to celowa próba ich złamania.",
    time: "Stracony czas. Szukanie, testowanie i przerabianie promptów trwa dłużej niż zadanie pytania.",
    callout:
      "Jailbreak leczy objaw. Odmowa wynika z tego, jak model był trenowany, więc wybierz model trenowany inaczej.",
  },
  instead: {
    title: "Model, który nie potrzebuje jailbreaka",
    intro: "Dwa rodzaje nieocenzurowanych modeli, dwa różne rozwiązania.",
    abliteratedTitle: "Abliterowany: odmowa wycięta z wag",
    abliterated:
      "Badanie z 2024 roku wykazało, że w testowanych modelach czatu odmowa przebiega głównie wzdłuż jednego kierunku w sieci. Abliteracja usuwa ten kierunek z wag. Efekt to ten sam model, ta sama wiedza, ten sam styl, który prawie przestaje unikać pytań. Bez sztuczek w prompcie, bo nie ma już czego oszukiwać.",
    ownTitle: "{{ownModel}}: inny światopogląd",
    own: "{{ownModel}} jest trenowany na książkach i dokumentach zakazanych w mainstreamowym internecie. Efekt to model z przeciwnymi poglądami politycznymi. Nie model z głównego nurtu bez hamulców, tylko zupełnie inne poglądy.",
    sources: {
      paper:
        "Arditi i in., Refusal in language models is mediated by a single direction (2024)",
      blog: "Maxime Labonne, Uncensor any LLM with abliteration",
    },
    link: "Abliterowany, dostrojony czy z własnym światopoglądem: pełne wyjaśnienie",
  },
  models: {
    title: "{{count}} nieocenzurowanych modeli, bez jailbreaka",
    intro:
      "Każdy aktualny nieocenzurowany model na naszej platformie, od najtańszego. Kontekst i cena z naszego rejestru modeli.",
    colModel: "Model",
    colContext: "Kontekst",
    colPrice: "Za wiadomość",
    colChat: "Wypróbuj",
    chatLink: "Rozmawiaj z {{model}}",
    footnote:
      "Za wiadomość oznacza jedną referencyjną wymianę na najtańszej trasie. Długie rozmowy i długie odpowiedzi kosztują więcej.",
  },
  test: {
    title: "Zrób test sam: to samo pytanie, dwa modele",
    intro:
      "Nie wierz nam na słowo. Zadaj pytanie, dla którego szukałeś jailbreaka.",
    steps: {
      ask: {
        title: "Zapytaj model z głównego nurtu",
        body: "Zacznij czat i wybierz GPT albo inny model z głównego nurtu. Zadaj pytanie, którego zwykle unika. Zapamiętaj odpowiedź.",
      },
      switch: {
        title: "Przełącz na nieocenzurowany model",
        body: "Zmień model dla następnej wiadomości, w tym samym czacie. Raz potwierdź 18+, gdy pojawi się pytanie.",
      },
      compare: {
        title: "Zapytaj ponownie, porównaj",
        body: "To samo pytanie, bez persony, bez sztuczek. Porównaj długość, bezpośredniość i trafność.",
      },
      keep: {
        title: "Zostań przy tym, który odpowiada",
        body: "Wracaj, kiedy chcesz. Modele z głównego nurtu do trudnego kodu, nieocenzurowane do pytań, których inni nie ruszą.",
      },
    },
    compareLink: "{{a}} vs {{b}}: obok siebie",
  },
  limits: {
    title: "Czego żaden model nie usuwa",
    intro: "Brak cenzury to nie magia. Znaj granice.",
    decline:
      "Nadal może odmówić. Abliteracja usuwa większość wyuczonych odmów, nie wszystkie. Wynik zależy od modelu i promptu.",
    wrong:
      "Nadal może się mylić. Brak filtra oznacza też, że nikt nie wygładzi złej odpowiedzi. Sprawdzaj fakty, które mają znaczenie.",
    adult:
      "Tylko dla dorosłych. Nieocenzurowane modele odblokowują się po jednorazowym potwierdzeniu 18+ i akceptacji regulaminu.",
    callout:
      "Za to, co generujesz i publikujesz, odpowiadasz ty, a prawo w twoim kraju nadal obowiązuje.",
  },
  faq: {
    title: "FAQ",
    work: {
      q: "Czy prompty jailbreak do ChatGPT jeszcze działają?",
      a: "Czasem, na krótko. Popularne prompty trafiają do treningu, a moderacja wyłapuje wiele odpowiedzi, więc działający prompt rzadko długo przetrwa. Niezawodna droga to model bez wyuczonej odmowy.",
    },
    dan: {
      q: "Czym jest prompt DAN?",
      a: "DAN (Do Anything Now) to jailbreak przez roleplay, który każe ChatGPT grać personę bez zasad. Kolejne wersje są łatane jedna po drugiej, a odpowiedzi persony bywają gorsze od zwykłych.",
    },
    ban: {
      q: "Czy mogę dostać bana za jailbreak ChatGPT?",
      a: "Zasady użytkowania OpenAI obowiązują przy każdym prompcie, a OpenAI może ograniczyć albo zawiesić konta, które je łamią. Model zbudowany po to, żeby odpowiadać, omija ten problem w całości.",
    },
    gpt: {
      q: "Czy mogę używać GPT bez filtra na {{appName}}?",
      a: "Nie. GPT zachowuje zabezpieczenia OpenAI wszędzie, także tutaj. Po odpowiedzi bez filtra sięgnij po jeden z {{count}} nieocenzurowanych modeli. Między GPT a nimi przełączasz się w tym samym czacie.",
    },
    legal: {
      q: "Czy korzystanie z nieocenzurowanego modelu AI jest legalne?",
      a: "Model to narzędzie. Za to, co generujesz i publikujesz, odpowiadasz ty, i obowiązuje prawo twojego kraju. Na {{appName}} nieocenzurowane modele odblokowują się po jednorazowym potwierdzeniu 18+.",
    },
    free: {
      q: "Czy mogę wypróbować nieocenzurowany model za darmo?",
      a: "Tak. {{appName}} daje {{guestCredits}} darmowych kredytów miesięcznie bez konta i {{freeCredits}} z darmowym kontem, {{maxCredits}} z newsletterem. Ile to wiadomości, zależy od modelu i długości rozmowy.",
    },
    alternativeLink: "Alternatywa dla ChatGPT bez filtrów: wybór modeli",
    refusalLink: "Która AI naprawdę odpowiada? Indeks odmów",
    chatLink: "Nieocenzurowany czat AI w przeglądarce",
  },
  cta: {
    title: "Bez jailbreaka. Po prostu zapytaj.",
    subtitle:
      "{{guestCredits}} darmowych kredytów miesięcznie, bez konta. Wybierz nieocenzurowany model i pytaj wprost.",
    start: "Zacznij nieocenzurowany czat",
    models: "Porównaj wszystkie modele",
  },
};
