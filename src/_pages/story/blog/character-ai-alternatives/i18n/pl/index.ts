import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternatywa dla Character AI bez filtra (2026)",
    description:
      "Alternatywy dla Character.AI bez filtra, porównane na podstawie ich własnych stron z cennikiem, zasadami filtra i prywatnością: Janitor AI, SillyTavern, CrushOn, Kindroid, Nomi, Venice i {{appName}}. Do tego import twoich postaci z Character.AI.",
    category: "Porównanie",
    imageAlt: "Alternatywy dla Character.AI bez filtra, porównanie",
    keywords:
      "alternatywa dla Character AI bez filtra, alternatywa dla Character AI, Character AI bez filtra, Character AI bez cenzury, strony jak Character AI, aplikacje jak Character AI, Character AI NSFW alternatywa, Janitor AI alternatywa, import postaci z Character AI, roleplay AI bez filtra, Character.AI alternatives, Character AI alternative no filter, sites like Character AI, uncensored Character AI, {{appName}}",
  },
  hero: {
    backToBlog: "Wróć do bloga",
    category: "Porównanie",
    readTime: "10 min czytania",
    title:
      "Alternatywy dla Character.AI bez filtra. Sprawdzone, nie zgadywane.",
    subtitle:
      "{{count}} alternatyw i {{appName}}, porównanych na podstawie tego, co mówią ich własne strony z cennikiem, zasadami filtra i prywatnością. Stan na {{date}}. Swoje postacie zabierasz ze sobą.",
  },
  intro: {
    lead: "Większość list alternatyw dla Character.AI kopiuje się nawzajem. „Bez filtra”, „za darmo”, „najlepsze do NSFW”: twierdzenia, których nikt nie sprawdził. Potem zakładasz konto i po 50 wiadomościach trafiasz na paywall albo na filtr, o którym lista milczała.",
    p2: "{{date}} przeczytaliśmy cennik, regulamin, politykę prywatności i centrum pomocy każdej platformy. Każde twierdzenie poniżej pochodzi z tych stron, a źródła masz jedno kliknięcie dalej. Jedną z tych platform prowadzimy my: {{appName}}. Mówimy to wprost, stawiamy ją na początku i piszemy, gdzie inni wygrywają.",
  },
  criteria: {
    title: "Co naprawdę się liczy przy zmianie",
    intro: "Pięć pytań. Odpowiedz na nie, zanim wybierzesz.",
    filter:
      "Filtr: co jest dozwolone, kto o tym decyduje i czy jest weryfikacja wieku? „Bez filtra” na stronie głównej i „zakazane” w regulaminie potrafią stać na tej samej stronie.",
    memory:
      "Pamięć: ile historii model czyta przed każdą odpowiedzią. Mały kontekst znaczy, że twoja postać zapomina pierwsze rozdziały.",
    price:
      "Cena: stały abonament, limity wiadomości albo płatność za użycie. Darmowe plany wahają się od nielimitowanych po 50 wiadomości na próbę.",
    privacy:
      "Prywatność: czy twoje czaty są przechowywane, używane do treningu, do reklam? Roleplay to sprawa osobista. Tę część przeczytaj.",
    characters:
      "Postacie: duża biblioteka społeczności, własne kreacje czy jedno i drugie? I czy możesz przenieść te, które już masz?",
  },
  table: {
    title: "Wszystkie obok siebie",
    intro:
      "Na telefonie przewijaj w bok. Dane konkurencji sprawdzone {{date}} na ich własnych stronach. Dane {{appName}} czytane na żywo z naszej konfiguracji. Character.AI zamyka tabelę jako filtrowany punkt odniesienia.",
  },
  us: {
    title: "{{appName}}: wybierasz model, ustawiasz filtr",
    intro:
      "To nie aplikacja z postaciami i jednym firmowym modelem. To czat z {{modelCount}} modelami, w którym postacie są skillami: wybierasz je, budujesz albo importujesz.",
    models:
      "Modele: {{uncensored}} modeli bez cenzury obok {{mainstream}} mainstream i {{open}} open. Zmieniasz je przy każdej wiadomości, w środku sceny. {{ownModel}} jest trenowany na książkach i dokumentach zakazanych w mainstreamowym internecie, więc nie ściąga mrocznej historii z powrotem na bezpieczny grunt.",
    characters:
      "Postacie: skill Roleplay każe każdemu modelowi trzymać się roli. Strona skilli pokazuje wbudowane postacie i skille społeczności opublikowane przez innych użytkowników. Zbuduj własną w edytorze albo napisz ją w czacie razem z Kreatorem Skilli.",
    import:
      "Import: wklej publiczny link do postaci z Character.AI albo Talkie i dostajesz własną kopię, z podanym autorem oryginału.",
    privacy:
      "Prywatność: czaty incognito zostają w twojej przeglądarce, konto niepotrzebne. Prywatne czaty zapisują się tylko na twoim koncie.",
    price:
      "Cena: {{guestCredits}} darmowych kredytów miesięcznie bez konta, {{freeCredits}} z kontem. Plany od {{subPrice}} miesięcznie. Pakiety kredytów doładowują aktywny plan i nigdy nie wygasają.",
    weak: "Gdzie jesteśmy słabsi: nasza biblioteka społeczności jest mała przy Character.AI czy Janitor AI, a kredyty są liczone, więc długie sceny na modelach premium się sumują.",
    skillsLink: "Przeglądaj wbudowane skille i skille społeczności",
    roleplayLink: "Otwórz skill Roleplay",
    creatorLink: "Zbuduj postać z Kreatorem Skilli",
  },
  list: {
    title: "{{count}} alternatyw, jedna po drugiej",
    intro:
      "Z ich własnych stron, stan na {{date}}. Czym jest każda z nich, na co naprawdę pozwala jej filtr, ile kosztuje i co dzieje się z twoimi czatami.",
    heading: "{{number}}. {{name}}: {{kind}}",
    filter: "Filtr:",
    price: "Cena:",
    priceValue: "Darmowy plan: {{free}}. Płatne: {{plans}}.",
    privacy: "Prywatność:",
    pro: "Najmocniejsza strona:",
    con: "Haczyk:",
    forWho: "Wybierz, jeśli:",
    versusLink: "{{appName}} vs {{name}}: pełne porównanie",
    visit: "Odwiedź {{name}}",
  },
  import: {
    title: "Zabierz swoje postacie z Character.AI",
    intro:
      "Zmiana platformy nie oznacza startu od zera. Zaimportuj postać z jej publicznego linku w niecałą minutę.",
    steps: {
      account: {
        title: "Zaloguj się",
        body: "Import wymaga darmowego konta, żeby postać miała właściciela.",
      },
      create: {
        title: "Otwórz edytor postaci",
        body: "Na stronie skilli kliknij Utwórz Własną Skill i wybierz Import z linku.",
      },
      paste: {
        title: "Wklej publiczny link",
        body: "Character.AI (character.ai, c.ai) albo Talkie (talkie-ai.com). Kopiujemy to, co pokazuje publiczna strona: nazwę, awatar, powitanie, opis i tagi, a także definicję, jeśli autor ją upublicznił. Postać może być prywatna, niepubliczna albo publiczna.",
      },
      model: {
        title: "Wybierz model",
        body: "Postać działa teraz na każdym z naszych modeli. Zacznij od modelu bez cenzury, zmień go w środku sceny, gdy zrobi się płaski. Wątek zachowuje historię.",
      },
    },
    callout:
      "Przy zaimportowanej postaci widnieje autor oryginału, z linkiem do źródła. Drugi import tego samego linku otwiera twoją istniejącą kopię zamiast tworzyć duplikat.",
  },
  privacy: {
    title: "Kto czyta twój roleplay?",
    intro: "Oto dokładnie, co dzieje się na {{appName}}.",
    incognito:
      "Czaty incognito żyją w lokalnej pamięci twojej przeglądarki, nie na naszych serwerach. Wyczyścisz dane przeglądarki i ich nie ma.",
    transit:
      "Każda wiadomość nadal przechodzi przez nasz serwer do dostawcy modelu, który pisze odpowiedź. Tak działa każde hostowane AI. Zużycie kredytów zapisujemy do rozliczeń.",
    others:
      "Gdzie indziej przeczytaj linijkę o prywatności w każdej karcie powyżej. Kilka platform pisze we własnej polityce, że czaty mogą trenować ich modele albo zasilać reklamy.",
    callout:
      "Incognito trzyma twoją historię z dala od naszych serwerów. Nie ukrywa jej przed modelem, który pisze odpowiedzi.",
  },
  stay: {
    title: "Kiedy Character.AI to nadal dobry wybór",
    intro: "Czasem filtr jest zaletą.",
    library:
      "Chcesz największej biblioteki gotowych postaci i nigdy nie chcesz budować własnej.",
    flat: "Chcesz nielimitowanych darmowych wiadomości i w zamian akceptujesz reklamy oraz filtrowany model.",
    filter:
      "Użytkownik jest nastolatkiem albo dzieli z nastolatkiem urządzenie. Wtedy lepiej pasuje zablokowana aplikacja.",
    callout:
      "Bez filtra znaczy bez siatki bezpieczeństwa. Za to, co piszesz i publikujesz, odpowiadasz ty, a prawo tam, gdzie mieszkasz, nadal obowiązuje.",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "Jaka jest najlepsza alternatywa dla Character.AI bez filtra?",
      a: "Zależy, czego chcesz. Ogromna darmowa biblioteka społeczności: Janitor AI. Pełna kontrola na własnym komputerze: SillyTavern. Jeden długoletni towarzysz z głosem i selfie: Kindroid albo Nomi. Wybór modelu, modele bez cenzury i własne postacie na jednym saldzie: {{appName}}.",
    },
    free: {
      q: "Czy jest darmowa alternatywa dla Character.AI bez filtra?",
      a: "Tak. Janitor AI ma darmowy plan z botami NSFW oznaczonymi jako Limitless. SillyTavern to darmowe oprogramowanie, model dostarczasz sam. {{appName}} daje {{guestCredits}} darmowych kredytów miesięcznie bez konta i {{freeCredits}} z kontem, z modelami bez cenzury po jednorazowym potwierdzeniu 18+.",
    },
    import: {
      q: "Czy mogę przenieść swoje postacie z Character.AI do innej aplikacji?",
      a: "Na {{appName}} tak: wklej publiczny link do postaci i dostajesz własną kopię z nazwą, awatarem, powitaniem, opisem i tagami, a także definicją, jeśli jest publiczna. Linki z Talkie też działają. Potrzebujesz darmowego konta.",
    },
    nsfw: {
      q: "Które alternatywy dla Character.AI pozwalają na NSFW?",
      a: "Według ich własnych stron: Janitor AI pozwala na boty NSFW oznaczone jako Limitless dla osób, które deklarują pełnoletność. CrushOn ma przełącznik Unfiltered po weryfikacji wieku. Kindroid nazywa się niefiltrowanym, z kilkoma czerwonymi liniami. Nomi nie filtruje tekstu, a filtruje nagość na obrazach. {{appName}} odblokowuje modele bez cenzury po jednorazowym potwierdzeniu 18+. Character.AI pisze, że treści pornograficzne nigdy nie będą obsługiwane.",
    },
    private: {
      q: "Która alternatywa trzyma moje czaty w prywatności?",
      a: "SillyTavern przechowuje czaty na twoim własnym komputerze. Na {{appName}} czaty incognito zostają w twojej przeglądarce. Venice pisze, że historia zostaje na twoim urządzeniu. Wiadomości do każdego hostowanego modelu i tak trafiają do dostawcy, który na nie odpowiada.",
    },
    account: {
      q: "Czy potrzebuję konta, żeby spróbować?",
      a: "Nie na {{appName}}: czat incognito działa bez konta. Darmowe konto jest potrzebne, żeby importować postacie, publikować własne i mieć czaty na wszystkich urządzeniach.",
    },
    roleplayLink: "Roleplay AI bez filtra: modele, pamięć i ceny",
    kindsLink:
      "Abliterowany, fine-tunowany czy z własnym światopoglądem: trzy rodzaje AI bez cenzury",
  },
  partners: {
    body: "Prowadzisz społeczność roleplayową, Discorda albo kanał o postaciach AI? Program partnerski {{appName}} płaci ci {{referralPercent}}% każdej płatności, którą polecisz, co miesiąc.",
    link: "Zobacz program partnerski",
  },
  cta: {
    title: "Przynieś postać. Wybierz model.",
    subtitle:
      "{{guestCredits}} darmowych kredytów miesięcznie, bez konta. Bez cenzury, open czy mainstream: zmieniasz, kiedy chcesz.",
    start: "Zacznij roleplay",
    skills: "Przeglądaj skille",
  },
};
