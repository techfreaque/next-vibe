import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  enums: {
    resolution: {
      "1m": "1 minuto",
      "3m": "3 minutos",
      "5m": "5 minutos",
      "15m": "15 minutos",
      "30m": "30 minutos",
      "1h": "1 hora",
      "4h": "4 horas",
      "1d": "1 día",
      "1w": "1 semana",
      "1M": "1 Mes",
    },
    runStatus: {
      running: "Corriendo",
      completed: "Completado",
      failed: "Failed",
    },
    backtestActionMode: {
      simulate: "Simular",
      execute: "Ejecutar",
    },
    graphOwnerType: {
      system: "Sistema",
      admin: "Administrador",
      user: "Usuario",
    },
    triggerType: {
      manual: "Manual",
      cron: "Programado",
    },
  },
  // Standard vibe-sense field labels (used by shared/fields.ts helpers)
  fields: {
    source: { label: "Fuente", description: "Serie de tiempo de entrada" },
    resolution: { label: "Resolución", description: "Plazo de cálculo" },
    range: { label: "Rango", description: "Rango de tiempo para calcular" },
    lookback: {
      label: "Mira atrás.",
      description: "Barras extra antes de empezar el rango para calentamiento",
    },
    result: {
      label: "Resultado",
      description: "Serie de tiempo de producción",
    },
    meta: { label: "Meta", description: "Metadatos de ejecución de nodos" },
  },
  tags: {
    vibeSense: "vibe-sense",
    analytics: "analytics",
    pipeline: "pipeline",
  },

  // Graph list
  graphs: {
    list: {
      title: "Gráficos de pipalina",
      description: "Listar todos los gráficos visibles al usuario actual",
      container: {
        title: "Gráficos",
        description: "Todos los gráficos de tuberías",
      },
      response: {
        graphs: "Gráficos",
      },
      success: {
        title: "Gráficos cargados",
        description: "Gráficos de tubería recuperados con éxito",
      },
      errors: {
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Inicia sesión para continuar",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "Acceso de los administradores necesario",
        },
        server: {
          title: "Error del servidor",
          description: "Failed to load graphs",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
        validation: {
          title: "Falló la validación",
          description: "Solicitud inválida",
        },
        notFound: {
          title: "Cuenta o sesión no encontradas",
          description: "No hay gráficas encontradas",
        },
        conflict: { title: "Conflicto", description: "Conflicto de recursos" },
        network: {
          title: "Error de red",
          description: "Solicitud de red falló",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Guardar los cambios primero",
        },
      },
    },
    create: {
      title: "Crear Gráfico",
      description: "Crear un nuevo gráfico de tuberías",
      fields: {
        name: {
          label: "Nombre",
          description: "Nombre de la pantalla de Gráficos",
          placeholder: "Mi gráfico",
        },
        slug: {
          label: "Slug",
          description: "Unico identificador",
          placeholder: "mi-graph",
        },
        description: {
          label: "Descripción",
          description: "Opcional descripción",
          placeholder: "",
        },
        config: {
          label: "Config",
          description: "Configuración de gráficos DAG",
        },
      },
      response: {
        id: "Gráfico ID",
      },
      success: {
        title: "Gráfico creado",
        description: "Gráfico de tuberías creado con éxito",
      },
      errors: {
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Inicia sesión para continuar",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "Acceso de los administradores necesario",
        },
        server: {
          title: "Error del servidor",
          description: "Failed to create graph",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
        validation: {
          title: "Falló la validación",
          description: "Gráfico inválido",
        },
        notFound: {
          title: "Cuenta o sesión no encontradas",
          description: "No se encontró el recurso",
        },
        conflict: {
          title: "Conflicto",
          description: "La mancha de Gráfico ya existe",
        },
        network: {
          title: "Error de red",
          description: "Solicitud de red falló",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Guardar los cambios primero",
        },
      },
    },
    get: {
      title: "Consigue Gráfico",
      description: "Obtenga un gráfico específico por ID",
      fields: {
        id: { label: "Gráfico ID", description: "UUID de la versión gráfica" },
      },
      response: {
        graph: "Gráfico",
      },
      success: {
        title: "Gráfico cargado",
        description: "Gráfico recuperado con éxito",
      },
      errors: {
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Inicia sesión para continuar",
        },
        forbidden: { title: "Acceso denegado", description: "Acceso denegado" },
        server: {
          title: "Error del servidor",
          description: "Failed to load graph",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
        validation: {
          title: "Falló la validación",
          description: "Inválido ID",
        },
        notFound: {
          title: "Cuenta o sesión no encontradas",
          description: "Gráfico no encontrado",
        },
        conflict: { title: "Conflicto", description: "Conflicto de recursos" },
        network: {
          title: "Error de red",
          description: "Solicitud de red falló",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Guardar los cambios primero",
        },
      },
    },
    edit: {
      title: "Editar el Gráfico",
      description: "Subir y editar un gráfico (crea nueva versión, nunca muta)",
      fields: {
        id: {
          label: "Gráfico ID",
          description: "UUID de la versión a ram desde",
        },
        config: {
          label: "Config",
          description: "Configuración actualizada del gráfico",
        },
        name: { label: "Nombre", description: "Nombre actualizado" },
        description: {
          label: "Descripción",
          description: "Descripción actualizada",
        },
      },
      response: {
        id: "Nueva versión ID",
      },
      success: {
        title: "Gráfico ramificado",
        description: "Nueva versión gráfica creada con éxito",
      },
      errors: {
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Inicia sesión para continuar",
        },
        forbidden: { title: "Acceso denegado", description: "Acceso denegado" },
        server: {
          title: "Error del servidor",
          description: "Failed to edit graph",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
        validation: {
          title: "Falló la validación",
          description: "Config inválido",
        },
        notFound: {
          title: "Cuenta o sesión no encontradas",
          description: "Gráfico no encontrado",
        },
        conflict: { title: "Conflicto", description: "Conflicto de recursos" },
        network: {
          title: "Error de red",
          description: "Solicitud de red falló",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Guardar los cambios primero",
        },
      },
    },
    promote: {
      title: "Promover el sistema",
      description:
        "Promover un gráfico de administración a propiedad del sistema (sólo, compartido)",
      fields: {
        id: {
          label: "Gráfico ID",
          description: "UUID del gráfico para promover",
        },
      },
      response: {
        id: "Gráfico ID",
      },
      success: {
        title: "Gráfico promovido",
        description: "Gráfico promovido al sistema con éxito",
      },
      errors: {
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Inicia sesión para continuar",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "Acceso de los administradores necesario",
        },
        server: {
          title: "Error del servidor",
          description: "Failed to promote graph",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
        validation: {
          title: "Falló la validación",
          description: "Inválido ID",
        },
        notFound: {
          title: "Cuenta o sesión no encontradas",
          description: "Gráfico no encontrado",
        },
        conflict: { title: "Conflicto", description: "Conflicto de recursos" },
        network: {
          title: "Error de red",
          description: "Solicitud de red falló",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Guardar los cambios primero",
        },
      },
    },
    trigger: {
      title: "Gráfico de la cometa",
      description: "Activar manualmente la ejecución de gráficos a pedido",
      fields: {
        id: {
          label: "Gráfico ID",
          description: "UUID del gráfico para activar",
        },
        rangeFrom: {
          label: "Desde",
          description: "Rango de inicio (fecha ISO)",
        },
        rangeTo: { label: "A", description: "Fin de rango (fecha ISO)" },
      },
      response: {
        nodeCount: "Números ejecutados",
        errorCount: "Errores",
        errors: "Errores",
      },
      success: {
        title: "Gráfico ejecutado",
        description: "Gráfico corrió con éxito",
      },
      errors: {
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Inicia sesión para continuar",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "Acceso de los administradores necesario",
        },
        server: {
          title: "Error del servidor",
          description: "La ejecución de los Gráficos falló",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
        validation: {
          title: "Falló la validación",
          description: "Parámetros inválidos",
        },
        notFound: {
          title: "Cuenta o sesión no encontradas",
          description: "Gráfico no encontrado",
        },
        conflict: { title: "Conflicto", description: "Conflicto de recursos" },
        network: {
          title: "Error de red",
          description: "Solicitud de red falló",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Guardar los cambios primero",
        },
      },
    },
    backtest: {
      title: "Corre Backtest",
      description:
        "Ejecute un respaldo sobre un rango histórico (actuaciones simuladas)",
      fields: {
        id: { label: "Gráfico ID", description: "UUID de la versión gráfica" },
        rangeFrom: { label: "Desde", description: "Backtest range start" },
        rangeTo: { label: "A", description: "Retroceso final de rango" },
        resolution: {
          label: "Resolución",
          description: "Calendario para la evaluación",
        },
      },
      response: {
        runId: "Corre ID",
        eligible: "Eligible",
        ineligibleNodes: "Nodos ineligibles",
      },
      success: {
        title: "Retroceso completo",
        description: "Backtest corrió con éxito",
      },
      errors: {
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Inicia sesión para continuar",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "Acceso de los administradores necesario",
        },
        server: {
          title: "Error del servidor",
          description: "La prueba falló.",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
        validation: {
          title: "Falló la validación",
          description: "Parámetros inválidos",
        },
        notFound: {
          title: "Cuenta o sesión no encontradas",
          description: "Gráfico no encontrado",
        },
        conflict: { title: "Conflicto", description: "Conflicto de recursos" },
        network: {
          title: "Error de red",
          description: "Solicitud de red falló",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Guardar los cambios primero",
        },
      },
    },
    data: {
      title: "Datos de Gráficos",
      description:
        "Obtenga datos de las series temporales para un gráfico (ejecución bajo demanda)",
      fields: {
        id: { label: "Gráfico ID", description: "UUID del gráfico" },
        rangeFrom: { label: "Desde", description: "Comienzo de rango" },
        rangeTo: { label: "A", description: "Fin de rango" },
      },
      response: {
        series: "Serie",
        signals: "Signals",
      },
      success: {
        title: "Datos cargados",
        description: "Datos de Gráfico recuperados con éxito",
      },
      errors: {
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Inicia sesión para continuar",
        },
        forbidden: { title: "Acceso denegado", description: "Acceso denegado" },
        server: {
          title: "Error del servidor",
          description: "Fallado para buscar datos",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
        validation: {
          title: "Falló la validación",
          description: "Parámetros inválidos",
        },
        notFound: {
          title: "Cuenta o sesión no encontradas",
          description: "Gráfico no encontrado",
        },
        conflict: { title: "Conflicto", description: "Conflicto de recursos" },
        network: {
          title: "Error de red",
          description: "Solicitud de red falló",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Guardar los cambios primero",
        },
      },
    },
  },

  // Indicator node definitions
  indicators: {
    ema: {
      description:
        "Moving Exponential Media - pesos recientes precios más fuertemente",
      input: { source: { label: "Fuente" } },
      output: { value: { label: "EMA" } },
      params: {
        period: {
          label: "Período",
          description: "Número de períodos (1 a 500)",
        },
      },
    },
    rsi: {
      description: "Índice relativo de fuerza - oscilador de impulso (0–100)",
      input: { source: { label: "Fuente" } },
      output: { value: { label: "RSI" } },
      params: {
        period: {
          label: "Período",
          description: "Períodos de retroceso (2–100)",
        },
      },
    },
    bollinger: {
      description:
        "Bandas Bollinger - sobre volatilidad alrededor de un promedio móvil",
      input: { source: { label: "Fuente" } },
      output: {
        upper: { label: "Banda superior" },
        middle: { label: "Banda media" },
        lower: { label: "Banda baja" },
      },
      params: {
        period: {
          label: "Período",
          description: "Período medio de transición",
        },
        stdDev: {
          label: "Std Dev",
          description: "Multiplicador de desviación estándar",
        },
      },
    },
    macd: {
      description: "MACD - indicador de impulso que sigue la tendencia",
      input: { source: { label: "Fuente" } },
      output: {
        macd: { label: "MACD" },
        signal: { label: "Signal" },
        histogram: { label: "Histograma" },
      },
      params: {
        fastPeriod: {
          label: "Período rápido",
          description: "Período EMA rápido",
        },
        slowPeriod: {
          label: "Período lento",
          description: "Período de EMA lento",
        },
        signalPeriod: {
          label: "Período de señalización",
          description: "Período EMA de la señal",
        },
      },
    },
    ratio: {
      description: "Computar A / B por hora",
      input: { a: { label: "Numerator" }, b: { label: "Denominator" } },
      output: { value: { label: "Ratio" } },
    },
    delta: {
      description: "Cambio de período sobre período",
      input: { source: { label: "Fuente" } },
      output: { value: { label: "Delta" } },
    },
    clamp: {
      description: "Valores de la lámpara a [min, max]",
      input: { source: { label: "Fuente" } },
      output: { value: { label: "Clamados" } },
      params: {
        min: { label: "Mínimo", description: "Limitado inferior" },
        max: { label: "Máximo", description: "Altos límites" },
      },
    },
    windowAvg: {
      description: "Promedio de rodamiento en los períodos N",
      input: { source: { label: "Fuente" } },
      output: { value: { label: "Avg" } },
      params: {
        size: { label: "Ventana", description: "Número de períodos (1 a 500)" },
      },
    },
    windowSum: {
      description: "Suma de ejecución en los períodos N",
      input: { source: { label: "Fuente" } },
      output: { value: { label: "Sum" } },
      params: {
        size: { label: "Ventana", description: "Número de períodos (1 a 500)" },
      },
    },
    windowMin: {
      description: "Montaje mínimo durante los períodos N",
      input: { source: { label: "Fuente" } },
      output: { value: { label: "Mínimo" } },
      params: {
        size: { label: "Ventana", description: "Número de períodos (1 a 500)" },
      },
    },
    windowMax: {
      description: "Montaje máximo en N períodos",
      input: { source: { label: "Fuente" } },
      output: { value: { label: "Máximo" } },
      params: {
        size: { label: "Ventana", description: "Número de períodos (1 a 500)" },
      },
    },
  },

  // Data source node definitions
  dataSources: {
    leadsCreated: {
      description: "Número de nuevas pistas creadas por minuto",
      output: { value: { label: "Principales Creados" } },
    },
    leadsConverted: {
      description: "Número de leads convertidos a usuarios por minuto",
      output: { value: { label: "Plomos convertidos" } },
    },
    leadsActive: {
      description: "Conteo total activo de plomo (snapshot por día)",
      output: { value: { label: "contacto activo" } },
    },
    leadsBounced: {
      description: "Número de rebotes de correo electrónico por minuto",
      output: { value: { label: "Bounced Leads" } },
    },
    leadsEngagements: {
      description:
        "Total de eventos de compromiso de plomo (opens + clics) por minuto",
      output: { value: { label: "Principales avances" } },
    },
    leadsEmailsSent: {
      description: "Número de correos enviados por minuto",
      output: { value: { label: "Emails Sent" } },
    },
    leadsUnsubscribed: {
      description: "Número de pistas que no se suscriben por minuto",
      output: { value: { label: "contacto no suscrito" } },
    },
    leadsEmailOpens: {
      description: "Número de correo electrónico abre seguimiento por minuto",
      output: { value: { label: "Correo electrónico abre" } },
    },
    leadsEmailClicks: {
      description:
        "Número de clics de enlace de correo electrónico rastreados por minuto",
      output: { value: { label: "E-mail Clicks" } },
    },
    leadsNewsletterSubscribers: {
      description:
        "Total leads con suscripción confirmada de newsletters (snapshot por día)",
      output: { value: { label: "Suscriptores de boletín" } },
    },
    leadsWebsiteUsers: {
      description:
        "Total de leads con el estado del usuario del sitio web (snapshot por día)",
      output: { value: { label: "Usuarios Web" } },
    },
    leadsCampaignRunning: {
      description:
        "Total lidera actualmente en una campaña de correo electrónico activa (snapshot por día)",
      output: { value: { label: "In Campaign" } },
    },
    leadsInContact: {
      description: "Total leads currently in contact status (snapshot per day)",
      output: { value: { label: "En contacto" } },
    },
    leadsWebsiteVisits: {
      description: "Número de eventos de compromiso de visita web por minuto",
      output: { value: { label: "Visitas del sitio web" } },
    },
    leadsFormSubmits: {
      description:
        "Número de formularios presentan eventos de compromiso por minuto",
      output: { value: { label: "Form Submits" } },
    },
    usersRegistered: {
      description: "Número de nuevos registros de usuarios por minuto",
      output: { value: { label: "Usuarios registrados" } },
    },
    usersActiveTotal: {
      description: "Conteo total de usuarios verificados (snapshot por día)",
      output: { value: { label: "Usuarios activos" } },
    },
    usersBanned: {
      description: "Número de usuarios prohibidos por minuto (aproximado)",
      output: { value: { label: "Usuarios Banned" } },
    },
    usersEmailVerified: {
      description:
        "Usuarios totales con correo electrónico verificado (snapshot por día)",
      output: { value: { label: "Email Verificado" } },
    },
    usersMarketingConsent: {
      description:
        "Usuarios totales que dieron consentimiento de marketing (snapshot por día)",
      output: { value: { label: "Consentimiento de comercialización" } },
    },
    usersWithStripe: {
      description:
        "Usuarios totales vinculados a un cliente Stripe (snapshot por día)",
      output: { value: { label: "Usuarios Stripe" } },
    },
    usersTwoFaEnabled: {
      description: "Total de usuarios con 2FA habilitado (snapshot por día)",
      output: { value: { label: "2FA habilitada" } },
    },
    usersLoginAttemptsTotal: {
      description: "Total de intentos de ingreso por minuto",
      output: { value: { label: "Iniciar sesión Intentos" } },
    },
    usersLoginAttemptsFailed: {
      description: "Intentes de acceso fallidos por minuto",
      output: { value: { label: "Failed Logins" } },
    },
    creditsSpentTotal: {
      description: "Créditos totales gastados por minuto en todas las carteras",
      output: { value: { label: "Créditos gastados" } },
    },
    creditsSpentByUsers: {
      description: "Créditos gastados por usuarios autenticados por minuto",
      output: { value: { label: "Créditos gastados (los usuarios)" } },
    },
    creditsSpentByLeads: {
      description: "Créditos gratis gastados por plomo por minuto",
      output: { value: { label: "Créditos gastados (pagos)" } },
    },
    creditsPurchased: {
      description:
        "Créditos adquiridos o añadidos mediante suscripción por minuto",
      output: { value: { label: "Créditos adquiridos" } },
    },
    creditsFreeGrants: {
      description:
        "Becas de crédito gratuitas otorgadas a los plomos por minuto",
      output: { value: { label: "Subvenciones gratuitas" } },
    },
    creditsEarned: {
      description: "Créditos obtenidos mediante referencias por minuto",
      output: { value: { label: "Créditos Ganados" } },
    },
    creditsExpired: {
      description: "Créditos expirados por minuto",
      output: { value: { label: "Créditos gastados" } },
    },
    creditsRefunded: {
      description: "Créditos reembolsados por minuto",
      output: { value: { label: "Créditos Reembolsos" } },
    },
    creditsBalanceTotal: {
      description:
        "Saldo total de créditos de todas las cuentas de usuario (registro diario)",
      output: { value: { label: "Saldo de créditos" } },
    },
    creditsSubscriptionRevenue: {
      description: "Créditos de paquetes tipo suscripción por minuto",
      output: { value: { label: "Ingresos por suscripción" } },
    },
    creditsTransferVolume: {
      description:
        "Volumen de transferencia de crédito entre carteras por minuto",
      output: { value: { label: "Volumen de transferencia" } },
    },
    creditsFreePoolUtilization: {
      description:
        "Porcentaje de piscina de crédito gratuita consumida (snapshot por día)",
      output: { value: { label: "Uso gratuito de piscina" } },
    },
  },

  // Evaluator node definitions
  evaluators: {
    threshold: {
      description:
        "Fuegos cuando un valor de serie satisface una comparación contra una constante",
      input: {
        series: { label: "Serie" },
      },
      output: {
        signal: { label: "Signal" },
      },
      params: {
        op: {
          label: "Operador",
          description: "Operador de comparación",
        },
        value: {
          label: "Valor",
          description: "Constante para comparar contra",
        },
      },
    },
    and: {
      description:
        "Fuegos cuando todas las señales de entrada disparan al mismo tiempo",
      input: { signals: { label: "Signals" } },
      output: { signal: { label: "Signal" } },
    },
    or: {
      description:
        "Fuegos cuando cualquier señal de entrada se dispara en un temporizador dado",
      input: { signals: { label: "Signals" } },
      output: { signal: { label: "Signal" } },
    },
    not: {
      description: "Invierte un flujo de señal",
      input: { signal: { label: "Signal" } },
      output: { signal: { label: "Invertidos" } },
    },
    crossover: {
      description: "Fuegos cuando la serie A cruza por encima de la serie B",
      input: {
        seriesA: { label: "Serie A" },
        seriesB: { label: "Serie B" },
      },
      output: { signal: { label: "Signal" } },
    },
    script: {
      description:
        "Evaluacióndor personalizado de sandboxed - recibe series de entrada, devuelve eventos de señal",
      input: { inputs: { label: "Inputs" } },
      output: { signal: { label: "Signal" } },
      params: {
        fn: {
          label: "Función",
          description:
            "Cuerpo de función JS recibiendo arrays de series de entrada, eventos de señal de retorno",
        },
      },
    },
  },

  // Transformer node definitions
  transformers: {
    merge: {
      description: "Sum dos series en los horarios de juego",
      input: {
        a: { label: "Serie A" },
        b: { label: "Serie B" },
      },
      output: { value: { label: "Fusionados" } },
    },
    ratio: {
      description: "Computar A / B por hora",
      input: {
        a: { label: "Numerator" },
        b: { label: "Denominator" },
      },
      output: { value: { label: "Ratio" } },
    },
    delta: {
      description: "Cambio de período sobre período",
      input: { source: { label: "Fuente" } },
      output: { value: { label: "Delta" } },
    },
    clamp: {
      description: "Valores de la lámpara a [min, max]",
      input: { source: { label: "Fuente" } },
      output: { value: { label: "Clamados" } },
      params: {
        min: { label: "Mínimo", description: "Limitado inferior" },
        max: { label: "Máximo", description: "Altos límites" },
      },
    },
    windowAvg: {
      description: "Promedio de rodamiento en los períodos N",
      input: { source: { label: "Fuente" } },
      output: { value: { label: "Avg" } },
      params: {
        size: { label: "Ventana", description: "Número de períodos (1 a 500)" },
      },
    },
    windowSum: {
      description: "Suma de ejecución en los períodos N",
      input: { source: { label: "Fuente" } },
      output: { value: { label: "Sum" } },
      params: {
        size: { label: "Ventana", description: "Número de períodos (1 a 500)" },
      },
    },
    windowMin: {
      description: "Montaje mínimo durante los períodos N",
      input: { source: { label: "Fuente" } },
      output: { value: { label: "Mínimo" } },
      params: {
        size: { label: "Ventana", description: "Número de períodos (1 a 500)" },
      },
    },
    windowMax: {
      description: "Montaje máximo en N períodos",
      input: { source: { label: "Fuente" } },
      output: { value: { label: "Máximo" } },
      params: {
        size: { label: "Ventana", description: "Número de períodos (1 a 500)" },
      },
    },
    fieldPick: {
      description: "Extraiga un campo llamado de una serie multivalor",
      input: { source: { label: "Multi-valor" } },
      output: { value: { label: "Campo" } },
      params: {
        field: {
          label: "Nombre del campo",
          description: "Nombre del campo para extraer",
        },
      },
    },
    jsonPath: {
      description:
        "Extraiga un valor a través de la ruta de notación de puntos de DataPoint",
      input: { source: { label: "Fuente" } },
      output: { value: { label: "Valor" } },
      params: {
        path: {
          label: "Camino",
          description:
            "Camino de notación de puntos, por ejemplo datos.stats.total",
        },
      },
    },
    script: {
      description: "Transformación personalizada de scripts sandbox",
      input: { inputs: { label: "Inputs" } },
      output: { value: { label: "Resultado" } },
      params: {
        fn: {
          label: "Función",
          description:
            "Función de flecha JS recibiendo arrays de series de entrada, volviendo DataPoint[]",
        },
      },
    },
  },

  // Shared data-source chart widget UI
  dataSourceWidget: {
    addToGraph: "Añadir al gráfico",
    newGraph: "Nuevo gráfico",
    loading: "Cargando datos...",
    noData: "No se dispone de datos para este período",
  },

  // Cleanup task
  cleanup: {
    post: {
      title: "Vibe Sense Cleanup",
      description:
        "Ejecutar la limpieza de retención para puntos de datos y caducar instantáneas",
      success: {
        title: "Limpieza completa",
        description: "Retención de limpieza terminada",
      },
      response: {
        nodesProcessed: "Nodos procesados",
        totalDeleted: "Filas eliminadas",
        snapshotsDeleted: "Capturas eliminadas",
      },
      errors: {
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Inicia sesión para continuar",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "Acceso de los administradores necesario",
        },
        server: {
          title: "Error del servidor",
          description: "La limpieza falló",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
        validation: {
          title: "Falló la validación",
          description: "Solicitud inválida",
        },
        notFound: {
          title: "Cuenta o sesión no encontradas",
          description: "Cuenta o sesión no encontradas",
        },
        conflict: { title: "Conflicto", description: "Conflicto" },
        network: {
          title: "Error de red",
          description: "Solicitud de red falló",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Guardar los cambios primero",
        },
      },
    },
    name: "Vibe Sense Cleanup",
    description: "Prunes datapoints antiguos y expira caché de instantánea",
  },
};
