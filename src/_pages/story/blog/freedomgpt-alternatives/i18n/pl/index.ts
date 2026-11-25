import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternatywy dla FreedomGPT: AI bez cenzury w porównaniu",
    description:
      "Zestaw FreedomGPT z {{appName}}, Venice i Poe w chmurze oraz z LM Studio, Ollama i Jan offline. Sprawdź ceny, filtry i prywatność.",
    category: "Porównanie",
    imageAlt: "Alternatywy dla FreedomGPT porównane obok siebie",
    keywords:
      "alternatywa dla FreedomGPT, alternatywy FreedomGPT, strony jak FreedomGPT, aplikacje jak FreedomGPT, FreedomGPT vs Venice, FreedomGPT Liberty, FreedomGPT na komputer alternatywa, AI bez cenzury, czat AI bez cenzury, nieocenzurowana AI, {{appName}}",
  },
  hero: {
    backToBlog: "Wróć do bloga",
    category: "Porównanie",
    readTime: "9 min czytania",
    title: "Alternatywy dla FreedomGPT w chmurze i offline",
    subtitle:
      "{{count}} alternatyw i {{appName}}, porównanych na podstawie ich własnych stron z cennikiem, prywatnością i zasadami filtrowania.",
  },
  intro: {
    lead: "FreedomGPT obiecuje jedną subskrypcję na setki modeli, także te bez cenzury. Dobry pomysł. Haczyki siedzą w jego własnym FAQ, w polityce prywatności i w aplikacji na komputer, której nikt nie aktualizuje od lat.",
    p2: "Poniżej: co FreedomGPT naprawdę obiecuje, ile warte są jego kredyty i {{count}} alternatyw sprawdzonych na ich własnych stronach. FreedomGPT według stanu na {{fgDate}}, reszta na {{date}}. Mówimy też, gdzie są lepsi od nas.",
    relation:
      "Uczciwie: jesteśmy klientem FreedomGPT. {{freedomGptExamples}} działa w {{appName}} przez API samego FreedomGPT.",
  },
  fg: {
    title: "Co daje FreedomGPT",
    intro:
      "Według strony głównej, cennika, polityki prywatności, dokumentacji API i GitHuba, czytanych {{fgDate}}.",
    models:
      "Modele: strona główna mówi o ponad 400 modelach w jednej subskrypcji i wymienia ChatGPT, Claude, Gemini, Grok, Kimi, GLM, DeepSeek, Qwen, Llama, Mistral i inne, obok opcji bez cenzury do pisania, roleplayu i researchu.",
    filter:
      "Filtr: jego własne FAQ mówi, że etykieta bez cenzury nie gwarantuje odpowiedzi na każde pytanie, a zasady modelu i usługi nadal obowiązują.",
    price:
      "Cena: darmowy test bez karty i bez konta. Pro kosztuje {{proPrice}} miesięcznie za {{proCredits}} kredytów. Jego własne szacunki: około {{replyCost}} kredytów za odpowiedź premium, {{imageCost}} za obraz, {{videoCost}} za pięciosekundowe wideo.",
    bonus:
      "Bonus za rejestrację: 100 kredytów, ale tylko dla nowych kont Google, Apple lub X, które się kwalifikują. Rejestracja przez e-mail i hasło nie dostaje nic.",
    privacy:
      "Prywatność: strona główna sama radzi, żeby nie zakładać anonimowości ani zerowego przechowywania. Polityka prywatności mówi, że wiadomości, nagrania głosowe i obrazy trafiają do zewnętrznych dostawców AI, i nie podaje okresu przechowywania.",
    apps: "Aplikacje i API: web, iPhone, iPad i Android. Klucz API bierzesz z panelu, dokumentacja nie podaje cen. Ostatni commit otwartej aplikacji na komputer jest z {{desktopDate}}.",
    why: "Dlaczego ludzie szukają dalej: chcą wiedzieć, co naprawdę daje miesiąc, chcą aplikacji offline, która jest jeszcze rozwijana, albo polityki, która trzyma czaty z dala od cudzego serwera.",
    sourceHome: "Strona główna FreedomGPT",
    sourcePricing: "Cennik FreedomGPT",
    sourcePrivacy: "Polityka prywatności FreedomGPT",
    sourceApi: "Dokumentacja API FreedomGPT",
    sourceRepo: "Repozytorium aplikacji FreedomGPT",
  },
  credits: {
    title: "Co daje {{proPrice}} miesięcznie w FreedomGPT",
    intro:
      "{{proCredits}} kredytów podzielone przez własne szacunki FreedomGPT. Jedno z tych albo mieszanka.",
    replies: "Około {{replies}} odpowiedzi premium, po {{replyCost}} kredytów.",
    images: "Albo około {{images}} obrazów, po {{imageCost}} kredytów.",
    videos:
      "Albo {{videos}} pięciosekundowych filmów, po {{videoCost}} kredytów.",
    us: "W {{appName}} każda strona modelu pokazuje jego aktualną cenę za wiadomość, zanim wyślesz. Plany zaczynają się od {{subPrice}} miesięcznie za {{subCredits}} kredytów. Tanie modele rozciągają plan daleko, czołowe mniej. Widzisz, który jest który.",
  },
  criteria: {
    title: "Co porównać przed zmianą",
    intro: "Pięć pytań rozstrzyga sprawę.",
    models:
      "Modele: ile bez cenzury, jakiego rodzaju (abliterowane czy naprawdę niecenzurowane) i czy Claude, GPT i Gemini są w tym samym miejscu?",
    filter:
      "Filtr: czego regulamin naprawdę zakazuje i czy etykieta bez cenzury oznacza, że model odpowiada.",
    privacy:
      "Prywatność: gdzie leżą twoje czaty, kto jeszcze je dostaje i jak długo ktoś je trzyma.",
    price:
      "Cena: ile odpowiedzi, obrazów i wideo daje miesiąc. Nie tylko cena z cennika.",
    offline:
      "Offline: czy jest rozwijana wersja lokalna, czy tylko aplikacja w chmurze?",
  },
  table: {
    title: "Wszystkie obok siebie",
  },
  us: {
    title: "{{appName}}: modele bez cenzury z nazwą i ceną",
    intro:
      "{{modelCount}} modeli w jednym czacie i na jednym saldzie. Model wybierasz przy każdej wiadomości, a każdy ma własną stronę.",
    models:
      "Modele: {{uncensored}} bez cenzury obok {{mainstream}} modeli głównego nurtu i {{open}} otwartych. {{ownModel}} jest trenowany na książkach i dokumentach zakazanych w mainstreamowym internecie, co daje model o przeciwnych poglądach politycznych.",
    liberty:
      "Liberty od FreedomGPT też tu jest ({{freedomGptExamples}}), obok abliterowanych wersji GLM, DeepSeek i Kimi. Porównaj jego odpowiedź z innym modelem w tym samym wątku.",
    libertyOff:
      "Abliterowane wersje GLM, DeepSeek i Kimi obok Claude, GPT i Gemini. Porównuj odpowiedzi w tym samym wątku.",
    privacy:
      "Prywatność: czaty incognito zostają w lokalnej pamięci twojej przeglądarki, bez konta. Czaty prywatne zapisują się tylko na twoim koncie.",
    price:
      "Cena: {{guestCredits}} darmowych kredytów miesięcznie bez konta, {{freeCredits}} z kontem. Plany od {{subPrice}} miesięcznie. Modele bez cenzury odblokowujesz jednorazowym potwierdzeniem, że masz 18 lat.",
    open: "Open source: cała platforma jest na GitHubie i aktywnie rozwijana. Chcesz własną instancję, hostujesz ją sam.",
    weak: "Gdzie jesteśmy słabsi: brak płaskiego planu na wszystko, a wideo kosztuje u nas też sporo kredytów. Darmowy start FreedomGPT bez konta jest tak samo prosty jak nasz.",
    hubLink: "Czat AI bez cenzury: wszystkie modele z kontekstem i ceną",
    abliteratedLink: "Abliterowane modele prosto w przeglądarce",
    libertyLink: "Zobacz FreedomGPT Liberty w {{appName}}",
    ownLink: "Zobacz {{ownModel}}",
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
    fg: "FreedomGPT: wiadomości, nagrania głosowe i obrazy trafiają do zewnętrznych dostawców AI. Bez okresu przechowywania. Jego własna strona główna radzi nie liczyć na anonimowość.",
    us: "{{appName}} incognito: czaty żyją w lokalnej pamięci twojej przeglądarki, nie na naszych serwerach. Wyczyść dane przeglądarki i znikają.",
    local:
      "LM Studio i Ollama: model działa na twoim komputerze, a prompt nigdy go nie opuszcza. Ceną jest twój własny sprzęt.",
    callout:
      "Każdy hostowany model widzi prompt, na który odpowiada. Historia na urządzeniu trzyma czaty z dala od serwera firmy, nie od modelu.",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "Jaka jest najlepsza alternatywa dla FreedomGPT?",
      a: "Zależy, czego ci brakuje. Historia na urządzeniu i duży katalog: Venice. Płacenie za użycie bez subskrypcji: NanoGPT. Jeden bezpośredni model z własnym światopoglądem: uncensored.ai. Całkowicie offline: LM Studio albo Ollama. Modele bez cenzury, otwarte i z głównego nurtu z publiczną ceną za wiadomość, w jednym czacie: {{appName}}.",
    },
    free: {
      q: "Czy jest darmowa alternatywa dla FreedomGPT?",
      a: "Tak. Ollama jest darmowa i otwarta na twoim sprzęcie, LM Studio też działa lokalnie za darmo. {{appName}} daje {{guestCredits}} darmowych kredytów miesięcznie bez konta i {{freeCredits}} z kontem, modele bez cenzury w cenie po jednorazowym potwierdzeniu 18 lat.",
    },
    liberty: {
      q: "Czy mogę używać FreedomGPT Liberty gdzie indziej?",
      a: "Tak. {{appName}} udostępnia {{freedomGptExamples}} przez API FreedomGPT, więc używasz Liberty obok {{uncensored}} innych modeli bez cenzury i sprawdzasz jego odpowiedzi.",
      aOff: "Liberty to własny model FreedomGPT. W {{appName}} dostajesz {{uncensored}} innych modeli bez cenzury, abliterowanych i naprawdę niecenzurowanych, w jednym czacie.",
    },
    desktop: {
      q: "Czy aplikacja FreedomGPT na komputer jest jeszcze rozwijana?",
      a: "Jej otwarte repozytorium na GitHubie pokazuje ostatni commit z {{desktopDate}}. Do pracy offline dziś lepiej sięgnąć po Ollamę albo LM Studio, obie są rozwijane.",
    },
    private: {
      q: "Która alternatywa jest najbardziej prywatna?",
      a: "Lokalny program: Ollama albo LM Studio trzymają każdy prompt na twoim urządzeniu. Wśród opcji hostowanych Venice i tryb incognito {{appName}} trzymają historię w przeglądarce. Polityka FreedomGPT przekazuje wiadomości zewnętrznym dostawcom AI.",
    },
    api: {
      q: "Która alternatywa ma API bez cenzury?",
      a: "Venice, NanoGPT, uncensored.ai, Gab AI i {{appName}} mają API zgodne z OpenAI. FreedomGPT też ma, bez cen w dokumentacji. W {{appName}} każdy plan od {{apiSubPrice}} miesięcznie odblokowuje API.",
    },
    gabLink: "Alternatywy dla Gab AI w porównaniu",
    nofilterLink: "Alternatywy dla NoFilterGPT w porównaniu",
    noGpuLink: "Modele bez cenzury bez własnej karty graficznej",
  },
  cta: {
    title: "Wiedz, za co płacisz. Potem pytaj o wszystko.",
    subtitle:
      "{{guestCredits}} darmowych kredytów miesięcznie, bez konta. Zacznij incognito i wypróbuj dowolny model.",
    start: "Zacznij czat incognito",
    models: "Zobacz modele bez cenzury",
  },
};
