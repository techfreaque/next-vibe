import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/es";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  title: "Rendimiento de campañas",
  description:
    "Si el correo de campaña sale, qué está atascado en la cola y cómo rinde cada recorrido",
  enums: {
    emailJourneyVariantFilter: {
      all: "Todos",
      uncensoredConvert: "Conversión a modelos sin censura",
      sideHustle: "Hustle lateral",
      quietRecommendation: "Recomendación silenciosa",
      signupNurture: "Nutrición de registro",
      retention: "Retención",
      winback: "Winback",
      newsletterMay2026: "Boletín May 2026",
      newsletterNov2026: "Boletín de noviembre 2026",
    },
    emailJourneyVariant: {
      uncensoredConvert: "Conversión a modelos sin censura",
      sideHustle: "Hustle lateral",
      quietRecommendation: "Recomendación silenciosa",
      signupNurture: "Nutrición de registro",
      retention: "Retención",
      winback: "Winback",
      newsletterMay2026: "Boletín May 2026",
      newsletterNov2026: "Boletín de noviembre 2026",
    },
    emailCampaignStageFilter: {
      all: "Todos",
    },
    emailCampaignStage: {
      notStarted: "No empezó",
      initial: "Contacto inicial",
      followup1: "Seguimiento 1",
      followup2: "Seguimiento 2",
      followup3: "Seguimiento 3",
      nurture: "Nutrición",
      reactivation: "Reactivación",
    },
  },
  get: {
    title: "Rendimiento de campañas",
    titleShort: "Campañas",
    description:
      "Estado del motor, salud de la cola y rendimiento del correo en el tiempo: enviados, abiertos, clics, bajas, rebotes y fallos por variante de recorrido, etapa e idioma. Cada cifra abre los leads correspondientes.",
    fields: {
      journeyVariant: {
        label: "Variante de recorrido",
        description: "Solo este recorrido de correo",
        placeholder: "Cualquier recorrido",
      },
      stage: {
        label: "Etapa",
        description: "Solo correos de esta etapa de campaña",
        placeholder: "Cualquier etapa",
      },
      locale: {
        label: "Idioma",
        description: "Locale renderizado (de-DE) o idioma (de)",
        placeholder: "Cualquier idioma",
      },
    },
    response: {
      variantTrend: "Enviados por recorrido",
      window: "Periodo",
      engine: "Estado del motor",
      queue: "Salud de la cola",
      kpis: "Indicadores",
      totals: "Totales",
      trend: "Enviados, abiertos, clics",
      problems: "Fallos, rebotes, bajas",
      funnel: "Embudo de correo",
      byVariant: "Por variante de recorrido",
      byStage: "Por etapa",
      byLocale: "Por idioma",
      topErrors: "Errores de envío principales",
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description:
          "Debes estar conectado para ver las estadísticas de campaña",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Usted no tiene permiso para ver estadísticas de campaña",
      },
      server: {
        title: "Error del servidor",
        description:
          "Se produjo un error mientras se recogen las estadísticas de campaña",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
      validation: {
        title: "Error de validación",
        description: "Parámetros de entrada inválidos",
      },
    },
    success: {
      title: "Stats Retrieved",
      description: "Estadísticas de campaña recuperadas con éxito",
    },
  },
  widget: {
    groups: {
      now: "Ahora mismo",
      period: "En el periodo elegido",
    },
    stuck: "Nunca enviado",
    title: "Rendimiento de campañas",
    loading: "Cargando cifras de campañas...",
    filters: "Filtros",
    openQueue: "Abrir cola",
    empty: "Sin envíos en este periodo.",
    emptySendingOff:
      "Sin envíos en este periodo. El envío está apagado, ver arriba.",
    noProblems: "Sin fallos, rebotes ni bajas en este periodo.",
    noErrors: "Sin errores de envío en este periodo.",
    sentNoteOff:
      "Cero envíos aquí significa motor apagado, no falta de interés.",
    errors: {
      duplicate: "Omitido: destinatario duplicado",
      statusChange: "Omitido: el lead ahora es {{status}}",
    },
    engine: {
      starterOff:
        "campaign-starter también está apagado: ningún lead nuevo entra en los recorridos.",
      otherPath:
        "Esos salieron por otra vía (envío masivo o ejecución manual), no por el dispatcher.",
      openDispatcher: "Abrir ajustes del dispatcher",
      neverSent: "Nunca se envió un correo de campaña.",
      lastSend: "Último envío {{when}}. Enviados en 24 h: {{count}}.",
      offTitle: "El envío está apagado",
      failingTitle: "El dispatcher falla ({{count}} ejecuciones seguidas)",
      onTitle: "El envío funciona",
      missing:
        "El dispatcher email-campaigns no tiene programación cron. {{count}} correos pendientes esperan en la cola y nunca saldrán hasta que se programe.",
      disabled:
        "El dispatcher email-campaigns está desactivado. {{count}} correos pendientes esperan en la cola.",
      on: "Última ejecución {{last}}, próxima {{next}}.",
      noError: "Sin mensaje de error registrado.",
      openDue: "Ver {{count}} leads",
      state: {
        missing: "sin programar",
        disabled: "desactivado",
        failing: "fallando",
        running: "activo",
      },
    },
    queue: {
      oldestBiggest:
        "{{emails}} leads. Mayor atraso: {{journey}} ({{count}} correos)",
      stuckClaims: "Reservas de envío atascadas",
      stuckClaimsHint: "Reservadas hace más de 1 h, nunca confirmadas",
      stuckDaysHint: "Pendiente desde {{when}}",
      stuckDays: "Más antiguo pendiente, días",
      nothingScheduled: "Nada programado",
      dueNow: "Correos pendientes",
      oldest: "{{emails}} leads esperando",
      nothingDue: "Nada en espera",
      scheduled: "Programados para después",
      scheduledHint: "{{count}} en las próximas 24 h, próximo {{when}}",
    },
    kpi: {
      bouncedOff:
        "bounce-processor está apagado: rebotes quizá infravalorados. {{rate}} de los enviados",
      ofSentRate: "{{rate}} de los enviados",
      skippedHint: "Duplicados y cambios de estado no contados: {{count}}",
      sent: "Enviados",
      openRate: "Tasa de apertura",
      clickRate: "Tasa de clics",
      ofSent: "{{count}} de los correos enviados",
      unsubscribed: "Bajas",
      bounced: "Rebotados",
      failed: "Errores de envío en el periodo",
    },
    series: {
      sent: "Enviados",
      opened: "Abiertos",
      clicked: "Clics",
      failed: "Errores de envío",
      bounced: "Rebotados",
      unsubscribed: "Bajas",
    },
    charts: {
      errorsHint:
        "Solo fallos reales. Duplicados y cambios de estado ocultos: {{count}}",
      variantTrendHint:
        "Correos enviados por intervalo, por variante de recorrido",
      variantTrend: "Enviados por recorrido",
      trend: "Enviados, abiertos, clics",
      trendHint:
        "Por día de envío: correos enviados y cuántos se abrieron o pulsaron después. Haz clic en un día para esos leads.",
      problems: "Problemas",
      problemsHint: "Envíos fallidos, rebotes y bajas por intervalo",
      funnel: "Embudo de correo",
      funnelHint:
        "Correos enviados en el periodo y qué hicieron los destinatarios",
      byVariant: "Por variante de recorrido",
      byVariantHint: "Enviados en el periodo. Pendientes = en cola ahora.",
      byStage: "Por etapa",
      byLocale: "Por idioma",
      errors: "Errores de envío",
    },
    columns: {
      failed: "Errores de envío",
      sent: "Env.",
      openRate: "Aper.",
      clickRate: "Clics",
      unsubscribed: "Bajas",
      bounced: "Rebot.",
      due: "Correos pendientes",
      variant: "Recorrido",
      stage: "Etapa",
      locale: "Idioma",
      error: "Error",
      count: "Cantidad",
    },
    definitions:
      "Las tasas de apertura y clics cuentan correos enviados en el periodo que se abrieron o pulsaron en cualquier momento. Pendientes = en espera y programados en el pasado: solo el dispatcher email-campaigns los envía. Idioma = locale renderizado, si no idioma y país del lead.",
  },
};
