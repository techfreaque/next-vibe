import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    sharing: "Compartir",
  },
  // Top-level keys used across methods
  empty: "", // For hidden/internal fields
  linkId: {
    label: "Enlace ID",
  },
  label: {
    label: "Label",
    description: "Etiquetas opcionales para identificar este enlace",
    placeholder: "Introduzca una etiqueta para este enlace de participación",
  },
  allowPosting: {
    label: "Permitir la publicación",
    description: "Permitir a los destinatarios publicar mensajes en este hilo",
  },
  requireAuth: {
    label: "Require Authentication",
    description:
      "Solicitar a los usuarios que se inscriban para acceder a este enlace",
  },
  shareLink: {
    label: "Label",
    shareUrl: "Compartir URL",
    active: "Activa",
    allowPosting: "Permitir la publicación",
    requireAuth: "Require Auth",
    accessCount: "Access Count",
    lastAccessedAt: "Último acceso",
    createdAt: "Creado",
    editAction: "Editar",
    deleteAction: "Revocación",
  },
  shareLinks: {
    emptyTitle: "No Share Links",
    emptyDescription: "Crear un enlace para compartir este hilo con otros",
  },
  get: {
    title: "Obtener enlaces de compartir",
    titleShort: "Compartir Enlaces",
    description: "Recuperar todos los enlaces de compartir para un hilo",
    container: {
      title: "Compartir Enlaces",
      description: "Todos los enlaces de compartir para este hilo",
    },
    response: {
      shareLink: {
        title: "Compartir Enlace",
        id: {
          content: "Enlace ID",
        },
        token: {
          content: "Compartir Token",
        },
        label: {
          content: "Label",
        },
        allowPosting: {
          content: "Permitir la publicación",
        },
        requireAuth: {
          content: "Require Auth",
        },
        active: {
          content: "Activa",
        },
        accessCount: {
          content: "Access Count",
        },
        lastAccessedAt: {
          content: "Último acceso",
        },
        createdAt: {
          content: "Creado",
        },
        editAction: {
          text: "Editar",
        },
        deleteAction: {
          text: "Revocación",
        },
      },
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Parámetros de solicitud no válidos",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Debes estar conectado para ver enlaces de compartir",
      },
      forbidden: {
        title: "Acceso denegado",
        description:
          "Usted no tiene permiso para ver estos enlaces de acciones",
      },
      removed: {
        title: "Retirada o sometida a examen",
        description:
          "Este hilo compartido fue reportado y ya no está disponible.",
      },
      notFound: {
        title: "No encontrado",
        description: "Enlace de lectura o compartir no encontrado",
      },
      server: {
        title: "Error del servidor",
        description: "Failed to retrieve share links",
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
        description: "Este recurso ha sido modificado",
      },
    },
    backButton: {
      label: "Atrás",
    },
    success: {
      title: "Operación completada",
      description: "Compartir enlaces recuperados con éxito",
    },
  },
  post: {
    title: "Crear vínculo Compartir",
    titleShort: "Compartir Enlace",
    description: "Crear un nuevo enlace para compartir un hilo",
    container: {
      title: "Nuevo vínculo de participación",
      description: "Configure su nuevo enlace de compartir",
    },
    label: {
      label: "Label",
      description: "Etiquetas opcionales para identificar este enlace",
      placeholder: "Introduzca una etiqueta para este enlace de participación",
    },
    allowPosting: {
      label: "Permitir la publicación",
      description:
        "Permitir a los destinatarios publicar mensajes en este hilo",
    },
    requireAuth: {
      label: "Require Authentication",
      description:
        "Solicitar a los usuarios que se inscriban para acceder a este enlace",
    },
    response: {
      id: {
        content: "Enlace ID",
      },
      token: {
        content: "Compartir Token",
      },
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Parámetros de enlace de acciones inválidas",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Debes estar conectado para crear enlaces de compartir",
      },
      forbidden: {
        title: "Acceso denegado",
        description:
          "Sólo los hilos en la carpeta compartida se pueden compartir a través de enlaces",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró la conversación",
      },
      server: {
        title: "Error del servidor",
        description: "Failed to create share link",
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
        description: "Este recurso ha sido modificado",
      },
    },
    backButton: {
      label: "Atrás",
    },
    submitButton: {
      label: "Crear enlace",
      loadingText: "Creando...",
    },
    success: {
      title: "Operación completada",
      description: "Enlace compartido creado con éxito",
    },
  },
  patch: {
    title: "Actualización Compartir Enlace",
    titleShort: "Enlace de actualización",
    description: "Actualizar un enlace de compartir existente",
    container: {
      title: "Actualización Compartir Enlace",
      description: "Modificar la configuración de enlaces de compartir",
    },
    linkId: {
      label: "Enlace ID",
      description: "ID del enlace para actualizar",
    },
    label: {
      label: "Label",
      description: "Etiquetas opcionales para identificar este enlace",
      placeholder: "Introduzca una etiqueta para este enlace de participación",
    },
    allowPosting: {
      label: "Permitir la publicación",
      description:
        "Permitir a los destinatarios publicar mensajes en este hilo",
    },
    requireAuth: {
      label: "Require Authentication",
      description:
        "Solicitar a los usuarios que se inscriban para acceder a este enlace",
    },
    deleteAction: {
      text: "Enlace de revocación",
    },
    response: {
      id: {
        content: "Enlace ID",
      },
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Parámetros de actualización inválidos",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description:
          "Debes estar conectado para actualizar enlaces de compartir",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Usted no tiene permiso para actualizar este enlace",
      },
      notFound: {
        title: "No encontrado",
        description: "Enlace de participación no encontrado",
      },
      server: {
        title: "Error del servidor",
        description: "Failed to update share link",
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
        description: "Este recurso ha sido modificado",
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
      description: "Enlace compartido actualizado con éxito",
    },
  },
  delete: {
    title: "Revoke Share Link",
    titleShort: "Enlace de revocación",
    description: "Rechazar un enlace de participación activo",
    container: {
      title: "Revoke Share Link",
      description: "Esto desactivará el enlace permanentemente",
    },
    linkId: {
      label: "Enlace ID",
      description: "ID del enlace para revocar",
    },
    response: {
      id: {
        content: "Enlace ID",
      },
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Enlace inválido ID",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description:
          "Usted debe estar conectado para revocar enlaces de compartir",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes permiso para revocar este enlace",
      },
      notFound: {
        title: "No encontrado",
        description: "Enlace de participación no encontrado",
      },
      server: {
        title: "Error del servidor",
        description: "Fallado para revocar el vínculo de participación",
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
        description: "Este recurso ha sido modificado",
      },
    },
    backButton: {
      label: "Atrás",
    },
    submitButton: {
      label: "Enlace de revocación",
      loadingText: "Revocando...",
    },
    success: {
      title: "Operación completada",
      description: "Compartir enlace revocado con éxito",
    },
  },
  widget: {
    shareDialog: {
      title: "Compartir",
      copyLink: "Copiar el enlace",
    },
    visibility: {
      publicTitle: "Cualquier persona con el enlace puede ver",
      publicDescription:
        "El hilo está en la carpeta compartida. el enlace está en vivo.",
      privateTitle: "Privadas",
      privateDescription: "Sólo usted puede acceder a este hilo.",
      makePublic: "Hacer público",
      makePrivate: "Hacer privado",
      toggling: "Salvando...",
    },
    emailShare: {
      placeholder: "Invitar por correo electrónico",
      send: "Enviar",
    },
    common: {
      close: "Listo",
    },
  },
};
