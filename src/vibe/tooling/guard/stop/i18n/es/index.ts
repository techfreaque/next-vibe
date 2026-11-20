import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Guardia de sistemas",

  title: "¡Detén la guardia!",
  titleShort: "¡Detén la guardia!",
  description: "Parar los entornos de guardia para proyectos VSCode",
  tag: "guard",

  container: {
    title: "Configuración de guardia de alto nivel",
    description: "Configurar parámetros para detener entornos de guardia",
  },

  fields: {
    projectPath: {
      title: "Project Path",
      description: "Camino al directorio del proyecto",
      placeholder: "/path/to/your/project",
    },
    guardId: {
      title: "Guardia ID",
      description: "Guardia específica ID parar",
      placeholder: "guard_project_abc123",
    },
    username: {
      title: "Nombre de usuario",
    },
    wasRunning: {
      title: "Estaba corriendo.",
    },
    nowRunning: {
      title: "Ahora corren",
    },
    pid: {
      title: "Proceso ID",
    },
    forceStopped: {
      title: "Fuerza suspendida",
    },
    stopAll: {
      title: "Detengan a todos los guardias",
      description: "Detengan todos los entornos de guardia que corren",
    },
    force: {
      title: "Stop",
      description: "Parada de la fuerza incluso si el guardia no responde",
    },
    success: {
      title: "Operación Éxito",
    },
    output: {
      title: "Comando de salida",
    },
    stoppedGuards: {
      title: "Guardias parados",
    },
    totalStopped: {
      title: "Total Stopped",
    },
  },

  errors: {
    validation: {
      title: "Error de validación",
      description: "Parámetros de solicitud no válidos",
    },
    internal: {
      title: "Error interno",
      description: "Ocurrió un error interno del servidor",
    },
    unauthorized: {
      title: "Se requiere autenticación",
      description: "Inicia sesión para continuar",
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
    missingTarget:
      "Error de validación: especificar projectPath, guardId, o stopAll.",
    stopFailed: "Error interno al detener la guardia: {{detail}}",
  },

  success: {
    title: "Operación completada",
    description: "Operación de parada de guardia terminada con éxito",
  },
};
