import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  delete: {
    title: "Eliminar",
    titleShort: "Eliminar el archivo",
    description: "Quitar un archivo o carpeta. Se fue para siempre.",
    dynamicTitle: "Suprimido {{path}}",
    status: {
      loading: "Eliminar...",
      done: "Suprimidos",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Camino",
        description: "Qué eliminar",
      },
      recursive: {
        label: "Incluir contenidos",
        description: "También eliminar todo dentro",
      },
    },
    submitButton: {
      label: "Eliminar",
      loadingText: "Eliminar...",
    },
    response: {
      path: { content: "Camino" },
      nodesDeleted: { text: "Suprimidos" },
    },
    errors: {
      validation: { title: "Mala entrada", description: "Compruebe el camino" },
      network: {
        title: "Sin conexión",
        description: "No puede llegar al servidor",
      },
      unauthorized: {
        title: "No está atrapado.",
        description: "Inicia sesión primero",
      },
      forbidden: {
        title: "No hay acceso",
        description: "No puedo borrar esto.",
      },
      notFound: { title: "No encontrado", description: "Nada en este camino" },
      server: { title: "Error del servidor", description: "Algo rompió." },
      unknown: { title: "Error", description: "Algo salió mal" },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Guardar o descartar primero",
      },
      conflict: {
        title: "No está vacío.",
        description: "Carpeta tiene cosas en ella - uso Incluye contenido",
      },
    },
    success: {
      title: "Suprimidos",
      description: "Gone",
    },
  },
};
