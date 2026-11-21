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
    title: "Señales de abuso",
    titleShort: "Abuso",
    description:
      "Oleadas de prospectos y registros desde una misma red o un mismo user agent, y créditos gratis gastados por visitantes que nunca se registraron. Cada fila abre los prospectos correspondientes.",
    fields: {
      minLeads: {
        label: "Umbral de oleada",
        description:
          "Prospectos de un clúster en el periodo a partir de los cuales cuenta como oleada",
      },
    },
    response: {
      window: "Periodo",
      groupByUsed: "Agrupado por",
      minLeadsUsed: "Umbral de oleada",
      kpis: "Cifras clave",
      trend: "Prospectos de clústeres marcados",
      clusters: "Clústeres",
      burners: "Quienes más créditos gratis gastan",
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
        description: "No se pudo calcular el informe de abuso.",
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
      description: "Informe de abuso cargado.",
    },
  },
  widget: {
    fast: "Rápido",
    noIp: "Sin IP",
    perHour: "Prospectos/hora",
    thresholdOption: "{{count}}+ prospectos",
    loading: "Cargando señales de abuso...",
    flaggedPrefixes: "Redes marcadas",
    flaggedAgents: "Agentes marcados",
    thresholdHint: "{{count}}+ prospectos en el periodo",
    flaggedLeads: "Prospectos en oleadas",
    flaggedShare: "{{percent}}% de los prospectos nuevos",
    freeCredits: "Créditos gratis gastados",
    freeCreditsHint: "Por visitantes sin cuenta",
    burners: "Visitantes que gastan",
    burnersHint: "Personas sin cuenta que gastan créditos gratis",
    trendTitle: "Prospectos de picos",
    trendSubtitle: "Oleada = clúster con {{count}}+ prospectos en el periodo.",
    seriesFlagged: "De oleadas",
    seriesOther: "Otros prospectos",
    clustersIpTitle: "Oleadas por red",
    clustersUaTitle: "Oleadas por user agent",
    clustersSubtitle:
      "Ordenado por prospectos por hora. Rápido = {{rate}}+ prospectos/hora. Haz clic en una fila para ver sus prospectos.",
    prefix: "Red",
    userAgent: "User agent",
    prefixes: "Redes distintas",
    agents: "Agentes distintos",
    noClusters: "Ningún clúster llegó a {{count}} prospectos en este periodo.",
    burnersTitle: "Quienes más créditos gratis gastan",
    burnersSubtitle: "Visitantes sin cuenta. Haz clic para abrir el prospecto.",
    lead: "Prospecto",
    requests: "Solicitudes",
    noBurners:
      "Ningún visitante sin cuenta gastó créditos gratis en este periodo.",
    filtersTitle: "Segmento",
    filtersSubtitle: "Acota cada número de esta página.",
    apply: "Aplicar",
  },
};
