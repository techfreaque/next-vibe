import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "Zostałem zwolniony. To jest to, co zamiast tego zbudowałem. - next-vibe",
    description:
      "Silnik widżetów w piaskownicy, który stał się połową renderowania zdalnego wykonywania narzędzi. Każdy endpoint next-vibe - na dowolnym serwerze - jest teraz żywym, interaktywnym widżetem, który można osadzić wszędzie.",
    category: "VibeFrame",
    imageAlt:
      "VibeFrame - Zdalne wykonywanie narzędzi i renderowanie widżetów w piaskownicy",
    keywords:
      "VibeFrame, zdalne wykonywanie narzędzi, sfederowane widżety, iframe, postMessage, next-vibe, osadzalny, TypeScript",
  },
  hero: {
    backToBlog: "Powrót do bloga",
    category: "VibeFrame",
    readTime: "11 min czytania",
    title: "Zostałem zwolniony. To jest to, co zamiast tego zbudowałem.",
    subtitle:
      "Silnik widżetów zbudowany w wolnym czasie po pracy - SSR+CSR, poniżej 15 KB, szybszy i bardziej funkcjonalny niż wersja z codziennej pracy. Leżał na moim dysku przez sześć miesięcy. Potem next-vibe go potrzebował.",
    quote:
      "Miałem właśnie pokazać to mojemu zespołowi. Potem zostałem zwolniony.",
  },
  origin: {
    title: "Historia powstania",
    paragraph1:
      "Moja codzienna praca miała problem z widżetami. Inne strony importowały nasz JavaScript, żeby wyświetlić widżet - formularz, bąbelek czatu, panel pulpitu nawigacyjnego. Skrypt był nieefektywny, napuchły, wolno się ładował. Strony trzecie, które go importowały, wyraźnie płaciły za to cenę. W wolnym czasie po pracy zacząłem budować zamiennik.",
    paragraph2:
      "Prototyp wyszedł lepiej niż się spodziewałem. Obsługa SSR i CSR - SSR dla szybkości, CSR dla interaktywności. Poniżej 15 KB łącznie. Szybszy niż wersja z codziennej pracy. Więcej funkcji. W pełni reaktywny, w pełni bezpieczny typowo. Właściwy protokół postMessage między iframe a stroną hosta. Brak wspólnego stanu. System wyzwalaczy, tryby wyświetlania, kontrolki częstotliwości wyświetlania. Miałem właśnie pokazać to mojemu zespołowi. Potem zostałem zwolniony.",
    paragraph3:
      "Baza kodu leżała na moim dysku przez około sześć miesięcy. Potem zdałem sobie sprawę, do czego next-vibe tego naprawdę potrzebował: nie tylko formularzy - ale renderowania pełnego interaktywnego UI narzędzia działającego na zdalnym serwerze, w piaskownicy, na dowolnej stronie. To zdalne wykonywanie narzędzi z żywym UI.",
  },
  problem: {
    title: "Problem z tagami script",
    paragraph1:
      "Gdy osadzasz treści zewnętrzne za pomocą nagiego tagu script, płacisz na dwa sposoby. Wydajność: skrypt musi się załadować, przetworzyć i wykonać zanim cokolwiek się wyrenderuje. Jeśli serwer zewnętrzny jest wolny, twoja strona czeka. I bezpieczeństwo: ten skrypt ma pełny dostęp do strony - DOM, ciasteczka, localStorage, nasłuchiwacze zdarzeń. Jeśli jest wadliwy, twoja strona się psuje. Jeśli jest złośliwy, twoi użytkownicy są narażeni.",
    paragraph2:
      "Standardową bezpieczną alternatywą jest iframe. Ale iframe domyślnie nie komunikuje się ze stroną nadrzędną. Zdarzenia zmiany rozmiaru nie bąbelkują. Przesyłanie formularzy nie propaguje. Kończysz z głupim izolowanym pudełkiem, które nie może nic powiedzieć swojemu rodzicowi.",
    bridgeTitle: "To, czego naprawdę potrzebujesz, to most.",
    bridgeDescription:
      "API postMessage pozwala iframe i stronie hosta komunikować się bezpiecznie, między różnymi źródłami. Definiujesz protokół. Waliduje się źródła. Każda wiadomość ma typ. To jest VibeFrame.",
  },
  bridge: {
    title: "Most postMessage",
    diagramParent: "Strona nadrzędna",
    diagramBridge: "Protokół postMessage",
    diagramIframe: "Sandboxowany iframe",
    parentToIframe: "Rodzic → iframe",
    iframeToParent: "iframe → Rodzic",
    parentMessages:
      "init, token uwierzytelniania, motyw, wstępne wypełnienie danych, nawigacja wstecz",
    iframeMessages:
      "gotowy, zmiana rozmiaru, zamknij, sukces, błąd, nawiguj, wymagane uwierzytelnianie",
    description:
      "Każda wiadomość ma prefiks vf:. Most nadrzędny waliduje źródło przed przetworzeniem czegokolwiek. Iframe nigdy nie wykonuje się w kontekście strony hosta.",
  },
  displayModes: {
    title: "Tryby wyświetlania i wyzwalacze",
    modesTitle: "Cztery tryby wyświetlania",
    inline: {
      name: "Inline",
      description:
        "Osadza bezpośrednio w elemencie DOM. Automatycznie dostosowuje rozmiar.",
    },
    modal: {
      name: "Modal",
      description: "Wyśrodkowana nakładka z tłem. Pojawia się nad stroną.",
    },
    slideIn: {
      name: "Wsuwanie",
      description:
        "Wsuwa się z prawej strony. Dobry dla formularzy lub treści pomocniczych.",
    },
    bottomSheet: {
      name: "Dolna kartka",
      description: "Wysuwa się od dołu. Standardowy wzorzec mobilny.",
    },
    triggersTitle: "Siedem typów wyzwalaczy",
    triggers: {
      immediate: "Natychmiastowy - montuje się, gdy tylko strona się ładuje",
      scroll:
        "Przewijanie - uruchamia się gdy użytkownik przewinął procent strony",
      time: "Czas - uruchamia się po N milisekundach",
      exitIntent:
        "Zamiar wyjścia - uruchamia się gdy mysz opuszcza viewport przez górę",
      click: "Kliknięcie - uruchamia się gdy kliknięto określony element",
      hover: "Najechanie - uruchamia się przy wejściu myszy na selektor",
      viewport: "Viewport - uruchamia się na podstawie rozmiaru ekranu",
    },
    frequencyTitle: "Częstotliwość wyświetlania",
    frequency:
      "zawsze, raz-na-sesję, raz-na-dzień, raz-na-tydzień, raz-na-użytkownika. Egzekwowane po stronie klienta z localStorage. Bez podróży do serwera.",
  },
  embed: {
    title: "Dwa tagi script. Gotowe.",
    description:
      "Każdy endpoint staje się osadzalny. Narzędzie działa na własnym serwerze. Widżet renderuje się w piaskownicy na twojej stronie. Pełne funkcje, zero wspólnego stanu.",
    twoScriptTags: "Dwa tagi script. Gotowe.",
    codeCaption:
      "Kompletny kod osadzania dla formularza kontaktowego z {{appName}}",
    orScriptTag: "Lub jako zwykły tag script dla dowolnej strony:",
    adminDescription:
      "Panel administracyjny generuje to dla ciebie. Wybierz endpoint, wybierz tryb wyświetlania, wybierz wyzwalacz. Kopiuj. Wklej wszędzie.",
  },
  vibeSense: {
    title: "Nie efekt uboczny. Sedno sprawy.",
    paragraph1:
      "Gdy przeniosłem VibeFrame do next-vibe, pierwsze prawdziwe zastosowanie nie polegało na osadzeniu formularza kontaktowego na jakiejś zewnętrznej stronie. Było to zdalne wykonywanie narzędzi wewnątrz samej platformy - renderowanie pełnego interaktywnego UI widżetu dowolnego endpointu w piaskownicy, żeby rozproszone narzędzia działały jak jeden system.",
    paragraph2:
      "Prawdziwe dane. Żywe wskaźniki. Wykres Vibe Sense reaguje na to, co dzieje się na serwerze. To nie jest zrzut ekranu ani eksport statyczny. Narzędzie działa. VibeFrame renderuje jego UI widżetu w piaskownicy wszędzie tam, gdzie tego potrzebujesz - wewnątrz platformy, na dashboardzie lub na dowolnej innej stronie.",
    paragraph3:
      "Wtedy architektura zaskoczyła. VibeFrame nie był tylko sposobem na osadzanie formularzy na stronach trzecich. Był połową renderowania zdalnego wykonywania narzędzi - brakującym elementem, który sprawia, że rozproszony system narzędzi wydaje się jedną spójną platformą.",
  },
  federated: {
    title: "Sfederowane osadzanie",
    description:
      "Każda integracja w VibeFrame może wskazywać na inny serverUrl. Oznacza to, że możesz osadzać widżety z wielu instancji next-vibe na tej samej stronie. Żaden wspólny backend. Żadna wspólna baza danych.",
    codeCaption:
      "Wiele instancji, jedna strona hosta, zero wspólnej infrastruktury",
    principle:
      "Definicja podróżuje z widżetem. Serwer, który jest właścicielem endpointu, jest właścicielem renderowania.",
  },
  skills: {
    title: "Połowa wywołań",
    intro:
      "VibeFrame obsługuje renderowanie. Rejestr narzędzi obsługuje wywołania. Podłączasz zdalne instancje next-vibe – każda z nazwą jak hermes, thea lub własnym aliasem. Ich endpointy stają się dostępne obok twoich lokalnych narzędzi. Jeden zunifikowany zestaw.",
    discovery:
      "AI używa tool-help, żeby odkryć każdy dostępny endpoint – lokalny i zdalny. Widzi cały rejestr: nazwy, opisy, typowane wejścia, typowane wyjścia. Gdy wywołuje execute-tool, platforma kieruje do właściwej instancji. AI nie obchodzi, gdzie narzędzie mieszka.",
    control:
      "Ty masz kontrolę. Przypnij narzędzia, które chcesz widzieć, wyłącz te, których nie potrzebujesz. Ta sama obsługa dla lokalnych i zdalnych endpointów – żadnej różnicy w konfiguracji.",
    keyLine:
      "Połącz instancje. AI odkrywa narzędzia. Ty decydujesz, których używasz.",
    skillsTitle: "Skille: warstwa persony",
    skillsDescription:
      "Na wierzchu skille dodają personę. Skill to preset – nazwa, system prompt, głos, osobowość i opcjonalnie ograniczony zestaw narzędzi. Użytkownik wybiera korepetytora, programistę, gawędziarza. Pod spodem to ten sam rejestr, te same endpointy, te same wywołania execute-tool.",
    userPerspective: "Perspektywa użytkownika",
    aiPerspective: "Perspektywa AI",
    userDescription:
      "Skill to persona. Korepetytor, programista, gawędziarz. Każdy ma nazwę, głos, osobowość. Wybierasz jednego i zaczynasz rozmawiać.",
    aiDescription:
      "Skill to preset konfiguracji. Może ograniczyć widoczne narzędzia, przypiąć konkretne endpointy lub zostawić pełny rejestr otwarty. Ten sam interfejs execute-tool, tylko zawężony.",
  },
  remoteExecution: {
    title: "Zdalne wykonywanie narzędzi",
    paragraph1:
      "Oto co łączy VibeFrame i rejestr narzędzi. Gdy AI wywołuje execute-tool ze zdalnym endpointem, next-vibe kieruje wywołanie do docelowej instancji. Ta instancja wykonuje narzędzie i zwraca wynik. Dość standardowo.",
    paragraph2:
      "Ale każdy endpoint w next-vibe ma też widżet – typowaną, w pełni wyposażoną komponentę UI, która wie, jak renderować wejścia i wyjścia tego narzędzia. Jeśli zdalna instancja jest publicznie dostępna, VibeFrame renderuje prawdziwy widżet w sandboxowanym iframe, komunikując się z serwerem narzędzia przez postMessage. Pełna interaktywność, żywe dane, prawdziwe UI.",
    paragraph3:
      "Jeśli instancja nie jest publiczna – za firewallem, w prywatnej sieci – platforma przechodzi na UI sterowane definicją. Definicja endpointu zawiera wystarczająco metadanych (typy pól, etykiety, reguły walidacji), żeby wyrenderować funkcjonalny interfejs lokalnie, bez sięgania po frontend zdalnego serwera. Tak czy inaczej narzędzie działa. UI się dostosowuje.",
    diagramAI: "Agent AI",
    diagramExecute: "execute-tool",
    diagramRemote: "Zdalna instancja",
    diagramVibeFrame: "VibeFrame",
    diagramWidget: "Widżet UI w piaskownicy",
    diagramAILabel: "wywołuje narzędzie",
    diagramRemoteLabel: "wykonuje, zwraca wynik",
    diagramWidgetLabel: "renderuje pełne UI w piaskownicy",
    callout:
      "Serwer, który posiada narzędzie, posiada UI. VibeFrame renderuje ją wszędzie, gdzie jej potrzebujesz. Tak wygląda zdalne wykonywanie narzędzi z pełnym frontendem.",
  },
  close: {
    title: "Co mają wspólnego",
    paragraph:
      "VibeFrame i rejestr narzędzi rozwiązują ten sam problem z przeciwnych stron. Rejestr narzędzi obsługuje wywołania - każdy endpoint na dowolnej instancji, wywoływalny z dowolnej AI. VibeFrame obsługuje renderowanie - każdy widżet z dowolnej instancji, osadzalny na dowolnej stronie. Zdalne wykonywanie narzędzi to most między nimi: wywołaj narzędzie, renderuj jego UI.",
    together:
      "Rozproszony system narzędzi z rozproszonym systemem renderowania. To jest next-vibe.",
    finalLine:
      "Nigdy nie mogłem tego pokazać tym kolegom. Ale pokazuję to tobie.",
    github: "Zobacz na GitHubie",
    githubCode: "git clone https://github.com/techfreaque/next-vibe",
  },
};
