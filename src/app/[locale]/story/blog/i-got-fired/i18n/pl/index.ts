import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "Zostałem zwolniony. To jest to, co zamiast tego zbudowałem. — next-vibe",
    description:
      "Sfederowany silnik widżetów zbudowany w pracy, której już nie ma. Teraz każdy endpoint next-vibe można osadzić wszędzie w dwóch tagach script.",
    category: "VibeFrame",
    imageAlt: "VibeFrame — Sfederowany Silnik Widżetów",
    keywords:
      "VibeFrame, sfederowane widżety, iframe, postMessage, next-vibe, osadzalny, TypeScript",
  },
  hero: {
    backToBlog: "Powrót do bloga",
    category: "VibeFrame",
    readTime: "11 min czytania",
    title: "Zostałem zwolniony. To jest to, co zamiast tego zbudowałem.",
    subtitle:
      "Sfederowany silnik widżetów zbudowany w pracy, której już nie ma. Teraz każdy endpoint next-vibe można osadzić wszędzie w dwóch tagach script.",
    quote:
      "Miałem właśnie pokazać to mojemu zespołowi. Potem zostałem zwolniony.",
  },
  origin: {
    title: "Historia powstania",
    paragraph1:
      "Spędziłem trzy miesiące budując coś w swojej codziennej pracy, czego nigdy nie mogłem nikomu pokazać. Baza kodu, nad którą pracowałem, była katastrofą. Za każdym razem, gdy musieliśmy osadzić widżet zewnętrzny — formularz, bąbelek czatu, panel pulpitu nawigacyjnego — była ta sama historia.",
    paragraph2:
      "Zbudowałem alternatywę. Lekki sfederowany silnik widżetów, który mógł bezpiecznie osadzać wszystko — każdy formularz, każde UI, każde narzędzie — w sandboxowanym iframe na dowolnej stronie. Właściwy protokół postMessage. Brak wspólnego stanu między hostem a widżetem. System wyzwalaczy, tryby wyświetlania, cały zestaw.",
    paragraph3:
      "Miałem właśnie pokazać to mojemu zespołowi. Potem zostałem zwolniony. Baza kodu leżała martwa na moim dysku przez miesiące. Potem zdałem sobie sprawę: ta architektura była dokładnie tym, czego potrzebował next-vibe.",
  },
  problem: {
    title: "Problem z tagami script",
    paragraph1:
      "Gdy osadzasz treści zewnętrzne za pomocą nagiego tagu script, nie masz sandboxa. Ten skrypt ma pełny dostęp do strony — DOM, ciasteczka, localStorage, nasłuchiwacze zdarzeń, wszystko.",
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
      immediate: "Natychmiastowy — montuje się, gdy tylko strona się ładuje",
      scroll:
        "Przewijanie — uruchamia się gdy użytkownik przewinął procent strony",
      time: "Czas — uruchamia się po N milisekundach",
      exitIntent:
        "Zamiar wyjścia — uruchamia się gdy mysz opuszcza viewport przez górę",
      click: "Kliknięcie — uruchamia się gdy kliknięto określony element",
      hover: "Najechanie — uruchamia się przy wejściu myszy na selektor",
      viewport: "Viewport — uruchamia się na podstawie rozmiaru ekranu",
    },
    frequencyTitle: "Częstotliwość wyświetlania",
    frequency:
      "zawsze, raz-na-sesję, raz-na-dzień, raz-na-tydzień, raz-na-użytkownika. Egzekwowane po stronie klienta z localStorage. Bez podróży do serwera.",
  },
  embed: {
    title: "Dwa tagi script. Gotowe.",
    description:
      "Portowane. Każdy endpoint staje się osadzalny. Każdy widżet jest teraz obywatelem pierwszej klasy na każdej stronie.",
    twoScriptTags: "Dwa tagi script. Gotowe.",
    codeCaption:
      "Kompletny kod osadzania dla formularza kontaktowego z unbottled.ai",
    adminDescription:
      "Panel administracyjny generuje to dla ciebie. Wybierz endpoint, wybierz tryb wyświetlania, wybierz wyzwalacz. Kopiuj. Wklej wszędzie.",
  },
  vibeSense: {
    title: "Efekt uboczny, którego nie planowałem",
    paragraph1:
      "Gdy przeniosłem VibeFrame do next-vibe, zdałem sobie sprawę, że nie tylko formularze stały się osadzalne. UI każdego endpointu jest osadzalna. Włącznie z wizualizacjami wykresów Vibe Sense.",
    paragraph2:
      "Wykres lejka leadów na żywo z platformy — z prawdziwymi danymi, wskaźnikami na żywo — renderowany jako widżet na zewnętrznej stronie. To nie jest zrzut ekranu. To nie są eksporty statyczne. Dane się odświeżają. Wykres reaguje.",
    paragraph3:
      "Architektura, którą zbudowałem do bezpiecznego osadzania widżetów zewnętrznych, okazała się również architekturą nadającą każdemu endpointowi publiczną obecność iframe. To właśnie w tym tkwi sens budowania właściwej abstrakcji. Robi więcej niż planowałeś.",
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
    title: "Skille: zarówno persona, jak i konfiguracja narzędzi",
    intro:
      "Chcę opowiedzieć o tym, jak skille na tej platformie ewoluowały, bo ten sam wzorzec ma zastosowanie.",
    userPerspective: "Perspektywa użytkownika",
    aiPerspective: "Perspektywa AI",
    userDescription:
      "Skill to persona. Korepetytor, programista, gawędziarz. Każdy skill ma nazwę, system prompt, głos, osobowość.",
    aiDescription:
      "Skill to zestaw umiejętności. Każdy skill deklaruje, do jakich narzędzi ma dostęp. Konkretne endpointy w rejestrze, z walidowanymi przez Zod wejściami i typowanymi wyjściami.",
    keyLine: "Użytkownik widzi skill. AI widzi konfigurację narzędzi.",
    activeToolsTitle: "Tablica activeTools",
    activeToolsDescription:
      "To jest odkrycie. Nie abstrakcyjne możliwości opisane w pliku markdown. To są konkretne endpointy, wywoływalne z tego samego interfejsu narzędzi co wszystko inne.",
    composableTitle: "Komponowalne rozumowanie",
    composableDescription:
      "Nie jeden duży agent, który wie wszystko. Zbiór specjalistów z wyraźnie ograniczonymi możliwościami, orkiestrowany przez agenta, który wie, którego specjalistę wezwać.",
    bothAtOnce: "Skill jest jednocześnie obydwoma.",
  },
  close: {
    title: "Co te dwie rzeczy mają wspólnego",
    vibeFrame:
      "VibeFrame sprawia, że platforma jest osadzalna wszędzie. Każdy endpoint, każdy widżet, każde UI — dwa tagi script i jest na każdej stronie. Obecność platformy wykracza poza jej własną domenę.",
    skills:
      "Skille sprawiają, że platforma jest komponowalna. Każde zadanie rozumowania, każda domena możliwości — przekieruj do właściwego skilla, uzyskaj właściwy model z właściwymi narzędziami.",
    together:
      "Razem: twoja platforma może pojawiać się wszędzie i rozumować o wszystkim.",
    finalLine:
      "Nigdy nie mogłem tego pokazać tym kolegom. Ale pokazuję to tobie.",
    github: "Zobacz na GitHubie",
    githubCode: "git clone https://github.com/techfreaque/next-vibe",
  },
};
