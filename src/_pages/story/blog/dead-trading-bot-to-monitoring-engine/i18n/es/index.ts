import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "Mi bot de trading abandonado se convirtió en un sistema de monitoreo | next-vibe",
    description:
      "Abandoné un bot hace años. Luego me di cuenta de su arquitectura - DataSource, Indicador, Evaluador, Acción - se aplica a cualquier negocio. Así que lo reconstruí dentro de next-vibe. Cada nodo es un punto final.",
    category: "Vibe Sense",
    imageAlt: "Vibe Sense monitoring pipeline - next-vibe",
    keywords:
      "vibe sense, monitoring, trading bot, endpoints, EMA, pipeline, next-vibe, TypeScript",
    ogTitle:
      "Mi bot de trading muerto se convirtió en un motor de monitoreo de plataformas",
    ogDescription:
      "El bot comercial tenía esta arquitectura derecha. Me equivoqué donde lo construí.",
    twitterTitle: "Bot de comercio muerto → motor de monitoreo en vivo",
    twitterDescription:
      "Cada nodo es un punto final. El oleoducto es sólo puntos finales llamando puntos finales.",
  },
  backToBlog: "Volver al blog",
  hero: {
    eyebrow: "Vibe Sense",
    title: "Así monitorea la plataforma su propio estado.",
    subtitle:
      "Abandoné un bot hace años. Su arquitectura se convirtió en la parte más interesante de next-vibe. Cada nodo en el gráfico es un punto final - llamada desde el CLI, descubierta por AI, conectado a su plataforma.",
    readTime: "14 min leer",
  },
  origin: {
    title: "El bot que abandoné",
    paragraph1:
      "Hace unos años, le pronuncié a OctoBot y construí algo que llamé Octane. Reaccionar frontend. Podría arrastrar indicadores técnicos sobre un lienzo, evaluadores de cadena juntos, configurar reglas de ejecución, establecer alertas, órdenes de incendio. Tenía una estrategia visual completa. Todavía lo hago por mi propio portafolio.",
    paragraph2:
      "Lo abandoné como base de código. El Python estaba esparciendo, la arquitectura había acumulado suficiente deuda que cada cambio se sentía costoso, y tenía otras cosas que construir.",
    paragraph3:
      "Pero sigo pensando en ello. Específicamente sobre lo que hizo funcionar como un sistema.",
    quoteText:
      "El bot comercial tenía esta arquitectura derecha. Lo que me equivoqué fue construirlo en aislamiento.",
    timeline: {
      octane: {
        label: "Octane (OctoBot tenedor)",
        description:
          "Construcción de estrategias visuales, indicadores de arrastrar y soltar, backend de Python. Abandonado como una base de código.",
      },
      insight: {
        label: "La realización",
        description:
          "Esa estructura no describe el comercio. Describe cualquier proceso de negocio con datos a lo largo del tiempo.",
      },
      rebuilt: {
        label: "Reconstruido dentro de next-vibe",
        description:
          "Muy bien escrito. Cada nodo es un punto final estándar. Accesible en todas partes la plataforma.",
      },
    },
  },
  insight: {
    title: "Cada negocio es una serie de tiempo",
    intro:
      "En un bot comercial, las piezas son simples. Una fuente de datos: datos de precios, volumen, lo que esté leyendo. Un indicador: promedio móvil, RSI, MACD - toma datos brutos, produce una señal derivada. Un evaluador: es el MA rápido sobre el MA lento? Confección booleana. Una acción: cuando el evaluador dispara, haz algo.",
    realization:
      "Esa estructura no describe el comercio. Describe cualquier proceso de negocio donde usted tiene datos a lo largo del tiempo, condiciones que le importan, y acciones que desea tomar cuando esas condiciones se cumplen.",
    examples: {
      userGrowth: {
        label: "Crecimiento del usuario",
        description:
          "Es una serie de tiempo. ¿Está de moda abajo? Es un evaluador. Envía una campaña de recuperación. Es una acción.",
      },
      emailHealth: {
        label: "Salud de la campaña de email",
        description:
          "Tasas abiertas, tasas de rebote, tasas de suscripciones. Toda la serie de tiempo. Todas las condiciones que puedas evaluar. Todo activable.",
      },
      creditEconomy: {
        label: "Economía crediticia",
        description:
          "Velocidad de gasto. Tasa de quemadura vs. tasa de compra. Todo.",
      },
      revenueAnomaly: {
        label: "anomalías de ingresos",
        description:
          "Tasa de reembolso aumenta por encima del 20% en un día - Thea se notifica antes de verlo en un panel.",
      },
    },
  },
  architecture: {
    title: "Los cuatro tipos de nodos",
    subtitle:
      "Tres tipos de nodos que necesitas entender para leer cualquier gráfico. Más un cuarto que cierra el bucle.",
    dataSource: {
      label: "DataSource",
      description:
        "Un punto final de propiedad de dominio que consulta su base de datos y devuelve { timetamp, value }[] para un rango de tiempo y resolución dado. Vive con su dominio. Sabe sobre su propio esquema.",
    },
    indicator: {
      label: "Indicator",
      description:
        "Un punto final de computación pura y reutilizable - EMA, RSI, MACD, Bandas Bollinger, pinza, delta, promedio de ventana. No SQL. No hay conocimiento de dominio. Llámalo en cualquier fuente de datos.",
    },
    evaluator: {
      label: "Evaluator",
      description:
        "Un umbral o una condición. Toma una serie y pregunta. ¿Este valor es inferior a 0,7? ¿Este ratio superó el 20%? Dicta una señal - disparada o no disparada.",
    },
    action: {
      label: "Action",
      description:
        "Cuando se dispara el evaluador aguas arriba, se llama un punto final específico. En proceso. No HTTP. La misma validación, la misma auth, el mismo tipo de respuesta que cualquier otra llamada en el sistema.",
    },
    connector: "piensos en",
  },
  unified: {
    title: "Cada nodo es un punto final",
    intro:
      "Esto es lo que quiero aterrizar ahora mismo, antes de ir más lejos.",
    oldApproach: {
      label: "Antiguo enfoque (Octane)",
      description:
        "EMA existe sólo como un nodo en un gráfico. No puedes llamarlo desde el CLI. No aparece como una herramienta AI. Es un detalle de implementación privado.",
    },
    newApproach: {
      label: "Enfoque next-vibe",
      description:
        "Cada nodo Vibe Sense es un punto final estándar, definido con createEndpoint (), registrado en el mismo registro de punta como todo lo demás en la plataforma.",
    },
    cliCaption:
      "Puedes ejecutar desde la CLI el mismo endpoint EMA que funcionaba como nodo en el grafo de captación de prospectos. Mantiene su definición, validación y autenticación.",
    insight:
      "El mismo endpoint que sirve de nodo en el grafo de captación de prospectos funciona como herramienta independiente en 13 plataformas.",
    keyLine: "El oleoducto es sólo puntos finales llamando puntos finales.",
  },
  actionCallout: {
    title: "Pero las acciones no son comercios",
    body: "Cuando se dispara una señal, el motor llama a cualquier punto final. En proceso. No hay ida y vuelta HTTP. Una alerta. Un gatillo de campaña. Una escalada AI con contexto pre-llenado. Thea es notificado. Empieza una secuencia de vuelta atrás. Lo que sea que esté conectado a ese evaluador.",
    noWebhook: "No hay webhook.",
    noAlerting: "No hay servicio personalizado de alerta.",
    noZapier: "No Zapier.",
    punchline: "La plataforma se llama a sí misma.",
    examples: {
      alert: {
        label: "Alerta",
        description:
          "Llame a la prueba completa - Thea lo recoge de inmediato.",
      },
      campaign: {
        label: "Campaña",
        description:
          "Trigger una secuencia de conversión cuando la velocidad del contacto atraviesa un umbral.",
      },
      ai: {
        label: "Escalada AI",
        description:
          "Dispare un AI con el contexto pre-llenado sobre qué señal lo ha disparado.",
      },
    },
  },
  funnel: {
    title: "Recorre el grafo de captación de prospectos",
    subtitle:
      "Este es el embudo de adquisición de contacto. Funciona cada seis horas. Vamos a rastrearlo arriba abajo.",
    column1: {
      label: "Columna 1: Fuentes de datos",
      description:
        "Puntos finales reales. Cada vida en los contactos/datos-fuentes/. Aceptan un rango de tiempo y resolución, ejecutan su consulta SQL, devuelve { timestamp, value }[].",
      nodes: {
        created: {
          name: "leads.created",
          description:
            "Consulta los prospectos por created_at. Las horas sin prospectos nuevos no generan puntos de datos.",
        },
        converted: {
          name: "leads.converted",
          description:
            "Grouped by converted_at, cuenta con pistas que alcanzaron el estado de SIGNED_UP.",
        },
        bounced: {
          name: "leads.bounced",
          description:
            "Prospectos con correos rechazados por intervalo de tiempo.",
        },
        active: {
          name: "leads.active",
          description:
            "Indicador instantáneo con resolución ONE_DAY. Cuenta los prospectos que aún no llegaron a un estado final.",
        },
      },
    },
    column2: {
      label: "Columna 2: Indicadores",
      description:
        'Puro cálculo. El punto final de EMA vive en análisis/indicadores/ema. Su configuración gráfica es simplemente { tipo: "indicador", indicatorId : "ema", params: { período: 7 } }.',
      nodes: {
        ema7: {
          name: "leads_created_ema7",
          description:
            "Indicador EMA, período=7. Amplia automáticamente el rango de embrague de corriente para calentamiento.",
        },
        conversionRate: {
          name: "conversion_rate",
          description:
            "Transformador: divide los cables.convertidos por los contactos.creado por el cubo de tiempo. Clamado 0-1.",
        },
      },
    },
    column3: {
      label: "Columna 3: Evaluadores",
      description:
        "Condiciones de transmisión. Cada salida de una señal - disparada o no disparada.",
      nodes: {
        leadDrop: {
          name: "eval_lead_drop",
          description:
            "EMA (7) se realizó 0,7 en la resolución ONE_WEEK. Velocidad de creación de contacto suavizada durante 7 periodos gotas por debajo del 70%.",
        },
        zeroLeads: {
          name: "eval_zero_leads",
          description:
            "contactos.creados 1/día. Todo un día pasa sin nuevas pistas.",
        },
        lowConversion: {
          name: "eval_low_conversion",
          description:
            "conversion_rate se realizó el 5%/semana. La conversión de embudo cae por debajo del 5%.",
        },
      },
    },
  },
  domainOwned: {
    title: "Fuentes de datos propiedad de dominio",
    subtitle:
      "Una de las decisiones arquitectónicas que más me satisface: las fuentes de datos viven con su dominio, no en un directorio central vibe-sense/.",
    leadsLabel: "Dominio de los contactos",
    leadsCount: "... 15 fuentes de datos total",
    creditsLabel: "Dominio de créditos",
    creditsCount: "... 17 fuentes de datos total",
    explanation:
      "leads/data-sources/leads-created sabe sobre la tabla de contacto. Importa desde contacto/db. Utiliza LeadStatus de contacto/enum. Si eliminas el módulo de leads, las fuentes de datos van con él. Nada huérfano.",
    indicators: {
      label: "Indicadores de análisis/indicadores/",
      description:
        "Computación pura - EMA, RSI, MACD, Bandas de Bollinger, abrazadera, delta, promedio de ventana. No hay conocimiento de dominio. Llámalos a cualquier fuente de datos.",
    },
    registration:
      "Al iniciarse, el registro de indicadores autodescubre ambos. Data source endpoints register as node definitions. Los puntos finales del indicador se registran como definiciones de nodos. Usted agrega un nuevo dominio, usted añade fuentes de datos/puntos finales, usted exporta graphSeeds. Aparecen.",
    keyLine: "El dominio posee su propia observabilidad.",
  },
  safety: {
    title: "Traducción, retroceso, persistencia",
    subtitle:
      "Tres cosas que hacen que Vibe Sense sea seguro para correr en producción.",
    versioning: {
      label: "Versión",
      description:
        "Los Gráficos están versionados. Cuando editas un gráfico, creas una nueva versión - nunca mutas la activa. La nueva versión es un borrador. Usted lo promueve explícitamente. La vuelta es trivial.",
    },
    backtest: {
      label: "Backtest",
      description:
        "Antes de promocionar, puede hacer retroceder sobre un rango histórico de tiempo. Las condiciones evalúan. Registro de señales. Endpoints nunca disparan. Puerta cerrada.",
    },
    persist: {
      label: "Modos persistas",
      always: {
        label: "always",
        description:
          "Cada punto de datos computados está escrito a la tienda de puntos de datos. Para los indicadores basados en eventos: los contactos creados por minuto, los créditos gastados por minuto.",
      },
      snapshot: {
        label: "snapshot",
        description:
          "Computado a la demanda, caché, pero no almacenado en la tabla principal. Totales diarios, conteos acumulativos.",
      },
      never: {
        label: "never",
        description:
          "Siempre recomputado en vivo de entradas. Productos EMA, ratios - sin coste de almacenamiento. Lookback auto-extended para el calentamiento.",
      },
    },
  },
  ships: {
    title: "Qué naves vs. qué viene",
    prodReady: {
      label: "Hoy en día la producción está lista",
      items: {
        engine:
          "Motor completo: puntos finales de la fuente de datos, puntos finales del indicador (EMA, RSI, MACD, Bollinger, clamp, delta, ventana), evaluadores umbral, nodos transformadores, nodos de acción de punto final.",
        execution:
          "Ejecución topológica a través del caminante gráfico. Soporte multi-resolución con escala automática/down. Ampliación de gama de Lookback-aware.",
        versioning:
          "Versión, modo de retroceso con historia de ejecución completa, persistencia de señal como ruta de auditoría.",
        cli: "Acceso CLI - vibe vibe-sense-ema, vibe vibe-sense-rsi, cualquier punto final de indicador, independiente.",
        mcp: "Registro MCP - puntos finales indicador aparecen en la lista de herramientas. Thea puede llamar a los indicadores directamente.",
        seeds:
          "Gráficos de semillas: 29 gráficos en 9 dominios - contactos, créditos, usuarios, suscripciones, referencias, boletines, pagos, mensajero, chat AI y salud del sistema. Todo se acaba de la caja en vibe dev.",
      },
    },
    coming: {
      label: "Voy a la siguiente",
      items: {
        builder:
          "Generador de gráficos de arrastrar y soltar. El motor está completamente construido. El editor de lienzos es el siguiente capítulo.",
        trading:
          "Puntos finales. Puntos finales de fuente de datos de precios, intercambio de puntos finales API, ejecución de pedidos cableado como nodos de punto final. Un gráfico comercial es sólo otro gráfico.",
        marketplace:
          "Mercado de estrategias. Cuando creas grafos visualmente, puedes compartirlos. Importa una estrategia de seguimiento de prospectos, duplícala y adáptala.",
      },
    },
  },
  vision: {
    title: "¿Qué es esto?",
    paragraph1:
      "Cada proceso de negocio que se puede describir como: dados estos datos, cuando se cumplen estas condiciones, haga esto - es un gráfico Vibe Sense. Monitoreo, sí. Alertando, sí. Pero también: calificación de contacto automatizada, detección de anomalías de ingresos, equilibrio de la economía crediticia, automatización de marketing.",
    paragraph2:
      "El bot comercial tenía esta arquitectura derecha. Indicadores, evaluadores, acciones, modo de prueba. Lo que me equivoqué fue construirlo en aislamiento. En Octane, EMA estaba encerrado dentro del oleoducto. En next-vibe, EMA es un punto final de primera clase.",
    keyLine:
      "No construyes un sistema de monitoreo. Tú construyes tu plataforma. El sistema de vigilancia ya está allí.",
    closeTagline:
      "Definelo una vez. Existe en todas partes. El oleoducto es sólo puntos finales llamando puntos finales.",
    cta: {
      primary: "Ver en GitHub",
      secondary: "Volver al blog",
    },
    quickstart: {
      label: "Inicio rápido",
      description:
        "vibe dev inicia PostgreSQL en Docker, ejecuta migraciones, datos de semillas, semillas los gráficos Vibe Sense, backfills 365 días de datos históricos, y lanza el servidor dev. Abran localhost:3000. Los gráficos están corriendo.",
    },
  },
  ui: {
    emaFunctionLabel: "computeEma()",
  },
};
