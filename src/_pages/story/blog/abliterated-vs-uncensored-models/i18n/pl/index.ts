import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Modele AI abliterowane a modele bez cenzury",
    description:
      "Dowiedz się, co abliteracja zmienia w modelu językowym, czym różni się od dostrajania i jak porównać zmodyfikowany model z wersją bazową.",
    category: "Przewodnik po modelach",
    imageAlt: "Trzy rodzaje modeli AI bez cenzury, wyjaśnione",
    keywords:
      "model abliterowany, co to jest model abliterowany, abliteracja, abliterowany a bez cenzury, modele AI bez cenzury, AI bez cenzury, fine-tune bez cenzury, abliterated vs uncensored, what is an abliterated model, abliterated LLM, uncensored AI models, GLM 5.3 Uncensored, DeepSeek V4.1 Flash Uncensored, Kimi K3.1 Pro Uncensored, UncensoredLM, {{appName}}",
  },
  hero: {
    backToBlog: "Wróć do bloga",
    category: "Przewodnik po modelach",
    readTime: "8 min czytania",
    title: "Czym modele abliterowane różnią się od innych modeli bez cenzury?",
    subtitle:
      "Sprawdź, jak zmiana wag wpływa na odmowy, styl i trafność odpowiedzi. Porównaj abliterację, dostrajanie i metodę użytą w modelu {{ownName}}.",
  },
  intro: {
    lead: "Abliterowany LLM to model językowy, którego wagi zmieniono tak, by rzadziej odmawiał odpowiedzi. Powstaje z istniejącego modelu, więc część wiedzy i styl pisania mogą brzmieć znajomo.",
    p2: "„Bez cenzury” to szersze pojęcie. Obejmuje modele abliterowane, modele dostrojone do swobodniejszych odpowiedzi oraz modele trenowane tak, by pokazywały inną perspektywę, jak {{ownName}}.",
  },
  online: {
    title: "Wypróbuj abliterowany model online",
    directoryLink:
      "Zobacz modele abliterowane dostępne na czacie w przeglądarce",
    guideLink: "Poznaj czat AI i modele bez cenzury",
    compare:
      "W {{appName}} otwórz stronę modelu. Przed rozpoczęciem rozmowy sprawdzisz tam okno kontekstu, funkcje i szacowany koszt. Jeśli obie wersje są dostępne, porównaj model abliterowany z bazowym.",
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
      how: "Abliteracja zmienia wagi modelu, by ograniczyć wyuczone odmowy. W badaniu z 2024 roku znaleziono kierunek powiązany z odmowami w badanych modelach czatowych. Skutek usunięcia tego sygnału zależy od modelu i polecenia.",
      keeps:
        "Styl i wiedza modelu bazowego często pozostają rozpoznawalne. Sprawdź trafność odpowiedzi i obsługę narzędzi w konkretnej wersji.",
      changes:
        "Wersja abliterowana może odpowiedzieć na polecenie, którego model bazowy odmawia. Wynik zależy od modelu i polecenia.",
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
      "Metoda pokazuje, co zmienił twórca. Porównanie poniżej pomoże ci sprawdzić, co to oznacza w twoich zadaniach.",
    sources: {
      paper:
        "Publikacja: Refusal in language models is mediated by a single direction (arXiv)",
      blog: "Abliteracja krok po kroku (blog Hugging Face)",
    },
  },
  ours: {
    title: "Inne modele bez cenzury",
    intro:
      "Pozostałe modele bez cenzury w {{appName}} grupujemy według metody opisanej przez dostawcę. Jeśli dostawca jej nie ujawnił, zostawiamy ją jako nieznaną.",
    abliterated: {
      title: "Dostępne modele abliterowane ({{count}})",
      body: "Do kodu i analiz sprawdź obsługę narzędzi. Do długich rozmów i opowiadań porównaj rozmiary okien kontekstu.",
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
    title: "Modele bazowe i wersje bez cenzury",
    intro:
      "Porównaj modele bazowe z wersjami bez cenzury. Sprawdź metodę, okno kontekstu i szacowany koszt jednej wiadomości.",
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
        body: "Wypróbuj nieszkodliwe polecenie, przy którym model bazowy się waha, na przykład prośbę o mroczną scenę fikcyjną. Porównaj, jak wprost odpowiadają modele. Pojedyncza odpowiedź niewiele mówi o zastosowanej metodzie.",
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
      a: "Model abliterowany to istniejący model językowy, którego wagi zmieniono, by rzadziej odmawiał odpowiedzi.",
    },
    difference: {
      q: "Czym różni się model abliterowany od modelu bez cenzury?",
      a: "Bez cenzury to zachowanie: model odpowiada. Abliteracja to jeden ze sposobów, żeby do tego dojść. Inne to fine-tune usuwający cenzurę albo trening na innym materiale, jak w przypadku {{ownName}}. Na {{appName}} {{abliteratedCount}} modeli bez cenzury jest abliterowanych, a {{fineTunedCount}} fine-tunowanych.",
    },
    identify: {
      q: "Jak rozpoznać abliterowany model AI?",
      a: "Sprawdź kartę modelu lub informacje o wydaniu. W katalogu {{appName}} oznaczenie modeli abliterowanych opiera się na dokumentacji dostawcy.",
    },
    worse: {
      q: "Czy abliteracja może zmienić jakość modelu?",
      a: "Tak. Zmiana wag może wpływać na trafność, styl i inne zdolności modelu. Porównaj konkretną wersję z modelem bazowym na tym samym zadaniu.",
    },
    truly: {
      q: "Czy {{ownName}} jest modelem abliterowanym?",
      a: "{{ownName}} jest w osobnej grupie. Twórca opisuje go jako model trenowany na innych materiałach, by przedstawiał inną perspektywę. Modele abliterowane na tej stronie to wersje istniejących modeli zmodyfikowane tak, by rzadziej odmawiały odpowiedzi.",
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
