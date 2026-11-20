import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
          "Informe un fallo, solicite una característica o díganos qué falta. Reacción útil te gana créditos {{credits}}. Eso es un mes completo para nosotros.",
        feedbackLink: "Responder con retroalimentación →",
        footerSeparator: " · ",
        legalOperator: "{{companyName}} es operado por {{owner}}, {{address}}.",
        legalContact: "Contacto",
        legalNotice: "Aviso legal",
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
        sending_failed: "Failed to send email to {{recipient}} : {{error}}",
        invalid_locale:
          "No se puede enviar a {{recipient}} : ' {{locale}} ' no es un local válido",
      },
    },
  },
  emailHandling: {
    email: {
      errors: {
        rendering_failed: "Failed to render email template: {{error}}",
        send_failed: "Failed to send email: {{error}}",
        email_failed_subject: "Correo electrónico fallado",
        unknown_recipient: "Recibido desconocido",
        unknown_sender: "Sistema",
        email_render_exception: "Excepción por correo electrónico",
        batch_send_failed: "Correo electrónico de Batch falló",
        batch_send_failed_item: "Batch envía fallado: {{error}}",
        batch_send_failed_all: "Correo electrónico de Batch falló: {{errors}}",
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
        detail: "SMTP no envió: {{error}}",
        detail_account:
          "Fallo SMTP en {{accountName}} ({{accountId}}): {{error}}",
        detail_attempt:
          "SMTP cuenta {{accountId}} falló en el intento {{attempt}} : {{error}}",
        detail_exhausted: "SMTP cuenta {{accountId}} agotó todos los registros",
      },
      rejected: {
        title: "Correo electrónico a {{recipient}} rechazado: {{reason}}",
        defaultReason: "Correo electrónico rechazado por servidor",
      },
      no_recipients: {
        title: "No se aceptan receptores para {{recipient}}",
        defaultReason: "No se aceptan receptores",
      },
      rate_limit: {
        title:
          "Límite de tarifa hora en {{accountName}} : {{current}} / {{limit}} enviado, {{remainingCapacity}} izquierdo",
      },
      capacity: {
        title: "No se ha comprobado la capacidad: {{error}}",
      },
      no_account: {
        title: "Cuenta SMTP No disponible",
        detail_criteria:
          "No cuenta SMTP para {{campaignType}} / {{journeyVariant}} / {{campaignStage}} / {{country}} / {{language}}",
        detail_campaign:
          "No cuenta SMTP para el tipo de campaña {{campaignType}}",
        detail_account: "SMTP cuenta {{accountId}} no se encontró",
      },
    },
  },
  emailMetadata: {
    errors: {
      server: {
        title: "Error de servidor de metadatos por correo electrónico",
        description: "Failed to store email metadata",
        detail_store:
          "No podía almacenar metadatos para {{recipient}} : {{error}}",
        detail_engagement:
          "No se pudo actualizar el compromiso para el mensaje {{emailId}} : {{error}}",
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
};
