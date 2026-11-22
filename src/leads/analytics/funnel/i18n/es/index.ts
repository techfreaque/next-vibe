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
      signupSteps: "Pasos de registro en el periodo",
      previousSignupSteps: "Pasos de registro en el periodo anterior",
      signupSegments: "Pasos de registro por segmento",
      signupTrackedSince: "Pasos de registro registrados desde",
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
    signupTitle: "Confirmación de registro",
    signupSubtitle:
      "Prospectos por paso, fechados cuando ocurrió el paso. La caída muestra dónde se pierden los registros.",
    signupTrackedHint:
      "Registrado desde {{date}}: de los registros anteriores solo constan los fallos.",
    started: "Iniciados",
    emailSent: "Correo enviado",
    sendFailed: "Envío fallido",
    bounced: "Rebotado",
    expired: "Caducados",
    confirmed: "Confirmados",
    confirmRate: "Tasa de confirmación",
    ofStarted: "{{count}} de {{total}} iniciados",
    signupSegmentsTitle: "Pasos de registro por segmento",
    signupSegmentsSubtitle: "Los mismos pasos según la dimensión elegida.",
    signupEmpty: "Sin registros en este periodo.",
    signupLost: "Perdidos en el correo",
    signupLostHint: "Rebotados, fallidos o caducados antes de confirmar",
    loading: "Cargando embudo...",
    cohortHint: "de {{count}} prospectos creados",
    signupRate: "Tasa de registro",
    payRate: "Tasa de pago",
    overallRate: "De prospecto a pagador",
    overallShort: "A pagador",
    ofHumans: "{{count}} de {{total}} prospectos sin bots",
    ofSignups: "{{count}} de {{total}} registros",
    funnelTitle: "Embudo de la cohorte",
    funnelSubtitle:
      "Embudo desde prospectos sin bots (navegador o sin user agent). Bots y total: primera tarjeta.",
    trendTitle: "Cohorte por día de creación",
    trendSubtitle: "Prospectos sin bots y cuántos de ellos convirtieron.",
    segmentsTitle: "Embudo por segmento",
    segmentsSubtitle:
      "Tasas por prospecto sin bots. Haz clic en una fila para ver sus prospectos.",
    filtersTitle: "Segmento",
    filtersSubtitle: "Acota cada número de esta página.",
    apply: "Aplicar",
    empty: "No hay prospectos en este periodo.",
  },
};
