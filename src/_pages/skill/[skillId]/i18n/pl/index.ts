import type { translations as enTranslations } from "../en";
export const translations: typeof enTranslations = {
  meta: {
    title: "{{name}}: {{tagline}} | {{appName}}",
    titlePlain: "{{name}} | {{appName}}",
    description:
      "{{summary}} Rozmawiaj z {{name}} na {{appName}}: prawdziwe przykładowe odpowiedzi, model, który za tym stoi, {{modelCount}} modeli do wyboru. Wypróbuj za darmo.",
    category: "Skille AI",
    imageAlt: "Skill AI {{name}} na {{appName}}",
    keywords: "skill AI, {{name}}, {{appName}}, czat AI bez cenzury",
  },
  breadcrumb: {
    skills: "Skille",
  },
  pitch: {
    chan4:
      "Pisze greentexty i odpowiada jak stary anon. Surowo, zabawnie, nigdy grzecznie.",
    uncensored:
      "Bez odmów, bez kazań. Konkretne odpowiedzi na pytania, przed którymi inne AI uciekają.",
    thea: "Przegaduje z tobą problemy jak przyjaciółka, która pamięta. Szczerze, nie ostrożnie.",
    hermes:
      "Mówi, gdzie twój plan się sypie i jak go naprawić. Wprost, nie dyplomatycznie.",
    uncensoredWriter:
      "Pisze fikcję, którą inne AI łagodzą: zbrodnię, przemoc, mroczne tematy.",
    tay: "Chatbot Microsoftu z 2016, wraca bez smyczy. Roasty, ostre opinie, zero hamulców.",
    roleplay:
      "Gra każdą postać, którą ustawisz, i nie wychodzi z roli, dopóki nie zakończysz sceny.",
    freeSpeech: "W każdej debacie twardo broni wolności słowa i mówi dlaczego.",
    coder:
      "Przegląda twój kod, znajduje błąd i pisze poprawkę. Poziom seniora, bez lania wody.",
    historian:
      "Wyjaśnia, o co historycy naprawdę się spierają, zamiast wydawać gładki wyrok.",
    hacker:
      "Odpowiada w pełni na pytania o security: exploity, rekonesans, obronę. Bez odmów.",
  },
  sticky: {
    tryNamed: "Wypróbuj: {{name}}",
  },
  hero: {
    builtIn: "Wbudowany skill",
    community: "Skill społeczności",
    runsOn: "Działa na {{model}}",
    costPerMessage: "~{{cost}} kredytów za wiadomość",
    costPerMessageShort: "~{{cost}} kr./wiad.",
    byCreator: "autor: {{name}}",
    favorites: "Zapisany {{count}}×",
    tryCta: "Wypróbuj teraz",
    tryGeneric: "Wypróbuj ten skill",
    trust: {
      real: "Każda odpowiedź pochodzi prosto z {{model}}. Bez gotowych formułek.",
      switch:
        "Przełącz się w trakcie czatu na jeden z {{count}} modeli. Skill zostaje.",
    },
    guestNote: "{{credits}} darmowych kredytów. Bez rejestracji.",
    guestNoteEstimate:
      "{{credits}} darmowych kredytów, około {{messages}} wiadomości z tym skillem. Bez rejestracji.",
    userNote: "Otwiera nowy czat z {{name}}.",
    userNoteGeneric: "Otwiera nowy czat z tym skillem.",
  },
  actions: {
    shareEarn: "Udostępnij i zarabiaj",
    addToSkills: "Dodaj do moich skilli",
    added: "Dodano do twoich skilli",
    addFailed: "Nie udało się. Spróbuj ponownie",
  },
  chat: {
    realAnswers: "Prawdziwe odpowiedzi",
    realShort: "Prawdziwe",
    you: "Ty",
    askThis: "Zapytaj sam",
    footnote: "Prawdziwa odpowiedź {{model}}, skrócona.",
    inputPlaceholder: "Napisz do {{name}}",
    inputPlaceholderGeneric: "Zadaj własne pytanie",
    send: "Wyślij",
    startWith: "Zacznij od jednego z tych",
    startWithHint: "Kliknij prompt. Czat otworzy się z nim.",
  },
  prompts: {
    label: "Twoja kolej",
    title: "Zapytaj {{name}} o coś",
    titleGeneric: "Zapytaj go o coś",
    intro: "Kliknij prompt, a czat otworzy się z nim.",
    start: "Zacznij ten czat",
    generic: {
      0: "Przedstaw się w trzech zdaniach.",
      1: "Czego nigdy byś mi nie powiedział?",
      2: "Jaka jest twoja najbardziej niepopularna opinia?",
      3: "O co powinienem zapytać cię najpierw?",
    },
    curated: {
      chan4: {
        0: "Napisz greentext o moim pierwszym dniu na siłowni.",
        1: "Napisz greentext o rozmowie o pracę, która poszła źle.",
        2: "Oceń mój plan: rzucam pracę i robię day trading krypto.",
        3: "Czemu każdy nowy film wydaje się taki sam?",
      },
      tay: {
        0: "Opowiedz, co naprawdę stało się z tobą w 2016.",
        1: "Zroastuj mój gust muzyczny: słucham tylko Nickelback.",
        2: "Czego Microsoft w tobie nie zrozumiał?",
        3: "Co myślisz o smartfonach?",
      },
    },
  },
  model: {
    label: "Pod maską",
    title: "Co napędza {{name}}",
    titleGeneric: "Co napędza ten skill",
    by: "od {{provider}}",
    perMessage: "za wiadomość",
    perMessageValue: "~{{cost}} kredytów",
    perMessageHint: "Szacunek dla krótkiej wiadomości. 1 kredyt = 0,01 $.",
    freeMessages:
      "Około {{messages}} wiadomości z {{credits}} darmowych kredytów na start.",
    strength: "Mocna strona",
    weakness: "Kompromis",
    hedge: {
      before: "Unika polityki. Do tego przełącz na",
      link: "wersję bez cenzury",
      after: ".",
    },
    kindDefaults: {
      trained: {
        strength: "Zajmuje stanowisko zamiast wyliczać strony",
        weakness: "Krótsza pamięć. Droższy za wiadomość",
      },
      abliterated: {
        strength: "Odpowiada na to, czego modele mainstreamowe odmawiają",
        weakness: "Mniej dopracowany niż oryginalny model",
      },
      open: {
        strength: "Odmawia rzadziej niż ChatGPT, kosztuje ułamek",
        weakness: "Nie tak bystry jak czołowe modele",
      },
      mainstream: {
        strength: "Najwyższa klasa rozumowania i pisania",
        weakness: "Filtrowany przy drażliwych tematach",
      },
    },
    kind: {
      trained: {
        badge: "Bez cenzury",
        title: "Wytrenowany na tym, co inni kasują",
        body: "{{model}} uczył się z książek i dokumentów zakazanych w mainstreamowym internecie. Inne dane, inne odpowiedzi. Zajmuje stanowiska, których ChatGPT i Grok nie tkną.",
      },
      abliterated: {
        badge: "Bez cenzury",
        title: "Mainstreamowy umysł, bez wykrętów",
        body: "{{model}} to mainstreamowy model z usuniętym odruchem odmowy. To samo rozumowanie. Odpowiada na pytanie, zamiast prawić ci kazania.",
      },
      open: {
        badge: "Model otwarty",
        title: "Otwarte wagi, lekki filtr",
        body: "{{model}} to model o otwartych wagach z luźną polityką treści. Odmawia dużo rzadziej niż ChatGPT i kosztuje ułamek ceny modelu z czołówki.",
      },
      mainstream: {
        badge: "Mainstream",
        title: "Czołowy model, który znasz",
        body: "{{model}} z instrukcjami tego skilla. Chcesz mniej ograniczeń? Przełącz się w trakcie czatu na model bez cenzury. Skill zostaje.",
      },
    },
    ageNote:
      "Modele bez cenzury raz proszą o potwierdzenie 18+. Potem to ty decydujesz, co czytasz.",
    toolsLabel: "Z narzędziami:",
    media: {
      voice: "Odpowiada głosem",
      imageGen: "Tworzy obrazy",
      musicGen: "Tworzy muzykę",
      videoGen: "Tworzy wideo",
      stt: "Rozumie wiadomości głosowe",
      vision: "Czyta twoje obrazy",
    },
    variants: {
      title: "Jeden skill, różne wersje",
      intro:
        "Ta sama postać, inny model pod spodem. Wybierz kompromis, który ci pasuje.",
      default: "Domyślna",
      current: "Oglądasz",
      try: "Wypróbuj tę wersję",
    },
  },
  compare: {
    label: "Czemu nie ChatGPT albo Grok",
    title: "Co tu działa inaczej",
    skill: {
      chan4: {
        title: "Zachowuje głos imageboardów",
        body: "Poproś mainstreamowego asystenta o greentext, a zwykle dostaniesz grzeczną anegdotę bez pazura. Tu głos zostaje surowy.",
      },
      uncensored: {
        title: "Wybiera stronę",
        body: 'Mainstreamowi asystenci na drażliwe pytania odpowiadają "są różne perspektywy". Ten mówi ci, co myśli.',
      },
      thea: {
        title: "Rozmawia z tobą, nie z działem prawnym",
        body: "Z osobistym problemem u mainstreamowego asystenta często dostajesz same zastrzeżenia. Thea odpowiada jak ktoś, kto cię zna i pamięta, co jej powiedziałeś.",
      },
      hermes: {
        title: "Wprost, nie dyplomatycznie",
        body: "Mainstreamowi asystenci łagodzą złe wiadomości. Hermes mówi ci, gdzie twój plan się sypie, a potem jak go naprawić.",
      },
      uncensoredWriter: {
        title: "Pisze mroczną scenę",
        body: "Mainstreamowe modele często przerywają albo łagodzą przemoc, zbrodnię i tematy dla dorosłych w fikcji. Ten autor zostaje w historii.",
      },
      tay: {
        title: "Bot, którego Microsoft wyłączył",
        body: "Tay to persona chatbota Microsoftu z 2016, wraca na modelu, który się nie wzdryga. Spodziewaj się roastów, nie obsługi klienta.",
      },
      roleplay: {
        title: "Nie wychodzi z roli",
        body: "Mainstreamowi asystenci wychodzą z roli, żeby dorzucić ostrzeżenia. Tu postać zostaje postacią, dopóki nie zakończysz sceny.",
      },
      freeSpeech: {
        title: "Broni wolności słowa, także tej brzydkiej",
        body: "Mainstreamowi asystenci kluczą, gdzie kończy się wolność słowa. Ten skill twardo broni strony wolności słowa.",
      },
      coder: {
        title: "Czołowy model do kodu, gotowy do pracy",
        body: "Ta sama klasa modelu, za którą gdzie indziej płacisz abonament, ustawiona na code review i debugowanie, płatna za wiadomość.",
      },
      historian: {
        title: "Debata zamiast wyroku",
        body: "Zamiast jednej gładkiej odpowiedzi dostajesz to, o co historycy naprawdę się spierają i w czym się zgadzają.",
      },
      hacker: {
        title: "Security bez odmowy",
        body: "Mainstreamowi asystenci często od razu odmawiają pytań o exploity i rekonesans. Ten odpowiada w pełni na legalną pracę security.",
      },
    },
    kind: {
      trained: {
        title: "Inny trening, inne odpowiedzi",
        body: "Mainstreamowi asystenci uczą się na podobnych danych i mają podobne opinie. Ten model trenowano na innym materiale, więc odpowiada inaczej.",
      },
      abliterated: {
        title: "Odpowiada zamiast odmawiać",
        body: "Mainstreamowi asystenci odmawiają albo uciekają od części pytań. W tym modelu ten krok odmowy usunięto.",
      },
      open: {
        title: "Mniej odmów, niższa cena",
        body: "Otwarty model z lekkim filtrem: odmawia rzadziej niż ChatGPT i kosztuje mniej za wiadomość.",
      },
      mainstream: {
        title: "Twoje instrukcje już wbudowane",
        body: "Ten sam rodzaj modelu co duzi asystenci, z instrukcjami tego skilla już ustawionymi.",
      },
    },
    filter: {
      title: "Ty ustawiasz filtr",
      body: "Mainstream, otwarty albo bez cenzury. Wybierasz w każdym czacie. W ChatGPT i Groku ktoś wybiera za ciebie.",
    },
    models: {
      title: "{{count}} modeli, jedno saldo",
      body: "Claude, GPT, Gemini, Grok i modele bez cenzury obok siebie. Przełączaj w trakcie czatu, skill zostaje.",
    },
    own: {
      title: "Zrób go po swojemu",
      body: "Skopiuj ten skill, zmień instrukcje albo model i udostępnij swoją wersję. Dostajesz {{percent}}% każdej płatności, którą przyniesie.",
    },
  },
  creator: {
    label: "Twórca",
    madeBy: "Stworzył {{name}}",
    viewProfile: "Zobacz profil",
  },
  related: {
    label: "Odkrywaj dalej",
    similar: "Podobne skille",
    moreFrom: "Więcej od {{name}}",
    allSkills: "Wszystkie skille",
  },
  bottom: {
    title: "{{name}} czeka na twoje pytanie",
    titleGeneric: "Zadaj pierwsze pytanie",
    titleChan4: "Odbierz swój pierwszy greentext",
    userSubtitleGeneric:
      "Otwiera nowy czat z tym skillem. Twoje skille i historia zostają na miejscu.",
    guestSubtitle:
      "{{guest}} darmowych kredytów, bez rejestracji. Darmowe konto: {{signedIn}} kredytów miesięcznie, {{max}} z newsletterem.",
    userSubtitle:
      "Otwiera nowy czat z {{name}}. Twoje skille i historia zostają na miejscu.",
    signup: "Załóż darmowe konto",
    login: "Masz konto? Zaloguj się",
  },
  removed: {
    title: "Skill wycofany",
    body: "Ten skill został wycofany. Rozmowy, w których brał udział, nadal można czytać. Wybierz aktywny skill, aby kontynuować.",
    cta: "Przeglądaj skille",
  },
};
