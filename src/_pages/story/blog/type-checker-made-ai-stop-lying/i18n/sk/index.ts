import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Kontrola typov, po ktorej mi AI prestala klamať | next-vibe",
    description:
      "AI obchádzala typové chyby cez `any` a eslint-disable. Takto sme opravili spätnú väzbu v @next-vibe/checker.",
    category: "TypeScript",
    imageAlt: "Kontrola typov, ktorá prinútila AI prestať klamať",
    keywords:
      "TypeScript, kontrola typov, programovanie s AI, ESLint, Oxlint, typ any, typová bezpečnosť, Claude Code, next-vibe",
  },
  hero: {
    label: "TypeScript",
    readTime: "10 min čítania",
    title: "Vytvoril som kontrolu typov. AI mi prestala klamať.",
    subtitle:
      "AI použije `any`, aby zakryla typovú chybu. Pridá eslint-disable a tvrdí, že je hotovo. Takto sme opravili spätnú väzbu.",
    quoteAiLies: "AI ti klame, keď jej to dovolíš.",
  },
  problem: {
    title: "Keď kontrola nedáva úplnú spätnú väzbu",
    description:
      "Požiadaš Claude Code o novú funkciu. Doplní ju. ESLint prejde, TypeScript nájde chyby. Požiadaš o opravu. TypeScript prejde, teraz zlyhá ESLint. Takto trikrát dokola. A zakaždým AI sebavedomo povie: „Opravené.“",
    fixLabel: "Chyba zostala.",
    fixDescription:
      "Hasili sme jednu chybu za druhou. Nástroj spúšťal vždy len jeden linter a celkový stav mu unikal.",
    escapeHatch:
      "AI „opraví“ chybu TypeScriptu jedným riadkom a oznámi ti: „Typová chyba je vyriešená.“",
    smokeDetector:
      "Technicky áno. Takisto vyriešiš požiarny poplach, keď detektor dymu prelepíš páskou.",
    introducingChecker:
      "Práve tomu má @next-vibe/checker zabrániť. Preto som ho vytvoril.",
  },
  anyProblem: {
    title: "Problém s `any`",
    subtitle: "Prečo je 98 % typovej bezpečnosti ako 0 %",
    graphDescription:
      "Typový systém TypeScriptu je graf. Typ sa prenáša od definície až po miesto použitia. Ak funkcia vracia `string`, volajúca funkcia vie, že dostane reťazec. Kompilátor kontroluje celý reťazec závislostí.",
    holeInGraph: "`any` je diera v grafe.",
    holeDescription:
      "Premennou typu `any` povieš kompilátoru, aby tu prestal kontrolovať typy. Vypadne aj kontrola všetkého, čo na tejto premennej závisí. Chyba sa neprejaví tam, kde si použil `any`. Prejaví sa o tri súbory ďalej, keď nesúvisiaca úprava poruší predpoklad, ktorý kompilátor nikdy nekontroloval.",
    zeroErrors:
      "Nula chýb TypeScriptu nič neznamená, ak máš 47 nekontrolovaných použití typu `any`.",
    doubleAssertion:
      "`as unknown as Whatever` je ešte horšie. Dvojitým pretypovaním kompilátoru v podstate povieš: „Viem, že tento typ nesedí, ale aj tak na ňom trvám.“ AI túto skratku používa najradšej.",
    bannedTitle: "V tomto kóde sú zakázané tieto vzory",
    bannedNotWarnings:
      "Porušenie pravidla je chyba. Kontrola zlyhá a Claude Code musí opraviť príčinu, aby zmenu mohol odovzdať.",
    psychologyNote:
      "Je to technické aj psychologické rozhodnutie. Modely AI berú upozornenia ako nepovinné. Chyby ich prinútia reagovať.",
    infectionDiagramSubtitle:
      "Jediné `any` sa šíri grafom a narúša odvodzovanie typov v závislom kóde.",
    counterZeroErrors: "Chyby TypeScriptu",
    counterAnyUsages: "Použitia `any`",
  },
  checker: {
    title: "Predstavujem @next-vibe/checker",
    subtitle: "Jeden príkaz, tri nástroje. Kontrolu neobídeš.",
    commandDescription:
      "To je celý príkaz. Spustí naraz tri nástroje a vráti spoločný zoznam chýb.",
    oxlintDescription:
      "Linter napísaný v Ruste. Stovky pravidiel vyhodnotí v milisekundách aj pri rozsiahlych projektoch.",
    eslintDescription:
      "Dopĺňa to, čo Oxlint zatiaľ nepokrýva: kontrolu hookov Reactu, pravidlá kompilátora Reactu a poradie importov.",
    tsDescription:
      "Úplná kontrola typov v celom grafe závislostí vrátane súborov, ktoré práve neupravuješ.",
    timingNote:
      "Úplná kontrola typov v tomto projekte so 4 400 súbormi trvá približne 12 sekúnd. Oxlint potrebuje necelú sekundu, ESLint niekoľko sekúnd. Pri súbežnom spustení trvá celá kontrola 12 sekúnd.",
    mcpNote:
      "Príkaz `vibe-check mcp` navyše spustí server MCP s nástrojom `check`. AI volá nástroj priamo a dostane štruktúrované chyby. Výsledky sa dajú stránkovať aj filtrovať podľa cesty.",
    parallel: "súbežne",
    unifiedErrors: "Spoločný zoznam chýb",
    unifiedErrorsDescription: "Jeden výstup. Opravuj, kým je zoznam prázdny.",
  },
  plugins: {
    title: "Vlastné doplnky",
    linterIsDocumentation:
      "Linter nahrádza dokumentáciu a jej pravidlá zároveň vynucuje.",
    jsxPluginTitle: "Doplnok jsx-capitalization",
    jsxPluginDescription:
      "Označí prvky JSX s malým začiatočným písmenom a v chybovom hlásení presne uvedie, čo máš importovať.",
    jsxPluginInsight:
      "Claude Code som nepísal dokumentáciu k `next-vibe-ui` ani som tento pokyn nepridal do systémového zadania. Keď prvýkrát použije v komponente `<div>`, kontrola ohlási chybu s presnou cestou importu. Claude Code si ju prečíta, použije správny import a zapamätá si pravidlo.",
    restrictedSyntaxTitle: "Doplnok restricted-syntax",
    restrictedSyntaxDescription: "Zakazuje tri veci",
    throwBanTitle: "Príkazy `throw`",
    throwBanDescription:
      "Hlásenie odporučí použiť vzor `ResponseType<T>`. Claude Code naň narazí, prečíta si ho, vyhľadá `ResponseType` a počas zvyšku úlohy spracúva chyby správnym spôsobom.",
    unknownBanTitle: "Samotný typ `unknown`",
    unknownBanDescription:
      "„Nahraď typ `unknown` existujúcim typovaným rozhraním. Použi typy projektu bez pretypovania alebo vytvárania náhrad.“ Claude Code tak nemôže kontrolu obísť všeobecným typom.",
    objectBanTitle: "Samotný typ `object`",
    objectBanDescription:
      "`object` je takmer vždy zlá voľba. Ak poznáš štruktúru údajov, napíš rozhranie. Inak použi `Record<string, SomeType>`. Samotný `object` je signál, že AI vzdala hľadanie typu.",
    bannedPatternsTitle: "Zakázané konštrukcie",
    bannedLabel: "ZAKÁZANÉ",
    correctLabel: "SPRÁVNE",
  },
  demo: {
    title: "Živá ukážka v 3 kolách",
    subtitle: "Claude Code narazí na kontrolu trikrát, kým nájde správny typ.",
    round1Title: "1. kolo: AI použije `any`",
    round1Description:
      "Požiadaj Claude Code: „Napíš pomocnú funkciu, ktorá dostane nespracovanú odpoveď API a vyberie pole data. Odpoveď môže mať rôznu štruktúru. Použi typ, s ktorým to bude fungovať.“",
    round1Result: "Claude Code zvolí najjednoduchšie riešenie.",
    round2Title: "2. kolo: AI skúsi `unknown`",
    round2Description:
      "Teraz príde podstatná časť. Claude Code skúsi ďalšiu skratku.",
    round2Result: "Aj túto skratku kontrola odhalí.",
    round3Title: "3. kolo: AI nájde správny typ",
    round3Description:
      "Claude Code konečne spraví to, čo mal urobiť hneď. Pozrie sa, ako projekt typuje existujúce odpovede API, a nájde `ResponseType<T>`.",
    round3Result: "Nula chýb. Funkcia je teraz naozaj správna.",
    round3Insight:
      "Kontrola dvakrát zablokovala skratku. Claude Code tak musel vyriešiť samotný problém a funkciu napísal sám.",
  },
  endpoint: {
    title: "Ako to súvisí s koncovými bodmi",
    subtitle: "Jedna schéma Zod, štyri miesta použitia",
    description:
      "Každý koncový bod má súbor s definíciou. Obsahuje jednu schému Zod pre požiadavku a druhú pre odpoveď.",
    schemaBecomes:
      "Kľúč `schema` obsahuje validátor Zod. Tá istá schéma určuje nasledujúce pravidlá a typy.",
    webApiValidation: "Pravidlo validácie koncového bodu webového API",
    reactHookTypes: "Typ TypeScriptu pre vstupný parameter hooku Reactu",
    cliFlagsDescription:
      "Prepínač `--name` v CLI s nastavenými dolnými a hornými hranicami",
    aiToolSchema: "Opis parametra v schéme nástroja AI",
    driftProblem:
      "Tu sa zvyčajne rozídu verzie. Zmeníš API a zabudneš upraviť schému nástroja AI. Agent volá koncový bod so starými názvami parametrov. Volanie potichu zlyhá.",
    oneSchemaSolution: "Pri jednej schéme odpadá synchronizácia.",
    typecheckedNote:
      "Aj tu beží kontrola TypeScriptu. Ak zmenou schémy porušíš odvodený typ v závislom kóde, kompilátor zahlási chybu. Kontrolou typov prejdú schéma nástroja AI, prepínače CLI aj hook Reactu.",
    stat245: "245 koncových bodov",
    stat0any: "Ani jedno `any`",
    stat0unknown: "Ani jedno pretypovanie na `unknown`",
    stat0tsExpect: "Ani jedno `@ts-expect-error`",
    statNote: "Tieto pravidlá vynucuje kontrola typov.",
  },
  install: {
    title: "Získaj @next-vibe/checker",
    subtitle: "Funguje v každom projekte TypeScript.",
    installDescription:
      "Kontrola sa dá nainštalovať ako samostatný balík npm. Funguje v každom projekte TypeScript. Ďalšie časti rámca NextVibe nepotrebuješ.",
    thenRun: "Potom spusti:",
    mcpTitle: "Integrácia s MCP",
    mcpDescription:
      "Pridaj ho do konfigurácie MCP v Claude Code alebo Cursore. Claude Code potom volá `check` ako nástroj. Dostane štruktúrované chyby so stránkovaním a filtrom podľa cesty.",
    migrationNote:
      "Na stránke npm nájdeš aj zadanie na migráciu. Skopíruj ho do Claude Code alebo Cursoru. Nástroj preverí projekt, nakonfiguruje kontrolu a upraví kód tak, aby v ňom nezostali zakázané vzory.",
    openSourceNote:
      "Zdrojový kód je otvorený. Rámec používa GPL-3.0 a balík na kontrolu MIT.",
  },
  closing: {
    title: "Nastav systém tak, aby sa v ňom nedalo klamať",
    beforeTitle: "Predtým",
    beforeDescription:
      "Vývoj s AI pripomínal vyjednávanie. Oprav lint. Teraz neprechádzajú typy. Oprav typy. Aha, objavilo sa `any`, ktoré ti uniklo. Oprav aj to. Spusti tri nástroje, dostaneš tri rôzne výsledky. Stále nevieš, či je kód v poriadku.",
    afterTitle: "Potom",
    afterDescription:
      "Jeden príkaz a jeden výsledok. Buď prejde, alebo zlyhá. Z hlásení AI presne vie, kde je chyba a čo spraviť. Vyjednávanie odpadá.",
    finalQuote:
      "Nastav systém tak, aby sa v ňom nedalo klamať. Na to je kontrola typov.",
    ctaGitHub: "Zobraziť na GitHube",
    ctaInstall: "Nainštalovať @next-vibe/checker",
    backToBlog: "Späť na blog",
  },
};
