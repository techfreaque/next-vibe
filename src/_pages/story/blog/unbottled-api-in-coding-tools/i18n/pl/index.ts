import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Codex CLI i Claude Code na każdym modelu - {{appName}} API",
    description:
      "Codex CLI, Claude Code, OpenCode, Continue, Aider i Cline na jednym kluczu {{appName}}. Claude, GPT, DeepSeek, GLM i modele niecenzurowane. Jeden adres bazowy, jedno polecenie na narzędzie.",
    category: "Przewodnik dla programistów",
    imageAlt: "{{appName}} API w narzędziach do kodowania",
    keywords:
      "{{appName}}, Codex CLI, Claude Code, OpenCode, Continue, Aider, Cline, API zgodne z OpenAI, Responses API, Anthropic Messages API, agent kodujący, modele niecenzurowane, własny dostawca",
  },
  hero: {
    backToBlog: "Wróć do bloga",
    category: "Przewodnik dla programistów",
    readTime: "8 min czytania",
    title: "Jeden klucz. Każdy model. Codex i Claude Code też.",
    subtitle:
      "Codex CLI i Claude Code łączą się teraz z {{appName}} bezpośrednio, tak jak OpenCode, Continue, Aider i Cline. Jeden adres bazowy, jeden klucz, jedno polecenie na narzędzie.",
  },
  intro: {
    lead: "Twój agent kodujący jest przywiązany do modeli jednego dostawcy. Chcesz drugiej opinii z innego laboratorium, taniego modelu do czarnej roboty albo takiego, który nie odmawia? To kolejne konto, kolejny klucz, kolejny rachunek.",
    p2: "{{appName}} mówi wszystkimi trzema formatami, których używają agenci kodujący: OpenAI chat completions, OpenAI Responses API i Anthropic Messages API. Nic pośrodku, nic do instalowania. Podłączasz narzędzie raz i przełączasz się między Claude, GPT, DeepSeek, GLM, Kimi, Qwen i modelami niecenzurowanymi, zmieniając jedno ID modelu.",
  },
  why: {
    title: "Po co to wszystko",
    oneKey:
      "Jeden klucz, jedno saldo. Bez osobnych kont w Anthropic, OpenAI, DeepSeek, Moonshot i Z.ai.",
    uncensored:
      "Modele niecenzurowane w edytorze. Badania bezpieczeństwa, prompty red-teamowe, narzędzia do fikcji, dane, na których wykładają się filtry głównego nurtu. Poziom filtrowania wybierasz ty, nie dostawca.",
    switch:
      "Właściwy model do zadania. Model z górnej półki do trudnego refaktoru, model flash do zmiany nazw i szkieletów testów. Ta sama konfiguracja, inne ID.",
    billing:
      "Te same kredyty co w aplikacji czatu, te same ceny. Każda odpowiedź podaje, ile kosztowała.",
  },
  setup: {
    title: "Zdobądź klucz i adres bazowy",
    intro: "Dwie wartości. Każde narzędzie poniżej potrzebuje dokładnie ich.",
    p1: "Utwórz klucz w Ustawienia > Klucze API. Zaczyna się od sk-unb- i zobaczysz go tylko raz. API jest w każdym płatnym planie: aktywna subskrypcja albo dowolny pakiet kredytów je odblokowuje.",
    shortcut:
      "Najszybciej: zaraz po utworzeniu klucza strona Klucze API pokazuje każdy blok z tego wpisu, z twoim kluczem już wpisanym. Wybierasz narzędzie, kopiujesz, odpalasz.",
    baseUrlLabel: "Adres bazowy",
    baseUrlNote:
      "Dla narzędzi w stylu OpenAI: Codex, OpenCode, Continue, Aider, Cline. Locale w ścieżce zmienia tylko język komunikatów o błędach.",
    anthropicBaseUrlLabel: "Adres bazowy Anthropic",
    anthropicBaseUrlNote:
      "Dla Claude Code i SDK Anthropic. Ten sam adres bez /v1: /v1/messages dopisują same.",
    p2: "Trzymaj klucz w zmiennej środowiskowej, nigdy w pliku, który commitujesz. Wywołanie curl potwierdza, że klucz działa, i wypisuje każde ID modelu dostępne dla twojego konta, z rozmiarem kontekstu, obsługą narzędzi i cenami w kredytach.",
  },
  compat: {
    title: "Każde narzędzie łączy się bezpośrednio",
    intro:
      "Agenci kodujący mówią trzema różnymi formatami. Obsługujemy wszystkie trzy, na tym samym kluczu i tych samych modelach.",
    codex: "Codex CLI: OpenAI Responses API.",
    claudeCode: "Claude Code: Anthropic Messages API.",
    chat: "OpenCode, Continue, Aider, Cline: OpenAI chat completions.",
    other:
      "Każde inne narzędzie z polem na adres bazowy działa tak samo: adres bazowy, klucz, ID modelu.",
  },
  wire: {
    responses: "Responses API",
    messages: "Messages API",
    chat: "Chat completions",
  },
  codex: {
    intro:
      "Terminalowy agent od OpenAI. Czyta repo, uruchamia polecenia, edytuje pliki.",
    p1: "Codex mówi Responses API, my też. Jedno polecenie definiuje dostawcę w locie: nic do edycji, nic do instalowania. Na co dzień dopisz konfigurację raz i uruchamiaj Codex z profilem.",
    p2: 'Model zmieniasz przez -m albo linię model w profilu. Zostaw wire_api = "responses": aktualny Codex nie przyjmuje niczego innego.',
  },
  claudeCode: {
    intro:
      "Terminalowy agent od Anthropic. Planuje, edytuje, odpala testy, wysyła subagentów.",
    p1: "Claude Code czyta bramkę ze zmiennych środowiskowych. ANTHROPIC_BASE_URL to adres bazowy bez /v1. ANTHROPIC_MODEL ustawia główny model. Domyślne OPUS i SONNET obsługują wybór modelu i tryb planowania, domyślny HAIKU przenosi zadania w tle, na przykład tytuły sesji, na tani model, a CLAUDE_CODE_SUBAGENT_MODEL dotyczy subagentów. CLAUDE_CODE_MAX_CONTEXT_TOKENS podaje Claude Code prawdziwy rozmiar kontekstu modelu spoza rodziny Claude, więc kompaktuje rozmowę we właściwym momencie.",
    p2: "Wolisz samego Claude? Usuń linie z modelami. Claude Code poprosi o swoje zwykłe ID Claude, a my skierujemy je do naszego odpowiadającego modelu Claude, rozliczanego w kredytach.",
    p3: "Claude Code wysyła duży prompt systemowy, ponad 30k tokenów wejściowych nawet przy banalnym zadaniu. Tani model domyślny trzyma koszty w ryzach.",
  },
  opencode: {
    intro: "Otwartoźródłowy agent do terminala, z TUI i trybem bez interfejsu.",
    p1: "Zapisz konfigurację jako opencode.json w projekcie albo jako ~/.config/opencode/opencode.json dla wszystkich projektów. Klucz zostaje w twoim środowisku. Do mapy models dodasz dowolne ID z GET /v1/models, a w TUI wybierzesz je przez /models.",
    gotcha:
      "Najpierw zaktualizuj OpenCode. Stare wersje 1.0.x pobierają najnowszy pakiet @ai-sdk/openai-compatible i padają po pierwszym wywołaniu narzędzia z DecimalError: Invalid argument. 1.19.5 uruchamia tę samą konfigurację bez błędów.",
  },
  continue: {
    intro: "Asystent kodowania dla VS Code i JetBrains, do tego CLI cn.",
    p1: "secrets.UNBOTTLED_API_KEY jest brany z twojego środowiska. Dodaj -p z promptem, a działa bez interfejsu. Rozszerzenie IDE czyta ~/.continue/config.yaml: wpisz tam ten sam model.",
  },
  aider: {
    intro: "Programowanie w parze w terminalu, razem z commitami.",
    p1: "Jedno polecenie, zero plików konfiguracyjnych. Aider chce openai/ przed ID modelu i sam je usuwa, zanim nas wywoła. --edit-format diff trzyma zmiany w ryzach; bez tego przy nieznanym ID modelu Aider wysyła całe pliki od nowa. Pliki do edycji podajesz w poleceniu, jak zwykle w Aiderze.",
  },
  cline: {
    intro: "Autonomiczny agent kodujący, w VS Code i jako CLI.",
    p1: "Dwa polecenia w Cline CLI: raz zapisujesz dostawcę, potem uruchamiasz cline. Adres bazowy, klucz i ID modelu to te same trzy wartości co wszędzie.",
  },
  models: {
    title: "Jaki model do jakiej roboty",
    intro:
      "Wszystkie poniżej obsługują wywołania narzędzi, bez których agent nie pracuje. ID wpisujesz do konfiguracji.",
    strong: {
      title: "Trudne problemy",
      body: "Duże refaktory, nieznane bazy kodu, wieloetapowe debugowanie. Wyższe ceny w kredytach, mniej błądzenia.",
    },
    cheap: {
      title: "Tanio i szybko",
      body: "Zmiany nazw, testy, boilerplate, zadania w tle. Ułamek ceny modelu z górnej półki. Dobry wybór domyślny dla agentów z dużymi promptami.",
    },
    uncensored: {
      title: "Niecenzurowane",
      body: "Ten sam sposób pracy agenta, bez odruchu odmowy. Analiza exploitów, narzędzia red-teamowe, potoki fikcji dla dorosłych, scrapery, przy których inne modele prawią kazania. Za to, co budujesz, odpowiadasz ty.",
    },
    listNote:
      "ID zmieniają się, gdy modele są zastępowane. Źródłem prawdy jest GET /v1/models: jeśli ID nie ma na liście dla twojego klucza, API zwraca 404 model_not_found. Jedyne mapowanie dotyczy Claude Code: jego wbudowane ID Claude trafiają do naszego najnowszego Claude z tej samej rodziny.",
  },
  gotchas: {
    title: "Pułapki, na które wpadliśmy",
    intro: "Żebyś ty nie musiał.",
    localeUrl:
      "Skopiuj adres bazowy dokładnie, razem z /api/<locale>/v1. Bez locale dostaniesz przekierowanie, które część klientów gubi. Bez /api dostaniesz stronę HTML zamiast JSON.",
    anthropicUrl:
      "Claude Code dostaje adres bazowy bez /v1. Z /v1 wywoła /v1/v1/messages i trafi na 404.",
    modelId:
      "Używaj dokładnie ID z GET /v1/models, na przykład deepseek-v4.1-flash. Aider chce openai/ z przodu. Wbudowane ID Claude z Claude Code trafiają same do naszego najnowszego Claude z tej samej rodziny. Każde inne nieznane ID zwraca 404 model_not_found.",
    paid: "HTTP 402 z paid_plan_required znaczy, że konto nie ma jeszcze płatnego planu. Naprawia to dowolny pakiet kredytów.",
    tools:
      "Model bez obsługi narzędzi zwraca 400 tools_not_supported, gdy tylko agent wyśle narzędzia. Sprawdź supports_tools w GET /v1/models.",
    rateLimit:
      "Każdy klucz to 60 żądań na minutę. Agenci strzelają wieloma małymi wywołaniami. Jeśli trafisz na 429, daj agentowi osobny klucz.",
  },
  cta: {
    title: "Podłączone jednym poleceniem.",
    subtitle:
      "Utwórz klucz, skopiuj blok dla swojego narzędzia, wybierz model. Dokumentacja API opisuje każdy endpoint, każde pole, każdy kod błędu i każdy szczegół streamingu.",
    key: "Utwórz klucz API",
    docs: "Przeczytaj dokumentację API",
  },
};
