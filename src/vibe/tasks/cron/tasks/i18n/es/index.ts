import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  priority: {
    critical: "Crítica",
    high: "Alto",
    medium: "Mediana",
    low: "Baja",
    background: "Antecedentes"
  },
  taskCategory: {
    development: "Desarrollo",
    build: "Compilación",
    watch: "Mira.",
    generator: "Generador",
    test: "Test",
    maintenance: "Mantenimiento",
    database: "Base de datos",
    system: "Sistema",
    monitoring: "Monitoreo",
    leadManagement: "Gestión de contactos"
  },
  status: {
    pending: "Pendiente",
    running: "Corriendo",
    completed: "Completado",
    failed: "Failed",
    timeout: "Hora de salir",
    cancelled: "Cancelada",
    skipped: "Saltó.",
    blocked: "Bloqueados",
    scheduled: "Programado",
    stopped: "Detenido.",
    error: "Error"
  },
  hiddenFilter: {
    visible: "Visible",
    hidden: "Oculto",
    all: "Todos"
  },
  enabledFilter: {
    all: "Todos",
    enabled: "Enabled",
    disabled: "Discapacitados"
  },
  outputMode: {
    storeOnly: "Almacén",
    notifyOnFailure: "Notificar sobre el fracaso",
    notifyAlways: "Notificar siempre"
  },
  category: "API Endpoint",
  tags: {
    tasks: "Tareas",
    cron: "Cron",
    scheduling: "Programación"
  },
  errors: {
    fetchCronTasks: "Failed para buscar tareas de cron",
    createCronTask: "Failed to create cron task",
    invalidTaskInput: "La entrada de la tarea no coincide con el esquema de solicitud del endpoint",
    endpointNotFound: "Punto final no encontrado para la ruta dada ID",
    targetInstanceForbidden: "Sólo los administradores pueden establecer la instancia de destino para tareas"
  },
  list: {
    columns: {
      createdAt: "Creado en",
      updatedAt: "Actualizado en"
    }
  },
  get: {
    title: "List Cron Tasks",
    titleShort: "Tareas cron",
    description: "Recuperar una lista de tareas de cron con filtro opcional",
    container: {
      title: "Lista de tareas de hierro",
      description: "Funciones de filtro y vista cron"
    },
    fields: {
      status: {
        label: "Situación",
        description: "Filtro por estado de tarea",
        placeholder: "Seleccione el estado..."
      },
      priority: {
        label: "Prioridad",
        description: "Filtro por prioridad de tarea",
        placeholder: "Seleccione prioridad..."
      },
      category: {
        label: "Categoría",
        description: "Filtro por categoría de tarea",
        placeholder: "Seleccione la categoría..."
      },
      enabled: {
        label: "Situación",
        description: "Filtro por estado habilitado",
        placeholder: "Todas las tareas"
      },
      hidden: {
        label: "Visibilidad",
        description: "Filtro por estado oculto (por defecto: sólo visible)",
        placeholder: "Tareas visibles"
      },
      search: {
        label: "Buscar",
        description: "Filtrar tareas por nombre, ruta, descripción o categoría",
        placeholder: "Tareas de búsqueda..."
      },
      sort: {
        label: "Más o menos.",
        description: "Ordenar por la lista de tareas"
      },
      limit: {
        label: "Limitación",
        description: "Número máximo de tareas para regresar"
      },
      offset: {
        label: "Offset",
        description: "Número de tareas para saltar"
      }
    },
    response: {
      tasks: {
        title: "Tareas"
      },
      task: {
        title: "Tareas",
        description: "Información individual sobre tareas",
        id: "Task ID",
        shortId: "ID corto",
        routeId: "Ruta ID",
        name: "Nombre de la tarea",
        displayName: "Nombre",
        taskDescription: "Descripción",
        schedule: "Horario",
        enabled: "Enabled",
        hidden: "Oculto",
        priority: "Prioridad",
        status: "Situación",
        category: "Categoría",
        lastRun: "Última carrera",
        nextRun: "Next Run",
        version: "Version",
        timezone: "Zona horaria",
        timeout: "Hora de salida (ms)",
        retries: "Retries",
        retryDelay: "Retry Delay (ms)",
        taskInput: "Task Input",
        runOnce: "Corre una vez.",
        outputMode: "Modo de salida",
        owner: "Propietario",
        notificationTargets: "Metas de notificación",
        lastExecutedAt: "Ultima ejecución en",
        lastExecutionStatus: "Estado de ejecución anterior",
        lastExecutionError: "Último error de ejecución",
        lastExecutionDuration: "Última ejecución Duración (ms)",
        nextExecutionAt: "Siguiente ejecución en",
        executionCount: "Conde de ejecución",
        consecutiveFailures: "Failures consecutivos",
        successCount: "Cuenta de éxito",
        errorCount: "Cuenta de error",
        averageExecutionTime: "Tiempo medio de ejecución (ms)",
        targetInstance: "Instance por objetivos",
        tags: "Tags",
        createdAt: "Creado en",
        updatedAt: "Actualizado en"
      },
      totalTasks: "Total de tareas"
    },
    errors: {
      internal: {
        title: "Error del servidor interno ocurrió mientras que tareas de recuperación",
        description: "Se produjo un error inesperado al buscar la lista de tareas"
      },
      unauthorized: {
        title: "Acceso no autorizado a la lista de tareas",
        description: "Usted no tiene permiso para ver la lista de tareas"
      },
      validation: {
        title: "Parámetros de solicitud no válidos",
        description: "Los parámetros de solicitud proporcionados son inválidos"
      },
      forbidden: {
        title: "No tienes acceso",
        description: "Se prohíbe el acceso a este recurso."
      },
      notFound: {
        title: "Tareas no encontradas",
        description: "No se encontraron tareas que coincidan con los criterios"
      },
      network: {
        title: "Error de red",
        description: "Se produjo un error de red mientras se retriegan tareas"
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido"
      },
      unsaved: {
        title: "Cambios sin guardar",
        description: "Hay cambios insalvables que deben abordarse"
      },
      conflict: {
        title: "Error de conflicto",
        description: "Se produjo un conflicto al tramitar la solicitud"
      }
    },
    success: {
      retrieved: {
        title: "Tareas recuperadas con éxito",
        description: "La lista de tareas se ha recuperado con éxito"
      }
    }
  },
  post: {
    title: "Crear tarea de hierro",
    titleShort: "Crear tarea",
    description: "Crear una nueva tarea de cron",
    container: {
      title: "Crear tarea",
      description: "Configurar una nueva tarea de cron"
    },
    fields: {
      id: {
        label: "Task ID",
        description: "Identificador único y estable para esta tarea (por ejemplo, 'db-salud')",
        placeholder: "Ingrese la tarea ID..."
      },
      routeId: {
        label: "Ruta ID",
        description: "Identificador de Handler: nombre de tarea, alias de endpoint o 'cron-steps'",
        placeholder: "Ingrese la ruta ID..."
      },
      displayName: {
        label: "Nombre de pantalla",
        description: "Etiquetas legibles para esta tarea",
        placeholder: "Introduzca el nombre de la pantalla..."
      },
      outputMode: {
        label: "Modo de salida",
        description: "Cuándo enviar notificaciones después de la ejecución",
        placeholder: "Seleccione el modo de salida..."
      },
      description: {
        label: "Descripción",
        description: "Descripción de la tarea",
        placeholder: "Introduzca la descripción..."
      },
      schedule: {
        label: "Horario",
        description: "Expresión del horario de Cron",
        placeholder: "*/5 * * * *"
      },
      priority: {
        label: "Prioridad",
        description: "Nivel de prioridad de la tarea"
      },
      category: {
        label: "Categoría",
        description: "Categoría de tareas"
      },
      enabled: {
        label: "Enabled",
        description: "Habilitar o desactivar la tarea"
      },
      hidden: {
        label: "Oculto",
        description: "Ocultar esta tarea desde los avisos del sistema AI y los listados de tareas predeterminados"
      },
      timeout: {
        label: "Hora de salida (ms)",
        description: "Tiempo máximo de ejecución en milisegundos"
      },
      retries: {
        label: "Retries",
        description: "Número de intentos de reingreso"
      },
      retryDelay: {
        label: "Retry Delay (ms)",
        description: "Dilatación entre los camiones en milisegundos"
      },
      taskInput: {
        label: "Task Input",
        description: "Datos de entrada JSON para la tarea",
        placeholder: "{ \"dryRun\": false }",
        invalidJson: "No es válido JSON. Compruebe las cotizaciones, comas y corchetes.",
        notObject: "La entrada de tareas debe ser un objeto JSON, como { \"key\": \"value\" }."
      },
      runOnce: {
        label: "Corre una vez.",
        description: "Ejecutar esta tarea sólo una vez y luego desactivarla"
      },
      targetInstance: {
        label: "Instance por objetivos",
        description: "Instance ID esta tarea debe ejecutarse (por ejemplo, 'hermes', 'thea-prod'). Deja vacío para correr sólo en la instancia de acogida.",
        placeholder: "Deja vacío para el anfitrión sólo"
      }
    },
    response: {
      task: {
        title: "Tareas creadas",
        id: "Task ID",
        shortId: "ID corto",
        routeId: "Ruta ID",
        displayName: "Nombre",
        taskDescription: "Descripción",
        version: "Version",
        category: "Categoría",
        schedule: "Horario",
        timezone: "Zona horaria",
        enabled: "Enabled",
        hidden: "Oculto",
        priority: "Prioridad",
        timeout: "Hora de salida (ms)",
        retries: "Retries",
        retryDelay: "Retry Delay (ms)",
        taskInput: "Task Input",
        runOnce: "Corre una vez.",
        outputMode: "Modo de salida",
        notificationTargets: "Metas de notificación",
        lastExecutedAt: "Ultima ejecución en",
        lastExecutionStatus: "Estado de ejecución anterior",
        lastExecutionError: "Último error de ejecución",
        lastExecutionDuration: "Última ejecución Duración (ms)",
        nextExecutionAt: "Siguiente ejecución en",
        executionCount: "Conde de ejecución",
        successCount: "Cuenta de éxito",
        errorCount: "Cuenta de error",
        averageExecutionTime: "Tiempo medio de ejecución (ms)",
        consecutiveFailures: "Failures consecutivos",
        targetInstance: "Instance por objetivos",
        tags: "Tags",
        owner: "Propietario",
        createdAt: "Creado en",
        updatedAt: "Actualizado en"
      }
    },
    errors: {
      validation: {
        title: "Falló la validación",
        description: "Los datos de la tarea proporcionada son inválidos"
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Usted no tiene permiso para crear tareas"
      },
      internal: {
        title: "Error interno",
        description: "Se produjo un error al crear la tarea"
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Se prohíbe el acceso a este recurso."
      },
      conflict: {
        title: "Conflicto",
        description: "Una tarea con este nombre ya existe"
      },
      network: {
        title: "Error de red",
        description: "Se produjo un error de red"
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido"
      },
      notFound: {
        title: "Cuenta o sesión no encontradas",
        description: "No se encontró el recurso solicitado"
      },
      unsaved: {
        title: "Cambios sin guardar",
        description: "Hay cambios sin salvar"
      }
    },
    success: {
      created: {
        title: "Tareas creadas",
        description: "La tarea se ha creado con éxito"
      }
    }
  },
  widget: {
    title: "Tareas cron",
    loading: "Carga de tareas...",
    header: {
      stats: "Stats",
      graphs: "Gráficos",
      history: "Historia",
      queue: "Cola",
      refresh: "Actualizar",
      create: "Nueva tarea"
    },
    filter: {
      all: "Todos",
      running: "Corriendo",
      completed: "Completado",
      failed: "Failed",
      pending: "Pendiente",
      disabled: "Discapacitados",
      allPriorities: "Todas las prioridades",
      allCategories: "Todas las Categorías",
      visible: "Visible",
      hiddenOnly: "Oculto",
      allTasks: "Todas las tareas"
    },
    search: {
      placeholder: "Tareas de búsqueda..."
    },
    sort: {
      nameAsc: "Nombre A-Z",
      nameDesc: "Nombre Z-A",
      schedule: "Horario",
      lastRunNewest: "Última carrera (no oeste)",
      executionsMost: "La mayoría de las ejecuciones"
    },
    task: {
      executions: "Ejecuciónes:",
      lastRun: "Última carrera:",
      never: "Nunca.",
      nextRun: "Siguiente carrera:",
      notScheduled: "No está programado",
      routeId: "Ruta ID",
      hiddenBadge: "Oculto",
      owner: {
        system: "Sistema",
        user: "Usuario"
      },
      outputMode: {
        storeOnly: "Almacén",
        notifyOnFailure: "Notificar sobre el fracaso",
        notifyAlways: "Notificar siempre"
      }
    },
    action: {
      view: "Ver detalles",
      history: "Ver historia",
      edit: "Edición de la tarea",
      delete: "Suprimir la tarea",
      runNow: "Corre ahora."
    },
    bulk: {
      selected: "{count} seleccionado",
      selectAll: "Seleccionar esta página",
      clearSelection: "Selección clara",
      enable: "Habilitación",
      disable: "Inhabilitación",
      runNow: "Ejecutar ahora",
      delete: "Eliminar",
      confirmDeleteTitle: "¿Supir tareas?",
      confirmDelete: "Eliminar tareas {count}(s)? Esto no puede ser deshecho.",
      cancel: "Cancelar",
      success: "Ejecuciones completadas: {succeeded}. Fallidas: {failed}."
    },
    empty: {
      noTasks: "No hay tareas de cron",
      noTasksDesc: "Crea tu primera tarea de cron para empezar",
      noMatches: "No hay tareas que coincidan con sus filtros",
      noMatchesDesc: "Intente ajustar sus criterios de búsqueda o filtro",
      clearFilters: "Filtros claros"
    },
    create: {
      created: "Tareas creadas",
      route: "Route",
      schedule: "Horario",
      nextRun: "Siguiente carrera",
      notScheduled: "No está programado",
      owner: "Propietario",
      ownerSystem: "Sistema",
      ownerYou: "Tú.",
      ownerUser: "Usuario {{id}}",
      enabled: "Enabled",
      disabled: "Discapacitados",
      taskInput: "Insumo de tareas",
      noInput: "No hay entrada - la ruta se ejecuta con sus defectos.",
      openTask: "Tareas abiertas"
    }
  }
};
