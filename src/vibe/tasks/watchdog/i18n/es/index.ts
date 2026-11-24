import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Task Watchdog",
  tags: {
    taskWatchdog: "task-watchdog",
    vibeSense: "vibe-sense",
    budget: "budget",
  },
  enums: {
    incidentType: {
      all: "Todos los incidentes",
      timeout: "Hora de salir",
      loop: "Loop",
      budget: "Económico",
      transientRetryExhausted: "Retries exhausted",
      watchdogCancel: "Cancelación de relojes",
    },
    budgetScope: {
      task: "Por tarea",
      day: "Por día (todas las tareas)",
      goal: "Por objetivo, por día",
    },
    spendKind: {
      model: "Vuelta modelo",
      tool: "Llamada de la herramienta",
    },
    healthMetric: {
      started: "Inicio de tareas",
      completed: "Tareas terminadas",
      failed: "Las tareas fracasaron",
      watchdogCancelled: "Tareas canceladas por watchdog",
      avgDuration: "Duración media (segundos)",
      p95Duration: "95a duración percentil (segundos)",
      creditSpend: "Créditos gastados por tareas",
      incidents: "Incidentes",
    },
  },
  sweep: {
    post: {
      title: "Revisión de tareas bloqueadas",
      titleShort: "Mirador Sweep",
      description:
        "Encuentra tareas de fondo atascadas, azotadas y huérfanas, las detiene con una razón grabada y abre un incidente. Corre cada minuto.",
      container: {
        title: "Resultado del sudor",
        description: "Lo que encontró el vigilante y lo hizo en este pase",
      },
      response: {
        checked: "Funciones de ejecución verificadas",
        cancelled: "Cancelado (sobre límite)",
        orphaned: "Hurfanas recuperadas",
        loops: "Tareas de aprendimiento discapacitados",
        incidents: "Incidentes abiertos",
      },
    },
    task: {
      description:
        "Detiene las tareas que tardan demasiado, entran en bucle o pierden su proceso. Registra un incidente por cada tarea detenida.",
    },
  },
  health: {
    get: {
      title: "Task Health",
      titleShort: "Task Health",
      description:
        "Ejecución de tareas con edad, turnos y gastos, fracasos recientes e incidentes abiertos. Cancela una tarea desde aquí.",
      response: {
        running: "Ejecución de tareas",
        failures: "Fallos recientes",
        incidents: "Incidentes abiertos",
        daySpent: "Créditos gastados hoy",
        dayCap: "Gorra diaria",
      },
      widget: {
        title: "Salud de la tarea",
        subtitle: "Cada carrera está vigilada. Los aturdidos se detienen.",
        refresh: "Actualizar",
        loading: "Salud de la tarea de carga...",
        spendToday: "{{spent}} de {{cap}} créditos gastados por tareas hoy",
        running: {
          title: "Correr ahora",
          empty: "Nada funcionando.",
        },
        failures: {
          title: "Fallos recientes",
          empty: "No hay fallos en las últimas 24 horas.",
        },
        incidents: {
          title: "Incidentes abiertos",
          empty: "No hay incidentes abiertos.",
        },
        age: "Edad",
        turns: "Turns",
        toolCalls: "Llamadas de herramientas",
        spend: "Gasto",
        goal: "Goal {{goal}}",
        limit: "límite {{limit}}",
        lastError: "Último error",
        noError: "No se registró ningún error",
        cancel: "Cancelar",
        cancelling: "Cancelando...",
        resolve: "Resolver",
        credits: "{{amount}} cr",
      },
    },
  },
  cancel: {
    post: {
      title: "Cancelar tarea",
      titleShort: "Cancelar tarea",
      description:
        "Detiene una tarea en ejecución (y su bucle AI) y registra la cancelación, o marca un incidente resuelto.",
      fields: {
        taskId: {
          label: "Task ID",
          description: "La tarea en marcha para detener",
          placeholder: "tarea id",
        },
        incidentId: {
          label: "Incident ID",
          description: "El incidente a marcar resuelto",
        },
      },
      response: {
        cancelled: "Cargo cancelado",
        resolved: "Incident resolved",
      },
    },
  },
  budgetCaps: {
    get: {
      title: "Caps de presupuesto de tareas",
      titleShort: "Caps de presupuesto",
      description:
        "Capas de crédito que detienen tareas de fondo: por tarea, por día y por objetivo.",
      response: {
        rows: "Caps",
        daySpent: "Créditos gastados hoy",
      },
      widget: {
        title: "Tapas del presupuesto de tareas",
        subtitle:
          "Una tarea que golpea una gorra se detiene limpiamente. La tapa diaria es el techo duro para todas las pistas sin tapizar.",
        refresh: "Actualizar",
        add: "Set cap",
        loading: "Carga de gorras...",
        empty: {
          title: "No hay conjunto de gorros",
          hint: "Defaults apply: 100 créditos por task run, 1000 per day, 500 per goal.",
          cta: "Establecer la primera capa",
        },
        spentToday: "Créditos {{spent}} gastados hoy",
        enabled: "Activa",
        disabled: "Desactivados",
        credits: "Créditos {{amount}}",
        none: "ninguno",
      },
    },
    post: {
      title: "Set Task Budget Cap",
      titleShort: "Set Cap",
      description:
        "Cree o actualice una tapa de crédito. Una gorra por alcance y llave. Una clave de tarea de * es el predeterminado para cada tarea.",
      fields: {
        scope: {
          label: "Ámbito",
          description: "¿Qué límite de gorra?",
        },
        key: {
          label: "Clave",
          description:
            "Tareas: tarea id o *. Día: mundial. Objetivo: nombre de gol o * (goal: <name> etiqueta en la tarea)",
          placeholder: "*",
        },
        maxCredits: {
          label: "Créditos máximos",
          description:
            "Pase en o por encima de esto detiene la tarea. 0 lo bloquea.",
        },
        enabled: {
          label: "Activa",
          description: "Fuera mantiene la fila, pero lo ignora",
        },
        note: {
          label: "Nota",
          description: "¿Por qué existe esta gorra?",
          placeholder: "Agentes de investigación nocturna",
        },
      },
      response: {
        id: "Cap ID",
      },
      widget: {
        back: "Atrás",
        hint: "Un gorro detiene la tarea cuando el gasto lo alcanza. La tapa diaria siempre se aplica.",
      },
    },
  },
  dataSources: {
    fields: {
      resolution: { label: "Resolución", description: "Tamaño del cubo" },
      range: {
        label: "Rango",
        description: "Rango de tiempo para la consulta",
      },
      lookback: {
        label: "Mira atrás.",
        description: "Barras extra antes de empezar el rango",
      },
      meta: { label: "Meta", description: "Metadatos de ejecución de nodos" },
      metric: {
        label: "métrica",
        description:
          "Las tareas comenzaron, completaron, fracasaron, se recortaron, duraron, pasaron el crédito o incidentes",
      },
      incidentType: {
        label: "Tipo de incidente",
        description:
          "Sólo para los incidentes métricos. Todos los tipos por defecto",
      },
    },
    taskHealth: {
      post: {
        title: "Task Health",
        titleShort: "Task Health",
        description:
          "Funciones de tarea de fondo, duración, gasto de crédito y incidentes de vigilancia por cubo",
        fields: {
          result: { label: "Valor", description: "Valor métrico por cubo" },
        },
      },
    },
  },
  errors: {
    validation: {
      title: "Entrada inválida",
      description: "Revise los campos marcados",
    },
    unauthorized: {
      title: "No está firmado",
      description: "Inicie sesión como administrador",
    },
    forbidden: {
      title: "Admins only",
      description:
        "Las herramientas de relojería de tareas necesitan el papel de administrador",
    },
    notFound: {
      title: "Cuenta o sesión no encontradas",
      description: "Esa tarea o incidente no existe",
    },
    conflict: {
      title: "Conflicto",
      description: "La entrada cambió mientras tanto, recargar y reiniciar",
    },
    server: {
      title: "Error del servidor",
      description: "No se puede completar la solicitud",
    },
    network: {
      title: "Error de red",
      description: "La solicitud no llegó al servidor",
    },
    unknown: {
      title: "Error desconocido",
      description: "Algo inesperado falló",
    },
    unsavedChanges: {
      title: "Cambios sin guardar",
      description: "Guardar o descartar sus cambios primero",
    },
    nothingToDo:
      "Pase una tarea id para cancelar o un incidente id para resolver",
    taskNotRunning: "La tarea {{taskId}} no está funcionando",
    incidentNotFound: "Incident {{incidentId}} no existe",
    invalidCap: "Una tapa necesita una cantidad no negativa y una clave",
  },
  success: {
    title: "Listo",
    description: "Guardado",
  },
};
