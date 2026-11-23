import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/es";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  category: "Gestión de tareas",

  errors: {
    fetchCronTaskStats: "No se pudo cargar el estado de las tareas: {{error}}",
  },

  enums: {
    taskHealth: {
      stuck: "Atascada",
      failing: "Fallando",
      overdue: "Atrasada",
      flaky: "Inestable",
      recovering: "Recuperándose",
      lowData: "Pocos datos",
      running: "En curso",
      neverRan: "Nunca ejecutada",
      healthy: "Sana",
      disabled: "Desactivada",
    },
    healthFilter: {
      withFailures: "Tareas con fallos en el periodo",
      all: "Todos los estados",
      attention: "Requiere atención",
    },
  },

  get: {
    title: "Estado de tareas",
    titleShort: "Estado de tareas",
    description:
      "El estado del cron de un vistazo: tareas fallando, atascadas, atrasadas, desactivadas y nunca ejecutadas, volumen de ejecuciones, tasa de éxito y duración en el tiempo. Haz clic en una tarea para ver su historial.",
    tag: "Estado del cron",
    fields: {
      taskId: {
        title: "Tarea",
        description: "Limitar el informe a un ID de tarea",
      },
      health: {
        title: "Estado",
        description:
          "Mostrar en la tabla solo las tareas en este estado (la lista de atención siempre muestra todas las tareas fallando, atascadas y atrasadas)",
      },
      includeDisabled: {
        title: "Incluir tareas desactivadas",
        description:
          "Contar las ejecuciones de tareas desactivadas en las métricas y gráficos del periodo. Apagado por defecto: los fallos antiguos de una tarea apagada no dicen nada del estado de hoy.",
      },
      days: {
        title: "Mostrar tablas por día",
        description:
          "Imprimir el desglose por día bajo cada gráfico (CLI). Apagado por defecto: las sparklines ya muestran la tendencia.",
      },
      includeParked: {
        title: "Mostrar tareas aparcadas",
        description:
          "Incluir tareas puntuales terminadas y tareas desactivadas que nunca se ejecutaron. Ocultas por defecto.",
      },
    },
    response: {
      generatedAt: { title: "Actualizado" },
      window: { title: "Periodo" },
      summary: { title: "Estados de tareas ahora" },
      kpis: { title: "Métricas de ejecución en el periodo" },
      runsTrend: { title: "Ejecuciones en el tiempo" },
      successTrend: { title: "Tasa de éxito en el tiempo" },
      durationTrend: { title: "Duración en el tiempo" },
      attention: { title: "Requiere atención" },
      tasks: { title: "Tareas" },
      recentRuns: { title: "Últimas ejecuciones" },
      inFlight: { title: "Ejecución en curso" },
      watchdog: { title: "Estado del watchdog" },
      failuresByTask: { title: "Ejecuciones fallidas por tarea" },
      tasksWithFailures: { title: "Tareas con fallos" },
      disabledIncluded: { title: "Tareas desactivadas incluidas" },
      taskOptions: { title: "Lista de tareas" },
    },
    errors: {
      server: {
        title: "Error del servidor",
        description: "No se pudo cargar el estado de las tareas",
      },
      validation: {
        title: "Solicitud no válida",
        description: "Revisa el periodo y los filtros",
      },
      unauthorized: {
        title: "Sin sesión",
        description: "Inicia sesión para ver el estado de las tareas",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes acceso al estado de las tareas",
      },
      notFound: {
        title: "No encontrada",
        description: "No hay ninguna tarea con este ID",
      },
      conflict: {
        title: "Conflicto",
        description: "La solicitud choca con el estado actual",
      },
      network: {
        title: "Error de red",
        description: "No se puede contactar con el estado de las tareas",
      },
      unknown: {
        title: "Error desconocido",
        description: "Falló la carga del estado de las tareas",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Guarda o descarta primero tus cambios",
      },
    },
    success: {
      title: "Estado de tareas cargado",
      description: "El informe de estado de tareas está listo",
    },
  },

  widget: {
    stabilityPeriod: "La estabilidad se calcula en el periodo seleccionado.",
    watchdogBanner:
      "El propio watchdog de tareas está {{state}}. Los veredictos de atascada y atrasada pueden estar desfasados hasta que vuelva a ejecutarse bien.",
    inFlight: {
      title: "En curso",
      line: "Iniciada hace {{age}} · atascada tras {{limit}} (límite {{timeout}} + margen)",
      stuck: "por encima del límite del watchdog",
      run: "ejecución",
      noRun: "sin registro de ejecución",
    },
    title: "Estado de tareas",
    viewTasks: "Tareas",
    viewHistory: "Historial",
    refresh: "Actualizar",
    now: "Ahora",
    inPeriod: "En el periodo",
    allHealthy: "Las {{count}} tareas activas están sanas",
    tile: {
      failing: "Fallando",
      failingHint: "Activa, última ejecución fallida",
      stuck: "Atascadas",
      stuckHint: "Supera su tiempo límite",
      overdue: "Atrasadas",
      overdueHint: "Se saltó una ejecución programada",
      flaky: "Inestables",
      flakyHint: "Menos del 80 % de éxito en el periodo",
      flakyRecovering: "{{count}} más recuperándose",
      neverRan: "Nunca ejecutadas",
      neverRanHint: "Activa, nunca arrancó",
      disabled: "Desactivadas",
      disabledHint: "Apagada, no rota",
      disabledOrphans: "{{count}} con ejecución huérfana",
      parked: "Aparcadas",
      parkedHint: "Puntuales y desactivadas sin ejecutar, ocultas",
      parkedShownHint: "Puntuales y desactivadas sin ejecutar, visibles",
      lowData: "Pocos datos",
      lowDataHint: "Fallos, menos de 3 ejecuciones terminadas",
      timedOutExcluded: "Sin {{count}} ejecuciones con timeout",
      healthy: "Sanas",
      healthyHint: "de {{total}} activas",
      runs: "Ejecuciones",
      failedRuns: "Ejecuciones fallidas",
      successRate: "Tasa de éxito (de ejecuciones)",
      successRateHint: "Completadas de las ejecuciones terminadas",
      tasksWithFailures: "Tareas con fallos",
      tasksWithFailuresHint: "de {{total}} tareas ejecutadas",
      completedOnly: "Solo ejecuciones completadas",
      noCompleted: "Ninguna ejecución completada",
      recovering: "Recuperándose",
      recoveringHint: "Limpia otra vez, últimas 3 ejecuciones correctas",
      stuckDisabled: "{{count}} en una tarea desactivada",
      p50Duration: "Duración mediana",
      p95Duration: "Duración p95",
    },
    attention: {
      title: "Requiere atención",
      subtitle: "Tareas que revisar",
      empty:
        "No hay tareas con fallos, bloqueadas, atrasadas, inestables ni en recuperación.",
      lastError: "Último error",
      noError: "Sin mensaje de error registrado",
      failedAgo: "{{status}} hace {{age}}",
      runningFor:
        "En curso desde hace {{age}} · atascada tras {{limit}} (límite {{timeout}} + margen)",
      missed: "Tocaba hace {{due}}, última ejecución {{last}}",
      lastNever: "nunca",
      lastAgo: "hace {{age}}",
      streak: "{{count}} fallos seguidos (en total)",
      failuresInPeriod: "{{count}} ejecuciones fallidas en el periodo",
      flakyDetail:
        "{{rate}} de éxito en {{runs}} ejecuciones terminadas del periodo",
      recoveringDetail:
        "últimas {{count}} ejecuciones correctas · {{rate}} de éxito en {{runs}} ejecuciones terminadas del periodo",
      neverCompleted: "nunca terminó una ejecución",
      disabledToo: "desactivada",
      openFailures: "Fallidas",
      openRuns: "Todas las ejecuciones",
      openRunning: "Ejecución en curso",
      orphaned: "ejecución huérfana, tarea desactivada",
    },
    chart: {
      showTrends: "Mostrar tendencias",
      hideTrends: "Ocultar tendencias",
      runs: "Ejecuciones",
      runsSubtitle:
        "Haz clic en una barra para ver las ejecuciones de ese periodo",
      completed: "Completadas",
      failed: "Fallidas",
      other: "Otras",
      successRate: "Tasa de éxito",
      successRateSubtitle:
        "Completadas de las ejecuciones terminadas. Los días sin ejecuciones quedan vacíos.",
      duration: "Duración",
      durationSubtitle:
        "Mediana y p95 de ejecuciones completadas. Los días sin ejecuciones quedan vacíos.",
      durationSplitSubtitle:
        "Solo ejecuciones completadas. Los días sin ejecuciones quedan vacíos.",
      byTask: "Ejecuciones fallidas por tarea",
      byTaskSubtitle: "Top 5 tareas, el resto agrupado",
      otherTasks: "Otras tareas",
      p50: "Mediana",
      p95: "p95",
    },
    table: {
      title: "Por tarea",
      subtitle:
        "Las más urgentes primero. Haz clic en una tarea para ver su historial.",
      dimension: "Tarea",
      runs: "Ejecuciones",
      failures: "Fallidas",
      successRate: "Éxito",
      p50: "Mediana",
      lastRun: "Última",
      p95: "p95",
      trendCol: "Tendencia de éxito",
      state: "Estado",
      nextRun: "Próxima",
      orphaned: "ejecución huérfana, iniciada hace {{age}}",
      oneOff: "puntual",
      last: "Última {{status}} hace {{age}}",
      lastNever: "Nunca ejecutada",
      next: "próxima en {{age}}",
      nextNone: "sin próxima ejecución",
      runningTooLong: "lleva demasiado tiempo",
      skippedHint: "omitida: créditos insuficientes",
      failedCount: "{{count}} fallidas",
      lastLine: "Última: {{last}} · {{next}}",
      blocked: "bloqueada por la ejecución en curso",
      trend: "éxito",
      nextNow: "inminente",
      empty: "Ninguna tarea en este estado.",
    },
    filter: {
      showParked: "Mostrar tareas apartadas",
      hideParked: "Ocultar tareas apartadas",
      task: "Tarea",
      state: "Estado",
      allTasks: "Todas las tareas",
      includeDisabled: "Incluir desactivadas",
      scopeEnabled: "Solo tareas activas",
      scopeAll: "Desactivadas incluidas",
    },
    cli: {
      states: "Estados",
      state: "Estado",
      runId: "ejecución",
      trendHeader: "PERIODO | TERMINADAS | ÉXITO | MEDIANA | P95",
      attention: "REQUIERE ATENCIÓN",
      noAttention: "Requiere atención: nada",
      daysHint: "Tablas por día: --days=true",
      drillRunning:
        "Abrir la ejecución en curso: vibe cron-history --taskId={{id}} --status=status.running",
      byDay: "por día",
      runningOnTime: "En curso a tiempo",
      scope:
        "Métricas del periodo: solo tareas activas. Incluir desactivadas: --includeDisabled=true",
      parkedHidden:
        "{{count}} tareas aparcadas ocultas (puntuales terminadas, desactivadas sin ejecutar). Mostrarlas: --includeParked=true",
      recentRuns: "Últimas {{count}} ejecuciones",
      noRuns: "Sin ejecuciones registradas",
      tasks: "Tareas",
      header:
        "ESTADO | TAREA | EJECUCIONES | FALLIDAS | ÉXITO | MEDIANA | P95 | ÚLTIMA | PRÓXIMA",
      drill:
        "Detalle: vibe cron-history --taskId=<id> --status=status.failed,status.error,status.timeout",
    },
    age: {
      justNow: "ahora",
      seconds: "{{n}} s",
      minutes: "{{n}} min",
      hours: "{{n}} h",
      days: "{{n}} d",
    },
  },
};
