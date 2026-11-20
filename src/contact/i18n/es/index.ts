/**
 * Contact API translations (English)
 */

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Habla con una persona",
  titleShort: "Contáctanos",
  description:
    "¿Algo no funciona o quieres hablar con alguien? Cuéntanos qué necesitas. Una persona de nuestro equipo leerá tu mensaje y te responderá.",
  category: "Sistema",
  summary:
    "Presentaciones de formularios de contacto de procesos con seguimiento de plomo",
  tags: {
    contactForm: "Formulario de contacto",
    contactUs: "Contáctanos",
    contactSubmission: "Comunicación de contacto",
    helpSupport: "Ayuda &quot; Apoyo",
  },

  form: {
    label: "Contáctanos",
    description:
      "Una persona leerá tu mensaje y te responderá. Sin bots ni vueltas.",
    fields: {
      name: {
        label: "Tu nombre",
        description:
          "Nombre completo de la persona que presenta el formulario de contacto. Mínimo 2 caracteres.",
        placeholder: "John Doe",
      },
      email: {
        label: "Dirección de correo electrónico",
        description:
          "¿Dónde podemos responderte? Si ya iniciaste sesión, deja el campo vacío y usaremos el correo de tu cuenta.",
        placeholder: "john.doe@example.com",
      },
      company: {
        label: "Company",
        description:
          "Nombre de la empresa u organización opcional asociado a la investigación.",
        placeholder: "Acme Corp",
      },
      subject: {
        label: "Asunto",
        description:
          "Categoría de la investigación - utilizado para enrutar el mensaje al equipo correcto.",
        placeholder: "Investigación general sobre los servicios",
      },
      message: {
        label: "Mensaje",
        description:
          "Texto completo de la investigación. Mínimo 10 caracteres. Sé específico sobre tus necesidades.",
        placeholder: "¿Qué necesitas? Con unas frases basta.",
      },
      priority: {
        label: "Prioridad",
        description:
          "Nivel de frecuencia para la investigación. Las solicitudes altas o urgentes reciben respuestas más rápidas.",
        placeholder: "Nivel de prioridad",
      },
      leadId: {
        label: "ID del contacto",
        description: "Rastreo interno de plomo ID (auto-filled)",
        placeholder: "lead_123",
      },
    },
    submitButton: {
      label: "Enviar mensaje",
      loadingText: "Enviando…",
    },
  },

  subject: {
    helpSupport: "Ayuda &quot; Apoyo",
    generalInquiry: "Investigación general",
    technicalSupport: "Technical Support",
    accountQuestion: "Cuestión de la cuenta",
    billingQuestion: "Cuestión de la facturación",
    salesInquiry: "Investigación de ventas",
    featureRequest: "Solicitud de asignación",
    bugReport: "Informe de error",
    feedback: "Reacción",
    complaint: "Denuncia",
    partnership: "Partnership",
    other: "Otro",
  },

  priority: {
    low: "Baja",
    medium: "Mediana",
    high: "Alto",
    urgent: "Urgente",
  },

  status: {
    new: "Nuevo",
    inProgress: "En progreso",
    resolved: "Resolved",
    closed: "Cerrado",
  },

  response: {
    label: "Respuesta a la presentación de comunicaciones",
    description: "Actualizaciones de estado para su presentación de contacto",
    success:
      "¡Gracias por contactarnos! Recibimos su mensaje y pronto regresaremos a usted.",
    messageId: "Mensaje ID para el seguimiento",
    status: "Situación actual del contacto",
  },

  examples: {
    requests: {
      general: {
        title: "Consulta General de Contacto",
        description: "Ejemplo de un formulario de contacto general",
      },
    },
    responses: {
      success: {
        title: "Successful Submission",
        description: "Ejemplo de respuesta exitosa del formulario de contacto",
      },
    },
  },

  errors: {
    createFailed: {
      title: "La comunicación de contacto falló",
      description:
        "Incapaz de procesar su formulario de contacto en este momento. Por favor, inténtalo de nuevo más tarde.",
    },
    repositoryCreateFailed: "Failed to create contact request: {{error}}",
    repositoryCreateFailedForEmail:
      "Failed to create contact request for {{email}}",
    repositoryCreateFailedWithDetails:
      "Failed to create contact request: {{error}}. {{details}}",
    repositoryCreateDetails:
      "Incapaz de procesar su formulario de contacto en este momento. Por favor, inténtalo de nuevo más tarde.",
    noContactReturned:
      "No se devolvió ningún registro de contacto después de la creación",
    validation: {
      messageEmpty: "Introduzca un mensaje antes de enviar.",
      title: "Error de validación",
      description: "Por favor, compruebe su entrada e inténtelo de nuevo",
      nameMinLength: "El nombre debe ser por lo menos 2 caracteres de largo",
      emailInvalid:
        "Por favor, introduzca una dirección de correo electrónico válida",
      emailRequired:
        "Por favor, proporcione una dirección de correo electrónico para que podamos responderle",
      subjectRequired: "El asunto es necesario",
      messageMinLength:
        "El mensaje debe ser de al menos 10 caracteres de largo",
      priorityInvalid: "Seleccione un nivel de prioridad válido",
      statusInvalid: "Valor de estado inválido",
    },
    network: {
      title: "Error de red",
      description: "Se produjo un error de red al procesar su solicitud",
    },
    unauthorized: {
      title: "Se requiere autenticación",
      description: "Usted no está autorizado para realizar esta acción",
    },
    forbidden: {
      title: "Acceso denegado",
      description: "Esta acción está prohibida",
    },
    notFound: {
      title: "No encontrado",
      description: "No se encontró el recurso solicitado",
    },
    serverError: {
      title: "Error del servidor",
      description: "Se produjo un error de servidor interno",
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
      description: "Un conflicto ocurrió mientras procesaba su solicitud",
    },
    email_generation_failed: "Failed para generar correo electrónico",
  },

  sms: {
    admin: {
      notification: "Nueva pregunta de contacto: {name} ({email}) - {subject}",
      phone: {
        missing:
          "No hay número de teléfono de administrador configurado para notificaciones de contacto",
      },
      send: {
        start:
          "Enviar notificación de administración SMS para la presentación de contacto",
        error: "Aviso de envío de error SMS para contacto",
      },
    },
    confirmation: {
      message: "{name}, gracias por tu mensaje! Volveremos pronto.",
      phone: {
        missing:
          "No hay número de teléfono disponible para confirmación de contacto SMS",
      },
      send: {
        start:
          "Enviar confirmación SMS para el remitente del formulario de contacto",
        error: "Confirmación de error de envío SMS para contacto",
      },
    },
  },

  repository: {
    create: {
      start: "Presentación del formulario de contacto inicial",
      success: "Formulario de contacto presentado con éxito",
      error: "Error de creación de formulario de contacto",
    },
    lead: {
      conversion: {
        start: "Conversión inicial de plomo para contacto",
        error: "Error durante la conversión de plomo para contacto",
      },
      provided: "Lead ID provided for contact submission",
    },
    seed: {
      create: {
        start: "Creación de semillas de contacto inicial",
        error: "Error creando semilla de contacto",
      },
    },
  },

  route: {
    sms: {
      admin: {
        failed:
          "Notificación de alarma SMS falló en la presentación de contacto",
      },
      confirmation: {
        failed: "Confirmación SMS falló para la presentación de contacto",
      },
    },
  },

  seeds: {
    dev: {
      start: "Comenzar semillas de contacto para el entorno de desarrollo",
      submission: {
        created: "Comunicación de contacto creada en semillas de desarrollo",
        failed: "Failed to create contact submission in development seeds",
        error: "Error de creación de contacto en semillas de desarrollo",
      },
      complete: "Semillas de desarrollo de contactos terminadas",
      error: "Datos de desarrollo de contacto de búsqueda de errores",
    },
    test: {
      start: "Comenzar semillas de contacto para el ambiente de prueba",
      submission: {
        created: "Sumisión de contacto creada en las semillas de prueba",
        failed: "Failed to create contact submission in test seeds",
      },
      error: "Datos de prueba de contacto de búsqueda de errores",
    },
    prod: {
      start: "Comenzar semillas de contacto para el entorno de producción",
      ready: "Medio ambiente de producción de contacto listo",
      error: "Datos de producción de contacto verificados por error",
    },
  },

  noEmail: {
    warning: {
      title: "Falta una dirección de respuesta",
      description:
        "Sin un correo podemos leer tu mensaje, pero no responderte. Puedes enviarlo de todos modos.",
      addEmail: "Agregar correo",
      sendAnyway: "Enviar de todos modos",
    },
  },

  success: {
    title: "Mensaje enviado",
    description:
      "Recibimos tu mensaje. Te responderá una persona de nuestro equipo.",
  },

  aiPrompt: {
    confirmBeforeSend:
      "Siempre confirme con el usuario antes de enviar un formulario de contacto en su nombre.",
    humanHelp:
      "Si el usuario parece frustrado, molesto o atorado - ofrece proactivamente conectarlos con un humano en nuestro equipo de soporte a través del formulario de contacto.",
    emailFallback:
      "Si el usuario está conectado, su correo electrónico ya está en el archivo - no necesitan proporcionarlo de nuevo.",
  },

  email: {
    // Legacy keys for existing email template compatibility
    partner: {
      greeting: "Hola.",
      thankYou: "¡Gracias por contactarnos!",
      message: "Mensaje",
      additionalInfo: "Hemos recibido su consulta y responderemos pronto.",
      subject: "Formulario de contacto",
    },
    company: {
      contactDetails: "Datos de contacto",
      name: "Nombre",
      email: "Correo electrónico",
      company: "Company",
      contactSubject: "Asunto",
      viewDetails: "Vista en Admin",
    },
    // User confirmation email
    user_confirmation: {
      title: "Recibimos tu mensaje",
      subject: "Gracias por contactar a {{appName}}",
      previewText: "Recibimos tu mensaje. Te responderemos pronto.",
      greeting: "Hola, {{name}}:",
      thankYou: "¡Gracias por escribir a {{appName}}!",
      confirmation:
        "Tu mensaje llegó. Una persona lee cada mensaje y respondemos en cuanto podemos.",
      yourMessage: "Tu mensaje",
      subject_label: "Asunto",
      message_label: "Mensaje",
      whatHappensNext: "¿Qué pasa ahora?",
      step1: "Una persona lee tu mensaje",
      step2: "Te respondemos en cuanto podemos",
      step3: "Buscamos una solución contigo",
      needUrgentHelp: "¿Necesitas ayuda urgente?",
      urgentHelpInfo:
        "En el centro de ayuda ya hay respuestas a muchas preguntas.",
      helpCenterButton: "Abrir el centro de ayuda",
      signoff:
        "Gracias por elegir {{appName}},\nEl equipo de soporte de {{appName}}",
      footer: "Confirmación automática de {{appName}}",
    },
    // Admin notification email
    admin_notification: {
      title: "Nuevo mensaje del formulario de contacto",
      subject: "Nuevo mensaje de {{name}}: {{subject}}",
      previewText: "Nuevo mensaje de {{name}} ({{email}})",
      message: "Llegó un mensaje nuevo del formulario de contacto.",
      contactDetails: "Datos de contacto",
      name: "Nombre",
      email: "Correo electrónico",
      company: "Company",
      subject_label: "Asunto",
      priority: "Prioridad",
      message_label: "Mensaje",
      submittedAt: "Presentada en",
      leadInfo: "Información del contacto",
      leadId: "ID del contacto",
      status: "Situación",
      actionRequired: "Acción requerida",
      actionInfo: "Revisa la solicitud y responde en cuanto puedas.",
      viewInAdmin: "Abrir el panel de administración",
      replyToContact: "Responder al remitente",
      footer: "Notificación automática de {{appName}}",
    },
  },

  error: {
    general: {
      internal_server_error: "Ocurrió un error interno del servidor",
    },
  },

  emailTemplates: {
    contactForm: {
      meta: {
        name: "Notificación del formulario de contacto",
        description:
          "Correo electrónico enviado al contacto y al equipo de la empresa cuando se envía un formulario de contacto",
        category: "contacto",
      },
      preview: {
        name: {
          label: "Nombre del remitente",
          description:
            "Nombre completo de la persona que presenta el formulario de contacto",
        },
        email: {
          label: "Correo del remitente",
          description: "Dirección de correo de quien envía el formulario",
        },
        company: {
          label: "Nombre de la empresa",
          description: "Nombre de la empresa opcional del remitente",
        },
        subject: {
          label: "Asunto del mensaje",
          description: "Línea de asunto del mensaje de contacto",
        },
        priority: {
          label: "Nivel de prioridad",
          description: "Nivel de frecuencia de la investigación",
        },
        message: {
          label: "Mensaje",
          description:
            "El contenido principal del mensaje desde el formulario de contacto",
        },
        isForCompany: {
          label: "Envío a la empresa",
          description:
            "Indica si el correo se envía a la empresa como aviso o al remitente como confirmación",
        },
        userId: {
          label: "Usuario ID",
          description: "Usuario opcional ID para el seguimiento",
        },
        leadId: {
          label: "ID del contacto",
          description: "ID de plomo opcional para el seguimiento de CRM",
        },
      },
    },
    adminContact: {
      meta: {
        name: "Notificación de contacto de Admin",
        description:
          "Correo electrónico de notificación interna enviado a los administradores cuando se envía un nuevo formulario de contacto",
        category: "admin",
      },
      preview: {
        name: {
          label: "Nombre del remitente",
        },
        email: {
          label: "Correo del remitente",
        },
        subject: {
          label: "Asunto del mensaje",
        },
        priority: {
          label: "Nivel de prioridad",
        },
        message: {
          label: "Mensaje",
        },
        company: {
          label: "Nombre de la empresa",
        },
        userId: {
          label: "Usuario ID",
        },
        leadId: {
          label: "ID del contacto",
        },
      },
    },
  },
};
