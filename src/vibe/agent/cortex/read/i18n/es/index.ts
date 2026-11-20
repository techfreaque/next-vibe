import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Leer archivo",
    titleShort: "Leer archivo",
    description:
      "Abra cualquier archivo - sus notas, hilos, recuerdos, habilidades o tareas.",
    dynamicTitle: "Lea {{path}}",
    status: {
      loading: "Lectura...",
      done: "Cargado",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Camino",
        description:
          "Que archivo. Utilice la raíz de su local (por ejemplo /erinnerungen/ para DE, /wspomnienia/ para PL). Ejemplo: /documentos/notas/ideas.md",
      },
      maxLines: {
        label: "Max Lines",
        description: "Sólo muestra estas muchas líneas.",
      },
    },
    submitButton: {
      label: "Leer",
      loadingText: "Lectura...",
    },
    emptyFile: "Este archivo está vacío.",
    response: {
      path: { content: "Camino" },
      content: { content: "Contenido" },
      size: { text: "Tamaño" },
      truncated: { text: "Corto corto" },
      readonly: { text: "Solo lectura" },
      nodeType: { text: "Tipo" },
      updatedAt: { content: "Actualizado" },
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
        description: "No puedes leer esto.",
      },
      notFound: { title: "No encontrado", description: "Nada en este camino" },
      server: { title: "Error del servidor", description: "Algo rompió." },
      unknown: { title: "Error", description: "Algo salió mal" },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Guardar o descartar primero",
      },
      conflict: {
        title: "Conflicto",
        description: "Desigualdad de la versión",
      },
    },
    success: {
      title: "Lo tengo.",
      description: "Carga de archivos",
    },
  },
};
