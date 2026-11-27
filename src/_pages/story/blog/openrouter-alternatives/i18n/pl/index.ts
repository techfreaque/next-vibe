import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternatywy dla OpenRouter bez cenzury, porównane | {{appName}}",
    description:
      "OpenRouter nie ma modeli abliterowanych. Porównaj OpenUncensored, Refuseless, NEAR AI Cloud, NanoGPT, Venice, Featherless i {{appName}} pod kątem modeli bez cenzury, opłat, prywatności i formatów API.",
    category: "Przewodnik dla deweloperów",
    imageAlt:
      "Alternatywy dla OpenRouter bez cenzury dla programistów, porównane",
    keywords:
      "alternatywa dla OpenRouter bez cenzury, alternatywa dla OpenRouter, alternatywy dla OpenRouter, OpenRouter modele bez cenzury, API modeli abliterowanych, API LLM bez cenzury, strony takie jak OpenRouter, brama API LLM, API zgodne z OpenAI, API zgodne z Anthropic, OpenUncensored, Refuseless, NEAR AI Cloud, UncensoredLLM.ai, abliteration.ai, Featherless, OpenRouter vs NanoGPT, uncensored OpenRouter alternative, {{appName}}",
  },
  hero: {
    backToBlog: "Wróć do bloga",
    category: "Przewodnik dla deweloperów",
    readTime: "11 min czytania",
    title: "Alternatywy dla OpenRouter bez cenzury",
    subtitle:
      "{{count}} alternatyw i {{appName}}, porównane pod kątem modeli bez cenzury, formatów API i opłat. Sprawdzone {{date}}.",
  },
  intro: {
    lead: "OpenRouter daje 477 modeli pod jednym kluczem. Do pracy bez cenzury półka jest cienka: 17 tunów do roleplayu lub bez cenzury i ani jednego modelu abliterowanego.",
    p2: "Dlatego sprawdziliśmy hosty API bez cenzury, hosty roleplayu za ryczałt, bramy i aplikacje według ich własnej dokumentacji, cenników i list modeli. My też kupujemy dostęp do modeli w OpenRouter: przez niego idzie {{openRouterModels}} naszych modeli.",
  },
  shelf: {
    title: "Co OpenRouter ma do pracy bez cenzury",
    intro: "Z jego publicznej listy modeli i regulaminu, czytane {{orDate}}.",
    tunes:
      "17 z 477 modeli pasuje nazwą lub opisem do roleplayu albo braku cenzury: Venice Uncensored (tun Dolphin Mistral 24B), Hermes 4 405B, Cydonia, Skyfall, Magnum v4 72B, Euryale, MythoMax i garść modeli Aion RP.",
    abliterated:
      "Zero ID modeli zawiera słowa abliterated lub uncensored. Abliterowanych wersji GLM 5.3, DeepSeek V4.1 Flash i Kimi K3.1 Pro, które sprzedają routery bez cenzury, tam nie ma.",
    rules:
      "Zasady: 18+, automatyczne filtrowanie CSAM, poza tym obowiązuje regulamin danego modelu. Modele standardowe nadal odmawiają tego, czego odmawiają ich producenci.",
    callout:
      "Potrzebujesz abliterowanych wag? OpenRouter to zły router. Potrzebujesz fine-tunów do roleplayu? Ma przyzwoitą półkę.",
  },
  apis: {
    title: "Alternatywy API bez cenzury, jedna po drugiej",
    intro:
      "Usługi stawiające na API, które sprzedają wagi abliterowane lub bez cenzury. Z ich własnych stron, czytane {{marketDate}}.",
    visit: "Odwiedź {{name}}",
    openUncensored: {
      heading: "OpenUncensored: router tylko dla modeli bez cenzury",
      body: "58 modeli tekstowych, 20 obrazowych i 3 wideo, prawie wszystkie abliterowane, kierowane do Venice, NanoGPT, Refuseless i innych. Bez prowizji od cen dostawców, doładowania od 5 USD, które nigdy nie wygasają, i bez konta: Twój klucz API jest kontem. OpenAI, Responses i Anthropic Messages pod jednym bazowym URL.",
      catch:
        "Haczyk: brak darmowego planu, brak czatu w przeglądarce (tylko aplikacja na komputer) i metadane zapytań przechowywane do dwóch lat.",
    },
    refuseless: {
      heading: "Refuseless: najtańsze abliterowane wersje, jakie znaleźliśmy",
      body: "Abliterowane GLM 5.3, GLM 5.3 Flash, DeepSeek V4.1 Flash i Kimi K3.1 Pro z kontekstem 1 mln. DeepSeek V4.1 Flash abliterated kosztuje 0,12 USD za wejście i 0,45 USD za wyjście na milion tokenów. Chat completions, Responses i Anthropic Messages, w tym Claude Code.",
      catch:
        "Haczyk: tylko API, wymagany zweryfikowany mail, a strony z cennikiem, prywatnością i regulaminem zablokowały nasz czytnik.",
    },
    nearAi: {
      heading: "NEAR AI Cloud: modele abliterowane w poufnych obliczeniach",
      body: "Atestacja sprzętowa, dzięki której według dostawcy ani NEAR, ani host chmury nie mogą czytać Twoich promptów. Dwa modele abliterowane: Qwen 3.8 27B za 0,04 USD za wejście i 1,35 USD za wyjście na milion tokenów oraz DeepSeek V4.1 Flash 1017. Bez wniosku, bez weryfikacji tożsamości, płatność za token.",
      catch: "Haczyk: tylko format OpenAI i malutka półka bez cenzury.",
    },
    uncensoredLlmAi: {
      heading: "UncensoredLLM.ai: największy katalog bez cenzury",
      body: "332 modele czatu plus 13 modeli obrazu i wideo, z codzienną kontrolą odmów. Formaty OpenAI, Anthropic i Gemini na jednym przedpłaconym kluczu. Karta lub krypto od 3 USD, a saldo nigdy nie wygasa.",
      catch:
        "Haczyk: zakaz odsprzedaży i refakturowania API bez pisemnej zgody. Warunków prywatności nie opublikowano na przeczytanych stronach.",
    },
    abliterationAi: {
      heading:
        "abliteration.ai: własne modele abliterowane, prywatność na piśmie",
      body: "Własne modele abliterowane w formatach OpenAI i Anthropic. Według dostawcy prompty i wyniki są przetwarzane w pamięci, domyślnie nigdy nie zapisywane i nigdy nie używane do treningu. Opcja regionu UE oraz brama polityk na Twoje własne reguły.",
      catch:
        "Haczyk: droższe niż Refuseless czy NEAR AI przy podobnych wagach, a modele bazowe pozostają bez nazwy.",
    },
    flatRate: {
      heading:
        "Featherless, Infermatic, Arli AI: ryczałt dla intensywnego roleplayu",
      body: "Featherless ma ponad 50 000 modeli z Hugging Face, 1398 oznaczonych jako abliterated, z ryczałtowym planem Chat za 25 USD. Infermatic sprzedaje wyselekcjonowane tuny roleplayu 70B od 9 USD miesięcznie. Arli AI oferuje plany z nielimitowanymi tokenami od 15 USD i fine-tuny derestricted. Wszystkie trzy deklarują brak logów promptów.",
      catch:
        "Haczyk: plany osobiste nie mogą zasilać aplikacji, a dostajesz od 1 do 6 równoległych zapytań.",
    },
    deepInfra: {
      heading: "DeepInfra: tanie modele standardowe, żadnych bez cenzury",
      body: "Jedna z najtańszych za token opcji dla standardowych modeli open: DeepSeek V4.1 Flash za 0,14 USD za wejście i 0,42 USD za wyjście na milion tokenów, 200 równoległych zapytań na model. Dostawca deklaruje, że dane wejściowe API nigdy nie są zapisywane na dysku.",
      catch: "Haczyk: w katalogu nie ma modeli bez cenzury ani do roleplayu.",
    },
  },
  gateways: {
    title: "Jeśli potrzebujesz tylko routera",
    intro:
      "Bramy kierują ruch do dostawców, których sam skonfigurujesz. Żadna z nich nie dodaje modeli bez cenzury.",
    vercel:
      "Vercel AI Gateway: usługa hostowana, cena tokena dostawcy bez narzutu, zbudowana pod AI SDK.",
    selfHost:
      "LiteLLM lub Bifrost: open source, na własnym serwerze, z Twoimi kluczami dostawców, budżetami i fallbackami.",
    control:
      "Portkey, Cloudflare AI Gateway, Helicone: guardraile, cache, logi zapytań i kontrola wydatków na wierzchu.",
  },
  criteria: {
    title: "Co porównać przed zmianą",
    intro: "Rozstrzyga sześć pytań.",
    catalog:
      "Katalog: ile modeli, z ilu laboratoriów i czy są tam te, których używasz dziś?",
    uncensored: "Modele bez cenzury: ile ma usunięte odmowy i jakiego rodzaju?",
    formats:
      "Formaty: tylko OpenAI chat completions, czy też Responses API i Anthropic Messages API, z których korzystają agenty do kodowania?",
    billing:
      "Rozliczenie: cena katalogowa plus opłata, marża czy subskrypcja? I co się dzieje przy zerowym saldzie?",
    data: "Dane: czy prompty są zapisywane, logowane albo używane do trenowania i czy to opt-in?",
    chat: "Czat: czy osoby, które nie piszą kodu, mogą używać tych samych modeli w przeglądarce?",
  },
  table: {
    title: "Wszystkie obok siebie",
  },
  us: {
    title: "{{appName}}: jeden klucz, każdy rodzaj modelu",
    intro:
      "{{modelCount}} modeli czatu pod jednym kluczem, {{uncensored}} z nich bez cenzury.",
    models:
      "Modele: Claude, GPT, Gemini, Grok, DeepSeek, Kimi, GLM i Qwen obok {{uncensored}} modeli bez cenzury. {{ownModel}} jest trenowany na książkach i dokumentach zakazanych w mainstreamowym internecie, przez co ma przeciwne poglądy polityczne.",
    formats:
      "Formaty: OpenAI chat completions, OpenAI Responses API i Anthropic Messages API. Każde SDK i każdy agent do kodowania wskazuje na jeden base URL.",
    billing:
      "Rozliczenie: jedno saldo kredytów, nasza marża {{markup}}% ponad to, co płacimy. Pierwszy zakup odblokowuje klucze API, plany zaczynają się od {{apiSubPrice}} miesięcznie.",
    chat: "Czat: te same modele w czacie webowym z folderami, narzędziami i generowaniem obrazów, wideo i muzyki. Osoby spoza działu dev też dostają modele.",
    openRouter:
      "OpenRouter w środku: {{openRouterModels}} naszych modeli idzie przez OpenRoutera. Te same modele, jedno konto razem z modelami bez cenzury.",
    weak: "Gdzie jesteśmy słabsi: OpenRouter nie dolicza narzutu do inferencji, tylko 5,5 % opłaty przy zakupie kredytów. My doliczamy {{markup}} % do tego, co sami płacimy. OpenRouter pozwala używać własnych kluczy dostawców, kierować ruch tylko do endpointów bez retencji danych i wybierać dostawców per zapytanie. U nas tego nie ma. A abliterowane routery z listy wyżej biją nas ceną na każdym wspólnym modelu.",
    codeLabel: "Przenosiny klienta OpenAI SDK: zmień base URL i klucz",
    docsLink: "Dokumentacja API: endpointy, uwierzytelnianie i limity",
    formatsLink: "API zgodne z OpenAI i Anthropic, wyjaśnione",
    toolsLink: "Jeden klucz w Claude Code, Codex CLI, Aiderze i innych",
  },
  models: {
    title: "{{apiUncensored}} modeli bez cenzury, które wywołasz już dziś",
    intro:
      "Każdy model bez cenzury w API, z identyfikatorem, który podajesz jako model. Od najtańszego.",
    colModel: "Model",
    colId: "ID w API",
    colContext: "Kontekst",
    colPrice: "Za wiadomość",
    footnote:
      "Cena jednej wiadomości referencyjnej z naszą marżą {{markup}}%. Etykieta pod nazwą mówi, jak powstał dany model.",
  },
  list: {
    title: "Aplikacje z API bez cenzury, jedna po drugiej",
    intro:
      "Według ich własnych stron, sprawdzone {{date}}. Czym jest każda, jak działa jej API, jakie ma modele i ile kosztuje.",
    heading: "{{number}}. {{name}}: {{kind}}",
    api: "API:",
    models: "Modele:",
    price: "Cena:",
    priceValue: "Za darmo: {{free}}. Płatnie: {{plans}}.",
    pro: "Największy plus:",
    con: "Haczyk:",
    forWho: "Wybierz, jeśli:",
    versusLink: "{{appName}} kontra {{name}}: pełne porównanie",
    visit: "Odwiedź {{name}}",
  },
  stay: {
    title: "Kiedy OpenRouter nadal jest dobrym wyborem",
    intro: "Czasem oryginał to lepsze narzędzie.",
    rare: "Potrzebujesz niszowego modelu albo konkretnego dostawcy, którego nie obsługuje nikt inny z tej listy.",
    callout:
      "Wiele zespołów ma oba: OpenRoutera do długiego ogona i drugi klucz do modeli bez cenzury oraz czatu dla całego zespołu.",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "Jaka jest najlepsza alternatywa dla OpenRoutera?",
      a: "To zależy, czego brakuje Ci w OpenRouter. Abliterowane wagi w cenie dostawcy: OpenUncensored, Refuseless lub NEAR AI Cloud. Największy katalog bez cenzury: UncensoredLLM.ai lub Featherless. Płatność za użycie kryptowalutami: NanoGPT. Własne modele i tryby prywatności Venice: Venice. Lokalnie i za darmo: Ollama. Modele bez cenzury, otwarte i mainstream plus media i czat zespołowy na jednym kluczu: {{appName}}.",
    },
    cheaper: {
      q: "Czy jest tańsza alternatywa dla OpenRoutera?",
      a: "Porównuj cenę za model, nie opłatę. OpenRouter nie dolicza narzutu do inferencji, OpenUncensored nie bierze prowizji, a Refuseless i NEAR AI Cloud mają najtańsze abliterowane wersje, jakie znaleźliśmy. W {{appName}} płacisz tyle, ile my, plus {{markup}} % narzutu, a każda strona modelu pokazuje cenę za wiadomość.",
    },
    uncensored: {
      q: "Która alternatywa dla OpenRoutera ma modele bez cenzury?",
      a: "OpenUncensored, Refuseless, NEAR AI Cloud, UncensoredLLM.ai, abliteration.ai, NanoGPT, Venice, uncensored.ai, Gab AI i {{appName}} udostępniają modele bez cenzury przez API. {{appName}} ma ich teraz w API {{apiUncensored}}: abliterowane i dostrojone obok {{ownModel}}.",
    },
    sdk: {
      q: "Czy mogę zostawić swój kod z OpenAI SDK?",
      a: "Tak. Zmieniasz base URL i klucz API, resztę zostawiasz. Identyfikatory modeli różnią się między bramkami, więc je też podmień. Przykład: {{example}}.",
    },
    anthropic: {
      q: "Czy to działa z SDK Anthropic i agentami do kodowania?",
      a: "W {{appName}} tak: API Anthropic Messages działa obok formatów OpenAI, więc Claude Code i inni agenci łączą się jednym kluczem, także z modelami bez cenzury. OpenUncensored, Refuseless, NanoGPT i UncensoredLLM.ai też obsługują Anthropic Messages. Venice nie ma natywnego endpointu i kieruje Claude Code przez lokalne proxy.",
    },
    free: {
      q: "Czy jest darmowa alternatywa dla OpenRoutera?",
      a: "Ollama jest darmowa, jeśli Twój sprzęt uciągnie model. Sam OpenRouter ma 11 darmowych modeli z limitami dziennymi, a Infermatic ma darmowy plan w przeglądarce. {{appName}} daje co miesiąc darmowe kredyty na czat, a API odblokowuje się pierwszym zakupem.",
    },
    apiLink: "API LLM bez cenzury: identyfikatory, kod i limity",
    veniceLink: "Alternatywy dla Venice AI, porównanie",
    nanoGptLink: "Alternatywy dla NanoGPT, porównane",
    keysLink: "Zarządzaj kluczami API",
  },
  cta: {
    title: "Jeden klucz. Każdy model. Mniej odmów.",
    subtitle:
      "Najpierw sprawdź modele w czacie: {{guestCredits}} darmowych kredytów miesięcznie, bez konta.",
    start: "Wypróbuj model bez cenzury",
    docs: "Przeczytaj dokumentację API",
  },
};
