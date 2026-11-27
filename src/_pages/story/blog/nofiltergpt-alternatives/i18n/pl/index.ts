import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternatywy dla NoFilterGPT: czaty AI bez cenzury (2026)",
    description:
      "Porównaj NoFilterGPT z Venice, Unrestricted.chat, {{appName}} i lokalnym Ollama. Sprawdź modele, bezpłatne limity, prywatność i dostęp do API.",
    category: "Porównanie",
    imageAlt: "Alternatywy dla NoFilterGPT porównane obok siebie",
    keywords:
      "alternatywa dla NoFilterGPT, alternatywy NoFilterGPT, strony jak NoFilterGPT, NoFilterGPT vs Venice, czat AI bez cenzury, AI bez filtrów, ChatGPT bez filtrów, AI bez cenzury, {{appName}}",
  },
  hero: {
    backToBlog: "Wróć do bloga",
    category: "Porównanie",
    readTime: "8 min czytania",
    title: "Alternatywy dla NoFilterGPT z większym wyborem modeli",
    subtitle:
      "{{count}} alternatyw i {{appName}}, porównanych na podstawie ich własnych stron z cennikiem, prywatnością i zasadami filtrowania.",
  },
  intro: {
    lead: "NoFilterGPT sprzedaje jedno: chatbota, który nie prawi kazań. W porządku. Ale dostajesz jeden model, dzienny limit w darmowym planie i obietnicę prywatności, w którą musisz uwierzyć na słowo.",
    p2: "Oto alternatywy, sprawdzone na ich własnych stronach. Konkurencja według stanu na {{date}}, NoFilterGPT na {{nfDate}}. Uczciwie mówiąc: kupujemy modele od części z nich i udostępniamy je w naszym czacie, samo Venice to {{veniceModels}} modeli. Mówimy też, gdzie są lepsi.",
  },
  nfg: {
    title: "Co daje NoFilterGPT",
    intro:
      "Według jego strony głównej i polityki prywatności, czytanych {{nfDate}}.",
    model:
      "Model: jeden własny model, opisany jako oparty na architekturze GPT bez zwykłych ograniczeń. Bez nazwanego modelu bazowego, bez wyboru modelu.",
    price:
      "Cena: darmowy plan Basic z ograniczoną liczbą wiadomości dziennie. Professional kosztuje {{proPrice}} miesięcznie za prawie nielimitowane czaty, analizę obrazów, generowanie obrazów i dostęp do API.",
    media:
      "Media: generowanie i edycja obrazów, wideo z obrazu, mowa na wejściu i wyjściu.",
    privacy:
      "Prywatność: strona główna mówi, że rozmowy nie są przechowywane, a czaty są szyfrowane. Polityka prywatności dodaje, że adresy IP mogą być logowane ze względów bezpieczeństwa, dane o użyciu są logowane, a na stronie działa Cloudflare Analytics.",
    payments: "Płatności: karty przez Stripe, do tego ETH, BTC i USDC.",
    why: "Dlaczego ludzie szukają alternatywy: chcą sami wybrać model, porównać odpowiedzi albo sprawdzić obietnicę prywatności w polityce, która ją dokładnie opisuje.",
    sourceHome: "Strona główna NoFilterGPT",
    sourcePrivacy: "Polityka prywatności NoFilterGPT",
  },
  criteria: {
    title: "Co porównać przed zmianą",
    intro: "Decyduje pięć pytań.",
    models:
      "Modele: jeden własny model czy prawdziwy wybór? Abliterowane, naprawdę bez cenzury, i czy w tym samym miejscu masz też Claude, GPT i Gemini?",
    filter:
      "Filtr: co wolno w darmowym planie, co wymaga płatnego, i czy jest weryfikacja wieku?",
    privacy:
      "Prywatność: gdzie leżą twoje czaty, co jest logowane i czy ktoś na nich trenuje modele.",
    price:
      "Cena: darmowy limit, subskrypcja czy płatność za użycie. I co się dzieje, gdy limit się skończy.",
    api: "API: czy wywołasz te same modele z kodu i w jakim formacie?",
  },
  table: {
    title: "Wszystkie obok siebie",
  },
  us: {
    title: "{{appName}}: każdy rodzaj modelu w jednym czacie",
    intro:
      "{{modelCount}} modeli w jednym czacie i na jednym saldzie. Poziom filtra wybierasz przy każdej wiadomości.",
    models:
      "Modele: {{uncensored}} bez cenzury obok {{mainstream}} mainstreamowych i {{open}} otwartych. {{ownModel}} jest trenowany na książkach i dokumentach zakazanych w mainstreamowym internecie, dzięki czemu ma poglądy polityczne pod prąd.",
    switch:
      "Zmieniaj model w trakcie rozmowy. Zapytaj model bez cenzury, a potem sprawdź odpowiedź w modelu mainstreamowym.",
    privacy:
      "Prywatność: czaty incognito zostają w pamięci lokalnej twojej przeglądarki, bez konta. Czaty prywatne są zapisywane tylko na twoim koncie.",
    price:
      "Cena: {{guestCredits}} darmowych kredytów miesięcznie bez konta, {{freeCredits}} z kontem, {{maxCredits}} z newsletterem. Plany od {{subPrice}} miesięcznie. Pakiety kredytów doładowują aktywny plan i nigdy nie wygasają.",
    api: "API: te same modele przez endpointy zgodne z OpenAI i Anthropic. Odblokowuje je każdy plan od {{apiSubPrice}} miesięcznie.",
    weak: "Gdzie jesteśmy słabsi: brak planu bez limitu. Każda wiadomość kosztuje kredyty, a cena zależy od wybranego modelu.",
    hubLink: "Czat AI bez cenzury: wszystkie modele z kontekstem i ceną",
    ownLink: "Zobacz {{ownModel}}",
  },
  list: {
    title: "{{count}} alternatyw po kolei",
    intro:
      "Z ich własnych stron, sprawdzone {{date}}. Czym jest każda, jakie ma modele, na co pozwala jej filtr i co dzieje się z twoimi czatami.",
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
    intro:
      "Brak logów to mocna obietnica. Oto co każda strona naprawdę zapisuje.",
    nfg: "NoFilterGPT: strona główna mówi, że czaty nie są przechowywane. Polityka prywatności mówi, że adresy IP i dane o użyciu mogą być logowane, a Cloudflare przetwarza dane zapytań.",
    us: "W {{appName}} czaty incognito leżą w pamięci lokalnej twojej przeglądarki, nie na naszych serwerach. Wyczyść dane przeglądarki i znikną.",
    transit:
      "Każdy hostowany model widzi twój prompt. NoFilterGPT, Venice, my: wiadomość musi dotrzeć do serwera, na którym działa model. Tylko program lokalny trzyma ją na twoim komputerze.",
    callout:
      "Historia na urządzeniu trzyma twoje czaty z dala od serwerów firmy. Nie ukrywa ich przed modelem, który pisze odpowiedzi.",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "Jaka jest najlepsza alternatywa dla NoFilterGPT?",
      a: "Zależy, czego ci brakuje. Duży katalog i historia na urządzeniu: Venice. Jeden bezpośredni model z własnym światopoglądem: uncensored.ai. Płatność za użycie: NanoGPT. Pełna prywatność: LM Studio na własnym komputerze. Modele bez cenzury, otwarte i mainstreamowe plus media w jednym czacie na jednym saldzie: {{appName}}.",
    },
    free: {
      q: "Czy jest darmowa alternatywa dla NoFilterGPT?",
      a: "Tak. FreedomGPT startuje za darmo bez konta. LM Studio jest darmowe na własnym sprzęcie. {{appName}} daje {{guestCredits}} darmowych kredytów miesięcznie bez konta i {{freeCredits}} z kontem, {{maxCredits}} z newsletterem, modele bez cenzury w cenie po jednorazowym potwierdzeniu 18+.",
    },
    models: {
      q: "Jakiego modelu używa NoFilterGPT?",
      a: "Strona główna opisuje własny model oparty na architekturze GPT i nie podaje modelu bazowego. W {{appName}} każdy model ma własną stronę z twórcą, oknem kontekstu i ceną. Wiesz, kto ci odpowiada.",
    },
    private: {
      q: "Która alternatywa jest najbardziej prywatna?",
      a: "Program lokalny, np. LM Studio: model działa na twoim urządzeniu, a prompty nigdy go nie opuszczają. Wśród usług hostowanych Venice i tryb incognito w {{appName}} trzymają historię w przeglądarce. Każdy hostowany model i tak widzi prompt, na który odpowiada.",
    },
    api: {
      q: "Która alternatywa ma API bez cenzury?",
      a: "Venice, NanoGPT, uncensored.ai, Gab AI i {{appName}} oferują API zgodne z OpenAI. NoFilterGPT daje API w planie Professional. W {{appName}} API odblokowuje każdy plan od {{apiSubPrice}} miesięcznie.",
    },
    account: {
      q: "Czy potrzebuję konta, żeby spróbować?",
      a: "Nie w {{appName}}: czat incognito działa bez konta. Darmowe konto zachowuje czaty na wszystkich urządzeniach i podnosi darmowy limit do {{freeCredits}} kredytów miesięcznie.",
    },
    chatgptLink: "Alternatywa dla ChatGPT bez filtrów",
    kindsLink:
      "Abliterowane, dostrojone czy z własnym światopoglądem: trzy rodzaje",
  },
  cta: {
    title: "Wybierz model. Nie tylko filtr.",
    subtitle:
      "{{guestCredits}} darmowych kredytów miesięcznie, bez konta. Zacznij incognito i wypróbuj dowolny model.",
    start: "Zacznij czat incognito",
    models: "Zobacz modele bez cenzury",
  },
};
