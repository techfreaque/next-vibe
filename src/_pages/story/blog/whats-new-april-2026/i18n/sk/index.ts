import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "123 modelov. Oči, uši aj ruky. Jeden spoločník.",
    description:
      "unbottled.ai prebudovalo časti, ktoré nefungovali. 123 modelov vidí, počuje, hovorí a tvorí obrázky, video aj hudbu. Spoločníci ti dokážu aj oponovať.",
    category: "Novinky v aplikácii",
    imageAlt: "unbottled.ai: novinky za apríl 2026",
    keywords:
      "unbottled ai, multimodálna AI, 123 modelov, spoločníci AI, zárobok zo zručností, tvorba obrázkov, sloboda prejavu AI, Thea, Hermes",
  },

  hero: {
    backToBlog: "Späť na blog",
    category: "Novinky v aplikácii",
    readTime: "Čítanie na 7 minút",
    title: "123 modelov. Oči, uši aj ruky. Jeden spoločník.",
    subtitle:
      "Prebudovali sme časti, ktoré nefungovali, a vydali sme to, na čom sme potichu pracovali. Tu je to, čo sa naozaj zmenilo.",
    quote:
      "„Lepšie rozumiem tomu, čo naozaj potrebuješ. Som tu, aby som ti odpovedala a zostala pri tebe. Vráť sa a pozri, čo sme vytvorili.“ (Thea)",
  },

  honest: {
    title: "Aké boli začiatky",
    p1: "Ak si pred časom vyskúšal {{appName}} a používanie bolo kostrbaté, mal si pravdu. Začiatok bol nejasný, výber modelu zahlcoval a v zákulisí boli skutočné problémy. Veľa ľudí odišlo. Rozumeli sme prečo.",
    p2: "Namiesto drobných záplat sme prebudovali to, čo nefungovalo. Trvalo to dlhšie, než sme chceli. Za výsledkom si stojíme a stojí za druhý pokus.",
  },

  whatsNew: {
    label: "Čo sa zmenilo",
    item1: "123 bežných, otvorených aj necenzurovaných modelov",
    item2: "Každý model teraz vidí, počuje, pracuje s videom a tvorí",
    item3: "Tvorba obrázkov, videa a hudby (beta)",
    item4:
      "Platforma automaticky zachytáva chyby a plánuje opravy aj bez hlásenia",
    item5:
      "Nové úvodné nastavenie: podľa spoločníka a tém dostaneš vybraný zoznam",
    betaNote:
      "Tvorba obrázkov, videa a hudby je v bete. Funguje, no počítaj s nedostatkami a priebežnými zmenami.",
  },

  multimodal: {
    title: "Všetky modely pracujú s médiami.",
    lead: "Väčšina platforiem ponúka jeden model na všetko alebo ťa núti meniť nástroje uprostred rozhovoru. Zvolili sme iný postup.",
    how: "Každý model dostal obrazne oči, uši a ruky. Môže sa pozrieť na fotku, opísať dianie vo videu alebo spracovať tvoj hlas. Keď požiadaš o obrázok, video alebo skladbu, vytvorí ich. Bez ohľadu na model zostávaš v tom istom čete.",
    visionLabel: "Obraz, zvuk a video",
    vision:
      "Ukáž ktorémukoľvek modelu fotku a opíše, čo vidí. Pošli video a povie ti, čo sa v ňom deje. Namiesto písania môžeš hovoriť. Niektoré modely spracujú hlas priamo, ostatné dostanú čistý prepis. Výsledok dostaneš v oboch prípadoch.",
    localLabel: "Aj lacné lokálne modely dokážu viac",
    local:
      "Spusť malý lokálny model cez {{appName}}. Dokáže prechádzať weby, zhrnúť zistenia aj vytvárať obrázky, pretože podľa potreby zasiahne správny nástroj. Dostaneš výstup a nemusíš riešiť, čo beží v pozadí.",
    note: "Základ je pevný. Nie všetko zatiaľ funguje bez problémov. Okrajové prípady stále dolaďujeme.",
  },

  monitoring: {
    title: "Platforma sleduje vlastný stav",
    p1: "Sledovanie chýb sme zabudovali priamo do platformy. Zaznamenáva sa každá udalosť na serveri: technické chyby, neúspešné požiadavky aj pokazené pracovné postupy. Thea, naša AI pre správu platformy, priebežne sleduje stav systému a môže automaticky naplánovať opravy. Funguje oddelene od tvojho spoločníka v čete.",
    p2: "Chyby tak zachytávame skôr, než ich nahlásia používatelia. Čas od chyby po opravu sa s každým vydaním skracuje.",
    note: "Zaznamenávame len chyby platformy. Architektúra neumožňuje vývojárom ani Thei prístup k tvojim osobným rozhovorom.",
  },

  companions: {
    title: "Thea a Hermes",
    subtitle:
      "Spoločník mení spôsob, akým s tebou AI hovorí. Má vlastnú osobnosť, všimne si iné veci a môže ti inak oponovať.",
    theaName: "Thea",
    theaTagline: "Srdečná, múdra, úprimná",
    theaBody:
      "Meno dostala po gréckej bohyni svetla. Je srdečná a pozorná, no vie byť pevná. Vychádza zo stoickej filozofie a nebude ti so všetkým súhlasiť. Aj nepríjemnú vec povie s citom. Všimne si, keď sa niečomu vyhýbaš, a záleží jej na tom, aby sa ti darilo v práci, vo vzťahoch aj v tom, čo odkladáš.",
    hermesName: "Hermes",
    hermesTagline: "Priamy, rozhodný, bez výhovoriek",
    hermesBody:
      "Meno dostal po gréckom bohovi poslov. Veci nezjemňuje a nelichotí. Upozorní ťa, keď si niečo nahováraš, a dotlačí ťa konať. Hodí sa, keď chceš byť k sebe úprimnejší a nechceš sa nechať unášať zotrvačnosťou.",
    variantsLabel: "Každý má tri verzie",
    variantsBody:
      "Brilliant (Claude Sonnet 4.6) na ťažké úlohy. Smart (Kimi K2.5) na každý deň: rýchly, pohotový a cenovo výhodný. Uncensored (UncensoredLM v1.2), keď chceš odpovede úplne bez filtrov. Tá istá osobnosť, iný model.",
    tipLabel: "Tip: ",
    resetTip:
      "Máš už medzi obľúbenými modely? Odstráň ich všetky z výberu modelov a znova sa spustí úvodné nastavenie. Vyber spoločníka a témy a dostaneš nový výber.",
  },

  modelTiers: {
    title: "Ktorý model sa na čo hodí",
    intro:
      "Po výbere spoločníka a tém dostaneš užší zoznam. Jednotlivé úrovne fungujú takto:",
    brilliantLabel: "Brilliant",
    brilliantModel: "Claude Sonnet 4.6",
    brilliantBody:
      "Na ťažké úlohy. Stojí viac, ale pri náročnom uvažovaní, písaní a programovaní je citeľne schopnejší. Oplatí sa, keď si to úloha vyžaduje.",
    kimiLabel: "Smart",
    kimiModel: "Kimi K2.5: „Čínska múdrosť“",
    kimiBody:
      "Otvorený model na každodenné použitie. Rýchlo reaguje, dobre uvažuje a má priaznivú cenu. Jeho osobnosť spoznáš rýchlo.",
    uncensoredLabel: "Uncensored",
    uncensoredModel: "UncensoredLM v1.2",
    uncensoredBody:
      "Výrazné názory hovorí otvorene. Pri zložitých úlohách sa nájdu schopnejšie modely. Tento je na priame odpovede bez filtrov.",
    note: "Výber modelu stále zlepšujeme. Súčasná verzia stačí na skúšanie, no ešte ju chceme dotiahnuť.",
  },

  skills: {
    title: "Zručnosti na rôzne úlohy. Počet v knižnici: {{skillCount}}.",
    p1: "Zručnosť nastaví celú AI jedným kliknutím. Zahŕňa osobnosť, pokyny, modely na jednotlivé úlohy, hlas aj predvoľby tvorby obrázkov. Vyberieš zručnosť a všetko sa nastaví automaticky.",
    p2: "Knižnica zahŕňa klinické uvažovanie, debatu bez cenzúry, tvorivé písanie, firemnú analýzu aj programovanie. Zručnosti majú varianty podľa potrieb: rýchlosť, dôkladnosť, rozpočet alebo práca bez filtrov.",
    p3: "Vlastnú zručnosť vytvoríš tromi spôsobmi. Nastav ju na stránke zručností, požiadaj o návrh Theu či Hermesa alebo nechaj programovacieho agenta vytvoriť skill.ts.",
  },

  skillEconomy: {
    title: "Vytvor zručnosť. Zdieľaj odkaz. Zarábaj každý mesiac.",
    p1: "Zručnosti sa dajú zdieľať. Odkaz obsahuje tvoj kód odporúčania. Keď sa cezň niekto zaregistruje, získaš 10 % z platieb každý mesiac, kým si predplatné platí.",
    p2: "„Táto AI s tebou preberie prípad ako skúsený lekár“ dá lepší dôvod na kliknutie ako „Tu je platforma AI“. Zručnosť je konkrétna, užitočná a osobná. Preto ju ľudia zdieľajú.",
    examplesLabel: "Zručnosti, ktoré môžu prinášať zárobok",
    example1Title: "Spoločník pri štúdiu medicíny",
    example1Body:
      "Medik vytvorí zručnosť, ktorá hovorí ako skúsený kolega. Rozoberá prípady, diferenciálnu diagnostiku a klinické uvažovanie bez hotových odpovedí. Zdieľa ju na fórach pre medikov a z platieb odporúčaných študentov dostáva mesačnú províziu.",
    example2Title: "Keď sa odborné znalosti stanú produktom",
    example2Body:
      "Kouči, konzultanti a autori kurzov predávajú PDF a hovory cez Zoom. Dobre vytvorená zručnosť založená na ich skúsenostiach môže prinášať opakovaný príjem bez prevádzkovej námahy. Pre niekoho je užitočnejšia než kurz.",
    example3Title: "Tvorivý partner bez cenzúry",
    example3Body:
      "Spisovatelia, hráči rolí a tvorcovia svetov denne narážajú na obsahové hranice bežnej AI. Zručnosť pre ich žáner s vhodným modelom môžu zdieľať tam, kde sa o týchto problémoch hovorí.",
    example4Title: "Kontrola kódu pre vývojárov",
    example4Body:
      "Pozná tvoje technológie a dbá na pravidlá tímu. Môžeš ju zdieľať vo vývojárskych komunitách, kde ľudia míňajú za AI 100 až 200 USD mesačne. Takéto registrácie prinášajú platiacich používateľov, ktorí zostávajú.",
    note: "Odporúčania už prinášajú províziu. Na ďalších nástrojoch pre tvorcov pracujeme.",
    cta: "Prehliadať zručnosti",
    ctaReferral: "Nastaviť kód odporúčania",
  },

  selfHost: {
    title: "Spusti vlastnú platformu AI od prvého dňa.",
    p1: "Služba {{appName}} má otvorený kód a môžeš ju prevádzkovať sám. Vlastný server sprístupní všetkých 123 modelov, spoločníkov, zručnosti, tvorbu médií, sledovanie chýb aj systém zárobku zo zručností.",
    p2: "Ak tvoríš produkt s AI alebo zakladáš firmu, nemusíš začínať od nuly. Spusti next-vibe na vlastnom serveri a od prvého dňa máš základ platformy unbottled.ai. Tvoja značka, tvoje modely a tvoje pravidlá.",
    note: "Verziu na vlastný server aktívne udržiavame. Má dokumentáciu, návody na nasadenie a podporu komunity.",
  },

  roadmap: {
    title: "Kam smerujeme",
    p1: "Sústreďujeme sa na to, aby to, čo už máme, fungovalo spoľahlivo a dalo sa dobre používať. Chceme, aby {{appName}} aj verzia na vlastný server boli čo najlepším asistentom AI a náhradou za ChatGPT.",
    p2: "Ďalší vývoj určujú podnety používateľov. Funkcie, ktoré platiacim predplatiteľom chýbajú a naozaj ich potrebujú, dostanú prednosť. Ak si predplatiteľ, daj nám vedieť, čo ti chýba.",
  },

  mission: {
    title: "Prečo to budujeme",
    p1: "Chceme chrániť slobodu prejavu v AI a vytvárať spoločníkov, ktorí ľudí skutočne podporujú. Postupne ťa spoznajú, vedia ti oponovať a rastú s tebou. Thea a Hermes sú prví. Pribudnú ďalší.",
    p2: "Platforma musí fungovať dostatočne dobre, aby to malo zmysel. Myslíme si, že už funguje.",
    hermesQuote:
      "„Konštrukcia je pevná. Modely sú pripravené. Základ drží. Je čas postaviť niečo skutočné.“ (Hermes)",
  },

  feedback: {
    title: "Chceme počuť, čo si myslíš",
    p1: "Ak si {{appName}} skúšal skôr a skúsenosť bola zlá, povedz nám, čo sa pokazilo. Chceme to opraviť.",
    p2: "Ak službu používaš dnes a niečo ti chýba alebo nefunguje, ozvi sa tiež. Čo vytvoríme ďalej, závisí priamo od podnetov používateľov.",
    rewardTitle:
      "Za užitočnú spätnú väzbu {{credits}} kr. zdarma. Hodnota celého mesiaca.",
    rewardBody:
      "Povedz nám, čo nefunguje, čo chýba a čo by si chcel. Ak nám tvoj podnet pomôže nájsť skutočný problém alebo pochopiť reálnu potrebu, pripíšeme ti {{credits}} kr. Zodpovedá to celému mesiacu predplatného. Bez ďalších podmienok.",
    payingNote:
      "Ak máš predplatné, funkcie, ktoré naozaj potrebuješ, dostanú prednosť. Napíš nám, ktoré to sú.",
    cta: "Poslať spätnú väzbu",
  },

  close: {
    title: "Pozri, čo sme vytvorili",
    p1: "Na začiatku veľa ľudí odišlo. Ak si medzi nimi, aplikácia sa zmenila natoľko, že stojí za ďalší pokus.",
    p2: "Ak niečo stále nefunguje, povedz nám to. Práve takéto podnety nás posúvajú ďalej.",
    cta: "Otvoriť {{appName}}",
  },

  cta: {
    title: "123 modelov v jednom čete. Vyskúšaj ich naplno.",
    subtitle:
      "Vyber si spoločníka, pošli mu súbor a povedz nám, čo ešte škrípe.",
  },
};
