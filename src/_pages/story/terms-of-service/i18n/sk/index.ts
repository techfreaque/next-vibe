import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Podmienky používania | {{appName}}",
    category: "Právne informácie",
    description: "Prečítajte si podmienky používania služby {{appName}}.",
    imageAlt: "Podmienky používania",
    keywords:
      "podmienky používania, zmluvné podmienky, podmienky služby {{appName}}",
    ogTitle: "Podmienky používania | {{appName}}",
    ogDescription: "Prečítajte si podmienky používania služby {{appName}}.",
    twitterTitle: "Podmienky používania | {{appName}}",
    twitterDescription:
      "Prečítajte si podmienky používania služby {{appName}}.",
  },
  printAriaLabel: "Vytlačiť podmienky používania",
  onThisPage: "Na tejto stránke",
  printButton: "Vytlačiť",
  title: "Podmienky používania",
  lastUpdated: "Posledná aktualizácia: 24. novembra 2026",
  bindingVersionNotice:
    "Preklad je určený na uľahčenie porozumenia. Právne záväzné je nemecké znenie tohto dokumentu.",
  introduction:
    "Vitajte v službe {{appName}}. Používaním našej platformy na četovanie s AI bez cenzúry súhlasíte s týmito podmienkami používania. Pozorne si ich prečítajte. Službu {{appName}} prevádzkuje {{operator}} so sídlom v Nemecku.",
  sections: {
    agreement: {
      title: "Súhlas s podmienkami",
      content:
        "Prístupom k službe {{appName}} alebo jej používaním súhlasíte, že sa budete riadiť týmito podmienkami používania a všetkými uplatniteľnými zákonmi a predpismi. Ak s niektorou z podmienok nesúhlasíte, službu nesmiete používať.",
    },
    description: {
      title: "Opis služby",
      content:
        "Služba {{appName}} poskytuje prístup k četovacím modelom AI bez cenzúry od rôznych poskytovateľov. Ponúkame bezplatné aj platené plány s rôznymi funkciami a limitmi používania. Služba sa poskytuje v stave, v akom je, bez záruk akéhokoľvek druhu.",
    },
    subscriptions: {
      title: "Predplatné a platby",
      plans: {
        title: "Plány predplatného",
        content:
          "Ponúkame predplatné a balíky kreditov. Balíky kreditov nemajú obmedzenú platnosť a zachovajú sa aj po skončení predplatného.",
      },
      billing: {
        title: "Vyúčtovanie",
        content:
          "Predplatné účtujeme mesačne alebo ročne. Pri ročnom predplatnom pripisujeme mesačné kredity každý mesiac. Balíky kreditov si môžu jednorazovo dokúpiť predplatitelia s aktívnym predplatným. Platnosť balíkov nekončí. Prostredníctvom Stripe prijímame platobné karty, PayPal, Apple Pay a Google Pay, prostredníctvom NowPayments kryptomeny.",
      },
      cancellation: {
        title: "Zrušenie predplatného",
        content:
          "Predplatné môžete kedykoľvek zrušiť. Zrušenie nadobudne účinnosť na konci aktuálneho fakturačného obdobia. Platby za balíky kreditov sa nevracajú, pokiaľ sa neuplatní zákonné právo na odstúpenie od zmluvy. Pozri časť Právo spotrebiteľa na odstúpenie od zmluvy.",
      },
    },
    withdrawal: {
      title: "Právo spotrebiteľa na odstúpenie od zmluvy",
      intro:
        "Ak ste spotrebiteľom podľa § 13 nemeckého Občianskeho zákonníka (BGB), máte zákonné právo odstúpiť od zmlúv o balíkoch kreditov a predplatnom, ktoré s nami uzatvoríte cez službu {{appName}}. Podmienky upravuje nasledujúce poučenie.",
      notice: {
        title: "Poučenie o práve na odstúpenie od zmluvy",
        right:
          "Máte právo odstúpiť od tejto zmluvy do štrnástich dní bez uvedenia dôvodu. Lehota na odstúpenie od zmluvy je štrnásť dní odo dňa uzavretia zmluvy.",
        exercise:
          "Ak chcete uplatniť právo na odstúpenie od zmluvy, musíte nám ({{operator}}, {{address}}, e-mail: {{email}}) oznámiť svoje rozhodnutie odstúpiť od tejto zmluvy jednoznačným vyhlásením, napríklad listom zaslaným poštou alebo e-mailom. Môžete použiť vzorový formulár uvedený nižšie. Jeho použitie je dobrovoľné. Stačí obyčajný e-mail.",
        deadline:
          "Na dodržanie lehoty na odstúpenie od zmluvy stačí, ak oznámenie o uplatnení práva na odstúpenie odošlete pred uplynutím tejto lehoty.",
      },
      effects: {
        title: "Dôsledky odstúpenia od zmluvy",
        refund:
          "Ak odstúpite od tejto zmluvy, vrátime vám všetky platby, ktoré sme od vás prijali, bez zbytočného odkladu, najneskôr do štrnástich dní odo dňa, keď dostaneme vaše oznámenie o odstúpení od zmluvy. Platbu vrátime rovnakým spôsobom, aký ste použili pri pôvodnej transakcii, pokiaľ sme sa s vami výslovne nedohodli inak. Za vrátenie platby vám nebudeme účtovať žiadne poplatky.",
        compensation:
          "Ak ste požiadali, aby sa služby začali poskytovať počas lehoty na odstúpenie od zmluvy, zaplatíte nám primeranú sumu. Tá zodpovedá pomeru služieb poskytnutých do okamihu, keď nám oznámite uplatnenie práva na odstúpenie od tejto zmluvy, k celkovému rozsahu služieb dohodnutých v zmluve.",
        end: "Koniec poučenia o práve na odstúpenie od zmluvy",
      },
      expiry: {
        title: "Predčasný zánik práva na odstúpenie od zmluvy",
        digitalContent:
          "Pri zmluve o dodaní digitálneho obsahu bez hmotného nosiča právo na odstúpenie podľa § 356 ods. 5 BGB zaniká, ak sme začali plniť zmluvu po tom, čo ste výslovne súhlasili so začatím plnenia pred uplynutím lehoty na odstúpenie, potvrdili ste, že beriete na vedomie stratu práva na odstúpenie začatím plnenia na základe tohto súhlasu, a my sme vám poskytli potvrdenie o zmluve.",
        services:
          "Pri zmluve o poskytovaní služieb právo na odstúpenie podľa § 356 ods. 4 BGB zaniká, ak sme službu poskytli v plnom rozsahu a začali sme ju poskytovať až po tom, čo ste na to dali výslovný súhlas a zároveň potvrdili, že beriete na vedomie zánik práva na odstúpenie po úplnom splnení zmluvy z našej strany.",
        credits:
          "Ak vaše právo na odstúpenie podľa týchto ustanovení nezaniklo, pri kreditoch platí nasledujúce. V plnej výške vrátime časť ceny pripadajúcu na nevyužité kredity nadobudnuté podľa zmluvy, od ktorej odstupujete. Tieto kredity sa po odstúpení odoberú z účtu. Za už využité kredity účtujeme v rozsahu povolenom zákonom pomernú sumu podľa podielu využitých kreditov na všetkých kreditoch nadobudnutých podľa zmluvy. Odstúpením od zmluvy o predplatnom sa končí aj predplatné.",
      },
      form: {
        title: "Vzorový formulár na odstúpenie od zmluvy",
        intro:
          "(Ak chcete odstúpiť od zmluvy, vyplňte a zašlite tento formulár.)",
        recipient: "Adresát: {{operator}}, {{address}}, e-mail: {{email}}",
        statement:
          "Týmto oznamujem/oznamujeme (*), že odstupujem/odstupujeme (*) od zmluvy, ktorú som uzavrel/ktorú sme uzavreli (*) na dodanie tohto digitálneho obsahu (*)/poskytnutie tejto služby (*):",
        orderedOn: "Dátum objednania (*)/dátum prijatia (*)",
        name: "Meno spotrebiteľa alebo spotrebiteľov",
        address: "Adresa spotrebiteľa alebo spotrebiteľov",
        signature:
          "Podpis spotrebiteľa alebo spotrebiteľov (len pri podaní v listinnej podobe)",
        date: "Dátum",
        footnote: "(*) Nehodiace sa prečiarknite.",
        accountHint:
          "Na rýchle priradenie nákupu uveďte e-mailovú adresu svojho účtu. Platnosť odstúpenia od zmluvy od uvedenia tejto adresy nezávisí.",
      },
    },
    userAccounts: {
      title: "Používateľské účty",
      creation: {
        title: "Vytvorenie účtu",
        content:
          "Pri vytváraní účtu musíte uviesť správne údaje. Zodpovedáte za bezpečnosť prihlasovacích údajov k účtu.",
      },
      responsibilities: {
        title: "Povinnosti používateľa",
        content:
          "Zodpovedáte za všetku činnosť na svojom účte. Účet nesmiete zdieľať s inými osobami ani službu používať na nezákonné účely.",
      },
    },
    userContent: {
      title: "Obsah používateľa",
      ownership: {
        title: "Práva k obsahu",
        content:
          "Všetky práva k vašim konverzáciám a údajom vám zostávajú. Na váš obsah si nenárokujeme vlastnícke práva. Prístup k vašim súkromným priečinkom máte iba vy.",
      },
      guidelines: {
        title: "Pravidlá pre obsah",
        intro:
          "Poskytujeme prístup k AI bez cenzúry. Službu nesmiete používať na tieto činnosti:",
        items: {
          item1: "Vykonávanie nezákonných činností",
          item2: "Obťažovanie, vyhrážanie alebo ubližovanie iným osobám",
          item3: "Porušovanie práv duševného vlastníctva",
          item4:
            "Pokusy o neoprávnený prístup k platforme alebo o narušenie jej bezpečnosti",
        },
      },
    },
    aiOutput: {
      title: "Výstupy vytvorené AI",
      ownership:
        "Nenárokujeme si vlastnícke práva k textu, obrázkom, videu, zvuku ani iným výstupom, ktoré vytvoríte v službe {{appName}}. Všetky práva, ktoré k týmto výstupom existujú, patria vám.",
      licenses:
        "Výstupy vytvárajú modely tretích strán. Okrem týchto podmienok platí licencia príslušného modelu a podmienky jeho poskytovateľa. Niektoré modely povoľujú len nekomerčné použitie alebo obmedzujú určité spôsoby použitia. Takéto modely v aplikácii označujeme.",
      copyright:
        "Výstupy AI nemusia byť chránené autorským právom a môžu sa podobať na existujúce diela alebo výstupy vytvorené pre iných používateľov. Pred použitím výstupu zodpovedáte za overenie licencie príslušného modelu, najmä pri komerčnom použití.",
    },
    intellectualProperty: {
      title: "Duševné vlastníctvo",
      content:
        "Platforma {{appName}} vrátane jej dizajnu, funkcií a kódu je chránená predpismi o duševnom vlastníctve. Bez nášho súhlasu ju nesmiete kopírovať, upravovať ani šíriť.",
    },
    limitation: {
      title: "Obmedzenie zodpovednosti",
      content:
        "Služba {{appName}} nezodpovedá za žiadne nepriame, vedľajšie, osobitné ani následné škody vzniknuté používaním služby.",
    },
    indemnification: {
      title: "Odškodnenie",
      content:
        "Zaväzujete sa odškodniť {{appName}} a chrániť ju pred nárokmi, škodami alebo výdavkami, ktoré vzniknú vaším používaním služby alebo porušením týchto podmienok.",
    },
    termination: {
      title: "Ukončenie účtu",
      content:
        "Pri porušení týchto podmienok si vyhradzujeme právo váš účet zrušiť alebo pozastaviť. Svoj účet môžete kedykoľvek zrušiť.",
    },
    changes: {
      title: "Zmeny podmienok",
      content:
        "Tieto podmienky používania môžeme priebežne aktualizovať. Ak po zmene naďalej používate službu, súhlasíte s novými podmienkami.",
    },
    governingLaw: {
      title: "Rozhodné právo a príslušnosť súdu",
      content:
        "Tieto podmienky sa riadia právom Spolkovej republiky Nemecko. Ak ste spotrebiteľom, táto voľba práva vás nezbavuje ochrany podľa kogentných ustanovení práva krajiny vášho obvyklého pobytu. Ak ste obchodníkom, právnickou osobou verejného práva alebo osobitným fondom verejného práva, súdne príslušným miestom pre všetky spory z týchto podmienok je sídlo prevádzkovateľa v meste Simbach am Inn v Nemecku. V ostatných prípadoch sa príslušnosť súdu určuje podľa zákona.",
    },
  },
  post: {
    title: "Podmienky používania",
    description: "Koncový bod podmienok používania",
    form: {
      title: "Nastavenie podmienok používania",
      description: "Nastavte parametre podmienok používania",
    },
    response: {
      title: "Odpoveď",
      description: "Údaje odpovede podmienok používania",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      validation: {
        title: "Chyba kontroly údajov",
        description: "Neplatné parametre požiadavky",
      },
      server: {
        title: "Chyba servera",
        description: "Nastala interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neznáma chyba",
      },
      network: {
        title: "Chyba siete",
        description: "Nastala chyba siete",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Prístup zamietnutý",
      },
      notFound: {
        title: "Nenájdené",
        description: "Zdroj sa nenašiel",
      },
      conflict: {
        title: "Konflikt",
        description: "Došlo ku konfliktu údajov",
      },
    },
    success: {
      title: "Hotovo",
      description: "Operácia sa dokončila",
    },
  },
};
