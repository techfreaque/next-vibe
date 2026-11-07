import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Twoje AI przekazuje robotę Claude Code - {{appName}}",
    description:
      "Narzędzie coding-agent pozwala Twojemu AI zlecać prawdziwe zmiany w kodzie Claude Code albo OpenCode - w tle lub jako sesję na żywo w prawdziwym oknie terminala, która sama melduje wynik. Teraz także między instancjami.",
    category: "Agent kodujący",
    imageAlt: "Interaktywny agent kodujący - Claude Code w oknie terminala",
    keywords:
      "agent kodujący, Claude Code, OpenCode, terminal AI, MCP complete-task, self-hosted AI, next-vibe, {{appName}}",
  },
  hero: {
    backToBlog: "Wróć do bloga",
    category: "Agent kodujący",
    readTime: "5 min czytania",
    title: "Twoje AI otwiera terminal i przekazuje robotę Claude Code.",
    subtitle:
      "Czatowe AI mówią o kodzie. Agenci kodujący go zmieniają. Narzędzie coding-agent łączy jedno z drugim - a w trybie interaktywnym widzisz pracę na żywo w prawdziwym oknie terminala.",
  },
  intro: {
    p1: "Prosisz AI o naprawę padającego testu. Wyjaśni Ci poprawkę. Ale nie zedytuje repo, nie odpali testów i nie będzie poprawiać, aż wszystko się zazieleni. Claude Code i OpenCode to potrafią.",
    p2: "Narzędzie coding-agent przekazuje zadanie jednemu z nich - na maszynie, na której leży kod - i przynosi wynik z powrotem do Twojej rozmowy.",
  },
  modes: {
    title: "Dwa tryby",
    intro: "Zleć i odbierz - albo patrz i steruj.",
    batch: {
      label: "Domyślny",
      title: "Batch",
      body: "Działa w tle. Zbiera wszystko, co agent wypisze, i oddaje to do rozmowy. Kończy po 30 minutach.",
    },
    interactive: {
      label: "Patrz i steruj",
      title: "Interaktywny",
      body: "Otwiera prawdziwe okno terminala z sesją na żywo. Śledź postęp, odpowiadaj na pytania, zmieniaj kurs. Bez limitu czasu - wynik trafia do wątku, gdy sesja się zamelduje.",
    },
  },
  handBack: {
    title: "Jak wynik trafia z powrotem",
    intro:
      "Sesja w terminalu to osobny proces. Oto jak jej odpowiedź i tak ląduje we właściwym wątku.",
    step1Title: "Twoje AI wywołuje narzędzie",
    step1Body: "Z Twoim promptem i włączonym trybem interaktywnym.",
    step2Title: "Powstaje śledzone zadanie",
    step2Body: "Wątek czeka na to zadanie - nie na terminal.",
    step3Title: "Otwiera się okno terminala",
    step3Body:
      "Terminal na macOS, Twój $TERMINAL albo pierwszy znaleziony emulator na Linuksie, świeża konsola PowerShell na Windowsie.",
    step4Title: "Agent dostaje instrukcję",
    step4Body:
      "Prompt zawiera jedną dodatkową linię: po skończeniu wywołaj complete-task na serwerze MCP tej instancji z tym ID zadania.",
    step5Title: "Wynik ląduje w Twoim wątku",
    step5Body: "complete-task dostarcza wynik, a rozmowa toczy się dalej.",
    codeCaption:
      "Linia doklejana do każdego interaktywnego promptu Claude Code:",
  },
  whatsNew: {
    title: "Nowość: działa między instancjami",
    intro:
      "Thea w chmurze może teraz poprosić Hermesa na Twoim komputerze o sesję kodowania.",
    item1:
      "Na zdalnej instancji sesja działa jako śledzone zadanie w tle, więc nic nie stoi, gdy pracujesz w terminalu.",
    item2:
      "Gdy sesja zamelduje się przez complete-task, prawdziwy wynik wraca do instancji, która o niego prosiła.",
    item3:
      "Na Windowsie otwiera się prawdziwe okno konsoli. Polecenie trafia najpierw do skryptu PowerShell, więc prompty z cudzysłowami, nawiasami czy nowymi liniami docierają w całości.",
    item4:
      "Sesja uruchomiona z lokalnej maszyny może raportować każde zadanie należące do jej własnej instancji.",
    item5:
      "Brak kanału na żywo do odpowiedzi? Tryb interaktywny przechodzi wtedy na batch, więc wywołujący i tak dostaje odpowiedź.",
  },
  tryIt: {
    title: "Wypróbuj",
    p1: "Narzędzie jest tylko dla adminów i działa na instancjach self-hosted: uruchamia CLI do kodowania z pełnymi uprawnieniami w folderze projektu. Na tej maszynie musisz mieć zainstalowane i zalogowane Claude Code albo OpenCode.",
    p2: "Potem po prostu poproś na czacie - albo wywołaj prosto z terminala:",
  },
  cta: {
    title: "Daj swojemu AI ręce.",
    subtitle:
      "Postaw next-vibe u siebie, zaloguj się raz do Claude Code i pozwól AI wdrażać zmiany w kodzie na własnej maszynie.",
    selfHost: "Poradnik self-hostingu",
    framework: "Poznaj next-vibe",
  },
};
