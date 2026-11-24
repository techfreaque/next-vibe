import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Gestión de servidores",

  tag: "Salud",
  get: {
    title: "Control de salud",
    titleShort: "Control de salud",
    description: "Obtenga el estado de salud del servidor y los diagnósticos",
    form: {
      title: "Opciones de control de salud",
      description: "Configurar los parámetros de control de salud",
    },
    fields: {
      detailed: {
        title: "Informe detallado",
        description: "Incluir información detallada del sistema",
      },
      includeDatabase: {
        title: "Incluir bases de datos",
        description: "Incluye cheques de salud de la base de datos",
      },
      includeTasks: {
        title: "Incluir tareas",
        description: "Incluye cheques de salud para corredores de tareas",
      },
      includeSystem: {
        title: "Incluido el sistema",
        description: "Incluir información sobre los recursos del sistema",
      },
    },
    response: {
      status: {
        title: "Situación",
        description: "Situación general de la salud",
      },
      timestamp: {
        title: "Timestamp",
        description: "Hora de la comprobación de salud",
      },
      uptime: {
        title: "Horas de actualización",
        description: "Tiempo de actualización del servidor en segundos",
      },
      revision: {
        title: "Commit de compilación",
      },
      environment: {
        title: "para el Medio Ambiente",
        description: "Información sobre el medio ambiente del servidor",
        name: {
          title: "Environment Name",
        },
        nodeEnv: {
          title: "Node Environment",
        },
        platform: {
          title: "Plataforma",
        },
        supportsTaskRunners: {
          title: "Soporta a los corredores de tareas",
        },
      },
      database: {
        title: "Estado de la base de datos",
        description: "Estado de conexión de bases de datos",
        status: {
          title: "Estado de conexión",
        },
        responseTime: {
          title: "Tiempo de respuesta (ms)",
        },
        error: {
          title: "Mensaje de error",
        },
      },
      tasks: {
        title: "Estado de la tarea",
        description: "Estado del corredor de tareas",
        runnerStatus: {
          title: "Runner Status",
        },
        activeTasks: {
          title: "Tareas activas",
        },
        totalTasks: {
          title: "Total de tareas",
        },
        errors: {
          title: "Cuenta de error",
        },
        lastError: {
          title: "Último error",
        },
      },
      system: {
        title: "Información del sistema",
        description: "Información sobre los recursos del sistema",
        memory: {
          title: "Uso de la memoria",
          description: "Información de memoria del sistema",
          used: {
            title: "Memoria de uso usado",
          },
          total: {
            title: "Total Memory",
          },
          percentage: {
            title: "Uso de la memoria %",
          },
        },
        cpu: {
          title: "CPU Usage",
          description: "Sistema CPU",
          usage: {
            title: "Uso de CPU %",
          },
          loadAverage: {
            title: "Promedio de carga",
          },
        },
        disk: {
          title: "Disk Usage",
          description: "Información del disco del sistema",
          available: {
            title: "Espacio disponible",
          },
          total: {
            title: "Total del espacio",
          },
          percentage: {
            title: "Uso de discos %",
          },
        },
      },
      checks: {
        title: "Controles de salud",
        description: "Comprobaciones de salud individuales del componente",
        item: {
          title: "Control de salud",
          description: "Resultado de comprobación de salud individual",
          name: {
            title: "Nombre del cheque",
          },
          status: {
            title: "Estado de control",
          },
          message: {
            title: "Mensaje",
          },
          duration: {
            title: "Duración ms)",
          },
        },
      },
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
      server: {
        title: "Error del servidor",
        description: "Ocurrió un error interno del servidor",
        checkFailed: "Error de comprobación de salud: {{error}}",
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
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Hay cambios sin salvar",
      },
    },
    success: {
      title: "Operación completada",
      description: "Comprobación de salud terminada con éxito",
    },
  },
};
