import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "API Endpoint",
  tags: {
    tasks: "Tareas",
    cron: "Cron",
    bulk: "Bulk",
  },
  post: {
    title: "Acción de tareas a granel",
    titleShort: "Bulk Tasks",
    description:
      "Realizar una acción a granel (delete, habilitar, deshabilitar, ejecutar) en múltiples tareas de cron",
    fields: {
      ids: {
        label: "ID de tareas",
        description: "Lista de documentos de tareas para actuar",
      },
      action: {
        label: "Medida",
        description: "La acción para realizar en las tareas seleccionadas",
        options: {
          delete: "Eliminar",
          enable: "Habilitación",
          disable: "Inhabilitación",
          run: "Corre ahora.",
        },
      },
      succeeded: {
        label: "Succedido",
        description: "Número de tareas procesadas con éxito",
      },
      failed: {
        label: "Failed",
        description: "Número de tareas que no se procesaron",
      },
      errors: {
        label: "Errores",
        description: "Lista de errores por-tarea",
      },
    },
    errors: {
      fetchFailed: "Failed to retrieve task IDs for bulk action",
      validation: {
        title: "Falló la validación",
        description: "Los datos de acción masiva proporcionados son inválidos",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Usted no tiene permiso para realizar acciones a granel",
      },
      internal: {
        title: "Error interno",
        description: "Se produjo un error al realizar la acción a granel",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Se prohíbe el acceso a este recurso.",
      },
      conflict: {
        title: "Conflicto",
        description: "Se produjo un conflicto al procesar la acción a granel",
      },
      network: {
        title: "Error de red",
        description: "Se produjo un error de red",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
      notFound: {
        title: "Cuenta o sesión no encontradas",
        description: "No se encontraron ni una o más tareas",
      },
      unsaved: {
        title: "Cambios sin guardar",
        description: "Hay cambios sin salvar",
      },
    },
    success: {
      completed: {
        title: "Se completó la acción a granel",
        description:
          "La acción a granel se ha aplicado a las tareas seleccionadas",
      },
    },
  },
};
