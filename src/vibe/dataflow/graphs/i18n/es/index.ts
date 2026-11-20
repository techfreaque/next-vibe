import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: {
    vibeSense: "vibe-sense",
  },

  list: {
    title: "Gráficos de pipalina",
    titleShort: "Gráficos",
    description: "Listar todos los gráficos visibles al usuario actual",
    fields: {
      search: {
        label: "Buscar",
        description: "Filtrar gráficos por nombre o rotura",
        placeholder: "Buscar gráficos...",
      },
    },
    container: {
      title: "Gráficos",
      description: "Todos los gráficos de tuberías",
    },
    response: {
      graphs: "Gráficos",
      graph: {
        id: "ID",
        slug: "Slug",
        name: "Nombre",
        description: "Descripción",
        ownerType: "Tipo de propietario",
        ownerId: "Propietario ID",
        isActive: "Activa",
        createdAt: "Creado en",
      },
    },
    success: {
      title: "Gráficos cargados",
      description: "Gráficos de tubería recuperados con éxito",
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Autenticación requerida para listar gráficos",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Acceso de los administradores necesario",
      },
      server: {
        title: "Error del servidor",
        description: "Failed to load graphs",
      },
      unknown: {
        title: "Error desconocido",
        description: "Se produjo un error inesperado mientras cargaba gráficos",
      },
      validation: {
        title: "Falló la validación",
        description: "Parámetros de solicitud no válidos",
      },
      notFound: {
        title: "Cuenta o sesión no encontradas",
        description: "No hay gráficas encontradas",
      },
      conflict: {
        title: "Conflicto",
        description: "Conflicto de recursos",
      },
      network: {
        title: "Error de red",
        description: "La solicitud de red falló mientras cargaba gráficos",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Guardar cambios antes de continuar",
      },
    },
  },

  widget: {
    refresh: "Actualizar",
    createGraph: "Gráfico Nuevo",
    active: "Activa",
    inactive: "Inactivo",
    empty: "Todavía no hay gráficos. Crea tu primer gráfico de tuberías.",
    error: "Falló en cargar grafitos. Por favor, inténtalo de nuevo.",
    archive: "Archivar",
    delete: "Eliminar",
    searchPlaceholder: "Buscar por nombre, babón o descripción...",
    noMatchTitle: "No hay gráficos coincidentes",
    noMatchHint: "Pruebe un término de búsqueda diferente",
    clearSearch: "Búsqueda clara",
    searchResults: "resultados para",
    stats: {
      total: "Gráficos totales",
      active: "Activa",
      system: "Sistema",
      admin: "Administrador",
    },
  },

  create: {
    title: "Crear Gráfico",
    description: "Crear un nuevo gráfico de tuberías",
    fields: {
      name: {
        label: "Nombre",
        description: "Nombre de la pantalla de Gráficos",
        placeholder: "Mi gráfico",
      },
      slug: {
        label: "Slug",
        description: "Identificador único (bajo, solo hipnosis)",
        placeholder: "mi-graph",
      },
      description: {
        label: "Descripción",
        description: "Opcional descripción",
        placeholder: "",
      },
      config: {
        label: "Config",
        description: "Configuración de gráficos DAG",
      },
    },
    response: {
      id: "Gráfico ID",
    },
    success: {
      title: "Gráfico creado",
      description: "Gráfico de tuberías creado con éxito",
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Autenticación necesaria para crear gráficos",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Acceso de los administradores necesario",
      },
      server: {
        title: "Error del servidor",
        description: "Failed to create graph",
      },
      unknown: {
        title: "Error desconocido",
        description:
          "Se produjo un error inesperado mientras se crea el gráfico",
      },
      validation: {
        title: "Falló la validación",
        description: "Configuración del gráfico inválido",
      },
      notFound: {
        title: "Cuenta o sesión no encontradas",
        description: "No se encontró el recurso",
      },
      conflict: {
        title: "Conflicto",
        description: "La mancha de Gráfico ya existe",
      },
      network: {
        title: "Error de red",
        description: "La solicitud de red falló al crear el gráfico",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Guardar cambios antes de continuar",
      },
    },
  },
};
