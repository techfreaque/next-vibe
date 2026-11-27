import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Zásady ochrany osobných údajov | {{appName}}",
    category: "Právne informácie",
    description:
      "Zistite, ako služba {{appName}} chráni vaše súkromie a spracúva vaše údaje.",
    imageAlt: "Zásady ochrany osobných údajov",
    keywords:
      "ochrana osobných údajov, súkromie používateľov, spracúvanie údajov, súkromie v službe {{appName}}",
    ogTitle: "Zásady ochrany osobných údajov | {{appName}}",
    ogDescription:
      "Zistite, ako služba {{appName}} chráni vaše súkromie a spracúva vaše údaje.",
    twitterTitle: "Zásady ochrany osobných údajov | {{appName}}",
    twitterDescription:
      "Zistite, ako služba {{appName}} chráni vaše súkromie a spracúva vaše údaje.",
  },
  printAriaLabel: "Vytlačiť zásady ochrany osobných údajov",
  onThisPage: "Na tejto stránke",
  printButton: "Vytlačiť",
  title: "Zásady ochrany osobných údajov",
  lastUpdated: "Posledná aktualizácia: november 2026",
  bindingVersionNotice:
    "Preklad je určený na uľahčenie porozumenia. Právne záväzné je nemecké znenie tohto dokumentu.",
  introduction:
    "V službe {{appName}} berieme vaše súkromie vážne. Tieto zásady vysvetľujú, ako zhromažďujeme, používame a chránime vaše osobné údaje pri používaní našej platformy na četovanie s AI bez cenzúry.",
  sections: {
    informationCollect: {
      title: "Aké údaje zhromažďujeme",
      description:
        "Zhromažďujeme údaje, ktoré nám poskytnete priamo, aj údaje, ktoré sa automaticky zbierajú pri používaní služby.",
    },
    personalData: {
      title: "Osobné údaje",
      description: "Môžeme zhromažďovať tieto osobné údaje:",
      items: {
        name: "Meno a kontaktné údaje",
        email: "E-mailová adresa",
        phone: "Telefónne číslo (nepovinné)",
        company: "Názov spoločnosti (nepovinný)",
        billing: "Fakturačné a platobné údaje",
        payment: "Spôsob platby a údaje o transakcii",
      },
    },
    socialMediaData: {
      title: "Údaje zo sociálnych sietí",
      description:
        "Ak pripojíte účty zo sociálnych sietí, môžeme zhromažďovať údaje z vašich profilov a súvisiace údaje v rozsahu, ktorý tieto platformy umožňujú.",
    },
    derivativeData: {
      title: "Odvodené údaje",
      description:
        "Z údajov o používaní služby môžeme vytvárať anonymizované súhrnné údaje, aby sme svoje služby zlepšovali.",
    },
    useOfInformation: {
      title: "Ako používame vaše údaje",
      description: "Zhromaždené údaje používame okrem iného na tieto účely:",
      items: {
        provide: "Poskytovanie a údržba služieb četu s AI",
        process: "Spracovanie transakcií a správa vášho účtu",
        send: "Zasielanie aktualít, noviniek a marketingových oznámení",
        respond:
          "Odpovedanie na vaše otázky a poskytovanie zákazníckej podpory",
        monitor:
          "Sledovanie a analýza spôsobu používania na zlepšovanie platformy",
        personalize:
          "Prispôsobenie služby vašim potrebám a poskytovanie relevantného obsahu",
      },
    },
    disclosure: {
      title: "Poskytovanie údajov",
      description:
        "Vaše údaje môžeme poskytnúť, ak to vyžaduje zákon alebo ak je to potrebné na ochranu našich práv a bezpečnosti.",
    },
    businessTransfers: {
      title: "Zmena prevádzkovateľa",
      description:
        "Pri prevode služby na nového prevádzkovateľa mu môžeme odovzdať vaše údaje.",
    },
    thirdParty: {
      title: "Služby tretích strán",
      description:
        "Osobné údaje poskytujeme len poskytovateľom uvedeným nižšie, a len v rozsahu, ktorý každý z nich potrebuje na svoju prácu. Váš účet, chaty a súbory ukladáme na vlastných serveroch v Nemecku.",
      aiNotice:
        "Keď chatujete alebo vytvárate médiá, požiadavka ide k poskytovateľovi zvoleného modelu. Obsahuje to, čo model potrebuje na odpoveď: vašu správu, predchádzajúce správy konverzácie, prílohy, pokyny a spomienky, ktoré AI používa, a zobrazované meno z vášho profilu. Vašu e-mailovú adresu neposielame. Sprostredkovatelia ako OpenRouter, NanoGPT a Venice odovzdajú požiadavku firme, ktorá model prevádzkuje, napríklad OpenAI, Anthropic, Google, xAI, DeepSeek alebo Mistral. Ako dlho poskytovateľ požiadavku uchováva a čo s ňou smie robiť, určujú jeho vlastné podmienky. Na vašich chatoch netrénujeme žiadne modely AI.",
      transfers:
        "Viacerí poskytovatelia sídlia mimo EÚ. Ak poskytovateľ ponúka štandardné zmluvné doložky Európskej komisie, napríklad Stripe a OpenRouter, prenos sa zakladá na nich. Inak sa údaje prenášajú podľa podmienok poskytovateľa.",
      labels: {
        purpose: "Účel",
        data: "Poskytnuté údaje",
        privacyPolicy: "Zásady ochrany súkromia",
      },
      groups: {
        hosting: "Hosting a úložisko",
        email: "E-mail",
        payments: "Platby",
        ai: "Modely AI",
        web: "Vyhľadávanie na webe a načítanie stránok",
      },
      providers: {
        hostinger: {
          purpose:
            "Prenajíma nám dva virtuálne servery, na ktorých platforma beží. Databázu, úložisko súborov (MinIO) a cache (Redis) na týchto serveroch prevádzkujeme sami. Žiadna samostatná cloudová služba úložiska sa na tom nepodieľa.",
          data: "Všetko, čo je uložené na platforme: údaje účtu, chaty, spomienky, nahrané a vytvorené súbory, záznamy o platbách.",
          location: "Servery v Nemecku, spoločnosť v Litve (EÚ)",
        },
        hosttech: {
          purpose:
            "Poštový server pre naše e-mailové adresy. Posiela registračné kódy, potvrdenia a newslettery a prijíma e-maily, ktoré nám píšete.",
          data: "E-mailová adresa, meno, obsah e-mailov.",
          location: "Švajčiarsko (rozhodnutie EÚ o primeranosti)",
        },
        stripe: {
          purpose: "Platby kartou, predplatné a faktúry.",
          data: "Meno, e-mailová adresa, fakturačná adresa, platobné údaje, sumy, ID vášho účtu. Celé číslo vašej karty nikdy nevidíme.",
          location:
            "Stripe Payments Europe, Ltd., Írsko (EÚ); materská spoločnosť v USA",
        },
        paypal: {
          purpose: "Len ak v platbe cez Stripe zvolíte PayPal.",
          data: "Meno, e-mailová adresa, platobné údaje, sumy.",
          location: "PayPal (Europe) S.à r.l. et Cie, S.C.A., Luxembursko (EÚ)",
        },
        nowpayments: {
          purpose: "Platby kryptomenami.",
          data: "ID vášho účtu v čísle objednávky, produkt a suma, údaje o peňaženke a transakcii. Pri opakovaných kryptoplatbách aj vaša e-mailová adresa.",
          location: "Svätý Vincent a Grenadíny",
        },
        openrouter: {
          purpose:
            "Odovzdáva väčšinu chatovacích modelov (napríklad od OpenAI, Anthropic, Google, xAI, DeepSeek, Mistral a Qwen) a niektoré obrazové a video modely firme, ktorá ich prevádzkuje.",
          data: "Obsah požiadavky na AI, ako je opísaný vyššie. Firma, ktorá model prevádzkuje, dostane rovnaký obsah.",
          location: "USA",
        },
        nanogpt: {
          purpose: "Chatovacie, obrazové a video modely, prevod textu na reč.",
          data: "Obsah požiadavky na AI, text, ktorý si dáte prečítať.",
          location: "USA",
        },
        venice: {
          purpose: "Necenzurované chatovacie, obrazové a video modely.",
          data: "Obsah požiadavky na AI.",
          location: "USA",
        },
        uncensoredAi: {
          purpose: "Chatovací model UncensoredLM.",
          data: "Obsah požiadavky na AI.",
          location: "USA",
        },
        freedomgpt: {
          purpose: "Chatovacie modely FreedomGPT.",
          data: "Obsah požiadavky na AI.",
          location: "USA",
        },
        gabAi: {
          purpose: "Chatovacie modely Gab AI.",
          data: "Obsah požiadavky na AI.",
          location: "USA",
        },
        modelslab: {
          purpose: "Obrazové, video a hudobné modely.",
          data: "Váš prompt a priložené obrázky.",
          location: "India",
        },
        edenAi: {
          purpose:
            "Prevod reči na text a textu na reč. Odovzdáva zvuk alebo text rečovému nástroju, ktorý používa.",
          data: "Hlasové nahrávky, ktoré prepisujete, text, ktorý si dáte prečítať.",
          location: "Francúzsko (EÚ)",
        },
        braveSearch: {
          purpose: "Vyhľadávanie na webe, keď AI hľadá na internete.",
          data: "Vyhľadávací dopyt, ktorý napíše AI. Žiadne údaje účtu.",
          location: "USA",
        },
        kagi: {
          purpose:
            "Vyhľadávanie na webe a krátke odpovede z webu, keď AI hľadá na internete.",
          data: "Vyhľadávací dopyt, ktorý napíše AI. Žiadne údaje účtu.",
          location: "USA",
        },
        scrappey: {
          purpose: "Načíta webovú stránku, keď AI číta odkaz.",
          data: "Adresa stránky. Žiadne údaje účtu.",
          location: "EÚ",
        },
      },
    },
    legal: {
      title: "Právny základ spracúvania",
      description:
        "Vaše osobné údaje spracúvame na základe vášho súhlasu, nevyhnutnosti na plnenie zmluvy, zákonných povinností a našich oprávnených záujmov pri poskytovaní a zlepšovaní služieb.",
    },
    security: {
      title: "Bezpečnostné opatrenia",
      description:
        "Zavádzame primerané technické a organizačné opatrenia na ochranu osobných údajov pred neoprávneným prístupom, zmenou, sprístupnením alebo zničením. Žiadny spôsob prenosu cez internet však nie je stopercentne bezpečný.",
    },
    rights: {
      title: "Vaše práva pri ochrane osobných údajov",
      description:
        "Právne predpisy o ochrane údajov vám vo vzťahu k vašim osobným údajom priznávajú tieto práva:",
      items: {
        access: "Právo na prístup k vašim osobným údajom",
        correction:
          "Právo na opravu nesprávnych alebo doplnenie neúplných údajov",
        deletion:
          "Právo na vymazanie. Pri odstránení účtu v nastaveniach sa vaše osobné údaje vymažú.",
        objection: "Právo namietať proti spracúvaniu vašich údajov",
        portability:
          "Právo na prenosnosť údajov. V nastaveniach si môžete exportovať všetky svoje údaje vo formáte JSON.",
      },
    },
    cookies: {
      title: "Súbory cookie a sledovanie",
      description:
        "Nepoužívame sledovacie nástroje tretích strán, reklamné pixely ani identifikáciu podľa odtlačku prehliadača. Váš prehliadač rozpoznávame pomocou jedného vlastného súboru cookie. Aby sme zistili, ktoré kanály privádzajú ľudí, ktorí zostanú, zaznamenávame spôsob vášho prvého príchodu aj posledného príchodu cez označený odkaz. Evidujeme značky kampane v odkaze (utm_source, utm_medium, utm_campaign, utm_content, utm_term), doménu odkazujúceho webu bez úplnej adresy, vstupnú stránku bez parametrov dopytu a prípadný kód odporúčania. Ďalej zaznamenávame, kedy ste prvýkrát četovali, zaregistrovali sa, potvrdili odber noviniek, zaplatili a obnovili predplatné. Pri registrácii tieto údaje prepojíme s vaším účtom. Používame ich len súhrnne na vyhodnocovanie marketingových kanálov. Nikdy ich nepredávame ani nezdieľame. Odstránením účtu sa vymažú.",
    },
    guestMedia: {
      title: "Médiá vytvorené bez účtu",
      description:
        "Obrázky, zvuk a videá vytvorené bez účtu vrátane režimu inkognito ukladáme na našich serveroch, aby sa dali zobraziť a stiahnuť. Ak si účet nevytvoríte, tieto súbory sa po 4 mesiacoch automaticky odstránia.",
    },
    thirdPartySites: {
      title: "Weby tretích strán",
      description:
        "Naša služba môže obsahovať odkazy na weby tretích strán. Za spôsob ochrany súkromia na týchto weboch nezodpovedáme. Odporúčame prečítať si ich zásady ochrany osobných údajov.",
    },
    children: {
      title: "Ochrana súkromia detí",
      description:
        "Naša služba nie je určená deťom mladším ako 13 rokov. Údaje od detí vedome nezhromažďujeme.",
    },
    changes: {
      title: "Zmeny týchto zásad",
      description:
        "Tieto zásady ochrany osobných údajov môžeme priebežne aktualizovať. O podstatných zmenách vás informujeme.",
    },
    controller: {
      description:
        "Prevádzkovateľom zodpovedným za spracúvanie vašich údajov podľa GDPR je {{operator}}, {{address}}.",
    },
    gdpr: {
      title: "Ochrana údajov podľa GDPR",
      description:
        "Pri používateľoch v Európskej únii rešpektujeme práva podľa GDPR. Svoje údaje si môžete kedykoľvek exportovať z nastavení. Po odstránení účtu sa vymaže váš profil, čety, spomienky, adresy, odber noviniek a kontaktné údaje. Odstránia sa aj osobné údaje z prepojených záznamov o návštevách. Anonymné súhrnné štatistiky a evidencia kreditov zostávajú zachované bez prepojenia s vami. Ak niektorú požiadavku neviete vybaviť v nastaveniach, kontaktujte nás.",
    },
  },
  post: {
    title: "Zásady ochrany osobných údajov",
    description: "Koncový bod zásad ochrany osobných údajov",
    form: {
      title: "Nastavenie zásad ochrany osobných údajov",
      description: "Nastavte parametre zásad ochrany osobných údajov",
    },
    response: {
      title: "Odpoveď",
      description: "Údaje v odpovedi zásad ochrany osobných údajov",
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
