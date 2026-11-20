import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    threads: "Conversaciones",
    permissions: "Permisos",
  },
  enums: {
    userRole: {
      public: "Público",
      customer: "Cliente",
      partnerAdmin: "Administrador del socio",
      partnerEmployee: "Empleado del socio",
      admin: "Administrador",
    },
  },
  dialog: {
    title: "Permisos de pan: {{threadTitle}}",
  },
  get: {
    title: "Obtenga permisos de lectura",
    titleShort: "Acceso al pan",
    description: "Recuperar la lista de moderadores para un hilo específico",
    container: {
      title: "Permisos de la conversación",
      description: "Ver y gestionar permisos de acceso a los hilos",
    },
    threadId: {
      label: "Thread ID",
      description: "El identificador único del hilo",
    },
    response: {
      title: "Permisos de la conversación",
      rolesView: {
        label: "Funciones de vista",
        description: "Papeles que pueden ver este hilo",
      },
      rolesEdit: {
        label: "Editar funciones",
        description:
          "Funciones que pueden editar la configuración de los hilos",
      },
      rolesPost: {
        label: "Funciones de puestos",
        description: "Funciones que pueden publicar mensajes",
      },
      rolesModerate: {
        label: "Funciones moderadas",
        description: "Funciones que pueden moderar el contenido",
      },
      rolesAdmin: {
        label: "Funciones de los administradores",
        description: "Funciones con pleno acceso administrativo",
      },
      moderatorIds: {
        title: "Identificación de Moderadores",
        description: "Lista de ID de usuario que pueden moderar este hilo",
        content: "Usuario ID",
      },
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Los datos proporcionados son inválidos",
      },
      network: {
        title: "Error de red",
        description:
          "Se produjo un error de red al recuperar permisos de rosca",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Usted debe estar conectado para ver permisos de rosca",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes permiso para ver los permisos de este hilo",
      },
      notFound: {
        title: "No encontrado",
        description: "El hilo solicitado no fue encontrado",
      },
      server: {
        title: "Error del servidor",
        description: "Se produjo un error al recuperar permisos de rosca",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
      unsaved: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
      conflict: {
        title: "Conflicto",
        description: "Hubo un conflicto con el estado actual",
      },
    },
    backButton: {
      label: "Atrás",
    },
    success: {
      title: "Operación completada",
      description: "Thread permissions retrieved successfully",
    },
  },
  patch: {
    title: "Actualizar las Permisiones de Thread",
    titleShort: "Acceso al pan",
    description: "Actualizar la lista de moderadores para un hilo específico",
    container: {
      title: "Actualizar las Permisiones de Thread",
      description: "Modificar los permisos de acceso a roscas",
    },
    threadId: {
      label: "Thread ID",
      description: "El identificador único del hilo para actualizar",
    },
    rolesView: {
      label: "Funciones de vista",
      description: "Papeles que pueden ver este hilo",
    },
    rolesEdit: {
      label: "Editar funciones",
      description: "Funciones que pueden editar la configuración de los hilos",
    },
    rolesPost: {
      label: "Funciones de puestos",
      description: "Funciones que pueden publicar mensajes",
    },
    rolesModerate: {
      label: "Funciones moderadas",
      description: "Funciones que pueden moderar el contenido",
    },
    rolesAdmin: {
      label: "Funciones de los administradores",
      description: "Funciones con pleno acceso administrativo",
    },
    permissions: {
      title: "Actualización de las misiones",
      moderatorIds: {
        label: "Identificación de Moderadores",
        description: "Lista de ID de usuario que pueden moderar este hilo",
      },
    },
    response: {
      title: "Permisos actualizados",
      rolesView: {
        label: "Funciones de vista",
        description: "Papeles que pueden ver este hilo",
      },
      rolesEdit: {
        label: "Editar funciones",
        description:
          "Funciones que pueden editar la configuración de los hilos",
      },
      rolesPost: {
        label: "Funciones de puestos",
        description: "Funciones que pueden publicar mensajes",
      },
      rolesModerate: {
        label: "Funciones moderadas",
        description: "Funciones que pueden moderar el contenido",
      },
      rolesAdmin: {
        label: "Funciones de los administradores",
        description: "Funciones con pleno acceso administrativo",
      },
      message: {
        content: "Thread permissions updated successfully",
      },
      moderatorIds: {
        title: "Moderadores actuales",
        description: "Lista actualizada de moderadores para este hilo",
        content: "Usuario ID",
      },
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Los ID de moderador proporcionados son inválidos",
      },
      network: {
        title: "Error de red",
        description:
          "Se produjo un error de red al actualizar los permisos de rosca",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description:
          "Debes estar conectado para actualizar los permisos de rosca",
      },
      forbidden: {
        title: "Acceso denegado",
        description:
          "Usted no tiene permiso para actualizar los permisos de este hilo",
      },
      notFound: {
        title: "No encontrado",
        description: "El hilo solicitado no fue encontrado",
      },
      server: {
        title: "Error del servidor",
        description: "Se produjo un error al actualizar los permisos de rosca",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
      unsaved: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
      conflict: {
        title: "Conflicto",
        description: "Hubo un conflicto con el estado actual",
      },
    },
    backButton: {
      label: "Atrás",
    },
    submitButton: {
      label: "Guardar permisos",
      loadingText: "Salvando...",
    },
    success: {
      title: "Operación completada",
      description: "Thread permissions updated successfully",
    },
  },
};
