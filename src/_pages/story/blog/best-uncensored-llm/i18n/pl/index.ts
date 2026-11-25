import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Najlepszy nieocenzurowany LLM 2026: według zadania | {{appName}}",
    description:
      "Najlepszy nieocenzurowany LLM do analizy, kodu, mrocznej fikcji i niewygodnych poglądów. GLM 5.3 Uncensored kontra DeepSeek V4.1 Flash Uncensored, ceny na żywo.",
    category: "Przewodnik po modelach",
    imageAlt: "Najlepsze nieocenzurowane LLM-y według zadania",
    keywords:
      "najlepszy nieocenzurowany LLM, najlepsza AI bez cenzury, najlepszy nieocenzurowany model AI, najlepszy abliterowany model, nieocenzurowany LLM 2026, GLM uncensored vs DeepSeek uncensored, GLM 5.3 uncensored, DeepSeek V4.1 Flash uncensored, najlepszy nieocenzurowany model do roleplayu, najlepszy nieocenzurowany model do programowania, ranking nieocenzurowanych LLM, {{appName}}",
  },
  hero: {
    backToBlog: "Wróć do bloga",
    category: "Przewodnik po modelach",
    readTime: "8 min czytania",
    title: "Najlepszy nieocenzurowany LLM. Według zadania, nie według hype'u.",
    subtitle:
      "Jeden zwycięzca na każde zadanie spośród {{count}} działających nieocenzurowanych modeli, plus pojedynek GLM kontra DeepSeek. Kontekst i ceny prosto z naszego rejestru modeli.",
  },
  intro: {
    lead: "Każda lista „najlepszych nieocenzurowanych LLM-ów” koronuje jeden model. Potem testujesz go na swojej pracy i okazuje się, że to nie ten. Model, który dobrze pisze mroczną fikcję, to nie ten, którego chcesz do kodu. Najtańszy to nie ten, którego chcesz do trudnej dyskusji.",
    p2: "Dlatego ta lista wskazuje zwycięzcę na każde zadanie. Każdy wybór działa na {{appName}} w karcie przeglądarki, każda liczba pochodzi z naszego rejestru, a między modelami przełączasz się w tym samym czacie.",
  },
  method: {
    title: "Jak wybieraliśmy",
    intro:
      "Cztery pytania do każdego modelu. Zero zmyślonych wyników benchmarków.",
    answers:
      "Czy odpowiada? Każdy model tutaj należy do poziomu bez cenzury: bierze pytanie, zamiast prawić ci kazania.",
    base: "Jak mocna jest baza? Abliterowane flagowce zachowują inteligencję swojego laboratorium. Małe dostrojenia oddają jej część za styl.",
    context:
      "Ile pamięta? Kontekst decyduje, czy utrzyma długi dokument, czy zapomni pierwszą stronę.",
    price:
      "Ile kosztuje? Cena za referencyjną wiadomość, najtańszą publiczną trasą, z marżą.",
    callout:
      "Chcesz dowodu, że model odpowiada? Nasz indeks odmów zadaje każdemu modelowi te same pytania i liczy, kto odmawia.",
    refusalLink: "Indeks odmów: która AI naprawdę odpowiada",
  },
  picks: {
    title: "Zwycięzcy, zadanie po zadaniu",
    intro:
      "Jeden model na zadanie, żaden dwa razy. Jeśli któryś wypadnie, jego miejsce zajmuje następny model z tą samą mocną stroną.",
    facts:
      "Kontekst {{context}}. {{price}} za wiadomość. Mocna strona: {{strengths}}.",
    reasoning: {
      title: "{{number}}. Najlepszy do rozumowania i analizy: {{model}}",
      body: "Flagowy model bazowy z usuniętymi odmowami. Sięgnij po niego, gdy odpowiedź wymaga prawdziwego myślenia: sporne pytanie przemyślane do końca, długi dokument rozebrany na części, plan sprawdzony pod obciążeniem.",
    },
    everyday: {
      title: "{{number}}. Najlepszy na co dzień: {{model}}",
      body: "Szybki, tani i z ogromną pamięcią. Model, który zostawiasz wybrany do zwykłych pytań, szybkich szkiców i długich czatów, które na flagowcu kosztowałyby za dużo.",
    },
    coding: {
      title: "{{number}}. Najlepszy do programowania: {{model}}",
      body: "Oznaczony do kodu i rozumowania, bez odmów, które blokują badania bezpieczeństwa, scraping czy pytania o inżynierię wsteczną, przed którymi uciekają mainstreamowi asystenci.",
    },
    fiction: {
      title: "{{number}}. Najlepszy do roleplayu i mrocznej fikcji: {{model}}",
      body: "Dostrojony do roleplayu, także mrocznego. Trzyma się postaci, pisze brutalną albo dosadną scenę i nie przerywa historii, żeby moralizować.",
    },
    viewpoint: {
      title: "{{number}}. Najlepszy do przeciwnych poglądów: {{model}}",
      body: "Jedyny wybór tutaj, który nie jest odblokowanym modelem z głównego nurtu. Trenowany na książkach i dokumentach zakazanych w mainstreamowym internecie. Efekt to model z przeciwnymi poglądami politycznymi. Pytaj go o to, czego inne nie powiedzą, i sprawdzaj fakty.",
    },
    vision: {
      title: "{{number}}. Najlepszy do obrazów: {{model}}",
      body: "Czyta przesłane obrazy i odpowiada na ich temat bez zwykłych odmów. Na tyle tani, że przepuścisz przez niego każdy zrzut ekranu.",
    },
  },
  versus: {
    title: "{{a}} vs {{b}}",
    intro:
      "Dwa abliterowane flagowce, które ludzie porównują najczęściej. Ten sam pomysł, usunięte odmowy, różne mocne strony.",
    glm: "{{model}}: abliterowana wersja GLM-5.3. Wybierz ją, gdy odpowiedź wymaga głębi: rozumowania, analizy, kodu.",
    deepseek:
      "{{model}}: abliterowana wersja DeepSeek V4.1 Flash. Model Flash: tańszy za wiadomość, szybki, oznaczony też do roleplayu. Wybierz go do dużej liczby zapytań.",
    verdict:
      "W skrócie: myślenie do GLM, ilość i roleplay do DeepSeeka. Oba odpowiadają. Przełącz w trakcie czatu i porównaj na własnym pytaniu.",
    compareLink: "Pełne porównanie: {{a}} vs {{b}}",
  },
  all: {
    title: "Wszystkie {{count}} nieocenzurowane modele, od najtańszego",
    intro:
      "Cały poziom bez cenzury na {{appName}} w tej chwili. Kliknij model, żeby zobaczyć jego stronę, albo od razu zacznij z nim czat.",
    footnote:
      "Za wiadomość oznacza jedną referencyjną wymianę najtańszą trasą. Długie czaty i długie odpowiedzi kosztują więcej. Mocne strony to tagi z rejestru.",
  },
  table: {
    model: "Model",
    context: "Kontekst",
    strengths: "Mocna strona",
    price: "Za wiadomość",
    chat: "Wypróbuj",
    chatLink: "Rozmawiaj z {{model}}",
  },
  kinds: {
    title: "Dwa rodzaje braku cenzury. Wiedz, który wybierasz.",
    intro: "Za etykietą kryje się prawdziwa różnica.",
    abliterated:
      "Wersje abliterowane i dostrojone: modele z głównego nurtu albo otwarte, lekko zmienione, żeby przestały unikać pytań. Ten sam trening, ten sam światopogląd. Po prostu odpowiadają.",
    own: "{{ownModel}}: trenowany na książkach i dokumentach zakazanych w mainstreamowym internecie. Efekt to model z przeciwnymi poglądami politycznymi.",
    explainerLink: "Czym jest abliteracja i czym różni się od innych metod",
    tourLink: "Każdy nieocenzurowany model, jeden po drugim",
  },
  local: {
    title: "Lokalnie czy w hostingu?",
    intro:
      "Większość rankingów zakłada, że uruchamiasz model sam. To jedna z opcji.",
    local:
      "Lokalnie: pełna prywatność i brak ceny za wiadomość, ale duże modele potrzebują więcej pamięci GPU, niż ma jakikolwiek domowy komputer.",
    hosted:
      "W hostingu: każdy model z tej strony w przeglądarce, także te w rozmiarze frontier. Dostawca widzi twój prompt.",
    api: "API: te same modele przez endpointy zgodne z OpenAI i Anthropic. Klucze API odblokowuje każdy zakup.",
    noGpuLink: "Nieocenzurowany LLM online, bez GPU",
    apiLink: "API nieocenzurowanych LLM: identyfikatory, ceny, kod",
  },
  pairs: {
    title: "Więcej pojedynków",
    intro:
      "Własny światopogląd kontra abliteracja oraz modele bazowe kontra ich nieocenzurowane wersje.",
    link: "{{a}} vs {{b}}",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "Jaki jest najlepszy nieocenzurowany LLM ogólnie?",
      a: "Do większości trudnych pytań {{topModel}}: flagowy model bazowy z usuniętymi odmowami. Do przeciwnych poglądów {{ownModel}}. Do taniej, dużej ilości zapytań wersja Flash. Na {{appName}} przełączasz się między wszystkimi {{count}} w tym samym czacie.",
    },
    free: {
      q: "Jaki jest najlepszy darmowy nieocenzurowany LLM?",
      a: "Online {{appName}} daje ci {{guestCredits}} darmowych kredytów miesięcznie bez konta i {{freeCredits}} z darmowym kontem. Najtańszy nieocenzurowany model, {{cheapestModel}}, kosztuje {{cheapestPrice}} za wiadomość. Nieocenzurowane modele raz proszą o potwierdzenie 18+.",
    },
    roleplay: {
      q: "Jaki jest najlepszy nieocenzurowany model do roleplayu?",
      a: "Model dostrojony do mrocznego roleplayu: trzyma się postaci i pisze trudne sceny. Do postaci politycznych albo tabu {{ownModel}} wnosi światopogląd, którego nie mają modele z głównego nurtu.",
    },
    coding: {
      q: "Jaki jest najlepszy nieocenzurowany model do programowania?",
      a: "Abliterowana wersja mocnego modelu do kodu. Zachowuje umiejętności modelu bazowego i traci odmowy, które blokują badania bezpieczeństwa i inne pytania, przed którymi uciekają mainstreamowi asystenci.",
    },
    quality: {
      q: "Czy modele abliterowane tracą na jakości?",
      a: "Trochę, zależnie od metody. Abliteracja usuwa z wag kierunek odmowy. Dobrze zrobiona zostawia modelowi prawie wszystkie umiejętności. Małe dostrojenia mogą stracić więcej. Zanim zdecydujesz, porównaj model bazowy i jego nieocenzurowaną wersję obok siebie.",
    },
    api: {
      q: "Czy mogę używać tych nieocenzurowanych modeli przez API?",
      a: "Tak. Każdy model tekstowy tutaj działa przez endpointy zgodne z OpenAI i Anthropic. Klucze API odblokowuje każdy zakup.",
    },
    writerLink: "Najlepsza AI bez cenzury dla pisarzy",
    directoryLink: "Wszystkie abliterowane modele w hostingu",
    platformsLink: "Porównanie platform AI bez cenzury",
  },
  cta: {
    title: "Dość rankingów. Zadaj prawdziwe pytanie.",
    subtitle:
      "{{guestCredits}} darmowych kredytów miesięcznie, bez konta. Zacznij od zwycięzcy, zmieniaj, kiedy chcesz.",
    start: "Rozmawiaj z {{topModel}}",
    models: "Porównaj wszystkie modele",
  },
};
