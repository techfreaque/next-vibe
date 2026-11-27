import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  leadAnalytics: {
    traffic: {
      label: "Trafic",
      description: "Humains, bots ou inconnu (détectés via le user agent)",
      all: "Tout le trafic",
      humans: "Humains",
      bots: "Bots",
      unknown: "Inconnu (sans user agent)",
      notBots: "Hors bots (humains + inconnu)",
    },
    botFamily: {
      label: "Agent",
      description:
        "Famille de user agent. Humain désigne tout agent qu'aucune règle bot ne reconnaît.",
      human: "Humain",
      meta: "Crawler Meta",
      google: "Googlebot",
      bing: "Bingbot",
      openai: "Bots OpenAI",
      anthropic: "Bots Claude",
      perplexity: "Bots Perplexity",
      otherAi: "Autres crawlers IA",
      socialPreview: "Aperçus de liens",
      automation: "Scripts et headless",
      otherBot: "Autres bots",
      noUa: "Sans user agent",
    },
    channel: {
      label: "Type de canal",
      description: "Comment le lead est arrivé la première fois",
      all: "Tous les canaux",
      campaign: "Campagne",
      referral: "Parrainage",
      organic: "Organique",
      direct: "Direct",
      unattributed: "Non suivi",
    },
    device: {
      label: "Appareil",
      description: "Type d'appareil déduit du user agent",
      desktop: "Ordinateur",
      mobile: "Mobile",
      tablet: "Tablette",
      bot: "Bot",
      unknown: "Inconnu",
    },
    reach: {
      label: "Étape atteinte",
      description: "Uniquement les leads arrivés au moins jusqu'ici",
      any: "Toutes",
      visited: "Visite suivie",
      signedUp: "Inscrit",
      emailConfirmed: "E-mail confirmé",
      firstChat: "Premier chat",
      paid: "Payé",
    },
    dimension: {
      label: "Ventiler par",
      description: "Dimension du tableau de ventilation",
      channelType: "Type de canal",
      channel: "Canal",
      source: "Source UTM",
      medium: "Support UTM",
      campaign: "Campagne UTM",
      referrerHost: "Référent",
      landingPath: "Page d'arrivée",
      refCode: "Code parrain",
      country: "Pays du visiteur",
      localeCountry: "Région de langue",
      device: "Appareil",
      browser: "Navigateur",
      os: "Système",
      browserLanguage: "Langue du navigateur",
      botFamily: "Agent",
    },
    abuse: {
      groupBy: {
        label: "Regrouper par",
        description:
          "Regrouper les leads par préfixe réseau ou par user agent exact",
        ipPrefix: "Préfixe IP (/24, /48)",
        uaFingerprint: "User agent",
      },
    },
    filters: {
      channel: {
        label: "Canal",
        description: "Canal du premier contact, ex. direct ou ref:CODE",
      },
      source: {
        label: "Source UTM",
        description: "utm_source du premier contact, ex. google",
      },
      medium: {
        label: "Support UTM",
        description: "utm_medium du premier contact, ex. cpc",
      },
      campaign: {
        label: "Campagne UTM",
        description: "utm_campaign du premier contact",
      },
      referrerHost: {
        label: "Référent",
        description: "Hôte référent du premier contact, ex. reddit.com",
      },
      landingPath: {
        label: "Page d'arrivée",
        description: "Première page vue, ex. /en-US/story",
      },
      refCode: {
        label: "Code parrain",
        description: "Code de parrainage du premier contact ou du lead",
      },
      country: {
        label: "Pays du visiteur",
        description: "Pays selon l'IP, ex. DE (ZZ = inconnu)",
      },
      localeCountry: {
        label: "Région de langue",
        description:
          "Région de la langue choisie sur le site, ex. DE ou GLOBAL",
      },
      browser: {
        label: "Navigateur",
        description: "Nom du navigateur, ex. Chrome",
      },
      os: {
        label: "Système",
        description: "Système d'exploitation, ex. Android",
      },
      browserLanguage: {
        label: "Langue du navigateur",
        description:
          "Langue principale du navigateur à la première visite, par ex. hi",
      },
      ipPrefix: {
        label: "Préfixe IP",
        description: "Réseau, ex. 203.0.113.0/24 ou 2001:db8:1::/48",
      },
      uaFingerprint: {
        label: "ID du user agent",
        description: "Empreinte de 10 caractères du user agent exact",
      },
      createdFrom: {
        label: "Créé à partir du",
        description: "Leads créés ce jour ou après (YYYY-MM-DD)",
      },
      createdTo: {
        label: "Créé jusqu'au",
        description: "Leads créés ce jour ou avant (YYYY-MM-DD)",
      },
      reachedFrom: {
        label: "Étape à partir du",
        description: "Étape atteinte ce jour ou après",
      },
      reachedTo: {
        label: "Étape jusqu'au",
        description: "Étape atteinte ce jour ou avant",
      },
    },
    metrics: {
      visits: "Visites",
      visitors: "Visiteurs",
      leads: "Leads",
      humanLeads: "Leads humains",
      notBotLeads: "Leads hors bots",
      botLeads: "Leads bots",
      signups: "Inscriptions",
      emailConfirmed: "Confirmés",
      firstChats: "Ont chatté",
      payers: "Payeurs",
      signupRate: "Taux d'inscription",
      payRate: "Taux de paiement",
      botShare: "Part de bots",
      distinctUas: "Agents",
      freeCredits: "Crédits gratuits",
      firstSeen: "Vu en premier",
      lastSeen: "Vu en dernier",
    },
    unknownCountry: "Inconnu",
    none: "(aucun)",
    noneHint: "Non suivi : créé par API ou sans user agent",
    overviewFailed: "Impossible de calculer l'aperçu d'acquisition.",
  },
};
