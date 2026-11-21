import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/es";

import { translations as leadAnalyticsTranslations } from "@/leads/analytics/i18n/es";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  ...leadAnalyticsTranslations,
  category: "Analítica",
  tags: {
    analytics: "Analítica",
    overview: "Resumen",
  },
  get: {
    title: "Resumen del negocio",
    titleShort: "Resumen",
    description:
      "Tráfico, leads, registros, clientes de pago, ingresos, coste de IA y alertas de un periodo, frente al periodo anterior. Cada cifra abre el informe que hay detrás.",
    response: {
      window: "Periodo",
      generatedAt: "Datos de",
      acquisition: "Captación",
      referral: "Referidos",
      money: "Finanzas",
      ops: "Operaciones",
    },
    widget: {
      kpi: {
        visits: "Visitas humanas",
        humanLeads: "Leads nuevos",
        botLeadsHint: "{{count}} leads de bots excluidos",
        botVisitsHint: "{{count}} visitas de bots excluidas",
        payersHint: "Pagadores distintos en el periodo",
        signups: "Registros",
        signupRateHint: "{{rate}} de los leads nuevos",
        payers: "Clientes que pagaron",
        revenue: "Ingresos",
        revenueHint: "Dinero cobrado, aprox. USD",
        revenueNetHint:
          "Dinero cobrado, aprox. USD. {{net}} tras coste de proveedores de IA.",
        creditSpend: "Uso de IA (créditos consumidos)",
        guestSpendHint: "{{amount}} por invitados",
        creditSpendHint:
          "Coste de proveedores {{cost}} (frente a {{previous}}). {{guests}} por invitados.",
        margin: "Margen del uso de IA",
        marginPartial: "Margen IA (parcial)",
        marginHint:
          "Coste de proveedores {{cost}}. Facturado menos coste, donde se conoce el coste.",
        marginBaseHint:
          "{{rate}} de {{base}} de uso facturado con datos de coste. Coste de proveedores {{cost}}.",
        marginRateHint:
          "{{margin}} sobre {{base}} con datos de coste ({{coverage}} del uso).",
        errors: "Errores sin resolver",
        errorsHint: "{{count}} ocurrencias en el periodo",
        botShare: "Cuota de bots en leads",
        botShareHint:
          "{{count}} leads de bots, fuente principal en Requiere atención",
        botShareTopHint: "{{count}} leads de bots. Mayor pico {{prefix}}.",
      },
      trafficChart: "Leads humanos y registros",
      trafficChartHint: "Sin bots",
      moneyChart: "Ingresos",
      moneyChartHint: "Cobros por intervalo",
      series: {
        visits: "Visitas",
        leads: "Leads nuevos",
        signups: "Registros",
        revenueUsd: "Ingresos",
        spendUsd: "Uso de IA facturado",
        upstreamCostUsd: "Coste de proveedores",
      },
      sources: "De dónde vienen los leads (primer contacto)",
      sourcesDimension: "Canal",
      sourcesHint:
        "Actividad del periodo según el canal de primer contacto de cada persona",
      referralsHint:
        "Clics, registros y pagos atribuidos al código en este periodo",
      leadShare: "Cuota de leads",
      revenueShare: "Cuota de ingresos",
      footerSources:
        "Ingresos en estas filas: {{rows}} de {{total}} cobrados en el periodo",
      footerReferrals:
        "Atribuido a códigos (base de comisión): {{rows}} de {{total}} cobrados en el periodo",
      referrals: "Mejores códigos de referido",
      referralsDimension: "Código",
      columns: {
        leads: "Leads",
        signups: "Registros",
        payers: "De pago",
        clicks: "Clics",
        revenueUsd: "Ingresos",
        conversion: "De lead a registro",
        clickToSignup: "De clic a registro",
      },
      alerts: {
        severity: { high: "Alta", medium: "Media", low: "Baja" },
        title: "Requiere atención",
        none: "Nada requiere atención en este periodo.",
        abuse:
          "{{count}} rangos IP con picos de leads, a la cabeza {{prefix}} ({{leads}} leads)",
        payouts: "{{count}} solicitudes de pago pendientes ({{amount}})",
        tasks: "{{count}} tareas programadas fallan",
        connections: "{{count}} conexiones remotas con problemas",
        costCoverage:
          "Coste de proveedores conocido solo para {{coverage}} del uso de IA, margen parcial",
        unattributed:
          "{{share}} de los ingresos sin fuente conocida ({{amount}})",
        errors:
          "{{count}} errores sin resolver, {{occurrences}} ocurrencias en el periodo",
      },
      open: {
        acquisition: "Informe de captación",
        funnel: "Embudo",
        referrals: "Resumen de referidos",
        revenue: "Informe de ingresos",
        usage: "Informe de uso de IA",
        errors: "Registro de errores",
      },
      unavailable: "No se pudo cargar esta sección.",
      asOf: "Datos de las {{time}}. En caché un minuto.",
      loading: "Cargando resumen",
    },
    errors: {
      unauthorized: {
        title: "Sin sesión",
        description: "Inicia sesión como admin para ver el resumen.",
      },
      validation: {
        title: "Periodo no válido",
        description: "Revisa el periodo y las fechas.",
      },
      server: {
        title: "Error en el resumen",
        description: "No se pudo calcular el resumen. Inténtalo de nuevo.",
      },
      unknown: {
        title: "Error inesperado",
        description: "Algo salió mal al cargar el resumen.",
      },
      network: {
        title: "Error de red",
        description: "No se puede acceder al servidor.",
      },
      forbidden: {
        title: "Solo admins",
        description: "Solo los admins ven el resumen del negocio.",
      },
      notFound: {
        title: "No encontrado",
        description: "El resumen no está disponible.",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Guarda o descarta primero tus cambios.",
      },
      conflict: {
        title: "Conflicto",
        description:
          "Los datos cambiaron durante la carga. Inténtalo de nuevo.",
      },
    },
    success: {
      title: "Resumen cargado",
      description: "Resumen del negocio para el periodo elegido.",
    },
  },
};
