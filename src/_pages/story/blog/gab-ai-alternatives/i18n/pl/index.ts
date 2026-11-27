import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternatywy dla Gab AI: czaty AI bez cenzury w porównaniu (2026)",
    description:
      "Porównaj Gab AI i Aryę z {{appName}}, Grokiem, Perplexity, Venice i modelami lokalnymi. Wybierz narzędzie do polityki, prywatnego czatu lub twórczości.",
    category: "Porównanie",
    imageAlt: "Alternatywy dla Gab AI porównane obok siebie",
    keywords:
      "alternatywa dla Gab AI, alternatywy Gab AI, strony jak Gab AI, Gab AI Arya, Gab AI vs Venice, konserwatywny chatbot AI, AI bez cenzury, AI bez cenzury do polityki, AI bez politycznej stronniczości, wolność słowa AI, {{appName}}",
  },
  hero: {
    backToBlog: "Wróć do bloga",
    category: "Porównanie",
    readTime: "9 min czytania",
    title: "Alternatywy dla Gab AI do wyszukiwania źródeł, czatu i multimediów",
    subtitle:
      "{{count}} alternatyw i {{appName}}, porównanych na podstawie ich własnych regulaminów, cenników i polityk prywatności.",
  },
  intro: {
    lead: "Gab AI zbudował AI, które rozmawia o polityce, kulturze i wierze bez kazań w stylu Big Tech. To działa. Drobny druk: zero treści dla dorosłych, twoje czaty na jego serwerach i API tylko w płatnym planie.",
    p2: "Poniżej: co Gab AI naprawdę obiecuje, gdzie kończy się jego wolność i {{count}} alternatyw sprawdzonych na ich własnych stronach. Gab AI według stanu na {{gabDate}}, reszta na {{date}}. Mówimy też, gdzie są lepsi od nas.",
    relation:
      "Uczciwie: jesteśmy klientem Gab AI. {{gabAiExamples}} działa w {{appName}} przez własne API Gaba.",
  },
  gab: {
    title: "Co daje Gab AI",
    intro:
      "Według strony głównej, cennika, regulaminu, polityki prywatności i strony API, czytanych {{gabDate}}.",
    models:
      "Modele: {{gabModels}} modeli na jednym koncie, od GPT, Claude, Gemini, DeepSeek, Qwen, Kimi, GLM i innych. Arya to własny model Gaba do rozmów bez cenzury o polityce, kulturze i wierze.",
    filter:
      "Filtr: regulamin wymaga 18 lat i zakazuje treści obscenicznych, seksualnie dosadnych i pornograficznych, poza nagością w celach edukacyjnych lub medycznych. Automatyczne systemy mogą analizować twoje treści pod kątem bezpieczeństwa i zgodności.",
    price:
      "Cena: {{gabFree}} kredytów na start po potwierdzeniu e-maila. Plus kosztuje {{plusMonth}} miesięcznie albo {{plusYear}} rocznie z {{plusCredits}} kredytami na miesiąc. Plus Premium kosztuje {{premiumYear}} rocznie z {{premiumCredits}} na miesiąc. Pakiety kredytów od {{gabPackPrice}} za {{gabPackCredits}} kredytów, przechodzą na kolejne miesiące.",
    gated:
      "Tylko z Plus: Work, czyli tryb agenta, i rozmowa głosowa na żywo. W darmowym planie wideo i muzyka wymagają kupionych kredytów. API wymaga aktywnego planu Plus albo Plus Premium.",
    privacy:
      "Prywatność: Gab widzi twoje prompty i odpowiedzi i przechowuje historię rozmów. Ulepszanie własnych modeli to jeden z podanych celów. Polityka mówi wprost, żeby nie zakładać, że przejście przez Gaba usuwa dane identyfikujące. Dane zostają tak długo, jak to potrzebne do działania usługi.",
    apps: "Aplikacje: web, Mac, Windows, iPhone, iPad, Android i rozszerzenie przeglądarki.",
    why: "Dlaczego ludzie szukają dalej: piszą fikcję, której regulamin Gaba zakazuje, chcą czatów z dala od cudzego serwera, chcą API bez subskrypcji albo chcą sprawdzić odpowiedź Aryi z innym światopoglądem.",
    sourceHome: "Strona główna Gab AI",
    sourcePricing: "Cennik Gab AI",
    sourceTerms: "Regulamin Gab AI",
    sourcePrivacy: "Polityka prywatności Gab AI",
    sourceApi: "Strona API Gab AI",
  },
  split: {
    title: "Swoboda w polityce, surowo przy treściach dla dorosłych",
    intro: "Wolność Gab AI ma wyraźną granicę. Tu przebiega.",
    politics:
      "Polityka, kultura, wiara: Arya odpowiada bez mainstreamowego kluczenia. To jest produkt i on działa.",
    adult:
      "Fikcja dla dorosłych: zakazana regulaminem. Dark romance, sceny erotyczne, roleplay dla dorosłych nie dostają pomocy, a automatyczne systemy mogą analizować treści pod kątem zgodności.",
    us: "W {{appName}} działa jedno i drugie: kontrariańskie spojrzenie od UncensoredLM albo Aryi oraz fikcja dla dorosłych z modelami bez cenzury po jednorazowym potwierdzeniu 18 lat. Prawo nadal obowiązuje.",
    unbiasedLink: "AI, które broni obu stron: modele porównane w polityce",
    writerLink: "Pisarz AI bez cenzury: mroczna fikcja i sceny dla dorosłych",
    chanLink: "Skill 4chan: greentext i docinki, bez filtra",
  },
  criteria: {
    title: "Co porównać przed zmianą",
    intro: "Pięć pytań rozstrzyga sprawę.",
    worldview:
      "Światopogląd: jeden model z deklarowaną linią czy kilka, które możesz zestawić ze sobą?",
    filter:
      "Filtr: swoboda tylko w polityce czy też w fikcji i treściach dla dorosłych? Kto co analizuje?",
    privacy:
      "Prywatność: gdzie leżą twoje czaty i czy służą do ulepszania modeli.",
    price:
      "Cena: darmowe kredyty, subskrypcja czy płacenie za użycie. I co blokuje darmowy plan.",
    api: "API: czy wymaga subskrypcji i w jakich formatach mówi?",
  },
  table: {
    title: "Wszystkie obok siebie",
  },
  us: {
    title: "{{appName}}: kilka światopoglądów, jeden czat",
    intro:
      "{{modelCount}} modeli w jednym czacie i na jednym saldzie. Model wybierasz przy każdej wiadomości, więc stawiasz dwa punkty widzenia obok siebie.",
    models:
      "Modele: {{uncensored}} bez cenzury obok {{mainstream}} modeli głównego nurtu i {{open}} otwartych. {{ownModel}} jest trenowany na książkach i dokumentach zakazanych w mainstreamowym internecie, co daje model o przeciwnych poglądach politycznych.",
    arya: "Arya też tu jest ({{gabAiExamples}}). Zapytaj Aryę, a potem zadaj to samo pytanie UncensoredLM albo abliterowanej wersji GLM w tym samym wątku.",
    aryaOff:
      "Abliterowane wersje GLM, DeepSeek i Kimi obok Claude, GPT i Gemini. Zadaj to samo pytanie dwa razy i porównaj.",
    privacy:
      "Prywatność: czaty incognito zostają w lokalnej pamięci twojej przeglądarki, bez konta. Czaty prywatne zapisują się tylko na twoim koncie.",
    price:
      "Cena: {{guestCredits}} darmowych kredytów miesięcznie bez konta, {{freeCredits}} z kontem, {{maxCredits}} z newsletterem. Plany od {{subPrice}} miesięcznie. Modele bez cenzury odblokowujesz jednorazowym potwierdzeniem, że masz 18 lat.",
    api: "API: te same modele przez endpointy zgodne z OpenAI i Anthropic. Każdy plan od {{apiSubPrice}} miesięcznie je odblokowuje.",
    weak: "Gdzie jesteśmy słabsi: brak płaskiego planu, każda wiadomość kosztuje kredyty zależnie od modelu, a Gab ma {{gabModels}} modeli, my {{modelCount}}. Pakiety Gaba działają bez planu; nasze doładowują aktywny plan i nigdy nie wygasają.",
    hubLink: "Czat AI bez cenzury: wszystkie modele z kontekstem i ceną",
    abliteratedLink: "Abliterowane modele prosto w przeglądarce",
    ownLink: "Zobacz {{ownModel}}",
    aryaLink: "Zobacz Gab AI Arya w {{appName}}",
  },
  list: {
    title: "{{count}} alternatyw po kolei",
    intro:
      "Z ich własnych stron, sprawdzone {{date}}. Czym jest każda, jakie ma modele, na co pozwala jej filtr, co dzieje się z twoimi czatami.",
    heading: "{{number}}. {{name}}: {{kind}}",
    models: "Modele:",
    filter: "Filtr:",
    privacy: "Prywatność:",
    price: "Cena:",
    priceValue: "Za darmo: {{free}}. Płatnie: {{plans}}.",
    pro: "Największy plus:",
    con: "Haczyk:",
    forWho: "Wybierz, jeśli:",
    versusLink: "{{appName}} vs {{name}}: pełne porównanie",
    visit: "Odwiedź {{name}}",
  },
  privacy: {
    title: "Prywatność: czytaj politykę, nie slogan",
    intro: "Co każda strona naprawdę zapisała.",
    gab: "Gab AI: prompty, odpowiedzi i historia rozmów leżą na jego serwerach, a ulepszanie modeli to podany cel. Zbiera adres IP i przybliżoną lokalizację.",
    us: "{{appName}} incognito: czaty żyją w lokalnej pamięci twojej przeglądarki, nie na naszych serwerach. Wyczyść dane przeglądarki i znikają.",
    local:
      "LM Studio: model działa na twoim komputerze, a prompt nigdy go nie opuszcza. Ceną jest twój własny sprzęt.",
    callout:
      "Każdy hostowany model widzi prompt, na który odpowiada. Historia na urządzeniu trzyma czaty z dala od serwera firmy, nie od modelu.",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "Jaka jest najlepsza alternatywa dla Gab AI?",
      a: "Zależy, czego ci brakuje. Bezpośredni model pod prąd mainstreamu: uncensored.ai. Historia na urządzeniu i filtr dla dorosłych, który Pro może wyłączyć: Venice. Modele bez cenzury plus obrazy i wideo w jednym planie: FreedomGPT. Płacenie za użycie: NanoGPT. Pełna prywatność: LM Studio. Arya, UncensoredLM i modele abliterowane obok siebie w jednym czacie: {{appName}}.",
    },
    free: {
      q: "Czy jest darmowa alternatywa dla Gab AI?",
      a: "Tak. FreedomGPT startuje za darmo bez konta, LM Studio jest darmowe na twoim sprzęcie. {{appName}} daje {{guestCredits}} darmowych kredytów miesięcznie bez konta i {{freeCredits}} z kontem, {{maxCredits}} z newsletterem, modele bez cenzury w cenie po jednorazowym potwierdzeniu 18 lat.",
    },
    arya: {
      q: "Czy mogę używać Aryi poza Gab AI?",
      a: "Tak. {{appName}} udostępnia {{gabAiExamples}} przez własne API Gaba, więc pytasz Aryę i sprawdzasz odpowiedź z {{ownModel}} albo modelem głównego nurtu w tym samym wątku.",
      aOff: "Arya to własny model Gaba. W {{appName}} masz {{ownModel}}, trenowany na książkach i dokumentach zakazanych w mainstreamowym internecie, plus modele abliterowane i z głównego nurtu w jednym czacie.",
    },
    adult: {
      q: "Czy Gab AI pozwala na treści dla dorosłych albo NSFW?",
      a: "Nie. Regulamin zakazuje treści obscenicznych, seksualnie dosadnych i pornograficznych, a automatyczne systemy mogą analizować treści pod kątem zgodności. NanoGPT nie ma ogólnego zakazu NSFW dla dorosłych, Venice pozwala abonentom Pro wyłączyć filtr dla dorosłych, a {{appName}} otwiera modele bez cenzury po jednorazowym potwierdzeniu 18 lat.",
    },
    private: {
      q: "Która alternatywa jest najbardziej prywatna?",
      a: "Lokalny program jak LM Studio: prompty nigdy nie opuszczają twojego urządzenia. Wśród opcji hostowanych Venice i tryb incognito {{appName}} trzymają historię w przeglądarce. Gab AI trzyma historię na swoich serwerach i podaje ulepszanie modeli jako cel.",
    },
    api: {
      q: "Która alternatywa ma API bez cenzury i bez subskrypcji?",
      a: "NanoGPT i OpenRouter liczą za użycie, bez subskrypcji. Venice i uncensored.ai sprzedają kredyty na API. API Gab AI wymaga aktywnego planu Plus. W {{appName}} każdy plan od {{apiSubPrice}} miesięcznie je odblokowuje.",
    },
    freedomLink: "Alternatywy dla FreedomGPT w porównaniu",
    kindsLink:
      "Abliterowany, dostrojony czy z własnym światopoglądem: trzy rodzaje",
  },
  cta: {
    title: "Wysłuchaj każdej strony. Potem zdecyduj.",
    subtitle:
      "{{guestCredits}} darmowych kredytów miesięcznie, bez konta. Zacznij incognito i zadaj to samo pytanie dwóm modelom.",
    start: "Zacznij czat incognito",
    models: "Zobacz modele bez cenzury",
  },
};
