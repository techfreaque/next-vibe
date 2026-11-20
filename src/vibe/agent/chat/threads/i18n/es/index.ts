import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    threads: "Conversaciones",
  },
  enums: {
    threadStatus: {
      active: "Activa",
      archived: "Archivado",
      deleted: "Suprimidos",
    },
  },
  errors: {
    count_failed: "Fallado para conseguir el conteo de conversación: {{error}}",
  },
  get: {
    title: "Conversaciones",
    titleShort: "Conversaciones",
    description:
      "Recuperar una lista paginada de hilos de chat con opciones de filtrado",
    container: {
      title: "Lista de distribución",
      description: "Explorar y filtrar hilos de chat",
    },
    sections: {
      pagination: {
        title: "Pagination",
        description: "Ajustes de navegación de página",
      },
      filters: {
        title: "Filtros",
        description: "Filtros por criterios",
      },
    },
    page: {
      label: "Página",
      description: "Número de página para recuperar",
    },
    limit: {
      label: "Limitación",
      description: "Número de hilos por página",
    },
    rootFolderId: {
      label: "Root Folder",
      description:
        "Filtro por carpeta raíz (privado, compartido, público, incognito)",
    },
    subFolderId: {
      label: "Subcarpeta",
      description: "Filtro por subcarpeta ID (opcional)",
    },
    status: {
      label: "Situación",
      description: "Filtro por estado de rosca",
    },
    search: {
      label: "Buscar",
      description: "Buscar hilos por título o contenido",
      placeholder: "Búsqueda de hilos...",
    },
    isPinned: {
      label: "Pinned Only",
      description: "Filtro para mostrar sólo hilos enfilados",
    },
    dateFrom: {
      label: "Fecha a partir de",
      description: "Filtros creados después de esta fecha",
    },
    dateTo: {
      label: "Fecha a",
      description: "Filtros creados antes de esta fecha",
    },
    response: {
      title: "Respuesta de la lista de distribución",
      description: "Listado de hilos empañados",
      threads: {
        thread: {
          title: "Thread",
          id: {
            content: "Thread ID",
          },
          threadTitle: {
            content: "Título",
          },
          rootFolderId: {
            content: "Root Folder",
          },
          folderId: {
            content: "Subcarpeta ID",
          },
          status: {
            content: "Situación",
          },
          preview: {
            content: "Vista previa",
          },
          pinned: {
            content: "Pinned",
          },
          archived: {
            content: "Archivado",
          },
          streamingState: {
            content: "Estado de la corriente",
          },
          createdAt: {
            content: "Creado en",
          },
          updatedAt: {
            content: "Actualizado en",
          },
          canEdit: {
            content: "Puede editar",
          },
          canPost: {
            content: "Can Post",
          },
          canModerate: {
            content: "Puede moderar",
          },
          canDelete: {
            content: "Puede Borrar",
          },
          canManagePermissions: {
            content: "Puede administrar las permisos",
          },
        },
      },
      totalCount: {
        content: "Total Conde",
      },
      pageCount: {
        content: "Cuenta de página",
      },
      page: {
        content: "Página actual",
      },
      limit: {
        content: "Temas por página",
      },
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Parámetros de solicitud no válidos",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Usted debe estar conectado para ver los hilos",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes permiso para ver los hilos",
      },
      notFound: {
        title: "No encontrado",
        description: "No hay hilos encontrados",
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
      description: "Los hilos recuperados con éxito",
    },
  },
  post: {
    title: "Nueva conversación",
    titleShort: "Nueva conversación",
    description: "Crear un nuevo hilo de chat",
    form: {
      title: "Crear hilo",
      description: "Configuración de nuevos hilos",
    },
    sections: {
      thread: {
        title: "Detalles del pan",
        description: "Información básica sobre los hilos",
      },
    },
    id: {
      label: "Thread ID",
      description: "Hilo generado por el cliente ID",
    },
    threadTitle: {
      label: "Título",
      description: "Título del pan",
      placeholder: "Ingrese el título del hilo...",
      default: "Nuevo chat",
    },
    rootFolderId: {
      label: "Root Folder",
      description: "Carpeta de raíz (privada, compartida, pública, incognito)",
    },
    subFolderId: {
      label: "Subcarpeta",
      description: "Subcarpeta para colocar el hilo en (opcional)",
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
      placeholder: "Ingrese el sistema rápido...",
    },
    response: {
      title: "Creado pan",
      description: "Nuevos detalles de hilo creados",
      thread: {
        title: "Thread",
        id: {
          content: "Thread ID",
        },
        threadTitle: {
          content: "Título",
        },
        rootFolderId: {
          content: "Root Folder",
        },
        subFolderId: {
          content: "Subcarpeta ID",
        },
        status: {
          content: "Situación",
        },
        createdAt: {
          content: "Creado en",
        },
        updatedAt: {
          content: "Actualizado en",
        },
        canEdit: {
          content: "Puede editar",
        },
        canPost: {
          content: "Can Post",
        },
        canModerate: {
          content: "Puede moderar",
        },
        canDelete: {
          content: "Puede Borrar",
        },
        canManagePermissions: {
          content: "Puede administrar las permisos",
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
        description: "Usted debe estar conectado para crear hilos",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes permiso para crear hilos",
        incognitoNotAllowed:
          "Los hilos de incógnito no se pueden crear en el servidor",
        cannotCreateHere: "No puedes crear un hilo en esta ubicación",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso",
        folderNotFound: "Carpeta no encontrada",
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
        description: "Un hilo con este nombre ya existe",
      },
    },
    success: {
      title: "Operación completada",
      description: "Thread creado con éxito",
    },
  },
  widget: {
    common: {
      noChatsFound: "No se encontraron chats",
      delete: "Eliminar",
      cancel: "Cancelar",
    },
    actions: {
      menu: "Thread actions",
      rename: "Cambiar nombre",
      unpin: "Dejar de fijar",
      pin: "Fijar arriba",
      unarchive: "Desarchivar",
      archive: "Archivar",
      manageSharing: "Gestionar el acceso",
      moveToFolder: "Mover a una carpeta",
      unfiled: "Infiled",
    },
    folderList: {
      managePermissions: "Gestionar permisos",
      today: "Hoy",
      lastWeek: "Últimos 7 días",
      lastMonth: "Últimos 30 días",
      older: "Más antiguos",
    },
    threadList: {
      deleteDialog: {
        title: "Eliminar conversación",
        description:
          "¿Quieres eliminar «{{title}}»? Se borrarán todos los mensajes de la conversación de forma permanente.",
      },
    },
    suggestedPrompts: {
      starters: {
        explain: {
          label: "Explíquelo simplemente",
          prompt:
            "Explique cómo funciona la inflación como si tuviera 12. Corto y concreto.",
        },
        search: {
          label: "Buscar en la web",
          prompt:
            "¿Cuáles fueron las mayores historias tecnológicas esta semana? Busca y dame fuentes.",
        },
        image: {
          label: "Hacer una imagen",
          prompt:
            "Generar una imagen de una acogedora cabaña en una tormenta de nieve por la noche, luz cálida en las ventanas.",
        },
        honest: {
          label: "Consigue la toma honesta",
          prompt:
            "Dame el caso más fuerte para y contra el cripto. Sin cobertura, sin renuncias.",
        },
      },
      backgroundTitle: "Sus agentes de AI están trabajando",
      backgroundDescription:
        "Los subagentes y agentes autónomos de fondo realizan tareas aquí mientras se centran en otros lugares. Los resultados se dejan caer automáticamente.",
    },
    emptyState: {
      changeCompanion: "Cambiar compañero o modelo. {{name}}",
      folder: {
        private: { label: "Privadas", note: "Sincronizado a tu cuenta." },
        incognito: {
          label: "Incognito",
          note: "Sólo en este navegador. Nunca se sincroniza.",
        },
        shared: {
          label: "Compartida",
          note: "Cualquiera con el enlace puede leer.",
        },
        public: { label: "Público", note: "Visible para todos." },
        cron: {
          label: "Antecedentes",
          note: "Los agentes trabajan aquí solos.",
        },
        remote: { label: "Remoto", note: "Corre en tu instancia conectada." },
      },
      use: {
        everyday: {
          good: "Investigación, escritura y tareas diarias",
          weak: "Lo juega seguro en la política",
        },
        politics: {
          good: "Respuestas directas sobre política y temas tabú",
          weak: "Texto sólo, menos nítido en tareas complejas",
        },
        security: {
          good: "Trabajos de seguridad ofensivo y defensivo",
          weak: "Lo juega seguro en la política",
        },
        writing: {
          good: "Escribir cuidadosamente, código y análisis",
          weak: "Setos o se niegan a temas de educación",
        },
        images: {
          good: "Lea imágenes de pantalla, fotos y vídeo",
          weak: "Cuidado con los temas ledgy",
        },
        classic: {
          good: "Reparador fiable para código y planificación",
          weak: "Cuidado con los temas ledgy",
        },
        bold: {
          good: "Respuestas claras y opinadas",
          weak: "No es la elección para la política",
        },
        general: {
          good: "Cuestiones generales",
          weak: "No es la elección para la política",
        },
      },
      mode: {
        autoModel: "Recibido automáticamente",
        goodAt: "Bien en:",
        weakAt: "Debilidad en:",
      },
      spotlight: {
        adultsOnly: "18+",
        title: "Elige cómo funciona {{name}}.",
        subtitle:
          "Cada modo ejecuta un modelo diferente. O simplemente escribir para empezar.",
        now: "Modo actual: {{mode}}",
        runsOn: "Corresponde",
        allModes: "Todos los modos",
        fix: {
          politics: "¿Política? Cambiar a {{mode}}",
          complex: "¿Una tarea compleja? Cambiar a {{mode}}",
        },
      },
      single: {
        title: "Chat con {{name}}.",
        action: "Cambiar a {{companion}} para más modos",
      },
      companion: {
        title: "¿Quién debería responder?",
        subtitle:
          "Cada compañero tiene su propia personalidad y un conjunto de modelos para diferentes trabajos.",
        skip: "O simplemente escribir para empezar sin un compañero.",
        skipModel: "O simplemente escribe. {{model}} responde, no persona.",
        about: {
          thea: "Cálido y reflexivo. Lo habla.",
          hermes: "Directo y rápido. Se hace el trabajo.",
        },
      },
      custom: {
        title: "Tu habilidad personalizada está lista.",
        subtitle:
          "Cambiar la habilidad o el modelo del selector debajo de la caja del mensaje.",
      },
    },
  },
  publicFeed: {
    timestamp: {
      justNow: "Ahora.",
      hoursAgo: "{{hours}} h hace mucho",
      daysAgo: "{{days}} d hace tiempo",
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
};
