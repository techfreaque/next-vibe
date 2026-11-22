import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "Alternatywy dla Groka: mniej filtrów niż Grok, ten sam czat | {{appName}}",
    description:
      "Czy Grok jest bez cenzury? Nie do końca. Jak bardzo Grok jest naprawdę niefiltrowany, najlepsze alternatywy według potrzeb i jak używać Groka obok modeli abliterowanych w jednym czacie. Ceny na żywo.",
    category: "Porównanie",
    imageAlt: "Grok obok alternatyw bez cenzury",
    keywords:
      "alternatywa dla Groka, alternatywy dla Groka, Grok bez cenzury, czy Grok jest bez cenzury, Grok bez konta X, Grok kontra AI bez cenzury, strony jak Grok, Grok Imagine, AI bez filtrów, {{appName}}",
  },
  hero: {
    backToBlog: "Wróć do bloga",
    category: "Porównanie",
    readTime: "7 min czytania",
    title: "Alternatywy dla Groka. Gdy zadziorność to za mało.",
    subtitle:
      "Jak bardzo Grok jest naprawdę niefiltrowany, {{count}} alternatyw bez warstwy odmów i sam Grok w tym samym czacie.",
  },
  intro: {
    lead: "Grok sprzedaje się jako AI, która mówi to, czego inne nie powiedzą. Przy ChatGPT i Claudzie często tak jest. Nadal to jednak korporacyjny model z zasadami, które właściciel może zmienić z dnia na dzień.",
    p2: "Tutaj: co Grok zrobi, a czego nie, alternatywy według tego, czego naprawdę chcesz, i jak zatrzymać {{grokName}}, dokładając modele bez odmów, w jednym wątku. {{appName}} uruchamia {{grokName}} obok {{uncensored}} modeli bez cenzury.",
  },
  honest: {
    title: "Jak bardzo niefiltrowany jest Grok?",
    intro: "Luźniejszy niż wielka dwójka. Nie bez cenzury.",
    looser:
      "Luźniejszy. Grok łapie żarty, ostre opinie i trudne tematy, przed którymi mainstreamowe chatboty uciekają albo które owijają w ostrzeżenia.",
    filtered:
      "Wciąż filtrowany. xAI ma zasady użytkowania i trening bezpieczeństwa. Część próśb nadal kończy się odmową, złagodzeniem albo zmianą kursu.",
    shifts:
      "Ruchomy cel. xAI często i publicznie przestraja zachowanie i prompt systemowy Groka. To, co działało w zeszłym miesiącu, dziś może nie działać.",
    catalog:
      "Nasz katalog umieszcza {{grokName}} w poziomie {{grokTier}}: mniej odmów niż w modelach mainstreamowych, ale nadal z zasadami w tle.",
    callout:
      "Luźniejszy model korporacyjny to wciąż model korporacyjny. Granice wyznacza mu jedna firma i one się przesuwają.",
  },
  why: {
    title: "Dlaczego ludzie szukają alternatywy dla Groka",
    intro: "Trzy powody wracają w kółko.",
    policy:
      "Zasady. Pazur Groka zależy od bieżących ustawień xAI. Kto potrzebuje przewidywalności, chce modelu, którego odmowy usunięto z wag, a nie poluzowano promptem.",
    account:
      "Konto. Aplikacje Groka żyją w ekosystemie X i xAI. Nie każdy chce wiązać z tym kontem swoje czaty.",
    voice:
      "Jeden głos. Grok ma osobowość. Świetną do przekomarzania się, złą do chłodnej odpowiedzi technicznej, powieściowego złoczyńcy albo poglądu, którego go oduczono.",
  },
  alternatives: {
    title: "{{count}} alternatyw dla Groka, według potrzeb",
    intro:
      "Każda działa w tym samym czacie co Grok. Ceny za wiadomość referencyjną, na żywo z naszego katalogu.",
    edge: {
      title: "Ostrzej, ten sam intelekt: {{model}}",
      body: "Model z głównego nurtu, lekko zmieniony, żeby nie uciekał od pytań: abliterowany. Mocny w rozumowaniu i kodzie, odpowiada tam, gdzie Grok odmawia. {{price}} za wiadomość.",
    },
    reasoning: {
      title: "Ciężkie rozumowanie, zero pouczania: {{model}}",
      body: "Flagowe Kimi od Moonshot AI, abliterowane. Długie, staranne odpowiedzi na trudne problemy, bez odmów. {{price}} za wiadomość.",
    },
    cheap: {
      title: "Szybko i tanio: {{model}}",
      body: "DeepSeek bez odmów. Szybki, dobry w kodzie i analizie, kosztuje grosze. {{price}} za wiadomość.",
    },
    contrary: {
      title: "Przeciwne zdanie celowo: {{model}}",
      body: "{{model}} jest trenowany na książkach i dokumentach zakazanych w mainstreamowym internecie, przez co ma przeciwne poglądy polityczne. Nie podkręcony na zadziorność. Zbudowany, żeby się nie zgadzać. {{price}} za wiadomość.",
    },
    roleplay: {
      title: "Postacie i mroczna fikcja: {{model}}",
      body: "Dostrojony do roleplayu. Trzyma się roli, wchodzi w mroczne sceny i nie łamie czwartej ściany, żeby cię ostrzegać. {{price}} za wiadomość.",
    },
    chatLink: "Czat z {{model}}",
    directoryLink: "Wszystkie modele abliterowane, z kontekstem i ceną",
  },
  models: {
    title: "Grok i alternatywy obok siebie",
    intro: "Pod każdą nazwą: poziom treści albo metoda zdjęcia cenzury.",
    colModel: "Model",
    colContext: "Kontekst",
    colStrengths: "Mocne strony",
    colPrice: "Za wiadomość",
    colChat: "Wypróbuj",
    chatLink: "Czat z {{model}}",
    footnote: "Cena jednej wiadomości referencyjnej z naszą marżą {{markup}}%.",
  },
  keep: {
    title: "Zostaw Groka. Dołóż resztę.",
    intro:
      "Nie musisz wybierać. {{grokName}} i modele bez cenzury dzielą jeden czat i jedno saldo.",
    steps: {
      ask: {
        title: "Zacznij od Groka",
        body: "Otwórz czat z {{grokName}}. Przekomarzanie, komentarze do newsów, szybkie odpowiedzi.",
      },
      switch: {
        title: "Przełącz, gdy kluczy",
        body: "Do następnej wiadomości wybierz model bez cenzury. Cała rozmowa idzie za nim, więc odpowiada w kontekście.",
      },
      compare: {
        title: "Porównaj na tym samym prompcie",
        body: "Wyślij jeden prompt do obu i czytaj odpowiedzi obok siebie. Strony porównań poniżej pokazują parametry.",
      },
    },
    compareLink: "{{a}} kontra {{b}}",
  },
  imagine: {
    title: "Grok Imagine też tu działa",
    intro:
      "{{imagineNames}}: modele obrazów i wideo od xAI, na tych samych kredytach. Bez konta X.",
    link: "Twórz z {{model}}",
  },
  faq: {
    title: "FAQ",
    uncensored: {
      q: "Czy Grok jest bez cenzury?",
      a: "Nie. Grok jest luźniejszy niż ChatGPT czy Claude, ale xAI ma zasady użytkowania i trening bezpieczeństwa, a zachowanie modelu często zmienia. W modelach bez cenzury odmawianie usunięto z samych wag.",
    },
    best: {
      q: "Jaka jest najlepsza alternatywa dla Groka?",
      a: "Zależy od zadania. Ta sama inteligencja przy mniejszej liczbie odmów: model abliterowany, np. {{firstName}}. Poglądy pod prąd mainstreamu: {{ownModel}}. Roleplay: model dostrojony do odgrywania ról. Wszystkie działają na {{appName}} obok Groka w jednym czacie.",
    },
    account: {
      q: "Czy mogę używać Groka bez konta X?",
      a: "Tak, tutaj tak. {{grokName}} działa w czacie incognito na {{appName}}, zupełnie bez konta. Na start {{guestCredits}} darmowych kredytów miesięcznie.",
    },
    price: {
      q: "Ile kosztuje tu Grok?",
      a: "Bez osobnej subskrypcji. Płacisz za wiadomość z jednego salda kredytów. Jedna wiadomość referencyjna z {{grokName}} kosztuje {{grokPrice}}.",
    },
    api: {
      q: "Czy mogę używać Groka i modeli bez cenzury przez jedno API?",
      a: "Tak. Endpointy zgodne z OpenAI i Anthropic, jeden klucz do Groka, Claude'a, GPT i modeli bez cenzury. Pierwszy zakup odblokowuje klucze API, plany zaczynają się od {{apiSubPrice}} miesięcznie.",
    },
    imagine: {
      q: "Czy mogę tu tworzyć obrazy i wideo w Grok Imagine?",
      a: "Tak. {{imagineNames}} działają na stronach tworzenia i z poziomu każdego czatu, rozliczane z tych samych kredytów.",
    },
    chatLink: "Czat AI bez cenzury: wybierz model i zacznij",
    chatgptLink: "Alternatywa dla ChatGPT bez filtrów",
    refusalLink: "Refusal Index: kto odpowiada, kto odmawia",
  },
  cta: {
    title: "Charakter Groka to był początek. Nie granica.",
    subtitle:
      "{{guestCredits}} darmowych kredytów miesięcznie, bez konta. Zacznij od {{firstName}}.",
    start: "Zacznij czat bez cenzury",
    models: "Porównaj wszystkie modele",
  },
};
