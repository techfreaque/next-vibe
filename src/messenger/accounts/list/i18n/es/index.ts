import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    messaging: "Mensajería",
  },
  title: "Cuentas de Mensajero",
  titleShort: "Cuentas",
  description: "Listar todas las cuentas de mensajero en todos los canales",

  fields: {
    channel: {
      label: "Canal",
      description: "Filtro por canal",
    },
    provider: {
      label: "Proveedor",
      description: "Filtro por proveedor",
    },
    status: {
      label: "Situación",
      description: "Filtro por estado de cuenta",
    },
    search: {
      label: "Buscar",
      description: "Búsqueda por nombre o descripción",
      placeholder: "Cuentas de búsqueda...",
    },
    page: {
      label: "Página",
      description: "Número de página para la paginación",
    },
    limit: {
      label: "Limitación",
      description: "Número de cuentas por página",
    },
    sortBy: {
      label: "Ordenar por",
      description: "Clasificar cuentas por campo",
    },
    sortOrder: {
      label: "Ordenar orden",
      description: "Ordenar (asignar o descender)",
    },
  },

  response: {
    account: {
      title: "Cuenta",
      description: "Detalles de la cuenta de Messenger",
      id: "ID",
      name: "Nombre",
      channel: "Canal",
      provider: "Proveedor",
      status: "Situación",
      healthStatus: "Salud",
      priority: "Prioridad",
      messagesSentTotal: "Mensajes enviados",
      lastUsedAt: "Último usado",
      createdAt: "Creado",
      isDefault: "Predeterminado",
      smtpFromEmail: "De correo electrónico",
      fromId: "De ID",
    },
    pagination: {
      title: "Pagination",
      description: "Información sobre la pagización",
      page: "Página",
      limit: "Por página",
      total: "Total",
      totalPages: "Total de páginas",
    },
  },

  widget: {
    create: "Add Account",
    graphs: "Gráficos",
    refresh: "Actualizar",
    emptyState: "No hay cuentas de mensajero configuradas",
    searchPlaceholder: "Cuentas de búsqueda...",
    deleteConfirm: "¿Supir esta cuenta?",
    deleteConfirmYes: "Eliminar",
    deleteConfirmNo: "Cancelar",
  },

  errors: {
    validation: {
      title: "Error de validación",
      description: "Parámetros de filtro inválidos",
    },
    unauthorized: {
      title: "Se requiere autenticación",
      description: "Acceso de los administradores necesario",
    },
    forbidden: {
      title: "Acceso denegado",
      description: "Acceso denegado",
    },
    notFound: {
      title: "No encontrado",
      description: "No se encontró el recurso",
    },
    conflict: {
      title: "Conflicto",
      description: "Hay un conflicto entre los datos",
    },
    server: {
      title: "Error del servidor",
      description: "Fallado para recuperar cuentas",
      detail: "No podía cargar cuentas: {{error}}",
    },
    networkError: {
      title: "Error de red",
      description: "La comunicación de redes falló",
    },
    unsavedChanges: {
      title: "Cambios sin guardar",
      description: "Tienes cambios sin guardar",
    },
    unknown: {
      title: "Error desconocido",
      description: "Ocurrió un error inesperado",
    },
  },

  success: {
    title: "Cuentas conseguidas",
    description: "Cuentas de mensajeros recuperadas con éxito",
  },

  enums: {
    channel: {
      email: "Correo electrónico",
      sms: "SMS",
      whatsapp: "WhatsApp",
      telegram: "Telegram",
    },
    channelFilter: {
      any: "Todos los canales",
    },
    provider: {
      smtp: "SMTP",
      resend: "Resend",
      ses: "Amazon SES",
      mailgun: "Mailgun",
      sendgrid: "SendGrid",
      mailjet: "Mailjet",
      postmark: "Postmark",
      twilio: "Twilio",
      awsSns: "AWS SNS",
      messagebird: "MessageBird",
      http: "HTTP",
      whatsappBusiness: "WhatsApp Business",
      telegramBot: "Telegram Bot",
    },
    providerFilter: {
      any: "Todos los proveedores",
    },
    status: {
      active: "Activa",
      inactive: "Inactivo",
      error: "Error",
      testing: "Pruebas",
    },
    statusFilter: {
      any: "Todos los estatutos",
    },
    healthStatus: {
      healthy: "Salud",
      degraded: "Degradado",
      unhealthy: "Insalubres",
      unknown: "Desconocida",
    },
    healthStatusFilter: {
      any: "Todos",
    },
    sortField: {
      name: "Nombre",
      channel: "Canal",
      provider: "Proveedor",
      status: "Situación",
      priority: "Prioridad",
      messagesSentTotal: "Mensajes enviados",
      lastUsedAt: "Último usado",
      createdAt: "Creado",
    },
    sortOrder: {
      asc: "Ascendencia",
      desc: "Descendiente",
    },
  },
};
