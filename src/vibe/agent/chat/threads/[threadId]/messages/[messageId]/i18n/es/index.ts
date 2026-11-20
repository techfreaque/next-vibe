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
  chat: {
    enums: {
      role: {
        user: "Usuario",
        assistant: "Assistant",
        system: "Sistema",
        tool: "Herencia",
        error: "Error",
      },
    },
  },
  get: {
    title: "Mensaje",
    titleShort: "Mensaje",
    description: "Recuperar un mensaje específico por ID",
    container: {
      title: "Detalles del mensaje",
      description: "Ver información del mensaje",
    },
    threadId: {
      label: "Thread ID",
      description: "ID del hilo que contiene el mensaje",
    },
    messageId: {
      label: "Mensaje ID",
      description: "ID del mensaje para recuperar",
    },
    rootFolderId: {
      label: "Root Folder",
      description:
        "Carpeta de raíz del hilo (utilizada para la routa del cliente)",
    },
    response: {
      title: "Respuesta del mensaje",
      description: "Detalles del mensaje",
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
        authorId: {
          content: "Autor ID",
        },
        isAI: {
          content: "Es AI",
        },
        model: {
          content: "Modelo",
        },
        tokens: {
          content: "Tokens",
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
        description: "Parámetros de solicitud no válidos",
      },
      network: {
        title: "Error de red",
        description: "Incapaz de conectarse al servidor",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Debes estar conectado para ver mensajes",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Usted no tiene permiso para ver este mensaje",
      },
      notFound: {
        title: "No encontrado",
        description: "Mensaje no encontrado",
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
      messageNotFound: {
        title: "Mensaje no encontrado",
        description: "El mensaje especificado no existe",
      },
    },
    backButton: {
      label: "Atrás",
    },
    success: {
      title: "Operación completada",
      description: "Mensaje recuperado con éxito",
    },
  },
  patch: {
    title: "Mensaje de actualización",
    titleShort: "Mensaje de actualización",
    description: "Actualizar el contenido de un mensaje",
    container: {
      title: "Editar mensaje",
      description: "Actualizar el contenido del mensaje",
    },
    form: {
      title: "Editar mensaje",
      description: "Actualizar el contenido del mensaje",
    },
    sections: {
      message: {
        title: "Contenido del mensaje",
        description: "Editar el mensaje",
      },
    },
    threadId: {
      label: "Thread ID",
      description: "ID del hilo que contiene el mensaje",
    },
    messageId: {
      label: "Mensaje ID",
      description: "ID del mensaje para actualizar",
    },
    rootFolderId: {
      label: "Root Folder",
      description:
        "Carpeta de raíz del hilo (utilizada para la routa del cliente)",
    },
    content: {
      label: "Contenido",
      description: "Contenido de mensaje actualizado",
      placeholder: "Introduzca el contenido del mensaje...",
    },
    role: {
      label: "Función",
      description: "Función del mensaje (usuario, asistente, sistema)",
    },
    response: {
      title: "Mensaje actualizado",
      description: "Detalles actualizados del mensaje",
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
        description: "Datos de mensajes inválidos proporcionados",
      },
      network: {
        title: "Error de red",
        description: "Incapaz de conectarse al servidor",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Debes estar conectado para actualizar los mensajes",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Usted no tiene permiso para actualizar este mensaje",
      },
      notFound: {
        title: "No encontrado",
        description: "Mensaje no encontrado",
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
      messageNotFound: {
        title: "Mensaje no encontrado",
        description: "El mensaje especificado no existe",
      },
    },
    backButton: {
      label: "Atrás",
    },
    submitButton: {
      label: "Guardar cambios",
      loadingText: "Salvando...",
    },
    success: {
      title: "Operación completada",
      description: "Mensaje actualizado con éxito",
    },
  },
  delete: {
    title: "Suprímase el mensaje",
    titleShort: "Suprímase el mensaje",
    description: "Eliminar un mensaje del hilo",
    container: {
      title: "Suprímase el mensaje",
      description: "Eliminar el mensaje del hilo",
    },
    confirmTitle: "Borrar el mensaje",
    confirmText:
      "¿Estás seguro de que quieres borrar este mensaje? Esta acción no se puede deshacer.",
    backButton: {
      label: "Cancelar",
    },
    submitButton: {
      label: "Eliminar",
      loadingText: "Eliminar...",
    },
    deleteButton: {
      label: "Eliminar",
      loadingText: "Eliminar...",
    },
    threadId: {
      label: "Thread ID",
      description: "ID del hilo que contiene el mensaje",
    },
    messageId: {
      label: "Mensaje ID",
      description: "ID del mensaje para eliminar",
    },
    rootFolderId: {
      label: "Root Folder",
      description:
        "Carpeta de raíz del hilo (utilizada para la routa del cliente)",
    },
    response: {
      success: { content: "Operación completada" },
      role: { content: "Función" },
      content: { content: "Contenido" },
      parentId: { content: "Mensaje de Padre ID" },
      authorId: { content: "Autor ID" },
      isAI: { content: "Es AI" },
      model: { content: "Modelo" },
      createdAt: { content: "Creado en" },
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
        description: "Usted debe estar conectado para borrar mensajes",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Usted no tiene permiso para borrar este mensaje",
      },
      notFound: {
        title: "No encontrado",
        description: "Mensaje no encontrado",
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
        description: "No puede eliminar el mensaje con mensajes infantiles",
      },
      threadNotFound: {
        title: "Thread Not Found",
        description: "El hilo especificado no existe",
      },
      messageNotFound: {
        title: "Mensaje no encontrado",
        description: "El mensaje especificado no existe",
      },
    },
    success: {
      title: "Operación completada",
      description: "Mensaje eliminado con éxito",
    },
  },
  vote: {
    category: "Chat",
    tags: {
      messages: "Mensajes",
    },
    post: {
      title: "Votar por Mensaje",
      description: "Subir o revocar un mensaje",
      container: {
        title: "Votación",
        description: "Vota tu voto sobre este mensaje",
      },
      form: {
        title: "Votar por Mensaje",
        description: "Subir, revocar o eliminar su voto",
      },
      threadId: {
        label: "Thread ID",
        description: "ID del hilo que contiene el mensaje",
      },
      messageId: {
        label: "Mensaje ID",
        description: "ID del mensaje para votar",
      },
      rootFolderId: {
        label: "Root Folder",
        description:
          "Carpeta de raíz del hilo (utilizada para la routa del cliente)",
      },
      vote: {
        label: "Votación",
        description: "Su voto: sube, sube o retire",
        placeholder: "Seleccione el tipo de voto...",
        options: {
          upvote: "Subtítulos",
          downvote: "Downvote",
          remove: "Eliminar el voto",
        },
      },
      response: {
        title: "Resultado de la votación",
        description: "Conteos de votación actualizados",
        upvotes: {
          content: "Upvotes",
        },
        downvotes: {
          content: "Downvotes",
        },
        userVote: {
          content: "Tu voto",
        },
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Datos de voto inválidos proporcionados",
        },
        network: {
          title: "Error de red",
          description: "Incapaz de conectarse al servidor",
        },
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Usted debe estar conectado para votar sobre mensajes",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "Usted no tiene permiso para votar sobre este mensaje",
          incognitoNotAllowed:
            "Los hilos de incógnito no se pueden acceder en el servidor",
        },
        notFound: {
          title: "No encontrado",
          description: "Mensaje no encontrado",
        },
        server: {
          title: "Error del servidor",
          description: "Fallado en el registro de la votación",
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
          description: "Conflicto de votos",
        },
      },
      success: {
        title: "Voto grabado",
        description: "Su voto se ha registrado con éxito",
      },
    },
  },
};
