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
  post: {
    title: "Votar por Mensaje",
    titleShort: "Mensaje de votación",
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
};
