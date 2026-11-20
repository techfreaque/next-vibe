import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Gestión de tareas",

  description: "Ejecuta tareas de fondo y gestiona tareas paralelas",
  common: {
    taskName: "Nombre de la tarea",
    taskNamesDescription: "Nombres de tareas para filtrar",
    detailed: "Detalle",
    detailedDescription: "Incluir información detallada",
    active: "Activa",
    total: "Total",
    uptime: "Horas de actualización",
    id: "ID",
    status: "Situación",
    lastRun: "Última carrera",
    nextRun: "Next Run",
    schedule: "Horario",
  },
  post: {
    title: "Unified Task Runner",
    titleShort: "Task Runner",
    description:
      "Gestionar unificador de tareas para tareas de fondo y tareas paralelas",
    container: {
      title: "Unified Task Runner Management",
      description:
        "Controla el corredor de tareas unificado que gestiona tanto las tareas de fondo como las tareas laterales",
    },
    fields: {
      action: {
        label: "Medida",
        description: "Acción para realizar en el corredor de tareas",
        options: {
          start: "Start Runner",
          stop: "Stop Runner",
          status: "Estado civil",
          restart: "Restart Runner",
        },
      },
      taskFilter: {
        label: "Filtro de tareas",
        description: "Funciones de filtro por tipo",
        options: {
          all: "Todas las tareas",
          cron: "Cron Tasks Only",
          side: "Tareas secundarias solamente",
        },
      },
      dryRun: {
        label: "Dry Run",
        description: "Realizar una carrera seca sin hacer cambios reales",
      },
    },
    response: {
      success: "Operación Éxito",
      actionResult: "Resultado de la acción",
      message: "Mensaje de respuesta",
      timestamp: "Timestamp",
    },
    reasons: {
      previousInstanceRunning: "La instancia anterior sigue funcionando",
    },
    messages: {
      taskSkipped: "La tarea se saltó",
      taskCompleted: "Tareas terminadas con éxito",
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      validation: {
        title: "Error de validación",
        description: "Parámetros de solicitud no válidos",
      },
      internal: {
        title: "Error interno",
        description: "Ocurrió un error interno del servidor",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
      network: {
        title: "Error de red",
        description: "Ocurrió un error de red",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes acceso",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso",
      },
      conflict: {
        title: "Conflicto",
        description: "Hay un conflicto entre los datos",
      },
      unsaved: {
        title: "Cambios sin guardar",
        description: "Hay cambios sin salvar",
      },
      execution: {
        title: "Error de ejecución de tareas",
        description: "Fallado para ejecutar la tarea",
      },
      taskAlreadyRunning: {
        title: "La tarea ya está funcionando",
        description: "La tarea especificada ya está funcionando",
      },
      sideTaskExecution: {
        title: "Error de ejecución lateral",
        description: "Fallado para ejecutar tareas paralelas",
      },
    },
    success: {
      title: "Operación completada",
      description: "La operación se completó correctamente",
    },
  },
};
