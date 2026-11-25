import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Tvorba aplikácií s next-vibe | {{appName}}",
    category: "Pre vývojárov",
    description:
      "Z jedného koncového bodu vytvorí next-vibe webový formulár, príkaz CLI, nástroj MCP, obrazovku natívnej aplikácie aj zručnosť pre AI. Automatizuj úlohy, ktoré ľudia robia na počítači.",
    imageAlt: "Vývojárska platforma next-vibe | {{appName}}",
    keywords:
      "next-vibe, automatizácia pomocou AI, vývojárska platforma, automatizácia podniku, integrácia ERP, automatizácia výroby, {{appName}}",
    ogTitle: "Tvorba aplikácií s next-vibe | {{appName}}",
    ogDescription:
      "Jeden zdrojový kód pre všetky rozhrania. Automatizuj výrobné linky, systémy ERP a postupy na počítači aj ďalšie úlohy, ktoré ľudia robia na počítači.",
    twitterTitle: "Tvorba aplikácií s next-vibe | {{appName}}",
    twitterDescription:
      "Jeden zdrojový kód pre všetky rozhrania. Automatizuj výrobné linky, systémy ERP a postupy na počítači aj ďalšie úlohy, ktoré ľudia robia na počítači.",
  },

  hero: {
    eyebrow: "Kariéra",
    title: "Práca je otvorená každému.",
    subtitle:
      "Pracovné ponuky tu nenájdeš. Nasadzuj next-vibe u klientov, automatizuj reálne firmy a zarábaj na zverejnených zručnostiach. Všetko potrebné je na GitHube.",
    ctaPrimary: "Začať vyvíjať",
    ctaSecondary: "Čítať dokumentáciu",
  },

  audience: {
    title: "Kto vyvíja s next-vibe",
    items: {
      freelancers: {
        title: "Vývojári na voľnej nohe a agentúry",
        description:
          "Dodávaj klientom nástroje s AI bez samostatných serverových častí, príkazových riadkov a rozhraní. Všetko vychádza z jedného kódu.",
      },
      businessDevs: {
        title: "Vývojári firemných systémov",
        description:
          "Pripoj ERP, CRM alebo iný interný systém k postupom s AI. Pošli údaje, získaj rozhodnutie. Ďalší prepojovací kód netreba.",
      },
      industrialDevs: {
        title: "Priemyselné a vstavané systémy",
        description:
          "Automatizuj nastavovanie zariadení na výrobných linkách. Spúšťaj zručnosti AI pri signále zo snímača. Meraj cez Vibe Sense, konaj cez Autopilot.",
      },
      enterpriseDevs: {
        title: "Podnikové tímy",
        description:
          "Nahraď roztrieštené nástroje jednou platformou. Webové rozhranie, CLI, MCP a natívna aplikácia vychádzajú z rovnakého koncového bodu.",
      },
    },
  },

  useCases: {
    title: "Čo môžeš vytvoriť",
    items: {
      erpIntegration: {
        title: "Prepojenie ERP a firemných systémov",
        description:
          "Odovzdaj výrobné údaje zručnosti AI, ktorá zatriedi chyby, upraví zásoby alebo spustí doobjednanie. Koncový bod zabezpečí prepojenie.",
      },
      desktopAutomation: {
        title: "Automatizácia pracovnej plochy",
        description:
          "next-vibe dokáže ovládať celú pracovnú plochu vrátane prehliadača. Vypĺňanie formulárov, získavanie údajov z webu, navigácia aj práca so súbormi. Postup napíšeš raz a spustíš kdekoľvek.",
      },
      productionLine: {
        title: "Automatizácia výrobnej linky",
        description:
          "Nastavuj zariadenia na diaľku cez koncový bod. Spúšťaj kontroly kvality cez Vibe Sense. Keď meranie prekročí hranicu, zručnosť AI zareaguje.",
      },
      autopilotScheduling: {
        title: "Naplánované akcie AI",
        description:
          "Autopilot spúšťa zručnosti podľa harmonogramu. Každú hodinu skontroluje zdroj údajov, v noci zhrnie denníky a pri odchýlke pošle upozornenie.",
      },
      vibeSenseMonitoring: {
        title: "Zmeraj, rozhodni, vykonaj",
        description:
          "Vibe Sense meria napríklad výkon stroja, stav API alebo dĺžku frontu. Meranie dostane zručnosť, ktorá rozhodne. Koncový bod vykoná akciu.",
      },
      skillEconomy: {
        title: "Zarábaj na tom, čo vytvoríš",
        description:
          "Zabaľ automatizáciu do zručnosti a zdieľaj odkaz. Získaš 10 % z každej platby každého používateľa, ktorý sa cezň zaregistruje, kým platí.",
      },
    },
  },

  architecture: {
    title: "Jedna definícia pre všetky rozhrania.",
    subtitle:
      "Pre každú funkciu napíš jeden definition.ts. Zvyšok sa vygeneruje.",
    surfaces: {
      web: "Webový formulár",
      cli: "Príkaz CLI",
      mcp: "Nástroj MCP",
      native: "Obrazovka natívnej aplikácie",
      cron: "Úloha cron",
      ai: "Zručnosť dostupná pre AI",
    },
    description:
      "Platforma sa určí pri spustení. Rovnaký koncový bod, ktorý človeku zobrazí webové rozhranie, poskytne agentovi AI volateľný nástroj. Ďalší kód netreba.",
  },

  referral: {
    title: "Vytvor, zdieľaj, zarábaj.",
    description:
      "Každá zdieľaná zručnosť nesie tvoj odkaz na odporúčanie. Z platby každého používateľa, ktorého privedieš, získaš 10 %. Ďalších 5 % dostaneš, ak cudzí odkaz privedie používateľa k tvojej zručnosti. Provízie dostávaš, kým títo používatelia platia.",
    cta: "Ako sa zarába na zručnostiach",
  },

  cta: {
    title: "Začni jedným koncovým bodom.",
    subtitle:
      "Za pár minút pridáš next-vibe do existujúceho projektu. Môžeš začať aj zo šablóny a nasadiť nástroj so všetkými rozhraniami ešte dnes.",
    primary: "Začať",
    secondary: "Čítať články o vývoji",
  },

  // kept for type compatibility
  post: {
    title: "Tvorba aplikácií s next-vibe",
    description: "Koncový bod vývojárskej platformy",
    form: {
      title: "Nastavenie",
      description: "Nastavte parametre",
    },
    response: {
      title: "Odpoveď",
      description: "Údaje odpovede",
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
