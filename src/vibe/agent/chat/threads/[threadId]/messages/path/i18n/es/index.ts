import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    messages: "Mensajes",
  },
  config: {
    folders: {
      private: "Chats privados",
      shared: "Chats compartidos",
      public: "Charlas públicas",
      incognito: "Incognito Chats",
      background: "Temas de fondo",
      remote: "Chates remotos",
    },
  },
  get: {
    title: "Consigue Sendero de Conversación",
    titleShort: "Sendero del mensaje",
    description:
      "Recuperar mensajes siguiendo un camino de conversación específico",
    container: {
      title: "Camino de Conversación",
      description: "Mensajes en una sucursal de conversación seleccionada",
    },
    threadId: {
      label: "Thread ID",
      description: "ID del hilo para recuperar el camino de",
    },
    rootFolderId: {
      label: "Root Folder",
      description:
        "Carpeta de raíz del hilo (utilizada para la routa del cliente)",
    },
    leafMessageId: {
      label: "Mensaje de la hoja ID",
      description:
        "ID del mensaje de hoja (deepest) para mostrar el camino. Omitir por última vez.",
    },
    before: {
      label: "Antes del Mensaje ID",
      description:
        "Historia del cargamento se hundió antes de este mensaje ID (paginación basada en el precursor)",
    },
    response: {
      title: "Mensajes de Sendero",
      description: "Mensajes en el camino de conversación",
      messages: {
        message: {
          title: "Mensaje",
          id: {
            content: "Mensaje ID",
          },
          threadId: {
            content: "Thread ID",
          },
          role: {
            content: "Función",
          },
          content: {
            content: "Contenido",
          },
          parentId: {
            content: "Mensaje de Padre ID",
          },
          sequenceId: {
            content: "Secuencia ID",
          },
          authorId: {
            content: "Autor ID",
          },
          authorName: {
            content: "Nombre del autor",
          },
          isAI: {
            content: "Es AI",
          },
          model: {
            content: "Modelo",
          },
          skill: {
            content: "Habilidad",
          },
          errorType: {
            content: "Tipo de error",
          },
          errorMessage: {
            content: "Mensaje de error",
          },
          errorCode: {
            content: "Código de error",
          },
          metadata: {
            content: "Metadatos",
          },
          upvotes: {
            content: "Upvotes",
          },
          downvotes: {
            content: "Downvotes",
          },
          searchVector: {
            content: "Search Vector",
          },
          createdAt: {
            content: "Creado en",
          },
          updatedAt: {
            content: "Actualizado en",
          },
        },
      },
      hasOlderHistory: {
        content: "Historia más vieja",
      },
      hasNewerMessages: {
        content: "Mensajes más recientes",
      },
      resolvedLeafMessageId: {
        content: "Mensaje resuelto ID",
      },
      oldestLoadedMessageId: {
        content: "Mensaje más antiguo cargado ID",
      },
      compactionBoundaryId: {
        content: "Compactación Boundary ID",
      },
      newerChunkAnchorId: {
        content: "Newer Chunk Anchor ID",
      },
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Parámetros de solicitud no válidos",
      },
      network: {
        title: "Error de red",
        description: "Incapaz de conectarse al servidor",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description:
          "Usted debe estar conectado para ver los caminos de conversación",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes permiso para ver este camino de conversación",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró la conversación",
      },
      server: {
        title: "Error del servidor",
        description: "Se produjo un error de servidor interno",
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
      threadNotFound: {
        title: "Thread Not Found",
        description: "El hilo especificado no existe",
      },
      noRootMessage: {
        title: "Mensaje sin raíz",
        description: "El hilo no tiene ningún mensaje raíz",
      },
      getFailed: {
        title: "¡Apártate!",
        description: "Failed to retrieve conversation path",
      },
    },
    success: {
      title: "Operación completada",
      description: "Ruta de conversación recuperada con éxito",
    },
  },
};
