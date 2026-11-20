import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Notificaciones",

  tags: {
    notifications: "notificaciones",
    list: "lista",
    unread: "sin leer",
    read: "lee",
  },

  enums: {
    type: {
      taskComplete: "Tarea terminada",
      taskFailed: "La tarea falló",
      earning: "Earning",
      dreamerResult: "Resultado de Dreamer",
      creditLow: "Créditos bajos",
      system: "Sistema",
    },
  },

  // Copy per type. Rendered in the recipient's own locale when the
  // notification is created. {{params}} come from the event source.
  templates: {
    taskComplete: {
      title: "{{name}} terminó",
      body: "Su tarea de fondo se hace. Abre el resultado.",
    },
    taskFailed: {
      title: "{{name}} falló",
      body: "Su tarea de fondo causó un error. Ábrelo para ver por qué.",
    },
    earning: {
      title: "Te ganaste créditos {{amount}}",
      body: "Una derivación que ganaba despejó su período de retención y ahora es gastable.",
    },
    dreamerResult: {
      title: "{{name}} tiene un resultado",
      body: "Tu sesión de Dreamer terminó.",
    },
    creditLow: {
      title: "Créditos que se agotan",
      body: "{{amount}} créditos dejados. Sube antes de tus próximos puestos.",
    },
    system: {
      title: "{{name}}",
      body: "",
    },
    fallbackTaskName: "Tareas de antecedentes",
  },

  list: {
    get: {
      title: "Notificaciones",
      titleShort: "Notificaciones",
      description:
        "Todo lo que terminó mientras estabas fuera. No leas primero.",
      emptyTitle: "Nada nuevo",
      emptyHint: "Las tareas terminadas y las ganancias aparecen aquí.",
      markAllRead: "Marcar todo leído",
      unread: "No.",
      response: {
        notifications: {
          id: "ID",
          type: "Tipo",
          title: "Título",
          body: "Mensaje",
          link: "Enlace",
          read: "Leer",
          createdAt: "Recibidos",
        },
        unreadCount: "No.",
      },
      paginationInfo: {
        label: "Pagination",
      },
    },
  },

  unreadCount: {
    get: {
      title: "Cuente de notificación deslegada",
      titleShort: "Cuentas sin leer",
      description: "Cuantas notificaciones aún no has abierto.",
      response: {
        unreadCount: "Notificaciones no leídos",
      },
    },
  },

  read: {
    post: {
      title: "Se leen las notificaciones de marca",
      titleShort: "Mark leyó",
      description:
        "Marcar una notificación, o todos ellos, como se lee. Envía una id o all=true.",
      id: {
        label: "Notificación ID",
        description: "La notificación para marcar lee",
      },
      all: {
        label: "Marcar todo lo que lee",
        description: "Despejar toda la lista desleída",
      },
      response: {
        updatedCount: "Leído marcado",
      },
      submit: {
        label: "Mark leyó",
        loading: "Actualizando...",
      },
    },
  },

  bell: {
    label: "Notificaciones",
    empty: "Están todos atrapados.",
    markAllRead: "Marcar todo leído",
    viewAll: "Ver todo",
    loading: "Cargando...",
    unreadBadge: "{{count}} notificaciones sin leer",
  },

  errors: {
    validation: {
      title: "Error de validación",
      description: "Enviar una notificación id, o all=true",
    },
    network: {
      title: "Error de red",
      description: "Error de conexión de red",
    },
    unauthorized: {
      title: "Se requiere autenticación",
      description: "Inicia sesión para ver tus notificaciones",
    },
    forbidden: {
      title: "Acceso denegado",
      description: "No tienes acceso",
    },
    notFound: {
      title: "No encontrado",
      description: "Notificación no encontrada",
    },
    server: {
      title: "Error del servidor",
      description: "Ocurrió un error interno del servidor",
    },
    serverError: {
      title: "Error del servidor",
      description: "Ocurrió un error interno del servidor",
      detail: "Algo estalló en nuestro extremo: {{error}}",
    },
    unknown: {
      title: "Error desconocido",
      description: "Ocurrió un error desconocido",
    },
    unsavedChanges: {
      title: "Cambios sin guardar",
      description: "Tienes cambios sin guardar",
    },
    conflict: {
      title: "Conflicto",
      description: "Notificación de conflicto estatal",
    },
    idOrAllRequired: "Enviar una notificación id, o all=true.",
  },

  success: {
    title: "Operación completada",
    description: "La operación se completó correctamente",
  },
};
