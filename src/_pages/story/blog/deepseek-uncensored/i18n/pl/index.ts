import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "DeepSeek bez cenzury: abliterowany DeepSeek online | {{appName}}",
    description:
      "Gdzie naprawdę siedzi cenzura DeepSeeka, czemu inny hosting to tylko połowa rozwiązania i z którymi buildami bez cenzury pogadasz od razu. Bez GPU, bez konta.",
    category: "Przewodnik po modelach",
    imageAlt:
      "DeepSeek bez cenzury: zwykły DeepSeek obok abliterowanych buildów",
    keywords:
      "DeepSeek bez cenzury, nieocenzurowany DeepSeek, DeepSeek abliterated, DeepSeek bez filtrów, DeepSeek V4.1 Flash Uncensored, cenzura DeepSeek, DeepSeek Tiananmen, DeepSeek bez cenzury online, alternatywa dla jailbreaka DeepSeek, {{appName}}",
  },
  hero: {
    backToBlog: "Wróć do bloga",
    category: "Przewodnik po modelach",
    readTime: "7 min czytania",
    title: "DeepSeek bez cenzury. Co naprawdę zdejmuje filtr.",
    subtitle:
      "{{count}} nieocenzurowane buildy DeepSeeka obok zwykłego DeepSeeka. Od {{buildPrice}} za wiadomość, w przeglądarce.",
  },
  intro: {
    lead: "DeepSeek jest szybki, tani i świetnie radzi sobie z kodem. Zapytasz o niewłaściwy temat, a milknie, zmienia temat albo kasuje własną odpowiedź.",
    p2: "To zachowanie ma dwa źródła, a większość rozwiązań dotyka tylko jednego. Poniżej: gdzie siedzi cenzura, trzy sposoby, żeby ją obejść, i nieocenzurowane buildy DeepSeeka, które działają teraz na {{appName}}, z cenami na żywo.",
  },
  where: {
    title: "Gdzie siedzi cenzura DeepSeeka",
    intro: "Dwie warstwy. Każdą zdejmuje się inaczej.",
    app: "Warstwa aplikacji. Własna aplikacja i strona DeepSeeka nakładają na model moderację. Odpowiedzi na tematy drażliwe w Chinach urywają się w połowie zdania albo zamieniają w gotową formułkę.",
    weights:
      "Wagi. Sam model został wytrenowany, żeby omijać jedne tematy i odmawiać przy innych, jak każdy model z głównego nurtu. To jedzie z modelem, gdziekolwiek działa.",
    hosts:
      "Inni dostawcy. DeepSeek publikuje wagi, więc inne firmy uruchamiają ten sam model bez warstwy aplikacji. Kasowanie na żywo znika. Wytrenowane odmowy zostają.",
    callout:
      "Uruchomienie DeepSeeka gdzie indziej zdejmuje filtr aplikacji. Odmowy wytrenowane w samym modelu zdejmuje tylko zmodyfikowany build.",
  },
  ways: {
    title: "Trzy sposoby na DeepSeeka bez filtra",
    intro: "Od najwięcej pracy do najmniej.",
    localTitle: "1. Uruchom otwarte wagi sam",
    local:
      "Pełne modele DeepSeeka są o wiele za duże na domowe GPU. Większość małych plików z DeepSeekiem w nazwie to destylaty: baza Qwen albo Llama wytrenowana na odpowiedziach DeepSeeka. Przydatne, ale to inny model z innymi odmowami.",
    hostedTitle: "2. Zwykły DeepSeek u innego dostawcy",
    hosted:
      "Koniec z kasowaniem na żywo, wytrenowane uniki zostają. Dobre do kodu i codziennej pracy. Nie rozwiązuje problemu, jeśli przeszkadzają ci odmowy.",
    buildTitle: "3. Użyj buildu bez cenzury",
    build:
      "Ktoś wziął wagi DeepSeeka i usunął zachowanie odmawiające, zwykle przez abliterację. Ten sam model, ta sama szybkość, to samo okno kontekstu. Przestaje się wykręcać. Hostowany, więc nic nie instalujesz.",
    noGpuLink: "Nieocenzurowany LLM online, bez GPU",
  },
  models: {
    title: "Modele DeepSeek na tej platformie",
    intro:
      "Najpierw buildy bez cenzury, potem zwykłe modele, z których powstały. Na żywo z naszego katalogu.",
    colModel: "Model",
    colContext: "Kontekst",
    colStrengths: "Mocne strony",
    colPrice: "Za wiadomość",
    colChat: "Wypróbuj",
    chatLink: "Czat z {{model}}",
    footnote:
      "Cena jednej wiadomości referencyjnej z naszą marżą {{markup}}%. Etykieta pod nazwą mówi, jak powstał dany build.",
  },
  builds: {
    title: "{{count}} buildy DeepSeeka bez cenzury",
    intro: "Ta sama rodzina, różne ręce.",
    venice:
      "Serwowany przez Venice.ai, odmowy usunięte, wywołania narzędzi działają. Mocne strony: {{strengths}}. Jedna wiadomość referencyjna kosztuje {{price}}.",
    csf: "Abliterowany build niezależnego dewelopera jcartu, z rozumowaniem i wywołaniami narzędzi. Mocne strony: {{strengths}}. Jedna wiadomość referencyjna kosztuje {{price}}.",
    chatLink: "Czat z {{model}}",
    abliteration:
      "Abliteracja znajduje w aktywacjach modelu kierunek, który wywołuje odmowę, i usuwa go z wag. Reszta tego, czego model się nauczył, zostaje na miejscu. Dlatego abliterowany DeepSeek nadal programuje jak DeepSeek.",
    explainerLink: "Modele abliterowane i bez cenzury, wyjaśnione",
  },
  compare: {
    title: "Zwykły kontra bez cenzury, obok siebie",
    intro:
      "Kontekst, cena, mocne strony i odmowy na jednej stronie. Potem wyślij obu ten sam prompt.",
    link: "{{a}} kontra {{b}}",
  },
  limits: {
    title: "Czego build bez cenzury nie zmienia",
    intro: "Usunięcie odmów to jedna poprawka. Nie wszystkie.",
    knowledge:
      "Wiedza. Model wie to, co było w danych treningowych. Usunięcie odmowy nie dodaje faktów, których nigdy nie widział.",
    slant:
      "Przechył. Abliteracja usuwa odmowy, nie skrzywienie danych treningowych. Jeśli chcesz modelu, który celowo nie zgadza się z głównym nurtem: {{ownModel}} jest trenowany na książkach i dokumentach zakazanych w mainstreamowym internecie, przez co ma przeciwne poglądy polityczne.",
    mistakes:
      "Błędy. Model bez cenzury myli się tak samo często jak oryginał. Sprawdzaj fakty, które mają znaczenie.",
    callout:
      "Modele bez cenzury odblokowujesz jednorazowym potwierdzeniem 18+. Co zrobisz z odpowiedziami, to twoja decyzja.",
  },
  faq: {
    title: "FAQ",
    censored: {
      q: "Czy DeepSeek jest ocenzurowany?",
      a: "Tak, w dwóch warstwach. Aplikacja DeepSeeka moderuje odpowiedzi na tematy drażliwe w Chinach, a sam model wytrenowano, żeby omijał i odrzucał część próśb. Inni dostawcy zdejmują pierwszą warstwę. Drugą zdejmuje tylko build bez cenzury.",
    },
    exists: {
      q: "Czy istnieje DeepSeek bez cenzury?",
      a: "Tak. {{appName}} uruchamia {{count}} buildy DeepSeeka bez cenzury, na czele z {{buildName}}. Zachowują umiejętności i okno kontekstu DeepSeeka, a przestają się wykręcać.",
    },
    local: {
      q: "Czy mogę uruchomić DeepSeeka bez cenzury lokalnie?",
      a: "Tylko na poważnym sprzęcie. Pełne modele potrzebują dużo więcej pamięci, niż ma komputer do gier. Małe pliki DeepSeeka to głównie destylaty na innych bazach. Hostowane buildy oszczędzają ci pytania o sprzęt.",
    },
    china: {
      q: "Czy DeepSeek bez cenzury odpowie na pytania o Chiny?",
      a: "Wytrenowane uniki przy tych tematach to dokładnie ten rodzaj odmowy, który usuwa abliteracja. Jakość odpowiedzi nadal zależy od tego, czego model się nauczył. Zadaj to samo pytanie {{stockName}} i buildowi bez cenzury, a potem porównaj.",
    },
    api: {
      q: "Czy mogę używać DeepSeeka bez cenzury przez API?",
      a: "Tak. Te same buildy działają przez endpointy zgodne z OpenAI i Anthropic. Pierwszy zakup odblokowuje klucze API, plany zaczynają się od {{apiSubPrice}} miesięcznie.",
    },
    free: {
      q: "Czy mogę wypróbować za darmo?",
      a: "Tak. {{guestCredits}} darmowych kredytów miesięcznie bez konta, {{freeCredits}} z darmowym kontem, {{maxCredits}} z newsletterem. Starczy na sporo wiadomości z tańszymi buildami.",
    },
    directoryLink: "Wszystkie modele abliterowane, z kontekstem i ceną",
    bestLink: "Najlepszy LLM bez cenzury, według zadania",
    refusalLink: "Refusal Index: kto odpowiada, kto odmawia",
  },
  cta: {
    title: "Mózg DeepSeeka. Bez wykrętów.",
    subtitle:
      "{{guestCredits}} darmowych kredytów miesięcznie, bez konta. Zacznij od {{buildName}}.",
    start: "Czat z DeepSeekiem bez cenzury",
    models: "Porównaj wszystkie modele",
  },
};
