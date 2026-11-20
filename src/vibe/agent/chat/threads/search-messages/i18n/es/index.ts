import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    messages: "Mensajes",
  },
  search: {
    get: {
      title: "Búsqueda de mensajes globales",
      titleShort: "Mensajes de búsqueda",
      description:
        "Buscar mensajes a través de todos los hilos usando búsqueda de texto completo",
      container: {
        title: "Búsqueda de mensajes globales",
        description: "Buscar mensajes a través de todos sus hilos",
      },
      query: {
        label: "Búsqueda",
        description: "Texto para buscar en mensajes",
      },
      sections: {
        filters: {
          title: "Filtros",
          description:
            "Filtros opcionales para reducir los resultados de búsqueda",
        },
        pagination: {
          title: "Pagination",
          description: "Ajustes de navegación de página",
        },
      },
      rootFolderId: {
        label: "Root Folder",
        description:
          "Búsqueda limitada a un tipo específico de carpeta raíz (privado, compartido, público, fondo)",
      },
      role: {
        label: "Papel del mensaje",
        description:
          "Filtro por función de mensaje (usuario, asistente, sistema, herramienta, error)",
      },
      startDate: {
        label: "Fecha de inicio",
        description: "Sólo incluye mensajes creados después de esta fecha",
      },
      endDate: {
        label: "Fecha final",
        description: "Sólo incluyen mensajes creados antes de esta fecha",
      },
      page: {
        label: "Página",
        description: "Número de página para recuperar",
      },
      limit: {
        label: "Limitación",
        description: "Número de resultados por página",
      },
      response: {
        results: {
          message: {
            title: "Resultado del mensaje",
            messageId: {
              content: "Mensaje ID",
            },
            threadId: {
              content: "Thread ID",
            },
            threadTitle: {
              content: "Título del texto",
            },
            role: {
              content: "Función",
            },
            headline: {
              content: "Índice",
            },
            createdAt: {
              content: "Creado en",
            },
            rootFolderId: {
              content: "Root Folder",
            },
          },
        },
        total: {
          content: "Total de resultados",
        },
        page: {
          content: "Página actual",
        },
      },
      errors: {
        validationFailed: {
          title: "Validación fallida",
          description: "Parámetros de búsqueda inválidos proporcionados",
        },
        network: {
          title: "Error de red",
          description: "Incapaz de conectarse al servidor",
        },
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Debes estar conectado para buscar mensajes",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No tienes permiso para realizar esta búsqueda",
        },
        notFound: {
          title: "No encontrado",
          description:
            "No se han encontrado resultados que coincidan con su consulta",
        },
        serverError: {
          title: "Error del servidor",
          description:
            "Se produjo un error de servidor interno durante la búsqueda",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin guardar",
        },
        conflict: {
          title: "Conflicto",
          description: "Se produjo un conflicto",
        },
      },
      success: {
        title: "Operación completada",
        description: "Búsqueda mundial de mensajes terminada con éxito",
      },
    },
  },
};
