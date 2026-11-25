import { regionalCountryNames } from "next-vibe/core/i18n/core/regions";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Correo electrónico",
  countries: {
    ...regionalCountryNames("es"),
    global: "Global",
    de: "Alemania",
    pl: "Polonia",
    fr: "Francia",
    us: "Estados Unidos",
  },
  languages: {
    it: "Italiano",
    es: "Español",
    sk: "Eslovaco",
    en: "Inglés",
    de: "Alemán",
    pl: "Polaco",
    fr: "Francés",
  },
  enums: {
    // SMTP Client Enums
    smtpSecurityType: {
      none: "Ninguno",
      tls: "TLS",
      ssl: "SSL",
      starttls: "STARTTLS",
    },
    smtpAccountStatus: {
      active: "Activa",
      inactive: "Inactivo",
      error: "Error",
      testing: "Pruebas",
    },
    smtpHealthStatus: {
      healthy: "Salud",
      degraded: "Degradado",
      unhealthy: "Insalubres",
      unknown: "Desconocida",
    },
    smtpSortField: {
      name: "Nombre",
      status: "Situación",
      createdAt: "Creado en",
      updatedAt: "Actualizado en",
      priority: "Prioridad",
      totalEmailsSent: "Total Emails Sent",
      lastUsedAt: "El último usado en",
    },
    smtpCampaignType: {
      leadCampaign: "Campaña de captación de contactos",
      newsletter: "Boletín",
      signupNurture: "Nutrición de registro",
      retention: "Retención",
      winback: "Winback",
      transactional: "Transaccional",
      notification: "Notificación",
      system: "Sistema",
    },
    smtpLoadBalancingStrategy: {
      roundRobin: "Round Robin",
      weighted: "Visto",
      priority: "Prioridad",
      leastUsed: "Menos usado",
    },
    loadBalancingStrategy: {
      roundRobin: "Round Robin",
      weighted: "Visto",
      priority: "Prioridad",
      leastUsed: "Menos usado",
    },
    smtpTestResult: {
      success: "Operación completada",
      authFailed: "Autenticación fallida",
      connectionFailed: "Conexión fallida",
      timeout: "Hora de salir",
      unknownError: "Error desconocido",
    },
    testResult: {
      success: "Operación completada",
      authFailed: "Autenticación fallida",
      connectionFailed: "Conexión fallida",
      timeout: "Hora de salir",
      unknownError: "Error desconocido",
    },
    smtpStatusFilter: {
      any: "Cualquiera",
    },
    smtpHealthStatusFilter: {
      any: "Cualquiera",
    },
    smtpCampaignTypeFilter: {
      any: "Cualquiera",
    },
    smtpSelectionRuleSortField: {
      name: "Nombre",
      priority: "Prioridad",
      campaignType: "Tipo de campaña",
      journeyVariant: "Variante de viaje",
      campaignStage: "Etapa de campaña",
      country: "País",
      language: "Idioma",
      createdAt: "Creado en",
      updatedAt: "Actualizado en",
      emailsSent: "Emails Sent",
      successRate: "Tasa de éxito",
      lastUsedAt: "El último usado en",
    },
    selectionRuleSortField: {
      name: "Nombre",
      priority: "Prioridad",
      campaignType: "Tipo de campaña",
      journeyVariant: "Variante de viaje",
      campaignStage: "Etapa de campaña",
      country: "País",
      language: "Idioma",
      createdAt: "Creado en",
      updatedAt: "Actualizado en",
      emailsSent: "Emails Sent",
      successRate: "Tasa de éxito",
      lastUsedAt: "El último usado en",
    },
    smtpSelectionRuleStatusFilter: {
      any: "Cualquiera",
      active: "Activa",
      inactive: "Inactivo",
      default: "Predeterminado",
      failover: "Failover",
    },
    selectionRuleStatusFilter: {
      any: "Cualquiera",
      active: "Activa",
      inactive: "Inactivo",
      default: "Predeterminado",
      failover: "Failover",
    },
    // Email Messages Enums
    emailStatus: {
      pending: "Pendiente",
      sent: "Sent",
      delivered: "Entrega",
      opened: "Abierto",
      clicked: "Seguido",
      bounced: "Bounced",
      failed: "Failed",
      unsubscribed: "Suscripción cancelada",
    },
    emailType: {
      transactional: "Transaccional",
      marketing: "Marketing",
      notification: "Notificación",
      system: "Sistema",
      leadCampaign: "Campaña de captación de contactos",
      userCommunication: "Comunicación de usuario",
    },
    emailProvider: {
      resend: "Resend",
      sendgrid: "SendGrid",
      mailgun: "Mailgun",
      ses: "Amazon SES",
      smtp: "SMTP",
      mailjet: "Mailjet",
      postmark: "Postmark",
      other: "Otro",
    },
    emailSortField: {
      subject: "Asunto",
      recipientEmail: "Recipiente Email",
      recipientName: "Nombre del destinatario",
      type: "Tipo",
      status: "Situación",
      sentAt: "Enviado",
      createdAt: "Creado en",
    },
    emailStatusFilter: {
      any: "Cualquiera",
    },
    emailTypeFilter: {
      any: "Cualquiera",
    },
    emailRetryRange: {
      noRetries: "No hay registros",
      oneToTwo: "1-2 Retries",
      threeToFive: "3-5 Retries",
      sixPlus: "6+ Retries",
    },
    // IMAP Client Enums
    imapSyncStatus: {
      pending: "Pendiente",
      syncing: "Sincronización",
      synced: "Sincronizado",
      error: "Error",
    },
    imapOverallSyncStatus: {
      idle: "Idle",
      running: "Corriendo",
      completed: "Completado",
      failed: "Failed",
      cancelled: "Cancelada",
    },
    imapSortOrder: {
      asc: "Ascendencia",
      desc: "Descendiente",
    },
    imapAuthMethod: {
      plain: "Plain",
      oauth2: "OAuth2",
      xoauth2: "XOAuth2",
    },
    imapSpecialUseType: {
      inbox: "Bandeja de entrada",
      sent: "Sent",
      drafts: "Proyectos",
      trash: "Trash",
      junk: "Junk",
      archive: "Archivar",
    },
    imapFolderSortField: {
      name: "Nombre",
      displayName: "Nombre de pantalla",
      messageCount: "Cuenta del mensaje",
      unseenCount: "Cuenta invisible",
      createdAt: "Creado en",
    },
    imapAccountSortField: {
      name: "Nombre",
      email: "Correo electrónico",
      host: "Host",
      enabled: "Enabled",
      lastSyncAt: "Último Sync At",
      createdAt: "Creado en",
    },
    imapConnectionStatus: {
      disconnected: "Desconectado",
      connecting: "Conexión",
      connected: "Conectado",
      error: "Error",
      timeout: "Hora de salir",
    },
    imapSyncStatusFilter: {
      all: "Todos",
    },
    imapAccountStatusFilter: {
      all: "Todos",
      enabled: "Enabled",
      disabled: "Discapacitados",
    },
    imapAccountFilter: {
      all: "Todos",
    },
    imapMessageSortField: {
      subject: "Asunto",
      senderName: "Nombre del remitente",
      senderEmail: "Correo electrónico del remitente",
      recipientEmail: "Recipiente Email",
      recipientName: "Nombre del destinatario",
      isRead: "Está leyendo",
      isFlagged: "Es Flagged.",
      messageSize: "Tamaño del mensaje",
      sentAt: "Enviado",
      createdAt: "Creado en",
    },
    imapMessageStatusFilter: {
      all: "Todos",
      read: "Leer",
      unread: "No.",
      flagged: "Flagged",
      unflagged: "Unflagged",
      draft: "Proyecto",
      deleted: "Suprimidos",
      hasAttachments: "Tiene adjuntos",
      noAttachments: "No hay adjuntos",
    },
    imapHealthStatus: {
      healthy: "Salud",
      warning: "Advertencia",
      error: "Error",
      maintenance: "Mantenimiento",
    },
    imapPerformanceStatus: {
      good: "Buena",
      warning: "Advertencia",
      error: "Error",
    },
    bulkMessageAction: {
      markRead: "Marcar como Leer",
      markUnread: "Marcar como no leído",
      flag: "Bandera",
      unflag: "Unflag",
      delete: "Eliminar",
    },
    imapLoggingLevel: {
      error: "Error",
      warn: "Advertencia",
      info: "Info",
      debug: "Depuración",
    },
    // Email Service Enums
    emailServicePriority: {
      low: "Baja",
      normal: "Normal",
      high: "Alto",
      urgent: "Urgente",
    },
    emailServiceStatus: {
      idle: "Idle",
      processing: "Procesamiento",
      completed: "Completado",
      failed: "Failed",
      retrying: "Retiro",
    },
    // SMS Service Enums
    smsProvider: {
      twilio: "Twilio",
      awsSns: "AWS SNS",
      messagebird: "MessageBird",
      plivo: "Plivo",
    },
    smsStatus: {
      pending: "Pendiente",
      sent: "Sent",
      delivered: "Entrega",
      failed: "Failed",
      rejected: "Rechazado",
      undelivered: "No se entregaron",
    },
    smsTemplateType: {
      notification: "Notificación",
      verification: "Verificación",
      marketing: "Marketing",
      alert: "Alerta",
      reminder: "Recordatorio",
    },
  },
  errors: {
    no_email: "No se proporciona dirección de correo electrónico",
    email_generation_failed: "Failed para generar correo electrónico",
  },
  email: {
    errors: {
      send: {
        title: "Correo electrónico Enviar Failed",
      },
    },
  },
  smsService: {
    title: "SMS Service",
    description: "Enviar mensajes SMS a través de varios proveedores",
    category: "SMS Service",
    tag: "SMS Service",
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "No está autorizado para enviar mensajes SMS",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Se prohíbe el acceso al servicio SMS",
      },
      validation: {
        title: "Error de validación",
        description: "Datos de solicitud de SMS inválidos",
      },
      internal: {
        title: "Error interno",
        description: "Se produjo un error de servidor interno",
      },
      conflict: {
        title: "Conflicto",
        description: "SMS solicita conflictos con los datos existentes",
      },
      notFound: {
        title: "No encontrado",
        description: "SMS resource not found",
      },
      network: {
        title: "Error de red",
        description: "Error de red ocurrido mientras se envía SMS",
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
      invalid_phone: {
        title: "Número de teléfono inválido",
      },
      send: {
        title: "SMS Send Failed",
      },
    },
    send: {
      title: "Enviar SMS",
      description: "Enviar mensaje SMS al destinatario",
      container: {
        title: "Configuración SMS",
        description: "Configurar los parámetros de envío SMS",
      },
      to: {
        label: "Número de teléfono",
        description: "Número de teléfono principal",
        placeholder: "+1234567890",
      },
      message: {
        label: "Mensaje",
        description: "Contenido del mensaje de SMS",
        placeholder: "Introduzca su mensaje aquí...",
      },
      campaignType: {
        label: "Tipo de campaña",
        description: "Seleccione el tipo de campaña para este SMS",
        placeholder: "Seleccionar tipo de campaña",
      },
      leadId: {
        label: "ID del contacto",
        description: "identificador de contacto asociado",
        placeholder: "lead-12345",
      },
      templateName: {
        label: "Nombre de la plantilla",
        description: "Plantilla SMS para usar",
        placeholder: "Seleccione plantilla",
      },
      response: {
        result: {
          title: "Resultado SMS",
          description: "Resultado de la operación de envío SMS",
          success: "Operación completada",
          messageId: "Mensaje ID",
          sentAt: "Enviado",
          provider: "Proveedor",
          cost: "Costo",
        },
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Datos de solicitud de SMS inválidos",
        },
        unauthorized: {
          title: "Se requiere autenticación",
          description: "No está autorizado para enviar mensajes SMS",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "Se prohíbe el acceso al servicio SMS",
        },
        conflict: {
          title: "Conflicto",
          description: "SMS solicita conflictos con los datos existentes",
        },
        notFound: {
          title: "No encontrado",
          description: "SMS resource not found",
        },
        network: {
          title: "Error de red",
          description: "Error de red ocurrido mientras se envía SMS",
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
      },
      success: {
        title: "SMS Enviado con éxito",
        description: "Su SMS ha sido enviado con éxito",
      },
    },
  },
  sms: {
    errors: {
      invalid_phone: {
        title: "Número de teléfono inválido",
      },
      send: {
        title: "SMS Send Failed",
      },
    },
  },
  emailService: {
    tag: "Cliente SMTP",
    category: "Servicios de correo electrónico",
    components: {
      email: {
        tagline: "Libre discurso AI plataforma",
        footer: {
          needHelp: "¿Necesitas ayuda?",
          helpText: "¿Necesitas ayuda? Contacta con nosotros",
          unsubscribeText: "¿Prefieres dejar de recibir estos correos?",
          unsubscribeLink: "Cancelar suscripción",
          copyright:
            "© {{currentYear}} {{appName}}. Todos los derechos reservados.",
          visitWebsite: "Sitio web de visita",
          allRightsReserved:
            "© {{currentYear}} {{appName}}. Todos los derechos reservados.",
          feedbackHook:
            "¿Tienes algo que decir? Responder. En realidad lo leímos.",
          feedbackBody:
            "Informe un fallo, solicite una característica o díganos qué falta. Reacción útil te gana créditos {{credits}} – un mes completo en nosotros.",
          feedbackLink: "Responder con retroalimentación →",
          footerSeparator: " · ",
        },
      },
      post: {
        title: "Componentes",
        description: "Componentes endpoint",
        form: {
          title: "Configuración de componentes",
          description: "Configurar parámetros de componentes",
        },
        response: {
          title: "Respuesta",
          description: "Datos sobre la respuesta de los componentes",
        },
        errors: {
          unauthorized: {
            title: "Se requiere autenticación",
            description: "Inicia sesión para continuar",
          },
          validation: {
            title: "Error de validación",
            description: "Parámetros de solicitud no válidos",
          },
          server: {
            title: "Error del servidor",
            description: "Ocurrió un error interno del servidor",
          },
          unknown: {
            title: "Error desconocido",
            description: "Ocurrió un error desconocido",
          },
          network: {
            title: "Error de red",
            description: "Ocurrió un error de red",
          },
          forbidden: {
            title: "Acceso denegado",
            description: "No tienes acceso",
          },
          notFound: {
            title: "No encontrado",
            description: "No se encontró el recurso",
          },
          conflict: {
            title: "Conflicto",
            description: "Hay un conflicto entre los datos",
          },
        },
        success: {
          title: "Operación completada",
          description: "La operación se completó correctamente",
        },
      },
    },
    emailSending: {
      email: {
        defaultSenderName: "Sistema",
        errors: {
          sending_failed: "Failed to send email to {{recipient}}",
        },
      },
    },
    emailHandling: {
      email: {
        errors: {
          rendering_failed: "Failed to render email template",
          send_failed: "Fallado para enviar correo electrónico",
          email_failed_subject: "Correo electrónico fallado",
          unknown_recipient: "Recibido desconocido",
          unknown_sender: "Sistema",
          email_render_exception: "Excepción por correo electrónico",
          batch_send_failed: "Correo electrónico de Batch falló",
        },
      },
    },
    sending: {
      errors: {
        unauthorized: {
          title: "Se requiere autenticación",
          description:
            "Autenticación necesaria para las operaciones de envío SMTP",
        },
        server: {
          title: "Error del servidor",
          description: "Se produjo un error en el servidor SMTP",
        },
        rejected: {
          title: "Email Rechazado",
          defaultReason: "Correo electrónico rechazado por servidor",
        },
        no_recipients: {
          title: "No se aceptan beneficiarios",
          defaultReason: "No se aceptan receptores",
        },
        rate_limit: {
          title: "Se superó el límite de solicitudes",
        },
        capacity: {
          title: "Error de capacidad",
        },
        no_account: {
          title: "Cuenta SMTP No disponible",
        },
      },
    },
    emailMetadata: {
      errors: {
        server: {
          title: "Error de servidor de metadatos por correo electrónico",
          description: "Failed to store email metadata",
        },
      },
    },
    enums: {
      status: {
        active: "Activa",
        inactive: "Inactivo",
        error: "Error",
        testing: "Pruebas",
      },
      securityType: {
        none: "Ninguno",
        tls: "TLS",
        ssl: "SSL",
        starttls: "STARTTLS",
      },
      statusFilter: {
        all: "Todos los estatutos",
      },
      healthStatus: {
        healthy: "Salud",
        degraded: "Degradado",
        unhealthy: "Insalubres",
        unknown: "Desconocida",
      },
      healthStatusFilter: {
        all: "Todos los estados de salud",
      },
      sortField: {
        name: "Nombre",
        status: "Situación",
        createdAt: "Creado en",
        updatedAt: "Actualizado en",
        priority: "Prioridad",
        totalEmailsSent: "Total Emails Sent",
        lastUsedAt: "El último usado en",
      },
      campaignType: {
        leadCampaign: "Campaña de captación de contactos",
        newsletter: "Boletín",
        signupNurture: "Nutrición de registro",
        retention: "Retención",
        winback: "Winback",
        transactional: "Transaccional",
        notification: "Notificación",
        system: "Sistema",
      },
      campaignTypeFilter: {
        all: "Todos los tipos de campaña",
      },
      selectionRuleSortField: {
        name: "Nombre",
        priority: "Prioridad",
        campaignType: "Tipo de campaña",
        journeyVariant: "Variante de viaje",
        campaignStage: "Etapa de campaña",
        country: "País",
        language: "Idioma",
        createdAt: "Creado en",
        updatedAt: "Actualizado en",
        emailsSent: "Emails Sent",
        successRate: "Tasa de éxito",
        lastUsedAt: "El último usado en",
      },
      selectionRuleStatusFilter: {
        all: "Todos",
        active: "Activa",
        inactive: "Inactivo",
        default: "Predeterminado",
        failover: "Failover",
      },
      loadBalancingStrategy: {
        roundRobin: "Round Robin",
        weighted: "Visto",
        priority: "Prioridad",
        leastUsed: "Menos usado",
      },
      testResult: {
        success: "Operación completada",
        authFailed: "Autenticación fallida",
        connectionFailed: "Conexión fallida",
        timeout: "Hora de salir",
        unknownError: "Error desconocido",
      },
    },
  },
  imapClient: {
    category: "Cliente IMAP",
    tag: "Cliente IMAP",
    tags: {
      health: "Salud",
      monitoring: "Monitoreo",
      sync: "Sincronización",
      accounts: "Cuentas",
      folders: "Carpetas",
      messages: "Mensajes",
      config: "Configuración",
    },
    messages: {
      tag: "Mensajes",
      id: {
        widget: {
          markRead: "Marcar como Leer",
          markUnread: "Marcar como no leído",
          flag: "Bandera",
          unflag: "Unflag",
        },
      },
      errors: {
        server: { title: "Error del servidor" },
        notFound: { title: "Mensaje no encontrado" },
        accountNotFound: { title: "Cuenta no encontrada" },
        syncFailed: { title: "Sincronizado" },
        syncSuccess: { message: "Mensajes sincronizados con éxito" },
        list: {
          get: {
            errors: { server: { title: "Mensajes de error del servidor" } },
          },
        },
      },
    },
    sync: {
      category: "Cliente IMAP",

      title: "IMAP Sync",
      description: "Servicio de sincronización IMAP",
      container: {
        title: "Configuración de sincronización IMAP",
        description: "Configurar los parámetros de sincronización IMAP",
      },
      accountIds: {
        label: "ID de la cuenta",
        description: "ID de cuenta IMAP para sincronizar",
        placeholder: "Introduzca ID de cuenta separados por comas",
      },
      force: {
        label: "Force Sync",
        description:
          "Sincronización de la fuerza incluso si se ha sincronizado recientemente",
      },
      dryRun: {
        label: "Dry Run",
        description: "Realizar una prueba sin hacer cambios",
      },
      maxMessages: {
        label: "Mensajes Max",
        description: "Número máximo de mensajes para sincronizar por carpeta",
        placeholder: "Introduzca el número máximo de mensajes",
      },
      post: {
        title: "Sincronización",
        description: "Punto final sincrónico",
        form: {
          title: "Configuración de sincronización",
          description: "Configurar parámetros de sincronización",
        },
        response: {
          title: "Respuesta",
          description: "Datos de respuesta sincronizada",
          result: {
            title: "Resultados sincronizados",
            description: "Resultados de sincronización detallados",
            accountsProcessed: "Cuentas procesadas",
            foldersProcessed: "Carpetas procesadas",
            messagesProcessed: "Mensajes procesados",
            messagesAdded: "Mensajes añadidos",
            messagesUpdated: "Mensajes Actualizados",
            messagesDeleted: "Mensajes eliminados",
            duration: "Duración",
          },
          errors: {
            error: {
              title: "Error de sincronización",
              description: "Detalles del error",
              code: "Código de error",
              message: "Mensaje de error",
            },
          },
        },
        errors: {
          unauthorized: {
            title: "Se requiere autenticación",
            description: "Inicia sesión para continuar",
          },
          validation: {
            title: "Error de validación",
            description: "Parámetros de solicitud no válidos",
          },
          server: {
            title: "Error del servidor",
            description: "Ocurrió un error interno del servidor",
          },
          unknown: {
            title: "Error desconocido",
            description: "Ocurrió un error desconocido",
          },
          network: {
            title: "Error de red",
            description: "Ocurrió un error de red",
          },
          forbidden: {
            title: "Acceso denegado",
            description: "No tienes acceso",
          },
          notFound: {
            title: "No encontrado",
            description: "No se encontró el recurso",
          },
          conflict: {
            title: "Conflicto",
            description: "Hay un conflicto entre los datos",
          },
        },
        success: {
          title: "Operación completada",
          description: "La operación se completó correctamente",
        },
      },
      errors: {
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Inicia sesión para continuar",
        },
        validation: {
          title: "Error de validación",
          description: "Parámetros de solicitud no válidos",
        },
        server: {
          title: "Error del servidor",
          description: "Ocurrió un error interno del servidor",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error desconocido",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No tienes acceso",
        },
      },
      success: {
        title: "Operación completada",
        description: "La operación se completó correctamente",
      },
      widget: {
        title: "Full IMAP Sync",
        options: "Opciones de sincronización",
        noAccounts: "No existen cuentas IMAP configuradas",
        result: "Resultado sincronizado",
        duration: "Duración",
        errors: "Errores",
        accountsProcessed: "Cuentas procesadas",
        foldersProcessed: "Carpetas procesadas",
        messagesProcessed: "Mensajes procesados",
        messagesAdded: "Mensajes añadidos",
        messagesUpdated: "Mensajes Actualizados",
        messagesDeleted: "Mensajes eliminados",
        submit: "Start Sync",
        submitting: "Sincronización...",
      },
    },
    imapErrors: {
      accounts: {
        post: {
          error: {
            duplicate: {
              title: "Cuentas ya existentes",
            },
            server: {
              title: "Error del servidor creando cuenta",
            },
          },
        },
        get: {
          error: {
            not_found: {
              title: "Cuenta no encontrada",
            },
            server: {
              title: "Cuenta de recuperación de errores del servidor",
            },
          },
        },
        put: {
          error: {
            not_found: {
              title: "Cuenta no encontrada",
            },
            duplicate: {
              title: "Cuenta con este correo electrónico ya existe",
            },
            server: {
              title: "Cuenta de actualización de errores del servidor",
            },
          },
        },
        delete: {
          error: {
            not_found: {
              title: "Cuenta no encontrada",
            },
            server: {
              title: "Cuenta de eliminación del error del servidor",
            },
          },
          success: {
            title: "Cuenta eliminada con éxito",
          },
        },
      },
      folders: {
        get: {
          error: {
            not_found: {
              title: "Carpeta no encontrada",
            },
            server: {
              title: "Carpeta de recuperación de errores del servidor",
            },
          },
        },
        sync: {
          error: {
            missing_account: {
              title: "Cuenta no encontrada para sincronización de carpetas",
            },
          },
        },
      },
      messages: {
        get: {
          error: {
            not_found: {
              title: "Mensaje no encontrado",
            },
            server: {
              title: "Mensaje de recuperación del error del servidor",
            },
          },
        },
      },
      connection: {
        failed: "La conexión falló",
        timeout: {
          title: "Tiempo de conexión",
        },
        test: {
          failed: "Prueba de conexión falló",
        },
        close: {
          failed: "No cerrar la conexión",
        },
        folders: {
          list: {
            failed: "Failed to list folders",
          },
        },
        messages: {
          list: {
            failed: "No listar mensajes",
          },
        },
      },
      sync: {
        failed: "Sincronización fallida",
        account: {
          failed: "La sincronización de la cuenta falló",
        },
        folder: {
          failed: "La sincronización de carpetas falló",
        },
        message: {
          failed: "Sincronización del mensaje falló",
        },
        post: {
          error: {
            server: {
              title: "Error del servidor durante la sincronización",
            },
          },
        },
      },
      validation: {
        account: {
          username: {
            required: "Se requiere el nombre de usuario",
          },
          port: {
            invalid: "Número de puerto inválido",
          },
          host: {
            invalid: "Inválido anfitrión",
          },
        },
      },
    },
    imap: {
      "example.com": "imap.example.com",
      "gmail.com": "imap.gmail.com",
      connection: {
        test: {
          success: "Prueba de conexión exitosa",
          failed: "Prueba de conexión falló",
          timeout: "Tiempo de prueba de conexión",
        },
      },
      sync: {
        messages: {
          accounts: {
            success: "Todas las cuentas se sincronizaron con éxito",
            successWithErrors: "Cuentas sincronizadas con errores",
          },
          account: {
            success: "Consecuencias de la cuenta",
            successWithErrors: "Cuenta sincronizada con errores",
          },
          folders: {
            success: "Carpetas sincronizadas con éxito",
            successWithErrors: "Carpetas sincronizadas con errores",
          },
          messages: {
            success: "Mensajes sincronizados con éxito",
            successWithErrors: "Mensajes sincronizados con errores",
          },
        },
        errors: {
          default: "Sincronización IMAP falló",
          account_failed: "La sincronización de la cuenta falló",
          folder_sync_failed: "La sincronización de carpetas falló",
          message_sync_error: "Error de sincronización del mensaje",
          message_sync_failed: "Sincronización del mensaje falló",
        },
      },
    },
    enums: {
      loggingLevel: {
        error: "Error",
        warn: "Advertencia",
        info: "Info",
        debug: "Depuración",
      },
      syncStatus: {
        pending: "Pendiente",
        syncing: "Sincronización",
        synced: "Sincronizado",
        error: "Error",
      },
      overallSyncStatus: {
        idle: "Idle",
        running: "Corriendo",
        completed: "Completado",
        failed: "Failed",
        cancelled: "Cancelada",
      },
      sortOrder: {
        asc: "Ascendencia",
        desc: "Descendiente",
      },
      authMethod: {
        plain: "Plain",
        oauth2: "OAuth2",
        xoauth2: "XOAuth2",
      },
      imapAuthMethod: {
        plain: "Plain",
        oauth2: "OAuth2",
        xoauth2: "XOAuth2",
      },
      specialUseType: {
        inbox: "Bandeja de entrada",
        sent: "Sent",
        drafts: "Proyectos",
        trash: "Trash",
        junk: "Junk",
        archive: "Archivar",
      },
      folderSortField: {
        name: "Nombre",
        displayName: "Nombre de pantalla",
        messageCount: "Cuenta del mensaje",
        unseenCount: "Cuenta invisible",
        createdAt: "Creado en",
      },
      accountSortField: {
        name: "Nombre",
        email: "Correo electrónico",
        host: "Host",
        enabled: "Enabled",
        lastSyncAt: "Último Sync At",
        createdAt: "Creado en",
      },
      connectionStatus: {
        disconnected: "Desconectado",
        connecting: "Conexión",
        connected: "Conectado",
        error: "Error",
        timeout: "Hora de salir",
      },
      syncStatusFilter: {
        all: "Todos los estados sincronizados",
      },
      accountStatusFilter: {
        all: "Todos los estados de cuenta",
        enabled: "Enabled",
        disabled: "Discapacitados",
      },
      accountFilter: {
        all: "Todas las cuentas",
      },
      messageSortField: {
        subject: "Asunto",
        senderName: "Nombre del remitente",
        senderEmail: "Correo electrónico del remitente",
        recipientEmail: "Recipiente Email",
        recipientName: "Nombre del destinatario",
        isRead: "Leer estado",
        isFlagged: "Flagged",
        messageSize: "Tamaño del mensaje",
        sentAt: "Enviado",
        createdAt: "Creado en",
      },
      messageStatusFilter: {
        all: "Todos los mensajes",
        read: "Leer",
        unread: "No.",
        flagged: "Flagged",
        unflagged: "Unflagged",
        draft: "Proyecto",
        deleted: "Suprimidos",
        hasAttachments: "Tiene adjuntos",
        noAttachments: "No hay adjuntos",
      },
      healthStatus: {
        healthy: "Salud",
        warning: "Advertencia",
        error: "Error",
        maintenance: "Mantenimiento",
      },
      performanceStatus: {
        good: "Buena",
        warning: "Advertencia",
        error: "Error",
      },
    },
  },
  messages: {
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
          description:
            "Usted no tiene permiso para ver este correo electrónico",
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
          description:
            "Estadísticas de correo electrónico recuperadas con éxito",
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
  },
  send: {
    title: "Enviar mensaje",
    description:
      "Enviar un mensaje a través de cualquier canal (Email, SMS, WhatsApp, Telegram)",
    category: "Mensajería",
    tag: "Enviar",

    container: {
      title: "Enviar mensaje",
      description: "Enviar a través de una cuenta de mensajero configurada",
    },

    accountId: {
      label: "Cuenta Mensajera",
      description: "Cuenta para enviar",
      placeholder: "Seleccione la cuenta UUID",
    },
    to: {
      label: "Recipiente",
      description:
        "Dirección de correo electrónico, número de teléfono o chat ID",
      placeholder: "user@example.com o +12025551234",
    },
    toName: {
      label: "Nombre del destinatario",
      description: "Nombre de la pantalla del destinatario (opcional)",
      placeholder: "John Doe",
    },
    subject: {
      label: "Asunto",
      description:
        "Línea de asunto (sólo correo electrónico, opcional para otros canales)",
      placeholder: "Su sujeto aquí...",
    },
    text: {
      label: "Mensaje",
      description:
        "Cuerpo de texto de plasma - utilizado para SMS / WhatsApp /Telegrama; error de correo electrónico",
      placeholder: "Escriba su mensaje...",
    },
    html: {
      label: "Contenido HTML",
      description:
        "El cuerpo HTML (sólo correo electrónico, opcional) vuelve al texto si se omite)",
      placeholder: "<p>Entra HTML contenido de correo electrónico...</p>",
    },
    senderName: {
      label: "Nombre del remitente",
      description: "Nombre del remitente (email solamente, opcional)",
      placeholder: "Su empresa",
    },
    replyTo: {
      label: "Responder-To",
      description:
        "Respuesta a la dirección (sólo correo electrónico, opcional)",
      placeholder: "support@example.com",
    },
    leadId: {
      label: "ID del contacto",
      description: "Prospecto asociado para el seguimiento (opcional)",
      placeholder: "UUID",
    },
    campaignId: {
      label: "Campaign ID",
      description: "Campaña asociada para el seguimiento (opcional)",
      placeholder: "UUID",
    },

    response: {
      title: "Enviar Resultado",
      description: "Resultado de la operación de envío",
      messageId: { label: "Mensaje ID" },
      accountName: { label: "Cuenta" },
      channel: { label: "Canal" },
      provider: { label: "Proveedor" },
      sentAt: { label: "Enviado" },
    },

    errors: {
      validation: {
        title: "Error de validación",
        description: "Por favor, compruebe su entrada e inténtelo de nuevo",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "No tienes permiso para enviar mensajes",
      },
      server: {
        title: "Error del servidor",
        description:
          "Se produjo un error de servidor interno mientras se envía",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Se prohíbe el acceso a este recurso.",
      },
      network: {
        title: "Error de red",
        description: "Se produjo un error de red mientras se envía",
      },
      notFound: {
        title: "Cuenta no encontrada",
        description: "La cuenta de mensajero especificada no fue encontrada",
      },
      conflict: {
        title: "Conflicto",
        description: "Solicite conflictos con los datos existentes",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
    },

    success: {
      title: "Mensaje enviado",
      description: "Su mensaje ha sido enviado con éxito",
    },
  },
  smtpClient: {
    tag: "Cliente SMTP",
    category: "Servicios de correo electrónico",
    components: {
      email: {
        tagline: "Libre discurso AI plataforma",
        footer: {
          needHelp: "¿Necesitas ayuda?",
          helpText: "¿Necesitas ayuda? Contacta con nosotros",
          unsubscribeText: "¿Prefieres dejar de recibir estos correos?",
          unsubscribeLink: "Cancelar suscripción",
          copyright:
            "© {{currentYear}} {{appName}}. Todos los derechos reservados.",
          visitWebsite: "Sitio web de visita",
          allRightsReserved:
            "© {{currentYear}} {{appName}}. Todos los derechos reservados.",
          feedbackHook:
            "¿Tienes algo que decir? Responder. En realidad lo leímos.",
          feedbackBody:
            "Informe un fallo, solicite una característica o díganos qué falta. Reacción útil te gana créditos {{credits}} – un mes completo en nosotros.",
          feedbackLink: "Responder con retroalimentación →",
          footerSeparator: " · ",
        },
      },
      post: {
        title: "Componentes",
        description: "Componentes endpoint",
        form: {
          title: "Configuración de componentes",
          description: "Configurar parámetros de componentes",
        },
        response: {
          title: "Respuesta",
          description: "Datos sobre la respuesta de los componentes",
        },
        errors: {
          unauthorized: {
            title: "Se requiere autenticación",
            description: "Inicia sesión para continuar",
          },
          validation: {
            title: "Error de validación",
            description: "Parámetros de solicitud no válidos",
          },
          server: {
            title: "Error del servidor",
            description: "Ocurrió un error interno del servidor",
          },
          unknown: {
            title: "Error desconocido",
            description: "Ocurrió un error desconocido",
          },
          network: {
            title: "Error de red",
            description: "Ocurrió un error de red",
          },
          forbidden: {
            title: "Acceso denegado",
            description: "No tienes acceso",
          },
          notFound: {
            title: "No encontrado",
            description: "No se encontró el recurso",
          },
          conflict: {
            title: "Conflicto",
            description: "Hay un conflicto entre los datos",
          },
        },
        success: {
          title: "Operación completada",
          description: "La operación se completó correctamente",
        },
      },
    },
    emailSending: {
      email: {
        defaultSenderName: "Sistema",
        errors: {
          sending_failed: "Failed to send email to {{recipient}}",
        },
      },
    },
    emailHandling: {
      email: {
        errors: {
          rendering_failed: "Failed to render email template",
          send_failed: "Fallado para enviar correo electrónico",
          email_failed_subject: "Correo electrónico fallado",
          unknown_recipient: "Recibido desconocido",
          unknown_sender: "Sistema",
          email_render_exception: "Excepción por correo electrónico",
          batch_send_failed: "Correo electrónico de Batch falló",
        },
      },
    },
    sending: {
      errors: {
        unauthorized: {
          title: "Se requiere autenticación",
          description:
            "Autenticación necesaria para las operaciones de envío SMTP",
        },
        server: {
          title: "Error del servidor",
          description: "Se produjo un error en el servidor SMTP",
        },
        rejected: {
          title: "Email Rechazado",
          defaultReason: "Correo electrónico rechazado por servidor",
        },
        no_recipients: {
          title: "No se aceptan beneficiarios",
          defaultReason: "No se aceptan receptores",
        },
        rate_limit: {
          title: "Se superó el límite de solicitudes",
        },
        capacity: {
          title: "Error de capacidad",
        },
        no_account: {
          title: "Cuenta SMTP No disponible",
        },
      },
    },
    emailMetadata: {
      errors: {
        server: {
          title: "Error de servidor de metadatos por correo electrónico",
          description: "Failed to store email metadata",
        },
      },
    },
    enums: {
      status: {
        active: "Activa",
        inactive: "Inactivo",
        error: "Error",
        testing: "Pruebas",
      },
      securityType: {
        none: "Ninguno",
        tls: "TLS",
        ssl: "SSL",
        starttls: "STARTTLS",
      },
      statusFilter: {
        all: "Todos los estatutos",
      },
      healthStatus: {
        healthy: "Salud",
        degraded: "Degradado",
        unhealthy: "Insalubres",
        unknown: "Desconocida",
      },
      healthStatusFilter: {
        all: "Todos los estados de salud",
      },
      sortField: {
        name: "Nombre",
        status: "Situación",
        createdAt: "Creado en",
        updatedAt: "Actualizado en",
        priority: "Prioridad",
        totalEmailsSent: "Total Emails Sent",
        lastUsedAt: "El último usado en",
      },
      campaignType: {
        leadCampaign: "Campaña de captación de contactos",
        newsletter: "Boletín",
        signupNurture: "Nutrición de registro",
        retention: "Retención",
        winback: "Winback",
        transactional: "Transaccional",
        notification: "Notificación",
        system: "Sistema",
      },
      campaignTypeFilter: {
        all: "Todos los tipos de campaña",
      },
      selectionRuleSortField: {
        name: "Nombre",
        priority: "Prioridad",
        campaignType: "Tipo de campaña",
        journeyVariant: "Variante de viaje",
        campaignStage: "Etapa de campaña",
        country: "País",
        language: "Idioma",
        createdAt: "Creado en",
        updatedAt: "Actualizado en",
        emailsSent: "Emails Sent",
        successRate: "Tasa de éxito",
        lastUsedAt: "El último usado en",
      },
      selectionRuleStatusFilter: {
        all: "Todos",
        active: "Activa",
        inactive: "Inactivo",
        default: "Predeterminado",
        failover: "Failover",
      },
      loadBalancingStrategy: {
        roundRobin: "Round Robin",
        weighted: "Visto",
        priority: "Prioridad",
        leastUsed: "Menos usado",
      },
      testResult: {
        success: "Operación completada",
        authFailed: "Autenticación fallida",
        connectionFailed: "Conexión fallida",
        timeout: "Hora de salir",
        unknownError: "Error desconocido",
      },
    },
  },

  // Core emails level translations
  tag: "Emails",
  tags: {
    stats: "Estadísticas",
    analytics: "Analítica",
  },
  error: {
    default: "Se produjo un error",
  },
  template: {
    tagline: "AI sin los velos de guardia",
  },
  footer: {
    visitWebsite: "Sitio web de visita",
    allRightsReserved: "Todos los derechos reservados",
  },

  // Email Templates
  templates: {
    leads: {
      batch: {
        update: {
          meta: {
            name: "Correo de actualización masiva de prospectos",
            description:
              "Correo electrónico enviado cuando los cables se actualizan en lote",
          },
          preview: {
            totalMatched: "Total emparejado",
            totalMatched_description: "Número de prospectos coincidentes",
            totalProcessed: "Total procesada",
            totalProcessed_description: "Número de prospectos procesados",
            totalUpdated: "Total actualizado",
            totalUpdated_description: "Número de prospectos actualizados",
            errorsCount: "Cuenta de errores",
            errorsCount_description:
              "Número de errores durante el procesamiento",
            dryRun: "Dry Run",
            dryRun_description: "Vista previa solamente sin hacer cambios",
            userId: "Usuario ID",
            userId_description: "ID del usuario que realiza la acción",
          },
        },
      },
      welcome: {
        meta: {
          name: "Lead Welcome Email",
          description:
            "Correo electrónico de bienvenida enviado a nuevas pistas",
        },
        preview: {
          leadId: "ID del contacto",
          leadId_description: "Unico identificador para el contacto",
          businessName: "Nombre del negocio",
          businessName_description: "Nombre del negocio (opcional)",
          email: "Correo electrónico",
          email_description: "Dirección de correo electrónico del contacto",
          userId: "Usuario ID",
          userId_description: "ID del usuario asociado (opcional)",
        },
      },
    },
    contact: {
      form: {
        meta: {
          name: "Formulario de contacto",
          description:
            "Correo electrónico enviado cuando el formulario de contacto se envía",
        },
        preview: {
          name: "Nombre",
          name_description: "Nombre del contacto",
          email: "Correo electrónico",
          email_description: "Dirección de correo electrónico del contacto",
          company: "Company",
          company_description: "Nombre de la empresa (opcional)",
          subject: "Asunto",
          subject_description: "Asunto del mensaje",
          message: "Mensaje",
          message_description: "Contenido del mensaje",
          isForCompany: "Cuenta de la empresa",
          isForCompany_description:
            "Si este correo electrónico es enviado al equipo de la empresa",
          userId: "Usuario ID",
          userId_description: "ID del usuario asociado (opcional)",
          leadId: "ID del contacto",
          leadId_description: "ID del contacto asociado (opcional)",
        },
      },
    },
    newsletter: {
      unsubscribe: {
        meta: {
          name: "Confirmación de cancelación del boletín",
          description:
            "Correo electrónico de confirmación cuando se suscribe del boletín informativo",
        },
        preview: {
          email: "Correo electrónico",
          email_description: "Dirección de correo electrónico sin suscripción",
        },
      },
      welcome: {
        meta: {
          name: "Boletín informativo",
          description:
            "Correo electrónico de bienvenida para nuevos suscriptores de newsletter",
        },
        preview: {
          email: "Correo electrónico",
          email_description: "Dirección de correo electrónico del suscriptor",
          name: "Nombre",
          name_description: "Nombre del suscriptor (opcional)",
          leadId: "ID del contacto",
          leadId_description: "ID del contacto asociado (opcional)",
          userId: "Usuario ID",
          userId_description: "ID del usuario asociado (opcional)",
        },
      },
    },
    password: {
      reset: {
        confirm: {
          meta: {
            name: "Confirmación de la contraseña",
            description:
              "Correo electrónico de confirmación después del reinicio de contraseña",
          },
          preview: {
            publicName: "Nombre público",
            publicName_description: "Nombre público del usuario",
            userId: "Usuario ID",
            userId_description: "Identificador único para el usuario",
          },
        },
        request: {
          meta: {
            name: "Solicitud de reasentamiento",
            description:
              "Correo electrónico con el enlace de reset de contraseña",
          },
          preview: {
            publicName: "Nombre público",
            publicName_description: "Nombre público del usuario",
            userId: "Usuario ID",
            userId_description: "Identificador único para el usuario",
            passwordResetUrl: "Password Reset URL",
            passwordResetUrl_description: "URL para restablecer la contraseña",
          },
        },
      },
    },
    signup: {
      welcome: {
        meta: {
          name: "Suscripción de usuario Bienvenido",
          description:
            "E-mail de bienvenida para nuevas suscripciones al usuario",
        },
        preview: {
          privateName: "Nombre privado",
          privateName_description: "Nombre privado del usuario",
          userId: "Usuario ID",
          userId_description: "Identificador único para el usuario",
          leadId: "ID del contacto",
          leadId_description: "ID del contacto asociado",
        },
      },
    },
    users: {
      welcome: {
        meta: {
          name: "Correo electrónico bienvenido",
          description:
            "Correo electrónico de bienvenida enviado a nuevos usuarios",
        },
        preview: {
          userId: "Usuario ID",
          userId_description: "Identificador único para el usuario",
          email: "Correo electrónico",
          email_description: "Dirección de correo electrónico del usuario",
          privateName: "Nombre privado",
          privateName_description: "Nombre privado del usuario",
          publicName: "Nombre público",
          publicName_description: "Nombre público del usuario",
          leadId: "ID del contacto",
          leadId_description: "ID del contacto asociado (opcional)",
        },
      },
    },
    subscription: {
      success: {
        meta: {
          name: "Suceso de suscripción",
          description:
            "Correo electrónico de confirmación para la suscripción exitosa",
        },
        preview: {
          privateName: "Nombre privado",
          privateName_description: "Nombre privado del usuario",
          userId: "Usuario ID",
          userId_description: "Identificador único para el usuario",
          leadId: "ID del contacto",
          leadId_description: "ID del contacto asociado",
          planName: "Nombre del plan",
          planName_description: "Nombre del plan de suscripción",
        },
      },
    },
    admin: {
      signup: {
        meta: {
          name: "Admin: Nuevo registro de usuario",
          description: "Aviso de Admin cuando un nuevo usuario se registra",
        },
        preview: {
          privateName: "Nombre privado",
          publicName: "Nombre público",
          email: "Correo electrónico",
          userId: "Usuario ID",
          subscribeToNewsletter: "Suscripción",
        },
      },
      subscription: {
        meta: {
          name: "Admin: nueva suscripción",
          description: "Aviso de Admin cuando un usuario se suscribe",
        },
        preview: {
          privateName: "Nombre privado",
          publicName: "Nombre público",
          email: "Correo electrónico",
          planName: "Nombre del plan",
          statusName: "Situación",
        },
      },
      user_create: {
        meta: {
          name: "Admin: Nuevo Usuario Creado",
          description: "Aviso de Admin cuando se crea una cuenta de usuario",
        },
        preview: {
          privateName: "Nombre privado",
          publicName: "Nombre público",
          email: "Correo electrónico",
          userId: "Usuario ID",
          leadId: "ID del contacto",
        },
      },
      contact: {
        meta: {
          name: "Admin: Formulario de contacto",
          description:
            "notificación de Admin cuando se presenta un formulario de contacto",
        },
        preview: {
          name: "Nombre del remitente",
          email: "Correo electrónico del remitente",
          subject: "Asunto",
          message: "Mensaje",
          company: "Company",
          userId: "Usuario ID",
          leadId: "ID del contacto",
        },
      },
    },
  },

  // Email Preview System
  preview: {
    render: {
      post: {
        title: "Render Email Preview",
        titleShort: "Vista previa de Render",
        description:
          "renderización lado del servidor de plantillas de correo electrónico para la vista previa",
        container: {
          title: "Configuración de vista previa de correo electrónico",
        },
        success: {
          title: "Vista previa Rendered",
          description: "Previsualización de correo electrónico con éxito",
        },
        fields: {
          templateId: {
            label: "Plantilla ID",
            description:
              "ID de la plantilla de correo electrónico para renderizar",
          },
          language: {
            label: "Idioma",
            description: "Lenguaje para la renderización de correo electrónico",
          },
          country: {
            label: "País",
            description: "País para el envío de correo electrónico",
          },
          props: {
            label: "Plantilla Props",
            description:
              "Propiedades para pasar a la plantilla de correo electrónico",
          },
          html: {
            title: "Rendered HTML",
          },
          subject: {
            title: "Asunto",
          },
          templateVersion: {
            title: "Versión de plantilla",
          },
        },
        errors: {
          validation: {
            title: "Error de validación",
            description: "Datos de solicitud de previsualización inválida",
          },
          network: {
            title: "Error de red",
            description: "Error de red mientras renderiza la vista previa",
          },
          unauthorized: {
            title: "Se requiere autenticación",
            description:
              "Usted no está autorizado a presentar previsualizaciones",
          },
          forbidden: {
            title: "Acceso denegado",
            description: "Previsualización de la renderización está prohibida",
          },
          notFound: {
            title: "No encontrado",
            description: "Plantilla de correo electrónico no encontrada",
          },
          server: {
            title: "Error del servidor",
            description:
              "Fallado para presentar la vista previa del correo electrónico",
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
            description: "Se produjo un conflicto mientras se produce",
          },
        },
      },
      title: "E-mail Preview",
      preview: "Vista previa",
      version: "Version",
      submit: "Vista previa de Render",
      submitting: "Rendering...",
    },
    sendTest: {
      post: {
        title: "Enviar prueba de email",
        titleShort: "Test Email",
        description:
          "Enviar correo electrónico de prueba con datos de plantilla personalizados",
        container: {
          title: "Configuración de correo electrónico de prueba",
        },
        success: {
          title: "Test Email Sent",
          description: "E-mail de prueba enviado con éxito",
        },
        fields: {
          templateId: {
            label: "Plantilla ID",
            description: "ID de la plantilla de correo electrónico para enviar",
          },
          recipientEmail: {
            label: "Recipiente Email",
            description:
              "Dirección de correo electrónico para enviar la prueba",
          },
          language: {
            label: "Idioma",
            description: "Lenguaje para la renderización de correo electrónico",
          },
          country: {
            label: "País",
            description: "País para el envío de correo electrónico",
          },
          props: {
            label: "Plantilla Props",
            description:
              "Propiedades para pasar a la plantilla de correo electrónico",
          },
          success: {
            title: "Operación completada",
          },
          message: {
            title: "Mensaje de resultados",
          },
        },
        errors: {
          validation: {
            title: "Error de validación",
            description:
              "Datos de solicitud de correo electrónico de prueba inválido",
          },
          network: {
            title: "Error de red",
            description:
              "Error de red al enviar el correo electrónico de prueba",
          },
          unauthorized: {
            title: "Se requiere autenticación",
            description:
              "Usted no está autorizado para enviar correos electrónicos de prueba",
          },
          forbidden: {
            title: "Acceso denegado",
            description:
              "El envío de correos electrónicos de prueba está prohibido",
          },
          notFound: {
            title: "No encontrado",
            description: "Plantilla de correo electrónico no encontrada",
          },
          server: {
            title: "Error del servidor",
            description: "Fallado para enviar el correo electrónico de prueba",
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
            description: "Se produjo un conflicto mientras se envía",
          },
        },
      },
      error: {
        templateNotFound:
          "Plantilla de correo electrónico {{templateId}} no encontrada",
        invalidProps: "Propietarios de plantilla inválidos: {{error}}",
        sendFailed: "Failed to send test email: {{error}}",
      },
      success: "E-mail de prueba enviado",
      successDetail: "E-mail de prueba enviado a {{email}}",
      title: "Enviar prueba de email",
      failed: "Fallado para enviar el correo electrónico de prueba",
      submit: "Enviar prueba de email",
      submitting: "Enviando…",
    },
  },
  messaging: {
    category: "Mensajería",
    tag: "mensajería",
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
        twilio: "Twilio",
        awsSns: "AWS SNS",
        messagebird: "MessageBird",
        http: "HTTP",
        whatsappBusiness: "WhatsApp Business",
        telegramBot: "Telegram Bot",
      },
      accountStatus: {
        active: "Activa",
        inactive: "Inactivo",
        error: "Error",
        testing: "Pruebas",
      },
    },
    send: {
      errors: {
        accountNotFound: "Cuenta de mensajería {{accountId}} no encontrada",
        sendFailed: "Fallado para enviar el mensaje",
        unexpected: "Mensaje de envío de error inesperado: {{error}}",
      },
    },
  },
  providers: {
    errors: {
      smtpSendFailed: "SMTP envió fallido",
      smtpAccountNotFound: "Cuenta IMAP no encontrada",
      smtpListInboxFailed: "Failed to list inbox",
      smtpListFoldersFailed: "Failed to list folders",
      smtpMoveMessageFailed: "Fallado para mover el mensaje",
      smtpMarkReadFailed: "Fallado para marcar el mensaje",
      resendKeyNotConfigured: "Reenviar la tecla API no configurada",
      resendSendFailed: "Reenviar fallido",
      resendProviderError: "Error del proveedor de reenviar",
      resendNoInbox: "Resend no admite la caja",
      resendNoFolders: "Reenviar no soporta carpetas",
      smsSendFailed: "SMS envió fallido",
      whatsappSendFailed: "WhatsApp envió fallido",
      telegramSendFailed: "Telegram envió fallido",
      accountNotFound: "Cuenta de mensajería no encontrada",
      notSupported: "Esta operación no es apoyada por este proveedor",
    },
  },
};
