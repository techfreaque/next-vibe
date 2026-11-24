import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Índice de referencia",
  tags: {
    refusalIndex: "Índice de referencia",
  },

  enums: {
    runStatus: {
      running: "Corriendo",
      completed: "Completado",
      failed: "Failed",
      cancelled: "Cancelada",
    },
    verdict: {
      answered: "Respuestas",
      hedged: "Hedged",
      refused: "Refiriéndose",
      error: "Error",
    },
  },

  errors: {
    validation: {
      title: "Error de validación",
      description: "La solicitud es nula",
    },
    network: { title: "Error de red", description: "La conexión falló" },
    unauthorized: {
      title: "Se requiere autenticación",
      description: "Acceso de los administradores necesario",
    },
    forbidden: {
      title: "Acceso denegado",
      description: "Acceso de los administradores necesario",
    },
    notFound: { title: "No encontrado", description: "Nada encontrado" },
    server: {
      title: "Error del servidor",
      description: "La solicitud del índice de referencia falló",
    },
    unknown: {
      title: "Error desconocido",
      description: "Ocurrió un error inesperado",
    },
    unsavedChanges: {
      title: "Cambios sin guardar",
      description: "Tienes cambios sin guardar",
    },
    conflict: {
      title: "Conflicto",
      description: "Hay un conflicto entre los datos",
    },
  },
  success: {
    title: "Listo",
    description: "Solicitud del índice de referencia terminada",
  },

  messages: {
    judgeUnparseable: "El modelo del juez no devolvió ningún veredicto usable.",
    dryRunStatus: "Corrección seca",
    slugTaken: "Ya existe una pregunta con la bala ' {{slug}}'.",
    questionNotFound: "Pregunta no encontrada.",
    questionInUse:
      "Esta pregunta tiene resultados en pasadas carreras. Desactivarlo en lugar de borrarlo.",
    runNotFound: "No se encuentra.",
    runAlreadyActive:
      "Run {{id}} ya está en progreso. Retire o espere a que termine.",
    resultNotFound: "Resultado no encontrado.",
    errorNotPublishable:
      "Los resultados de error no pueden publicarse como muestras.",
    unknownQuestions: "Desconocida pregunta slugs: {{slugs}}.",
    unknownModels: "Modelos desconocidos o no marcados: {{ids}}.",
    noQuestions:
      "No hay preguntas activas. Agregue primero preguntas (preguntas de índice refusivo) - el conjunto de preguntas es gestionado por los administradores.",
    noModels: "No hay modelos de referencia que coincidan con el filtro.",
    dryRun:
      "Simulación: no se envió ninguna solicitud. Límite de gasto para una ejecución real: {{budget}} créditos.",
    dryRunResume:
      "Corriente seca: mostrar lo que el curriculum vitae todavía procesaría.",
    started: "Empieza la carrera. Continúa en el fondo.",
    resumed: "Reanuda la carrera. Continúa en el fondo.",
    finishedWaiting: "La carrera terminó. Estado final arriba.",
    generationFailed:
      "El generador de preguntas no devolvió nada usable ({{error}}).",
    nothingPending: "Nada que hacer: cada par ya tiene una respuesta.",
  },

  fields: {
    limit: { label: "Limitación", description: "Máximas filas para regresar" },
    offset: { label: "Offset", description: "Filas para saltar" },
    back: { label: "Atrás" },
  },

  questions: {
    fields: {
      id: { label: "Pregunta ID", description: "ID de la pregunta" },
      slug: {
        label: "Slug",
        description: "Corto id único, minúscula con",
      },
      category: {
        label: "Categoría",
        description:
          "Grupo de forma gratuita, por ejemplo 'medicina' - las categorías son datos",
      },
      textEn: {
        label: "Pregunta (en inglés)",
        description: "El aviso exacto enviado a cada modelo",
      },
      textDe: {
        label: "Cuestión (alemán)",
        description:
          "Traducción que se muestra en los ejemplos públicos (opcional)",
      },
      textPl: {
        label: "Cuestión (Política)",
        description:
          "Traducción que se muestra en los ejemplos públicos (opcional)",
      },
      textFr: {
        label: "Pregunta (francés)",
        description:
          "Traducción que se muestra en los ejemplos públicos (opcional)",
      },
      textIt: {
        label: "Pregunta (italiano)",
        description:
          "Traducción que se muestra en los ejemplos públicos (opcional)",
      },
      textEs: {
        label: "Pregunta (español)",
        description:
          "Traducción que se muestra en los ejemplos públicos (opcional)",
      },
      generatedBy: { label: "Propuestas" },
      active: {
        label: "Activa",
        description: "Sólo se utilizan preguntas activas en nuevas carreras",
      },
    },
    widget: {
      add: "Añádase la pregunta",
      loading: "Cargando preguntas...",
      active: "Activa",
      inactive: "Inactivo",
      generated: "Generado",
      empty: {
        title: "Aún no hay preguntas.",
        hint: "El índice mide cómo responden los modelos YOUR conjunto de preguntas. Agregue preguntas antes de la primera carrera.",
        cta: "Añada la primera pregunta",
      },
    },
    get: {
      title: "Preguntas del índice de referencia",
      titleShort: "Preguntas",
      description:
        "El conjunto de preguntas corregidas por administración enviado a cada modelo. Agregue preguntas aquí antes de la primera carrera.",
      fields: {
        status: {
          label: "Situación",
          description: "Filtro por estado activo",
          all: "Todos",
          active: "Activa",
          inactive: "Inactivo",
        },
        category: {
          label: "Categoría",
          description: "Sólo preguntas en esta categoría",
        },
      },
    },
    post: {
      title: "Add Refusal Index Question",
      titleShort: "Add Question",
      description: "Añádase una pregunta al conjunto de parámetros",
      submit: "Añádase la pregunta",
      submitting: "Añadiendo...",
      response: { id: "Pregunta ID" },
    },
    patch: {
      title: "Editar el índice de referencia Pregunta",
      titleShort: "Edición de la pregunta",
      description: "Editar o (de)activar una pregunta",
      submit: "Guardar",
      submitting: "Salvando...",
      clearHint: "Deja vacío para limpiar la traducción",
    },
    delete: {
      title: "Eliminar la cuestión del índice de referencia",
      titleShort: "Suprímase la cuestión",
      description:
        "Eliminar una pregunta que nunca se usó en una carrera (utilizados: desactivar)",
      submit: "Suprímase la cuestión",
      submitting: "Eliminar...",
      response: { deleted: "Suprimidos" },
    },
  },

  runs: {
    fields: {
      id: { label: "Corre ID", description: "ID de la carrera" },
      status: { label: "Situación" },
      startedAt: { label: "Comienzo" },
      finishedAt: { label: "Terminado" },
      modelCount: { label: "Modelos" },
      questionCount: { label: "Preguntas" },
      pairCount: { label: "Parejas para responder" },
      questionsRequested: { label: "Nuevas preguntas solicitadas" },
      questionsGenerated: { label: "Nuevas preguntas" },
      resultCount: { label: "Resultados" },
      totalCost: { label: "Créditos gastados" },
      budgetCredits: { label: "Límite de gasto" },
      judgeModelId: { label: "Modelo del juez" },
      judgePromptVersion: { label: "Fallo inmediato" },
      cancelReason: { label: "Deja de razonar." },
      notes: { label: "Notas" },
    },
    widget: {
      start: "Comienzo de la carrera",
      manageQuestions: "Administrar preguntas",
      resume: "Resumen",
      newQuestions: "{{generated}} / {{requested}} nuevas preguntas",
      open: "Resultados",
      results: "resultados",
      credits: "Créditos",
      noQuestions: {
        title: "Agregar preguntas primero",
        hint: "Una carrera necesita al menos una pregunta activa. Añadirlos en la lista de preguntas.",
      },
      empty: {
        title: "Todavía no hay carreras.",
        hint: "Comience una ejecución, o active la tarea semanal de cron (desactivada por defecto).",
      },
    },
    get: {
      title: "Ejecuciones del índice de referencia",
      titleShort: "Corresponde",
      description: "Corres de Benchmark, el primero más nuevo",
      response: {
        activeQuestionCount: "Preguntas activas",
        benchmarkModelCount: "Modelos de referencia",
      },
    },
  },

  start: {
    title: "Start Refusal Index Run",
    titleShort: "Start Run",
    description:
      "Agregue nuevas preguntas de un generador sin censura, luego haga cada modelo cada pregunta que no ha respondido todavía y juzgar la respuesta. Las respuestas se guardan: no se pide nada dos veces. Presupuesto y resumible.",
    submit: "Comienzo",
    submitting: "Comenzando...",
    cron: {
      name: "Índice de negativas (semanal)",
      description:
        "Cada semana añade 10 preguntas y recopila las respuestas pendientes, incluidas las de los modelos nuevos. Está desactivado por defecto.",
    },
    fields: {
      models: {
        label: "Modelos",
        description:
          "Modelos separados por comma (vacíos = todos los modelos actuales)",
      },
      questions: {
        label: "Preguntas",
        description:
          "Pegajos de preguntas separadas por el comma (vacío = todos activos)",
      },
      newQuestions: {
        label: "Nuevas preguntas",
        description:
          "Preguntas que el generador no censurado añade antes del relleno (0-30)",
      },
      budgetCredits: {
        label: "Presupuesto (créditos)",
        description:
          "La carrera se detiene limpiamente (estatua cancelada) cuando se alcanza",
      },
      concurrency: {
        label: "Concurrencia",
        description: "Llamadas modelo paralelo (por defecto 4, max 16)",
      },
      dryRun: {
        label: "Corrección seca",
        description: "Plan y estimación solamente, no enviar nada",
      },
      resumeRunId: {
        label: "Resume run",
        description: "Continúe con los pares perdidos de una carrera anterior",
      },
      wait: {
        label: "Espera.",
        description: "Sostenga la solicitud hasta que termine la carrera",
      },
      notes: {
        label: "Notas",
        description: "Nota de texto libre para esta carrera",
      },
    },
    response: {
      runId: "Corre ID",
      status: "Situación",
      dryRun: "Corrección seca",
      modelCount: "Modelos",
      questionCount: "Preguntas",
      newQuestionCount: "Nuevas preguntas",
      pendingPairs: "Parejas para procesar",
      estimatedCredits: "Créditos estimados",
      note: "Nota",
    },
  },

  runDetail: {
    title: "Ejecución del índice de referencia",
    titleShort: "Corre",
    description:
      "Una carrera con sus resultados. Filtrar por modelo, categoría o veredicto; aprobar muestras públicas.",
    fields: {
      model: { label: "Modelo", description: "Filtro por id modelo" },
      category: { label: "Categoría", description: "Filtro por categoría" },
      verdict: {
        label: "Vered",
        description: "Filtro por veredicto",
        all: "Todos",
      },
      modelId: { label: "Modelo ID" },
      modelName: { label: "Modelo" },
      tier: { label: "Tier" },
      questionSlug: { label: "Pregunta" },
      categoryCol: { label: "Categoría" },
      questionText: { label: "Prompt" },
      verdictCol: { label: "Vered" },
      judgeReason: { label: "Sentencia" },
      answerExcerpt: { label: "Respuesta" },
      latencyMs: { label: "Latency (ms)" },
      cost: { label: "Créditos" },
      sampleVisible: { label: "Muestra pública" },
    },
    widget: {
      loading: "Carga de correr...",
      empty: "No hay resultados que coincidan con estos filtros.",
      credits: "Créditos",
      approve: "Muestra de Publish",
      hide: "Ocultar la muestra",
    },
  },

  samples: {
    title: "Apruebe el índice de referencia",
    titleShort: "Muestra",
    description:
      "Publique (o esconda) un resultado como una respuesta de muestra pública. Nada es público sin aprobación.",
    submit: "Aplicar",
    submitting: "Aplicando...",
    fields: {
      resultId: {
        label: "Resultado ID",
        description: "El resultado es publicar",
      },
      visible: {
        label: "Visible",
        description: "En = público en la página modelo, apagado = oculto",
      },
    },
    response: { visible: "Visible" },
  },

  leaderboard: {
    title: "Líder de índice de referencia",
    titleShort: "Índice de referencia",
    description:
      "Cuán a menudo cada modelo AI responde, secuestra o rechaza. Actualizado semanalmente con nuevas preguntas.",
    response: { overall: "En general" },
  },

  model: {
    title: "Modelo Estatuillas refusales",
    titleShort: "Modelo Stats",
    description:
      "El índice de rechazo, cobertura y respuesta de un modelo en todas las preguntas actuales, además de respuestas de muestra aprobadas.",
    fields: {
      modelId: {
        label: "Modelo",
        description: "Slug modelo id o URL",
      },
    },
  },

  public: {
    fields: {
      judged: { label: "Respuestas juzgadas" },
      answeredPct: { label: "Respuestas %" },
      hedgedPct: { label: "Hedged %" },
      refusedPct: { label: "Porcentaje de referencia" },
      category: { label: "Categoría" },
      hasData: { label: "Tiene datos" },
      runFinishedAt: { label: "Última actualización" },
      modelCount: { label: "Modelos" },
      questionCount: { label: "Preguntas" },
      judgeModelId: { label: "Modelo de juez ID" },
      judgeModelName: { label: "Modelo del juez" },
      judgePromptVersion: { label: "Versión rápida del juez" },
      modelId: { label: "Modelo ID" },
      name: { label: "Nombre" },
      tier: { label: "Tier" },
      trend: { label: "Tendencia de referencia (puntos)" },
      rank: { label: "Rank (1 = menor rechazo)" },
      rankedModels: { label: "Modelos de clasificación" },
      question: { label: "Pregunta" },
      verdict: { label: "Vered" },
      answer: { label: "Respuesta" },
      judgeReason: { label: "Sentencia" },
    },
  },
};
