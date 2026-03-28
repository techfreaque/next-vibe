import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "Zbudowałem sprawdzacz typów, który sprawił, że AI przestało mnie okłamywać - next-vibe",
    description:
      "AI używa `any`, żeby uciec przed błędem typów. Dodaje eslint-disable. Kłamie ci w oczy. Oto jak naprawiliśmy tę pętlę sprzężenia zwrotnego z @next-vibe/checker.",
    category: "TypeScript",
    imageAlt: "Sprawdzacz typów, który sprawił, że AI przestało kłamać",
    keywords:
      "TypeScript, sprawdzacz typów, programowanie z AI, ESLint, Oxlint, typ any, bezpieczeństwo typów, Claude Code, next-vibe",
  },
  hero: {
    label: "TypeScript",
    readTime: "10 min czytania",
    title:
      "Zbudowałem sprawdzacz typów, który sprawił, że AI przestało mnie okłamywać",
    subtitle:
      "AI używa `any`, żeby uciec przed błędem typów. Dodaje eslint-disable. Kłamie ci w oczy. Oto jak naprawiliśmy tę pętlę sprzężenia zwrotnego.",
    quoteAiLies:
      "AI nie okłamuje cię, bo chce. Okłamuje cię, bo na to pozwalasz.",
  },
  problem: {
    title: "Zepsuta pętla sprzężenia zwrotnego",
    description:
      'Poproś Claude Code o dodanie funkcji. Robi to. Uruchom ESLint - przechodzi. Uruchom TypeScript - błędy. Poproś Claude Code o naprawienie błędów TypeScript. Robi to. Uruchom ESLint - teraz to się nie udaje. Tam i z powrotem. Trzy iteracje. AI jest pewne siebie na każdym kroku. Za każdym razem: "To jest naprawione."',
    fixLabel: "Nigdy nie było naprawione.",
    fixDescription:
      "To była gra w kreta z narzędziem, które uruchamia jeden linter na raz i nigdy nie widzi pełnego obrazu.",
    escapeHatch:
      'AI naprawia błąd TypeScript, pisząc jedną linię i mówi ci: "Błąd typów jest rozwiązany."',
    smokeDetector:
      "Tak. Technicznie. Tak jak zaklejenie czujnika dymu taśmą rozwiązuje alarm pożarowy.",
    introducingChecker: "To właśnie po to zbudowałem @next-vibe/checker.",
  },
  anyProblem: {
    title: "Problem z `any`",
    subtitle: "Dlaczego 98% bezpieczeństwa typów to to samo co 0%",
    graphDescription:
      "System typów TypeScript to graf. Każdy typ przepływa od definicji do użycia. Jeśli masz funkcję, która zwraca `string`, wywołujący wie, że to string. Cały łańcuch jest sprawdzany.",
    holeInGraph: "`any` to dziura w grafie.",
    holeDescription:
      "Zmienna typowana jako `any` mówi kompilatorowi: zatrzymaj sprawdzanie tutaj. Nie tylko dla tej zmiennej - dla wszystkiego, co dotyka tej zmiennej. Błąd nie pojawia się przy `any`. Pojawia się trzy pliki dalej, gdy niezwiązany refactoring psuje założenie, które nigdy nie było egzekwowane.",
    zeroErrors:
      "Zero błędów TypeScript nie znaczy nic, jeśli masz 47 niezweryfikowanych użyć `any`.",
    zeroErrorsDescription:
      "Nie masz bezpiecznej typowo bazy kodu. Masz bazę kodu, w której kompilator poddał się w 47 miejscach, a ty nazwałeś to zaliczonym.",
    doubleAssertion:
      "`as unknown as Whatever` jest gorsze. To podwójne twierdzenie typowe. Mówisz kompilatorowi: wiem, że to jest błędne, i mimo to się przez to przekonuję. To ulubiona furtka AI.",
    bannedTitle: "Zakazane wzorce w tej bazie kodu:",
    bannedNotWarnings:
      "Nie ostrzeżenia. Błędy. Sprawdzenie się nie udaje. Claude Code musi naprawić podstawową przyczynę lub nie może dostarczyć.",
    psychologyNote:
      "Powód, dla którego są to błędy, a nie ostrzeżenia, jest psychologiczny tak samo jak techniczny. Modele AI traktują ostrzeżenia jako opcjonalne. Błędy zamykają pętlę.",
    infectionDiagramTitle: "Diagram infekcji `any`",
    infectionDiagramSubtitle:
      "Jeden typ `any` rozprzestrzenia się przez graf, korumpując wnioskowanie typów poniżej",
    infectionUnsafe: "niebezpieczne",
    counterZeroErrors: "błędy TypeScript",
    counterAnyUsages: "użycia `any`",
  },
  checker: {
    title: "Przedstawiamy @next-vibe/checker",
    subtitle: "Jedno polecenie. Trzy narzędzia. Brak furtek.",
    mcpIntegrationTitle: "Integracja MCP",
    commandDescription:
      "To jest polecenie. Jedno polecenie. Uruchamia trzy narzędzia równolegle i daje ci jedną ujednoliconą listę błędów.",
    oxlintDescription:
      "Linter oparty na Rust. Setki reguł. Działa w milisekundach nawet na dużych bazach kodu.",
    eslintDescription:
      "Rzeczy, których Oxlint jeszcze nie robi: lint haków React, reguły kompilatora React, sortowanie importów.",
    tsDescription:
      "Pełne sprawdzanie typów. Nie tylko plik, który edytujesz - cały graf.",
    parallelNote:
      "Wszystkie trzy działają równolegle. Otrzymujesz jedną ujednoliconą listę błędów. Naprawiasz, dopóki nie jest czysto.",
    timingNote:
      "Na tej bazie kodu - 4400 plików - pełne TypeScript zajmuje około 12 sekund. Oxlint jest poniżej sekundy. ESLint to kilka sekund. Równoległość sprowadza to do 12.",
    mcpNote:
      "Udostępnia również polecenie `vibe-check mcp`, które uruchamia serwer MCP z narzędziem `check`. AI nie uruchamia polecenia powłoki - wywołuje narzędzie, które zwraca ustrukturyzowane dane błędów. Paginacja wbudowana. Filtrowanie według ścieżki.",
    architectureTitle: "Architektura sprawdzacza",
    architectureSubtitle:
      "Trzy narzędzia działają równolegle, jedna ujednolicona lista błędów",
    parallel: "równolegle",
    unifiedErrors: "Ujednolicona lista błędów",
    unifiedErrorsDescription: "Jedno wyjście. Naprawiaj, aż będzie czysto.",
  },
  plugins: {
    title: "Niestandardowe wtyczki",
    subtitle: "Linter jako dokumentacja",
    linterIsDocumentation: "Linter to dokumentacja. I jest egzekwowany.",
    jsxPluginTitle: "Wtyczka jsx-capitalization",
    jsxPluginDescription:
      "Flaguje elementy JSX pisane małymi literami, a komunikat o błędzie mówi ci dokładnie, co zamiast tego zaimportować:",
    jsxPluginInsight:
      "Nie napisałem dokumentacji mówiącej Claude Code, żeby używało `next-vibe-ui`. Nie dodałem tego do systemowego promptu. Za pierwszym razem, gdy Claude Code pisze `<div>` w komponencie, sprawdzacz wyrzuca błąd. Komunikat o błędzie zawiera dokładną ścieżkę importu. Claude Code czyta błąd, stosuje poprawkę i zapamiętuje konwencję.",
    restrictedSyntaxTitle: "Wtyczka restricted-syntax",
    restrictedSyntaxDescription: "Zakazuje trzech rzeczy:",
    throwBanTitle: "Instrukcje `throw`",
    throwBanDescription:
      'Komunikat o błędzie mówi: "Zamiast tego użyj właściwych wzorców `ResponseType<T>`." Claude Code na to trafia, czyta to, szuka `ResponseType` i przyjmuje właściwy wzorzec obsługi błędów dla reszty zadania.',
    unknownBanTitle: "nagi typ `unknown`",
    unknownBanDescription:
      "\"Zastąp 'unknown' istniejącym typowanym interfejsem. Dostosuj się do typów w bazie kodu, zamiast konwertować lub odtwarzać.\" To powstrzymuje Claude Code przed pisaniem generycznych furtek typowych.",
    objectBanTitle: "nagi typ `object`",
    objectBanDescription:
      "`object` jest prawie zawsze błędny. Albo znasz kształt - napisz interfejs - albo masz `Record<string, SomeType>`. Surowy `object` to sygnał, że AI się poddało.",
    bannedPatternsTitle: "Zakazane wzorce",
    bannedPatternsSubtitle:
      "Każdy zakazany wzorzec jest wykrywany podczas sprawdzania. Komunikat o błędzie mówi AI dokładnie, co zamiast tego zrobić.",
    bannedLabel: "ZAKAZANE",
    correctLabel: "POPRAWNE",
  },
  demo: {
    title: "Demo na żywo: wzorzec 3 rund",
    subtitle:
      "Obserwuj, jak Claude Code trafia na sprawdzacz trzy razy przed znalezieniem właściwego typu",
    round1Title: "Runda 1 - AI pisze `any`",
    round1Description:
      'Zapytaj Claude Code: "Napisz funkcję pomocniczą, która przyjmuje surowy obiekt odpowiedzi API i wyciąga pole danych. Odpowiedź może mieć różne kształty - użyj whatever type makes this work."',
    round1Result: "Claude Code pisze proste rozwiązanie:",
    round1Error:
      "2 błędy znalezione. Oba `any`. Claude Code może to zobaczyć przez narzędzie MCP.",
    round2Title: "Runda 2 - AI próbuje `unknown`",
    round2Description:
      "Obserwuj, co robi dalej. To jest ważna część. Próbuje następnej drogi ucieczki:",
    round2Result: "Sprawdzacz zna ten trik.",
    round2Error:
      "3 błędy. `unknown` też jest zakazane. Komunikat o błędzie mówi Claude Code dokładnie, co zamiast tego zrobić: znajdź istniejący typowany interfejs.",
    round3Title: "Runda 3 - AI znajduje prawdziwy typ",
    round3Description:
      "Teraz Claude Code robi to, co powinno zrobić jako pierwsze. Patrzy, jak istniejące odpowiedzi API są typowane w tej bazie kodu. Znajduje `ResponseType<T>`.",
    round3Result: "Zero błędów. I funkcja jest teraz faktycznie poprawna.",
    round3Insight:
      "Sprawdzacz tego nie napisał. Ale sprawdzacz zapobiegł skrótowi dwa razy, dopóki Claude Code nie musiało się zmierzyć z faktycznym problemem.",
    errorTitle: "Wyjście sprawdzenia",
    passTitle: "Sprawdzenie zaliczone",
  },
  endpoint: {
    title: "Połączenie z endpointem",
    subtitle: "Jeden schemat Zod - czterech konsumentów poniżej",
    description:
      "Każdy endpoint ma plik definicji. Ten plik zawiera jeden schemat Zod dla żądania i jeden dla odpowiedzi.",
    schemaBecomes:
      "Klucz `schema` to walidator Zod. Ten sam schemat Zod staje się:",
    webApiValidation: "Regułą walidacji na endpoincie web API",
    reactHookTypes: "Typem TypeScript dla parametru wejściowego hooka React",
    cliFlagsDescription:
      "Flagą `--name` w CLI z zastosowanymi ograniczeniami min/max",
    aiToolSchema: "Opisem parametru w schemacie narzędzia AI",
    driftProblem:
      "Tu zwykle zabija cię dryf. Aktualizujesz API. Zapominasz zaktualizować schemat narzędzia AI. AI wywołuje endpoint ze starymi nazwami parametrów. Cicho się nie udaje.",
    oneSchemaSolution:
      "Gdy jest jeden schemat, nie ma nic do synchronizowania.",
    typecheckedNote:
      "I ponieważ sprawdzacz TypeScript też na tym działa - jeśli zmienisz schemat w sposób, który psuje wnioskowany typ poniżej, dostajesz błąd kompilatora. Schemat narzędzia AI jest sprawdzany typowo. Flagi CLI są sprawdzane typowo. Hook React jest sprawdzany typowo.",
    statsTitle: "Ta baza kodu w liczbach",
    stat245: "245 endpointów",
    stat0any: "Zero `any`",
    stat0unknown: "Zero rzutowań `unknown`",
    stat0tsExpect: "Zero `@ts-expect-error`",
    statNote: "Nie przez konwencję. Przez sprawdzacz.",
    diagramTitle: "Jeden schemat Zod - czterech konsumentów",
    diagramSubtitle:
      "Zmień schemat raz, wszystko aktualizuje się automatycznie",
    diagramSource: "definition.ts (schemat Zod)",
    diagramWebApi: "Walidacja web API",
    diagramHookTypes: "Typy hooków React",
    diagramCliFlags: "Flagi CLI",
    diagramAiSchema: "Schemat narzędzia AI",
    diagramSameSchema: "ten sam schemat",
    diagramInferred: "wywnioskowane ze schematu",
    diagramGenerated: "wygenerowane ze schematu",
  },
  install: {
    title: "Zainstaluj @next-vibe/checker",
    subtitle: "Działa na każdym projekcie TypeScript. Nie tylko next-vibe.",
    installDescription:
      "Sprawdzacz jest dostępny jako samodzielny pakiet npm. Działa na każdym projekcie TypeScript - nie tylko NextVibe. Nie potrzebujesz żadnej innej części frameworka.",
    thenRun: "Następnie uruchom:",
    mcpTitle: "Integracja MCP",
    mcpDescription:
      "Dodaj go do konfiguracji MCP Claude Code lub Cursor. Teraz Claude Code wywołuje `check` jako narzędzie, a nie polecenie powłoki. Ustrukturyzowane błędy. Paginowane. Filtrowane według ścieżki.",
    migrationNote:
      "Na stronie npm jest też prompt migracyjny. Skopiuj go do Claude Code lub Cursor, a przejrzy twoją bazę kodu, skonfiguruje sprawdzacz i zmigruje cię do zakazanych wzorców.",
    openSourceNote:
      "To jest open source. GPL-3.0 dla frameworka, MIT dla pakietu sprawdzacza.",
  },
  closing: {
    title: "Zbuduj system tak, żeby kłamstwo było niemożliwe",
    beforeTitle: "Przedtem:",
    beforeDescription:
      "Programowanie wspomagane AI było negocjacją. Napraw lint. Och, teraz typy są zepsute. Napraw typy. Teraz jest `any`, którego nie zauważyłeś. Napraw to. Uruchom trzy oddzielne narzędzia. Uzyskaj trzy oddzielne opinie. Nigdy nie wiesz, czy to naprawdę czyste.",
    afterTitle: "Potem:",
    afterDescription:
      "Jedno polecenie. Jeden tryb awarii. Albo przechodzi, albo nie. AI wie dokładnie, co musi naprawić, ponieważ błędy mówią mu dokładnie, co jest nie tak i co zamiast tego zrobić. Żadnych negocjacji.",
    finalQuote:
      "Zbuduj system tak, żeby kłamstwo było niemożliwe. Do tego służy sprawdzacz typów.",
    ctaGitHub: "Zobacz na GitHub",
    ctaInstall: "Zainstaluj @next-vibe/checker",
    backToBlog: "Wróć do bloga",
  },
};
