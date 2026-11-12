import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Każdy model w twoim agencie kodującym - {{appName}} API",
    description:
      "OpenCode, Continue, Codex CLI i Claude Code na jednym kluczu {{appName}}. Claude, GPT, DeepSeek, GLM i modele niecenzurowane. Sprawdzone konfiguracje, prawdziwe pułapki.",
    category: "Przewodnik dla programistów",
    imageAlt: "{{appName}} API w narzędziach do kodowania",
    keywords:
      "{{appName}}, API zgodne z OpenAI, OpenCode, Codex CLI, Claude Code, Continue, LiteLLM, agent kodujący, modele niecenzurowane, własny dostawca",
  },
  hero: {
    backToBlog: "Wróć do bloga",
    category: "Przewodnik dla programistów",
    readTime: "9 min czytania",
    title: "Jeden klucz. Każdy model. Prosto w twoim agencie.",
    subtitle:
      "Podłącz API {{appName}} do OpenCode, Continue, Codex CLI i Claude Code. Każdą konfigurację poniżej uruchomiliśmy od początku do końca, zanim ją opublikowaliśmy.",
  },
  intro: {
    lead: "Twój agent kodujący jest przywiązany do modeli jednego dostawcy. Chcesz drugiej opinii z innego laboratorium, taniego modelu do czarnej roboty albo takiego, który nie odmawia? To kolejne konto, kolejny klucz, kolejny rachunek.",
    p2: "{{appName}} mówi formatem OpenAI chat completions. Podłączasz narzędzie raz i przełączasz się między Claude, GPT, DeepSeek, GLM, Kimi, Qwen i modelami niecenzurowanymi, zmieniając jedno ID modelu. Dwa narzędzia łączą się bezpośrednio, dwa potrzebują małego lokalnego mostu. Poniżej dokładnie jak, z wersjami, które testowaliśmy.",
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
      "Te same kredyty co w aplikacji czatu, te same ceny. Każda odpowiedź podaje swój koszt w usage.credits_charged.",
  },
  setup: {
    title: "Zdobądź klucz i bazowy URL",
    intro: "Dwie wartości. Każde narzędzie poniżej potrzebuje dokładnie ich.",
    p1: "Utwórz klucz w Ustawienia > Klucze API. Zaczyna się od sk-unb- i zobaczysz go tylko raz. API jest w każdym płatnym planie: aktywna subskrypcja albo dowolny pakiet kredytów je odblokowuje.",
    baseUrlLabel: "Bazowy URL",
    baseUrlNote:
      "Locale w ścieżce zmienia tylko język komunikatów o błędach. Działa każde.",
    p2: "Trzymaj klucz w zmiennej środowiskowej, nigdy w pliku, który commitujesz. Wywołanie curl potwierdza, że klucz działa, i wypisuje każde ID modelu dostępne dla twojego konta, z rozmiarem kontekstu, obsługą narzędzi i cenami w kredytach.",
  },
  compat: {
    title: "Co łączy się jak",
    intro:
      "Agenci kodujący mówią trzema różnymi formatami. My obsługujemy jeden z nich: chat completions. To przesądza o konfiguracji.",
    opencode:
      "OpenCode: bezpośrednio. Mówi chat completions przez swojego dostawcę zgodnego z OpenAI.",
    continue:
      "Continue (CLI i rozszerzenie IDE): bezpośrednio. provider: openai z własnym apiBase.",
    codex:
      "Codex CLI: potrzebuje mostu. Aktualny Codex mówi tylko OpenAI Responses API. Obsługę chat completions usunięto na początku 2026.",
    claudeCode:
      "Claude Code: potrzebuje mostu. Mówi Anthropic Messages API, nie formatem OpenAI.",
    other:
      "Każde inne narzędzie z polem na bazowy URL OpenAI działa jak OpenCode: bazowy URL, klucz, ID modelu. Wymieniamy tylko narzędzia, które sami uruchomiliśmy.",
  },
  opencode: {
    label: "Bezpośrednio",
    title: "OpenCode",
    intro:
      "Testowane na OpenCode 1.19.5. Wywołania narzędzi, czytanie i edycja plików działają.",
    p1: "Dodaj własnego dostawcę do opencode.json w projekcie albo do ~/.config/opencode/opencode.json dla wszystkich projektów. Klucz zostaje w twoim środowisku. Do mapy models możesz dodać dowolne ID z GET /models.",
    p2: "Potem uruchom albo wybierz model w TUI przez /models:",
    gotcha:
      "Najpierw zaktualizuj OpenCode. Stare wersje 1.0.x pobierają najnowszy pakiet @ai-sdk/openai-compatible i padają po pierwszym wywołaniu narzędzia z DecimalError: Invalid argument. 1.19.5 uruchamia tę samą konfigurację bez błędów.",
  },
  continue: {
    label: "Bezpośrednio",
    title: "Continue",
    intro:
      "Testowane na Continue CLI 1.5.47. Rozszerzenie IDE czyta ten sam config.yaml.",
    p1: "secrets.UNBOTTLED_API_KEY jest brany z twojego środowiska. Z -p działa bez interfejsu, bez -p startuje sesja interaktywna:",
  },
  bridge: {
    label: "Most",
    title: "Most LiteLLM",
    intro:
      "Codex i Claude Code potrzebują tłumacza. LiteLLM działa na twoim komputerze i zamienia ich formaty na chat completions.",
    p1: "Jeden proxy LiteLLM obsługuje oba narzędzia. Wystawia /v1/responses dla Codex i /v1/messages dla Claude Code, a wszystko przekazuje do {{appName}} jako chat completions. Wpisz każdy model, którego chcesz używać. Testowane na LiteLLM 1.109.1.",
    gotcha:
      "Użyj prefiksu custom_openai/, nie openai/. Z openai/ LiteLLM przekazuje wywołania Codex jako natywne żądania Responses, a nasze API odpowiada 404. Bez LITELLM_MASTER_KEY LiteLLM w ogóle nie wystartuje. Ta wartość to klucz, który twoje narzędzia wysyłają do mostu. Twój klucz sk-unb nigdy nie opuszcza proxy.",
  },
  codex: {
    label: "Przez most",
    title: "Codex CLI",
    intro:
      "Testowane na codex-cli 0.118.0. Uruchomił polecenie powłoki i odpowiedział na podstawie wyniku.",
    p1: 'Skieruj własnego dostawcę na most. wire_api musi mieć wartość "responses". Na "chat" Codex odpowiada twardym błędem już przy starcie. env_key wskazuje zmienną z kluczem do mostu.',
    p2: "Używaj ID modeli z litellm.yaml. Żeby zmienić model, dodaj jego ID do konfiguracji mostu i zmień model w config.toml albo podaj -m w wierszu poleceń.",
  },
  claudeCode: {
    label: "Przez most",
    title: "Claude Code",
    intro:
      "Testowane na Claude Code 2.1.322. Użył narzędzia Read w trzech turach i odpowiedział poprawnie.",
    p1: "Claude Code czyta bramkę ze zmiennych środowiskowych. ANTHROPIC_MODEL ustawia główny model. ANTHROPIC_DEFAULT_HAIKU_MODEL przenosi zadania w tle, na przykład tytuły sesji, na tani model, żeby nie zjadały głównego.",
    p2: "Claude Code ostrzeże, że nie zna ID modelu, i przyjmie okno kontekstu 200k. To normalne i nieszkodliwe. Koszt, który pokazuje, to jego własny szacunek. Twój prawdziwy koszt to kredyty pobrane przez {{appName}}.",
    caveat:
      "Anthropic oficjalnie nie wspiera Claude Code z modelami innymi niż Claude przez bramkę. Działa, przetestowaliśmy to, ale traktuj to jako eksperyment: aktualizacja Claude Code może to zepsuć. Claude Code wysyła też duży prompt systemowy, ponad 30k tokenów wejściowych nawet przy banalnym zadaniu. Wybierz tani model albo pilnuj salda.",
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
      "ID zmieniają się, gdy modele są zastępowane. Źródłem prawdy jest GET /models: jeśli ID nie ma na liście dla twojego klucza, API zwraca 404 model_not_found i nigdy po cichu nie podmienia modelu.",
  },
  gotchas: {
    title: "Pułapki, na które wpadliśmy",
    intro: "Żebyś ty nie musiał.",
    localeUrl:
      "Skopiuj bazowy URL dokładnie, razem z /api/<locale>/v1. Bez locale dostaniesz przekierowanie, które część klientów gubi. Bez /api dostaniesz stronę HTML zamiast JSON.",
    modelId:
      "Używaj dokładnie ID z GET /models, na przykład deepseek-v4.1-flash. Prefiksy dostawców jak openai/ należą tylko do konfiguracji LiteLLM, nigdy do żądania.",
    paid: "HTTP 402 z paid_plan_required znaczy, że konto nie ma jeszcze płatnego planu. Naprawia to dowolny pakiet kredytów.",
    tools:
      "Model bez obsługi narzędzi zwraca 400 tools_not_supported, gdy tylko agent wyśle narzędzia. Sprawdź supports_tools w GET /models.",
    bridgeKey:
      "Za mostem 401 może przyjść z obu stron. LiteLLM odrzuca zły klucz główny, {{appName}} odrzuca zły klucz sk-unb. Log LiteLLM powie ci, który.",
    rateLimit:
      "Każdy klucz to 60 żądań na minutę. Agenci strzelają wieloma małymi wywołaniami. Jeśli trafisz na 429, daj agentowi osobny klucz.",
  },
  cta: {
    title: "Podłączysz to w pięć minut.",
    subtitle:
      "Utwórz klucz, wklej jedną konfigurację, wybierz model. Dokumentacja API opisuje każde pole, każdy kod błędu i każdy szczegół streamingu.",
    key: "Utwórz klucz API",
    docs: "Przeczytaj dokumentację API",
  },
};
