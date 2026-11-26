import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/es";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  get: {
    title: "Ingresos",
    titleShort: "Ingresos",
    description:
      "Ingresos por paquetes de créditos, nuevas suscripciones y renovaciones por pasarela, plan y moneda, con reembolsos, disputas, MRR, suscripciones activas y bajas.",
    tags: {
      revenue: "ingresos",
      mrr: "MRR",
    },
    fields: {
      kind: {
        label: "Tipo",
        description:
          "Paquetes de créditos, nuevas suscripciones, renovaciones o todo",
      },
      provider: {
        label: "Pasarela",
        description: "Solo pagos a través de esta pasarela",
      },
      currency: {
        label: "Moneda",
        description: "Solo pagos en esta moneda (USD, EUR, PLN)",
      },
      plan: {
        label: "Plan",
        description: "Solo pagos y suscripciones de este plan",
      },
      includeInternal: {
        label: "Incluir cuentas admin",
        description: "Contar también los pagos de cuentas admin",
      },
    },
    response: {
      window: "Periodo",
      appliedFilters: "Filtros aplicados",
      kpis: "Cifras clave",
      revenueByKind: "Ingresos por tipo",
      revenueByProcessor: "Ingresos por pasarela",
      subscriptionFlow: "Suscripciones nuevas vs bajas",
      byPlan: "Por plan o producto",
      byCurrency: "Por moneda",
      byProcessor: "Por pasarela",
      recentPayments: "Pagos recientes",
      fxRates: "Tipos de cambio a USD",
    },
    errors: {
      validation: {
        title: "Filtros no válidos",
        description: "Revisa el periodo y los filtros e inténtalo de nuevo.",
      },
      unauthorized: {
        title: "Inicio de sesión requerido",
        description: "Inicia sesión como admin para ver los ingresos.",
      },
      forbidden: {
        title: "Solo admins",
        description: "Solo los admins pueden ver los ingresos.",
      },
      notFound: {
        title: "Sin resultados",
        description: "No hay pagos para esta solicitud.",
      },
      server: {
        title: "Error en el informe",
        description:
          "No se pudo generar el informe de ingresos. Inténtalo de nuevo.",
      },
      unknown: {
        title: "Error inesperado",
        description: "Algo falló al cargar el informe.",
      },
      network: {
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor.",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Aplica o descarta primero los cambios de filtros.",
      },
      conflict: {
        title: "Conflicto de datos",
        description:
          "Los datos cambiaron durante la carga. Recarga el informe.",
      },
    },
    success: {
      title: "Informe listo",
      description: "Ingresos cargados",
    },
  },
  widget: {
    loadingReport: "Cargando el informe de ingresos…",
    operatingTitle: "Ingresos operativos",
    currencyBasis: "Importes aproximados en USD.",
    filterDisclosure: "Filtros",
    extra: {
      grossHint: "Suscripciones {{subs}} · paquetes {{packs}} · aprox. USD",
      newSubsHint:
        "Suscripciones iniciadas en el periodo · {{count}} primeros pagos",
      churn30Hint: "Terminadas en el periodo · bajas a 30 días {{rate}}",
      notLoaded: "Informe no cargado. Actualiza para reintentar.",
      firstPayments: "Primeros pagos de suscripción",
      openAll: "Abrir todos los pagos",
      churnChart: "Bajas a 30 días",
      churnNote:
        "Suscripciones terminadas en los 30 días previos a cada punto ÷ activas al inicio de esos 30 días",
      kindPack: "Paquete de créditos",
      kindNew: "Primer pago de suscripción",
      kindRenewal: "Renovación",
      paid: "Pagados",
      subscriptionNote:
        "Las cifras de suscripción ignoran los filtros de tipo y moneda.",
      netHint:
        "Bruto menos reembolsos del periodo; disputas y comisiones no restadas",
      mrrHint:
        "Suscripciones activas al cierre del periodo, planes anuales ÷ 12",
      mrrChart: "MRR en el tiempo",
      mrrNote:
        "Ingresos recurrentes de las suscripciones activas en cada momento.",
      churnRate: "{{rate}} de las suscripciones activas al inicio del periodo",
      seriesMrr: "MRR",
      seriesActive: "Suscripciones activas",
      packUnknown: "Paquete de créditos, tamaño sin registrar",
      filterIgnored: "No le afectan los filtros de tipo y moneda",
      processorAll: "Todos los procesadores",
      currencyAll: "Todas las monedas",
    },
    group: {
      money: "Dinero",
      customers: "Clientes y suscripciones",
      volume: "Volumen de pagos",
    },
    kpi: {
      grossRevenueUsd: "Ingresos brutos",
      netRevenueUsd: "Ingresos netos",
      refundsUsd: "Reembolsos",
      mrrUsd: "MRR",
      payingCustomers: "Clientes de pago",
      activeSubscriptions: "Suscripciones activas",
      newSubscriptions: "Nuevas suscripciones",
      churnedSubscriptions: "Bajas",
      renewals: "Renovaciones",
      packPurchases: "Compras de paquetes",
      disputes: "Disputas",
      failedPayments: "Pagos fallidos",
    },
    hint: {
      grossRevenueUsd: "Pagos cobrados, aprox. USD",
      netRevenueUsd: "Bruto menos reembolsos emitidos en el periodo",
      refundsUsd: "Reembolsos emitidos en el periodo",
      mrrUsd: "Suscripciones activas al cierre, anuales / 12",
      payingCustomers: "Cuentas con al menos un pago cobrado",
      activeSubscriptions: "Activas al cierre del periodo",
      newSubscriptions: "Suscripciones iniciadas en el periodo",
      churnedSubscriptions: "Suscripciones finalizadas en el periodo",
      renewals: "Pagos de renovación cobrados",
      packPurchases: "Pagos de paquetes de créditos cobrados",
      disputes: "Contracargos abiertos en el periodo",
      failedPayments: "Pagos fallidos en el periodo",
    },
    chart: {
      kind: "Ingresos por tipo",
      processor: "Ingresos por pasarela",
      flow: "Suscripciones: nuevas vs bajas",
    },
    series: {
      pack: "Paquetes de créditos",
      newSubscription: "Nuevas suscripciones",
      renewal: "Renovaciones",
      new: "Nuevas",
      churned: "Bajas",
    },
    breakdown: {
      byPlan: "Por plan o producto",
      byCurrency: "Por moneda",
      byProcessor: "Por pasarela",
      recent: "Pagos recientes",
      recentHint:
        "Haz clic en un pago para abrirlo en las transacciones del procesador.",
      drillHint: "Haz clic en una fila para filtrar el informe.",
      plan: "Plan o producto",
      currency: "Moneda",
      processor: "Pasarela",
      payment: "Pago",
    },
    column: {
      revenueUsd: "Ingresos",
      amount: "Importe original",
      payments: "Pagos",
      customers: "Clientes",
      failed: "Fallidos",
      refundsUsd: "Reembolsado",
      usd: "USD",
    },
    label: {
      creditPack: "Paquete de créditos (500)",
      creditPackLarge: "Paquete de créditos (2.500)",
      pack: "Paquete de créditos",
      newSubscription: "Nueva suscripción, plan sin registrar",
      renewal: "Renovación, plan sin registrar",
      rate: "1 {{currency}} = {{rate}} USD",
    },
    fxNote: "Totales en USD aprox. con tipos fijos: {{rates}}.",
    subscriptionNote:
      "Las cifras de suscripciones solo siguen los filtros de pasarela y plan.",
    filter: {
      kind: "Tipo",
      provider: "Pasarela",
      currency: "Moneda",
      plan: "Plan",
      internal: "Admins incluidos",
    },
    empty: "Sin pagos en este periodo.",
    includeInternal: "Incluir admins",
  },
  enums: {
    kind: {
      all: "Todo",
      pack: "Paquetes",
      newSubscription: "Primeros pagos",
      renewal: "Renovaciones",
    },
    paymentProvider: {
      stripe: "Stripe",
      nowpayments: "NOWPayments",
    },
    paymentStatus: {
      pending: "Pendiente",
      processing: "Procesando",
      succeeded: "Completado",
      failed: "Fallido",
      canceled: "Cancelado",
      refunded: "Reembolsado",
    },
    plan: {
      subscription: "Starter",
      plus: "Plus",
      pro: "Pro",
      ultra: "Ultra",
    },
  },
};
