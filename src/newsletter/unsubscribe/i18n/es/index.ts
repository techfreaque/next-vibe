import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Boletín",
  tags: {
    newsletter: "Boletín",
  },
  emailPlaceholder: "Ingresa tu correo",
  subscription: {
    unsubscribe: {
      title: "Cancelar suscripción",
      confirmButton: "Confirmar cancelación",
      success: "Cancelaste tu suscripción",
      error: "No pudimos cancelar tu suscripción",
    },
  },
  unsubscribe: {
    page: {
      title: "Cancelar suscripción",
      description:
        "Escribe tu dirección y pulsa el botón. Eso es todo, sin presiones.",
      subtitle: "Gestiona tu suscripción al boletín",
      emailProvided: {
        title: "Confirmar cancelación",
        description:
          "Con un clic dejas de recibir el boletín en esta dirección.",
      },
      unsubscribeButton: "Cancelar suscripción",
      unsubscribing: "Cancelando suscripción…",
      status: {
        subscribed: "Esta dirección recibe nuestro boletín.",
        notSubscribed: "Esta dirección no está en nuestra lista.",
      },
      subscribeText: "¿Cambiaste de opinión?",
      subscribeLink: "Volver a suscribirme",
      info: {
        title: "Lo que sucede después",
        description: "Esto es lo que necesitas saber sobre el dessubscribir:",
        immediate: {
          title: "Instantáneo.",
          description: "Dejarás de recibir el boletín de inmediato.",
        },
        resubscribe: {
          title: "Reversible.",
          description: "Si cambias de opinión, puedes volver a suscribirte.",
        },
      },
      alternatives: {
        title: "Antes de que te vayas",
        description: "Considerar estas alternativas:",
        subscribe: "Ajuste la frecuencia de correo electrónico en lugar",
        contact: "Dinos qué arreglar.",
      },
    },
  },
  email: {
    label: "Dirección de correo electrónico",
    description:
      "La dirección de correo electrónico para darse de baja del boletín informativo",
    placeholder: "user@example.com",
    unsubscribe: {
      title: "Suscríbete del boletín informativo",
      preview: "Cancelaste tu suscripción a nuestro boletín",
      greeting: "Hola.",
      confirmation: "La dirección {{email}} ya no recibirá nuestro boletín.",
      resubscribe_info:
        "Si cambias de opinión, puedes volver a suscribirte en nuestro sitio.",
      resubscribe_button: "Volver a suscribirme",
      support_message: "Si tienes dudas, escribe a nuestro equipo de soporte.",
      subject: "Confirmación de cancelación del boletín",
      admin_unsubscribe_notification: {
        title: "Notificación de baja del boletín",
        preview: "Un usuario canceló su suscripción al boletín",
        message: "Un usuario canceló su suscripción al boletín",
        email: "Correo electrónico",
        date: "Fecha",
        view_dashboard: "Ver Dashboard",
        subject: "Baja del boletín. Notificación para administradores",
      },
    },
  },
  response: {
    success: "Sucesivamente no se suscribe del boletín informativo",
    message: "Mensaje de éxito",
  },
  errors: {
    email_generation_failed: "Failed para generar correo electrónico",
    internal: {
      title: "Error interno",
      description:
        "Se produjo un error al procesar su solicitud de subscripción",
      detail: "No pudimos cancelar la suscripción: {{error}}",
    },
  },
  post: {
    title: "Newsletter Unsubscribe",
    titleShort: "Cancelar suscripción",
    description: "Suscripción de las actualizaciones del boletín informativo",
    form: {
      title: "Suscríbete del boletín informativo",
      description:
        "Introduzca su dirección de correo electrónico para darse de baja de nuestro boletín",
    },
    response: {
      title: "Respuesta de subscripción",
      description: "Confirmación de suscripción",
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      validation: {
        title: "Error de validación",
        description: "Dirección de correo electrónico inválida",
      },
      internal: {
        title: "Error interno",
        description:
          "Se produjo un error al procesar su solicitud de subscripción",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes acceso",
      },
    },
    success: {
      title: "Sucesivamente sin suscripción",
      description: "Usted ha sido suscrito de nuestro boletín de noticias",
    },
  },
  oneClick: {
    tag: "Un-Click Unsubscribe",
    post: {
      title: "Un-Click Unsubscribe",
      titleShort: "Cancelar suscripción",
      description:
        "Descríbete a través del enlace firmado con un solo clic en un encabezado de correo electrónico (RFC 8058)",
      container: {
        title: "Un-Click Unsubscribe",
        description:
          "Llamado por proveedores de correo. La ficha firmada autoriza al suscripto.",
      },
      token: {
        label: "Token",
        description: "Signed unsubscribe token from the email",
      },
      errors: {
        invalidToken: {
          title: "Enlace inválido",
          description: "Este enlace de cancelación no es válido.",
        },
        server: {
          title: "Error del servidor",
          description:
            "No pudimos cancelar tu suscripción. Vuelve a intentarlo.",
        },
        validation: {
          title: "Error de validación",
          description: "Formato de ficha inválida",
        },
      },
      success: {
        title: "Suscripción cancelada",
        description: "Estás fuera de la lista.",
      },
    },
  },
  sync: {
    failed: "Boletines de cancelación de suscripción falló",
    error: "Boletín de error de suscripción",
    tag: "Newsletter Sync",
    post: {
      title: "Newsletter Unsubscribe Sync",
      description:
        "Sincroniza el estado de los prospectos que cancelan su suscripción al boletín",
      container: {
        title: "Configuración de Sincronización",
        description:
          "Configurar los parámetros de sincronización de subscripción",
      },
      fields: {
        batchSize: {
          label: "Tamaño del lote",
          description: "Número de registros para procesar por lote",
        },
        dryRun: {
          label: "Dry Run",
          description: "Corre sin hacer cambios",
        },
      },
      response: {
        leadsProcessed: "Prospectos procesados",
        leadsUpdated: "Prospectos actualizados",
        executionTimeMs: "Tiempo de ejecución (ms)",
      },
      errors: {
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Inicia sesión para continuar",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No tienes acceso",
        },
        server: {
          title: "Error del servidor",
          description:
            "Se produjo un error mientras se sincronizan los suscriptos",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error desconocido",
        },
        validation: {
          title: "Error de validación",
          description: "Parámetros de solicitud no válidos",
        },
      },
      success: {
        title: "Sync Complete",
        description: "Newsletter unsubscribe sincron completó con éxito",
      },
    },
  },
  emailTemplates: {
    unsubscribe: {
      name: "Newsletter Unsubscribe Email",
      description:
        "Correo electrónico de confirmación enviado a los usuarios que se suscriben del boletín informativo",
      category: "newsletter",
      preview: {
        email: {
          label: "Dirección de correo electrónico",
          description: "Dirección de correo que se dará de baja",
        },
      },
    },
  },
  sms: {
    confirmation: {
      message:
        "Cancelaste tu suscripción al boletín de {{appName}}. Si fue un error, puedes volver a suscribirte en nuestro sitio.",
    },
    admin_notification: {
      message:
        "Newsletter Unsubscribe: {{email}} no ha subscrito del boletín informativo.",
    },
    errors: {
      confirmation_failed: {
        title: "SMS Confirmación fallada",
        description:
          "Fallado para enviar la confirmación de su suscripción SMS",
      },
      admin_notification_failed: {
        title: "Admin SMS Notification Failed",
        description: "No envió notificación de administración SMS",
      },
    },
  },
};
