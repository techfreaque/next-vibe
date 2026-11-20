import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    viewType: {
      calendar: "Calendario",
      grid: "Grid",
      kanban: "Kanban",
      list: "Lista",
      wiki: "Wiki",
    },
  },
  post: {
    title: "Nueva carpeta",
    titleShort: "Nueva carpeta",
    description: "Cree una carpeta.",
    dynamicTitle: "Creado {{path}}",
    status: {
      loading: "Creando...",
      done: "Creado",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Camino",
        description:
          "Carretera. Use la raíz de su local (por ejemplo /dokumente/ para DE, /dokumenty/ para PL). Ejemplo: /documentos/proyectos/my-app",
      },
      viewType: {
        label: "Vista",
        description: "Cómo mostrarlo (lista, kanban, calendario, rejilla)",
      },
      createParents: {
        label: "Crear carpetas",
        description: "Hacer las carpetas de padres que faltan también",
      },
    },
    submitButton: {
      label: "Crear",
      loadingText: "Creando...",
    },
    response: {
      path: { content: "Camino" },
      created: { text: "Creado" },
      alreadyExists: { text: "Ya existe" },
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
        description: "No puedo crear carpetas aquí",
      },
      notFound: {
        title: "Perdiendo a Parent",
        description: "Carpeta de pariente no existe",
      },
      server: { title: "Error del servidor", description: "Algo rompió." },
      unknown: { title: "Error", description: "Algo salió mal" },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Guardar o descartar primero",
      },
      conflict: {
        title: "Ya existe.",
        description: "Carpeta ya allí.",
      },
    },
    success: {
      title: "Creado",
      description: "Carpeta lista",
    },
  },
};
