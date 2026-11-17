import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Generator obrazów AI bez cenzury, cena za obraz | {{appName}}",
    description:
      "Generatory obrazów AI bez cenzury obok Flux, Seedream, GPT Image i Recraft. Porównanie {{modelCount}} modeli, prawdziwa cena za obraz, zero rozmycia. Także edycja zdjęć.",
    category: "Porównanie modeli",
    imageAlt: "{{appName}}: generatory obrazów AI bez cenzury w porównaniu",
    keywords:
      "generator obrazów AI bez cenzury, generator obrazów AI bez ograniczeń, generator obrazów AI bez filtrów, generator zdjęć AI bez cenzury, generator obrazów AI NSFW, edycja zdjęć AI bez filtra, uncensored AI image generator, Chroma, Lustify, Qwen Edit Uncensored, FLUX.3, Seedream 5.5, GPT Image, Recraft, cena za obraz AI, najtańszy generator obrazów AI, {{appName}}",
  },
  hero: {
    backToBlog: "Wróć do bloga",
    category: "Porównanie modeli",
    readTime: "8 min czytania",
    title: "Generatory obrazów AI bez cenzury. Prawdziwe ceny, zero rozmycia.",
    subtitle:
      "Modele obrazu z {{labCount}} laboratoriów na jednym saldzie. Łącznie: {{modelCount}}, bez cenzury: {{uncensoredCount}}. Co potrafi każdy, ile kosztuje jeden obraz i gdzie kończą się jego możliwości.",
  },
  intro: {
    lead: "Zwykły prompt. Obraz wraca rozmyty, przycięty albo wcale. Studium aktu, okładka horroru, scena z twojej własnej powieści. Popularne generatory obrazów filtrują pod najbardziej ostrożnego użytkownika na świecie, a ty płacisz za to co miesiąc.",
    p2: "{{appName}} daje ci modele obrazu z {{labCount}} laboratoriów na jednym saldzie kredytów. Łącznie: {{modelCount}}, w tym bez cenzury: {{uncensoredCount}}. Poniżej: które modele naprawdę generują bez filtra, wszystkie modele obok siebie z poziomem filtra i prawdziwą ceną za obraz, najlepszy wybór do każdego zadania i jak tworzyć lub edytować obrazy prosto z czatu.",
  },
  exists: {
    title: "Czy istnieje generator obrazów AI bez cenzury?",
    intro:
      "Tak. Modele bez cenzury działające tutaj: {{uncensoredCount}}, dostarczane przez Venice.ai, bez rozmycia i bez odmów. Dwa tworzą obrazy z tekstu, dwa edytują obraz, który im dasz.",
    models: {
      lustify:
        "Fotorealistyczne obrazy dla dorosłych. Stworzony do ciał i skóry. Słaby w tekście na obrazie i złożonych scenach.",
      chroma:
        "Otwarte wagi, dotrenowany bez filtrowania treści. Długie prompty, szeroka gama stylów, treści dosłowne też.",
      qwenEdit:
        "Edycja bez cenzury. Daj mu obraz i polecenie: zmień strój, styl, przebuduj scenę.",
      fireRed:
        "Precyzyjna edycja. Zmienia dokładnie to, co opiszesz, resztę obrazu zostawia w spokoju.",
      other:
        "Model obrazu bez cenzury. Na stronie modelu sprawdzisz, w czym jest najlepszy.",
    },
    consent:
      "Modele bez cenzury są dla dorosłych. Za pierwszym razem potwierdzasz, że masz ukończone 18 lat. Raz. Potem to ty decydujesz, co tworzysz, a nie korporacja.",
  },
  levels: {
    title: "Co oznaczają poziomy filtra przy obrazach",
    intro: "Każdy model obrazu ma jeden z trzech poziomów.",
    mainstream:
      "Mainstream (modele: {{mainstreamCount}}): OpenAI i Recraft. Ostre filtry. Świetne do tekstu i projektowania, bezużyteczne przy wszystkim, co zatrzymałby dział zgodności.",
    open: "Otwarte (modele: {{openCount}}): FLUX, Seedream, Qwen, Grok Imagine, Wan i inne. Łagodniejsze filtry, dobre do mrocznej sztuki i dojrzałych tematów, ale nie do treści dosłownych.",
    uncensored:
      "Bez cenzury (modele: {{uncensoredCount}}): żadnego filtra z naszej strony, żadnej odmowy u dostawcy. Treści dosłowne w modelach, które do tego stworzono.",
    p1: "Poziom wybierasz dla każdego obrazu, nie dla konta. Czyste zdjęcie produktu? Model otwarty. Scena, której naprawdę potrzebuje twoja historia? Model bez cenzury. To samo saldo, ten sam czat.",
  },
  table: {
    title: "Wszystkie modele obrazu ({{modelCount}}) obok siebie",
    intro:
      "Najpierw bez cenzury, potem otwarte, potem mainstream. W każdym poziomie od najtańszego. Ceny zawierają naszą marżę {{markup}}%. 1 kredyt = {{creditValue}}.",
    colModel: "Model",
    colFilter: "Poziom filtra",
    colInput: "Wejście",
    colCredits: "Kredyty / obraz",
    colPrice: "Cena / obraz",
    inputText: "Tekst",
    inputEdit: "Tekst lub obraz",
    perUnit: "obrazy za {{unit}}: {{perUnit}}",
    footnote:
      "„Tekst lub obraz” oznacza, że model przyjmuje obraz referencyjny: edycja, obraz na obraz, spójne postacie. Cena dotyczy domyślnego rozmiaru, kilka modeli liczy więcej za większe formaty. Modele rozliczane za tokeny, a nie za obraz, znajdziesz na pełnej liście modeli.",
    allModels: "Zobacz wszystkie modele z pełną specyfikacją",
  },
  picks: {
    title: "Najlepszy generator obrazów AI do każdego zadania",
    intro:
      "Żaden model nie wygrywa wszędzie. Sześć zadań, pasujące modele i twarde fakty o każdym.",
    factLine:
      "kredyty: {{credits}} ({{price}}) · obrazy za {{unit}}: {{perUnit}} · {{tier}} · {{input}}",
    uncensored: {
      title: "Bez filtra: dosłownie i bez tabu",
      body: "Z tekstu, nic rozmytego. Chroma do różnorodności: ilustracja, malarstwo, fantasy, długie szczegółowe prompty. Lustify do fotorealistycznych ciał. Oba należą do najtańszych modeli na platformie.",
    },
    uncensoredEdit: {
      title: "Bez filtra: edytuj własny obraz",
      body: "Wgraj obraz, opisz zmianę. Qwen Edit Uncensored to ten oznaczony do treści dosłownych. FireRed jest precyzyjniejszy. Przy trudnej edycji wypróbuj oba.",
    },
    cheap: {
      title: "Najtaniej: szkice i duże ilości",
      body: "Miniatury, moodboardy, test promptu przed właściwym renderem. {{cheapestName}}: kredyty za obraz: {{cheapestCredits}}, obrazy za {{unit}}: {{cheapestPerUnit}}.",
    },
    quality: {
      title: "Najwięcej detali: finalny render",
      body: "Kiedy obraz jest gotowym produktem. Ostrzejsze detale, wierniejsze trzymanie się promptu. Szkic na tanim modelu, finał tutaj.",
    },
    text: {
      title: "Tekst na obrazie: plakaty, logo, reklamy",
      body: "Większość modeli kaleczy litery. Te nie. Recraft jest stworzony do projektowania. GPT Image trzyma w ryzach gęste układy. Qwen Image 3 Pro to opcja otwarta. Wszystkie są filtrowane.",
    },
    references: {
      title: "Obrazy referencyjne i spójne postacie",
      body: "Ta sama twarz, ten sam produkt, obraz po obrazie. Te modele przyjmują jeden lub więcej obrazów referencyjnych. Modele, które przyjmują tu obraz na wejściu: {{editCount}}.",
    },
  },
  chat: {
    title: "Twórz obrazy w dowolnym czacie",
    intro:
      "Bez osobnej aplikacji. Poproś w dowolnym czacie na {{appName}}, a AI samo uruchomi generator obrazów.",
    steps: {
      ask: {
        title: "Opisz obraz",
        body: "Temat, styl, światło, kadr. Zwykłymi słowami. Prompt do generowania napisze AI.",
      },
      model: {
        title: "Zostaw domyślny model albo wskaż inny",
        body: "Ustawienie obrazu w twoim skillu wybiera model: {{defaultModel}}, dopóki tego nie zmienisz. Chcesz inny? Napisz: „użyj FLUX.3”.",
      },
      edit: {
        title: "Dołącz obraz, żeby go edytować",
        body: "Wrzuć obraz i napisz, co ma się zmienić. Potrzebny jest model, który przyjmuje obrazy, np. Qwen Edit Uncensored albo Seedream. Modele tylko tekstowe nie widzą twojego obrazu.",
      },
      result: {
        title: "Zobacz, zachowaj",
        body: "Obraz pojawia się w czacie po kilku sekundach i zapisuje w twoim miejscu na pliki. Pisz dalej, żeby go dopracować.",
      },
    },
    toolPage:
      "Chcesz pełnej kontroli? Na stronie generatora obrazów ustawisz bezpośrednio model, rozmiar, proporcje i jakość.",
    toolLink: "Otwórz generator obrazów",
    roleplayLink:
      "Grafiki postaci do twojego roleplayu: poradnik roleplayu AI bez filtra",
  },
  pricing: {
    title: "Ile kosztuje tu obraz AI",
    intro: "Kredyty za obraz. Jedno saldo na wszystkie modele.",
    perImage:
      "Każdy model ma cenę za obraz: cena dostawcy plus nasza marża {{markup}}%, zaokrąglona w górę do dziesiątej części kredytu. 1 kredyt = {{creditValue}}.",
    range:
      "Teraz najtańszy: {{cheapestName}} za {{cheapestPrice}}. Najtańszy bez cenzury: {{uncensoredName}} za {{uncensoredPrice}}. Najdroższy: {{priciestName}} za {{priciestPrice}}.",
    failed:
      "Kredyty schodzą dopiero po dostarczeniu obrazu. Nieudane zadanie albo odmowa dostawcy: nie płacisz nic.",
    free: "Za darmo co miesiąc: kredyty bez konta: {{guestCredits}}, z darmowym kontem: {{freeCredits}}. Na {{uncensoredName}} wystarczy to na tyle obrazów miesięcznie: {{freeUncensoredImages}}, bez płacenia.",
    sub: "Plany miesięczne: cztery rozmiary, od {{subCredits}} kredytów za {{subPrice}}.",
    pack: "Pakiety kredytów: doładowanie dla subskrybentów, {{packCredits}} kredytów za {{packPrice}}. Nigdy nie wygasają. Karta, PayPal albo krypto.",
    link: "Zobacz plany i pakiety kredytów",
  },
  limits: {
    title: "Ograniczenia, bez owijania",
    intro: "Poznaj słabe strony, zanim wydasz kredyty.",
    textOnly:
      "Oba generatory bez cenzury przyjmują tylko tekst. Żeby bez filtra zmienić istniejący obraz, przełącz się na model edycji bez cenzury.",
    specialists:
      "Modele bez cenzury to specjaliści. Do typografii, logo i czystych zdjęć produktów lepsze są modele otwarte i mainstream.",
    upstream:
      "Modele otwarte i mainstream działają za moderacją swoich dostawców. Odmowa nic nie kosztuje. Zamiast przeformułowywać prompt, zmień model na taki bez cenzury.",
    video:
      "Z wideo jest inaczej. Każdy model wideo pochodzi tu od dużego laboratorium, z filtrami dostawcy. Bez cenzury kończy się na obrazach statycznych.",
    law: "Brak filtra to brak siatki asekuracyjnej. Za to, co tworzysz i publikujesz, odpowiadasz ty, a prawo twojego kraju nadal obowiązuje. Seksualne obrazy nieletnich są nielegalne wszędzie. W wielu krajach także seksualne obrazy prawdziwej osoby stworzone bez jej zgody.",
    callout:
      "Dorośli sami decydują, na co patrzą. My dajemy narzędzia i fakty, nie kazania.",
  },
  faq: {
    title: "FAQ",
    exists: {
      q: "Czy jest generator obrazów AI bez ograniczeń?",
      a: "Tak. {{appName}} ma modele obrazu bez cenzury (obecnie: {{uncensoredCount}}): Chroma i Lustify tworzą z tekstu, Qwen Edit Uncensored i FireRed edytują twoje własne obrazy. Bez rozmycia, bez odmów. Odblokowuje je jednorazowe potwierdzenie pełnoletności.",
    },
    free: {
      q: "Czy jest darmowy generator obrazów AI bez cenzury?",
      a: "Zaczniesz za darmo. Kredyty co miesiąc bez konta: {{guestCredits}}, z darmowym kontem: {{freeCredits}}. {{uncensoredName}} kosztuje za obraz tyle kredytów: {{uncensoredCredits}}. Potem: plan, od {{subPrice}} miesięcznie.",
    },
    cheapest: {
      q: "Jaki generator obrazów AI jest najtańszy?",
      a: "Teraz {{cheapestName}}: kredyty za obraz: {{cheapestCredits}} ({{cheapestPrice}}). Ceny wszystkich {{modelCount}} modeli są w tabeli powyżej, na żywo z naszego rejestru modeli.",
    },
    edit: {
      q: "Czy mogę edytować zdjęcie bez filtra?",
      a: "Tak. Dołącz zdjęcie w czacie, opisz zmianę i wskaż Qwen Edit Uncensored albo FireRed. Otwarte i mainstreamowe modele edycji stosują filtry swoich dostawców.",
    },
    consent: {
      q: "Dlaczego muszę potwierdzić, że mam 18 lat?",
      a: "Modele bez cenzury mogą tworzyć treści dosłowne. Raz potwierdzasz, że jesteś pełnoletni, i tyle. Bez wysyłania dowodu, bez powtarzanych ostrzeżeń.",
    },
    watermark: {
      q: "Czy obrazy mają znak wodny?",
      a: "Nie od nas. Bez logo, bez nakładek. Niektóre laboratoria same osadzają niewidoczne dane o pochodzeniu, to pochodzi od nich.",
    },
    api: {
      q: "Czy mogę generować obrazy przez API?",
      a: "API {{appName}} obejmuje modele czatu w formatach OpenAI i Anthropic. Obrazy generujesz w czacie i na stronie generatora obrazów.",
    },
    videoLink: "Porównaj generatory wideo AI",
    chatLink: "Przeczytaj przewodnik po wszystkich modelach czatu bez cenzury",
  },
  partners: {
    body: "Prowadzisz kanał albo społeczność o sztuce AI? Program partnerski {{appName}} płaci ci stały udział w każdej płatności, którą polecisz.",
    link: "Zobacz program partnerski",
  },
  cta: {
    title: "Wybierz model. Stwórz obraz.",
    subtitle:
      "Darmowe kredyty co miesiąc, bez konta: {{guestCredits}}. Bez cenzury, otwarte albo mainstream, dla każdego obrazu osobno.",
    generate: "Wygeneruj obraz",
    models: "Przeglądaj wszystkie modele",
  },
};
