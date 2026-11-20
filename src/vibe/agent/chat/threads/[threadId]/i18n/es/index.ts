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
  tags: {
    threads: "Conversaciones",
  },
  errors: {
    not_implemented_on_native:
      "{{method}} no se implementa en plataforma nativa. Por favor, utilice la versión web para esta operación.",
  },
  get: {
    title: "Consigue Chat Thread",
    titleShort: "Thread",
    description: "Recuperar un hilo de chat específico por ID",
    container: {
      title: "Detalles del pan",
      description: "Ver información detallada sobre los hilos",
    },
    id: {
      label: "Thread ID",
      description: "Identificador único para el hilo",
      placeholder: "Ingrese el hilo ID...",
    },
    rootFolderId: {
      label: "Root Folder",
      description:
        "Carpeta de raíz del hilo (utilizada para la routa del cliente)",
    },
    response: {
      thread: {
        title: "Detalles del pan",
        description: "Información completa sobre los hilos",
        id: {
          content: "Thread ID",
        },
        userId: {
          content: "Usuario ID",
        },
        leadId: {
          content: "ID del contacto",
        },
        threadTitle: {
          content: "Título",
        },
        rootFolderId: {
          content: "Carpeta de raíz ID",
        },
        folderId: {
          content: "Carpeta ID",
        },
        status: {
          content: "Situación",
        },
        defaultModel: {
          content: "Modelo predeterminado",
        },
        defaultTone: {
          content: "Habilidad predeterminada",
        },
        systemPrompt: {
          content: "Prompt del sistema",
        },
        pinned: {
          content: "Pinned",
        },
        archived: {
          content: "Archivado",
        },
        tags: {
          content: "Tags",
        },
        published: {
          content: "Publicado",
        },
        streamingState: {
          content: "Estado de la corriente",
        },
        searchVector: {
          content: "Search Vector",
        },
        preview: {
          content: "Vista previa",
        },
        metadata: {
          content: "Metadatos",
        },
        createdAt: {
          content: "Creado en",
        },
        updatedAt: {
          content: "Actualizado en",
        },
      },
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Hilo inválido ID proporcionado",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Usted debe estar conectado para ver los hilos",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes permiso para ver este hilo.",
      },
      notFound: {
        title: "Thread Not Found",
        description: "El hilo solicitado no se pudo encontrar",
      },
      server: {
        title: "Error del servidor",
        description: "Se produjo un error de servidor interno",
        detail: "Error del servidor: {{error}}",
      },
      network: {
        title: "Error de red",
        description: "Incapaz de conectarse al servidor",
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
      description: "Thread recuperado con éxito",
    },
  },
  patch: {
    title: "Actualización Chat Thread",
    titleShort: "Actualización de los mensajes",
    description: "Actualizar un hilo de chat existente",
    container: {
      title: "Actualización de los mensajes",
      description: "Modificar la configuración de los hilos",
    },
    id: {
      label: "Thread ID",
      description: "Unico identificador para el hilo para actualizar",
      placeholder: "Ingrese el hilo ID...",
    },
    sections: {
      updates: {
        title: "Actualizaciones de los mensajes",
        description: "Campos para actualizar",
      },
    },
    threadTitle: {
      label: "Título",
      description: "Título del pan",
      placeholder: "Ingrese el título del hilo...",
    },
    rootFolderId: {
      label: "Root Folder",
      description:
        "Carpeta de raíz del hilo (utilizada para la routa del cliente)",
    },
    folderId: {
      label: "Folder",
      description: "Carpeta para colocar el hilo en",
    },
    status: {
      label: "Situación",
      description: "Estado del pan",
    },
    defaultModel: {
      label: "Modelo predeterminado",
      description: "Modelo AI predeterminado para este hilo",
    },
    defaultTone: {
      label: "Habilidad predeterminada",
      description: "Debilidad predeterminada para este hilo",
    },
    systemPrompt: {
      label: "Prompt del sistema",
      description: "Sistema personalizado de impulso para este hilo",
    },
    pinned: {
      label: "Pinned",
      description: "Pin este hilo en la parte superior",
    },
    archived: {
      label: "Archivado",
      description: "Archivar este hilo",
    },
    tags: {
      label: "Tags",
      description: "Etiquetas para la organización",
    },
    published: {
      label: "Publicado",
      description:
        "Hacer este hilo públicamente accesible a través del enlace (sólo carpetas SHARED)",
    },
    response: {
      thread: {
        title: "Thread actualizado",
        description: "Thread details after update",
        id: {
          content: "Thread ID",
        },
        userId: {
          content: "Usuario ID",
        },
        leadId: {
          content: "ID del contacto",
        },
        threadTitle: {
          content: "Título",
        },
        rootFolderId: {
          content: "Carpeta de raíz ID",
        },
        folderId: {
          content: "Carpeta ID",
        },
        status: {
          content: "Situación",
        },
        defaultModel: {
          content: "Modelo predeterminado",
        },
        defaultTone: {
          content: "Habilidad predeterminada",
        },
        systemPrompt: {
          content: "Prompt del sistema",
        },
        pinned: {
          content: "Pinned",
        },
        archived: {
          content: "Archivado",
        },
        tags: {
          content: "Tags",
        },
        published: {
          content: "Publicado",
        },
        searchVector: {
          content: "Search Vector",
        },
        preview: {
          content: "Vista previa",
        },
        metadata: {
          content: "Metadatos",
        },
        createdAt: {
          content: "Creado en",
        },
        updatedAt: {
          content: "Actualizado en",
        },
      },
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Datos de rosca inválidos proporcionados",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Usted debe estar conectado para actualizar los hilos",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes permiso para actualizar este hilo",
      },
      notFound: {
        title: "Thread Not Found",
        description: "El hilo para actualizar no se pudo encontrar",
        detail: "Pan no encontrado: {{threadId}}",
      },
      server: {
        title: "Error del servidor",
        description: "Se produjo un error de servidor interno",
        detail: "Error del servidor: {{error}}",
      },
      network: {
        title: "Error de red",
        description: "Incapaz de conectarse al servidor",
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
        description: "Se produjo un conflicto al tiempo que se actualizó",
      },
    },
    success: {
      title: "Operación completada",
      description: "Thread actualizado con éxito",
    },
  },
  delete: {
    title: "Eliminar el texto de chat",
    titleShort: "Eliminar conversación",
    description: "Eliminar un hilo de chat",
    container: {
      title: "Eliminar conversación",
      description: "Retirar permanentemente el hilo",
    },
    id: {
      label: "Thread ID",
      description: "Identificador único para el hilo para eliminar",
      placeholder: "Ingrese el hilo ID...",
      helpText: "WARNING : Esta acción no puede ser deshecha",
    },
    rootFolderId: {
      label: "Root Folder",
      description:
        "Carpeta de raíz del hilo (utilizada para la routa del cliente)",
    },
    response: {
      userId: {
        content: "Propietario",
      },
      title: {
        content: "Título",
      },
      folderId: {
        content: "Folder",
      },
      status: {
        content: "Situación",
      },
      preview: {
        content: "Vista previa",
      },
      createdAt: {
        content: "Creado",
      },
      updatedAt: {
        content: "Actualizado",
      },
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Hilo inválido ID proporcionado",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Usted debe estar conectado para eliminar los hilos",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Usted no tiene permiso para borrar este hilo",
      },
      notFound: {
        title: "Thread Not Found",
        description: "El hilo para borrar no se pudo encontrar",
        detail: "Pan no encontrado: {{threadId}}",
      },
      server: {
        title: "Error del servidor",
        description: "Se produjo un error de servidor interno",
        detail: "Error del servidor: {{error}}",
      },
      network: {
        title: "Error de red",
        description: "Incapaz de conectarse al servidor",
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
        description:
          "No puede eliminar el hilo debido a las dependencias existentes",
      },
    },
    success: {
      title: "Operación completada",
      description: "Tema eliminado con éxito",
    },
  },
  widget: {
    screenshot: {
      capture: "Captura de pantallas",
      capturing: "Capturing...",
    },
  },
};
