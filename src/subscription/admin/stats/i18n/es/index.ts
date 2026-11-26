import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Estadísticas de suscripción",
    titleShort: "Métricas de suscripción",
    description: "Ingresos, suscripción, crédito y métricas de remisión",
    form: {
      title: "Oficina de Estadística",
      description: "métricas de negocio agregadas",
    },
    timePeriodOptions: {
      title: "Período de tiempo",
      description: "Configurar el rango de tiempo",
    },
    timePeriod: {
      label: "Período",
      description: "Intervalo de agrupación",
    },
    dateRangePreset: {
      label: "Fecha de rango",
      description: "Rango de fecha predefinido",
    },
    response: {
      revenueStats: {
        title: "Ingresos",
        description: "Revenue metrics",
        mrr: { label: "MRR" },
        arr: { label: "ARR" },
        totalRevenue: { label: "Total de ingresos" },
        avgOrderValue: { label: "Orden de Avg" },
      },
      subscriptionStats: {
        title: "Suscripciones",
        description: "Cuentas de suscripción",
        activeCount: { label: "Activa" },
        trialingCount: { label: "Juicio" },
        pastDueCount: { label: "Vencidas" },
        canceledCount: { label: "Cancelado" },
        churnRate: { label: "Tasa de Churn" },
      },
      intervalStats: {
        title: "Intervalos de facturación",
        description: "Dividencia mensual vs anual",
        monthlyCount: { label: "Mensual" },
        yearlyCount: { label: "Anual" },
        yearlyRevenuePct: { label: "% Ingresos anuales" },
      },
      creditStats: {
        title: "Créditos",
        description: "métricas del paquete de crédito",
        totalPurchased: { label: "Comprado" },
        spentFromFree: { label: "De la asignación gratis" },
        totalSpent: { label: "Gasto" },
        packsSold: { label: "Paquetes vendidos" },
        avgPackSize: { label: "Tamaño del paquete de Avg" },
      },
      referralStats: {
        title: "Remisiones",
        description: "Metrices de programas de referencia",
        totalReferrals: { label: "Total de referencias" },
        conversionRate: { label: "Conversión" },
        totalEarned: { label: "Total pendiente" },
        pendingPayouts: { label: "Pagos pendientes" },
      },
      growthMetrics: {
        title: "Crecimiento",
        description: "Tendencias de ingresos y suscripción",
        revenueChart: {
          label: "Ingresos a través del tiempo",
          description: "Tendencia de ingresos",
        },
        subscriptionChart: {
          label: "Crecimiento de la suscripción",
          description: "Tendencia de suscripción activa",
        },
      },
      businessInsights: {
        title: "Insights",
        description: "Metrices generadas",
        generatedAt: { label: "Generado en" },
      },
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Acceso requerido para ver estadísticas",
      },
      validation: {
        title: "Error de validación",
        description: "Parámetros inválidos",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Acceso de los administradores necesario",
      },
      server: {
        title: "Error del servidor",
        description: "Incapaz de generar estadísticas",
        detail: "No podía construir las estadísticas: {{error}}",
      },
      unknown: {
        title: "Error desconocido",
        description: "Se produjo un error inesperado",
      },
      conflict: { title: "Conflicto", description: "Conflicto de datos" },
      network: {
        title: "Error de red",
        description: "Incapaz de conectarse",
      },
      notFound: {
        title: "No encontrado",
        description: "Estadísticas no disponibles",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
    },
    success: {
      title: "Operación completada",
      description: "Estadísticas generadas",
    },
  },
  widget: {
    paidPacks: "Paquetes pagados: suscripción + comprados",
    canceledShare: "Proporción cancelada, total",
    spentSplit:
      "{{packs}} de paquetes (como en Paquetes de créditos) · {{free}} de asignaciones gratis",
    creditsSold: "Créditos vendidos",
    creditsSoldHint:
      "Paquetes de suscripción y comprados. Sin bonificaciones ni ganancias por referidos.",
    pastDueHint: "Pago fallido, sigue contando como suscriptor",
    yearlyShare: "Planes anuales",
    yearlyShareHint:
      "Proporción de suscripciones activas, de prueba y vencidas con facturación anual",
    showLegacy: "Mostrar el resumen de ingresos antiguo",
    hideLegacy: "Ocultar el resumen de ingresos antiguo",
    approxUsd: "aprox. USD",
    openLabel: "Abrir:",
    linkSubscriptions: "Lista de suscripciones",
    linkPurchases: "Paquetes de créditos",
    linkReferrals: "Referidos",
    apply: "Aplicar",
    sectionSubscriptions: "Suscripciones",
    sectionSubscriptionsHint: "Estado actual, todo el periodo",
    activePaid: "Activas",
    activePaidHint:
      "Estado activo. Mismo número que la lista de suscripciones.",
    churnHint:
      "Canceladas sobre activas, de prueba, vencidas y canceladas. No es un churn mensual.",
    sectionCredits: "Créditos",
    purchasedHint: "Créditos en paquetes de cuentas",
    spentHint: "Créditos consumidos",
    sectionReferrals: "Referidos",
    sectionLegacy: "Resumen de ingresos antiguo",
    sectionLegacyHint:
      "Sustituido por el informe de ingresos. Convertido a aprox. USD.",
    revenueReportTitle:
      "Ingresos, MRR y churn ahora están en el informe de ingresos",
    revenueReportHint:
      "Dinero cobrado de verdad por día, por moneda y tipo, hasta el detalle de cada pago.",
    openRevenueReport: "Abrir informe de ingresos",
    refresh: "Actualizar",
    filters: "Filtros",
  },
  stats: {
    timePeriod: {
      day: "Día",
      week: "Semana",
      month: "Mes",
      quarter: "Trimestre",
      year: "Año",
    },
    dateRange: {
      today: "Hoy",
      yesterday: "Ayer",
      last7Days: "Últimos 7 días",
      last30Days: "Últimos 30 días",
      last90Days: "Los últimos 90 días",
      thisWeek: "Esta semana",
      lastWeek: "La semana pasada",
      thisMonth: "Este mes",
      lastMonth: "El último mes",
      thisQuarter: "Este trimestre",
      lastQuarter: "Último trimestre",
      thisYear: "Este año",
      lastYear: "Último año",
      custom: "Personalizado",
    },
  },
};
