import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Lista de carpetas",
    titleShort: "Lista de archivos",
    description: "Mira lo que hay en una carpeta.",
    dynamicTitle: "Listed {{path}}",
    status: {
      loading: "Listing...",
      done: "Listed",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Camino",
        description:
          "Carpeta a la lista. /ssh → todas las máquinas. /ssh/ <name> / → archivos o monturas. /ssh/ <name> / <mount> / → contenidos de montaje.",
      },
    },
    submitButton: {
      label: "Navega",
      loadingText: "Cargando...",
    },
    emptyState: "Esta carpeta está vacía.",
    folderNames: {
      memories: "Memorias",
      documents: "Documentos",
      threads: "Conversaciones",
      skills: "Skills",
      tasks: "Tareas",
      uploads: "Subidas",
      searches: "Búsquedas",
      gens: "Medios Generados",
      favorites: "Favoritos",
      inbox: "Bandeja de entrada",
      projects: "Proyectos",
      knowledge: "Conocimiento",
      journal: "Libro diario",
      templates: "Plantillas",
      identity: "Identidad",
      expertise: "Expertise",
      context: "Contexto",
    },
    response: {
      path: { content: "Camino" },
      entries: {
        name: { content: "Nombre" },
        path: { content: "Camino" },
        nodeType: { text: "Tipo" },
        size: { text: "Tamaño" },
        updatedAt: { content: "Actualizado" },
      },
      total: { text: "Total" },
      writable: { text: "Writable" },
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
        description: "No puedo ver esta carpeta",
      },
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
      title: "Listed",
      description: "Esto es lo que hay dentro.",
    },
  },
};
