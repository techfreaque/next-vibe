import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  common: {
    category: "Porównanie",
    breadcrumb: "Platformy AI bez cenzury w porównaniu",
    backToBlog: "Wróć do bloga",
    backToHub: "Wszystkie platformy AI bez cenzury",
    updated: "Aktualizacja: {{date}}",
    versusImageAlt: "{{appName}} vs {{name}}: porównanie obok siebie",
    kinds: {
      uncensoredChat: "Czat AI bez cenzury",
      aggregator: "Aplikacja z wieloma modelami + API",
      router: "Router API",
      roleplay: "Roleplay z postaciami",
      frontend: "Frontend do roleplayu (self-hosted)",
      companion: "Aplikacja z towarzyszem AI",
      filteredChat: "Czat z postaciami z filtrem",
      local: "Lokalne uruchamianie modeli",
    },
    period: {
      month: "{{plan}} {{price}}/mies.",
      quarter: "{{plan}} {{price}}/3 mies.",
      year: "{{plan}} {{price}}/rok",
      once: "{{plan}} {{price}} jednorazowo",
    },
    free: {
      yes: "Tak",
      no: "Nie",
      local: "Za darmo na własnym sprzęcie",
    },
    paid: {
      from: "Od {{price}}",
      payg: "Płacisz za użycie",
      none: "Brak płatnego planu",
    },
    availability: {
      yes: "Tak",
      no: "Nie",
      partial: "Ograniczone",
    },
    media: {
      image: "Obrazy",
      video: "Wideo",
      voice: "Głos",
      partial: "{{name}} (dodatki)",
      none: "Tylko tekst",
    },
    openSource: {
      yes: "Open source",
      yesSelfHost: "Open source, self-hosting",
      closedLocal: "Zamknięta aplikacja, działa lokalnie",
      partial: "Tylko starsza aplikacja desktopowa",
      no: "Nie",
    },
    sourceKinds: {
      home: "Strona główna: {{name}}",
      pricing: "Cennik: {{name}}",
      features: "Funkcje: {{name}}",
      models: "Lista modeli: {{name}}",
      privacy: "Polityka prywatności: {{name}}",
      terms: "Regulamin: {{name}}",
      guidelines: "Zasady społeczności: {{name}}",
      api: "Dokumentacja API: {{name}}",
      docs: "Dokumentacja: {{name}}",
      help: "Centrum pomocy: {{name}}",
      repo: "Kod źródłowy: {{name}}",
      blog: "Wpis na blogu: {{name}}",
      appStore: "Sklep z aplikacjami: {{name}}",
      paper: "Publikacja naukowa: {{name}}",
    },
    table: {
      platform: "Platforma",
      kind: "Typ",
      free: "Darmowy plan",
      paid: "Płatnie",
      filter: "Filtr i zgoda",
      privacy: "Prywatność",
      api: "API",
      media: "Media",
      open: "Open source",
      usLink: "Zobacz plany",
      versusLink: "Pełne porównanie",
    },
    versus: {
      shortTitle: "Krótka odpowiedź",
      tableTitle: "{{appName}} vs {{name}} obok siebie",
      tableIntro:
        "Dane o {{name}} z oficjalnych stron platformy, sprawdzone {{date}}. Dane o {{appName}} czytamy na żywo z naszej konfiguracji.",
      tableFootnote:
        "Ceny to ceny katalogowe w USD z oficjalnych stron platformy {{name}}. Nasze to ceny, które płacisz u nas przy zakupie. Plany się zmieniają: przed zakupem sprawdź źródła poniżej.",
      colAspect: "",
      rows: {
        price: "Cena",
        free: "Darmowy plan",
        models: "Modele",
        filter: "Filtr i zgoda",
        privacy: "Prywatność",
        api: "API",
        media: "Obrazy, wideo, głos",
        open: "Open source",
        forWho: "Dla kogo",
      },
      priceCell: "{{plans}}. {{note}}",
      apiCell: "{{short}}. {{text}}",
      themTitle: "{{name}}: uczciwe plusy i minusy",
      usTitle: "{{appName}}: uczciwe plusy i minusy",
      wins: "W czym {{name}} wygrywa",
      short: "Gdzie {{name}} odpada",
      chooseTitle: "Co wybrać?",
      chooseThem: "Wybierz {{name}}, jeśli",
      chooseUs: "Wybierz {{appName}}, jeśli",
      faqTitle: "FAQ",
      sourcesTitle: "Źródła",
      sourcesIntro:
        "Każdy fakt o {{name}} na tej stronie pochodzi z tych stron, sprawdzonych {{date}}. Widzisz coś nieaktualnego? Napisz, poprawimy.",
      ourSources:
        "Nasze liczby pochodzą z tej samej konfiguracji, która Cię rozlicza. Sprawdź sam:",
      modelsLink: "Wszystkie modele w {{appName}} z cenami na żywo",
      pricingLink: "Plany i pakiety kredytów",
      privacyLink: "Nasza polityka prywatności",
      modelTitle: "{{model}} w {{appName}}",
      modelIntro:
        "Własny model {{name}} działa w naszym wyborze modeli. Na jego stronie znajdziesz aktualną cenę za wiadomość, okno kontekstu i ID w API.",
      modelPageLink: "{{model}}: cena, kontekst i API",
      modelCompareLink: "{{model}} vs {{other}}: bezpośrednie starcie",
      moreTitle: "Więcej porównań",
      ctaSubtitle:
        "{{guestCredits}} darmowych kredytów miesięcznie. Bez konta, bez karty. Mainstream, open czy bez cenzury: zmieniasz przy każdej wiadomości.",
      ctaTry: "Zacznij czat incognito",
      ctaModels: "Przeglądaj wszystkie modele",
    },
  },
  us: {
    kind: "Czat z wieloma modelami: mainstream, open i bez cenzury",
    free: "Tak: {{guestCredits}} kredytów miesięcznie bez konta, {{freeCredits}} z kontem",
    paid: "Od {{subPrice}}/mies.",
    filterShort:
      "Sam ustawiasz poziom dla każdego czatu. Bez cenzury po jednorazowym potwierdzeniu 18+",
    privacyShort:
      "Czaty incognito zostają w Twojej przeglądarce. Prywatne czaty zapisujemy na Twoim koncie",
    apiShort: "Tak, zgodne z OpenAI i Anthropic (po zakupie)",
    mediaShort: "Obrazy, wideo, muzyka, głos",
    openShort: "Open source, self-hosting",
    price:
      "Plany: {{planList}} miesięcznie. Pakiety kredytów ({{packCredits}} kredytów za {{packPrice}}) doładowują aktywny plan i nigdy nie wygasają. Karta, PayPal albo krypto.",
    models:
      "{{modelCount}} modeli czatu od {{labCount}} laboratoriów: {{mainstream}} mainstream, {{open}} open, {{uncensored}} bez cenzury. {{refusalsRemoved}} modeli bez cenzury to modele mainstream lub open z wyciętymi odmowami. {{ownModel}} ma własny światopogląd: trenowano go na książkach i dokumentach usuniętych z mainstreamowego internetu.",
    filter:
      "Trzy poziomy: mainstream, open, bez cenzury. Model wybierasz przy każdej wiadomości. Modele bez cenzury odblokowujesz jednorazowym potwierdzeniem 18+. Żadnej dodatkowej warstwy odmów. Modele mainstream zachowują filtry swoich producentów.",
    privacy:
      "Czaty incognito są w pamięci lokalnej Twojej przeglądarki, nie na naszych serwerach, i działają bez konta. Prywatne czaty zapisujemy na Twoim koncie. Wygenerowane media trzymamy na naszych serwerach. Każda wiadomość przechodzi przez nas do dostawcy modelu, który na nią odpowiada.",
    api: "API /v1 zgodne z OpenAI i Anthropic: czat, obrazy, wideo i mowa. Odblokowuje się po dowolnym planie (od {{apiSubPrice}} miesięcznie) albo zakupie kredytów. Darmowe konta dostają HTTP 402.",
    media:
      "{{imageModels}} modeli obrazu, {{videoModels}} wideo, {{musicModels}} muzyki i {{voiceModels}} głosu na tym samym saldzie kredytów, dostępne z każdego czatu.",
    open: "Cała platforma jest open source na GitHubie. Postaw ją na własnym sprzęcie.",
    forWho:
      "Dla tych, którzy chcą modeli mainstream, open i bez cenzury oraz mediów w jednym czacie i na jednym saldzie, a filtr chcą ustawiać sami.",
  },
  links: {
    hub: "Najlepsze platformy AI bez cenzury: uczciwe porównanie",
    hubDesc:
      "Venice, NanoGPT, Gab AI, uncensored.ai, OpenRouter, Janitor AI, Character.AI, FreedomGPT, lokalne modele i więcej: ceny, filtry, prywatność i API, ze źródłami",
    versus: "{{appName}} vs {{name}}",
    sectionTitle: "Platformy AI bez cenzury w porównaniu",
    sectionIntro:
      "Venice, NanoGPT, Gab AI, uncensored.ai, OpenRouter, Janitor AI, Character.AI, FreedomGPT i więcej: ceny, filtry i prywatność prosto z ich własnych stron.",
  },
  platforms: {
    venice: {
      what: "Aplikacja AI stawiająca na prywatność: duży katalog modeli, wiele modeli tekstowych bez cenzury, generowanie obrazów, wideo i muzyki, API zgodne z OpenAI oraz warstwa stakingu krypto (VVV i DIEM).",
      pricingNote:
        "Za darmo: 10 promptów tekstowych i 15 obrazowych dziennie, tylko modele bazowe. 100 kredytów = 1 USD. Wideo, muzyka i modele frontier kosztują dodatkowe kredyty.",
      models:
        "420 modeli w dokumentacji (148 tekstowych). Około 17 modeli tekstowych ma etykietę uncensored, na czele Venice Uncensored 1.2 (Dolphin Mistral 24B Venice Edition), do tego wersje bez cenzury GLM, DeepSeek i Qwen. Są też Claude, GPT, Gemini i Grok.",
      filterShort: "Mature Filter domyślnie włączony, Pro może go wyłączyć",
      filter:
        "Mature Filter jest domyślnie włączony. Subskrybenci Pro wyłączają go w ustawieniach. Opcjonalny tryb Safe Venice, blokowany PIN-em, ukrywa postacie i obrazy dla dorosłych.",
      privacyShort: "Historia czatów zostaje na Twoim urządzeniu",
      privacy:
        "Venice deklaruje, że historia rozmów zostaje na Twoim urządzeniu i nigdy nie trafia na jej serwery. Przy modelach zewnętrznych w trybie Anonymous każe zakładać, że dostawca przechowuje Twoje treści.",
      apiShort: "",
      api: "API zgodne z OpenAI, rozliczane za tokeny w kredytach USD. Stakowany DIEM daje 1 USD kredytu API dziennie. Płatność za zapytanie bez konta w USDC przez x402.",
      forWho:
        "Dla dbających o prywatność, którzy chcą czatu i mediów bez cenzury w jednej aplikacji, oraz dla deweloperów i posiadaczy krypto.",
      pro1: "Duży katalog z wieloma modelami tekstowymi bez cenzury i tanie API bez cenzury.",
      pro2: "Historia domyślnie zostaje na Twoim urządzeniu.",
      con1: "Ciasny darmowy plan: 10 promptów tekstowych dziennie na modelach bazowych.",
      con2: "Wyłączenie filtra dla dorosłych i większość mediów wymagają Pro i kredytów.",
    },
    uncensoredAi: {
      what: "Czat bez cenzury z jednym modelem, forum społeczności i archiwami dokumentów. Web, iOS i Android.",
      pricingNote:
        "Za darmo: 3 odpowiedzi dziennie. Ceny Pro zablokowane dożywotnio. Karty, Cash App, Apple Pay i Bitcoin. Kredyty API sprzedawane osobno po 0,05 USD za wywołanie.",
      models:
        "Jeden model: UncensoredAI v1.2, kontekst 32K, trenowany na książkach i dokumentach usuniętych z mainstreamowego internetu. Jego poglądy polityczne idą pod prąd mainstreamu.",
      filterShort: "Brak opisanego filtra, 18+ w regulaminie",
      filter:
        "Nazywa się platformą AI bez ograniczeń. Regulamin wymaga ukończonych 18 lat i zakazuje treści mających krzywdzić, nękać lub narażać innych.",
      privacyShort: "Według polityki nie służy do treningu",
      privacy:
        "Polityka mówi, że Twoje dane nie służą do trenowania ani ulepszania modeli AI. Wiadomości przetwarza Parasail AI. Pro zachowuje historię czatów z wyszukiwaniem i eksportem.",
      apiShort: "",
      api: "API zgodne z OpenAI, gotowe do podmiany, 0,05 USD za inferencję.",
      forWho:
        "Dla tych, którzy nie ufają mainstreamowym narracjom i chcą dosadnych odpowiedzi na sporne tematy.",
      pro1: "Najtańszy płatny plan na tej liście, cena zablokowana dożywotnio.",
      pro2: "Według polityki prywatności dane nie służą do treningu.",
      con1: "Jeden model, kontekst 32K, bez generowania obrazów, wideo i muzyki.",
      con2: "Darmowy plan to 3 odpowiedzi dziennie; głos, foldery i archiwa wymagają Pro.",
    },
    nanoGpt: {
      what: "Aplikacja webowa i API w modelu płatności za użycie: modele tekstowe, obrazowe, wideo i audio. Subskrypcja niepotrzebna, opcjonalny plan na modele open.",
      pricingNote:
        "Doładowanie od 0,10 USD w krypto lub 1 USD kartą, bez opłat za wpłatę. Za darmo: jeden model, tylko w przeglądarce. PRO obejmuje tylko modele open source: Claude, GPT, Gemini i Grok schodzą z Twojego salda.",
      models:
        "631 modeli tekstowych w publicznym API, w tym około 39 bez cenzury lub abliterowanych: Venice Uncensored, GLM 5.3 Uncensored, DeepSeek V4.1 Flash Uncensored, Kimi K3.1 abliterated i inne. Są też modele mainstream.",
      filterShort: "Brak ogólnego zakazu NSFW, 18+",
      filter:
        "Regulamin wymaga 18+. Zakazuje CSAM, intymnych obrazów bez zgody i seksualnych deepfake'ów, a nie treści dla dorosłych w ogóle.",
      privacyShort: "Czaty w przeglądarce, konto niepotrzebne",
      privacy:
        "Rozmowy domyślnie zapisują się w przeglądarce, synchronizacja z chmurą jest opcjonalna. NanoGPT deklaruje, że nie loguje ani nie przechowuje promptów i odpowiedzi. Konto nie jest wymagane. Niektóre ścieżki dostawców pozwalają na trening.",
      apiShort: "",
      api: "API zgodne z OpenAI, także w formacie Anthropic Messages, z płatnościami x402 bez konta. Każda odpowiedź zwraca swój koszt.",
      forWho:
        "Dla płacących za użycie i deweloperów, którzy chcą każdego modelu, płatności krypto i zero subskrypcji.",
      pro1: "Ogromna lista modeli, ceny katalogowe, start od dziesięciu centów.",
      pro2: "Bez konta, czaty zostają w przeglądarce.",
      con1: "Darmowy plan to jeden model w przeglądarce.",
      con2: "Prywatność zależy od wybranej ścieżki dostawcy.",
    },
    openRouter: {
      what: "API dla deweloperów: jeden klucz do setek modeli od wielu dostawców, rozliczane za tokeny z przedpłaconych kredytów.",
      pricingNote:
        "Bez subskrypcji. Ceny katalogowe dostawców plus 5,5% opłaty od zakupu kredytów. Darmowe modele: 50 zapytań dziennie, 1000 po zakupie kredytów za 10 USD.",
      models:
        "474 modele, 15 darmowych. Opcji bez cenzury jest mało: Venice Uncensored (Dolphin Mistral 24B, hostowany przez Venice) i fine-tuny do roleplayu jak Hermes 4 i Magnum. 142 modele mają flagę moderacji.",
      filterShort: "Obowiązują zasady dostawców, wiele ścieżek moderowanych",
      filter:
        "Regulamin wymaga 18+. OpenRouter skanuje wejście pod kątem znanych materiałów CSAM. Każdy dostawca kontroluje swój model, a moderowane ścieżki odmawiają zgodnie z polityką producenta.",
      privacyShort: "Nie zapisuje promptów, chyba że się zgodzisz",
      privacy:
        "OpenRouter deklaruje, że nie przechowuje promptów ani odpowiedzi bez Twojej zgody. Metadane zapisuje zawsze. Zasady logowania u dostawców się różnią.",
      apiShort: "",
      api: "API zgodne z OpenAI. To jest cały produkt.",
      forWho:
        "Dla deweloperów, którzy chcą jednego klucza API do wielu modeli z przełączaniem dostawców.",
      pro1: "Ogromny katalog po cenach katalogowych, bez subskrypcji.",
      pro2: "Logowanie i trening tylko za Twoją zgodą.",
      con1: "Mało modeli bez cenzury.",
      con2: "Nie celuje w czat dla zwykłych użytkowników: interfejs dostarczasz sam.",
    },
    freedomGpt: {
      what: "Aplikacja AI wszystko w jednym: modele mainstream obok własnego modelu bez cenzury Liberty, z generowaniem obrazów i wideo. Do tego starsza aplikacja desktopowa open source do modeli offline.",
      pricingNote:
        "Za darmo, bez karty i konta. Pro zawiera 2200 kredytów miesięcznie: odpowiedź premium kosztuje około 10, obraz około 25, 5-sekundowe wideo około 400.",
      models:
        "ChatGPT, Claude, Gemini, Grok, DeepSeek, Qwen, Llama, Mistral i inne, plus Liberty i inne modele bez cenzury na tej samej liście. Łącznej liczby nie podaje.",
      filterShort: "Modele bez cenzury, zasady prawa USA i etyki",
      filter:
        "FreedomGPT deklaruje, że każdy użytkownik i każdy hostowany model musi przestrzegać prawa USA, i nie pozwala używać swoich modeli do celów nieetycznych. Etykieta „censor-free” nie gwarantuje odpowiedzi na każde zapytanie.",
      privacyShort: "Wiadomości trafiają do dostawców AI",
      privacy:
        "Polityka mówi, że wiadomości z czatu, nagrania głosowe i obrazy trafiają do zewnętrznych dostawców AI, żeby wygenerować odpowiedź. Okres przechowywania nie jest podany. Korzystanie bez konta nie sprawia, że zapytanie do chmury staje się lokalne.",
      apiShort: "",
      api: "API pod chat.freedomgpt.com/api/v1 z kluczem z panelu. Cennik nie jest udokumentowany.",
      forWho:
        "Dla tych, którzy chcą jednej subskrypcji na wiele modeli z opcjami bez cenzury.",
      pro1: "Darmowy start bez konta i karty.",
      pro2: "Obrazy i wideo w tej samej aplikacji.",
      con1: "Nadal obowiązuje prawo USA i zakaz nieetycznego użycia.",
      con2: "Aplikacja desktopowa open source nie była aktualizowana od czerwca 2024.",
    },
    gabAi: {
      what: "Platforma AI z wieloma modelami od Gab: 214 modeli, własny model Arya, tryb agenta, generowanie obrazów, wideo i muzyki oraz aplikacje desktopowe. Otwarcie prawicowe, chrześcijańskie pozycjonowanie.",
      pricingNote:
        "Za darmo: 250 kredytów po weryfikacji e-maila. Jednorazowe pakiety kredytów od 10 USD za 700 kredytów, nigdy nie wygasają.",
      models:
        "214 modeli na jednym koncie: GPT, Claude, Gemini, DeepSeek, Qwen, Kimi i inne. Arya to własny model Gab, zbudowany wokół wartości chrześcijańskich i zasad konserwatywnych.",
      filterShort: "Bez cenzury w poglądach, zakaz treści seksualnych",
      filter:
        "Regulamin wymaga 18+ i zakazuje treści obscenicznych, seksualnie dosłownych i pornograficznych. Automatyczne systemy mogą skanować treści pod kątem zgodności. Swoboda w polityce, nie w treściach dla dorosłych.",
      privacyShort: "Czaty zapisywane, służą do ulepszania modeli",
      privacy:
        "Gab trzyma Twoje prompty, odpowiedzi i historię na swoich serwerach, a jako jeden z celów podaje ulepszanie swoich modeli. Zapytania trafiają do dostawców modeli przez własne konta Gab; według polityki nie czyni to zapytania anonimowym.",
      apiShort: "",
      api: "API zgodne z OpenAI i Anthropic. Wymaga planu Plus.",
      forWho:
        "Dla konserwatywnych i chrześcijańskich użytkowników, którzy chcą AI zbudowanego poza Big Tech.",
      pro1: "Duży katalog, tryb agenta i aplikacje desktopowe.",
      pro2: "Pakiety kredytów nigdy nie wygasają.",
      con1: "Zakaz treści seksualnych: nie pomoże przy fikcji dla dorosłych.",
      con2: "Prompty zapisywane i używane do ulepszania modeli.",
    },
    janitorAi: {
      what: "Społecznościowa strona z postaciami: miliony botów od użytkowników, darmowy wbudowany model (JLLM) i opcja podpięcia własnego modelu przez proxy API.",
      pricingNote:
        "Za darmo: nielimitowane czaty na standardowych modelach, około 9K tokenów kontekstu. janitor+ daje 5x więcej pamięci postaci, priorytetową szybkość i więcej modeli. Jego Router rozlicza inne modele za tokeny, tylko w przeglądarce, tylko dla subskrybentów.",
      models:
        "JLLM, własny darmowy model (model bazowy nieujawniony). Albo dowolny model podpięty przez proxy: oficjalny poradnik używa OpenRouter.",
      filterShort: "Boty NSFW dozwolone z tagiem, 18+ na słowo",
      filter:
        "Tylko dla dorosłych, 18+ na podstawie oświadczenia. Boty mają tag Limited (bez treści seksualnych) albo Limitless (NSFW dozwolone). Aplikacja mobilna startuje w Safe Mode, dopóki nie włączysz NSFW w wersji webowej. Zakazane: wszystko seksualne z udziałem nieletnich, przemoc seksualna, gore, zoofilia, mowa nienawiści.",
      privacyShort: "Czaty zapisywane, służą do badań i rozwoju",
      privacy:
        "Czaty zapisuje jako treści użytkownika, a polityka wymienia badania i rozwój w celu ulepszania jego systemów AI. Z proxy Twoje wiadomości trafiają też do tamtego dostawcy, na jego zasadach.",
      apiShort: "Własny klucz",
      api: "Brak API dla deweloperów. Janitor sam korzysta z API: możesz podpiąć własny klucz przez proxy.",
      forWho:
        "Dla fanów roleplayu, którzy chcą ogromnej darmowej biblioteki postaci od społeczności.",
      pro1: "Darmowy, nielimitowany czat z milionami botów społeczności.",
      pro2: "Własny model przez proxy.",
      con1: "Darmowy kontekst to około 9K tokenów: długie historie zapominają początkowe sceny.",
      con2: "Tylko tekst: bez generowania obrazów, wideo i głosu.",
    },
    sillyTavern: {
      what: "Darmowy frontend czatu open source (AGPL-3.0), który instalujesz sam. Karty postaci, lorebooki, rozszerzenia. Nie zawiera modelu: podpinasz własny.",
      pricingNote:
        "Aplikacja jest darmowa na zawsze. Płacisz za podpięte API albo nic, jeśli model działa lokalnie.",
      models:
        "Brak w zestawie. Łączy się z lokalnymi backendami (KoboldCpp, llama.cpp, Ollama, text-generation-webui) i około 16 API w chmurze, w tym OpenAI, Claude, Google, Mistral, DeepSeek, OpenRouter i każdym endpointem zgodnym z OpenAI.",
      filterShort: "Brak własnego: decyduje model",
      filter:
        "Brak własnego filtra. Granice wyznacza podpięty model lub dostawca.",
      privacyShort: "Lokalna instalacja, bez śledzenia",
      privacy:
        "Projekt deklaruje, że nie oferuje usług hostowanych i nie śledzi danych użytkowników. Czaty zapisują się na Twoim komputerze. To, co wysyłasz do API w chmurze, podlega polityce tamtego dostawcy.",
      apiShort: "Łączy się z API",
      api: "Klient, nie dostawca. Rozmawia z API, które skonfigurujesz.",
      forWho:
        "Dla zaawansowanych, którzy przyjmą stromą krzywą nauki w zamian za pełną kontrolę nad promptami i postaciami.",
      pro1: "Maksimum kontroli: dowolny backend, dowolny prompt, bogate rozszerzenia.",
      pro2: "Darmowy, open source, nic nie opuszcza Twojego komputera poza tym, co wyślesz do API.",
      con1: "Sam instalujesz, utrzymujesz i dostarczasz model.",
      con2: "Stroma krzywa nauki, jak przyznaje sam projekt.",
    },
    characterAi: {
      what: "Największa mainstreamowa platforma czatu z postaciami, ponad 10 mln postaci na własnych modelach, ze ścisłymi zasadami treści. Jest tu jako kontrast z filtrem.",
      pricingNote:
        "Za darmo: nielimitowane wiadomości z reklamami. lite usuwa większość reklam (cena USA, zależy od kraju). c.ai+ daje najlepsze modele czatu, lepszą pamięć i brak slow mode.",
      models:
        "Tylko własne modele, jako style czatu (PipSqueak, DeepSqueak, LongSqueak). Poza nimi brak wyboru modelu i własnego klucza.",
      filterShort: "Z filtrem, pornografia nigdy",
      filter:
        "Treści pornograficzne łamią regulamin i, jak sam pisze, nie będą wspierane nigdy w przyszłości. Każdy użytkownik przechodzi weryfikację wieku przez Persona. Zweryfikowani poniżej 18 lat dostają tylko tryb czytania, bez czatu.",
      privacyShort: "Czaty mogą trenować modele i targetować reklamy",
      privacy:
        "Polityka prywatności mówi, że informacje służą do trenowania jego modeli AI i do reklam dopasowanych do Ciebie.",
      apiShort: "",
      api: "Brak publicznego API dla deweloperów.",
      forWho:
        "Rozrywkowy czat bez treści dla dorosłych z gigantyczną biblioteką postaci.",
      pro1: "Ogromna biblioteka postaci i nielimitowane darmowe wiadomości.",
      pro2: "Tani start z lite, rozmowy głosowe z postaciami.",
      con1: "Zero treści dla dorosłych, nigdy. Mroczne sceny są łagodzone lub odrzucane.",
      con2: "Czaty mogą służyć do treningu i reklam. Brak wyboru modelu.",
    },
    kindroid: {
      what: "Aplikacja z towarzyszem AI: jeden stały przyjaciel lub partner z długą pamięcią, rozmowami głosowymi i wideo, selfie i czatami grupowymi.",
      pricingNote:
        "Brak stałego darmowego planu: podgląd na 50 wiadomości, potem tylko odczyt. Ultra i MAX to miesięczne dodatki na wierzch. Ceny z amerykańskiego App Store; Kindroid podaje, że zakup przez web jest zwykle tańszy.",
      models:
        "Własne modele (Polaris, Ember, Reverie i inne) oraz własne modele do selfie. Bez własnego klucza.",
      filterShort: "Deklaruje brak filtra, czerwone linie na poziomie konta",
      filter:
        "Nazywa się naprawdę bez filtra i nie nakłada filtra na samo AI, ale skanuje wiadomości pod kątem kilku czerwonych linii, jak bezpośrednie ryzyko samookaleczenia lub krzywdy innych. 18+: płatna subskrypcja liczy się jako weryfikacja wieku, alternatywą jest Yoti.",
      privacyShort: "Szyfrowanie w spoczynku, nie end-to-end",
      privacy:
        "Czaty są szyfrowane w spoczynku i w transmisji, ale nie end-to-end: jego systemy przetwarzają treść, a automatyczne systemy bezpieczeństwa ją przeglądają. Deklaruje, że danych nigdy nie sprzedaje.",
      apiShort: "Osobiste API do Twoich towarzyszy",
      api: "Osobiste klucze API do rozmów z Twoimi Kindroidami, nie ogólne API modeli.",
      forWho:
        "Dla dorosłych, którzy chcą jednego długoterminowego towarzysza AI z głosem, wideo i zdjęciami.",
      pro1: "Pełen pakiet towarzysza: pamięć, selfie, głos i rozmowy wideo na żywo.",
      pro2: "Podejście bez filtra, skierowane do dorosłych.",
      con1: "Po 50 wiadomościach płacisz, żeby rozmawiać dalej.",
      con2: "Najwyższe poziomy pamięci się sumują: Ultra i MAX na wierzch planu bazowego.",
    },
    nomi: {
      what: "Aplikacja z towarzyszem AI zbudowana wokół długiej pamięci: przyjaciel, partner lub mentor, z selfie, głosem i czatami grupowymi.",
      pricingNote:
        "Darmowy plan z dziennym limitem wiadomości i obrazów (limitów nie podaje). Subskrypcja odblokowuje nielimitowane wiadomości i głos. Ceny z amerykańskiego App Store; brak publicznego cennika w sieci.",
      models: "Własne modele, publicznie nienazwane. Bez własnego klucza.",
      filterShort: "Tekst bez filtra, filtr nagości na obrazach",
      filter:
        "Strona mówi, że rozmów nie ograniczają arbitralne filtry treści. Obrazy mają filtr nagości ze względu na sklepy z aplikacjami i operatorów płatności. Osoby poniżej 18 lat nie mogą z niego korzystać.",
      privacyShort: "Nigdy nie sprzedaje, usuwa razem z kontem",
      privacy:
        "Polityka mówi, że danych osobowych nigdy nie sprzedaje ani nie wynajmuje i nie trzyma ich po usunięciu konta (w ciągu około 28 dni).",
      apiShort: "Osobiste API do Twoich towarzyszy",
      api: "REST API do czatu z Twoimi Nomi, nie ogólne API modeli.",
      forWho:
        "Dla tych, którzy chcą emocjonalnego, długoterminowego towarzysza, który pamięta.",
      pro1: "Pamięć zbudowana pod długie relacje.",
      pro2: "Darmowy plan i jasne stanowisko: dane nie są na sprzedaż.",
      con1: "Filtr nagości na obrazach.",
      con2: "Głos tylko w subskrypcji, darmowe limity nieopublikowane.",
    },
    crushOn: {
      what: "Strona z czatem NSFW z postaciami, z przełącznikiem Unfiltered i dostępem do zewnętrznych modeli rozliczanym w kredytach.",
      pricingNote:
        "Za darmo: 100 kredytów na wiadomości miesięcznie, nielimitowane darmowe modele, historia kasowana po 7 dniach nieaktywności. Plany roczne są tańsze. Modele Pro wymagają członkostwa lub osobnego pakietu.",
      models:
        "Zewnętrzne modele przydzielane według poziomu; strona wymienia Claude 4, Gemini 2.5 Flash, GPT-4.1 i DeepSeek V4. Pełna lista po zalogowaniu.",
      filterShort: "Przełącznik Unfiltered po weryfikacji wieku",
      filter:
        "Przełącznik Unfiltered odblokowuje tekst dla dorosłych po weryfikacji wieku: selfie lub dokument przez Didit, AgeGo albo płatność 0,99 USD. Zasady nadal zakazują dosłownych obrazów seksualnych, realistycznych obrazów prawdziwych osób, nieletnich i postaci „postarzonych”.",
      privacyShort: "Czaty mogą trenować modele",
      privacy:
        "Polityka mówi, że treść czatów może służyć do trenowania jego modeli, bez powiązania z konkretnymi użytkownikami. Ciasteczka służą do retargetingu reklam.",
      apiShort: "",
      api: "Brak publicznego API dla deweloperów.",
      forWho:
        "Dla dorosłych, którzy chcą pikantnego czatu z postaciami w gotowej aplikacji.",
      pro1: "Roleplay dla dorosłych w dopracowanej aplikacji, darmowy start.",
      pro2: "Weryfikacja wieku, przy której według CrushOn serwis nigdy nie widzi Twojego zdjęcia ani dokumentu.",
      con1: "Sześć poziomów kredytów, do 199,99 USD miesięcznie: trudno przewidzieć koszt.",
      con2: "Darmowa historia kasowana po 7 dniach nieaktywności; czaty mogą trenować modele.",
    },
    ollama: {
      what: "Darmowe narzędzie na licencji MIT, które pobiera i uruchamia modele open na Twoim komputerze, z lokalnym API. Sprzedaje też hostowane modele w chmurze.",
      pricingNote:
        "Uruchamianie modeli na własnym sprzęcie jest darmowe i bez limitów. Płatne plany dotyczą tylko modeli w chmurze.",
      models:
        "Dowolny model open z jego biblioteki, w tym Dolphin 3 i abliterowane wersje od społeczności, jak Qwen 3.8 abliterated. Ollama nie weryfikuje wgrań społeczności.",
      filterShort: "Zależy od wczytanego modelu",
      filter:
        "Lokalnie brak własnego filtra. Model abliterowany nie odmawia. Model fabryczny zachowuje odmowy, których go nauczono.",
      privacyShort: "W pełni lokalnie, prompty nie opuszczają komputera",
      privacy:
        "Ollama deklaruje, że przy pracy lokalnej nie widzi Twoich promptów ani danych. Chmurę można całkowicie wyłączyć.",
      apiShort: "",
      api: "Serwer zgodny z OpenAI na localhost:11434 plus API w chmurze dla hostowanych modeli.",
      forWho:
        "Dla deweloperów i technicznych użytkowników z mocnym komputerem, często w parze z frontendem czatu.",
      pro1: "Pełna prywatność i zero kosztów za wiadomość.",
      pro2: "Ogromna biblioteka, lokalne API zgodne z OpenAI.",
      con1: "Sprzęt ogranicza jakość: model 70B to 43 GB do pobrania, zanim doliczysz kontekst.",
      con2: "Głównie CLI i API: interfejs czatu dodajesz sam.",
    },
    lmStudio: {
      what: "Aplikacja desktopowa z dopracowanym interfejsem do pobierania i uruchamiania lokalnych modeli (GGUF i MLX), plus lokalny serwer API.",
      pricingNote:
        "Darmowa do użytku domowego i w pracy od lipca 2025. Płatne plany dodają hostowane modele i więcej urządzeń.",
      models:
        "Lokalne modele z Hugging Face, w tym abliterowane wersje GGUF i Dolphin.",
      filterShort: "Zależy od wczytanego modelu",
      filter:
        "Brak własnego filtra dla modeli lokalnych. Odmawia tylko model, który wybierzesz.",
      privacyShort: "Lokalna inferencja zostaje na Twoim urządzeniu",
      privacy:
        "Lokalne modele działają na Twoim urządzeniu. Usługi hostowane deklarują zerową retencję danych.",
      apiShort: "",
      api: "Serwer zgodny z OpenAI na localhost:1234.",
      forWho:
        "Dla nie-programistów, którzy chcą lokalnych modeli bez wiersza poleceń: Mac z Apple Silicon, Windows lub Linux.",
      pro1: "Najprostszy sposób na lokalne modele bez cenzury.",
      pro2: "Darmowa, także do użytku komercyjnego.",
      con1: "Sama aplikacja ma zamknięty kod. Nie działa na Macach z Intelem.",
      con2: "Ten sam sufit sprzętowy co w każdej lokalnej konfiguracji.",
    },
  },
  hub: {
    meta: {
      title: "Najlepsze AI bez cenzury 2026: uczciwe porównanie",
      category: "Porównanie",
      description:
        "{{count}} platform AI bez cenzury w porównaniu: Venice, NanoGPT, Janitor AI, FreedomGPT, Kindroid, lokalne modele i więcej. Ceny, filtry, prywatność, API. Ze źródłami.",
      imageAlt: "Platformy AI bez cenzury porównane obok siebie",
      keywords:
        "AI bez cenzury, najlepsze AI bez cenzury, czat AI bez cenzury, AI bez filtrów, sztuczna inteligencja bez cenzury, chatbot bez cenzury, NSFW AI czat, alternatywa dla Character AI, Venice AI alternatywa, Venice AI opinie, NanoGPT, Janitor AI po polsku, Janitor AI alternatywa, FreedomGPT, Gab AI, uncensored.ai, Kindroid, Nomi, CrushOn AI, SillyTavern, Ollama bez cenzury, LM Studio bez cenzury, modele abliterowane, best uncensored AI, uncensored AI chat, {{appName}}",
    },
    hero: {
      category: "Porównanie",
      readTime: "14 min czytania",
      title: "Najlepsze platformy AI bez cenzury 2026: uczciwe porównanie",
      subtitle:
        "{{count}} platform, plus my. Prawdziwe ceny z ich własnych cenników, jak każda filtruje, co dzieje się z Twoimi czatami i dla kogo jest. Każdy fakt ma źródło.",
    },
    intro: {
      lead: "Każda strona z AI bez cenzury nazywa się najbardziej prywatną, najbardziej wolną, najmniej filtrowaną. Połowa i tak zakazuje treści dla dorosłych. Niektóre trenują na Twoich czatach. Jedna sprzedaje Ci token. Strony marketingowe nie powiedzą Ci, która.",
      p2: "Więc sprawdziliśmy. Cennik, regulamin, politykę prywatności i dokumentację API każdej platformy, stan na {{date}}. Poniżej: szybki wybór do każdego zadania, pełna tabela, karta każdej platformy ze źródłami i sytuacje, w których nie warto wybierać nas.",
      disclosure:
        "Jawnie: {{appName}} jest jedną z platform na tej stronie i kupujemy od kilku pozostałych. Venice, uncensored.ai, NanoGPT, FreedomGPT, Gab AI i OpenRouter dostarczają część naszych modeli przez swoje API. Mówimy gdzie, z liczbami na żywo. Bez ocen, bez gwiazdek: fakty i źródła, oceniasz Ty.",
    },
    picks: {
      title: "Szybki wybór: najlepsze AI bez cenzury do każdego zadania",
      intro:
        "Żadna platforma nie wygrywa wszystkiego. Zacznij od tego, czego potrzebujesz.",
      oneApp: {
        title: "Wszystko w jednym czacie: {{appName}}",
        body: "{{modelCount}} modeli, w tym {{uncensored}} bez cenzury, obok Claude, GPT i Gemini. Obrazy, wideo, muzyka i głos na tym samym saldzie. Model zmieniasz przy każdej wiadomości.",
      },
      ownWorldview: {
        title:
          "Inny światopogląd, nie tylko mniej odmów: model od uncensored.ai",
        body: "Większość modeli bez cenzury to modele mainstream z wyciętymi odmowami. uncensored.ai sprzedaje jeden model z własnymi poglądami. W {{appName}} działa jako {{ownModel}}, obok całej reszty.",
      },
      privacy: {
        title: "Czaty, które nie dotykają serwera: Venice lub NanoGPT",
        body: "Obie domyślnie trzymają historię w przeglądarce. NanoGPT w ogóle nie wymaga konta. W {{appName}} tak samo działają czaty incognito.",
      },
      roleplay: {
        title: "Roleplay z postaciami społeczności: Janitor AI lub SillyTavern",
        body: "Janitor AI, jeśli chcesz ogromnej darmowej biblioteki botów. SillyTavern, jeśli chcesz pełnej kontroli i skonfigurujesz wszystko sam.",
      },
      companions: {
        title: "Jeden długoterminowy towarzysz AI: Kindroid lub Nomi",
        body: "Pamięć, selfie, rozmowy głosowe. Kindroid nie ma stałego darmowego planu; Nomi ma, ale filtruje nagość na obrazach.",
      },
      developers: {
        title: "API do modeli bez cenzury: NanoGPT, Venice lub OpenRouter",
        body: "NanoGPT i Venice mają wiele modeli bez cenzury w niskich cenach za token. OpenRouter ma najszerszy katalog, ale mało opcji bez cenzury.",
      },
      local: {
        title:
          "Pełna prywatność, zero kosztów za wiadomość: Ollama lub LM Studio",
        body: "Uruchamiaj modele abliterowane na własnym komputerze. Nic go nie opuszcza. Twój sprzęt wyznacza sufit jakości.",
      },
      filtered: {
        title: "Chcesz filtra: Character.AI",
        body: "Bez treści dla dorosłych z założenia, z weryfikacją wieku dla wszystkich. Dobry wybór dla nastolatków albo surowego miejsca pracy.",
      },
    },
    table: {
      title: "Wszystkie {{count}} platformy i {{appName}} obok siebie",
      intro:
        "Na telefonie przewiń w bok. Dane konkurencji sprawdzone {{date}} na ich własnych stronach, nasze czytane na żywo z naszej konfiguracji.",
      footnote:
        "Ceny to ceny katalogowe w USD z własnej strony każdej platformy; Kindroid i Nomi pokazują ceny dopiero przy zakupie po zalogowaniu, więc ich ceny pochodzą z amerykańskiego App Store. Podatki, ceny regionalne i promocje się różnią. „Ograniczone” oznacza dostęp przez własny klucz, dodatek albo osobiste API do towarzysza.",
    },
    kinds: {
      title: "„Bez cenzury” to nie jedno: cztery rodzaje filtrowania",
      intro:
        "Zanim porównasz platformy, sprawdź, co kryje etykieta. Model decyduje o więcej niż aplikacja.",
      abliterated:
        "Abliterowane: model mainstream lub open z kierunkiem odmowy usuniętym z wag. Badacze odkryli, że odmowa siedzi w jednym kierunku wewnątrz modelu; wytnij go, a model przestaje mówić nie. Ta sama wiedza, ten sam światopogląd, zero wykrętów.",
      finetuned:
        "Fine-tuny bez cenzury (Dolphin, Venice Uncensored): douczone na danych bez odmów. Ten sam cel, inna metoda.",
      ownWorldview:
        "Własny światopogląd: {{ownModel}} trenowano na książkach i dokumentach usuniętych z mainstreamowego internetu. Nie tylko przestaje odmawiać. Broni poglądów, których modele mainstream Ci nie dadzą.",
      filtered:
        "Z filtrem: modele mainstream i aplikacje jak Character.AI. Warstwa bezpieczeństwa decyduje, zanim zaczniesz pisać. Na większości platform „bez cenzury” modele mainstream też zachowują filtry producentów.",
      tradeoff:
        "Cena za to: sama publikacja o abliteracji zmierzyła spadek jakości w każdym benchmarku, częściowo odrobiony dodatkowym treningiem. Modele bez cenzury są zwykle mniejsze od modeli frontier. Używaj ich do tego, co blokuje filtr, nie do najtrudniejszego rozumowania.",
      sourceName: "Abliteracja",
    },
    platforms: {
      title: "Każda platforma w szczegółach",
      intro:
        "Czym jest, ile kosztuje, jak filtruje, dokąd trafiają Twoje czaty i skąd to wiemy. Sprawdzone {{date}}.",
      price: "Cena: {{plans}}. {{note}}",
      models: "Modele: {{text}}",
      filter: "Filtr i zgoda: {{text}}",
      privacy: "Prywatność: {{text}}",
      api: "API: {{short}}. {{text}}",
      media: "Media: {{text}}",
      open: "Open source: {{text}}",
      forWho: "Dla kogo: {{text}}",
      strengths: "Mocne strony",
      limits: "Ograniczenia",
      sources: "Źródła, sprawdzone {{date}}",
    },
    upstream:
      "{{appName}} uruchamia {{models}} modeli przez API platformy {{name}} (w tym {{uncensored}} bez cenzury), m.in. {{examples}}. Te same modele, nasz czat, nasze rozliczenia.",
    us: {
      title: "Gdzie pasuje {{appName}}, uczciwie",
      intro:
        "Nie jesteśmy laboratorium modeli. Jesteśmy czatem, który zbiera każdy rodzaj modelu w jednym miejscu i daje Ci wybór filtra.",
      models:
        "{{modelCount}} modeli czatu od {{labCount}} laboratoriów: {{mainstream}} mainstream, {{open}} open, {{uncensored}} bez cenzury. Model wybierasz przy każdej wiadomości, więc w jednym wątku możesz mieszać Claude i model abliterowany.",
      upstream:
        "Nasze modele bez cenzury pochodzą od dostawców z tej strony. Venice obsługuje {{veniceModels}} naszych modeli, NanoGPT {{nanoGptModels}}, uncensored.ai {{uncensoredAiModels}}, FreedomGPT {{freedomGptModels}}, Gab AI {{gabAiModels}}. Agregujemy, nie trenujemy.",
      consent:
        "Modele bez cenzury odblokowujesz jednorazowym potwierdzeniem 18+. Żadnej dodatkowej warstwy odmów. O tym, co czytasz, decydujesz Ty, nie korporacja.",
      privacy:
        "Czaty incognito są w Twojej przeglądarce, nie na naszych serwerach, i nie wymagają konta. Prywatne czaty synchronizują się z Twoim kontem. Każda wiadomość i tak przechodzi przez nas do dostawcy, który odpowiada.",
      pricing:
        "{{guestCredits}} darmowych kredytów miesięcznie bez konta, {{freeCredits}} z kontem. Plany: {{planList}} miesięcznie. Pakiety kredytów doładowują aktywny plan i nigdy nie wygasają. Karta, PayPal albo krypto.",
      api: "API zgodne z OpenAI i Anthropic: czat, obrazy, wideo i mowa, po dowolnym planie (od {{apiSubPrice}}) albo zakupie kredytów.",
      media:
        "{{imageModels}} modeli obrazu, {{videoModels}} wideo, {{musicModels}} muzyki i {{voiceModels}} głosu na tym samym saldzie.",
      open: "Cała platforma jest open source. Postaw ją u siebie, jeśli nie chcesz żadnego pośrednika.",
      weakTitle: "Gdzie nie jesteśmy najlepszym wyborem",
      weak1:
        "Cena za token: doliczamy {{markup}}% do kosztów dostawcy. Jeśli chcesz modeli tylko jednego dostawcy, bezpośrednio w Venice lub NanoGPT wyjdzie taniej.",
      weak2:
        "Biblioteka postaci: Janitor AI i Character.AI mają miliony botów społeczności. Nasza jest dużo mniejsza, choć postacie możesz importować z linków Character.AI i Talkie.",
      weak3:
        "Funkcje towarzysza: brak selfie i rozmów wideo na żywo jak w Kindroid czy Nomi. Jesteśmy przestrzenią do pracy z czatem, nie aplikacją z towarzyszem.",
      weak4:
        "Pełna prywatność: lokalny model na Twoim komputerze bije każdą usługę hostowaną, nas też.",
      modelsLink: "Zobacz wszystkie {{modelCount}} modele z cenami na żywo",
      pricingLink: "Plany i darmowe kredyty",
      guideLink: "Poradnik: każdy model bez cenzury i do czego się nadaje",
    },
    versus: {
      title: "Porównania jeden na jeden",
      intro:
        "{{versusCount}} platform, z którymi najczęściej nas porównujecie, każda na osobnej stronie z plusami, minusami i jasnym wyborem.",
    },
    method: {
      title: "Jak porównywaliśmy",
      intro: "Zasady, których się trzymaliśmy. Sprawdzone {{date}}.",
      sources:
        "Tylko oficjalne strony: cennik, regulamin, polityka prywatności, centrum pomocy, dokumentacja API lub lista modeli każdej platformy. Serwisy z recenzjami nigdy nie były źródłem.",
      prices:
        "Ceny to ceny katalogowe w USD z danego dnia. Gdy cena była za logowaniem, braliśmy oficjalny wpis w sklepie z aplikacjami i to zaznaczamy.",
      noScores:
        "Bez ocen, bez rankingów, bez odznaki zwycięzcy. Różne zadania wymagają różnych platform.",
      us: "Nasze liczby (modele, ceny, darmowe kredyty) czytamy na żywo z konfiguracji, która Cię rozlicza, więc nie mogą rozjechać się z tym, co płacisz.",
      bias: "Jesteśmy konkurentem i klientem kilku platform z tej strony. Mówimy, gdzie do nich kierujemy zapytania, i wymieniamy sytuacje, w których lepiej wybrać kogoś innego.",
      changes:
        "Plany i zasady się zmieniają. Każda karta linkuje swoje źródła: sprawdź je przed zakupem. Gdy strona czegoś nie podawała, pominęliśmy to zamiast zgadywać.",
      corrections:
        "Znalazłeś nieaktualną cenę albo błędne twierdzenie? Napisz z linkiem do źródła, a poprawimy.",
      correctionsLink: "Kontakt",
    },
    faq: {
      title: "FAQ",
      best: {
        q: "Jakie jest najlepsze AI bez cenzury?",
        a: "Zależy od zadania. Wiele modeli i media w jednym czacie: {{appName}}. Czat stawiający na prywatność: Venice lub NanoGPT. Roleplay ze społecznością: Janitor AI lub SillyTavern. Towarzysz: Kindroid lub Nomi. Pełna prywatność: lokalny model w Ollama lub LM Studio.",
      },
      free: {
        q: "Czy jest darmowe AI bez cenzury?",
        a: "Tak, z limitami. Venice daje 10 promptów tekstowych dziennie, uncensored.ai 3 odpowiedzi, Janitor AI nielimitowany czat na własnym modelu, CrushOn 100 kredytów miesięcznie, {{appName}} {{guestCredits}} kredytów miesięcznie bez konta. Lokalne modele w Ollama lub LM Studio nic nie kosztują za wiadomość.",
      },
      private: {
        q: "Które AI bez cenzury jest najbardziej prywatne?",
        a: "Lokalny model: nic nie opuszcza Twojego komputera. Z usług hostowanych Venice i NanoGPT domyślnie trzymają historię w przeglądarce, a NanoGPT nie wymaga konta. W {{appName}} czaty incognito zostają w Twojej przeglądarce. Każda usługa hostowana i tak wysyła Twoją wiadomość do dostawcy modelu.",
      },
      difference: {
        q: "Czym różnią się modele abliterowane od modeli bez cenzury?",
        a: "Modele abliterowane to modele mainstream lub open z kierunkiem odmowy wyciętym z wag: ta sama wiedza, ten sam światopogląd, zero odmów. Fine-tuny jak Dolphin osiągają to douczaniem. {{ownModel}} to jeszcze coś innego: trenowany na książkach i dokumentach usuniętych z mainstreamowego internetu, z własnymi poglądami.",
      },
      veniceVs: {
        q: "Czy Venice AI jest naprawdę bez cenzury?",
        a: "Jej modele bez cenzury tak, a Mature Filter jest domyślnie włączony, dopóki subskrybent Pro go nie wyłączy. Modele mainstream (Claude, GPT, Gemini) zachowują filtry swoich producentów, jak wszędzie.",
      },
      characterAi: {
        q: "Czy jest Character.AI bez filtra?",
        a: "Nie od Character.AI: platforma mówi, że treści pornograficzne nigdy nie będą wspierane. Alternatywy z roleplayem dla dorosłych: Janitor AI (boty Limitless), CrushOn (przełącznik Unfiltered), Kindroid, SillyTavern z modelem bez cenzury albo {{appName}} z modelami do roleplayu bez cenzury.",
      },
      gabAi: {
        q: "Czy Gab AI jest bez cenzury?",
        a: "W polityce, kulturze i wierze tak: do tego zbudowano jego własny model Arya. W treściach dla dorosłych nie: regulamin zakazuje treści seksualnie dosłownych. {{appName}} też ma Aryę, obok modeli bez cenzury, które pozwalają na fikcję dla dorosłych.",
      },
      uncensoredAi: {
        q: "Czym uncensored.ai różni się od innych AI bez cenzury?",
        a: "Większość AI bez cenzury to modele mainstream z wyciętymi odmowami. Model uncensored.ai trenowano na książkach i dokumentach usuniętych z mainstreamowego internetu, więc jego poglądy polityczne idą pod prąd mainstreamu. W {{appName}} działa jako {{ownModel}}.",
      },
      openRouter: {
        q: "Czy OpenRouter ma modele bez cenzury?",
        a: "Kilka: Venice Uncensored i fine-tuny do roleplayu jak Hermes 4 i Magnum, a 142 z jego 474 modeli mają flagę moderacji. Jeśli chcesz większego wyboru bez cenzury w jednym API, NanoGPT, Venice i {{appName}} mają ich dużo więcej.",
      },
      local: {
        q: "Czy mogę uruchomić AI bez cenzury na własnym komputerze?",
        a: "Tak. Ollama lub LM Studio plus model abliterowany albo Dolphin. Model 8B to 5 GB do pobrania i działa na typowym laptopie. Model 70B potrzebuje ponad 40 GB pamięci. Jakość ogranicza Twój sprzęt.",
      },
      legal: {
        q: "Czy korzystanie z AI bez cenzury jest legalne?",
        a: "W większości krajów korzystanie jest legalne. To, co generujesz i publikujesz, nadal podlega prawu w miejscu, gdzie mieszkasz. Każda platforma tutaj zakazuje treści z udziałem nieletnich, a większość zakazuje obrazów prawdziwych osób bez ich zgody.",
      },
    },
    cta: {
      title: "Sprawdź na własnych promptach",
      subtitle:
        "{{guestCredits}} darmowych kredytów miesięcznie, bez konta. Zadaj pytanie, którego gdzie indziej odmówiono, i porównaj.",
      try: "Zacznij czat incognito",
      models: "Przeglądaj wszystkie modele",
    },
  },
  versus: {
    venice: {
      meta: {
        title: "Venice AI alternatywa: {{appName}} vs Venice AI 2026",
        description:
          "{{appName}} vs Venice.ai: ceny, modele bez cenzury, Mature Filter, prywatność i API obok siebie. Kupujemy od Venice, więc mówimy dokładnie, kto gdzie wygrywa.",
        keywords:
          "Venice AI alternatywa, Venice AI opinie, Venice AI cena, Venice AI bez cenzury, czy Venice AI jest bez cenzury, Venice AI Mature Filter, Venice Pro, Venice AI API, czat AI bez cenzury, AI bez cenzury, Venice AI alternative, Venice.ai vs, Venice AI review, Venice uncensored, VVV DIEM, {{appName}} vs Venice",
      },
      hero: {
        title: "{{appName}} vs Venice AI",
        subtitle:
          "Dwie platformy AI bez cenzury, z których jedna kupuje od drugiej. Ceny, filtry, prywatność i API obok siebie.",
        readTime: "7 min czytania",
      },
      intro: {
        lead: "Venice to najbardziej znana marka prywatnego AI bez cenzury. Wiele naszych modeli bez cenzury działa na API Venice. To więc nie jest atak. To uczciwa odpowiedź na jedno pytanie: korzystać z Venice bezpośrednio czy przez {{appName}}?",
        p2: "Dane o Venice z jej cennika, polityki prywatności i dokumentacji, sprawdzone {{date}}. Nasze czytane na żywo z naszej konfiguracji.",
      },
      relation:
        "Jesteśmy klientem Venice: {{veniceModels}} naszych modeli działa przez API Venice (w tym {{veniceUncensored}} bez cenzury), m.in. {{veniceExamples}}. Te same modele, inna aplikacja wokół nich.",
      verdict:
        "Wybierz Venice, jeśli chcesz jej pełnego katalogu, historii tylko na urządzeniu i najniższej ceny za token na jej własnych modelach, a zapłata za Pro, żeby zdjąć Mature Filter, Ci nie przeszkadza. Wybierz {{appName}}, jeśli chcesz modeli bez cenzury od Venice obok Claude, GPT, modelu od uncensored.ai oraz abliterowanych wersji GLM i DeepSeek od innych dostawców, w jednym czacie, bez filtra do odblokowania poza jednorazowym potwierdzeniem 18+.",
      themPros: {
        a: "Większy katalog: 420 modeli w dokumentacji, w tym wideo, muzyka i głos.",
        b: "Historia domyślnie zostaje na Twoim urządzeniu. Mocna historia prywatności.",
        c: "Najtańszy dostęp do własnych modeli Venice: bez marży pośrednika, plus staking DIEM za dzienny kredyt API.",
      },
      themCons: {
        a: "Darmowy plan: 10 promptów tekstowych dziennie, tylko modele bazowe.",
        b: "Mature Filter jest domyślnie włączony. Wyłączenie wymaga Pro.",
        c: "Tylko oferta Venice: bez modelu od uncensored.ai, bez modeli od dostawców, których Venice nie hostuje.",
      },
      usPros: {
        a: "Modele bez cenzury od Venice plus modele bez cenzury od NanoGPT, uncensored.ai, FreedomGPT i Gab AI w jednym wyborze modeli.",
        b: "Żadnego Mature Filter do wykupienia: jednorazowe potwierdzenie 18+ odblokowuje każdy model bez cenzury, nawet w darmowym planie.",
        c: "{{guestCredits}} darmowych kredytów miesięcznie bez konta, a cała platforma jest open source.",
      },
      usCons: {
        a: "Na własnych modelach Venice jesteśmy drożsi: nasze {{markup}}% marży dochodzi do ceny Venice.",
        b: "Ogólnie mniejszy katalog niż Venice.",
        c: "Prywatne czaty zapisujemy na naszych serwerach. Tylko czaty incognito zostają w przeglądarce, a Venice trzyma lokalnie całą historię.",
      },
      chooseThem: {
        a: "Chcesz największego katalogu bez cenzury od jednego dostawcy.",
        b: "Masz VVV albo chcesz go stakować za kredyt API.",
        c: "Wywołujesz modele Venice przez API i liczy się każdy cent za token.",
      },
      chooseUs: {
        a: "Chcesz w tym samym czacie modeli, których Venice nie ma, jak {{ownModel}}.",
        b: "Chcesz bez cenzury bez płacenia za plan, który zdejmie filtr.",
        c: "Chcesz oprogramowania open source z self-hostingiem i jednego salda na czat, obrazy, wideo i muzykę.",
      },
      both: "Korzystanie z obu to nic dziwnego. Venice dla jej katalogu, {{appName}}, gdy chcesz w jednym wątku porównać odpowiedź Venice z modelem bez cenzury od innego dostawcy.",
      switch: {
        title: "Przejście z Venice",
        body: "Modeli nie trzeba przenosić: Venice Uncensored i inne modele Venice są w naszym wyborze pod tymi samymi nazwami. Zacznij czat incognito, wybierz model Venice i kontynuuj. Jeśli potrzebujesz starego kontekstu, wklej go w pierwszą wiadomość.",
      },
      faq: {
        q1: {
          q: "Czy {{appName}} to to samo co Venice?",
          a: "Nie. Jesteśmy osobną platformą open source. Część naszych modeli działa na API Venice, inne pochodzą od NanoGPT, uncensored.ai, FreedomGPT, Gab AI, OpenRouter i dużych laboratoriów.",
        },
        q2: {
          q: "Czy Venice AI jest darmowe?",
          a: "Venice ma darmowy plan z 10 promptami tekstowymi i 15 obrazowymi dziennie na modelach bazowych. Pro znosi limity i pozwala wyłączyć Mature Filter.",
        },
        q3: {
          q: "Czy Venice jest tańsze niż {{appName}}?",
          a: "Na własnych modelach Venice tak: doliczamy {{markup}}% do kosztów dostawcy. Przy mieszaniu modeli od różnych dostawców w jednej aplikacji oszczędzasz na osobnych subskrypcjach.",
        },
        q4: {
          q: "Co jest bardziej prywatne, Venice czy {{appName}}?",
          a: "Venice trzyma całą historię na Twoim urządzeniu. W {{appName}} tak samo działają czaty incognito; prywatne czaty zapisujemy na naszych serwerach, żeby synchronizowały się między urządzeniami. W obu przypadkach Twoja wiadomość trafia do dostawcy modelu, żeby dostać odpowiedź.",
        },
      },
      cta: { title: "Wypróbuj modele Venice obok całej reszty" },
    },
    characterAi: {
      meta: {
        title: "Alternatywa dla Character AI bez filtra: {{appName}}",
        description:
          "{{appName}} vs Character.AI: filtry, weryfikacja wieku, modele, prywatność i cena. Kiedy Character.AI to dobry wybór, a kiedy potrzebujesz alternatywy bez cenzury.",
        keywords:
          "alternatywa dla Character AI, Character AI bez filtra, Character AI alternatywa bez cenzury, Character AI NSFW, Character AI filtr, Character AI weryfikacja wieku, c.ai+ cena, AI roleplay bez filtra, czat z postaciami bez cenzury, NSFW AI czat, Character AI alternative, Character AI alternative without filter, uncensored character AI, {{appName}} vs Character.AI",
      },
      hero: {
        title: "{{appName}} vs Character.AI: alternatywa bez filtra",
        subtitle:
          "Największa platforma czatu z postaciami kontra otwarta platforma bez cenzury. Na co każda pozwala, ile kosztuje, dokąd trafiają Twoje czaty.",
        readTime: "7 min czytania",
      },
      intro: {
        lead: "Character.AI ma największą bibliotekę postaci w internecie i filtr, który nie drgnie. Jego własne centrum pomocy mówi, że treści pornograficzne nie będą wspierane nigdy w przyszłości. Jeśli to dla Ciebie przeszkoda nie do przejścia, potrzebujesz innej platformy, nie jailbreaka.",
        p2: "Dane o Character.AI z jego stron subskrypcji, centrum pomocy i polityki prywatności, sprawdzone {{date}}. Nasze czytane na żywo z naszej konfiguracji.",
      },
      relation:
        "Nie łączą nas żadne relacje biznesowe z Character.AI. Możesz przenieść postać: wklej jej link z Character.AI, a {{appName}} zaimportuje ją jako skill.",
      verdict:
        "Wybierz Character.AI do zabawy bez treści dla dorosłych z milionami gotowych postaci, za darmo i bez limitu, albo dla każdego poniżej 18 lat. Wybierz {{appName}}, jeśli filtr ciągle psuje Ci historię: modele do roleplayu bez cenzury po jednorazowym potwierdzeniu 18+, wybór modelu przy każdej wiadomości i czaty, na których nikt nie trenuje modeli.",
      themPros: {
        a: "Miliony postaci społeczności, gotowych do rozmowy.",
        b: "Nielimitowane darmowe wiadomości, tanie płatne plany.",
        c: "Rozmowy głosowe z postaciami.",
      },
      themCons: {
        a: "Zero treści dla dorosłych, nigdy, a mroczne sceny są łagodzone.",
        b: "Polityka prywatności pozwala trenować na Twoich informacjach i dopasowywać reklamy.",
        c: "Tylko własne modele. Bez wyboru, bez własnego klucza.",
      },
      usPros: {
        a: "{{uncensored}} modeli bez cenzury, kilka stworzonych do roleplayu. Scena idzie tam, dokąd prowadzi historia.",
        b: "Model wybierasz przy każdej wiadomości: model do roleplayu bez cenzury na scenę, model frontier do planowania.",
        c: "Czaty incognito zostają w Twojej przeglądarce. Nie trenujemy modeli na Twoich czatach.",
      },
      usCons: {
        a: "Dużo mniej gotowych postaci. Importujesz albo piszesz własne.",
        b: "Kredyty liczone za użycie zamiast nielimitowanych darmowych wiadomości.",
        c: "Brak rozmów głosowych z postaciami.",
      },
      chooseThem: {
        a: "Chcesz czatu bez treści dla dorosłych z gigantyczną biblioteką postaci.",
        b: "Masz mniej niż 18 lat albo zakładasz konto nastolatkowi.",
        c: "Chcesz nielimitowanych darmowych wiadomości i nie chcesz myśleć o kosztach.",
      },
      chooseUs: {
        a: "Filtr ciągle psuje Ci roleplay.",
        b: "Chcesz wybierać model, a nie dostać przydzielony.",
        c: "Chcesz, żeby Twoje czaty nie trafiały do treningu ani targetowania reklam.",
      },
      both: "Wielu trzyma Character.AI do lekkich rozmów, a historie, które potrzebują modelu dla dorosłych, przenosi tutaj, razem z postacią przez import.",
      switch: {
        title: "Przenoszenie postaci z Character.AI",
        body: "Skopiuj link do postaci z Character.AI, wklej go w import skilli w {{appName}}, a imię, powitanie i opis przejdą, o ile twórca udostępnił je publicznie. Potem wybierz model do roleplayu bez cenzury i kontynuuj historię.",
      },
      faq: {
        q1: {
          q: "Czy Character.AI pozwala na NSFW?",
          a: "Nie. Centrum pomocy mówi, że treści pornograficzne łamią regulamin i nie będą wspierane nigdy w przyszłości.",
        },
        q2: {
          q: "Czy Character.AI wymaga weryfikacji wieku?",
          a: "Tak. Użytkownicy przechodzą weryfikację wieku przez Persona. Zweryfikowani poniżej 18 lat dostają tylko tryb czytania, bez czatu.",
        },
        q3: {
          q: "Czy {{appName}} to alternatywa dla Character.AI bez filtra?",
          a: "Dla dorosłych tak. Modele bez cenzury odblokowujesz jednorazowym potwierdzeniem 18+, a kilka z nich stworzono do roleplayu. Modele mainstream zachowują filtry producentów, więc do scen dla dorosłych wybierz model bez cenzury.",
        },
        q4: {
          q: "Czy mogę zaimportować moje postacie z Character.AI?",
          a: "Tak: wklej link do postaci w import skilli. To, co przejdzie, zależy od tego, co twórca udostępnił publicznie na Character.AI.",
        },
      },
      cta: { title: "Kontynuuj historię bez filtra" },
    },
    janitorAi: {
      meta: {
        title: "Janitor AI alternatywa: {{appName}} vs Janitor AI (2026)",
        description:
          "{{appName}} vs Janitor AI: JLLM kontra {{modelCount}} modeli, limity kontekstu, zasady NSFW, proxy, prywatność i cena. Uczciwe plusy i minusy do roleplayu.",
        keywords:
          "Janitor AI alternatywa, Janitor AI po polsku, Janitor AI proxy, Janitor AI cena, Janitor AI limit kontekstu, NSFW AI roleplay, roleplay AI bez cenzury, czat z postaciami bez cenzury, NSFW AI czat, Janitor AI alternative, Janitor AI vs, JanitorAI, janitor+ price, JLLM, Janitor AI OpenRouter, {{appName}} vs Janitor AI",
      },
      hero: {
        title: "{{appName}} vs Janitor AI",
        subtitle:
          "Największa darmowa społeczność roleplayu kontra czat bez cenzury z wieloma modelami. Modele, pamięć, zasady, cena.",
        readTime: "6 min czytania",
      },
      intro: {
        lead: "Janitor AI wygrał roleplay dwiema rzeczami: milionami botów społeczności i darmowym modelem. Haczyk wychodzi w długich historiach. Darmowy kontekst to około 9K tokenów, a lepsze modele oznaczają konfigurację proxy z własnym kluczem.",
        p2: "Dane o Janitor AI ze strony janitor+, centrum pomocy i zasad, sprawdzone {{date}}. Nasze czytane na żywo z naszej konfiguracji.",
      },
      relation:
        "Nie łączą nas żadne relacje biznesowe z Janitor AI. Inne kształty: Janitor to biblioteka postaci z jednym darmowym modelem, my jesteśmy biblioteką modeli z postaciami.",
      verdict:
        "Wybierz Janitor AI dla biblioteki botów i darmowego, nielimitowanego czatu na JLLM. Wybierz {{appName}}, jeśli chcesz mocnych modeli bez cenzury z długim kontekstem od ręki, bez konfiguracji proxy, oraz obrazów, wideo i głosu w tym samym czacie.",
      themPros: {
        a: "Miliony botów społeczności, z tagami Limitless dla NSFW.",
        b: "Darmowy, nielimitowany czat na własnym modelu.",
        c: "Własny model przez proxy, w tym OpenRouter.",
      },
      themCons: {
        a: "Około 9K tokenów darmowego kontekstu: długie kampanie zapominają.",
        b: "Lepsze modele wymagają janitor+ Router albo własnego klucza API i konfiguracji proxy.",
        c: "Tylko tekst, a aplikacja mobilna startuje w Safe Mode.",
      },
      usPros: {
        a: "{{modelCount}} modeli w wyborze, {{uncensored}} bez cenzury, bez proxy i klucza do konfiguracji.",
        b: "Modele bez cenzury z długim kontekstem do kampanii, które trwają tygodniami.",
        c: "Obrazy, wideo, muzyka i głos z tego samego czatu i salda.",
      },
      usCons: {
        a: "Malutka biblioteka postaci w porównaniu z Janitorem.",
        b: "Brak nielimitowanego darmowego planu: {{guestCredits}} darmowych kredytów miesięcznie, potem plan.",
        c: "Mniej społeczności: brak publicznego feedu botów.",
      },
      chooseThem: {
        a: "Chcesz przeglądać tysiące gotowych botów.",
        b: "Chcesz darmowego, nielimitowanego czatu, a darmowy model Ci wystarcza.",
        c: "Już używasz własnego klucza przez proxy i to lubisz.",
      },
      chooseUs: {
        a: "Długie historie potrzebują długiego kontekstu i mocnego modelu bez cenzury.",
        b: "Chcesz zmieniać model w trakcie sceny bez grzebania w ustawieniach proxy.",
        c: "Chcesz obrazów albo głosu dla swoich postaci w tym samym miejscu.",
      },
      both: "Częsty układ: postacie odkrywasz na Janitor AI, długie kampanie prowadzisz w {{appName}}.",
      switch: {
        title: "Przejście z Janitor AI",
        body: "Stwórz skill w {{appName}} z osobowością, scenariuszem i powitaniem swojej postaci, potem wybierz model do roleplayu bez cenzury. Czaty incognito nie wymagają konta, więc scenę przetestujesz, zanim się zarejestrujesz.",
      },
      faq: {
        q1: {
          q: "Czy Janitor AI jest darmowy?",
          a: "Tak: nielimitowane czaty na własnym modelu z około 9K tokenów kontekstu. janitor+ dodaje więcej pamięci, szybkości i modeli.",
        },
        q2: {
          q: "Czy Janitor AI pozwala na NSFW?",
          a: "Tak, dla dorosłych, na botach z tagiem Limitless, w wersji webowej. Aplikacja mobilna startuje w Safe Mode, dopóki nie włączysz NSFW w ustawieniach webowych.",
        },
        q3: {
          q: "Czy w {{appName}} potrzebuję proxy?",
          a: "Nie. Każdy model jest w wyborze. Płacisz kredytami za wiadomość, klucz API niepotrzebny.",
        },
        q4: {
          q: "Co ma lepszą pamięć do długiego roleplayu?",
          a: "Darmowy model Janitora ma około 9K tokenów kontekstu; janitor+ zwiększa pamięć postaci. W {{appName}} kontekst zależy od wybranego modelu, a wiele modeli do roleplayu mieści dużo więcej.",
        },
      },
      cta: {
        title: "Poprowadź kolejną kampanię na modelu z długim kontekstem",
      },
    },
    nanoGpt: {
      meta: {
        title: "NanoGPT alternatywa: {{appName}} vs NanoGPT 2026",
        description:
          "{{appName}} vs NanoGPT: płatność za użycie kontra plany, modele bez cenzury i abliterowane, prywatność, API i media. Kupujemy od NanoGPT i mówimy, gdzie wygrywa.",
        keywords:
          "NanoGPT alternatywa, NanoGPT opinie, NanoGPT cena, NanoGPT bez cenzury, API AI bez cenzury, modele abliterowane API, AI płatność za użycie, AI bez cenzury, NanoGPT alternative, NanoGPT vs, nano-gpt review, NanoGPT pricing, NanoGPT PRO, NanoGPT uncensored, uncensored AI API, {{appName}} vs NanoGPT",
      },
      hero: {
        title: "{{appName}} vs NanoGPT",
        subtitle:
          "Dwie platformy z wieloma modelami, modelami bez cenzury i API. Jedna płatna za użycie, druga oparta na planach. Jedna sprzedaje drugiej.",
        readTime: "6 min czytania",
      },
      intro: {
        lead: "NanoGPT to odpowiedź na subskrypcje AI w modelu płatności za użycie: doładuj dziesięć centów, używaj dowolnego modelu, bez konta. Kilka naszych modeli bez cenzury działa na jego API. Prawdziwe pytanie nie brzmi więc, co jest lepsze, tylko który model działania pasuje do tego, jak używasz AI.",
        p2: "Dane o NanoGPT z jego cennika, polityki prywatności, regulaminu i publicznej listy modeli, sprawdzone {{date}}. Nasze czytane na żywo z naszej konfiguracji.",
      },
      relation:
        "Jesteśmy klientem NanoGPT: {{nanoGptModels}} naszych modeli działa przez API NanoGPT (w tym {{nanoGptUncensored}} bez cenzury), m.in. {{nanoGptExamples}}.",
      verdict:
        "Wybierz NanoGPT dla najszerszego katalogu po cenach katalogowych, płatności za użycie bez konta i API do wszystkiego. Wybierz {{appName}}, jeśli chcesz wyselekcjonowanego, przetestowanego wyboru modeli z modelami bez cenzury od kilku dostawców, darmowych kredytów co miesiąc, skilli i pamięci oraz aplikacji open source, którą postawisz u siebie.",
      themPros: {
        a: "631 modeli tekstowych w API, około 39 bez cenzury lub abliterowanych.",
        b: "Bez konta, bez subskrypcji: start od dziesięciu centów w krypto.",
        c: "Ceny katalogowe na automatycznie routowanych modelach, taniej niż u każdego pośrednika.",
      },
      themCons: {
        a: "Darmowy plan to jeden model w przeglądarce.",
        b: "Prywatność zależy od ścieżki dostawcy; niektóre pozwalają na trening.",
        c: "Przy tak dużym katalogu testujesz wszystko sam.",
      },
      usPros: {
        a: "Wyselekcjonowany wybór: każdy model oznaczony jako mainstream, open albo bez cenzury, z własną stroną i ceną na żywo.",
        b: "{{guestCredits}} darmowych kredytów miesięcznie, wystarczy, żeby sprawdzić modele bez cenzury na własnych promptach.",
        c: "Skille, pamięć, foldery i czat stworzony do długiej pracy, open source z self-hostingiem.",
      },
      usCons: {
        a: "Mniej modeli niż NanoGPT.",
        b: "Doliczamy {{markup}}% do kosztów dostawcy, więc ten sam model kosztuje u nas więcej.",
        c: "Najpierw plan: pakiety kredytów doładowują aktywny plan.",
      },
      chooseThem: {
        a: "Chcesz płacić za użycie, bez subskrypcji i bez konta.",
        b: "Potrzebujesz niszowego modelu, który ma tylko ogromny katalog.",
        c: "Budujesz na API i chcesz cen katalogowych.",
      },
      chooseUs: {
        a: "Chcesz przetestowanej krótkiej listy zamiast 631 opcji.",
        b: "Chcesz darmowych kredytów co miesiąc i dopracowanego czatu ze skillami i pamięcią.",
        c: "Chcesz modelu od uncensored.ai i modeli Venice obok modeli NanoGPT w jednym wątku.",
      },
      both: "Deweloperzy często używają API NanoGPT do zadań wsadowych, a {{appName}} jako codziennego czatu.",
      switch: {
        title: "Przejście z NanoGPT",
        body: "Modele obsługiwane przez NanoGPT w naszym wyborze, jak {{nanoGptExamples}}, to te same modele. Zacznij czat incognito, wybierz jeden i porównaj odpowiedzi z modelem od innego dostawcy w tym samym wątku.",
      },
      faq: {
        q1: {
          q: "Czy NanoGPT jest tańszy niż {{appName}}?",
          a: "Za token zwykle tak: NanoGPT liczy ceny katalogowe, a my doliczamy {{markup}}%. My dajemy {{guestCredits}} darmowych kredytów miesięcznie i jedną aplikację dla każdego dostawcy.",
        },
        q2: {
          q: "Czy NanoGPT wymaga konta?",
          a: "Nie. Działa z wygenerowanym ID użytkownika i domyślnie trzyma czaty w przeglądarce.",
        },
        q3: {
          q: "Czy oba mają API?",
          a: "Tak. API NanoGPT jest zgodne z OpenAI i Anthropic, z płatnościami bez konta. Nasze jest zgodne z OpenAI i Anthropic i odblokowuje się po planie albo zakupie kredytów.",
        },
        q4: {
          q: "Kto ma więcej modeli bez cenzury?",
          a: "NanoGPT ma ich łącznie więcej. {{appName}} ma {{uncensored}}, wybranych i przetestowanych, od NanoGPT, Venice, uncensored.ai, FreedomGPT i Gab AI.",
        },
      },
      cta: { title: "Porównaj modele NanoGPT z modelami wszystkich innych" },
    },
    freedomGpt: {
      meta: {
        title: "FreedomGPT alternatywa: {{appName}} vs FreedomGPT (2026)",
        description:
          "{{appName}} vs FreedomGPT: Liberty i modele bez cenzury, zasady treści, prywatność, kredyty, API i open source. Fakty ze źródłami, z obu stron.",
        keywords:
          "FreedomGPT alternatywa, FreedomGPT opinie, FreedomGPT cena, FreedomGPT bez cenzury, model Liberty, ChatGPT bez cenzury, alternatywa dla ChatGPT bez cenzury, AI bez cenzury, AI bez filtrów, FreedomGPT alternative, FreedomGPT vs, FreedomGPT review, FreedomGPT pricing, FreedomGPT Pro, Liberty model, censor-free AI, uncensored ChatGPT alternative, {{appName}} vs FreedomGPT",
      },
      hero: {
        title: "{{appName}} vs FreedomGPT",
        subtitle:
          "Dwie aplikacje, które stawiają modele bez cenzury obok ChatGPT, Claude i Gemini. Zasady, prywatność, kredyty, open source.",
        readTime: "6 min czytania",
      },
      intro: {
        lead: "FreedomGPT i {{appName}} łączy jeden pomysł: modele mainstream i bez cenzury na jednej liście. Różnice tkwią w zasadach, kredytach i tym, co dzieje się z Twoimi wiadomościami.",
        p2: "Dane o FreedomGPT ze strony głównej, cennika, polityki prywatności, dokumentacji i GitHuba, sprawdzone {{date}}. Nasze czytane na żywo z naszej konfiguracji.",
      },
      relation:
        "Jesteśmy klientem FreedomGPT: {{freedomGptExamples}} działa w {{appName}} przez własne API FreedomGPT.",
      verdict:
        "Wybierz FreedomGPT dla jednego planu za 20 USD na czat, obrazy i wideo, z darmowym startem bez konta. Wybierz {{appName}}, jeśli chcesz więcej modeli bez cenzury od kilku dostawców, żadnej klauzuli o nieetycznym użyciu ponad prawo, jawnych cen każdego modelu i platformy open source, która jest aktywnie rozwijana.",
      themPros: {
        a: "Za darmo, bez karty i konta.",
        b: "Liberty i inne modele bez cenzury obok ChatGPT, Claude i Gemini.",
        c: "Generowanie obrazów i wideo w tym samym planie.",
      },
      themCons: {
        a: "Według jego zasad modele muszą przestrzegać prawa USA i nie mogą służyć do celów nieetycznych.",
        b: "Wiadomości, głos i obrazy trafiają do zewnętrznych dostawców; okres przechowywania nie jest podany.",
        c: "Aplikacja desktopowa open source nie była aktualizowana od czerwca 2024.",
      },
      usPros: {
        a: "{{uncensored}} modeli bez cenzury od pięciu dostawców, w tym Liberty.",
        b: "Każdy model ma publiczną stronę z ceną za wiadomość na żywo.",
        c: "Cała platforma jest open source i aktywnie rozwijana. Postaw ją u siebie.",
      },
      usCons: {
        a: "Brak płaskiego planu na wszystko: kredyty liczone osobno dla każdego modelu.",
        b: "Konto potrzebne do pamięci i synchronizacji czatów.",
        c: "Nasze {{markup}}% marży dotyczy też modeli od FreedomGPT.",
      },
      chooseThem: {
        a: "Chcesz jednego prostego planu za 20 USD na czat, obrazy i wideo.",
        b: "Potrzebujesz tylko Liberty i modeli mainstream.",
        c: "Chcesz aplikacji desktopowej offline i wersja z 2024 Ci wystarcza.",
      },
      chooseUs: {
        a: "Chcesz większego wyboru bez cenzury: także modeli od Venice, NanoGPT, uncensored.ai i Gab.",
        b: "Chcesz znać cenę wiadomości, zanim ją wyślesz.",
        c: "Chcesz aktualnego oprogramowania open source z self-hostingiem.",
      },
      both: "Liberty od FreedomGPT jest w naszym wyborze, więc porównasz go z innymi modelami bez cenzury bez drugiej subskrypcji.",
      switch: {
        title: "Przejście z FreedomGPT",
        body: "Wybierz Liberty w naszym wyborze modeli i działaj dalej. Potem daj ten sam prompt modelowi {{ownModel}} albo modelowi abliterowanemu i zostań przy tym, który odpowie najlepiej.",
      },
      faq: {
        q1: {
          q: "Czy FreedomGPT jest naprawdę bez cenzury?",
          a: "Jego modele bez cenzury pomijają większość odmów, ale FreedomGPT deklaruje, że każdy hostowany model musi przestrzegać prawa USA i nie może służyć do celów nieetycznych, a etykieta „censor-free” nie gwarantuje odpowiedzi na każde zapytanie.",
        },
        q2: {
          q: "Ile kosztuje FreedomGPT?",
          a: "Start jest darmowy. Pro zawiera 2200 kredytów miesięcznie; odpowiedź premium kosztuje około 10, obraz około 25, a 5-sekundowe wideo około 400.",
        },
        q3: {
          q: "Czy FreedomGPT jest open source?",
          a: "Jego starsza aplikacja desktopowa do modeli offline jest open source (GPL-3.0) na GitHubie, ostatnio aktualizowana w czerwcu 2024. Aplikacja w chmurze nie jest. {{appName}} jest open source w całości.",
        },
        q4: {
          q: "Czy mogę używać modelu Liberty od FreedomGPT w {{appName}}?",
          a: "Tak. Działa przez API FreedomGPT i jest w naszym wyborze obok innych modeli bez cenzury.",
        },
      },
      cta: {
        title: "Sprawdź Liberty na tle każdego innego modelu bez cenzury",
      },
    },
    gabAi: {
      meta: {
        title: "Gab AI alternatywa: {{appName}} vs Gab AI (2026)",
        description:
          "{{appName}} vs Gab AI: Arya, 214 modeli, zakaz treści seksualnych, prywatność, kredyty i API obok siebie. Kupujemy od Gab, więc mówimy, kto gdzie wygrywa.",
        keywords:
          "Gab AI alternatywa, Gab AI opinie, Gab AI cena, Gab AI bez cenzury, czy Gab AI jest bez cenzury, Arya AI, Gab Arya, konserwatywny chatbot AI, prawicowe AI, czat AI bez cenzury, AI bez cenzury, Gab AI alternative, Gab AI vs, Gab AI review, Gab AI pricing, Gab AI Plus, is Gab AI uncensored, Gab AI NSFW, Gab AI API, conservative AI chatbot, right-wing AI, uncensored AI chat, {{appName}} vs Gab AI",
      },
      hero: {
        title: "{{appName}} vs Gab AI",
        subtitle:
          "Dwie aplikacje z wieloma modelami, które nie cenzurują polityki. Jedna zakazuje też treści dla dorosłych. Ceny, zasady, prywatność i API obok siebie.",
        readTime: "7 min czytania",
      },
      intro: {
        lead: "Gab AI zbudował Aryę dla ludzi zmęczonych chatbotami, które pouczają ich o polityce, kulturze i wierze. My też mamy Aryę, przez własne API Gab. Prawdziwe pytanie nie brzmi więc, który jest bez cenzury. Brzmi: jakich zasad chcesz wokół modelu.",
        p2: "Dane o Gab AI ze strony głównej, cennika, strony API, regulaminu i polityki prywatności, sprawdzone {{date}}. Nasze czytane na żywo z naszej konfiguracji.",
      },
      relation:
        "Jesteśmy klientem Gab AI: {{gabAiExamples}} działa w {{appName}} przez własne API Gab. Ten sam model, inna aplikacja i inne zasady wokół niego.",
      verdict:
        "Wybierz Gab AI, jeśli chcesz Aryi z trybem agenta Gab, aplikacjami desktopowymi i katalogiem 214 modeli pod jedną konserwatywną marką, a treści dla dorosłych nigdy nie potrzebujesz. Wybierz {{appName}}, jeśli chcesz Aryi obok {{ownModel}} i abliterowanych wersji GLM i DeepSeek w jednym czacie, fikcji dla dorosłych na modelach bez cenzury, które na nią pozwalają, i czatów, które mogą zostać w Twojej przeglądarce.",
      themPros: {
        a: "214 modeli na jednym koncie plus Arya, własny model do polityki, kultury i wiary.",
        b: "Tryb agenta (Work), głos na żywo, obrazy, wideo i muzyka, aplikacje na Maca, Windowsa, iPhone'a i Androida.",
        c: "Kupione pakiety kredytów przechodzą dalej i nie wygasają.",
      },
      themCons: {
        a: "Regulamin zakazuje treści obscenicznych, seksualnie dosłownych i pornograficznych, a automatyczne systemy mogą skanować Twoje treści.",
        b: "Prompty, odpowiedzi i historia zostają na serwerach Gab, a ulepszanie modeli jest jednym z podanych celów.",
        c: "Za darmo to 250 jednorazowych kredytów na start po weryfikacji e-maila. API wymaga Plus albo Plus Premium.",
      },
      usPros: {
        a: "{{uncensored}} modeli bez cenzury od kilku dostawców, w tym Arya, w jednym wyborze modeli.",
        b: "Brak ogólnego zakazu treści dla dorosłych: jednorazowe potwierdzenie 18+ odblokowuje każdy model bez cenzury.",
        c: "{{guestCredits}} darmowych kredytów miesięcznie bez konta. Czaty incognito zostają w Twojej przeglądarce.",
      },
      usCons: {
        a: "Brak trybu agenta i aplikacji desktopowej jak Work od Gab.",
        b: "Mniejszy katalog: {{modelCount}} modeli czatu wobec 214 u Gab.",
        c: "Nasze {{markup}}% marży dotyczy też Aryi.",
      },
      chooseThem: {
        a: "Chcesz Aryi z trybem agenta i aplikacjami desktopowymi Gab.",
        b: "Podzielasz wartości Gab i chcesz wspierać firmę AI zbudowaną poza Big Tech.",
        c: "Nie piszesz fikcji dla dorosłych i chcesz największego katalogu na jednym rachunku.",
      },
      chooseUs: {
        a: "Chcesz porównać Aryę z {{ownModel}} i modelami abliterowanymi w tym samym wątku.",
        b: "Piszesz fikcję dla dorosłych albo mroczną i potrzebujesz modeli, które na nią pozwalają.",
        c: "Chcesz zacząć bez konta i trzymać czaty incognito w przeglądarce.",
      },
      both: "Arya jest w naszym wyborze, więc to samo pytanie zadasz Aryi, {{ownModel}} i modelowi abliterowanemu, a odpowiedzi ocenisz sam, bez drugiej subskrypcji.",
      switch: {
        title: "Przejście z Gab AI",
        body: "Wybierz Aryę w naszym wyborze modeli i działaj dalej. Potem wyślij ten sam prompt do {{ownModel}}: oba nie unikają polityki, ale zbudowano je inaczej i widać to w odpowiedziach. Jeśli potrzebujesz starego kontekstu, wklej go w pierwszą wiadomość.",
      },
      faq: {
        q1: {
          q: "Czy Gab AI jest naprawdę bez cenzury?",
          a: "W polityce, kulturze i wierze tak: do tego zbudowano Aryę. W treściach seksualnych nie. Regulamin Gab zakazuje treści obscenicznych, seksualnie dosłownych i pornograficznych i mówi, że automatyczne systemy mogą skanować Twoje treści pod kątem zgodności.",
        },
        q2: {
          q: "Ile kosztuje Gab AI?",
          a: "Darmowe konta dostają 250 kredytów na start po weryfikacji e-maila. Plus kosztuje 20 USD miesięcznie albo 200 USD rocznie, z 2000 kredytów miesięcznie. Plus Premium kosztuje 999 USD rocznie, z 12 000 kredytów. Pakiety kredytów zaczynają się od 10 USD za 700 kredytów.",
        },
        q3: {
          q: "Czy mogę używać Aryi w {{appName}}?",
          a: "Tak. Arya działa przez API Gab i jest w naszym wyborze obok {{ownModel}} i innych modeli bez cenzury. Odpowiedzi Aryi nadal podlegają zasadom treści Gab.",
        },
        q4: {
          q: "Czy Gab AI przechowuje moje czaty?",
          a: "Tak. Polityka prywatności mówi, że Gab trzyma Twoje prompty, odpowiedzi i historię rozmów, podaje ulepszanie modeli jako jeden z celów i ostrzega, że przekazanie zapytań do dostawców modeli nie czyni ich anonimowymi. W {{appName}} czaty incognito zostają w Twojej przeglądarce.",
        },
      },
      cta: { title: "Sprawdź Aryę na tle każdego innego modelu bez cenzury" },
    },
    uncensoredAi: {
      meta: {
        title: "uncensored.ai alternatywa: {{appName}} vs uncensored.ai",
        description:
          "{{appName}} vs uncensored.ai: ten sam model UncensoredLM, inna aplikacja. Darmowe limity, cena Pro, API, prywatność i media obok siebie, ze źródłami.",
        keywords:
          "uncensored.ai alternatywa, uncensored.ai opinie, uncensored.ai cena, czy uncensored.ai jest darmowe, UncensoredLM, UncensoredAI v1.2, uncensored.ai API, czat AI bez cenzury, AI bez cenzury, uncensored.ai alternative, uncensored.ai vs, uncensored.ai review, uncensored.ai pricing, uncensored.ai Pro, is uncensored.ai free, uncensored AI chat, {{appName}} vs uncensored.ai",
      },
      hero: {
        title: "{{appName}} vs uncensored.ai",
        subtitle:
          "Jeden model z własnym światopoglądem, dwa sposoby korzystania. Darmowe limity, cena, API i co jeszcze dostajesz.",
        readTime: "6 min czytania",
      },
      intro: {
        lead: "uncensored.ai robi najbardziej odmienny model bez cenzury, jaki znamy: {{ownModel}}, trenowany na książkach i dokumentach usuniętych z mainstreamowego internetu, z poglądami politycznymi pod prąd mainstreamu. Mamy go przez własne API uncensored.ai. Ta strona odpowiada więc na jedno pytanie: korzystać z niego na uncensored.ai czy tutaj?",
        p2: "Dane o uncensored.ai z cennika, strony API, strony o firmie i polityki prywatności, sprawdzone {{date}}. Nasze czytane na żywo z naszej konfiguracji.",
      },
      relation:
        "Jesteśmy klientem uncensored.ai: {{uncensoredAiExamples}} działa w {{appName}} przez API uncensored.ai. Ten sam model, nasz czat, nasze rozliczenia.",
      verdict:
        "Wybierz uncensored.ai, jeśli chcesz nielimitowanych czatów z tym jednym modelem za stałą cenę Pro zablokowaną dożywotnio, do tego forum i trybu głosowego. Wybierz {{appName}}, jeśli chcesz {{ownModel}} obok {{modelCount}} innych modeli, żeby w jednym wątku sprawdzić jego zdanie na tle Claude, GPT albo modelu abliterowanego, z obrazami, wideo i muzyką na tym samym saldzie.",
      themPros: {
        a: "Stała cena: Pro kosztuje 9,99 USD miesięcznie albo 99,99 USD rocznie, zablokowana dożywotnio, dopóki trwa subskrypcja.",
        b: "Nielimitowane czaty z modelem w tej cenie, do tego tryb głosowy, foldery i archiwa.",
        c: "Polityka prywatności mówi, że Twoje dane nie służą do trenowania ani ulepszania modeli AI.",
      },
      themCons: {
        a: "Darmowy plan to 3 odpowiedzi dziennie.",
        b: "Jeden model, 32 768 tokenów kontekstu, bez generowania obrazów, wideo i muzyki.",
        c: "Wywołania API kosztują 0,05 USD za sztukę i kupuje się je osobno od Pro.",
      },
      usPros: {
        a: "{{ownModel}} plus {{modelCount}} innych modeli w jednym czacie: porównasz jego odpowiedź z modelami mainstream i abliterowanymi w tym samym wątku.",
        b: "{{guestCredits}} darmowych kredytów miesięcznie bez konta, {{freeCredits}} z kontem.",
        c: "Obrazy, wideo, muzyka i głos na tym samym saldzie, a cała platforma jest open source.",
      },
      usCons: {
        a: "Kredyty liczone za użycie, nie płaski plan bez limitu: przy intensywnym codziennym korzystaniu z tego jednego modelu zapłacisz tu więcej.",
        b: "Brak forum społeczności i archiwów wokół modelu.",
        c: "Nasze {{markup}}% marży dotyczy też modelu od uncensored.ai.",
      },
      chooseThem: {
        a: "Ten jeden model to wszystko, czego potrzebujesz, i używasz go codziennie.",
        b: "Chcesz ceny zablokowanej dożywotnio.",
        c: "Chcesz jego forum i trybu głosowego.",
      },
      chooseUs: {
        a: "Chcesz porównać jego zdanie z modelami mainstream i abliterowanymi.",
        b: "Korzystasz z niego od czasu do czasu i nie chcesz kolejnej subskrypcji.",
        c: "Potrzebujesz też obrazów, wideo albo muzyki.",
      },
      both: "Wiele osób korzysta z obu: z uncensored.ai do codziennych nielimitowanych czatów z modelem, z {{appName}}, gdy chcą postawić jego odpowiedź obok odpowiedzi innego modelu w tym samym wątku.",
      switch: {
        title: "Przejście z uncensored.ai",
        body: "Wybierz {{ownModel}} w naszym wyborze modeli i zacznij czat incognito. Nic nie trzeba przenosić. Jeśli potrzebujesz starego kontekstu, wklej go w pierwszą wiadomość, a potem zadaj to samo pytanie modelowi abliterowanemu i zobacz, gdzie ich drogi się rozchodzą.",
      },
      faq: {
        q1: {
          q: "Czy {{appName}} to to samo co uncensored.ai?",
          a: "Nie. Jesteśmy osobną platformą open source. Model uncensored.ai mamy przez jego API, obok modeli od Venice, NanoGPT, FreedomGPT, Gab AI, OpenRouter i dużych laboratoriów.",
        },
        q2: {
          q: "Czy uncensored.ai jest darmowe?",
          a: "Ma darmowy plan z 3 odpowiedziami dziennie. Pro kosztuje 9,99 USD miesięcznie albo 99,99 USD rocznie i znosi limit. W {{appName}} {{guestCredits}} darmowych kredytów miesięcznie działa bez konta.",
        },
        q3: {
          q: "Czym wyróżnia się model uncensored.ai?",
          a: "Większość modeli bez cenzury to modele mainstream z wyciętymi odmowami: ten sam trening, ten sam światopogląd. {{ownModel}} trenowano na książkach i dokumentach usuniętych z mainstreamowego internetu, więc jego poglądy polityczne idą pod prąd mainstreamu.",
        },
        q4: {
          q: "Czy uncensored.ai ma API?",
          a: "Tak: API zgodne z OpenAI za 0,05 USD za inferencję, z kredytami kupowanymi osobno. W {{appName}} ten sam model wywołasz przez nasze API zgodne z OpenAI i Anthropic po dowolnym planie albo zakupie kredytów.",
        },
      },
      cta: { title: "Postaw jego zdanie obok każdego innego modelu" },
    },
    openRouter: {
      meta: {
        title: "OpenRouter alternatywa do czatu: {{appName}} vs OpenRouter",
        description:
          "{{appName}} vs OpenRouter: gotowa aplikacja czatu kontra router API dla deweloperów. Modele bez cenzury, opłaty, prywatność i API obok siebie, ze źródłami.",
        keywords:
          "OpenRouter alternatywa, OpenRouter opinie, OpenRouter cena, OpenRouter opłaty, OpenRouter bez cenzury, OpenRouter modele bez cenzury, OpenRouter darmowe modele, API zgodne z OpenAI, API LLM bez cenzury, czat AI bez cenzury, OpenRouter alternative, OpenRouter vs, OpenRouter review, OpenRouter pricing, OpenRouter fees, OpenRouter uncensored, OpenRouter uncensored models, OpenRouter chat app, OpenRouter free models, OpenAI compatible API, uncensored LLM API, {{appName}} vs OpenRouter",
      },
      hero: {
        title: "{{appName}} vs OpenRouter",
        subtitle:
          "Router dla deweloperów z 474 modelami kontra aplikacja czatu z wbudowanymi modelami bez cenzury. Opłaty, filtry, prywatność i API.",
        readTime: "6 min czytania",
      },
      intro: {
        lead: "OpenRouter to domyślna odpowiedź na jeden klucz API i setki modeli. Sami z niego korzystamy. Ale to router dla deweloperów, nie aplikacja czatu, a jego półka z modelami bez cenzury jest skromna. Jeśli szukasz alternatywy dla OpenRouter do czatowania, oto uczciwe porównanie.",
        p2: "Dane o OpenRouter z cennika, przewodnika o zbieraniu danych, regulaminu i publicznej listy modeli, sprawdzone {{date}}. Nasze czytane na żywo z naszej konfiguracji.",
      },
      relation:
        "Jesteśmy klientem OpenRouter: {{openRouterModels}} naszych modeli działa przez API OpenRouter, m.in. {{openRouterExamples}}. Dokładamy czat, media i dostawców bez cenzury, których OpenRouter nie ma.",
      verdict:
        "Wybierz OpenRouter, jeśli jesteś deweloperem i chcesz jednego klucza do 474 modeli po cenach dostawców z przełączaniem awaryjnym, a interfejs masz własny. Wybierz {{appName}}, jeśli chcesz gotowego czatu z {{uncensored}} modelami bez cenzury, w tym {{ownModel}} i wersjami abliterowanymi, których OpenRouter nie ma, do tego obrazów, wideo i muzyki oraz API, gdy go potrzebujesz.",
      themPros: {
        a: "474 modele na publicznej liście, po cenach dostawców.",
        b: "Bez subskrypcji. Darmowe modele: 50 zapytań dziennie, 1000 po zakupie kredytów za 10 USD.",
        c: "Logowanie promptów i wykorzystanie Twoich danych tylko za Twoją zgodą.",
      },
      themCons: {
        a: "5,5% opłaty od zakupu kredytów w standardowym planie.",
        b: "Mało modeli bez cenzury: Venice Uncensored plus fine-tuny do roleplayu jak Hermes 4 i Magnum. 142 z jego 474 modeli mają flagę moderacji.",
        c: "Nie celuje w czat dla zwykłych użytkowników: interfejs dostarczasz sam.",
      },
      usPros: {
        a: "Gotowy czat w przeglądarce: bez klucza, bez konfiguracji, {{guestCredits}} darmowych kredytów miesięcznie bez konta.",
        b: "{{uncensored}} modeli bez cenzury od Venice, NanoGPT, uncensored.ai, FreedomGPT i Gab AI, odblokowanych jednorazowym potwierdzeniem 18+.",
        c: "API zgodne z OpenAI i Anthropic: czat, obrazy, wideo i mowa na tym samym saldzie.",
      },
      usCons: {
        a: "Mniejszy katalog: {{modelCount}} modeli czatu wobec 474 w OpenRouter.",
        b: "Nasze {{markup}}% marży od kosztów dostawcy to więcej niż 5,5% opłaty w OpenRouter.",
        c: "Zbudowany najpierw jako czat: mniej opcji routingu niż w dedykowanym routerze.",
      },
      chooseThem: {
        a: "Budujesz aplikację i chcesz jednego klucza do setek modeli.",
        b: "Potrzebujesz przełączania dostawców i kontroli routingu.",
        c: "Liczy się każdy cent za token, a interfejs masz własny.",
      },
      chooseUs: {
        a: "Chcesz czatować, nie budować: otwierasz stronę i piszesz.",
        b: "Chcesz modeli bez cenzury, których OpenRouter nie ma, jak {{ownModel}}.",
        c: "Chcesz czatu, obrazów, wideo i muzyki na jednym saldzie, a do tego API.",
      },
      both: "Korzystanie z obu to normalna sprawa: OpenRouter w Twoim kodzie, {{appName}} jako czat, w którym testujesz modele bez cenzury obok siebie, zanim któryś podepniesz.",
      switch: {
        title: "Przejście z OpenRouter",
        body: "Jeśli chcesz czatu: zacznij czat incognito i wybierz model, klucz niepotrzebny. W kodzie: nasze API jest zgodne z OpenAI, więc zmieniasz bazowy URL i klucz, a potem sprawdzasz ID modelu na jego stronie.",
      },
      faq: {
        q1: {
          q: "Czy jest alternatywa dla OpenRouter z modelami bez cenzury?",
          a: "Tak. {{appName}} ma {{uncensored}} modeli bez cenzury od Venice, NanoGPT, uncensored.ai, FreedomGPT i Gab AI w jednym czacie i jednym API. NanoGPT i Venice też sprzedają modele bez cenzury przez API. Sam OpenRouter ma ich tylko kilka.",
        },
        q2: {
          q: "Czy OpenRouter pozwala na treści NSFW?",
          a: "Regulamin wymaga 18+, a wejście jest skanowane pod kątem znanych materiałów CSAM. Każdy dostawca ma własne zasady, a 142 z 474 modeli na liście mają flagę moderacji, więc to, czy zapytanie przejdzie, zależy od modelu i dostawcy.",
        },
        q3: {
          q: "Ile pobiera OpenRouter?",
          a: "Ceny katalogowe dostawców za token plus 5,5% opłaty od zakupu kredytów w standardowym planie. Subskrypcji nie ma. Darmowe modele pozwalają na 50 zapytań dziennie, 1000 po zakupie kredytów za 10 USD.",
        },
        q4: {
          q: "Czy mogę użyć mojego kodu pod OpenRouter z {{appName}}?",
          a: "Tak, jeśli korzysta z formatu OpenAI: ustaw nasz bazowy URL, swój klucz {{appName}} i nasze ID modeli. API odblokowuje się po dowolnym planie (od {{apiSubPrice}} miesięcznie) albo zakupie kredytów.",
        },
      },
      cta: { title: "Czatuj z modelami, których OpenRouter nie ma" },
    },
  },
};
