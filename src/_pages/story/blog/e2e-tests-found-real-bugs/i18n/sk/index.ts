import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Testovací robot odhalil osem bezpečnostných chýb",
    description:
      "Testy v skutočnom prehliadači prešli každý koncový bod dostupný používateľom. Toto odhalili na reálnych stránkach.",
    category: "Vývoj",
    imageAlt: "End-to-end testy aplikácie {{appName}} v reálnom prehliadači",
    keywords:
      "end-to-end testovanie, Playwright, bezpečnosť, SSRF, otvorené presmerovanie, next-vibe, {{appName}}",
  },
  hero: {
    backToBlog: "Späť na blog",
    category: "Vývoj",
    readTime: "7 min čítania",
    title:
      "Testovací robot preklikal stránku. Odhalil osem bezpečnostných chýb.",
    subtitle:
      "Začali sme testovať celé stránky. Skutočný prehliadač, server a kliknutia pre každý koncový bod, ktorý môže použiť zákazník.",
  },
  intro: {
    lead: "Kód prešiel typovou kontrolou, lintom aj jednotkovými testami. Do produkcie sa napriek tomu dostali obyčajné chyby. Formulár na obnovu hesla ignoroval potvrdenie nového hesla. Odkazy na faktúry nikam neviedli. Vo verejnom prehľade sa objavovali zmazané vlákna.",
    p1: "Každá chyba vznikla až pri prepojení komponentov. Samotná funkcia fungovala, stránka okolo nej zlyhala. Vytvorili sme preto testovací nástroj, ktorý sleduje, čo používateľ skutočne vidí a odosiela.",
  },
  why: {
    title: "Prečo testovať skutočnú stránku?",
    intro:
      "Každá vrstva testovania odhalí iný druh chyby. Až tá posledná ukáže, čo skutočne vidí používateľ.",
    unit: {
      label: "Jednotkový test",
      title: "Overuje jednu funkciu",
      body: "Je rýchly a nenáročný. Nesprávnu adresu, zle pomenované pole alebo tlačidlo, ktoré nič neodošle, neodhalí.",
    },
    api: {
      label: "Test API",
      title: "Overuje jednu požiadavku",
      body: "Potvrdí, že server odpovie. Či stránka túto požiadavku odošle a odpoveď zobrazí, zistíš až v prehliadači.",
    },
    e2e: {
      label: "End-to-end test",
      title: "Overuje celý postup",
      body: "Otvorí stránku v Chromium, vyplní formulár a odošle ho ako používateľ. Potom zachytí odpoveď servera. Testuje tak rovnaký postup, akým prejde zákazník.",
    },
  },
  how: {
    title: "Ako funguje testovací nástroj",
    intro:
      "Playwright spúšťame cez bun test a využívame definície koncových bodov next-vibe. Definícia pozná všetky polia, takže v teste ich už nemusíme opisovať.",
    step1: {
      title: "Otvor skutočnú stránku",
      body: "Test otvorí stránku, ktorú používa zákazník, napríklad /user/login alebo /story/framework. Pred vypĺňaním formulára počká, kým ho prevezme React.",
    },
    step2: {
      title: "Vyplň polia typovanými hodnotami",
      body: "Do testu stačí zadať hodnoty. Ovládače polí podľa definície vyplnia viditeľný formulár, vyberú možnosť podľa jej názvu alebo priložia súbor.",
    },
    step3: {
      title: "Zachyť skutočnú požiadavku",
      body: "Po odoslaní test zachytí telo požiadavky, stavový kód aj odpoveď. Overí, že odoslané hodnoty presne zodpovedajú vyplneným poliam.",
    },
    step4: {
      title: "Nahraj raz, používaj opakovane",
      body: "Pri prvom spustení si každý test zaznamená volania platených poskytovateľov AI, obrázkov, hudby a videa. Pri ďalších spusteniach používa záznam. Výsledky sú opakovateľné a volania sa znovu neúčtujú.",
    },
    step5: {
      title: "Zmeraj pokrytie",
      body: "Prehľad pokrytia sleduje všetky verejné koncové body. Pre každý eviduje úspešný prípad aj jedno odmietnutie. Chýbajúce testy vidíš hneď.",
    },
    codeCaption: "Úplný test bez selektorov a simulovaných odpovedí.",
  },
  numbers: {
    title: "Výsledky",
    suites: "testovacích sád",
    covered: "úplne pokrytých verejných koncových bodov",
    security: "odstránených bezpečnostných chýb",
    note: "Na prvý záznam zostávajúcich koncových bodov potrebujeme platené kľúče poskytovateľov vyhľadávania, získavania obsahu z webu a spracovania reči.",
  },
  security: {
    title: "Odhalené bezpečnostné chyby",
    intro:
      "Typová kontrola ani jednotkové testy tieto chyby nezachytili. V skutočnom prehliadači sa prejavili hneď, ako test prešiel celým postupom.",
    openRedirect: {
      title: "Otvorené presmerovanie na /track",
      body: "Naša doména umožňovala presmerovanie na ľubovoľný externý web. Externé ciele teraz vyžadujú podpis HMAC.",
    },
    ssrf: {
      title: "SSRF cez adresy zadané používateľmi",
      body: "Adresy zadané AI mohli smerovať na interné služby. Ochrana teraz overuje DNS a každý krok presmerovania.",
    },
    ssrCache: {
      title: "Spoločná serverová vyrovnávacia pamäť",
      body: "Vyrovnávacia pamäť dotazov pri vykresľovaní na serveri mohla preniesť údaje jedného používateľa do stránky iného. Každá požiadavka má teraz vlastnú pamäť.",
    },
    systemPrompt: {
      title: "Ladenie systémového zadania sprístupňovalo cudzie vlákna",
      body: "Ladiaci koncový bod nekontroloval vlastníka vlákna. Teraz ho overuje.",
    },
    publicFeed: {
      title: "Verejný prehľad zobrazoval skryté vlákna",
      body: "Vo verejnom prehľade sa zobrazovali skryté a zmazané vlákna. Teraz sú odfiltrované.",
    },
    loginOptions: {
      title: "Možnosti prihlásenia prezrádzali existenciu účtov",
      body: "Odpoveď s možnosťami prihlásenia prezrádzala, či k e-mailovej adrese existuje účet. Túto informáciu sme z odpovede odstránili.",
    },
    resetPassword: {
      title: "Obnova hesla ignorovala potvrdenie",
      body: "Formulár na obnovu hesla ignoroval pole na potvrdenie nového hesla. Ak sa hodnoty nezhodujú, obnovu teraz zamietne.",
    },
    privateFiles: {
      title: "Verejná vyrovnávacia pamäť mohla ukladať súkromné súbory",
      body: "Súkromné súbory sa odosielali s hlavičkou Cache-Control: public, takže ich mohli ukladať aj zdieľané vyrovnávacie pamäte. Teraz sa odosielajú ako súkromné.",
    },
  },
  broken: {
    title: "Ďalšie chyby vo funkciách",
    intro: "Tieto chyby používateľom kazili prácu bez zjavnej príčiny.",
    items: {
      attachments:
        "Odkazy na prílohy v čete aj hlásenia chýb z klienta vracali stav 404.",
      permissions:
        "Aplikácia nenačítala oprávnenia koreňových priečinkov. Používatelia preto nemohli publikovať v sekcii Zdieľané.",
      embed: "Vložený widget sa vôbec nezobrazil.",
      invoices: "Odkazy v e-mailoch s faktúrami vracali stav 404.",
      models: "Stránka s modelmi sa nedala používať.",
      music: "Generovanie hudby cez OpenRouter zlyhávalo.",
      fixtures:
        "Izolácia testovacích dát nezabránila plateným volaniam na skutočné služby.",
      pglite:
        "Lokálne databázy PGlite vracali z INSERT…RETURNING nesprávne riadky.",
      pagination: "Návštevníkom nefungovalo stránkovanie na /tools.",
    },
    footer: "Opravili sme aj nepreložené texty a ďalšie chyby vo widgetoch.",
  },
  closing: {
    title: "Čo sa pre teba mení",
    p1: "Registráciu, prihlásenie, platby, čet, generovanie aj predplatné teraz overuje test v skutočnom prehliadači. Po každej zmene robot prejde tým istým postupom, akým prechádzaš ty.",
    p2: "Testovací nástroj je súčasťou next-vibe. Ak na tomto rámci staviaš, môžeš ho použiť aj na svoje koncové body.",
  },
  cta: {
    title: "Pozri si testovací nástroj a použi ho vo vlastnom kóde",
    subtitle:
      "End-to-end testovanie je otvorenou súčasťou next-vibe. Pre každú funkciu stačí jeden testovací súbor vedľa jej definície.",
    github: "Zobraziť na GitHube",
    framework: "Preskúmať next-vibe",
  },
};
