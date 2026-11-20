import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Mostrar árbol",
    titleShort: "Árbol de archivos",
    description:
      "Vea la estructura completa de carpetas de un vistazo. Para /ssh/ paths, muestra máquinas y resúmenes de montaje: use cortex-list o cortex-exec para navegar más profundo.",
    dynamicTitle: "Tree {{path}}",
    status: {
      loading: "Escaneando...",
      done: "Escaneada",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Camino",
        description: "Comienza desde aquí (predeterminado: root)",
      },
      depth: {
        label: "Profundidad",
        description: "¿Cuántos niveles profundos",
      },
    },
    submitButton: {
      label: "Mostrar árbol",
      loadingText: "Cargando...",
    },
    response: {
      tree: { content: "Árbol" },
      totalFiles: { text: "Archivos" },
      totalDirs: { text: "Carpetas" },
    },
    errors: {
      validation: {
        title: "Mala entrada",
        description: "Recorre el camino y la profundidad",
      },
      network: {
        title: "Sin conexión",
        description: "No puede llegar al servidor",
      },
      unauthorized: {
        title: "No está atrapado.",
        description: "Inicia sesión primero",
      },
      forbidden: { title: "No hay acceso", description: "No puedo ver esto." },
      notFound: { title: "No encontrado", description: "La carpeta no existe" },
      server: { title: "Error del servidor", description: "Algo rompió." },
      unknown: { title: "Error", description: "Algo salió mal" },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Guardar o descartar primero",
      },
      conflict: { title: "Conflicto", description: "Volver a intentar" },
    },
    success: {
      title: "Árbol",
      description: "Aquí está la estructura.",
    },
  },
};
