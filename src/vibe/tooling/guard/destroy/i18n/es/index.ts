import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Guardia de sistemas",

  title: "Guardia de destrucción",
  titleShort: "Guardia de destrucción",
  description: "Destruir ambientes de guardia y limpiar recursos",
  tag: "guardia-gestión",
  container: {
    title: "Configuración de la guardia de destrucción",
    description: "Configurar parámetros para destruir ambientes de guardia",
  },
  fields: {
    projectPath: {
      title: "Project Path",
      description: "Camino al directorio del proyecto",
      placeholder: "/home/user/projects/my-project",
    },
    guardId: {
      title: "Guardia ID",
      description: "Unico identificador para el guardia",
      placeholder: "guard_my_project_abc123",
    },
    force: {
      title: "Force Destroy",
      description: "La fuerza destruye incluso si el guardia está corriendo",
    },
    cleanupFiles: {
      title: "Archivos de limpieza",
      description: "Eliminar todos los archivos relacionados con la guardia",
    },
    dryRun: {
      title: "Dry Run",
      description:
        "Previsualizar lo que sería destruido sin realmente destruir",
    },
    success: {
      title: "Operación completada",
    },
    output: {
      title: "Producto",
    },
    destroyedGuards: {
      title: "Guardias destrozados",
    },
    warnings: {
      title: "Advertencias",
    },
    totalDestroyed: {
      title: "Total Destruido",
    },
    username: {
      title: "Nombre de usuario",
    },
    wasRunning: {
      title: "Estaba corriendo.",
    },
    filesRemoved: {
      title: "Archivos eliminados",
    },
    userRemoved: {
      title: "Usuario eliminado",
    },
  },
  form: {
    title: "Configuración de destrucción",
    description: "Configurar los parámetros de destrucción",
  },
  response: {
    title: "Respuesta",
    description: "Destruir los datos de respuesta",
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
    },
    internal: {
      title: "Error interno",
      description: "Se produjo un error interno",
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
    destruction_failed: {
      title: "Destrucción de la guardia fallecida: {{error}}",
      description: "Failed to destroy the guard environment",
    },
    guard_not_found: {
      title: "No hay guardia encontrado para el proyecto ' {{project}} '",
      description:
        "No hay entorno de guardia encontrado para el proyecto especificado",
    },
  },
  success: {
    title: "Operación completada",
    description: "La operación se completó correctamente",
  },
};
