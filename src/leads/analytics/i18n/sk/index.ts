import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  leadAnalytics: {
    traffic: {
      label: "Návštevnosť",
      description:
        "Ľudia, roboty alebo neznámy pôvod (podľa identifikátora klienta)",
      all: "Celá návštevnosť",
      humans: "Ľudia",
      bots: "Roboty",
      unknown: "Neznáme (bez identifikátora klienta)",
      notBots: "Bez robotov (ľudia a neznáme)",
    },
    botFamily: {
      label: "Klient",
      description:
        "Skupina podľa identifikátora klienta. Za človeka považujeme návštevníka, ktorého klient nezodpovedá žiadnemu pravidlu pre roboty.",
      human: "Človek",
      meta: "Indexovací robot Meta",
      google: "Googlebot",
      bing: "Bingbot",
      openai: "Roboty OpenAI",
      anthropic: "Roboty Claude",
      perplexity: "Roboty Perplexity",
      otherAi: "Iné indexovacie roboty AI",
      socialPreview: "Náhľady odkazov",
      automation: "Skripty a klienti bez grafického rozhrania",
      otherBot: "Ostatné roboty",
      noUa: "Bez identifikátora klienta",
    },
    channel: {
      label: "Typ kanála",
      description: "Odkiaľ kontakt prišiel prvýkrát",
      all: "Všetky kanály",
      campaign: "Kampaň",
      referral: "Odporúčanie",
      organic: "Organické",
      direct: "Priame",
      unattributed: "Nesledované",
    },
    device: {
      label: "Zariadenie",
      description: "Typ zariadenia podľa identifikátora klienta",
      desktop: "Počítač",
      mobile: "Mobil",
      tablet: "Tablet",
      bot: "Robot",
      unknown: "Neznáme",
    },
    reach: {
      label: "Dosiahnutý krok",
      description: "Zahrnie iba kontakty, ktoré dosiahli aspoň tento krok",
      any: "Ľubovoľný",
      visited: "Zaznamenaná návšteva",
      signedUp: "Registrácia",
      emailConfirmed: "Potvrdený e-mail",
      firstChat: "Prvý čet",
      paid: "Platba",
    },
    dimension: {
      label: "Rozdeliť podľa",
      description: "Dimenzia, podľa ktorej sa rozdelia riadky tabuľky",
      channelType: "Typ kanála",
      channel: "Kanál",
      source: "Zdroj UTM",
      medium: "Médium UTM",
      campaign: "Kampaň UTM",
      referrerHost: "Odkazujúci web",
      landingPath: "Vstupná stránka",
      refCode: "Kód odporúčania",
      country: "Krajina návštevníka",
      localeCountry: "Región jazykového nastavenia",
      device: "Zariadenie",
      browser: "Prehliadač",
      os: "Operačný systém",
      botFamily: "Klient",
    },
    abuse: {
      groupBy: {
        label: "Zoskupiť podľa",
        description:
          "Zoskupí kontakty podľa prefixu siete alebo presnej zhody identifikátora klienta",
        ipPrefix: "Prefix IP (/24, /48)",
        uaFingerprint: "Identifikátor klienta",
      },
    },
    filters: {
      channel: {
        label: "Kanál",
        description:
          "Kanál pri prvom kontakte, napríklad direct alebo ref:CODE",
      },
      source: {
        label: "Zdroj UTM",
        description: "Hodnota utm_source pri prvom kontakte, napríklad google",
      },
      medium: {
        label: "Médium UTM",
        description: "Hodnota utm_medium pri prvom kontakte, napríklad cpc",
      },
      campaign: {
        label: "Kampaň UTM",
        description: "Hodnota utm_campaign pri prvom kontakte",
      },
      referrerHost: {
        label: "Odkazujúci web",
        description:
          "Doména odkazujúceho webu pri prvom kontakte, napríklad reddit.com",
      },
      landingPath: {
        label: "Vstupná stránka",
        description: "Prvá zobrazená stránka, napríklad /en-US/story",
      },
      refCode: {
        label: "Kód odporúčania",
        description:
          "Kód odporúčania priradený k prvému kontaktu alebo uložený pri kontakte",
      },
      country: {
        label: "Krajina návštevníka",
        description:
          "Krajina návštevníka podľa IP adresy, napríklad DE (ZZ = neznáma)",
      },
      localeCountry: {
        label: "Región jazykového nastavenia",
        description:
          "Región zvoleného jazykového nastavenia webu, napríklad DE alebo GLOBAL",
      },
      browser: {
        label: "Prehliadač",
        description: "Názov prehliadača, napríklad Chrome",
      },
      os: {
        label: "Operačný systém",
        description: "Operačný systém, napríklad Android",
      },
      ipPrefix: {
        label: "Prefix IP",
        description: "Sieť, napríklad 203.0.113.0/24 alebo 2001:db8:1::/48",
      },
      uaFingerprint: {
        label: "ID klienta",
        description: "10-znakový odtlačok presného identifikátora klienta",
      },
      createdFrom: {
        label: "Vytvorené od",
        description: "Kontakty vytvorené v tento deň alebo neskôr (YYYY-MM-DD)",
      },
      createdTo: {
        label: "Vytvorené do",
        description: "Kontakty vytvorené v tento deň alebo skôr (YYYY-MM-DD)",
      },
      reachedFrom: {
        label: "Dosiahnutý krok od",
        description: "Krok bol dosiahnutý v tento deň alebo neskôr",
      },
      reachedTo: {
        label: "Dosiahnutý krok do",
        description: "Krok bol dosiahnutý v tento deň alebo skôr",
      },
    },
    metrics: {
      visits: "Návštevy",
      visitors: "Návštevníci",
      leads: "Kontakty",
      humanLeads: "Kontakty od ľudí",
      notBotLeads: "Kontakty bez robotov",
      botLeads: "Kontakty robotov",
      signups: "Registrácie",
      emailConfirmed: "Potvrdené e-maily",
      firstChats: "Prvý čet",
      payers: "Platiaci",
      signupRate: "Podiel registrácií",
      payRate: "Podiel platiacich",
      botShare: "Podiel robotov",
      distinctUas: "Klienti",
      freeCredits: "Bezplatné kredity",
      firstSeen: "Prvý výskyt",
      lastSeen: "Posledný výskyt",
    },
    unknownCountry: "Neznáme",
    none: "(žiadne)",
    noneHint: "Nesledované: vytvorené cez API alebo bez identifikátora klienta",
    overviewFailed: "Prehľad akvizície sa nepodarilo vypočítať.",
  },
};
