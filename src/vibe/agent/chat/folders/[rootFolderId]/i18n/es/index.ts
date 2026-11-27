import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    folders: "Carpetas",
  },
  enums: {
    userRole: {
      public: "Público",
      customer: "Cliente",
      partnerAdmin: "Admin de socio",
      partnerEmployee: "Empleado de socio",
      admin: "Administrador",
    },
  },
  widget: {
    config: {
      foldersShort: {
        private: "Privado",
        shared: "Compartido",
        public: "Público",
        incognito: "Incógnito",
        cron: "Segundo plano",
        support: "Soporte",
        remote: "Remoto",
      },
    },
    folderList: {
      menu: "Acciones de carpeta",
      newChatInFolder: "Nuevo chat en la carpeta",
      moveUp: "Subir",
      moveDown: "Bajar",
      newSubfolder: "Nueva subcarpeta",
      managePermissions: "Gestionar permisos",
      projectSettings: "Configuración del proyecto",
      renameFolder: "Renombrar carpeta",
      moveToFolder: "Mover a carpeta",
      deleteFolder: "Eliminar carpeta",
      deleteDialog: {
        title: "Eliminar carpeta",
        description: '¿Seguro que quieres eliminar "{{folderName}}"?',
      },
      pinned: "Fijados",
      pin: "Fijar",
      unpin: "Desfijar",
      today: "Hoy",
      lastWeek: "Últimos 7 días",
      lastMonth: "Últimos 30 días",
      older: "Anteriores",
      showMore: "Mostrar más",
    },
    renameFolder: {
      title: "Renombrar carpeta",
    },
    moveFolder: {
      title: "Mover carpeta",
    },
    newFolder: {
      title: "Crear nueva carpeta",
    },
    project: {
      dialogTitle: "Configuración del proyecto",
    },
    permissions: {
      folderTitle: "Permisos de la carpeta",
    },
    accessModal: {
      title: "Cuenta requerida",
      privateTitle: "Hilos privados",
      sharedTitle: "Hilos compartidos",
      publicTitle: "Foro público",
      incognitoTitle: "Modo incógnito",
      backgroundTitle: "Hilos en segundo plano",
      remoteTitle: "Hilos remotos",
      privateExplanation:
        "Los hilos privados son tu espacio personal para conversar con la IA. Todos tus chats se guardan de forma segura en nuestros servidores y se sincronizan automáticamente en todos tus dispositivos.",
      sharedExplanation:
        "Los hilos compartidos te permiten crear conversaciones y compartirlas con otras personas mediante enlaces seguros. Ideal para colaborar y compartir hallazgos con tu equipo o tus amigos.",
      publicExplanation:
        "El Foro público es un espacio abierto donde personas e IA conversan libremente. Tú decides qué leer. Solo eliminamos lo que infringe la ley o nuestras condiciones. Comparte ideas, cuestiona puntos de vista y participa en debates sin censura.",
      incognitoExplanation:
        "El modo incógnito mantiene tus conversaciones completamente privadas y locales. Tus chats se guardan solo en tu navegador y nunca se envían a nuestros servidores (los archivos generados se almacenan temporalmente por motivos técnicos), sin vincularse a tu cuenta.",
      backgroundExplanation:
        "Las tareas largas no deberían bloquear tu chat. Los hilos en segundo plano son donde tus subagentes y agentes programados trabajan por su cuenta y te informan al terminar.",
      remoteExplanation:
        "Ejecutar tus propias instancias no debería dispersar tus conversaciones entre herramientas. Los hilos remotos reúnen en un solo lugar los chats sincronizados desde tus instancias conectadas.",
      requiresAccount:
        "Para acceder a {{folderName}}, debes crear una cuenta o iniciar sesión.",
      loginButton: "Iniciar sesión",
      signupButton: "Registrarse",
      close: "Cerrar",
    },
    actions: {
      rename: "Renombrar",
      moveToFolder: "Mover a carpeta",
      pin: "Fijar",
      unpin: "Desfijar",
    },
    threadList: {
      deleteDialog: {
        title: "Eliminar hilo",
        description: '¿Seguro que quieres eliminar "{{title}}"?',
      },
    },
    sharedThread: {
      noLinks: "Aún sin compartir. Toca para compartir",
      linkCount: "{{count}} enlace(s) activo(s)",
      shareAction: "Compartir",
      moveToShared: "Mover a Compartidos",
    },
    common: {
      cancel: "Cancelar",
      delete: "Eliminar",
      noChatsFound: "No se encontraron hilos",
      noResults: "No hay hilos que coincidan",
      searchPlaceholder: "Buscar...",
      privateChats: "Hilos privados",
      sharedChats: "Hilos compartidos",
      publicChats: "Hilos públicos",
      incognitoChats: "Hilos de incógnito",
      backgroundChats: "Hilos en segundo plano",
      remoteChats: "Hilos remotos",
      newChat: "Nuevo hilo",
      newPrivateChat: "Hilo privado",
      newSharedChat: "Hilo compartido",
      newPublicChat: "Hilo público",
      newIncognitoChat: "Hilo de incógnito",
      newPrivateFolder: "Nueva carpeta privada",
      newSharedFolder: "Nueva carpeta compartida",
      newPublicFolder: "Nueva carpeta pública",
      newIncognitoFolder: "Nueva carpeta de incógnito",
      newFolder: "Nueva carpeta",
    },
  },
  errors: {
    not_implemented_on_native:
      "{{method}} no está implementado en la plataforma nativa. Usa la versión web para esta operación.",
  },
  config: {
    folders: {
      private: "Privado",
      shared: "Compartido",
      public: "Público",
      background: "Segundo plano",
      incognito: "Incógnito",
      support: "Soporte",
      remote: "Remoto",
    },
  },
  get: {
    title: "Obtener carpetas",
    titleShort: "Carpetas",
    description: "Obtiene todas las carpetas de la carpeta raíz actual",
    rootFolderId: {
      label: "Carpeta raíz",
      description:
        "La carpeta raíz a obtener (privado, compartido, público, segundo plano, incógnito)",
    },
    container: {
      title: "Detalles de la carpeta",
      description: "Ver información de la carpeta",
    },
    id: {
      label: "ID de carpeta",
      description: "El identificador único de la carpeta",
    },
    response: {
      title: "Carpetas",
      description: "Lista de carpetas con sus permisos",
      rootFolderPermissions: {
        title: "Permisos de la carpeta raíz",
        description: "Permisos para la carpeta raíz",
        canCreateThread: {
          content: "Puede crear hilos",
        },
        canCreateFolder: {
          content: "Puede crear carpetas",
        },
      },
      folders: {
        folder: {
          id: { content: "ID" },
          userId: { content: "ID de usuario" },
          name: { content: "Nombre" },
          icon: { content: "Icono" },
          color: { content: "Color" },
          parentId: { content: "Carpeta padre" },
          expanded: { content: "Expandida" },
          sortOrder: { content: "Orden" },
          rootFolderId: {
            content: "Carpeta raíz",
          },
          canManage: {
            content: "Puede gestionar",
          },
          canCreateThread: {
            content: "Puede crear hilos",
          },
          canModerate: {
            content: "Puede moderar",
          },
          canDelete: {
            content: "Puede eliminar",
          },
          canManagePermissions: {
            content: "Puede gestionar permisos",
          },
          createdAt: {
            content: "Creada el",
          },
          updatedAt: {
            content: "Actualizada el",
          },
        },
      },
      folder: {
        title: "Carpeta",
        id: {
          content: "ID",
        },
        userId: {
          content: "ID de usuario",
        },
        name: {
          content: "Nombre",
        },
        icon: {
          content: "Icono",
        },
        color: {
          content: "Color",
        },
        parentId: {
          content: "Carpeta padre",
        },
        expanded: {
          content: "Expandida",
        },
        sortOrder: {
          content: "Orden",
        },
        metadata: {
          content: "Metadatos",
        },
        createdAt: {
          content: "Creada el",
        },
        updatedAt: {
          content: "Actualizada el",
        },
      },
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "El ID de carpeta proporcionado no es válido",
      },
      unauthorized: {
        title: "No autorizado",
        description: "Debes iniciar sesión para ver las carpetas",
      },
      forbidden: {
        title: "Prohibido",
        description: "No tienes permiso para ver esta carpeta",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró la carpeta solicitada",
      },
      server: {
        title: "Error del servidor",
        description: "Ocurrió un error al obtener la carpeta",
      },
      network: {
        title: "Error de red",
        description: "No se pudo conectar con el servidor",
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
        description: "Ocurrió un conflicto al procesar tu solicitud",
      },
    },
    success: {
      title: "Éxito",
      description: "Carpeta obtenida correctamente",
    },
  },
  patch: {
    title: "Actualizar carpeta",
    description: "Actualiza una carpeta existente",
    container: {
      title: "Actualizar carpeta",
      description: "Modifica las propiedades de la carpeta",
    },
    id: {
      label: "ID de carpeta",
      description: "El identificador único de la carpeta a actualizar",
    },
    sections: {
      updates: {
        title: "Cambios de la carpeta",
        description: "Campos a actualizar",
      },
    },
    name: {
      label: "Nombre",
      description: "El nombre de la carpeta",
    },
    icon: {
      label: "Icono",
      description: "Nombre del icono de Lucide o Simple Icons",
    },
    color: {
      label: "Color",
      description: "Código hexadecimal de color para distinción visual",
    },
    parentId: {
      label: "Carpeta padre",
      description: "Mueve la carpeta a otro padre (null para raíz)",
    },
    expanded: {
      label: "Expandida",
      description: "Indica si la carpeta está expandida en la interfaz",
    },
    sortOrder: {
      label: "Orden",
      description: "Orden de clasificación de las carpetas",
    },
    metadata: {
      label: "Metadatos",
      description: "Metadatos adicionales de la carpeta",
    },
    rolesView: {
      label: "Roles de lectura",
      description: "Roles que pueden ver esta carpeta",
    },
    rolesManage: {
      label: "Roles de gestión",
      description: "Roles que pueden gestionar la configuración de la carpeta",
    },
    rolesCreateThread: {
      label: "Roles para crear hilos",
      description: "Roles que pueden crear hilos en esta carpeta",
    },
    rolesPost: {
      label: "Roles para publicar",
      description: "Roles que pueden publicar mensajes",
    },
    rolesModerate: {
      label: "Roles de moderación",
      description: "Roles que pueden moderar contenido",
    },
    rolesAdmin: {
      label: "Roles de administración",
      description: "Roles con acceso administrativo completo",
    },
    response: {
      title: "Carpeta actualizada",
      description: "Detalles de la carpeta actualizada",
      folder: {
        title: "Carpeta",
        id: {
          content: "ID",
        },
        userId: {
          content: "ID de usuario",
        },
        name: {
          content: "Nombre",
        },
        icon: {
          content: "Icono",
        },
        color: {
          content: "Color",
        },
        parentId: {
          content: "Carpeta padre",
        },
        expanded: {
          content: "Expandida",
        },
        sortOrder: {
          content: "Orden",
        },
        metadata: {
          content: "Metadatos",
        },
        createdAt: {
          content: "Creada el",
        },
        updatedAt: {
          content: "Actualizada el",
        },
      },
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Los datos proporcionados no son válidos",
        circularReference:
          "No se puede establecer la carpeta como su propio padre",
      },
      unauthorized: {
        title: "No autorizado",
        description: "Debes iniciar sesión para actualizar carpetas",
      },
      forbidden: {
        title: "Prohibido",
        description: "No tienes permiso para actualizar esta carpeta",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró la carpeta solicitada",
      },
      server: {
        title: "Error del servidor",
        description: "Ocurrió un error al actualizar la carpeta",
      },
      network: {
        title: "Error de red",
        description: "No se pudo conectar con el servidor",
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
        description: "Ya existe una carpeta con este nombre",
      },
    },
    success: {
      title: "Éxito",
      description: "Carpeta actualizada correctamente",
    },
  },
  delete: {
    title: "Eliminar carpeta",
    description: "Elimina una carpeta y todo su contenido",
    container: {
      title: "Eliminar carpeta",
      description: "Eliminar la carpeta de forma permanente",
    },
    id: {
      label: "ID de carpeta",
      description: "El identificador único de la carpeta a eliminar",
    },
    response: {
      title: "Resultado de la eliminación",
      description: "Confirmación de eliminación de la carpeta",
      success: {
        content: "Éxito",
      },
      deletedFolderId: {
        content: "ID de carpeta eliminada",
      },
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "El ID de carpeta proporcionado no es válido",
      },
      unauthorized: {
        title: "No autorizado",
        description: "Debes iniciar sesión para eliminar carpetas",
      },
      forbidden: {
        title: "Prohibido",
        description: "No tienes permiso para eliminar esta carpeta",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró la carpeta solicitada",
      },
      server: {
        title: "Error del servidor",
        description: "Ocurrió un error al eliminar la carpeta",
      },
      network: {
        title: "Error de red",
        description: "No se pudo conectar con el servidor",
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
        description: "No se puede eliminar una carpeta con contenido activo",
      },
    },
    success: {
      title: "Éxito",
      description: "Carpeta eliminada correctamente",
    },
  },
  post: {
    errors: {
      forbidden: {
        title: "Prohibido",
        incognitoNotAllowed:
          "Las carpetas no son compatibles con el modo incógnito",
      },
      unauthorized: {
        title: "No autorizado",
      },
      server: {
        title: "Error del servidor",
      },
    },
  },
};
