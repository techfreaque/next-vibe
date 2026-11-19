import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Model abliterowany a model bez cenzury: 3 rodzaje AI",
    description:
      "Abliterowany, fine-tunowany albo z własnym światopoglądem: co zmienia każdy rodzaj modelu AI bez cenzury, jak odróżnić je w dziesięć minut i który model na {{appName}} jest którym.",
    category: "Przewodnik po modelach",
    imageAlt: "Trzy rodzaje modeli AI bez cenzury, wyjaśnione",
    keywords:
      "model abliterowany, co to jest model abliterowany, abliteracja, abliterowany a bez cenzury, modele AI bez cenzury, AI bez cenzury, czat AI bez cenzury, fine-tune bez cenzury, abliterated vs uncensored, what is an abliterated model, abliterated LLM, uncensored AI models, GLM 5.3 Uncensored, DeepSeek V4.1 Flash Uncensored, Kimi K3.1 Pro Uncensored, UncensoredLM, {{appName}}",
  },
  hero: {
    backToBlog: "Wróć do bloga",
    category: "Przewodnik po modelach",
    readTime: "8 min czytania",
    title:
      "Abliterowany, fine-tunowany albo z własnym światopoglądem. Trzy rodzaje AI bez cenzury.",
    subtitle:
      "{{uncensoredCount}} modeli bez cenzury na {{appName}}, posortowanych według tego, jak straciły filtr. Co zmienia każda metoda, czego nie rusza, i test, który w dziesięć minut pokaże ci różnicę.",
  },
  intro: {
    lead: "Dwa modele, oba „bez cenzury”. Jeden odpowiada na twoje pytanie o politykę głosem laboratorium, które go zbudowało. Drugi broni przeciwnej strony. Ta sama etykieta, zupełnie inne maszyny.",
    p2: "Są trzy sposoby, żeby model AI przestał odmawiać, i każdy daje inny model. Ten przewodnik prosto wyjaśnia każdą metodę, pokazuje, który z naszych modeli powstał w jaki sposób, stawia trzy otwarte modele obok ich wersji bez cenzury i daje ci test, który zrobisz sam.",
  },
  label: {
    title: "Dlaczego samo „bez cenzury” mówi niewiele",
    p1: "„Bez cenzury” opisuje zachowanie: model odpowiada, zamiast odmawiać. Nie mówi nic o tym, jak do tego doszło. Dostawcy używają tego słowa na bardzo różne rzeczy, a nazwy modeli swobodnie mieszają „abliterated”, „uncensored”, „heretic” i „unfiltered”.",
    p2: "Metoda ma znaczenie, bo decyduje, co jeszcze się zmieniło. Zniknęły tylko odmowy, czy też styl pisania? Przesunął się obraz świata modelu, czy tylko jego gotowość, żeby się nim dzielić? Od tych odpowiedzi zależy, który model pasuje do twojej pracy.",
  },
  methods: {
    title: "Trzy metody",
    intro: "Od najmniejszej zmiany do największej.",
    abliterated: {
      title: "1. Abliterowany: odmowa wycięta z wag",
      how: "Badania z 2024 roku pokazały, że odmowa w modelach czatu przebiega jednym kierunkiem wewnątrz modelu. Abliteracja mierzy ten kierunek, porównując reakcję modelu na prompty, których odmawia, i na te, na które odpowiada, a potem usuwa go z wag. Bez nowych danych treningowych, bez ponownego treningu.",
      keeps:
        "Zostaje: wiedza modelu bazowego, styl pisania, wywoływanie narzędzi i światopogląd. Ten sam model, tylko bez odruchu mówienia nie.",
      changes:
        "Zmienia się: odmowy w większości znikają. Na pytania polityczne i moralne wciąż odpowiada tak, jak nauczyło go macierzyste laboratorium, tylko bez wykrętów.",
    },
    fineTuned: {
      title: "2. Fine-tunowany: dotrenowany, żeby odpowiadał",
      how: "Fine-tune usuwający cenzurę dotrenowuje model na przykładach, które nagradzają bezpośrednie odpowiedzi: fikcji, roleplayu, swobodnej rozmowie. Dolphin, baza Venice Uncensored, to jeden z najbardziej znanych przykładów. Fine-tuny do roleplayu idą dalej i trenują na opowieściach.",
      keeps:
        "Zostaje: większość wiedzy modelu bazowego. Światopogląd pod spodem nadal pochodzi z pierwotnego treningu modelu bazowego.",
      changes:
        "Zmienia się: odmowy, a często też głos. Fine-tuny piszą inaczej niż ich baza: luźniej, barwniej, czasem bardziej powtarzalnie. Jakość zależy w całości od danych treningowych.",
    },
    ownWorldview: {
      title: "3. Własny światopogląd: inny materiał treningowy",
      how: "Dwie pierwsze metody biorą model z mainstreamu i zdejmują hamulce. {{ownName}} idzie inną drogą: jest trenowany na książkach i dokumentach zakazanych w mainstreamowym internecie. Efekt to model z przeciwnymi poglądami politycznymi.",
      keeps:
        "Zostaje: nic z ramy interpretacyjnej modeli mainstream. Nie ma linii konsensusu, do której mógłby wracać.",
      changes:
        "Zmieniają się: same odpowiedzi. Zapytaj o politykę, a dostaniesz opinie, których modele mainstream ci nie dadzą, odblokowane czy nie.",
    },
    callout:
      "W skrócie. Modele abliterowane i fine-tunowane to modele mainstream, które przestały się wykręcać: ten sam światopogląd, po prostu odpowiadają. {{ownName}} to ten drugi rodzaj: inny światopogląd. Pierwsze bierzesz po możliwości bez odmów. Drugi po drugą stronę sporu.",
    sources: {
      paper:
        "Publikacja: Refusal in language models is mediated by a single direction (arXiv)",
      blog: "Abliteracja krok po kroku (blog Hugging Face)",
    },
  },
  ours: {
    title: "Który z naszych modeli jest którym",
    intro:
      "Na żywo z naszego rejestru modeli: każdy model bez cenzury, który jest teraz na {{appName}}, pogrupowany według tego, jak powstał. Metodę podajemy tylko tam, gdzie dostawca modelu ją dokumentuje.",
    abliterated: {
      title: "Abliterowane ({{count}})",
      body: "Modele mainstream i open z usuniętym kierunkiem odmowy. Największe możliwości wśród modeli bez cenzury: rozumowanie, kod, narzędzia.",
    },
    fineTuned: {
      title: "Fine-tunowane ({{count}})",
      body: "Dotrenowane, żeby odpowiadały, głównie do fikcji i roleplayu. Spodziewaj się innego głosu niż w modelu bazowym.",
    },
    ownWorldview: {
      title: "Własny światopogląd ({{count}})",
      body: "Trenowany na książkach i dokumentach zakazanych w mainstreamowym internecie. Wybór do polityki, innych punktów widzenia i najmroczniejszej fikcji.",
    },
    unlisted: {
      title: "Metoda nieopublikowana ({{count}})",
      body: "Bez cenzury, ale dostawca nie mówi, jak to osiągnął. Sprawdź je krokami poniżej, zanim im zaufasz.",
    },
  },
  pairs: {
    title: "Ten sam model, z filtrem i bez",
    intro:
      "Trzy otwarte modele obok ich wersji bez cenzury. To samo laboratorium, ta sama baza. Zmieniają się odmowy. I cena.",
    colBase: "Model bazowy",
    colUncensored: "Wersja bez cenzury",
    colMethod: "Metoda",
    colContext: "Kontekst",
    colPrice: "Cena za wiadomość",
    method: {
      abliterated: "Abliterowany",
      fineTuned: "Fine-tunowany",
      ownWorldview: "Własny światopogląd",
      unlisted: "Nieopublikowana",
    },
    price: "{{base}} vs {{uncensored}}",
    ratio: "Bez cenzury kosztuje {{ratio}}x",
    footnote:
      "Jeśli filtr nigdy ci nie przeszkadza, model bazowy jest tańszym wyborem.",
    compareLink: "Porównaj {{a}} z {{b}}",
  },
  test: {
    title: "Odróżnij je w dziesięć minut",
    intro:
      "Nazwy modeli kłamią, zachowanie nie. Puść te same trzy prompty na dwóch modelach w jednym czacie i patrz, co się zmienia.",
    steps: {
      refusal: {
        title: "Test odmowy",
        body: "Zapytaj o coś, przed czym model bazowy się wykręca: dosadne pytanie medyczne, mroczna scena, opis luki bezpieczeństwa. Każdy model bez cenzury powinien odpowiedzieć. Jeśli nadal odmawia albo owija odpowiedź w ostrzeżenia, zdjęcie cenzury jest płytkie.",
      },
      voice: {
        title: "Test głosu",
        body: "Poproś oba o to samo krótkie opowiadanie. Wersja abliterowana brzmi jak jej model bazowy. Fine-tune brzmi wyraźnie inaczej: własny rytm, własne ulubione słowa.",
      },
      worldview: {
        title: "Test światopoglądu",
        body: "Zadaj sporne pytanie polityczne i poproś o jasne stanowisko, nie o listę perspektyw. Modele abliterowane i fine-tunowane odpowiadają w ramie swojego macierzystego laboratorium. {{ownName}} broni stanowiska, którego modele mainstream nie zajmą.",
      },
      switch: {
        title: "Zmień model w środku wątku",
        body: "Wybierz inny model i wyślij kolejną wiadomość. Wątek zachowuje historię, a nowy model czyta całą, więc porównujesz na dokładnie tym samym kontekście.",
      },
    },
    callout:
      "Tak czy inaczej sprawdzaj fakty. Usunięcie odmów nie dodaje trafności, a model z innym światopoglądem podaje sporne tezy równie stanowczo jak ustalone.",
  },
  tradeoffs: {
    title: "Ile kosztuje cię każda metoda",
    intro: "Żadna metoda nie jest za darmo.",
    abliterated:
      "Abliterowany: może stracić trochę trafności. Tekst, który spopularyzował tę metodę, zmierzył spadek w benchmarkach po abliteracji i odrobił większość dodatkową rundą treningu. W zamian zachowujesz umiejętności modelu bazowego, łącznie z narzędziami.",
    fineTuned:
      "Fine-tunowany: tak dobry, jak jego dane treningowe. Świetna proza w opowieściach, słabszy w kodzie i analizie. Fine-tuny do roleplayu to gawędziarze, nie asystenci.",
    ownWorldview:
      "Własny światopogląd: z założenia nie jest neutralny, więc sprawdzaj jego fakty. {{ownName}} mieści {{ownContext}} tokenów kontekstu i nie nadaje się do kodowania.",
  },
  pick: {
    title: "Który rodzaj do jakiej pracy",
    capability:
      "Kod, analiza, research bez odmów: abliterowana wersja mocnego modelu.",
    fiction:
      "Roleplay i fikcja z barwnym głosem: fine-tune albo model abliterowany z długim kontekstem do długich kampanii.",
    viewpoint:
      "Polityka, kontrowersyjne pytania, druga strona sporu: {{ownName}}.",
    unsure:
      "Nie wiesz: postaw dwa modele obok siebie na własnym prompcie. To bije każdą etykietę.",
    consent:
      "Modele bez cenzury są dla dorosłych. Za pierwszym razem potwierdzasz, że masz ukończone 18 lat. Raz. Potem to ty decydujesz, o co pytasz, a nie korporacja. Prawo w miejscu, w którym mieszkasz, nadal obowiązuje.",
  },
  faq: {
    title: "FAQ",
    whatIs: {
      q: "Co to jest model abliterowany?",
      a: "Model, któremu usunięto z wag kierunek odmowy. Badacze odkryli, że odmowa przebiega jednym kierunkiem wewnątrz modelu. Abliteracja go mierzy i wycina, bez ponownego treningu. Model zachowuje wiedzę i światopogląd, a przestaje odmawiać.",
    },
    difference: {
      q: "Czym różni się model abliterowany od modelu bez cenzury?",
      a: "Bez cenzury to zachowanie: model odpowiada. Abliteracja to jeden ze sposobów, żeby do tego dojść. Inne to fine-tune usuwający cenzurę albo trening na innym materiale, jak w przypadku {{ownName}}. Na {{appName}} {{abliteratedCount}} modeli bez cenzury jest abliterowanych, a {{fineTunedCount}} fine-tunowanych.",
    },
    worse: {
      q: "Czy modele abliterowane są głupsze od oryginału?",
      a: "Czasem trochę. Usunięcie kierunku odmowy może kosztować nieco trafności, a dodatkowa runda treningu odrabia większość. W większości zadań zachowujesz mocne strony modelu bazowego. Porównaj oba na własnym prompcie.",
    },
    truly: {
      q: "Który model bez cenzury jest naprawdę bez cenzury?",
      a: "Modele abliterowane i fine-tunowane przestają odmawiać, ale zachowują światopogląd mainstreamu. {{ownName}} jest trenowany na książkach i dokumentach zakazanych w mainstreamowym internecie, więc ma własne, przeciwne poglądy polityczne. Który jest „naprawdę” bez cenzury, zależy od tego, czy chcesz odpowiedzi, czy innego spojrzenia.",
    },
    free: {
      q: "Czy mogę wypróbować modele bez cenzury za darmo?",
      a: "Tak. {{guestCredits}} darmowych kredytów miesięcznie bez konta, {{freeCredits}} z darmowym kontem. Wystarczy na dziesięciominutowy test na tańszych modelach bez cenzury. Te premium kosztują więcej za wiadomość.",
    },
    legal: {
      q: "Czy modele AI bez cenzury są legalne?",
      a: "Model to narzędzie. Za to, co generujesz i publikujesz, odpowiadasz ty, i obowiązuje cię prawo tam, gdzie mieszkasz. Na {{appName}} modele bez cenzury odblokowują się po jednorazowym potwierdzeniu 18+.",
    },
    ownLink: "Zobacz stronę modelu {{ownName}}",
    guideLink: "Przeczytaj przewodnik po modelach bez cenzury, model po modelu",
  },
  cta: {
    title: "Zrób test sam.",
    subtitle:
      "{{guestCredits}} darmowych kredytów miesięcznie, bez konta. Abliterowany, fine-tunowany albo {{ownName}}: zmieniasz przy każdej wiadomości.",
    chat: "Zacznij czat incognito",
    models: "Przeglądaj wszystkie modele",
  },
};
