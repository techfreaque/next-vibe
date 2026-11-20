import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Mensajes de correo electrónico",
  tag: "Mensajes",
  tags: {
    stats: "Estadísticas",
    analytics: "Analítica",
  },
  id: {
    category: "Emails",
    tags: {
      emails: "Emails",
    },
    title: "Detalle de correo electrónico",
    description:
      "Recuperar un solo correo electrónico por su identificador único",
    container: {
      title: "Detalles del correo",
      description: "Ver información detallada sobre un email específico",
    },
    fields: {
      id: {
        label: "Correo electrónico ID",
        description:
          "Unico identificador del correo electrónico para recuperar",
      },
    },
    response: {
      email: {
        title: "Detalles del correo",
        description:
          "Información completa sobre el correo electrónico solicitado",
        id: "Correo electrónico ID",
        subject: "Asunto",
        recipientEmail: "Recipiente Email",
        recipientName: "Nombre del destinatario",
        senderEmail: "Correo electrónico del remitente",
        senderName: "Nombre del remitente",
        type: "Email",
        status: "Situación",
        templateName: "Nombre de la plantilla",
        emailProvider: "Proveedor de correo electrónico",
        externalId: "ID externo",
        sentAt: "Enviado",
        deliveredAt: "Entregado",
        openedAt: "Abierto en",
        clickedAt: "Seguido en",
        retryCount: "Conde de reingreso",
        error: "Mensaje de error",
        userId: "Usuario ID",
        leadId: "ID del contacto",
        createdAt: "Creado en",
        updatedAt: "Actualizado en",
      },
    },
    get: {
      errors: {
        validation: {
          title: "Error de validación",
          description: "El correo electrónico proporcionado ID es inválido",
        },
        unauthorized: {
          title: "Se requiere autenticación",
          description:
            "Usted debe ser autenticado para acceder a los detalles de correo electrónico",
        },
        not_found: {
          title: "Email No encontrado",
          description:
            "No se ha encontrado ningún correo electrónico con el ID especificado",
        },
        forbidden: {
          title: "Acceso denegado",
          description:
            "Usted no tiene permiso para ver este correo electrónico",
        },
        server: {
          title: "Error del servidor",
          description:
            "Se produjo un error de servidor interno mientras se recupera el correo electrónico",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
      },
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "El correo electrónico proporcionado ID es inválido",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description:
          "Usted debe ser autenticado para acceder a los detalles de correo electrónico",
      },
      notFound: {
        title: "Email No encontrado",
        description:
          "No se ha encontrado ningún correo electrónico con el ID especificado",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Usted no tiene permiso para ver este correo electrónico",
      },
      server: {
        title: "Error del servidor",
        description:
          "Se produjo un error de servidor interno mientras se recupera el correo electrónico",
      },
      conflict: {
        title: "Conflicto de error",
        description:
          "Se produjo un conflicto al procesar la solicitud de correo electrónico",
      },
      network: {
        title: "Error de red",
        description:
          "Se produjo un error de red al recuperar el correo electrónico",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Hay cambios sin salvar",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
    },
    success: {
      title: "Correo electrónico",
      description: "Datos de correo electrónico recuperados con éxito",
    },
    widget: {
      parties: "Partes",
      to: "A",
      from: "Desde",
      timestamps: "Timestamps",
      sentAt: "Enviado",
      deliveredAt: "Entregado",
      openedAt: "Abierto en",
      clickedAt: "Seguido en",
      technical: "Detalles técnicos",
      template: "Plantilla",
      provider: "Proveedor",
      externalId: "ID externo",
      retryCount: "Conde de reingreso",
      error: "Error",
      associations: "Asociaciones",
      lead: "Prospecto",
      user: "Usuario",
      notFound: "Correo electrónico no encontrado",
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
      type: {
        transactional: "Transaccional",
        marketing: "Marketing",
        notification: "Notificación",
        system: "Sistema",
        leadCampaign: "Campaña de captación de contactos",
        userCommunication: "Comunicación de usuario",
      },
      provider: {
        resend: "Resend",
        sendgrid: "SendGrid",
        mailgun: "Mailgun",
        ses: "Amazon SES",
        smtp: "SMTP",
        mailjet: "Mailjet",
        postmark: "Postmark",
        other: "Otro",
      },
    },
  },
  list: {
    category: "Emails",
    tags: {
      emails: "Emails",
    },
    title: "Lista de correo electrónico",
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
  },
  stats: {
    category: "Emails",
    tags: {
      stats: "Estadísticas",
      analytics: "Analítica",
    },
    dateRange: {
      today: "Hoy",
      yesterday: "Ayer",
      last7Days: "Últimos 7 días",
      last30Days: "Últimos 30 días",
      last90Days: "Los últimos 90 días",
      thisWeek: "Esta semana",
      lastWeek: "La semana pasada",
      thisMonth: "Este mes",
      lastMonth: "El último mes",
      thisQuarter: "Este trimestre",
      lastQuarter: "Último trimestre",
      thisYear: "Este año",
      lastYear: "Último año",
      custom: "Rango personalizado",
    },
    get: {
      title: "Estadísticas de correo electrónico",
      description:
        "Recuperar estadísticas y métricas completas de correo electrónico",
      form: {
        title: "Solicitud de estadísticas por correo electrónico",
        description:
          "Parámetros para consultar estadísticas de correo electrónico",
      },
      startDate: {
        label: "Fecha de inicio",
        description: "Fecha de inicio para el período de estadísticas",
      },
      endDate: {
        label: "Fecha final",
        description: "Fecha final del período de estadísticas",
      },
      accountId: {
        label: "Cuenta ID",
        description: "Estadísticas de filtro por cuenta específica",
      },
      type: {
        label: "Email",
        description: "Filtro por tipo de correo electrónico",
        options: {
          all: "Todos",
          sent: "Sent",
          received: "Recibidos",
          draft: "Proyecto",
          trash: "Trash",
        },
      },
      groupBy: {
        label: "Grupo By",
        description: "Cómo agrupar las estadísticas",
        options: {
          day: "Por día",
          week: "Por semana",
          month: "Por mes",
          account: "Cuenta por cuenta",
          type: "Por tipo",
        },
      },
      includeDetails: {
        label: "Incluir detalles",
        description: "Incluido el desglose detallado de los resultados",
      },
      status: {
        label: "Situación de correo electrónico",
        description: "Filtro por estado de correo electrónico",
      },
      search: {
        label: "Buscar",
        description: "Buscar correos electrónicos por sujeto o destinatario",
      },
      timePeriod: {
        label: "Período de tiempo",
        description: "Período de tiempo granularidad para datos históricos",
        hour: "Hora",
        day: "Día",
        week: "Semana",
        month: "Mes",
        quarter: "Trimestre",
        year: "Año",
      },
      dateRangePreset: {
        label: "Date Range Preset",
        description: "Rango de fecha predefinido para el filtrado",
      },
      dateFrom: {
        label: "Fecha de inicio",
        description: "Filtrar correos electrónicos desde esta fecha",
      },
      dateTo: {
        label: "Fecha final",
        description: "Filtrar correos electrónicos hasta esta fecha",
      },
      chartType: {
        label: "Tipo de carga",
        description: "Tipo de visualización para gráficos",
        line: "Gráfico de línea",
        bar: "Bar Chart",
        area: "Area Chart",
        pie: "Pie Chart",
        donut: "Donut Chart",
      },
      includeComparison: {
        label: "Incluir la comparación",
        description: "Comparación con el período anterior",
      },
      sortBy: {
        label: "Ordenar por",
        description: "Campo para ordenar correos electrónicos por",
      },
      sortOrder: {
        label: "Ordenar orden",
        description: "Orden de clasificación (ascendente o descendiente)",
      },
      response: {
        title: "Respuesta a las estadísticas por correo electrónico",
        description:
          "Estadísticas de correo electrónico completas y datos métricos",
        totalEmails: "Total Emails",
        sentEmails: "Correos enviados",
        deliveredEmails: "Correos electrónicos entregados",
        openedEmails: "Correos electrónicos abiertos",
        clickedEmails: "Correos electrónicos pulsados",
        bouncedEmails: "Correos electrónicos Bounced",
        failedEmails: "Correos electrónicos fallidos",
        draftEmails: "Draft Emails",
        openRate: "Tasa abierta",
        clickRate: "Tasa de clic",
        deliveryRate: "Tasa de entrega",
        bounceRate: "Tasa de recompensa",
        failureRate: "Tasa de fracaso",
        emailsByProvider: "Correos electrónicos por Proveedor",
        emailsByTemplate: "Correos electrónicos por Plantilla",
        emailsByStatus: "Emails by Status",
        emailsByType: "Correos electrónicos por tipo",
        emailsWithUserId: "Correos electrónicos con el usuario ID",
        emailsWithoutUserId: "Correos sin Usuario ID",
        emailsWithLeadId: "Correos con ID de prospecto",
        emailsWithoutLeadId: "Correos electrónicos sin contacto ID",
        emailsWithErrors: "Correos electrónicos con Errores",
        emailsWithoutErrors: "Correos electrónicos sin errores",
        averageRetryCount: "Promedio de cuenta de reingreso",
        maxRetryCount: "Máxima cuenta de reingreso",
        averageProcessingTime: "Tiempo medio de procesamiento",
        averageDeliveryTime: "Tiempo de entrega promedio",
        historicalData: "Datos históricos",
        groupedStats: "Estadísticas agrupadas",
        generatedAt: "Generado en",
        dataRange: "Gama de datos",
        recentActivity: "Actividad reciente",
        topPerformingTemplates: "Plantillas de alto rendimiento",
        topPerformingProviders: "Proveedores de rendimiento superior",
        metrics: {
          totalEmails: "Total Emails",
          sentEmails: "Correos enviados",
          deliveredEmails: "Correos electrónicos entregados",
          openedEmails: "Correos electrónicos abiertos",
          clickedEmails: "Correos electrónicos pulsados",
          bouncedEmails: "Correos electrónicos Bounced",
          failedEmails: "Correos electrónicos fallidos",
          deliveryRate: "Tasa de entrega",
          openRate: "Tasa abierta",
          clickRate: "Tasa de clic",
          bounceRate: "Tasa de recompensa",
          failureRate: "Tasa de fracaso",
          emails_with_errors: "Correos electrónicos con Errores",
          average_retry_count: "Promedio de cuenta de reingreso",
          average_processing_time: "Tiempo medio de procesamiento (ms)",
          average_delivery_time: "Tiempo medio de entrega (ms)",
          provider_historical: "Datos históricos del proveedor",
          template_historical: "Datos históricos",
          engagement_historical: "Datos históricos",
        },
        retry: {
          no_retries: "No hay registros",
          with_retries: "Con los camiones",
        },
        association: {
          with_user: "Con el Usuario",
          with_lead: "Con contacto",
          with_both: "Con ambos",
          with_neither: "Standalone",
        },
      },
      errors: {
        unauthorized: {
          title: "Se requiere autenticación",
          description:
            "Autenticación necesaria para acceder a estadísticas de correo electrónico",
        },
        validation: {
          title: "Error de validación",
          description: "Parámetros de solicitud inválidos proporcionados",
        },
        server: {
          title: "Error del servidor",
          description:
            "Error del servidor interno ocurrió mientras se recuperan estadísticas",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error desconocido",
        },
        network: {
          title: "Error de red",
          description:
            "Se produjo error de red mientras se recuperan las estadísticas",
        },
        forbidden: {
          title: "Acceso denegado",
          description:
            "Se prohíbe el acceso a las estadísticas de correo electrónico",
        },
        notFound: {
          title: "No encontrado",
          description: "Estadísticas de correo electrónico no encontradas",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description:
            "Hay cambios sin salvar que necesitan ser salvados primero",
        },
        conflict: {
          title: "Conflicto",
          description:
            "Conflicto de datos se produjo mientras se recuperaban estadísticas",
        },
      },
      success: {
        title: "Operación completada",
        description: "Estadísticas de correo electrónico recuperadas con éxito",
      },
    },
    widget: {
      title: "Estadísticas de correo electrónico",
      total: "Total",
      sent: "Sent",
      delivered: "Entrega",
      opened: "Abierto",
      clicked: "Seguido",
      bounced: "Bounced",
      failed: "Failed",
      errors: "Errores",
      engagementRates: "Tasas de participación",
      deliveryRate: "Tasa de entrega",
      openRate: "Tasa abierta",
      clickRate: "Tasa de clic",
      bounceRate: "Tasa de recompensa",
      failureRate: "Tasa de fracaso",
      byStatus: "Por Estado",
      byType: "Por tipo",
      avgRetries: "Avg. Retries",
      avgDeliveryMs: "Avg. Tiempo de entrega",
      viewList: "Ver lista",
      refresh: "Actualizar",
      search: "Buscar correos electrónicos...",
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
    provider: {
      resend: "Resend",
      sendgrid: "SendGrid",
      mailgun: "Mailgun",
      ses: "Amazon SES",
      smtp: "SMTP",
      mailjet: "Mailjet",
      postmark: "Postmark",
      other: "Otro",
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
    retryRange: {
      noRetries: "No hay registros",
      oneToTwo: "1-2 Retries",
      threeToFive: "3-5 Retries",
      sixPlus: "6+ Retries",
    },
    syncStatus: {
      pending: "Sincronización",
      syncing: "Sincronización",
      synced: "Sincronizado",
      failed: "Sincronizado",
    },
    specialFolder: {
      inbox: "Bandeja de entrada",
      sent: "Sent",
      drafts: "Proyectos",
      trash: "Trash",
      spam: "Spam",
      archive: "Archivar",
    },
    sortOrder: {
      asc: "Ascendencia",
      desc: "Descendiente",
    },
  },
};
