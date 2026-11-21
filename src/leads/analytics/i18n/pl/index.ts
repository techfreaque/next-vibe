import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  leadAnalytics: {
    traffic: {
      label: "Ruch",
      description:
        "Ludzie, boty lub jedni i drudzy (rozpoznane po user agencie)",
      all: "Cały ruch",
      humans: "Ludzie",
      bots: "Boty",
    },
    botFamily: {
      label: "Agent",
      description:
        "Rodzina user agenta. Człowiek to każdy agent, do którego nie pasuje żadna reguła botów.",
      human: "Człowiek",
      meta: "Crawler Meta",
      google: "Googlebot",
      bing: "Bingbot",
      openai: "Boty OpenAI",
      anthropic: "Boty Claude",
      perplexity: "Boty Perplexity",
      otherAi: "Inne crawlery AI",
      socialPreview: "Podglądy linków",
      automation: "Skrypty i headless",
      otherBot: "Inne boty",
      noUa: "Brak user agenta",
    },
    channel: {
      label: "Typ kanału",
      description: "Skąd lead przyszedł za pierwszym razem",
      all: "Wszystkie kanały",
      campaign: "Kampania",
      referral: "Polecenie",
      organic: "Organiczny",
      direct: "Bezpośredni",
      unattributed: "Nieśledzony",
    },
    device: {
      label: "Urządzenie",
      description: "Klasa urządzenia odczytana z user agenta",
      desktop: "Komputer",
      mobile: "Telefon",
      tablet: "Tablet",
      bot: "Bot",
      unknown: "Nieznane",
    },
    reach: {
      label: "Osiągnięty etap",
      description: "Tylko leady, które doszły co najmniej tutaj",
      any: "Dowolny",
      visited: "Śledzona wizyta",
      signedUp: "Rejestracja",
      emailConfirmed: "E-mail potwierdzony",
      firstChat: "Pierwszy czat",
      paid: "Płatność",
    },
    dimension: {
      label: "Podział według",
      description: "Wymiar tabeli podziału",
      channelType: "Typ kanału",
      channel: "Kanał",
      source: "Źródło UTM",
      medium: "Medium UTM",
      campaign: "Kampania UTM",
      referrerHost: "Referrer",
      landingPath: "Strona wejścia",
      refCode: "Kod ref.",
      country: "Kraj",
      device: "Urządzenie",
      browser: "Przeglądarka",
      os: "System",
      botFamily: "Agent",
    },
    abuse: {
      groupBy: {
        label: "Grupuj według",
        description:
          "Grupuj leady według prefiksu sieci lub dokładnego user agenta",
        ipPrefix: "Prefiks IP (/24, /48)",
        uaFingerprint: "User agent",
      },
    },
    filters: {
      channel: {
        label: "Kanał",
        description: "Kanał pierwszego kontaktu, np. direct lub ref:CODE",
      },
      source: {
        label: "Źródło UTM",
        description: "utm_source pierwszego kontaktu, np. google",
      },
      medium: {
        label: "Medium UTM",
        description: "utm_medium pierwszego kontaktu, np. cpc",
      },
      campaign: {
        label: "Kampania UTM",
        description: "utm_campaign pierwszego kontaktu",
      },
      referrerHost: {
        label: "Referrer",
        description: "Host referrera przy pierwszym kontakcie, np. reddit.com",
      },
      landingPath: {
        label: "Strona wejścia",
        description: "Pierwsza odwiedzona strona, np. /en-US/story",
      },
      refCode: {
        label: "Kod ref.",
        description: "Kod polecający z pierwszego kontaktu lub leada",
      },
      country: {
        label: "Kraj",
        description: "Kod kraju, np. DE",
      },
      browser: {
        label: "Przeglądarka",
        description: "Nazwa przeglądarki, np. Chrome",
      },
      os: {
        label: "System",
        description: "System operacyjny, np. Android",
      },
      ipPrefix: {
        label: "Prefiks IP",
        description: "Sieć, np. 203.0.113.0/24 lub 2001:db8:1::/48",
      },
      uaFingerprint: {
        label: "ID user agenta",
        description: "10-znakowy odcisk dokładnego user agenta",
      },
      createdFrom: {
        label: "Utworzone od",
        description: "Leady utworzone tego dnia lub później (YYYY-MM-DD)",
      },
      createdTo: {
        label: "Utworzone do",
        description: "Leady utworzone tego dnia lub wcześniej (YYYY-MM-DD)",
      },
      reachedFrom: {
        label: "Etap od",
        description: "Etap osiągnięty tego dnia lub później",
      },
      reachedTo: {
        label: "Etap do",
        description: "Etap osiągnięty tego dnia lub wcześniej",
      },
    },
    metrics: {
      visits: "Wizyty",
      visitors: "Odwiedzający",
      leads: "Leady",
      humanLeads: "Leady ludzi",
      botLeads: "Leady botów",
      signups: "Rejestracje",
      emailConfirmed: "Potwierdzone",
      firstChats: "Czatowali",
      payers: "Płacący",
      signupRate: "Wskaźnik rejestracji",
      payRate: "Wskaźnik płatności",
      botShare: "Udział botów",
      distinctUas: "Agenty",
      freeCredits: "Darmowe kredyty",
      firstSeen: "Pierwsza wizyta",
      lastSeen: "Ostatnia wizyta",
    },
    none: "(brak)",
    noneHint: "Brak śledzenia: utworzone przez API lub bez user agenta",
    overviewFailed: "Nie udało się obliczyć przeglądu pozyskania.",
  },
};
