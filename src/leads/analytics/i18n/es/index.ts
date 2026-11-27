import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  leadAnalytics: {
    traffic: {
      label: "Tráfico",
      description: "Personas, bots o desconocido (según el user agent)",
      all: "Todo el tráfico",
      humans: "Personas",
      bots: "Bots",
      unknown: "Desconocido (sin user agent)",
      notBots: "Sin bots (personas + desconocido)",
    },
    botFamily: {
      label: "Agente",
      description:
        "Familia de user agent. Persona es todo agente que no coincide con ninguna regla de bots.",
      human: "Persona",
      meta: "Crawler de Meta",
      google: "Googlebot",
      bing: "Bingbot",
      openai: "Bots de OpenAI",
      anthropic: "Bots de Claude",
      perplexity: "Bots de Perplexity",
      otherAi: "Otros crawlers de IA",
      socialPreview: "Vistas previas de enlaces",
      automation: "Scripts y headless",
      otherBot: "Otros bots",
      noUa: "Sin user agent",
    },
    channel: {
      label: "Tipo de canal",
      description: "Cómo llegó el prospecto la primera vez",
      all: "Todos los canales",
      campaign: "Campaña",
      referral: "Referido",
      organic: "Orgánico",
      direct: "Directo",
      unattributed: "Sin seguimiento",
    },
    device: {
      label: "Dispositivo",
      description: "Tipo de dispositivo según el user agent",
      desktop: "Escritorio",
      mobile: "Móvil",
      tablet: "Tableta",
      bot: "Bot",
      unknown: "Desconocido",
    },
    reach: {
      label: "Paso alcanzado",
      description: "Solo prospectos que llegaron al menos hasta aquí",
      any: "Cualquiera",
      visited: "Visita registrada",
      signedUp: "Registrado",
      emailConfirmed: "Correo confirmado",
      firstChat: "Primer chat",
      paid: "Pagó",
    },
    dimension: {
      label: "Desglosar por",
      description: "Dimensión de la tabla de desglose",
      channelType: "Tipo de canal",
      channel: "Canal",
      source: "Fuente UTM",
      medium: "Medio UTM",
      campaign: "Campaña UTM",
      referrerHost: "Referente",
      landingPath: "Página de entrada",
      refCode: "Código de referido",
      country: "País del visitante",
      localeCountry: "Región del idioma",
      device: "Dispositivo",
      browser: "Navegador",
      os: "Sistema operativo",
      browserLanguage: "Idioma del navegador",
      botFamily: "Agente",
    },
    abuse: {
      groupBy: {
        label: "Agrupar por",
        description:
          "Agrupa prospectos por prefijo de red o por user agent exacto",
        ipPrefix: "Prefijo IP (/24, /48)",
        uaFingerprint: "User agent",
      },
    },
    filters: {
      channel: {
        label: "Canal",
        description: "Canal del primer contacto, p. ej. direct o ref:CODE",
      },
      source: {
        label: "Fuente UTM",
        description: "utm_source del primer contacto, p. ej. google",
      },
      medium: {
        label: "Medio UTM",
        description: "utm_medium del primer contacto, p. ej. cpc",
      },
      campaign: {
        label: "Campaña UTM",
        description: "utm_campaign del primer contacto",
      },
      referrerHost: {
        label: "Referente",
        description: "Host referente del primer contacto, p. ej. reddit.com",
      },
      landingPath: {
        label: "Página de entrada",
        description: "Primera página vista, p. ej. /en-US/story",
      },
      refCode: {
        label: "Código de referido",
        description: "Código de referido del primer contacto o del prospecto",
      },
      country: {
        label: "País del visitante",
        description: "País según la IP, p. ej. DE (ZZ = desconocido)",
      },
      localeCountry: {
        label: "Región del idioma",
        description:
          "Región del idioma elegido en el sitio, p. ej. DE o GLOBAL",
      },
      browser: {
        label: "Navegador",
        description: "Nombre del navegador, p. ej. Chrome",
      },
      os: {
        label: "Sistema operativo",
        description: "Sistema operativo, p. ej. Android",
      },
      browserLanguage: {
        label: "Idioma del navegador",
        description:
          "Idioma principal del navegador en la primera visita, p. ej. hi",
      },
      ipPrefix: {
        label: "Prefijo IP",
        description: "Red, p. ej. 203.0.113.0/24 o 2001:db8:1::/48",
      },
      uaFingerprint: {
        label: "ID de user agent",
        description: "Huella de 10 caracteres del user agent exacto",
      },
      createdFrom: {
        label: "Creado desde",
        description: "Prospectos creados ese día o después (YYYY-MM-DD)",
      },
      createdTo: {
        label: "Creado hasta",
        description: "Prospectos creados ese día o antes (YYYY-MM-DD)",
      },
      reachedFrom: {
        label: "Paso desde",
        description: "El paso se alcanzó ese día o después",
      },
      reachedTo: {
        label: "Paso hasta",
        description: "El paso se alcanzó ese día o antes",
      },
    },
    metrics: {
      visits: "Visitas",
      visitors: "Visitantes",
      leads: "Prospectos",
      humanLeads: "Prospectos humanos",
      notBotLeads: "Prospectos sin bots",
      botLeads: "Prospectos bot",
      signups: "Registros",
      emailConfirmed: "Confirmados",
      firstChats: "Chatearon",
      payers: "Pagadores",
      signupRate: "Tasa de registro",
      payRate: "Tasa de pago",
      botShare: "Cuota de bots",
      distinctUas: "Agentes",
      freeCredits: "Créditos gratis",
      firstSeen: "Visto por primera vez",
      lastSeen: "Visto por última vez",
    },
    unknownCountry: "Desconocido",
    none: "(ninguno)",
    noneHint: "Sin seguimiento: creado por API o sin user agent",
    overviewFailed: "No se pudo calcular el resumen de adquisición.",
  },
};
