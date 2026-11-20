import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Crecimiento",
  tags: {
    vibeSense: "vibe-sense",
    growth: "crecimiento",
    campaigns: "Campañas",
    spend: "gastar",
  },
  enums: {
    currency: { eur: "EUR", usd: "USD", pln: "PLN" },
    funnelStep: {
      visit: "Primera visita",
      chat: "Primer mensaje de chat",
      signup: "Signup",
      newsletter: "Boletín confirmado",
      paid: "Primer pago",
      retained: "Renovación del segundo mes",
    },
    attributionTouch: {
      first: "Primer toque",
      last: "Último toque",
    },
    channelType: {
      all: "Todos los canales",
      campaign: "Campaign (UTM)",
      referral: "Código de referido",
      organic: "Revisor orgánico",
      direct: "Direct",
    },
    paidKind: {
      subscription: "Suscripción",
      pack: "Paquete de créditos",
    },
  },
  links: {
    get: {
      title: "Campaign Links",
      titleShort: "Campaign Links",
      description:
        "Etiqueta enlaces por canal de marketing, con visitas, registros y usuarios que pagan cada enlace traído.",
      response: {
        links: "Enlaces",
      },
      widget: {
        title: "Enlaces de campaña",
        subtitle: "Etiqueta cada prueba de canal. Juzgadlo por quien paga.",
        create: "Nuevo enlace",
        refresh: "Actualizar",
        loading: "Cargando enlaces...",
        empty: {
          title: "No hay enlaces de campaña todavía",
          hint: "Cree un enlace por prueba de canal. Cada visita, registro y pago trae tierras aquí.",
          cta: "Crear el primer enlace",
        },
        visits: "Visitas",
        signups: "Registros",
        paid: "Pagado",
        funnel: "{{visits}} visitas → {{signups}} signups → {{paid}} pagado",
        paidRate: "{{rate}} de las visitas pagadas",
        refCode: "Ref {{code}}",
        landsOn: "Destino: {{path}}",
        copy: "Copiar el enlace",
        copied: "Copiado",
        spend: "Gasto de canal",
      },
    },
    post: {
      title: "Crear vínculo de campaña",
      titleShort: "Nuevo enlace",
      description:
        "Construir un enlace UTM - etiquetado para un canal, opcionalmente vinculado a un código de referencia.",
      fields: {
        name: {
          label: "Nombre",
          description:
            "Nombre interno, por ejemplo: 'Reddit r/LocalLLaMA launch post'",
          placeholder: "Post de lanzamiento de Reddit",
        },
        channel: {
          label: "Fuente (utm_source)",
          description: "De dónde viene el tráfico: reddit, youtube, x",
          placeholder: "reddit",
        },
        medium: {
          label: "Medio (utm_medium)",
          description: "Tipo de tráfico: social, cpc, email, video",
          placeholder: "social",
        },
        campaign: {
          label: "Campaign (utm_campaign)",
          description: "La prueba que este enlace pertenece a",
          placeholder: "launch-nov",
        },
        content: {
          label: "Contenido (utm_content)",
          description: "Opcional. Que creativo o colocado",
          placeholder: "top-comment",
        },
        term: {
          label: "Term (utm_term)",
          description: "Opcional. Palabras clave de pago",
          placeholder: "uncensored ai",
        },
        destinationPath: {
          label: "Sendero de aterrizaje",
          description:
            "Camino en este sitio el enlace se abre, por ejemplo / o /en- US /story",
          placeholder: "/",
        },
        refCode: {
          label: "Código de referido",
          description:
            "Opcional. Rutas de la visita a través /track por lo que el código de referencia se acredita también",
          placeholder: "FRIEND2024",
        },
      },
      response: {
        id: "Enlace ID",
        url: "Campaign URL",
      },
      widget: {
        back: "Atrás",
        hint: "La misma fuente para el mismo canal, cada vez. Gasto y costo por grupo de usuarios pagado por fuente.",
        created: "Enlace listo. Compartir este URL exacto :",
        copy: "Copiar el enlace",
        copied: "Copiado",
      },
    },
  },
  spend: {
    get: {
      title: "Gasto de canal",
      titleShort: "Gasto de canal",
      description:
        "Pase por canal y período, con registros, usuarios pagados y costo por usuario pagado.",
      response: {
        rows: "Entradas gastadas",
      },
      widget: {
        title: "Gasto de canal",
        subtitle:
          "Lo que cada canal cuesta, y lo que un usuario que paga le cuesta.",
        add: "Añadir gasto",
        refresh: "Actualizar",
        loading: "Cargando gastan...",
        empty: {
          title: "No gastas registrado",
          hint: "Inicie lo que cuesta una prueba de canal. El coste por usuario pagado aparece tan pronto como trae a alguien que paga.",
          cta: "Paso de inicio",
        },
        period: "{{from}} – {{to}}",
        signups: "Registros",
        paid: "Usuarios de pago",
        costPerPaid: "Costo / usuario pagado",
        costPerSignup: "Costo / registro",
        none: ", ",
        attribution:
          "Los usuarios cuentan hacia el canal que primero los trajo (primer toque), dentro del período.",
      },
    },
    post: {
      title: "Paso del canal de registro",
      titleShort: "Log Spend",
      description:
        "Grabar lo que un canal cuesta en un período. El mismo canal y la fecha de inicio sobrescribe la entrada.",
      fields: {
        channel: {
          label: "Canal",
          description:
            "utm_source del canal, o ref: CODE para un socio de referencia",
          placeholder: "reddit",
        },
        periodStart: {
          label: "Desde",
          description: "Primer día del período de gasto",
        },
        periodEnd: {
          label: "A",
          description: "Último día del periodo de gasto",
        },
        amount: {
          label: "Monto",
          description: "Total gastado en el período",
        },
        currency: {
          label: "Moneda",
          description: "Moneda de la cantidad",
        },
        note: {
          label: "Nota",
          description: "Opcional. Lo que el dinero compró",
          placeholder: "2 puestos promovidos",
        },
      },
      response: {
        id: "Entrada ID",
      },
      widget: {
        back: "Atrás",
        hint: "Utilice el nombre de fuente exacto que usan sus enlaces de campaña, o el gráfico no puede igualar gastar a los usuarios.",
      },
    },
  },
  dataSources: {
    fields: {
      resolution: { label: "Resolución", description: "Tamaño del cubo" },
      range: {
        label: "Rango",
        description: "Rango de tiempo para la consulta",
      },
      lookback: {
        label: "Mira atrás.",
        description: "Barras extra antes de empezar el rango",
      },
      meta: { label: "Meta", description: "Metadatos de ejecución de nodos" },
      touch: {
        label: "Attribution",
        description: "Grupo por el primero o el último toque",
      },
      channelType: {
        label: "Tipo de canal",
        description: "Campañas, referencias, orgánicas, directas o todas",
      },
      channel: {
        label: "Canal",
        description:
          "Clave de canal exacta: utm_source, ref: CODE, host de referencia o directo. Vacío = cualquier",
      },
      currency: {
        label: "Moneda",
        description: "Sólo el gasto introducido en esta moneda se resume",
      },
    },
    funnelStep: {
      post: {
        title: "Funnel Step",
        titleShort: "Funnel Step",
        description:
          "Viajes alcanzando un paso de embudo de crecimiento por cubo, filtrable por canal",
        fields: {
          step: {
            label: "Paso",
            description:
              "Paso de embudo: visita, chat, registro, newsletter, pago, retenido",
          },
          result: {
            label: "Secuencias",
            description: "Cuenta de paso por cubo",
          },
        },
      },
    },
    channelSpend: {
      post: {
        title: "Gasto de canal",
        titleShort: "Gasto de canal",
        description:
          "Gasto de marketing por cubo, distribuido uniformemente en cada periodo de gasto",
        fields: {
          result: { label: "Spend", description: "Gasto por cubo" },
        },
      },
    },
  },
  errors: {
    validation: {
      title: "Entrada inválida",
      description: "Revise los campos marcados",
    },
    unauthorized: {
      title: "No está firmado",
      description: "Inicie sesión como administrador",
    },
    forbidden: {
      title: "Admins only",
      description:
        "Las herramientas de crecimiento necesitan el papel de administrador",
    },
    notFound: {
      title: "Cuenta o sesión no encontradas",
      description: "Esa entrada no existe",
    },
    conflict: {
      title: "Conflicto",
      description: "La entrada cambió mientras tanto, recargar y reiniciar",
    },
    server: {
      title: "Error del servidor",
      description: "No se puede completar la solicitud",
    },
    network: {
      title: "Error de red",
      description: "La solicitud no llegó al servidor",
    },
    unknown: {
      title: "Error desconocido",
      description: "Algo inesperado falló",
    },
    unsavedChanges: {
      title: "Cambios sin guardar",
      description: "Guardar o descartar sus cambios primero",
    },
    invalidRefCode: "Código de referencia {{code}} no existe o está inactivo",
    invalidPeriod:
      "El final del período debe estar encendido o después de su inicio",
    invalidDestination:
      "El camino de aterrizaje debe comenzar con / y permanecer en este sitio",
  },
  success: {
    title: "Listo",
    description: "Guardado",
  },
};
