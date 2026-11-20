/**
 * Thread Search API - English Translations
 */

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  enums: {
    threadStatus: {
      active: "Activa",
      archived: "Archivado",
      deleted: "Suprimidos",
    },
  },
  tags: {
    threads: "Conversaciones",
  },
  search: {
    get: {
      title: "Buscar panes",
      titleShort: "Buscar panes",
      description:
        "Búsqueda a través de títulos de hilo, previsualizaciones y los impulsos del sistema usando búsqueda de texto completo",
      container: {
        title: "Búsqueda de conversaciones",
        description: "Búsqueda de hilos con clasificación relevante",
      },
      query: {
        label: "Búsqueda",
        description:
          "Ingrese los términos de búsqueda. Soporta frases en comillas, operadores AND / OR",
        placeholder: "Búsqueda de hilos...",
      },
      sections: {
        pagination: {
          title: "Pagination",
          description: "Pagina de resultados de control",
        },
      },
      page: {
        label: "Página",
        description: "Número de página (1 basado)",
      },
      limit: {
        label: "Resultados por página",
        description: "Número de resultados por página (1-100)",
      },
      sortBy: {
        label: "Ordenar por",
        description: "Ordenar resultados por relevancia o fecha",
        options: {
          relevance: "Relevancia",
          date: "Fecha (primero año)",
        },
      },
      includeArchived: {
        label: "Incluido archivado",
        description: "Incluir hilos archivados en los resultados de búsqueda",
      },
      response: {
        results: {
          title: "Resultados de búsqueda",
          description: "Panes que coinciden con su búsqueda",
          thread: {
            id: {
              label: "Thread ID",
            },
            title: {
              label: "Título",
            },
            preview: {
              label: "Vista previa",
            },
            rank: {
              label: "Relevancia Score",
              description:
                "Las puntuaciones más altas indican mejores coincidencias",
            },
            headline: {
              label: "Snippet",
              description:
                "Extracto destacado que muestra términos coincidentes",
            },
            status: {
              label: "Situación",
            },
            createdAt: {
              label: "Creado en",
            },
            updatedAt: {
              label: "Actualizado en",
            },
          },
        },
        totalResults: {
          label: "Total de resultados",
          description:
            "Número total de hilos que coinciden con la consulta de búsqueda",
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
          description: "Usted debe estar conectado para buscar hilos",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No tienes permiso para buscar hilos",
        },
        notFound: {
          title: "No encontrado",
          description: "No hay hilos encontrados",
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
        description: "Búsqueda finalizada con éxito",
      },
    },
  },
};
