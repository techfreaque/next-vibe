import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternatywa dla ChatGPT bez filtrów | {{appName}}",
    description:
      "Alternatywa dla ChatGPT bez narzuconych filtrów: dostęp do {{modelCount}} modeli, od mainstreamu po niecenzurowane. Poziom filtra wybierasz ty. Za darmo, bez konta.",
    category: "Poradnik",
    imageAlt: "{{appName}}: alternatywa dla ChatGPT bez filtrów",
    keywords:
      "alternatywa dla ChatGPT, alternatywa dla ChatGPT bez filtrów, niecenzurowany ChatGPT, ChatGPT bez ograniczeń, ChatGPT bez cenzury, czat AI bez filtrów, niecenzurowana AI, {{appName}}, Claude, GPT, Gemini, DeepSeek, Venice",
  },
  hero: {
    backToBlog: "Wróć do bloga",
    category: "Poradnik",
    readTime: "7 min czytania",
    title: "Alternatywa dla ChatGPT bez filtrów. Poziom ustawiasz ty.",
    subtitle:
      "Claude, GPT i Gemini obok modeli otwartych i niecenzurowanych, w jednym czacie na {{appName}}. Uczciwie: co się zmienia, co zostaje i ile to kosztuje.",
  },
  intro: {
    lead: "Zadajesz zwykłe pytanie. ChatGPT odpowiada zastrzeżeniem, pouczeniem albo uprzejmą odmową. Szczegół medyczny, scena do kryminału, pytanie o bezpieczeństwo, poglądy spoza głównego nurtu. Odmowa to decyzja regulaminu, podjęta za ciebie, zanim padło choć jedno słowo.",
    p2: "Tak naprawdę wygląda alternatywa bez filtrów na {{appName}}: dostęp do {{modelCount}} modeli, trzy poziomy filtrowania, jedno saldo. Co robi dobrze, gdzie ma słabsze strony i kiedy ChatGPT nadal jest lepszym wyborem.",
  },
  exists: {
    title: "Czy istnieje ChatGPT bez filtrów?",
    p1: "Nie od OpenAI. Modele GPT podlegają zasadom OpenAI, gdziekolwiek działają. Claude i Gemini podlegają zasadom swoich twórców. Kto obiecuje GPT bez filtrów, obiecuje za dużo.",
    p2: "Prawdziwa alternatywa stawia obok nich inne modele. {{appName}} daje ci modele mainstreamowe, a w tym samym czacie także modele otwarte z lekkimi filtrami i niecenzurowane bez żadnych. To ty decydujesz, który odpowie.",
  },
  tiers: {
    title: "Co właściwie znaczy „bez filtrów”?",
    intro: "Każdy model ma poziom treści. Są trzy.",
    mainstream:
      "Mainstream (liczba modeli: {{count}}): Claude, GPT, Gemini, Mistral. Filtry bezpieczeństwa wielkich laboratoriów. Drażliwe tematy odrzucają.",
    open: "Otwarte (liczba modeli: {{count}}): DeepSeek, Kimi, GLM, Qwen, Grok, MiniMax i inne. Lekkie filtry. Podejmują większość kontrowersyjnych tematów.",
    uncensored:
      "Niecenzurowane (liczba modeli: {{count}}): Venice oraz niecenzurowane wersje GLM, Qwen, Gemma i DeepSeek. Zero filtra. Granice wyznaczasz ty.",
    vendorRefusals:
      "Modele mainstreamowe zachowują filtry swoich twórców także tutaj. GPT na {{appName}} odmawia tego samego, czego odmawia wszędzie. Różnica polega na tym, co masz obok.",
    modelsLink: "Zobacz wszystkie modele według poziomu filtra",
  },
  switch: {
    title: "Czy mogę zmienić model w trakcie rozmowy?",
    intro:
      "Tak. Model wybierasz przy każdej wiadomości, nie raz na całe konto.",
    p1: "Zaczynasz wątek z Claude i trafiasz na odmowę. Wybierasz model niecenzurowany i wysyłasz kolejną wiadomość. Wątek zachowuje historię, a nowy model czyta ją w całości.",
    p2: "Działa to też w drugą stronę. Szkic piszesz modelem niecenzurowanym, a strukturę i szlif oddajesz modelowi z czołówki.",
    caveat:
      "Filtr siedzi w modelu, nie w wątku. Model mainstreamowy, który czyta niecenzurowany szkic, nadal może odmówić jego kontynuacji.",
  },
  picks: {
    title: "Jakiego modelu używać zamiast ChatGPT?",
    intro:
      "Zacznij od zadania. Każda nazwa prowadzi do strony modelu z ceną i parametrami.",
    everyday: {
      title: "Codzienna praca, filtry mainstreamowe",
      body: "Teksty, research, kod, analiza. Najbliżej ChatGPT, z tym samym rodzajem filtrów.",
    },
    open: {
      title: "Mocne, z mniejszą liczbą odmów",
      body: "Mocne modele otwarte z lekkimi filtrami. Odpowiadają na większość tego, czego modele mainstreamowe unikają, i dobrze radzą sobie z kodem i rozumowaniem.",
    },
    unfiltered: {
      title: "Bez filtra, z prawdziwym rozumowaniem",
      body: "Najcięższa artyleria wśród modeli niecenzurowanych. Kod, analiza i długie teksty na tematy, które inne modele blokują.",
    },
    fiction: {
      title: "Fikcja i roleplay",
      body: "Mroczne sceny, treści dla dorosłych, postacie, które trzymają swój głos. Gawędziarze, nie analitycy.",
    },
    cheap: {
      title: "Tanio i szybko",
      body: "Duża skala za małe pieniądze. Trzy modele flash bez filtrów, a do tego Claude Haiku, gdy filtr ci nie przeszkadza.",
    },
    compare:
      "Wahasz się między dwoma? Porównaj cenę, okno kontekstu i możliwości obok siebie.",
    compareLink: "Porównaj {{a}} z {{b}}",
    guideLink: "Przeczytaj przewodnik po wszystkich modelach niecenzurowanych",
  },
  privacy: {
    title: "Czy czat AI bez filtrów jest prywatny?",
    intro: "Zależy od folderu. Oto dokładnie, co się dzieje.",
    incognito:
      "Czaty incognito są zapisane w pamięci lokalnej twojej przeglądarki. Rozmowa nie trafia do zapisu na naszych serwerach. Wyczyścisz dane przeglądarki i jej nie ma.",
    transit:
      "Każda wiadomość nadal przechodzi przez nasz serwer do dostawcy modelu, który pisze odpowiedź. Tak działa każda AI w chmurze. Zużycie kredytów jest rejestrowane na potrzeby rozliczeń.",
    memory:
      "W trybie incognito pamięć jest wyłączona. Trwała pamięć wymaga darmowego konta i folderu prywatnego.",
    private:
      "Czaty prywatne są zapisane na serwerze i widoczne tylko dla twojego konta. Otworzysz je na każdym urządzeniu, na którym się zalogujesz.",
    callout:
      "W skrócie: incognito trzyma twoją historię z dala od naszych serwerów. Nie ukrywa jednak wiadomości przed modelem, który na nie odpowiada.",
  },
  pricing: {
    title: "Ile to kosztuje?",
    intro: "Kredyty. Jedno saldo dla wszystkich modeli.",
    free: "Za darmo: {{guestCredits}} kredytów miesięcznie bez konta, {{freeCredits}} po rejestracji. Wystarczy, żeby sprawdzić kilka modeli na własnych promptach.",
    sub: "Subskrypcja: {{subCredits}} kredytów miesięcznie za {{subPrice}}.",
    pack: "Pakiety kredytów: {{packCredits}} kredytów za {{packPrice}}. Nigdy nie wygasają. Karta albo krypto.",
    oneBalance:
      "To samo saldo pokrywa generowanie obrazów, wideo i muzyki, mowę na wejściu i wyjściu oraz wyszukiwanie w sieci.",
    metered:
      "Każda wiadomość kosztuje kredyty zależnie od modelu. Modele flash kosztują ułamek ceny modelu z czołówki. Cenę znajdziesz na stronie każdego modelu.",
    link: "Zobacz plany i pakiety kredytów",
  },
  chatgptBetter: {
    title: "Kiedy ChatGPT jest lepszym wyborem?",
    intro: "Czasem. Konkretnie wtedy.",
    oneVendor:
      "Korzystasz tylko z modeli OpenAI i nigdy nie trafiasz na odmowę. Wtedy jeden dostawca, jedna aplikacja i jedna subskrypcja to prostsze rozwiązanie.",
    flatRate:
      "Chcesz stałej opłaty i nie chcesz myśleć o koszcie wiadomości. Kredyty liczą się od zużycia, a intensywne codzienne korzystanie z modeli z czołówki się sumuje.",
    firstFeatures:
      "Chcesz najnowszych funkcji aplikacji danego laboratorium w dniu premiery. Laboratoria często wypuszczają nowości najpierw we własnych aplikacjach.",
    wantFilter:
      "Chcesz filtra. Konto dziecka albo miejsce pracy z surowymi zasadami potrzebuje barier. Tutaj możesz zostać przy poziomie mainstream, ale zamknięty produkt może pasować lepiej.",
  },
  limits: {
    title: "Jakie są minusy?",
    intro: "Brak filtrów ma swoją cenę. Poznaj ją, zanim się przesiądziesz.",
    smaller:
      "Większość modeli niecenzurowanych jest mniejsza od modeli z czołówki. Kilka powstało do rozmowy i fikcji, nie do ciężkiej analizy. Przy najtrudniejszym rozumowaniu i długich zadaniach programistycznych najlepsze modele mainstreamowe wciąż wygrywają.",
    tools:
      "Nie każdy model niecenzurowany obsługuje wywołania narzędzi. Sprawdź stronę modelu, zanim oprzesz się na wyszukiwaniu w sieci albo innych narzędziach.",
    vendor:
      "Modele mainstreamowe zachowują własne odmowy. Jeśli Claude mówi nie, zmień model zamiast się z nim kłócić.",
    responsibility:
      "Brak filtra to brak siatki bezpieczeństwa. Za to, co generujesz i publikujesz, odpowiadasz ty, a prawo twojego kraju nadal obowiązuje.",
  },
  faq: {
    title: "Najczęstsze pytania",
    free: {
      q: "Czy {{appName}} jest darmowe?",
      a: "Bez konta dostajesz {{guestCredits}} darmowych kredytów miesięcznie, z kontem {{freeCredits}}. Potem: subskrypcja za {{subPrice}} miesięcznie albo pakiet kredytów.",
    },
    account: {
      q: "Czy potrzebuję konta?",
      a: "Nie. Czat incognito działa bez konta. Konto przyda się do pamięci i do czatów zapisywanych na serwerze.",
    },
    api: {
      q: "Czy mogę używać tych modeli we własnych narzędziach?",
      a: "Tak. Każdy płatny plan obejmuje API zgodne z OpenAI. Jeden klucz, każdy model, także niecenzurowane.",
    },
    openSource: {
      q: "Czy {{appName}} jest open source?",
      a: "Tak. Kod jest otwarty na licencjach MIT i GPL v3, a własną instancję możesz postawić u siebie.",
    },
    apiLink: "Podłącz API do swoich narzędzi programistycznych",
    selfHostLink: "Uruchom własną instancję",
  },
  partners: {
    body: "Prowadzisz kanał, newsletter albo społeczność o AI? Program partnerski {{appName}} wypłaca ci stały udział w każdej płatności, którą polecisz.",
    link: "Poznaj program partnerski",
  },
  cta: {
    title: "Wybierz filtr. Zadaj pytanie.",
    subtitle:
      "{{guestCredits}} darmowych kredytów miesięcznie, bez konta. Mainstream, otwarte albo niecenzurowane: zmieniasz, kiedy chcesz.",
    chat: "Zacznij czat bez filtrów",
    models: "Porównaj wszystkie modele",
  },
};
