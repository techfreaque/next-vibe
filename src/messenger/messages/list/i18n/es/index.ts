import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Emails",
  tags: {
    emails: "Emails",
  },
  title: "Lista de correo electrónico",
  titleShort: "Lista de correo electrónico",
  description:
    "Recuperar una lista de correos electrónicos con filtro y paginación",
  container: {
    title: "Lista de correo electrónico",
    description:
      "Configurar parámetros de lista de correo electrónico y ver resultados",
  },
  filters: {
    title: "Filtros",
    description: "Filtrar y buscar correos electrónicos",
  },
  displayOptions: {
    title: "Opciones de visualización",
  },
  fields: {
    dateRange: {
      title: "Fecha de rango",
    },
    page: {
      label: "Página",
      description: "Número de página para la paginación",
      placeholder: "Introduzca el número de página",
    },
    limit: {
      label: "Limitación",
      description: "Número de artículos por página",
      placeholder: "Ingrese el límite",
    },
    search: {
      label: "Buscar",
      description:
        "Buscar correos electrónicos por tema, destinatario o remitente",
      placeholder: "Buscar correos electrónicos...",
    },
    status: {
      label: "Situación",
      description: "Filtro por estado de correo electrónico",
      placeholder: "Seleccione el estado",
    },
    channel: {
      label: "Canal",
      description: "Filtro por canal de mensaje",
    },
    type: {
      label: "Tipo",
      description: "Filtro por tipo de correo electrónico",
      placeholder: "Seleccione el tipo",
    },
    sortBy: {
      label: "Ordenar por",
      description: "Campo para ordenar",
      placeholder: "Seleccionar campo de tipo",
    },
    sortOrder: {
      label: "Ordenar orden",
      description: "Ordenar dirección",
      placeholder: "Seleccione el orden",
    },
    dateFrom: {
      label: "Fecha a partir de",
      description: "Filtrar correos electrónicos desde esta fecha",
      placeholder: "Seleccione la fecha de inicio",
    },
    dateTo: {
      label: "Fecha a",
      description: "Filtrar correos electrónicos hasta esta fecha",
      placeholder: "Seleccionar la fecha final",
    },
  },
  response: {
    emails: {
      title: "Emails",
      emptyState: {
        title: "No se han encontrado emails",
        description: "No hay emails que coincidan con sus filtros actuales",
      },
      item: {
        title: "Correo electrónico",
        description: "Detalles del correo electrónico",
        id: "ID",
        subject: "Asunto",
        recipientEmail: "Recipiente Email",
        recipientName: "Nombre del destinatario",
        senderEmail: "Correo electrónico del remitente",
        senderName: "Nombre del remitente",
        type: "Tipo",
        status: "Situación",
        channel: "Canal",
        templateName: "Nombre de la plantilla",
        emailProvider: "Proveedor de correo electrónico",
        externalId: "ID externo",
        sentAt: "Enviado",
        deliveredAt: "Entregado",
        openedAt: "Abierto en",
        clickedAt: "Seguido en",
        retryCount: "Conde de reingreso",
        error: "Error",
        userId: "Usuario ID",
        leadId: "ID del contacto",
        createdAt: "Creado en",
        updatedAt: "Actualizado en",
        emailCore: {
          title: "Información básica",
        },
        emailParties: {
          title: "Recipiente del remitente",
        },
        emailMetadata: {
          title: "Metadatos",
        },
        emailEngagement: {
          title: "Seguimiento de la participación",
        },
        technicalDetails: {
          title: "Detalles técnicos",
        },
        associatedIds: {
          title: "IDs asociadas",
        },
        timestamps: {
          title: "Timestamps",
        },
      },
    },
    pagination: {
      title: "Pagination",
      description: "Información sobre la pagización",
      page: "Página actual",
      limit: "Temas por página",
      total: "Total de artículos",
      totalPages: "Total de páginas",
    },
    filters: {
      title: "Filtros aplicados",
      description: "Filtros aplicados actualmente",
      status: "Filtro de estado",
      type: "Tipo Filtro",
      search: "Búsqueda",
      dateFrom: "Fecha de inicio",
      dateTo: "Fecha final",
    },
  },
  errors: {
    validation: {
      title: "Error de validación",
      description: "Los parámetros proporcionados son inválidos",
    },
    unauthorized: {
      title: "Se requiere autenticación",
      description: "Debe ser autenticado para acceder a este recurso",
    },
    forbidden: {
      title: "Acceso denegado",
      description: "Usted no tiene permiso para acceder a este recurso",
    },
    notFound: {
      title: "No encontrado",
      description: "No se encontró el recurso solicitado",
    },
    server: {
      title: "Error del servidor",
      description: "Se produjo un error de servidor interno",
      detail_list: "No podía cargar mensajes: {{error}}",
      detail_get: "No podía cargar el mensaje: {{error}}",
      detail_create: "No pude guardar el mensaje: {{error}}",
    },
    unknown: {
      title: "Error desconocido",
      description: "Ocurrió un error inesperado",
    },
    unsaved: {
      title: "Cambios sin guardar",
      description: "Tienes cambios sin guardar",
    },
    conflict: {
      title: "Conflicto",
      description: "La solicitud entra en conflicto con el estado actual",
    },
    network: {
      title: "Error de red",
      description: "Se produjo un error de red",
    },
  },
  success: {
    title: "Operación completada",
    description: "Correos electrónicos recuperados con éxito",
  },
  widget: {
    to: "A",
    retries: "Retries",
    opened: "Abierto",
    clicked: "Seguido",
    stats: "Stats",
    graphs: "Gráficos",
    refresh: "Actualizar",
    searchPlaceholder: "Buscar correos electrónicos...",
    clearSearch: "Limpiar",
    emptyState: "No se han encontrado emails",
    emptyFiltered: "No hay emails que coincidan con sus filtros",
    page: "Página",
    tabs: {
      all: "Todos",
      sent: "Sent",
      delivered: "Entrega",
      opened: "Abierto",
      failed: "Failed",
      bounced: "Bounced",
    },
  },
  enums: {
    status: {
      pending: "Pendiente",
      sent: "Sent",
      delivered: "Entrega",
      opened: "Abierto",
      clicked: "Seguido",
      bounced: "Bounced",
      failed: "Failed",
      unsubscribed: "Suscripción cancelada",
    },
    statusFilter: {
      any: "Todos los estatutos",
    },
    type: {
      transactional: "Transaccional",
      marketing: "Marketing",
      notification: "Notificación",
      system: "Sistema",
      leadCampaign: "Campaña de captación de contactos",
      userCommunication: "Comunicación de usuario",
    },
    typeFilter: {
      any: "Todos los tipos",
    },
    channel: {
      email: "Correo electrónico",
      sms: "SMS",
      whatsapp: "WhatsApp",
      telegram: "Telegram",
    },
    channelFilter: {
      any: "Todos los canales",
    },
    sortField: {
      subject: "Asunto",
      recipientEmail: "Recipiente Email",
      recipientName: "Nombre del destinatario",
      type: "Tipo",
      status: "Situación",
      sentAt: "Enviado",
      createdAt: "Creado en",
    },
    sortOrder: {
      asc: "Ascendencia",
      desc: "Descendiente",
    },
  },
};
