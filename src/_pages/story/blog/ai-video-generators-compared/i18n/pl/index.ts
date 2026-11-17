import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "Najlepszy generator wideo AI: Kling vs Seedance, Veo, Sora | {{appName}}",
    description:
      "Porównanie {{modelCount}} generatorów wideo AI: Kling vs Seedance, Veo 3.1 vs Sora 2, Wan 3.0, Hailuo. Tekst i obraz na wideo, realne ceny, bez znaku wodnego.",
    category: "Porównanie modeli",
    imageAlt: "{{appName}}: generatory wideo AI porównane obok siebie",
    keywords:
      "najlepszy generator wideo AI, generator wideo AI, generator filmów AI, best AI video generator, Kling vs Seedance, Seedance 2.0, Seedance 2.5, Kling 3.0, Veo 3.1 vs Sora 2, Veo 3.1, Sora 2, Wan 3.0, Hailuo 3, Grok Imagine wideo, Gemini Omni, Runway Gen-4.5, zdjęcie na wideo AI, obraz na wideo AI, tekst na wideo AI, image to video AI, wideo AI bez znaku wodnego, cena wideo AI za sekundę, {{appName}}",
  },
  hero: {
    backToBlog: "Wróć do bloga",
    category: "Porównanie modeli",
    readTime: "10 min czytania",
    title: "Porównanie {{modelCount}} generatorów wideo AI. Jedno saldo.",
    subtitle:
      "Kling vs Seedance, Veo vs Sora, Wan, Hailuo, Grok Imagine i Gemini Omni. Prawdziwa cena za sekundę, prawdziwe długości klipów, kontrola klatek i dźwięk. Wybierz model pod ujęcie i zrób je z dowolnego czatu na {{appName}}.",
  },
  intro: {
    lead: "Każde laboratorium nazywa swój model najlepszym generatorem wideo AI. Każde chce osobnej aplikacji, osobnych kredytów, osobnej subskrypcji. A ty chcesz jednego: właściwego klipu do zadania, w cenie, którą znasz, zanim klikniesz Generuj.",
    p2: "{{appName}} daje ci modele wideo z {{labCount}} laboratoriów na jednym saldzie kredytów, łącznie: {{modelCount}}. Veo, Sora, Kling, Seedance, Wan, Hailuo, Grok Imagine, Gemini Omni, Runway i inne. Niżej wszystkie obok siebie, prosto z naszego rejestru modeli na żywo: wejścia, kontrola klatek, długość, rozdzielczość, dźwięk i prawdziwa cena za sekundę. Potem wybór pod konkretne zadania, pojedynki, jak zrobić klip z dowolnego czatu i ograniczenia, o których nikt nie pisze na stronie głównej.",
  },
  table: {
    title: "Wszystkie modele wideo ({{modelCount}}) obok siebie",
    intro:
      "Każdy aktualny model z {{labCount}} laboratoriów, od najtańszego za sekundę. Ceny zawierają naszą marżę {{markup}}%. 1 kredyt = {{creditValue}}.",
    colModel: "Model",
    colInput: "Wejście",
    colFrames: "Klatki",
    colLength: "Długość",
    colResolution: "Rozdzielczość",
    colAudio: "Dźwięk",
    colRate: "Kredyty / s",
    colClip: "Klip z czatu",
    i2v: "Tekst lub obraz",
    t2v: "Tekst",
    v2v: "Tekst i wideo",
    videoAudio: "Wideo i dźwięk",
    framesFirst: "Pierwsza klatka",
    framesFirstLast: "Pierwsza i ostatnia klatka",
    framesNone: "Bez kontroli klatek",
    secondsFixed: "{{max}} s",
    seconds: "od {{min}} do {{max}} s",
    resolutionDefault: "Domyślna dostawcy",
    audioYes: "Natywny dźwięk",
    audioNo: "Bez dźwięku",
    withImage: "Z obrazem: {{credits}}",
    clipValue: "kredyty: {{credits}}, {{seconds}} s",
    footnote:
      'Kredyty / s to stawka przy domyślnej rozdzielczości modelu. Tam, gdzie rozdzielczość zmienia cenę, mała linijka pokazuje każdą stawkę. "Z obrazem" to stawka, gdy dołączony obraz przenosi zadanie na trasę obrazową tego samego modelu. Klip z czatu to koszt jednego zapytania z czatu: prośba o {{seconds}} s, zaokrąglona do najbliższej długości, którą obsługuje model.',
    allModels: "Zobacz wszystkie modele z pełną specyfikacją",
  },
  picks: {
    title: "Najlepszy generator wideo AI do każdego zadania",
    intro:
      "Jednego najlepszego nie ma. Jest najlepiej dopasowany do ujęcia. Sześć zadań, modele do nich i twarde fakty pod każdym.",
    factLine:
      "{{rate}} kr./s · do {{max}} s · {{resolution}} · {{audio}} · {{frames}}",
    quality: {
      title: "Najwyższa jakość: ujęcie finalne",
      body: "Gdy klip jest produktem końcowym. Filmowy realizm, wiarygodna fizyka, dopracowanie. Te modele są na górze cennika, więc najpierw dopracuj prompt na tanim modelu, a dopiero potem renderuj tutaj.",
    },
    budget: {
      title: "Najtaniej: szkice i duże ilości",
      body: "Testuj prompty, dopracowuj ruch, zasilaj social media seriami. Mniej detali, dużo mniejszy rachunek. Tu powinna trafiać większość twoich prób.",
    },
    long: {
      title: "Najdłuższe klipy: jedno ciągłe ujęcie",
      body: "Do {{longestSeconds}} sekund w jednym klipie. Mniej cięć, mniej widocznych szwów. Długość ustawiasz na stronie narzędzia; zapytanie z czatu prosi o {{seconds}} s.",
    },
    frames: {
      title: "Kontrola pierwszej i ostatniej klatki",
      body: "Podajesz pierwszą i ostatnią klatkę, a model wypełnia ruch pomiędzy. Przejścia, odsłony produktu, czyste pętle. Modele z obsługą ostatniej klatki: {{lastFrameCount}}.",
    },
    audio: {
      title: "Natywny dźwięk w tym samym przebiegu",
      body: "Obraz i dźwięk w jednej generacji: tło, efekty, a w niektórych modelach dialog. Bez osobnego kroku audio, bez ręcznej synchronizacji. Modele z natywnym dźwiękiem: {{audioCount}}.",
    },
    editing: {
      title: "Specjaliści: awatary, lip sync, edycja",
      body: "Nie do nowych scen z promptu. Omnihuman 1.5 ożywia osobę z jednego zdjęcia i ścieżki audio. Lipsync 2 dopasowuje ruch ust w istniejącym nagraniu do nowego głosu. Gen4 Aleph edytuje istniejące nagranie: dodaje lub usuwa obiekty, zmienia styl, światło i kąt kamery.",
    },
  },
  versus: {
    title: "Pojedynki: porównania, których szukasz",
    intro:
      "Cztery porównania, które wracają ciągle. Do czego jest zbudowany każdy model i kiedy wybrać który.",
    pairTitle: "{{a}} vs {{b}}",
    klingSeedance:
      "{{a}} to najlepsza relacja ceny do jakości w linii Kling 3: żywy, przekonujący ruch, natywny dźwięk, pierwsza i ostatnia klatka, klipy do {{aMax}} sekund. Haczyk: sufit to 720p. {{b}} sięga do 4K i przyjmuje materiały referencyjne, które utrzymują powracające postacie spójne między ujęciami. Stawka za sekundę: {{aRate}} kr. dla {{a}}, {{bRate}} kr. dla {{b}}. Szkice i klipy do social mediów: {{a}}. Sceny fabularne z tą samą postacią ujęcie po ujęciu: {{b}}.",
    veoSora:
      "{{a}} to flagowiec Google: filmowy realizm, natywny dźwięk z dialogami i efektami, pierwsza i ostatnia klatka, obraz jako ujęcie otwierające, do 4K. {{b}} pochodzi od OpenAI i słynie z wiarygodnej fizyki. Na tej platformie przyjmuje tylko tekst i tylko format poziomy. Maksymalna długość: {{aMax}} s dla {{a}}, {{bMax}} s dla {{b}}. Stawka za sekundę: {{aRate}} kr. kontra {{bRate}} kr. Potrzebujesz dźwięku albo obrazu startowego: {{a}}. Czysty prompt tekstowy, dłuższe ujęcie: {{b}}.",
    hailuoWan:
      "{{a}} stawia na ostrość: obraz 2K, natywny dźwięk, pierwsza i ostatnia klatka, klipy do {{aMax}} sekund. {{b}} stawia na długość: do {{bMax}} sekund w jednym ujęciu, natywny dźwięk, kontrola klatek, od 480p do 1080p, do tego tani poziom 480p na szkice. Stawka za sekundę: {{aRate}} kr. dla {{a}}, {{bRate}} kr. dla {{b}}. Ostre, krótkie ujęcia: {{a}}. Długie ujęcia przy małym budżecie: {{b}}.",
    grokGemini:
      "{{a}} pochodzi od xAI: od 480p do 1080p, opcjonalna pierwsza klatka, bez dźwięku, klipy do {{aMax}} sekund. {{b}} pochodzi od Google: natywny dźwięk, pierwsza i ostatnia klatka, od 360p do 4K, klipy do {{bMax}} sekund. Stawka za sekundę: {{aRate}} kr. kontra {{bRate}} kr. Dźwięk i kontrola klatek: {{b}}. Szybkie nieme klipy o dowolnej długości, już od sekundy: {{a}}.",
    verdict:
      "Żaden model nie wygrywa każdego zadania. Zacznij tanio: {{cheapestName}} kosztuje {{minRate}} kr. za sekundę. Potrzebujesz dźwięku? Modele z natywnym dźwiękiem: {{audioCount}}. Chcesz ustalić zakończenie? Modele z ostatnią klatką: {{lastFrameCount}}. Za premium płać tylko przy renderze, który zostaje.",
  },
  chat: {
    title: "Zrób wideo w dowolnym czacie",
    intro:
      "Bez osobnej aplikacji, bez nowego konta. Napisz w dowolnym czacie na {{appName}}, a AI samo wywoła generator wideo.",
    steps: {
      ask: {
        title: "Opisz ujęcie",
        body: 'Obiekt, ruch, kamera, nastrój. Zwykłymi słowami. "Lis biegnie przez świeży śnieg o świcie, niska jazda kamery." AI zamienia to w zlecenie generacji.',
      },
      model: {
        title: "Model domyślny albo twój wybór",
        body: 'Model wybiera ustawienie wideo w twoim skillu, czyli {{defaultModel}}, dopóki tego nie zmienisz. Chcesz inny? Napisz to w prompcie: "użyj Kling 3.0". AI przekaże dokładnie ten model.',
      },
      image: {
        title: "Dołącz obraz, żeby go ożywić",
        body: "Wrzuć zdjęcie, a stanie się pierwszą klatką. To właśnie obraz na wideo. Jeśli twój model nie przyjmuje obrazów, zadanie przechodzi na trasę obrazową tego samego modelu albo na najtańszy model, który obrazy przyjmuje.",
      },
      lastFrame: {
        title: "Ustal ostatnią klatkę",
        body: "Dołącz drugi obraz i napisz, że to zakończenie. Model animuje od jednego do drugiego. Działa w modelach z obsługą ostatniej klatki (obecnie: {{lastFrameCount}}), a obie klatki muszą być obrazami. Możesz też dodać obrazy, audio albo wideo jako referencje, które prowadzą wygląd.",
      },
      result: {
        title: "Oglądaj i zachowaj",
        body: "Klip odtwarza się od razu w czacie i trafia do twojego własnego magazynu. Czaty incognito wiążą go z twoją sesją przeglądarki. Licz się z czasem od około minuty do kilku minut na klip.",
      },
    },
    toolPage:
      "Jeden kompromis. W czacie AI nie ustawi długości, rozdzielczości ani proporcji obrazu: każdy klip z czatu prosi o {{seconds}} s w domyślnej rozdzielczości modelu. Potrzebujesz pełnej kontroli? Na stronie narzędzia ustawiasz model, czas trwania, proporcje, rozdzielczość, pierwszą i ostatnią klatkę oraz prompt negatywny.",
    toolLink: "Otwórz generator wideo",
  },
  pricing: {
    title: "Ile kosztuje tu wideo AI",
    intro:
      "Kredyty za sekundę razy liczba sekund. Cały wzór. Jedno saldo płaci za każdy model.",
    perSecond:
      "Każdy model ma stawkę za sekundę: cena dostawcy plus nasza marża {{markup}}%, zaokrąglona w górę do jednej dziesiątej kredytu. 1 kredyt = {{creditValue}}.",
    cheapest:
      "Najtańszy klip z czatu teraz: {{cheapestClipName}}, kredyty: {{cheapestClipCredits}} ({{cheapestClipPrice}}). Najniższa stawka: {{cheapestName}}, {{minRate}} kr. za sekundę.",
    priciest:
      "Najdroższy klip z czatu: {{priciestClipName}}, kredyty: {{priciestClipCredits}} ({{priciestClipPrice}}). Najwyższa stawka: {{priciestName}}, {{maxRate}} kr. za sekundę.",
    resolution:
      "Wyższa rozdzielczość kosztuje więcej za sekundę w modelach, które liczą cenę według rozdzielczości. Te stawki są w tabeli.",
    failed:
      "Kredyty schodzą dopiero po dostarczeniu klipu. Nieudane zadanie, odrzucony prompt, przekroczony czas: nie płacisz nic.",
    reported:
      "Trasy obsługiwane przez OpenRouter rozliczają realny koszt zgłoszony przez dostawcę plus marżę, więc końcowa kwota może się lekko różnić od tabeli.",
    sub: "Plany miesięczne: cztery rozmiary, od {{subCredits}} kredytów za {{subPrice}}.",
    pack: "Pakiety kredytów: doładowanie dla subskrybentów, {{packCredits}} kredytów za {{packPrice}}. Nigdy nie wygasają. Karta, PayPal albo krypto.",
    link: "Zobacz plany i pakiety kredytów",
  },
  watermark: {
    title: "Wideo AI bez znaku wodnego",
    intro:
      "{{appName}} niczego nie stempluje na twoim klipie. Dostajesz surowy plik.",
    ours: "Żadnego znaku wodnego, logo ani nakładki od nas. Pobierasz wideo dokładnie tak, jak dostarczył je model.",
    provenance:
      "Niektóre laboratoria same osadzają niewidoczne znaczniki pochodzenia albo metadane. Google dodaje SynthID do materiałów ze swoich modeli wideo. OpenAI dołącza metadane C2PA do klipów z Sory. To robota laboratorium, nie nasza.",
    storage:
      "Każdy klip trafia do twojego własnego magazynu. W czatach incognito należy do twojej sesji przeglądarki.",
  },
  limits: {
    title: "Ograniczenia bez owijania w bawełnę",
    intro:
      "Wideo to najtrudniejsza dyscyplina generatywnej AI. Poznaj granice, zanim wydasz kredyty.",
    time: "Klip powstaje od około minuty do kilku minut. Długie zadania mogą przekroczyć limit czasu, a to nic nie kosztuje.",
    cost: "Wideo to najdroższy typ mediów na {{appName}}. Szkicuj na tanim modelu, finalną wersję renderuj na modelu premium.",
    filters:
      "Każdy model wideo tutaj pochodzi z laboratorium głównego nurtu i działa za moderacją swojego dostawcy. Treści seksualne wprost, prawdziwe osoby publiczne, nieletni albo drastyczna przemoc mogą zostać odrzucone już u dostawcy. To odmowa dostawcy, nie nasza, i nic cię nie kosztuje.",
    chatControls:
      "W czacie długość, rozdzielczość i proporcje zostają domyślne. Strona narzędzia odblokowuje je wszystkie.",
    snap: "Każdy model obsługuje własny zestaw długości. Zapytanie przeskakuje do najbliższej, więc część klipów z czatu jest odrobinę krótsza lub dłuższa niż {{seconds}} s.",
    legacy:
      "Starsze modele ({{legacyCount}}) nie trafiły do tej tabeli. Wciąż są na pełnej liście modeli.",
    callout:
      "Brak cenzury to nasza obietnica dla modeli czatu. Wideo działa na modelach głównego nurtu z filtrami ich dostawców. Żaden z nich nie generuje treści dosłownych.",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "Jaki jest najlepszy generator wideo AI?",
      a: "Ten, który pasuje do ujęcia. Filmowy realizm z dźwiękiem: Veo 3.1. Długie, ciągłe ujęcia: Wan 3.0 albo Seedance 2.5. Spójne postacie w wielu scenach: Seedance 2.0. Tanie szkice: {{cheapestName}}. Mówiąca osoba z jednego zdjęcia: Omnihuman 1.5. Wszystkie modele ({{modelCount}}) działają na jednym saldzie {{appName}}, więc zmieniasz je przy każdym klipie.",
    },
    klingVsSeedance: {
      q: "Kling vs Seedance: który jest lepszy?",
      a: "Do innych zadań. Kling 3.0 Std to najlepsza relacja ceny do jakości: żywy ruch, natywny dźwięk, kontrola klatek, ale maksymalnie 720p. Seedance 2.0 kosztuje więcej za sekundę, sięga do 4K i przyjmuje materiały referencyjne, które trzymają postać spójną z ujęcia na ujęcie. Szkicuj na Klingu, sceny fabularne kończ na Seedance.",
    },
    imageToVideo: {
      q: "Jak zamienić zdjęcie w wideo za pomocą AI?",
      a: "Dołącz zdjęcie w dowolnym czacie i opisz ruch. Stanie się pierwszą klatką. Modele przyjmujące obraz bezpośrednio: {{i2vCount}} z {{modelCount}}. Jeśli twój tego nie potrafi, zadanie przechodzi na trasę, która obsługuje obrazy. W modelach, które to wspierają, drugim zdjęciem ustalasz ostatnią klatkę.",
    },
    watermark: {
      q: "Czy jest generator wideo AI bez znaku wodnego?",
      a: "Tak. {{appName}} nie dodaje znaku wodnego, logo ani nakładki. Pobierasz surowy plik. Niektóre laboratoria same osadzają niewidoczne znaczniki: Google SynthID w swoich modelach wideo, OpenAI metadane C2PA w klipach z Sory.",
    },
    cost: {
      q: "Ile kosztuje generowanie wideo AI?",
      a: "Obecnie od {{cheapestClipPrice}} do {{priciestClipPrice}} za klip z czatu, zależnie od modelu. Każdy model ma stawkę za sekundę: cena dostawcy plus marża {{markup}}%. 1 kredyt = {{creditValue}}. Nieudane zadania nic nie kosztują.",
    },
    free: {
      q: "Czy mogę robić wideo AI za darmo?",
      a: "Nowe konta dostają darmowe kredyty. Wideo to jedna z najdroższych rzeczy do wygenerowania, więc starczą najwyżej na kilka klipów. Najtańszy klip teraz: {{cheapestClipName}}, kredyty: {{cheapestClipCredits}}. Potem: plan, od {{subPrice}} miesięcznie.",
    },
    length: {
      q: "Jak długie może być wideo AI?",
      a: "Do {{longestSeconds}} sekund w jednym klipie, w modelu {{longestName}}. Większość modeli kończy dużo wcześniej. Zapytanie z czatu prosi o {{seconds}} s; dłuższy czas ustawisz na stronie narzędzia.",
    },
    uncensored: {
      q: "Czy jest generator wideo AI bez cenzury?",
      a: "Nie tutaj i nie będziemy udawać, że jest. Każdy model wideo na {{appName}} pochodzi z laboratorium głównego nurtu i działa za filtrami swojego dostawcy. Żaden z nich nie generuje treści dosłownych. Nasze modele bez cenzury to modele czatu.",
    },
    modelsLink: "Przeglądaj wszystkie modele ze specyfikacją i cenami",
    pricingLink: "Zobacz plany i ceny",
  },
  partners: {
    body: "Tworzysz treści o wideo AI? Program partnerski {{appName}} płaci ci stały udział w każdej płatności, którą polecisz.",
    link: "Dołącz do programu partnerskiego",
  },
  cta: {
    title: "Wybierz model. Nakręć ujęcie.",
    subtitle:
      "Pełna kontrola na stronie narzędzia: model, długość, proporcje, rozdzielczość, klatki. Albo po prostu napisz w dowolnym czacie na {{appName}}.",
    generate: "Wygeneruj wideo",
    models: "Przeglądaj wszystkie modele",
  },
};
