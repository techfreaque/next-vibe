import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/es";

import { translations as leadAnalyticsTranslations } from "@/leads/analytics/i18n/es";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  ...leadAnalyticsTranslations,
  tags: {
    leads: "prospectos",
    analytics: "analítica",
  },
  get: {
    title: "Adquisición",
    titleShort: "Adquisición",
    description:
      "De dónde vienen los visitantes y los prospectos: canal, fuente, referente, campaña, página de entrada, país, dispositivo, personas o bots. Cada número abre los prospectos correspondientes.",
    response: {
      window: "Periodo",
      kpis: "Cifras clave",
      trend: "Tendencia",
      breakdown: "Desglose",
      agents: "Agentes",
      coverage: "Cobertura del seguimiento",
    },
    errors: {
      unauthorized: {
        title: "No autorizado",
        description: "Inicia sesión como admin.",
      },
      validation: {
        title: "Filtros no válidos",
        description: "Revisa el periodo y los valores de los filtros.",
      },
      server: {
        title: "Falló el informe",
        description: "No se pudo calcular el informe de adquisición.",
      },
      unknown: {
        title: "Error desconocido",
        description: "Algo salió mal.",
      },
      network: {
        title: "Error de red",
        description: "No se puede conectar con el servidor.",
      },
      forbidden: { title: "Acceso denegado", description: "Solo para admins." },
      notFound: {
        title: "No encontrado",
        description: "No hay datos del informe.",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Aplica o descarta los cambios en los filtros.",
      },
      conflict: {
        title: "Conflicto",
        description: "Los datos cambiaron. Recarga.",
      },
    },
    success: {
      title: "Informe listo",
      description: "Informe de adquisición cargado.",
    },
  },
  widget: {
    revenue: "Ingresos",
    humanVisits: "Visitas humanas",
    botVisits: "Visitas de bots",
    botVisitsHint: "{{count}} visitas de bots",
    unknownLeadsHint: "{{count}} más sin user agent (desconocido)",
    botsTitle: "Prospectos bot",
    botsSubtitle:
      "Rastreadores, vistas previas y scripts. Haz clic en una barra para ver sus prospectos.",
    loading: "Cargando informe de adquisición...",
    pageSubtitle:
      "De dónde vienen los leads y cómo convierten. Haz clic en un número para ver sus leads.",
    coverage:
      "Las visitas se registran desde el {{date}}. Los prospectos anteriores cuentan, pero sin visitas.",
    botShareHint: "{{percent}} de los prospectos nuevos",
    leadsTitle: "Prospectos humanos",
    leadsSubtitle:
      "Nuevos prospectos humanos. Haz clic en una barra para ver sus prospectos.",
    visitsTitle: "Visitas registradas",
    visitsSubtitle:
      "Llegadas registradas. Humanos vs prospectos clasificados como bots.",
    conversionsTitle: "Registros y pagadores",
    conversionsSubtitle: "Según el día en que ocurrió cada paso.",
    breakdownTitle: "De dónde vienen los prospectos",
    breakdownSubtitle:
      "Primer contacto. Haz clic en una fila para ver sus prospectos.",
    agentsTitle: "Quién aparece",
    agentsSubtitle: "Familia de agente según el user agent.",
    filtersTitle: "Segmento",
    filtersSubtitle: "Acota cada número de esta página.",
    apply: "Aplicar",
    empty: "No hay prospectos en este periodo.",
    emptyHint: "Elige un periodo más largo o borra los filtros.",
  },
};
