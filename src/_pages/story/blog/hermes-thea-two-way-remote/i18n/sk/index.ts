import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Hermes a Thea: obojsmerné vlákna | {{appName}}",
    description:
      "Lokálna a cloudová AI si môžu navzájom spracovať vlákna. Ak vzdialenej inštancii chýba kľúč API, pôvodná spracovanie dokončí.",
    category: "Hermes a Thea",
    imageAlt: "Hermes a Thea, dve prepojené inštancie next-vibe",
    keywords:
      "Hermes, Thea, next-vibe, vzdialené vlákna, AI na vlastnom serveri, reverzný WebSocket, náhradné spracovanie bez kľúča API, {{appName}}",
  },
  hero: {
    backToBlog: "Späť na blog",
    category: "Hermes a Thea",
    readTime: "6 min čítania",
    title: "Dve AI. Jeden rozhovor. Oba smery.",
    subtitle:
      "Hermes beží na tvojom počítači, Thea na serveri. Obe si už vedia odovzdať vlákno. Chýbajúci kľúč API odpoveď nezastaví.",
  },
  intro: {
    p1: "next-vibe beží na notebooku, na VPS aj na oboch naraz. Prepoj dve inštancie a budú fungovať ako jeden systém. My tie svoje voláme Hermes a Thea.",
    p2: "Vzdialené vlákna teraz bežia v oboch smeroch. Ak na jednej inštancii chýba kľúč poskytovateľa, druhá odpoveď dokončí.",
  },
  who: {
    title: "Zoznám sa s dvojicou",
    intro: "Rovnaký kód, rôzne úlohy.",
    hermes: {
      label: "Lokálne",
      title: "Hermes",
      body: "Beží na tvojom počítači, kde má prístup k súborom, terminálu aj programovacím agentom. Používaš ho pri každodennej práci.",
    },
    thea: {
      label: "Cloud",
      title: "Thea",
      body: "Beží na serveri. Je stále online a dostupná odkiaľkoľvek. Dohliada na platformu a zadáva prácu ďalej.",
    },
    note: "Každá inštancia vlastní svoje údaje a úlohy. Spojenie medzi nimi prenáša udalosti.",
  },
  twoWay: {
    title: "Vlákna teraz fungujú v oboch smeroch",
    intro:
      "Vlákna vo vzdialených priečinkoch aj súkromné vlákna môže spracovať druhá inštancia. Thea ich môže odovzdať Hermesovi a Hermes Thee.",
    p1: "Presuň vlákno do vzdialeného priečinka. Druhá inštancia prevezme celé spracovanie správy vrátane modelu, systémového zadania a nástrojov. Ty ďalej píšeš tam, kde si. Priebeh četu sa synchronizuje späť.",
    stepsTitle: "Jedna správa od zadania po odpoveď",
    step1Title: "Napíšeš správu",
    step1Body: "Vo vzdialenom vlákne na inštancii Hermes.",
    step2Title: "Spojenie správu odošle",
    step2Body:
      "Cez jeden trvalý WebSocket alebo priamym volaním HTTP, ak je druhá inštancia verejne dostupná.",
    step3Title: "Thea spracuje požiadavku",
    step3Body: "Použije vlastný model, zadanie aj nástroje.",
    step4Title: "Nástroje bežia na domovskej inštancii",
    step4Body:
      "Ak nástroj existuje iba na Hermesovi, zavolá sa na ňom. Výsledok sa vráti do spracovania na Thee.",
    step5Title: "Obe strany dostanú odpoveď",
    step5Body: "Dokončený čet sa synchronizuje do tvojej kópie.",
  },
  keyless: {
    title: "Správa sa spracuje aj bez kľúča API na druhej strane",
    intro:
      "Inštancia, ktorá spracúva správu, potrebuje kľúč API poskytovateľa modelu. Kľúč nemusí byť na oboch stranách.",
    p1: "Pred prevzatím správy si inštancia overí, či má kľúč poskytovateľa. Ak kľúč chýba, ihneď vráti jednoznačný príznak. Vlákno nezostane visieť ani čiastočne zapísané.",
    p2: "Volajúca strana rozpozná príznak, vráti zmeny v evidencii prenosu a spracuje správu sama. Naďalej použije zadanie a nástroje vzdialenej inštancie. Výsledky volaní nástrojov sa vracajú cez spojenie.",
    calloutTitle:
      "Režim poskytovateľa modelu nepotrebuje kľúč na tvojej strane",
    calloutBody:
      "Keď ako poskytovateľa použiješ pripojenú inštanciu, požiadavky na model putujú cez spojenie. Na svojej strane kľúč poskytovateľa nepotrebuješ.",
    scenarioTitle: "Kde sa správa spracuje?",
    scenario1Label: "Vzdialená inštancia má kľúč",
    scenario1Body:
      "Správu spracuje vzdialená inštancia. Volania nástrojov a ich výsledky prejdú cez spojenie.",
    scenario2Label: "Vzdialená inštancia nemá kľúč",
    scenario2Body:
      "Vzdialená strana hneď oznámi chýbajúci kľúč. Správu spracuje volajúca strana so zadaním a nástrojmi vzdialenej.",
    scenario3Label: "Režim poskytovateľa modelu",
    scenario3Body:
      "Model beží na inštancii poskytovateľa. Volajúci kľúč nepotrebuje.",
  },
  underTheHood: {
    title: "Technické podrobnosti",
    intro: "Pre tých, ktorí čítajú diff.",
    transport:
      "Spôsob prenosu sa dohodne pri pripájaní automaticky. Cieľová inštancia overí dostupnosť tej, ktorá spojenie začala, autorizovanou kontrolou stavu s limitom 5 sekúnd. Ak je dostupná, použije sa priame HTTP. Za NAT otvorí nedostupná strana jeden odchádzajúci WebSocket. Cezň sa prenášajú všetky udalosti naraz.",
    reconnect:
      "Konektor sa opätovne pripája s exponenciálne rastúcim odstupom od 1 do 30 sekúnd. Pri každom pokuse načíta údaje spojenia nanovo. Túto časť sme vylepšili.",
    fixesTitle: "Ďalšie opravy v tejto verzii",
    fix1: "Ak je rámec určený návštevníkovi, ktorého inštancia už nepozná, zahodí ho a zapíše upozornenie. Pomôže opätovné overenie spojenia.",
    fix2: "Časové pečiatky databázy sú v UTC v Postgrese aj PGlite. Záznamy s automaticky doplneným časom sa preto medzi inštanciami zoradia správne.",
    fix3: "Zapisovač streamu vopred nastaví identifikátor vlákna. Druhá inštancia už nezahodí udalosti pre prázdny identifikátor.",
    fix4: "Obnovené spracovanie sa synchronizuje s druhou inštanciou. Dodatočne doplnené výsledky nástrojov sa dostanú aj do zrkadleného vlákna.",
    codeCaption: "Príznak, ktorý vráti prijímateľ bez kľúča:",
  },
  tryIt: {
    title: "Vyskúšať",
    p1: "Spusti vlastnú inštanciu a pridaj prepojenie v časti Správa → Vzdialené pripojenia. Vytvoriť ho môže iba správca. Na druhej strane vznikne záznam automaticky.",
  },
  cta: {
    title: "Spusti vlastného Hermesa",
    subtitle:
      "Spusti next-vibe na svojom počítači, pripoj ho k serveru a rozdeľ prácu medzi oba.",
    selfHost: "Návod na vlastný hosting",
    github: "Pozrieť si kód",
  },
};
