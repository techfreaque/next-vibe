import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tools: {
    category: "Herramientas MCP",
    tags: {
      mcp: "MCP",
    },
    get: {
      title: "Lista Herramientas MCP",
      description:
        "Obtenga todas las herramientas MCP disponibles para el usuario actual",
      fields: {
        name: "Nombre de la herramienta",
        description: "Descripción",
        inputSchema: "Input Schema",
      },
      response: {
        title: "Lista de herramientas MCP",
        description: "Lista de herramientas MCP disponibles",
      },
      errors: {
        validation: {
          title: "Validación fallida",
          description: "Parámetros de solicitud no válidos",
        },
        network: {
          title: "Error de red",
          description: "No conectado al servidor",
        },
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Inicia sesión para continuar",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "Usted no tiene permiso para acceder a este recurso",
        },
        notFound: {
          title: "No encontrado",
          description: "No se encontró el recurso",
        },
        server: {
          title: "Error del servidor",
          description: "Ocurrió un error interno del servidor",
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
          description: "Conflicto de recursos detectado",
        },
      },
      success: {
        title: "Operación completada",
        description: "Herramientas recuperadas con éxito",
      },
    },
  },
  execute: {
    category: "MCP Execute",
    tags: {
      mcp: "MCP",
    },
    post: {
      title: "Ejecutar la herramienta MCP",
      titleShort: "MCP Server",
      description: "Ejecute una herramienta MCP por nombre con argumentos",
      fields: {
        title: "Parámetros de ejecución de herramientas",
        description: "Parámetros para la ejecución de herramientas",
        name: {
          title: "Nombre de la herramienta",
          description:
            "Nombre de la herramienta para ejecutar (por ejemplo, núcleo:sistema:db:ping)",
          placeholder: "core:system:db:ping",
        },
        arguments: {
          title: "Argumentos",
          description:
            "argumentaciones de herramientas como pares de valor clave",
          placeholder: "{}",
        },
      },
      response: {
        title: "Ejecución de la herramienta Resultado",
        description: "Resultado de la ejecución de herramientas",
        result: {
          content: {
            type: "Tipo de contenido",
            text: "Contenido",
          },
          isError: "Es error",
        },
      },
      errors: {
        validation: {
          title: "Validación fallida",
          description: "Nombre o argumentos de la herramienta inválida",
        },
        network: {
          title: "Error de red",
          description: "No conectado al servidor",
        },
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Inicia sesión para continuar",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No tienes permiso para ejecutar esta herramienta",
        },
        notFound: {
          title: "Herramienta no encontrada",
          description: "La herramienta especificada no existe",
        },
        server: {
          title: "Error del servidor",
          description: "La ejecución de la herramienta falló",
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
          description: "Conflicto de recursos detectado",
        },
      },
      success: {
        title: "Operación completada",
        description: "Herramienta ejecutada con éxito",
      },
    },
  },
  serve: {
    category: "MCP Server",
    tags: {
      mcp: "MCP",
    },
    post: {
      title: "Inicio Servidor MCP",
      titleShort: "MCP Server",
      description: "Iniciar el servidor de protocolo modelo",
      response: {
        title: "MCP Server Status",
        description: "Estado del servidor MCP",
      },
      errors: {
        validation: {
          title: "Validación fallida",
          description: "Parámetros de solicitud no válidos",
        },
        server: {
          title: "Error del servidor",
          description: "Failed to start MCP server",
        },
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Inicia sesión para continuar",
        },
      },
      success: {
        title: "Operación completada",
        description: "El servidor MCP comenzó con éxito",
      },
    },
  },
  registry: {
    toolNotFound: "Herramienta no encontrada",
    endpointNotFound: "Punto final no encontrado",
    permissionDenied: "Permiso denegado",
    toolExecutionFailed: "La ejecución de la herramienta falló",
  },
};
