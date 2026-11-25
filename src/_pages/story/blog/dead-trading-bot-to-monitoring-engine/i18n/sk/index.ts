import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Z obchodného bota vznikol dohľad nad platformou | next-vibe",
    description:
      "Odložený obchodný bot sa stal základom monitorovania v next-vibe. DataSource, Indicator, Evaluator a Action. Každý uzol je koncový bod.",
    category: "Vibe Sense",
    imageAlt: "Dátový tok na monitorovanie vo Vibe Sense v next-vibe",
    keywords:
      "vibe sense, monitorovanie, obchodný bot, koncové body, EMA, dátový tok, next-vibe, TypeScript",
    ogTitle: "Z odloženého obchodného bota vznikol dohľad nad platformou",
    ogDescription:
      "Architektúra obchodného bota bola správna. Pôvodne som ju použil na nesprávnom mieste.",
    twitterTitle: "Z obchodného bota vzniklo monitorovanie platformy",
    twitterDescription:
      "Každý uzol je koncový bod. Tok údajov vzniká ich vzájomným volaním.",
  },
  backToBlog: "Späť na blog",
  hero: {
    eyebrow: "Vibe Sense",
    title: "Tvoja platforma sleduje svoj vlastný stav.",
    subtitle:
      "Pred rokmi som odložil obchodného bota. Jeho architektúra sa stala najzaujímavejšou časťou next-vibe. Každý uzol grafu je koncový bod, ktorý môžeš volať z CLI, vyhľadať cez AI a zapojiť do platformy.",
    readTime: "14 min čítania",
  },
  origin: {
    title: "Obchodný bot, ktorého som opustil",
    paragraph1:
      "Pred niekoľkými rokmi som vytvoril fork projektu OctoBot a nazval ho Octane. Backend v Pythone, frontend v Reacte. Na plátno sa dali presúvať technické indikátory, spájať vyhodnocovače, nastavovať pravidlá vykonávania aj upozornenia a zadávať obchodné príkazy. Mal plnohodnotný vizuálny editor stratégií. Stále ho používam pre svoje portfólio.",
    paragraph2:
      "Vývoj kódu som opustil. Pythonový kód sa rozrástol, technický dlh predražoval každú zmenu a mal som aj iné projekty.",
    paragraph3:
      "Neprestal som však nad ním premýšľať. Zaujímalo ma hlavne to, čo v ňom fungovalo ako celok.",
    quoteText:
      "Architektúra obchodného bota bola správna. Chyba bola postaviť ho ako samostatný systém.",
    timeline: {
      octane: {
        label: "Octane (fork OctoBot)",
        description:
          "Vizuálny editor stratégií, indikátory presúvané myšou a backend v Pythone. Vývoj projektu som opustil.",
      },
      insight: {
        label: "Čo som si uvedomil",
        description:
          "Táto štruktúra sa hodí na každý podnikový proces, pri ktorom sa údaje menia v čase.",
      },
      rebuilt: {
        label: "Nová verzia v next-vibe",
        description:
          "Všetko má typy. Každý uzol je štandardný koncový bod, dostupný všade, kde funguje platforma.",
      },
    },
  },
  insight: {
    title: "Každý podnik má časové rady",
    intro:
      "Obchodný bot má jednoduché súčasti. Zdroj údajov poskytuje ceny, objemy alebo iné vstupy. Indikátor, napríklad kĺzavý priemer, RSI či MACD, z nich vypočíta odvodený signál. Vyhodnocovač overuje podmienku, napríklad či je rýchly kĺzavý priemer nad pomalým. Výsledok je pravda alebo nepravda. Po splnení podmienky sa spustí akcia.",
    realization:
      "Táto štruktúra funguje pri každom podnikovom procese s údajmi v čase. Určíš podmienky, ktoré sleduješ, a akcie, ktoré sa vykonajú, keď budú splnené.",
    examples: {
      userGrowth: {
        label: "Rast počtu používateľov",
        description:
          "Počet používateľov v čase tvorí časový rad. Vyhodnocovač zistí, či trend klesá. Akcia môže spustiť kampaň na návrat používateľov.",
      },
      emailHealth: {
        label: "Stav e-mailových kampaní",
        description:
          "Miera otvorenia, vrátené správy a zrušené odbery. Všetko sa dá sledovať ako časový rad a použiť ako podmienka na spustenie akcie.",
      },
      creditEconomy: {
        label: "Tok kreditov",
        description: "Tempo spotreby kreditov a porovnanie spotreby s nákupmi.",
      },
      revenueAnomaly: {
        label: "Odchýlky v tržbách",
        description:
          "Ak podiel vrátených platieb za deň vyskočí nad 20 %, Thea dostane upozornenie skôr, než si to všimneš v prehľade.",
      },
    },
  },
  architecture: {
    title: "Štyri typy uzlov",
    subtitle:
      "Na čítanie grafu ti stačia tri typy uzlov. Štvrtý vykoná akciu podľa výsledku.",
    dataSource: {
      label: "DataSource",
      description:
        "Koncový bod patrí do svojej domény a pozná jej schému. Dopytuje databázu a vracia { timestamp, value }[] pre zvolený časový rozsah a rozlíšenie.",
    },
    indicator: {
      label: "Indikátor",
      description:
        "Opakovane použiteľný koncový bod na čisté výpočty: EMA, RSI, MACD, Bollingerove pásma, ohraničenie hodnôt, rozdiel alebo priemer za interval. Bez SQL a bez znalosti domény. Funguje s ľubovoľným zdrojom údajov.",
    },
    evaluator: {
      label: "Evaluator",
      description:
        "Vyhodnotí prah alebo podmienku nad časovým radom. Klesla hodnota pod 0,7? Prekročil podiel 20 %? Výsledkom je signál, či podmienka nastala.",
    },
    action: {
      label: "Akcia",
      description:
        "Keď vyhodnocovač vyšle signál, zavolá sa príslušný koncový bod v tom istom procese, bez HTTP. Platí rovnaká validácia, overenie prístupu aj typ odpovede ako pri ostatných volaniach.",
    },
    connector: "posiela údaje do",
  },
  unified: {
    title: "Každý uzol je koncový bod",
    intro: "Tu je rozdiel, na ktorom záleží.",
    oldApproach: {
      label: "Pôvodný prístup v Octane",
      description:
        "EMA existuje iba ako uzol v grafe. Je interným detailom implementácie, takže ho CLI ani nástroje AI nevedia volať.",
    },
    newApproach: {
      label: "Prístup next-vibe",
      description:
        "Každý uzol Vibe Sense je štandardný koncový bod vytvorený cez createEndpoint(). Registruje sa tam, kde všetky ostatné koncové body na platforme.",
    },
    cliCaption:
      "Ten istý koncový bod EMA môžeš zavolať samostatne z CLI. Používa rovnakú definíciu, validáciu aj overenie prístupu ako uzol v grafe konverzného lievika.",
    insight:
      "Ten istý koncový bod, ktorý používa graf konverzného lievika, funguje ako samostatný nástroj na 13 platformách.",
    keyLine:
      "Dátový tok vzniká tým, že koncové body volajú ďalšie koncové body.",
  },
  actionCallout: {
    title: "Akcia môže spustiť čokoľvek na platforme",
    body: "Keď vznikne signál, systém zavolá koncový bod v tom istom procese, bez výmeny požiadaviek cez HTTP. Môže poslať upozornenie, spustiť kampaň alebo odovzdať úlohu AI s pripravenými súvislosťami. Thea dostane upozornenie alebo sa spustí kampaň na návrat používateľov. Záleží na tom, čo pripojíš k vyhodnocovaču.",
    noWebhook: "Bez webhooku.",
    noAlerting: "Bez vlastnej služby na upozornenia.",
    noZapier: "Bez Zapieru.",
    punchline: "Platforma volá vlastné koncové body.",
    examples: {
      alert: {
        label: "Upozornenie",
        description: "Zavolaj complete-task. Thea úlohu ihneď prevezme.",
      },
      campaign: {
        label: "Kampaň",
        description:
          "Spusti konverznú sériu, keď tempo pribúdania kontaktov prekročí prah.",
      },
      ai: {
        label: "Odovzdanie úlohy AI",
        description:
          "Spusti agenta AI s informáciou o signáli, ktorý ho vyvolal.",
      },
    },
  },
  funnel: {
    title: "Ako funguje graf konverzného lievika",
    subtitle:
      "Toto je lievik získavania kontaktov. Spúšťa sa každých šesť hodín. Prejdime ho od začiatku po koniec.",
    column1: {
      label: "Stĺpec 1: Zdroje údajov",
      description:
        "Sú to skutočné koncové body v leads/data-sources/. Prijmú časový rozsah a rozlíšenie, spustia dopyt SQL a vrátia { timestamp, value }[].",
      nodes: {
        created: {
          name: "leads.created",
          description:
            "Načítava kontakty podľa created_at. Za hodinu, v ktorej nevznikol žiadny kontakt, nevytvorí dátový bod.",
        },
        converted: {
          name: "leads.converted",
          description:
            "Zoskupuje podľa converted_at a počíta kontakty, ktoré dosiahli stav SIGNED_UP.",
        },
        bounced: {
          name: "leads.bounced",
          description:
            "Počet kontaktov s vráteným e-mailom za každý časový interval.",
        },
        active: {
          name: "leads.active",
          description:
            "Indikátor snímky stavu s rozlíšením ONE_DAY. Počíta všetky kontakty, ktoré ešte nedosiahli koncový stav.",
        },
      },
    },
    column2: {
      label: "Stĺpec 2: Indikátory",
      description:
        'Čistý výpočet. Koncový bod EMA je na analytics/indicators/ema. V grafe stačí konfigurácia { type: "indicator", indicatorId: "ema", params: { period: 7 } }.',
      nodes: {
        ema7: {
          name: "leads_created_ema7",
          description:
            "Indikátor EMA s period=7. Pred výpočtom automaticky rozšíri rozsah načítaných údajov o potrebné predchádzajúce intervaly.",
        },
        conversionRate: {
          name: "conversion_rate",
          description:
            "Transformácia vydelí leads.converted hodnotou leads.created pre každý časový interval. Výsledok ohraničí na 0 až 1.",
        },
      },
    },
    column3: {
      label: "Stĺpec 3: Vyhodnocovače",
      description:
        "Podmienky založené na prahoch. Každý vyhodnocovač vyšle signál, či podmienka nastala.",
      nodes: {
        leadDrop: {
          name: "eval_lead_drop",
          description:
            "EMA(7) < 0.7 pri rozlíšení ONE_WEEK. Tempo pribúdania kontaktov vyhladené za 7 období klesne pod 70 %.",
        },
        zeroLeads: {
          name: "eval_zero_leads",
          description:
            "leads.created < 1/day. Celý deň nepribudne ani jeden kontakt.",
        },
        lowConversion: {
          name: "eval_low_conversion",
          description:
            "conversion_rate < 5%/week. Miera konverzie v lieviku klesne pod 5 %.",
        },
      },
    },
  },
  domainOwned: {
    title: "Zdroje údajov patria do svojej domény",
    subtitle:
      "Toto je jedno z architektonických rozhodnutí, ktoré najviac oceňujem. Zdroje údajov sú súčasťou vlastnej domény, takže ich nenájdeš pohromade v priečinku vibe-sense/.",
    leadsLabel: "Doména kontaktov",
    leadsCount: "… spolu 15 zdrojov údajov",
    creditsLabel: "Doména kreditov",
    creditsCount: "… spolu 17 zdrojov údajov",
    explanation:
      "leads/data-sources/leads-created pozná tabuľku kontaktov. Importuje z leads/db a používa LeadStatus z leads/enum. Ak modul kontaktov odstrániš, odstránia sa s ním aj jeho zdroje. Nezostanú osamotené súbory.",
    indicators: {
      label: "Indikátory v analytics/indicators/",
      description:
        "Čisté výpočty: EMA, RSI, MACD, Bollingerove pásma, ohraničenie hodnôt, rozdiel a priemer za interval. Nezávisia od domény. Fungujú s ľubovoľným zdrojom údajov.",
    },
    registration:
      "Register indikátorov pri štarte automaticky nájde oba typy. Koncové body zdrojov údajov aj indikátorov sa zaregistrujú ako definície uzlov. Pridaj doménu, doplň koncové body v data-sources/ a exportuj graphSeeds. Zobrazia sa automaticky.",
    keyLine: "Každá doména zodpovedá za vlastnú pozorovateľnosť.",
  },
  safety: {
    title: "Verzie grafov, spätné testy a ukladanie",
    subtitle:
      "Tri vlastnosti, vďaka ktorým môže Vibe Sense bezpečne bežať v produkcii.",
    versioning: {
      label: "Správa verzií",
      description:
        "Pri úprave grafu vznikne nová verzia ako koncept. Aktívna verzia zostáva nedotknutá. Koncept aktivuješ výslovne a návrat k predchádzajúcej verzii je jednoduchý.",
    },
    backtest: {
      label: "Spätný test",
      description:
        "Pred aktivovaním môžeš graf otestovať na historických údajoch. Podmienky sa vyhodnotia a signály zaznamenajú. Volania koncových bodov zostanú vypnuté.",
    },
    persist: {
      label: "Režimy ukladania údajov",
      always: {
        label: "always",
        description:
          "Každý vypočítaný bod sa uloží do úložiska datapoints. Hodí sa pre ukazovatele založené na udalostiach, napríklad nové kontakty či spotrebované kredity za minútu.",
      },
      snapshot: {
        label: "snapshot",
        description:
          "Výsledok sa vypočíta na požiadanie a uloží do vyrovnávacej pamäte mimo hlavnej tabuľky. Vhodné na denné súčty a kumulatívne počty.",
      },
      never: {
        label: "nikdy",
        description:
          "Vždy sa prepočíta priamo zo vstupov. Pri výstupoch EMA a pomeroch tak nevznikajú náklady na ukladanie. Na rozbeh výpočtu sa rozsah spätne rozšíri automaticky.",
      },
    },
  },
  ships: {
    title: "Čo funguje dnes a čo pripravujeme",
    prodReady: {
      label: "Dnes pripravené na produkciu",
      items: {
        engine:
          "Kompletný systém: koncové body zdrojov údajov aj indikátorov (EMA, RSI, MACD, Bollingerove pásma, ohraničenie, rozdiel, interval), vyhodnocovače prahov, transformačné uzly a uzly akcií.",
        execution:
          "Uzly sa vykonávajú v topologickom poradí podľa závislostí. Systém podporuje viac časových rozlíšení s automatickým prepočtom. Rozsah rozšíri o potrebné predchádzajúce intervaly.",
        versioning:
          "Verzie grafov, spätné testovanie s úplnou históriou behov a uložené signály ako auditná stopa.",
        cli: "Prístup z CLI: vibe vibe-sense-ema, vibe vibe-sense-rsi alebo ľubovoľný koncový bod indikátora samostatne.",
        mcp: "Registrácia v MCP: koncové body indikátorov pribudnú do zoznamu nástrojov. Thea ich môže volať priamo.",
        seeds:
          "Predpripravených 29 grafov v 9 doménach: kontakty, kredity, používatelia, predplatné, odporúčania, newslettery, platby, správy, čet s AI a stav systému. Všetky fungujú hneď po spustení vibe dev.",
      },
    },
    coming: {
      label: "Čo pripravujeme",
      items: {
        builder:
          "Vizuálny editor s presúvaním uzlov myšou. Systém už funguje, ďalším krokom je editor grafov.",
        trading:
          "Koncové body na obchodovanie. Zdroje cien, API búrz aj vykonávanie obchodných príkazov budú uzly koncových bodov. Obchodný graf sa bude vytvárať rovnako ako ostatné.",
        marketplace:
          "Trh so stratégiami. Keď budeš vedieť vytvoriť graf vizuálne, budeš ho môcť aj zdieľať. Importuj pripravenú stratégiu monitorovania kontaktov, vytvor si jej vlastnú verziu a uprav ju.",
      },
    },
  },
  vision: {
    title: "Na čo to celé je",
    paragraph1:
      "Ak vieš podnikový proces opísať tak, že pri daných údajoch a splnených podmienkach sa má vykonať určitá akcia, vieš ho zapísať ako graf Vibe Sense. Hodí sa na monitorovanie a upozornenia, automatické vyhodnocovanie kontaktov, odhaľovanie výkyvov v tržbách, vyvažovanie toku kreditov aj automatizáciu marketingu.",
    paragraph2:
      "Obchodný bot mal správnu architektúru. Indikátory, vyhodnocovače, akcie aj spätné testy. Chyba bola postaviť ho ako samostatný systém. Octane používal EMA iba v rámci svojho grafu. V next-vibe je EMA samostatný koncový bod.",
    keyLine: "Pri vytváraní platformy máš monitorovanie už k dispozícii.",
    closeTagline:
      "Stačí jedna definícia pre všetky rozhrania. Dátové toky tvoria koncové body, ktoré volajú ďalšie koncové body.",
    cta: {
      primary: "Zobraziť na GitHube",
      secondary: "Späť na blog",
    },
    quickstart: {
      label: "Rýchly začiatok",
      description:
        "vibe dev spustí PostgreSQL v Dockeri, vykoná migrácie, pridá úvodné údaje aj grafy Vibe Sense, doplní historické údaje za 365 dní a spustí vývojový server. Otvor localhost:3000. Grafy už bežia.",
    },
  },
  ui: {
    emaFunctionLabel: "computeEma()",
  },
};
