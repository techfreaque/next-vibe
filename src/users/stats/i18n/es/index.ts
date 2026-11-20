import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Business Stats",
  titleShort: "Estadísticas de usuarios",
  description:
    "Suscripciones, usuarios activos y pagados, MRR, ingresos, gasto de crédito, conversión de registro a pago y retención D7. Cada número contra la ventana anterior, más tabla de tendencia, canales y los principales gastadores.",
  category: "Usuarios",
  tag: "Estadísticas",
  fields: {
    range: {
      label: "Ventana",
      description:
        "Ventana de presentación de informes, en comparación con la ventana de igual longitud antes de ella",
    },
    from: {
      label: "Desde",
      description: "Primer día (UTC). Supera la ventana de inicio",
    },
    to: {
      label: "A",
      description: "Último día (UTC). Supera el extremo de la ventana",
    },
    granularity: {
      label: "Cubos de carga",
      description:
        "Día, semana o mes. Elijas automáticas por longitud de la ventana",
    },
    includeInternal: {
      label: "Incluir los administradores",
      description: "Cuenta de administración interna y sus pagos",
    },
  },
  response: {
    period: "Período",
    kpis: "KPIs",
    series: "Series temporales",
    channels: "Canales de registro",
    revenueByCurrency: "Ingresos por moneda",
    subscriptionsByStatus: "Suscripciones por estado",
    topSpenders: "Principales gastadores",
    generatedAt: "Generado en",
  },
  enums: {
    range: {
      last7Days: "Últimos 7 días",
      last30Days: "Últimos 30 días",
      last90Days: "Los últimos 90 días",
      last12Months: "Últimos 12 meses",
      thisMonth: "Este mes",
      lastMonth: "Mes",
      allTime: "Siempre.",
      custom: "Fechas de presentación",
    },
    granularity: {
      auto: "Automático",
      day: "Día",
      week: "Semana",
      month: "Mes",
    },
  },
  kpi: {
    revenue: "Ingresos generados",
    revenueHint: "Pagos exitosos, USD",
    refundsHint: "{{amount}} reembolsado",
    mrr: "MRR",
    mrrHint: "{{active}} subs activos, {{pastDue}} pasado debido",
    payingUsers: "Usuarios de pago",
    payingAllTimeHint: "{{count}} pagó siempre",
    creditsSpent: "Créditos gastados",
    creditsHint: "sobre {{usd}} de uso",
    newUsers: "Registros",
    totalUsersHint: "Total de usuarios de {{count}}",
    activeUsers: "Usuarios activos",
    anonymousHint: "+ gasto de visitantes anónimos {{count}}",
    signupToPaid: "Inscripción de los pagos",
    ratioHint: "{{converted}} de {{cohort}} nuevos registros pagados",
    retentionD7: "Retención D7",
    retentionHint: "{{converted}} de {{cohort}} regresó después del día 7",
    activeSubscribers: "Suscriptores activos",
    pastDue: "Pases anteriores",
    totalUsers: "Usuarios totales",
    payingAllTime: "Pagado",
    revenueAllTime: "Ingresos todo el tiempo",
    refunds: "Reembolsos",
    anonymousActive: "Gastronomía anónimo",
  },
  series: {
    signups: "Registros",
    activeUsers: "Activa",
    payingUsers: "Pagar",
    revenueUsd: "Ingresos generados",
    creditsSpent: "Créditos",
  },
  sections: {
    trend: "Trend",
    channels: "Canales de registro",
    subscriptions: "Suscripciones ahora",
    currencies: "Ingresos por moneda",
    topSpenders: "Principales gastadores en ventana",
  },
  table: {
    channel: "Canal",
    signups: "Registros",
    paying: "Pagado",
    conversion: "Conv.",
    user: "Usuario",
    creditsSpent: "Créditos gastados",
    lifetimePaid: "Hora de la vida pagada",
  },
  widget: {
    times: "{{count}}x",
    loading: "Números de corteza...",
    users: "Usuarios",
    refresh: "Actualizar",
    new: "nuevo",
    noData: "No hay datos en esta ventana.",
    chartTotal: "Total {{total}}",
    period:
      "{{from}} a {{to}} (días {{days}}, UTC). Los cambios se comparan con los días de {{days}} antes.",
    definitions:
      "Activo = créditos gastados (carpeta de contacto propia o vinculada). Pagar = pago exitoso en la ventana. Ingreso en USD en FX estático. MRR = subscripciones en vivo precio por su último pago. Las cuentas de personal excluidas a menos que se incluyan anteriormente.",
    text: {
      header: "{{from}} a {{to}} (días {{days}}, UTC)",
      metric: "métrica",
      current: "Ahora.",
      previous: "Antes",
      change: "Cambiar",
      bucket: "Bucket",
      paying: "{{count}} pagó",
      footer:
        "Windows: --range=enums.range.last7Days sufriendolast90Days tuberculosislast12Lunes infligidos allTime. Usuarios: lista de usuarios vibe",
    },
  },
  errors: {
    validation: {
      title: "Solicitud de estadísticas inválidas",
      description: "Compruebe la ventana y las fechas",
    },
    unauthorized: {
      title: "Inicia sesión para continuar",
      description: "Iniciar sesión para ver estadísticas",
    },
    forbidden: {
      title: "Admins only",
      description: "Necesitas el papel de administrador para ver estadísticas",
    },
    notFound: {
      title: "No hay datos",
      description: "No hay nada que reportar para esta ventana",
    },
    server: {
      title: "No podría calcular las estadísticas",
      description: "El servidor no compute estadísticas de usuario",
    },
    network: {
      title: "Error de red",
      description: "No podía llegar al servidor",
    },
    unknown: {
      title: "Error inesperado",
      description: "Algo salió mal las estadísticas de cálculo",
    },
    unsavedChanges: {
      title: "Cambios sin guardar",
      description: "Tienes cambios sin guardar",
    },
    conflict: {
      title: "Conflicto",
      description: "La solicitud entra en conflicto con los datos actuales",
    },
  },
  success: {
    title: "Listos.",
    description: "Estadísticas de usuario computadas",
  },
};
