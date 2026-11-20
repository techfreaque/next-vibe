import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Usuarios",

  post: {
    title: "Sesión de limpieza",
    titleShort: "Sesiones limpias",
    description: "Limpiar las sesiones y fichas de usuario caducadas",
    tag: "Sesión de limpieza",
    container: {
      title: "Sesión de limpieza",
      description: "Configurar y ejecutar la limpieza de sesión",
    },
    fields: {
      sessionRetentionDays: {
        label: "Días de retención de sesión",
        description: "Número de días para retener las sesiones",
      },
      tokenRetentionDays: {
        label: "Días de retención de tokens",
        description: "Número de días para retener las fichas",
      },
      batchSize: {
        label: "Tamaño del lote",
        description: "Número de registros para procesar por lote",
      },
      dryRun: {
        label: "Dry Run",
        description: "Ejecutar sin borrar registros",
      },
    },
    response: {
      sessionsDeleted: "Períodos de sesiones suprimidos",
      tokensDeleted: "Tokens Deleted",
      totalProcessed: "Total procesada",
      executionTimeMs: "Tiempo de ejecución (ms)",
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description:
          "Usted debe ser un administrador para ejecutar la limpieza de sesión",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes acceso",
      },
      server: {
        title: "Error del servidor",
        description: "Error del servidor interno durante la limpieza",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
      validation: {
        title: "Error de validación",
        description: "Configuración de limpieza inválida",
      },
    },
    success: {
      title: "Sesión de limpieza completada",
      description: "Sesiones y fichas limpiadas con éxito",
    },
  },
  task: {
    name: "user-session-cleanup",
    description:
      "Limpiar las sesiones de usuario expiradas para mantener la seguridad del sistema",
    purpose:
      "Elimina las sesiones vencidas para mantener la seguridad y el rendimiento",
    impact:
      "Mejora el rendimiento y la seguridad del sistema eliminando los datos de sesión",
    rollback: "Rollback no aplicable para operaciones de limpieza",
  },
  errors: {
    default: "Se produjo un error durante la limpieza de sesión",
    execution_failed: {
      title: "SesiÃ3n de limpieza Failed: {{error}}",
      description: "No se puede limpiar las sesiones expiradas",
    },
    partial_failure: {
      title: "Fallo parcial de limpieza de sesión: {{errors}}",
      description: "Algunas sesiones no pueden ser limpiadas",
    },
    unknown_error: {
      title: "Error de limpieza de sesión desconocido",
      description: "Un error desconocido ocurrió durante la limpieza de sesión",
    },
    invalid_session_retention: {
      title: "Retención de sesión inválida",
      description:
        "Período de retención del período de sesiones inválido especificado",
    },
    invalid_token_retention: {
      title: "Retención de Token inválida",
      description: "Período de retención de token inválido especificado",
    },
    invalid_batch_size: {
      title: "Tamaño del lote inválido",
      description: "Tamaño de lote inválido especificado para la limpieza",
    },
    validation_failed: {
      title: "Validación fallida",
      description:
        "La validación de la configuración de limpieza de sesión falló",
    },
  },
  success: {
    title: "Sesión de limpieza completada",
    description: "Sucesivamente limpiado las sesiones caducadas",
  },
  monitoring: {
    alertTrigger: "La tarea de limpieza del período de sesiones falló",
  },
  documentation: {
    overview:
      "Esta tarea elimina las sesiones de usuario expiradas del sistema para mantener la seguridad y el rendimiento",
  },
};
