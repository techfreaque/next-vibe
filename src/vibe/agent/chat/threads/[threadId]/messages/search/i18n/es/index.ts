import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    messages: "Mensajes",
  },
  search: {
    get: {
      title: "Mensajes de búsqueda",
      titleShort: "Mensajes de búsqueda",
      description:
        "Buscar mensajes dentro de un hilo específico usando búsqueda de texto completo",
      container: {
        title: "Búsqueda de mensajes",
        description: "Buscar mensajes en este hilo",
      },
      threadId: {
        label: "Thread ID",
        description: "El ID del hilo para buscar en",
      },
      query: {
        label: "Búsqueda",
        description: "Texto para buscar en mensajes",
      },
      sections: {
        pagination: {
          title: "Pagination",
          description: "Ajustes de navegación de página",
        },
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
            title: "Mensaje",
            id: {
              content: "Mensaje ID",
            },
            content: {
              content: "Contenido",
            },
            role: {
              content: "Función",
            },
            rank: {
              content: "Relevancia Score",
            },
            headline: {
              content: "Snippet",
            },
            createdAt: {
              content: "Creado en",
            },
          },
        },
        totalCount: {
          content: "Total de resultados",
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
          description:
            "Usted no tiene permiso para buscar mensajes en este hilo",
        },
        notFound: {
          title: "Thread Not Found",
          description:
            "El hilo especificado no existe o usted no tiene acceso a él",
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
        description: "Búsqueda de mensajes terminada con éxito",
      },
    },
  },
};
