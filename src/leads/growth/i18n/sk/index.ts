import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  acquisition: {
    title: "Získavanie kontaktov",
    description:
      "Príchody sa počítajú podľa zdroja každej návštevy. Kontakty a konverzie podľa zdroja evidovaného pri kontakte a kódu odporúčania, ktorému sa započítali. Tržby sú hrubou sumou úspešných platieb vo vybranej mene. Staršie príchody počítame z dostupných záznamov o vstupných stránkach.",
    sources: {
      all: "Všetky zdroje",
      creator: "Kód tvorcu",
      referral: "Kód odporúčania",
      campaign: "Kampaň UTM",
      search: "Organické vyhľadávanie",
      referrer: "Externý odkazujúci web",
      direct: "Priame",
      unattributed: "Bez priradeného zdroja",
    },
    metrics: {
      visits: "Návštevy",
      leads: "Kontakty",
      signups: "Registrácie",
      firstChats: "Prvé čety",
      payers: "Platiaci",
      revenue: "Tržby",
    },
    fields: {
      type: "Typ zdroja",
      source: "Zdroj UTM",
      medium: "Médium UTM",
      campaign: "Kampaň UTM",
      referrerHost: "Odkazujúca doména",
      refCode: "Kód odporúčania",
      currency: "Mena tržieb",
      metric: "Ukazovateľ",
      excludeBots: "Vylúčiť roboty",
      excludeBotsDescription:
        "Platí iba pre návštevy. Vylúči návštevy známych robotov a indexovacích klientov podľa rovnakého pravidla ako konverzný lievik kontaktov.",
    },
    series: "Získavanie kontaktov v čase",
    empty: "V tomto období sme nezaznamenali žiadnu akvizíciu.",
    page: "Stránka",
    previous: "Predchádzajúca",
    next: "Ďalšia",
    apply: "Použiť filtre",
  },
  category: "Rast",
  tags: {
    vibeSense: "vibe-sense",
    growth: "rast",
    campaigns: "kampane",
    spend: "výdavky",
  },
  enums: {
    currency: { eur: "EUR", usd: "USD", pln: "PLN" },
    funnelStep: {
      visit: "Prvá návšteva",
      chat: "Prvá správa v čete",
      signup: "Registrácia",
      newsletter: "Potvrdený odber newslettera",
      paid: "Prvá platba",
      retained: "Obnovenie v druhom mesiaci",
    },
    attributionTouch: {
      first: "Prvý kontakt",
      last: "Posledný kontakt",
    },
    channelType: {
      all: "Všetky kanály",
      campaign: "Kampaň (UTM)",
      referral: "Kód odporúčania",
      organic: "Organický odkazujúci web",
      direct: "Priame",
    },
    paidKind: {
      subscription: "Predplatné",
      pack: "Balík kreditov",
    },
  },
  links: {
    get: {
      title: "Odkazy kampaní",
      titleShort: "Odkazy kampaní",
      description:
        "Označené odkazy podľa marketingového kanála. Pri každom vidíte, koľko návštev, registrácií a platiacich používateľov priniesol.",
      response: {
        links: "Odkazy",
      },
      widget: {
        title: "Odkazy kampaní",
        subtitle:
          "Označte každý test kanála a vyhodnoťte ho podľa platiacich používateľov.",
        create: "Nový odkaz",
        refresh: "Obnoviť",
        loading: "Načítavajú sa odkazy…",
        empty: {
          title: "Zatiaľ žiadne odkazy kampaní",
          hint: "Vytvorte jeden odkaz pre každý test kanála. Tu uvidíte návštevy, registrácie a platby, ktoré priniesol.",
          cta: "Vytvoriť prvý odkaz",
        },
        visits: "Návštevy",
        signups: "Registrácie",
        paid: "Platiaci",
        funnel:
          "Návštevy: {{visits}} → Registrácie: {{signups}} → Platiaci: {{paid}}",
        paidRate: "Podiel platiacich z návštev: {{rate}}",
        refCode: "Kód odporúčania: {{code}}",
        landsOn: "Otvára {{path}}",
        copy: "Kopírovať odkaz",
        copied: "Skopírované",
        spend: "Výdavky na kanál",
      },
    },
    post: {
      title: "Vytvoriť odkaz kampane",
      titleShort: "Nový odkaz",
      description:
        "Vytvorte odkaz s parametrami UTM pre jeden kanál. Voliteľne ho prepojte s kódom odporúčania.",
      fields: {
        name: {
          label: "Názov",
          description:
            "Interný názov, napríklad „Príspevok k spusteniu na Reddit r/LocalLLaMA“",
          placeholder: "Príspevok k spusteniu na Reddite",
        },
        channel: {
          label: "Zdroj (utm_source)",
          description: "Odkiaľ prichádzajú návštevy: reddit, youtube, x",
          placeholder: "reddit",
        },
        medium: {
          label: "Médium (utm_medium)",
          description: "Typ návštevnosti: social, cpc, email, video",
          placeholder: "social",
        },
        campaign: {
          label: "Kampaň (utm_campaign)",
          description: "Test, ku ktorému odkaz patrí",
          placeholder: "launch-nov",
        },
        content: {
          label: "Obsah (utm_content)",
          description: "Voliteľné. Variant reklamy alebo miesto zobrazenia",
          placeholder: "top-comment",
        },
        term: {
          label: "Výraz (utm_term)",
          description: "Voliteľné. Kľúčové slovo platenej reklamy",
          placeholder: "uncensored ai",
        },
        destinationPath: {
          label: "Vstupná cesta",
          description:
            "Cesta na tomto webe, ktorú odkaz otvorí, napríklad / alebo /en-US/story",
          placeholder: "/",
        },
        refCode: {
          label: "Kód odporúčania",
          description:
            "Voliteľné. Presmeruje návštevu cez /track, aby sa započítala aj ku kódu odporúčania",
          placeholder: "FRIEND2024",
        },
      },
      response: {
        id: "ID odkazu",
        url: "Adresa URL kampane",
      },
      widget: {
        back: "Späť",
        hint: "Pre ten istý kanál vždy používajte rovnaký zdroj. Výdavky aj náklady na platiaceho používateľa sa zoskupujú podľa zdroja.",
        created: "Odkaz je pripravený. Zdieľajte presne túto adresu URL:",
        copy: "Kopírovať odkaz",
        copied: "Skopírované",
      },
    },
  },
  spend: {
    get: {
      title: "Výdavky na kanály",
      titleShort: "Výdavky na kanály",
      description:
        "Výdavky podľa kanála a obdobia vrátane registrácií, platiacich používateľov a nákladov na jedného platiaceho používateľa.",
      response: {
        rows: "Záznamy výdavkov",
      },
      widget: {
        title: "Výdavky na kanál",
        subtitle:
          "Koľko stojí každý kanál a koľko stojí získať jedného platiaceho používateľa.",
        add: "Pridať výdavok",
        refresh: "Obnoviť",
        loading: "Načítavajú sa výdavky…",
        empty: {
          title: "Zatiaľ bez záznamov výdavkov",
          hint: "Zaznamenajte náklady na test kanála. Náklady na platiaceho používateľa sa zobrazia, keď kanál privedie prvého platiaceho používateľa.",
          cta: "Zaznamenať prvý výdavok",
        },
        period: "{{from}} až {{to}}",
        signups: "Registrácie",
        paid: "Platiaci používatelia",
        costPerPaid: "Náklady na platiaceho používateľa",
        costPerSignup: "Náklady na registráciu",
        none: "–",
        attribution:
          "Používatelia sa v rámci obdobia započítajú ku kanálu, ktorý ich priviedol ako prvý.",
      },
    },
    post: {
      title: "Zaznamenať výdavok na kanál",
      titleShort: "Zaznamenať výdavok",
      description:
        "Zaznamenajte výdavky na kanál za dané obdobie. Pri rovnakom kanáli a dátume začiatku sa pôvodný záznam prepíše.",
      fields: {
        channel: {
          label: "Kanál",
          description:
            "Hodnota utm_source kanála alebo ref:CODE pre partnera s kódom odporúčania",
          placeholder: "reddit",
        },
        periodStart: {
          label: "Od",
          description: "Prvý deň obdobia výdavkov",
        },
        periodEnd: {
          label: "Do",
          description: "Posledný deň obdobia výdavkov",
        },
        amount: {
          label: "Suma",
          description: "Celkové výdavky v danom období",
        },
        currency: {
          label: "Mena",
          description: "Mena zadanej sumy",
        },
        note: {
          label: "Poznámka",
          description: "Voliteľné. Na čo peniaze išli",
          placeholder: "2 propagované príspevky",
        },
      },
      response: {
        id: "ID záznamu",
      },
      widget: {
        back: "Späť",
        hint: "Použite presný názov zdroja z odkazov kampane, aby graf vedel priradiť výdavky k používateľom.",
      },
    },
  },
  dataSources: {
    fields: {
      resolution: {
        label: "Časové rozlíšenie",
        description: "Veľkosť intervalu",
      },
      range: { label: "Rozsah", description: "Časový rozsah dopytu" },
      lookback: {
        label: "Intervaly pred začiatkom rozsahu",
        description: "Počet dodatočných intervalov pred začiatkom rozsahu",
      },
      meta: { label: "Metadáta", description: "Metadáta spustenia uzla" },
      touch: {
        label: "Priradenie zdroja",
        description: "Zoskupiť podľa prvého alebo posledného kontaktu",
      },
      channelType: {
        label: "Typ kanála",
        description: "Kampaň, odporúčanie, organické, priame alebo všetky",
      },
      channel: {
        label: "Kanál",
        description:
          "Presný kľúč kanála: utm_source, ref:CODE, odkazujúca doména alebo direct. Prázdne pole znamená ľubovoľný kanál",
      },
      currency: {
        label: "Mena",
        description: "Započítajú sa iba výdavky zadané v tejto mene",
      },
      convertToUsd: {
        label: "Všetky meny prepočítané na USD",
        description:
          "Výdavky vo všetkých menách prepočíta na USD podľa kurzov vo finančnej tabuľke a sčíta ich. Filter meny sa neuplatní.",
      },
    },
    funnelStep: {
      post: {
        title: "Krok konverzného lievika",
        titleShort: "Krok konverzného lievika",
        description:
          "Počet ciest, ktoré v jednotlivých intervaloch dosiahli daný krok konverzného lievika. Možno filtrovať podľa kanála.",
        fields: {
          step: {
            label: "Krok",
            description:
              "Krok konverzného lievika: visit, chat, signup, newsletter, paid, retained",
          },
          result: {
            label: "Cesty",
            description: "Počet dosiahnutých krokov za interval",
          },
        },
      },
    },
    channelSpend: {
      post: {
        title: "Výdavky na kanály",
        titleShort: "Výdavky na kanály",
        description:
          "Evidované marketingové výdavky za interval, rovnomerne rozložené v každom období výdavkov",
        fields: {
          result: { label: "Výdavky", description: "Výdavky za interval" },
        },
      },
    },
  },
  errors: {
    validation: {
      title: "Neplatný vstup",
      description: "Skontrolujte zvýraznené polia",
    },
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description: "Prihláste sa ako správca",
    },
    forbidden: {
      title: "Iba pre správcov",
      description: "Nástroje rastu vyžadujú oprávnenia správcu",
    },
    notFound: {
      title: "Nenašlo sa",
      description: "Tento záznam neexistuje",
    },
    conflict: {
      title: "Konflikt",
      description:
        "Záznam sa medzitým zmenil. Načítajte ho znova a zopakujte akciu.",
    },
    server: {
      title: "Chyba servera",
      description: "Požiadavku sa nepodarilo dokončiť",
    },
    network: {
      title: "Chyba siete",
      description: "Požiadavka sa nedostala na server",
    },
    unknown: {
      title: "Neznáma chyba",
      description: "Vyskytla sa neočakávaná chyba",
    },
    unsavedChanges: {
      title: "Neuložené zmeny",
      description: "Najprv zmeny uložte alebo zrušte",
    },
    invalidRefCode: "Kód odporúčania {{code}} neexistuje alebo je neaktívny",
    invalidPeriod: "Obdobie musí skončiť v deň začiatku alebo neskôr",
    invalidDestination:
      "Vstupná cesta musí začínať znakom / a zostať na tomto webe",
  },
  success: {
    title: "Hotovo",
    description: "Uložené",
  },
};
