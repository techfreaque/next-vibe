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
    title: "Embudo",
    titleShort: "Embudo",
    description:
      "Prospectos creados en el periodo y hasta dónde llegaron: persona, primer chat, registro, correo confirmado, pago. Por canal, fuente o código de referido. Cada paso abre sus prospectos.",
    response: {
      window: "Periodo",
      dimensionUsed: "Dimensión del segmento",
      steps: "Pasos del embudo",
      previousSteps: "Pasos del periodo anterior",
      rates: "Tasas de conversión",
      segments: "Embudo por segmento",
      trend: "Tendencia de la cohorte",
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
        description: "No se pudo calcular el informe del embudo.",
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
      description: "Informe del embudo cargado.",
    },
  },
  widget: {
    loading: "Cargando embudo...",
    cohortHint: "de {{count}} prospectos creados",
    signupRate: "Tasa de registro",
    payRate: "Tasa de pago",
    overallRate: "De persona a pagador",
    overallShort: "A pagador",
    ofHumans: "{{count}} de {{total}} prospectos humanos",
    ofSignups: "{{count}} de {{total}} registros",
    funnelTitle: "Embudo de la cohorte",
    funnelSubtitle:
      "Embudo desde prospectos humanos. Bots y total: primera tarjeta.",
    trendTitle: "Cohorte por día de creación",
    trendSubtitle: "Prospectos humanos y cuántos de ellos convirtieron.",
    segmentsTitle: "Embudo por segmento",
    segmentsSubtitle:
      "Tasas por prospecto humano. Haz clic en una fila para ver sus prospectos.",
    filtersTitle: "Segmento",
    filtersSubtitle: "Acota cada número de esta página.",
    apply: "Aplicar",
    empty: "No hay prospectos en este periodo.",
  },
};
