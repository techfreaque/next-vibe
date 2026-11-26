import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Porównanie platform",
  verify:
    "Dodatkowe opcje sprawdziliśmy {{date}} w podlinkowanych oficjalnych źródłach. Na telefonie przesuń tabelę w bok, by zobaczyć wszystkie kolumny. Limity zależą od planu i kraju.",
  related: "Więcej porównań alternatyw",
  kind: {
    chat: "Czat z mniejszą liczbą odmów",
    assistant: "Asystent ogólnego zastosowania",
    writing: "Pisanie kreatywne",
    privateChat: "Czat nastawiony na prywatność",
    frontend: "Interfejs do modeli",
    local: "Środowisko do modeli lokalnych",
    multiChat: "Czat z wyborem modeli",
    research: "Asystent do wyszukiwania źródeł",
    roleplay: "Odgrywanie postaci",
    companion: "Towarzysz AI",
    gateway: "Bramka API",
    inference: "Inferencja modeli w chmurze",
  },
  free: {
    yes: "Bezpłatny dostęp z limitami",
    software: "Bezpłatne oprogramowanie",
    trial: "Okres próbny lub kredyty na start",
    unlisted: "Sprawdź u dostawcy",
    public: "Bezpłatny dostęp",
  },
  paid: {
    plan: "Abonament",
    usage: "Według zużycia",
    both: "Abonament lub zużycie, zależnie od usługi",
    hosted: "Opcjonalny plan w chmurze",
    none: "Koszt sprzętu",
    contact: "Plany komercyjne",
    license: "Licencja i koszty modeli",
    unlisted: "Sprawdź u dostawcy",
    fixedAccess: "Przedpłata za 30 dni",
    byoApi: "Darmowa aplikacja, płacisz dostawcy modelu",
  },
  filter: {
    permissive: "Deklaruje mniej odmów",
    policy: "Obowiązują zasady dostawcy",
    adultPolicy: "Opcje dla dorosłych, obowiązują zasady platformy",
    selected: "Mniej odmów w wybranych modelach",
    varies: "Zależy od modelu i dostawcy",
    guardrails: "Konfigurowalne zabezpieczenia oraz zasady dostawcy",
  },
  privacy: {
    noFilter: "Deklaruje usuwanie czatów, zapisuje IP i dane o użyciu",
    trainingControl: "Usługa w chmurze, sprawdź ustawienia treningu",
    hosted: "Usługa w chmurze według zasad dostawcy",
    deviceHistory: "Historia na urządzeniu, zdalne modele otrzymują polecenia",
    enclave: "Przetwarzanie w izolacji sprzętowej",
    encryptedHistory: "Szyfrowana zapisana historia",
    proxy: "Serwer pośredniczący dla zapytań do chmury",
    noTraining: "Według dostawcy czaty nie służą do treningu",
    configurable: "Zależy od instalacji i logowania",
    localOption: "Na urządzeniu z modelem lokalnym",
    upstream: "Zależy od dostawcy modelu",
    noLogs: "Według dostawcy prompty nie są zapisywane",
  },
  api: {
    separate: "Osobna usługa API",
    unlisted: "Brak publicznie opisanej API",
    available: "Dostępne",
    local: "Lokalne API",
    backend: "Łączy się z backendem",
    openAi: "Zgodne z OpenAI",
    dual: "Zgodne z OpenAI i Anthropic",
    eligible: "W wybranych płatnych planach",
  },
  media: {
    text: "Tekst",
    image: "Obrazy",
    voice: "Głos",
    imageVoice: "Obrazy i głos",
    imageVideo: "Obrazy i wideo",
    all: "Obrazy, wideo i głos",
    varies: "Zależy od modelu lub planu",
  },
  open: {
    closed: "Usługa własnościowa",
    weights: "Część wag modeli jest dostępna",
    client: "Kod klienta jest dostępny",
    open: "Otwarte źródła, własna instalacja",
    core: "Dostępny otwarty komponent",
    license: "Kod dostępny na warunkach licencji",
  },
  fees: {
    topUp: "{{fee}} przy zakupie kredytów",
    markup: "{{fee}} od zużycia modeli",
    noMarkup: "Cena tokenów u dostawcy",
  },
  summaries: {
    noFilter:
      "Własny model w stylu GPT z regulacją tonu. Plan bezpłatny ma dzienny limit wiadomości.",
    chatGpt:
      "Wyszukiwanie, pliki i rozmowy głosowe w jednej aplikacji. Limity zależą od planu.",
    grok: "Przeszukuje wpisy z X i strony internetowe. Wyższe limity i część funkcji wymagają płatnego planu.",
    unrestricted:
      "Prosty czat w przeglądarce ze wskazanym modelem Dolphin-Mistral. Wersja webowa korzysta z jednego modelu tekstowego.",
    uncensoredCom:
      "Czat, postacie i multimedia w jednej usłudze. Limity zależą od planu.",
    hemmingway:
      "Proza dla dorosłych i odgrywanie ról z modelem o otwartych wagach. Unlocked skupia się na tekście.",
    maple:
      "Aplikacja weryfikuje środowisko obliczeniowe. Dostęp do modelu bez cenzury wymaga płatnego planu.",
    confer:
      "Klient sprawdza atest izolowanego środowiska przed wysłaniem danych. Dobry wybór do prywatnych rozmów tekstowych.",
    lumo: "Proton oferuje czat dla gości i szyfrowanie zapisanej historii bez dostępu dla dostawcy. Modele działają na serwerach Proton.",
    duck: "Wypróbujesz kilka modeli bez konta. DuckDuckGo przekazuje polecenia dostawcom modeli przez serwer pośredniczący.",
    morse:
      "Oferuje prywatną inferencję i opcję tekstową bez cenzury. Sprawdź modele dostępne w wybranym planie.",
    harbor:
      "Prywatny czat i wyszukiwanie w sieci z Harbor-1. Usługa przetwarza polecenia w chmurze.",
    leo: "Rozmawiasz o otwartej stronie prosto w Brave. Modele wbudowane i własne korzystają z różnych ścieżek danych.",
    openWebUi:
      "Samodzielnie hostowany interfejs do Ollama i zgodnych API. Backend modelu konfigurujesz osobno.",
    jan: "Czat na komputer z modelami do pobrania i lokalnym API. Wybór modeli zależy od sprzętu.",
    anythingLlm:
      "Zadawaj pytania o dokumenty z obszaru roboczego. Lokalne generowanie i osadzenia pozwalają przetwarzać dane na urządzeniu.",
    gpt4all:
      "Czat na komputer z wyszukiwaniem w lokalnych dokumentach. Rozmiar modelu zależy od dostępnej pamięci.",
    llamaCpp:
      "Uruchamiaj modele GGUF z dokładną kontrolą inferencji i zgodnym serwerem lokalnym. Konfiguracja wymaga wiedzy technicznej.",
    typingMind:
      "Obszar roboczy czatu z lokalnym zapisem i własnymi kluczami dostawców. Opłaty za modele naliczane są osobno.",
    poe: "Różne modele i boty społeczności w jednej aplikacji. Korzystanie z nich zużywa punkty obliczeniowe.",
    claude:
      "Projekty, artefakty i wyszukiwanie w sieci do pisania i programowania. Obowiązują limity i zasady dostawcy.",
    gemini:
      "Deep Research i połączenia z aplikacjami Google. Limity modeli i multimediów zależą od planu.",
    perplexity:
      "Odpowiedzi z sieci z odnośnikami do źródeł. Zaawansowany research i wybór modeli wymagają płatnego planu.",
    copilot:
      "Pasuje do pracy w Microsoft 365. Integracja z aplikacjami Office zależy od planu.",
    meta: "Dostępny w obsługiwanych aplikacjach Meta. Funkcje zależą od aplikacji i kraju.",
    mistral:
      "Asystent Mistrala łączy czat z funkcjami do programowania. W aplikacji online obowiązują zasady Mistrala.",
    deepseek:
      "Czat DeepSeek w chmurze, osobne API i wagi wybranych modeli do pobrania. Sprawdź zasady używanej wersji.",
    qwen: "Alibaba oferuje czat Qwen i publikuje wagi modeli. Hosting i filtry zależą od używanej wersji.",
    kimi: "Asystent Moonshot oferuje modele Kimi i narzędzia do programowania. Korzystanie z chmury zależy od planu.",
    spicychat:
      "Wybieraj postacie społeczności już w planie bezpłatnym. Płatne plany dają wyższe limity i dodatkowe funkcje.",
    chub: "Ogromna biblioteka kart postaci i lorebooków. Własne modele wymagają planu Mars, a darmowa ścieżka to mały dzienny limit albo własny backend.",
    dreamgen:
      "Kieruj scenami i graj z kilkoma postaciami. Limity zależą od planu i modelu.",
    novelai:
      "Dłuższe opowieści z wpisami w kronice świata i obrazami w stylu anime. Pełny zestaw funkcji wymaga abonamentu.",
    chai: "Odkrywaj boty społeczności przede wszystkim na telefonie. Obowiązują zasady aplikacji.",
    replika:
      "Stały towarzysz z głosem i awatarem. Funkcje zależą od abonamentu.",
    polybuzz:
      "Twórz i odkrywaj postacie w aplikacji mobilnej. Aplikacja ma opcjonalne zakupy i własne zasady.",
    fictionlab:
      "Interaktywne opowieści w scenariuszach społeczności. Główną formą są historie tekstowe.",
    zeta: "Twórz postacie i rozgrywaj scenariusze społeczności. Dostępność zależy od kraju.",
    characterTavern:
      "Odkrywaj i twórz karty postaci. Na początek wystarczy plan bezpłatny.",
    liteLlm:
      "Hostuj zgodne proxy z wirtualnymi kluczami, budżetami i limitami zapytań. Samodzielnie utrzymujesz usługę i zapewniasz dostęp do dostawców.",
    portkey:
      "Ustaw obejścia awarii, zabezpieczenia i monitoring. Logowanie i wdrożenie zależą od konfiguracji.",
    vercel:
      "Współpracuje z Vercel AI SDK bez narzutu na tokeny. Routing odbywa się w usłudze Vercel.",
    cloudflare:
      "Buforowanie na brzegu sieci, limity zapytań i routing. Sprawdź koszt wspólnego rozliczenia i ustawienia logowania.",
    requesty:
      "Bramka w chmurze z routingiem według opóźnień i opcją routingu w UE. Dostępność zależy od modelu i konfiguracji.",
    helicone:
      "Bramka AI ze śledzeniem zapytań i podglądem kosztów. Przed wysłaniem poufnych danych sprawdź logi.",
    eden: "Jedno API do modeli językowych, OCR i tłumaczenia. Funkcje zależą od wybranego dostawcy.",
    together:
      "Inferencja bez zarządzania serwerem i dedykowane punkty dostępu do otwartych modeli. Sprawdź, czy dostępny jest potrzebny model.",
    bifrost:
      "Hostuj bramkę w Go z przełączaniem awaryjnym i cache’em semantycznym. Sam konfigurujesz instalację i dostęp do dostawców.",
    truefoundry:
      "Centralne reguły dostępu i monitoring dla zespołów. Sprawdź warunki wdrożenia i umowy dla organizacji.",
    llmGateway:
      "Zgodność z OpenAI i Anthropic oraz opcja własnego hostingu. Rozliczenia i przechowywanie danych zależą od wdrożenia.",
    deepInfra:
      "Inferencja otwartych modeli i prywatne wdrożenia GPU. Wybierz model z katalogu albo skonfiguruj infrastrukturę.",
    bedrock:
      "Zarządzany katalog modeli z kontrolą dostępu AWS. Modele i funkcje zależą od regionu.",
    kong: "Dodaje routing modeli i reguły do bramki API. Sprawdź wtyczki dostępne w swojej wersji.",
    huggingFace:
      "Wywołuj modele z Hubu przez różnych dostawców inferencji. Dostępność modeli i sprzętu zależy od dostawcy.",
    apiko:
      "Jeden zgodny punkt dostępu do tekstu, obrazów, wideo i dźwięku. Sprawdź cenę i dostępność modelu.",
    zerouter:
      "Jeden klucz do klientów programistycznych, w tym Claude Code i Codex. Przed migracją sprawdź ceny i routing.",
    shannon:
      "Oferuje własny model Shannon i zmodyfikowane modele o otwartych wagach. Opłaty za API zależą od zużycia.",
    nokeep:
      "Czat i multimedia bez rejestracji. Historia zostaje w przeglądarce, a polecenia przetwarzają modele w chmurze.",
    icelake:
      "Dzienny limit czatu oraz narzędzia do obrazów i wideo. Zgodne z OpenAI API wymaga odpowiedniego płatnego planu.",
    uncensoredChat:
      "Czat w przeglądarce z 2000 tokenów na start. Multimedia i API zależą od planu.",
    aiDungeon:
      "Interaktywne przygody z kartami historii. Abonamenty zwiększają kontekst i liczbę wspomnień.",
    talkie:
      "Odkrywaj i twórz postacie w katalogu społeczności. Sprawdź zasady dotyczące treści.",
    perchance:
      "Bezpłatny czat z postaciami w przeglądarce bez rejestracji. Proste narzędzie do pojedynczych sesji.",
    candy:
      "Romantyczni towarzysze z głosem i obrazami. Aplikacja skupia się na rozmowie z partnerem AI.",
    ngrok:
      "Przekazuje zapytania do różnych dostawców z awaryjnym przełączaniem kluczy. Sprawdź routing i logowanie w konfiguracji.",
    sandbase:
      "Łączy wywołania modeli, dane z sieci i izolowane środowiska kodu w jednym API. Bezpłatne zapytania mają dzienny limit.",
    openUncensored:
      "Klucz prepaid zamiast konta: 58 abliterowanych i nieocenzurowanych modeli tekstowych plus modele obrazu i wideo, ułożone według zmierzonych odmów. Płacisz cenę tokenów dostawcy, który obsłużył zapytanie, doładowanie od 5 $.",
    risuAi:
      "Klient czatu z postaciami open source z lorebookami, czatami grupowymi, obrazami emocji i TTS. API modelu podłączasz i opłacasz sam.",
    agnai:
      "Klient do roleplayu w chmurze lub na własnym serwerze, z czatami grupowymi dla wielu osób i lorebookami. Ceny planów hostowanych nie są publiczne.",
    koboldCpp:
      "Jednoplikowe narzędzie do lokalnych modeli GGUF z wbudowanym czatem i API zgodnym z OpenAI. Bez własnego GPU czekasz w kolejce w wolontariackim AI Horde.",
    talemate:
      "Wieloagentowy silnik do roleplayu z narratorem, reżyserem i śledzeniem stanu świata. Narzędzie do samodzielnej instalacji dla zaawansowanych.",
    featherless:
      "Stały miesięczny dostęp do tysięcy otwartych modeli, w tym nieocenzurowanych finetune'ów, przez jeden klucz API. Plan Chat ogranicza kontekst i równoległe zapytania.",
    arliAi:
      "Plany bez limitu tokenów na modele otwarte i bez ograniczeń plus obrazy. Tańsze plany pozwalają na jedno zapytanie naraz.",
    infermatic:
      "Plany miesięczne na niewielki zestaw nieocenzurowanych modeli tekstowych, z deklaracją braku logów. Darmowy plan ma jeden model i nie ma API.",
    chutes:
      "Zdecentralizowana inferencja z płatnością za token: tekst, obrazy, wideo i audio. Bez darmowego planu.",
    kagi: "Asystent z wieloma modelami w pakiecie z wyszukiwarką Kagi. Wątki domyślnie znikają po 24 godzinach, a flagowe modele wymagają najwyższego planu.",
    huggingChat:
      "Czat z modelami otwartymi przez automatyczny router. Kod czatu jest otwarty, a inferencja rozlicza się w kredytach Hugging Face.",
    zai: "Własny czat Zhipu do modeli GLM, z osobnym API. Polityka prywatności wymienia treść wiadomości jako dane do trenowania modeli.",
    ourDream:
      "Kreator towarzyszy dla dorosłych z czatem, obrazami i wideo. Media działają na monetach, które kupisz tylko z aktywnym planem.",
  },
  articles: {
    "nofiltergpt-alternatives": {
      question:
        "Które alternatywy dla NoFilterGPT podają nazwę modelu lub działają offline?",
      answer:
        "Unrestricted.chat wskazuje model Dolphin-Mistral, ale uruchamia go na swoich serwerach. LM Studio, Ollama i Jan obsługują pobrane modele na twoim urządzeniu. W {{appName}} wybierasz model, a historia incognito zostaje w przeglądarce. Model w chmurze nadal otrzymuje polecenie.",
    },
    "freedomgpt-alternatives": {
      question: "Co zastąpi aplikację FreedomGPT działającą offline?",
      answer:
        "LM Studio i Jan to aplikacje komputerowe do pobranych modeli. Ollama udostępnia lokalne API i działa z interfejsem Open WebUI. Do pracy z dokumentami sprawdzi się AnythingLLM z lokalnym modelem i lokalnymi osadzeniami.",
    },
    "gab-ai-alternatives": {
      question: "Co zastąpi Aryę w pytaniach o politykę?",
      answer:
        "Aby zestawić perspektywy, zadaj pytanie różnym modelom w jednym wątku {{appName}}. Do wyszukiwania źródeł wypróbuj Perplexity albo wyszukiwarkę Groka. Sprawdź oryginalne materiały. Każdy model może odzwierciedlać określony punkt widzenia lub pomylić fakty.",
    },
    "openrouter-alternatives": {
      question:
        "Który zamiennik OpenRouter nadaje się do aplikacji produkcyjnej?",
      answer:
        "Vercel daje dostęp w chmurze bez narzutu na tokeny. LiteLLM lub Bifrost uruchomisz samodzielnie z własnymi kontami dostawców. Do monitoringu lub ustawiania reguł porównaj Portkey, Cloudflare i Helicone. Sprawdź przełączanie awaryjne, retencję danych i opłaty.",
    },
    "venice-ai-alternatives": {
      question:
        "Jakie opcje prywatności wykraczają poza historię zapisaną w przeglądarce?",
      answer:
        "Maple, Confer i Morse opisują weryfikowalne przetwarzanie w izolacji sprzętowej. Lumo szyfruje zapisaną historię, a Duck.ai korzysta z serwera pośredniczącego. LM Studio i Ollama uruchamiają pobrane modele na twoim urządzeniu. Sprawdź, gdzie odszyfrowywane jest polecenie i czy potrzebujesz multimediów lub API.",
    },
    "character-ai-alternatives": {
      question:
        "Które aplikacje nadają się do odkrywania postaci, dłuższych historii lub stałej relacji?",
      answer:
        "Janitor AI, SpicyChat i Chub mają biblioteki postaci. DreamGen i NovelAI dają większą kontrolę nad scenami lub dłuższą opowieścią. Kindroid i Nomi skupiają się na stałym towarzyszu. W SillyTavern samodzielnie skonfigurujesz backend i karty postaci.",
    },
    "chatgpt-alternative-without-filters": {
      question: "Które alternatywy dla ChatGPT dają większy wybór modeli?",
      answer:
        "W {{appName}} i Venice wybierasz modele z różnym podejściem do odmów. NanoGPT pozwala płacić według zużycia. LM Studio i Ollama obsługują pobrane modele na twoim urządzeniu. Claude i Gemini nadają się do pisania lub pracy ze źródłami i stosują własne zasady.",
    },
    "chatgpt-jailbreak-alternative": {
      question: "Co porównać przed zmianą modelu?",
      answer:
        "Sprawdź, czy usługa podaje nazwę modelu, jak działa bezpłatny limit i gdzie przetwarza polecenia. Wypróbuj typowe zadania pisarskie lub sceny w {{appName}}, Venice albo aplikacji lokalnej. Odpowiedzi i odmowy zależą od modelu i usługi.",
    },
    "grok-alternative": {
      question:
        "Które alternatywy zastąpią wyszukiwarkę i funkcje kreatywne Groka?",
      answer:
        "Perplexity udziela odpowiedzi ze źródłami z sieci. Gemini oferuje Deep Research i wideo w odpowiednich planach. Venice i {{appName}} łączą wybór modeli z generowaniem multimediów. Zostań przy Groku, jeśli kluczowe jest przeszukiwanie wpisów z X w tym samym czacie.",
    },
    "chub-ai-alternatives": {
      question: "Czy mogę trzymać swoje karty postaci z Chub gdzie indziej?",
      answer:
        "Tak. Karty z Chub pobierzesz jako PNG lub JSON w formacie kart V2, a SillyTavern, RisuAI i Agnaistic importują je bezpośrednio. {{appName}} zamienia postać w skill, z którym rozmawiasz na dowolnym modelu. Lorebooki przeniesiesz do SillyTavern i RisuAI.",
    },
    "crushon-ai-alternatives": {
      question:
        "Która alternatywa dla CrushOn ma najbardziej przewidywalny koszt?",
      answer:
        "Stałe plany: Kindroid, Nomi i SpicyChat biorą jedną miesięczną cenę. Płatność za użycie: {{appName}} i NanoGPT liczą za wiadomość, więc spokojniejszy miesiąc kosztuje mniej. Model na własnym komputerze z SillyTavern i KoboldCpp nic nie kosztuje poza sprzętem.",
    },
    "sillytavern-alternatives": {
      question: "Czy jest alternatywa dla SillyTavern bez instalacji?",
      answer:
        "Tak. Janitor AI, Chub i Character Tavern działają w przeglądarce z gotowymi postaciami. RisuAI ma też wersję webową. {{appName}} działa w każdej przeglądarce, także na iPhonie, z już podłączonymi modelami, więc nie konfigurujesz żadnego klucza API.",
    },
    "nanogpt-alternatives": {
      question:
        "Która alternatywa dla NanoGPT pasuje do modeli otwartych w stałej cenie?",
      answer:
        "Featherless, Arli AI i Infermatic sprzedają plany miesięczne na modele otwarte i nieocenzurowane, z limitami kontekstu lub równoległych zapytań. OpenRouter i Chutes liczą za token. {{appName}} liczy za wiadomość z jednego salda dla modeli nieocenzurowanych, otwartych i z głównego nurtu.",
    },
    "claude-alternatives": {
      question: "Która alternatywa dla Claude pisze najlepsze długie teksty?",
      answer:
        "GPT i Gemini są najbliżej przy tekstach o wyraźnej strukturze. Kimi i GLM to mocne modele otwarte z mniejszą liczbą odmów. Do fikcji, której Claude odmawia, użyj modelu bez cenzury, takiego jak GLM 5.3 Uncensored albo UncensoredLM na {{appName}}, a Claude zostaw w tym samym wątku do poprawek.",
    },
  },
};
