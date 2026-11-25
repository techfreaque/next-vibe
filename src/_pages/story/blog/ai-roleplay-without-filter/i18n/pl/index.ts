import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Roleplay AI bez cenzury: alternatywa dla Character.AI",
    description:
      "Roleplay AI bez filtra na modelach bez cenzury. Mroczne sceny zostają mroczne, postacie trzymają się roli. Pamięć, prywatność, cena. Start za darmo.",
    category: "Poradnik",
    imageAlt: "{{appName}}: roleplay AI bez filtra",
    keywords:
      "roleplay AI bez cenzury, roleplay AI bez filtra, alternatywa dla Character AI, Character AI bez filtra, czat AI bez cenzury, AI bez cenzury, roleplay AI NSFW, czat z postacią AI, mroczny roleplay AI, UncensoredLM, Venice Role Play, Artemis 31B, {{appName}}",
  },
  hero: {
    backToBlog: "Wróć do bloga",
    category: "Poradnik",
    readTime: "8 min czytania",
    title: "Roleplay AI bez filtra. Historia idzie tam, gdzie ją poprowadzisz.",
    subtitle:
      "Modele do roleplayu bez cenzury obok tych z głównego nurtu, na jednym saldzie w {{appName}}. Który trzyma postać, który pamięta całą kampanię, ile kosztuje jedna odpowiedź.",
  },
  intro: {
    lead: "Scena się rozkręcała. I nagle twoja postać wychodzi z historii, żeby ci powiedzieć, że nie może kontynuować. Złoczyńca, który przeprasza. Horror, który zamienia się w komunikat o bezpieczeństwie. Romans, który za każdym razem urywa się w pół zdania. Na Character.AI i w większości chatbotów ostatnie zdanie pisze filtr, a nie ty.",
    p2: "Ten poradnik pokazuje, jak wygląda roleplay AI bez filtra na {{appName}}: porównanie {{modelCount}} modeli do roleplayu, który pasuje do mrocznej fikcji, długich kampanii albo małego budżetu, jak działa pamięć, jak w dwie minuty stworzyć postać i ile kosztuje odpowiedź.",
  },
  exists: {
    title: "Czy jest Character.AI bez filtra?",
    p1: "Nie od Character.AI. Tam jeden filtr treści obowiązuje wszystkich, bez przełącznika do wyłączenia i bez płatnego planu, który by go zdejmował. Prompty do obchodzenia filtra to walka, którą prędzej czy później przegrasz.",
    p2: "Prawdziwa alternatywa to inny model. {{appName}} uruchamia modele bez cenzury stworzone do fikcji: bez odmów, bez moralizatorskich wtrąceń, bez postaci wychodzącej z roli, żeby dać ci wykład. Model wybierasz przy każdej wiadomości i możesz go zmienić w środku sceny.",
    consent:
      "Modele bez cenzury są dla dorosłych. Za pierwszym razem potwierdzasz, że masz ukończone 18 lat. Raz. Potem to ty decydujesz, co dzieje się w twojej historii, a nie korporacja.",
  },
  levels: {
    title: "Co znaczy „bez filtra” w roleplayu",
    intro: "Każdy model ma jeden z trzech poziomów treści.",
    mainstream:
      "Mainstream: Claude, GPT, Gemini. Świetnie piszą, mają ostre filtry. Przemoc jest łagodzona, intymne sceny się urywają, mroczne tematy dostają ostrzeżenie.",
    open: "Otwarte: Kimi, MiniMax, DeepSeek, GLM. Lekkie filtry. Większość scen dla dorosłych przechodzi, te najmroczniejsze są stonowane.",
    uncensored:
      "Bez cenzury: żadnego filtra. Dosłownie, brutalnie, bez tabu: scena idzie tak, jak ją napiszesz.",
    twoKinds:
      "Modele bez cenzury są dwojakie. Większość to modele z głównego nurtu, którym wycięto odmowy, przez abliterację albo dostrajanie usuwające cenzurę. Przestają mówić nie, ale zachowują światopogląd modelu bazowego, więc mroczna scena wciąż może zjechać w bezpieczniejszą stronę. {{ownName}} to ten drugi rodzaj: trenowany na książkach i dokumentach usuniętych z głównego nurtu internetu. Własny światopogląd, nic nie ściąga historii z powrotem na bezpieczny grunt.",
  },
  table: {
    title: "Modele do roleplayu obok siebie",
    intro:
      "Na żywo z naszego rejestru modeli. Pamięć to okno kontekstu: ile historii model czyta przed każdą odpowiedzią. 1 kredyt = {{creditValue}}.",
    colModel: "Model",
    colFilter: "Poziom filtra",
    colMemory: "Pamięć",
    colImages: "Czyta obrazy",
    colPrice: "Cena za odpowiedź",
    memory: "tokeny: {{context}}, stron: ok. {{pages}}",
    yes: "Tak",
    no: "Nie",
    credits: "kredyty: {{credits}}",
    footnote:
      "Cena za odpowiedź dotyczy długiej sceny: dużo historii na wejściu, pełna odpowiedź na wyjściu. Krótkie wymiany kosztują mniej. Ceny zawierają naszą marżę i pochodzą od najtańszego dostawcy danego modelu.",
  },
  models: {
    uncensoredLm: "Mroczne i bez tabu, własny światopogląd",
    artemis: "Dostrojony do roleplayu, długa pamięć, tani",
    veniceRoleplay: "Trenowany, by trzymać głos postaci",
    deepseekFlash: "Sprytne fabuły, ogromna pamięć",
    glmFlash: "Szybki i tani, czyta obrazy",
    venice: "Tani model do wszystkiego",
    minimaxFlash: "Najtańszy, otwarty filtr",
    kimi: "Bogate postacie, lekki filtr",
    sonnet: "Najlepsza proza, filtr mainstream",
  },
  picks: {
    title: "Który model do jakiej historii",
    intro: "Zacznij od sceny, którą chcesz napisać.",
    dark: {
      title: "Mroczne, bez tabu, dosłowne",
      body: "{{ownName}} prowadzi: żadnych złagodzonych scen, żadnych nagłych kazań. Jego ograniczenie to pamięć: tokeny: {{ownContext}}, czyli ok. {{ownPages}} stron, więc długie kampanie gubią pierwsze rozdziały. Artemis to model dostrojony do roleplayu, który pisze grimdark i dosłowne sceny bez owijania, z dużo większą pamięcią.",
    },
    long: {
      title: "Długie kampanie",
      body: "Kiedy historia trwa tygodniami. Te modele trzymają wczesne sceny w zasięgu. DeepSeek V4.1 Flash Uncensored dokłada prawdziwe rozumowanie do fabuł z wieloma wątkami. {{roleplayName}} trzyma głos postaci w oknie {{roleplayContext}} tokenów.",
    },
    cheap: {
      title: "Tanio, na dużą skalę",
      body: "Codzienne rozmowy z towarzyszem, szybkie sceny, dużo ponownych prób. {{cheapestName}} daje tu najtańszą odpowiedź, z otwartym filtrem. Dwa pozostałe są bez cenzury.",
    },
    filtered: {
      title: "Bogate postacie, filtr nie przeszkadza",
      body: "Powoli budowany dramat, intryga polityczna, kryminał, w którym poszlaki się składają. Najlepsi autorzy zachowują filtry i łagodzą najmroczniejsze momenty. Bierz je, gdy historia nie musi tam iść.",
    },
    compareLink: "Porównaj {{a}} z {{b}}",
  },
  memory: {
    title: "Czy AI pamięta moją postać?",
    intro: "Są dwa rodzaje pamięci. W roleplayu liczą się oba.",
    p1: "Okno kontekstu to pamięć krótkotrwała: wszystko, co model czyta ponownie przed odpowiedzią. {{longestName}} mieści {{longestContext}} tokenów, czyli ok. {{longestPages}} stron historii. {{ownName}} mieści {{ownContext}}, czyli ok. {{ownPages}} stron. Gdy wątek przerośnie okno, najstarsze sceny wypadają. Najważniejsze rzeczy (imiona, relacje, zasady twojego świata) wpisz w opis postaci, wtedy nigdy nie zginą.",
    p2: "Pamięć długotrwała to coś innego: fakty, które AI zapamiętuje o tobie i przywołuje w nowych wątkach. Wymaga darmowego konta i folderu prywatnego. Czaty incognito nigdy nie zapisują wspomnień.",
  },
  setup: {
    title: "Postać w dwie minuty",
    intro:
      "Wybierz skill społeczności, zaimportuj publiczną postać z linku do Character.AI lub Talkie albo stwórz własną według poniższych kroków.",
    steps: {
      skill: {
        title: "Otwórz skill Roleplay",
        body: "Mówi modelowi: zostań w roli, trzymaj spójny głos, nigdy nie steruj twoją postacią, pomijaj ostrzeżenia o treści.",
      },
      variant: {
        title: "Wybierz wariant",
        body: "Uncensored używa {{uncensored}} do mrocznych scen bez tabu. Creative używa {{creative}}, najtańszego. Deep używa {{deep}} do postaci z bogatym wnętrzem w długich kampaniach.",
      },
      character: {
        title: "Opisz postać i scenę",
        body: "Imię, charakter, sposób mówienia, czego chce, gdzie zaczyna się historia. Napisz, czy piszesz w pierwszej, czy w trzeciej osobie. Potem twój ruch.",
      },
      switch: {
        title: "Zmień model w środku sceny",
        body: "Model odmawia albo robi się nijaki? Wybierz inny i wyślij kolejną wiadomość. Wątek zachowuje historię, a nowy model czyta ją całą.",
      },
      art: {
        title: "Dodaj grafiki postaci",
        body: "Poproś o portret w tym samym czacie. Generator obrazów korzysta z tego samego salda, także modele obrazu bez cenzury.",
      },
    },
    skillLink: "Otwórz skill Roleplay",
    imageLink: "Porównaj generatory obrazów bez cenzury",
  },
  privacy: {
    title: "Czy mój roleplay jest prywatny?",
    intro: "Zależy od folderu. Oto dokładnie, co się dzieje.",
    incognito:
      "Czaty incognito są w pamięci lokalnej twojej przeglądarki, nie na naszych serwerach. Wyczyść dane przeglądarki i znikną.",
    transit:
      "Każda wiadomość i tak przechodzi przez nasz serwer do dostawcy modelu, który pisze odpowiedź. Tak działa każde hostowane AI. Zużycie kredytów jest zapisywane do rozliczeń.",
    private:
      "Czaty prywatne są zapisane na serwerze i widoczne tylko dla twojego konta, na każdym urządzeniu, na którym się zalogujesz.",
    callout:
      "W skrócie: incognito trzyma twoją historię z dala od naszych serwerów. Nie ukrywa jej przed modelem, który pisze odpowiedzi.",
  },
  pricing: {
    title: "Ile kosztuje roleplay bez filtra",
    intro: "Kredyty za odpowiedź. Jedno saldo na wszystkie modele.",
    perReply:
      "Każda odpowiedź kosztuje kredyty zależnie od modelu i długości sceny. Tabela pokazuje długą scenę. 1 kredyt = {{creditValue}}.",
    cheapest:
      "Najtańsza odpowiedź: {{cheapestName}} za {{cheapestPrice}}, odpowiedzi za {{unit}}: ok. {{cheapestPerUnit}}. Najtańszy bez cenzury: {{uncensoredName}} za {{uncensoredPrice}}, odpowiedzi za {{unit}}: ok. {{uncensoredPerUnit}}.",
    free: "Za darmo co miesiąc: kredyty bez konta: {{guestCredits}}, z darmowym kontem: {{freeCredits}}. Starczy na długą pierwszą kampanię na tanim modelu.",
    sub: "Plany miesięczne: cztery rozmiary, od {{subCredits}} kredytów za {{subPrice}}.",
    pack: "Pakiety kredytów: doładowanie dla subskrybentów, {{packCredits}} kredytów za {{packPrice}}. Nigdy nie wygasają. Karta, PayPal albo krypto.",
    link: "Zobacz plany i pakiety kredytów",
  },
  characterAi: {
    title: "Kiedy Character.AI jest lepszym wyborem",
    intro: "Czasem. Wtedy, gdy:",
    library:
      "Obserwujesz już twórców na Character.AI lub chcesz kontynuować rozpoczęte tam historie.",
    flatRate:
      "Chcesz stałej opłaty i nie chcesz myśleć o koszcie odpowiedzi. Kredyty liczą się za użycie, a długie sceny na modelach premium się sumują.",
    wantFilter:
      "Chcesz filtra. Dla młodszego użytkownika albo wspólnego rodzinnego urządzenia lepiej pasuje zamknięta aplikacja.",
    callout:
      "Bez filtra znaczy bez siatki asekuracyjnej. Za to, co piszesz i publikujesz, odpowiadasz ty, a prawo twojego kraju nadal obowiązuje.",
  },
  faq: {
    title: "FAQ",
    exists: {
      q: "Czy jest czat do roleplayu AI bez filtra?",
      a: "Tak. {{appName}} uruchamia modele bez cenzury stworzone do fikcji: {{ownName}}, Artemis, Venice Role Play i inne. Bez odmów, bez wykładów, bez wychodzenia z roli. Odblokowuje je jednorazowe potwierdzenie pełnoletności.",
    },
    free: {
      q: "Czy roleplay AI bez filtra jest darmowy?",
      a: "Zaczniesz za darmo. Kredyty co miesiąc bez konta: {{guestCredits}}, z darmowym kontem: {{freeCredits}}. Odpowiedź na {{uncensoredName}} w długiej scenie kosztuje ok. {{uncensoredCredits}} kr. Potem: plan, od {{subPrice}} miesięcznie.",
    },
    nsfw: {
      q: "Czy mogę prowadzić roleplay NSFW?",
      a: "Tak, na modelach bez cenzury, jako dorosły, który raz to potwierdził. Fikcja między dorosłymi to twoja sprawa. Treści seksualne z udziałem nieletnich są nielegalne i takie zostają.",
    },
    memory: {
      q: "Jak długo trwa roleplay, zanim AI zapomni?",
      a: "Do {{longestContext}} tokenów na {{longestName}}, czyli ok. {{longestPages}} stron. {{ownName}} mieści ok. {{ownPages}} stron. Najważniejsze wpisz w opis postaci, wtedy zostanie w pamięci.",
    },
    private: {
      q: "Czy ktoś może czytać mój roleplay?",
      a: "Czaty incognito zostają w twojej przeglądarce. Czaty prywatne widzi tylko twoje konto. Wiadomości i tak trafiają do dostawcy modelu, który pisze odpowiedź.",
    },
    account: {
      q: "Czy potrzebuję konta?",
      a: "Nie. Roleplay incognito działa bez konta. Darmowe konto jest potrzebne do pamięci długotrwałej i do czatów zapisanych na wszystkich urządzeniach.",
    },
    guideLink: "Przeczytaj przewodnik po wszystkich modelach bez cenzury",
    chatgptLink: "Alternatywa dla ChatGPT bez filtrów",
  },
  partners: {
    body: "Prowadzisz społeczność roleplay, serwer na Discordzie albo kanał o postaciach AI? Program partnerski {{appName}} płaci ci stały udział w każdej płatności, którą polecisz.",
    link: "Zobacz program partnerski",
  },
  cta: {
    title: "Wybierz postać. Napisz scenę.",
    subtitle:
      "Darmowe kredyty co miesiąc, bez konta: {{guestCredits}}. Bez cenzury, otwarte albo mainstream: zmieniaj, kiedy chcesz.",
    start: "Zacznij roleplay",
    models: "Porównaj wszystkie modele",
  },
};
