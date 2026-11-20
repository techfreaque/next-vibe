import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Boletín",
  status: {
    title: "Estado de la comunicación",
    description:
      "Check newsletter status de suscripción para una dirección de correo electrónico",
    category: "Boletín",
    tags: {
      status: "Situación",
    },
    form: {
      title: "Estado del registro",
      description:
        "Ingrese una dirección de correo electrónico para comprobar su estado de suscripción al boletín",
    },
    email: {
      label: "Dirección de correo electrónico",
      description:
        "La dirección de correo electrónico para comprobar el estado de suscripción",
      placeholder: "user@example.com",
      helpText:
        "Introduzca la dirección de correo electrónico que desea comprobar",
    },
    response: {
      subscribed: "Estado de la suscripción",
      status: "Situación actual",
    },
    errors: {
      validation: {
        title: "Correo electrónico inválido",
        description:
          "Por favor, proporcione una dirección de correo electrónico válida",
      },
      internal: {
        title: "Error interno",
        description:
          "Se produjo un error al revisar el estado de la suscripción",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description:
          "Usted no está autorizado para comprobar este estado de suscripción",
      },
      notFound: {
        title: "No encontrado",
        description:
          "No se ha encontrado información de suscripción para esta dirección de correo electrónico",
      },
    },
    success: {
      title: "Estado civil",
      description:
        "Estado de suscripción de newsletters recuperado exitosamente",
    },
  },
  subscribe: {
    category: "Boletín",
    tags: {
      newsletter: "Boletín",
      subscription: "Suscripción",
    },
    email: {
      label: "Dirección de correo electrónico",
      description:
        "Su dirección de correo electrónico para la suscripción a newsletter",
      placeholder: "user@example.com",
      helpText:
        "Usaremos esto para enviarle actualizaciones de boletín informativo",
    },
    name: {
      label: "Nombre",
      description: "Su nombre (opcional)",
      placeholder: "John Doe",
      helpText: "Ayúdanos a personalizar su experiencia de boletín informativo",
    },
    preferences: {
      label: "Preferencias del boletín",
      description: "Seleccione los tipos de boletines que desea recibir",
      placeholder: "Seleccione sus preferencias",
      helpText: "Usted puede cambiar estas preferencias en cualquier momento",
    },
    leadId: {
      label: "ID del contacto",
      description: "Identificador de contacto opcional",
      placeholder: "123e4567-e89b-12d3-a456-426614174000",
      helpText: "Uso interno únicamente",
    },
    response: {
      success: "Suscrito exitosamente al boletín informativo",
      message: "Mensaje de éxito",
      leadId: "Identificador del contacto",
      subscriptionId: "Suscripción ID",
      userId: "Usuario ID",
      alreadySubscribed:
        "Esta dirección de correo electrónico ya está suscrita a nuestro boletín informativo",
    },
    errors: {
      email_generation_failed: "Failed para generar correo electrónico",
      badRequest: {
        title: "Bad Request",
        description: "Parámetros de solicitud inválidos proporcionados",
      },
      internal: {
        title: "Error interno",
        description: "Se produjo un error al procesar su suscripción",
      },
    },
    post: {
      title: "Suscripción",
      description:
        "Suscríbete a las actualizaciones y notificaciones del boletín informativo",
      form: {
        title: "Suscripción",
        description: "Configure sus preferencias de suscripción de newsletter",
      },
      response: {
        title: "Respuesta de suscripción",
        description: "Datos de confirmación de suscripción al boletín",
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
        internal: {
          title: "Error interno",
          description: "Se produjo un error al procesar su suscripción",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No tienes acceso",
        },
        conflict: {
          title: "Ya tienes una suscripción",
          description:
            "Esta dirección de correo electrónico ya está suscrita a nuestro boletín informativo",
        },
        badRequest: {
          title: "Bad Request",
          description: "Parámetros de solicitud inválidos proporcionados",
        },
      },
      success: {
        title: "Suscrita exitosamente",
        description:
          "Usted ha sido suscrito con éxito a nuestro boletín de noticias",
      },
    },
    repository: {
      starting: "Inicio de la suscripción a newsletter",
      linking_to_lead: "Vinculación de la suscripción de newsletter a contacto",
      lead_found: "Se encontró el prospecto para la suscripción al boletín",
      lead_updated: "Lead actualizado con datos de suscripción de newsletter",
      lead_update_failed: "Failed to update lead with newsletter data",
      lead_not_found: "No se encontró el prospecto o no se puede actualizar",
      lead_linking_error:
        "Error durante el enlace de contacto desde el boletín informativo",
      missing_lead_id: "Intensión de suscripción al boletín sin leadId",
      already_subscribed: "Usuario ya suscrito al boletín informativo",
      reactivating: "Reactivación de la suscripción de newsletter",
      creating_new: "Creación de nueva suscripción a newsletters",
      created_successfully: "Sucesivamente creado boletín de noticias",
      subscription_failed: "La suscripción al boletín falló",
    },
    sms: {
      no_phone_number:
        "No hay número de teléfono disponible para newsletter welcome SMS",
      sending_welcome: "Enviar la bienvenida SMS a suscriptor de newsletter",
      welcome_error: "Boletines de envío de errores bienvenida SMS",
      no_admin_phone:
        "No hay número de teléfono administrador configurado, saltando la notificación SMS",
      sending_admin_notification:
        "Enviar notificación de administración SMS para suscripción a newsletter",
      admin_notification_error: "Aviso de envío de error SMS",
      welcome: {
        message:
          "¡Hola {{name}}! Bienvenido a nuestro boletín. ¡Manténganse atentos para las actualizaciones!",
      },
      admin_notification: {
        message:
          "Nueva suscripción a la newsletter: {{displayName}} ({{email}}) se ha suscrito",
      },
    },
    route: {
      sms_failed_continuing: "Las notificaciones SMS fallaron pero continuaron",
    },
    emailTemplates: {
      welcome: {
        name: "Boletín informativo",
        description:
          "Correo electrónico de bienvenida enviado a nuevos suscriptores de newsletter",
        category: "newsletter",
        preview: {
          email: {
            label: "Dirección de correo electrónico",
            description: "Dirección de correo electrónico del suscriptor",
          },
          name: {
            label: "Nombre del suscriptor",
            description: "Nombre del suscriptor (opcional)",
          },
          leadId: {
            label: "ID del contacto",
            description:
              "Identificador de seguimiento de contacto para análisis",
          },
          userId: {
            label: "Usuario ID",
            description: "Identificador de la cuenta de usuario (opcional)",
          },
        },
      },
    },
    emailTemplate: {
      welcome: {
        title: "¡Te damos la bienvenida al boletín de {{appName}}!",
        subject:
          "Te damos la bienvenida a {{appName}}. Novedades sobre IA sin censura",
        preview:
          "Ya tienes tu suscripción. Recibe novedades sobre IA sin censura, nuevos modelos y consejos para suscriptores.",
        greeting_with_name: "¡Hola, {{name}}!",
        greeting: "¡Hola!",
        message:
          "Te damos la bienvenida al boletín de {{appName}}. Ya eres parte de una comunidad que quiere conversaciones honestas y sin censura con la IA.",
        what_to_expect: "Lo que vas a recibir:",
        benefit_1: "Novedades y actualizaciones de los modelos de IA",
        benefit_2: "Consejos para sacarle más provecho a la IA sin censura",
        benefit_3: "Ofertas exclusivas y acceso anticipado a nuevas funciones",
        benefit_4: "Novedades e historias de la comunidad",
        frequency:
          "Te escribiremos cada pocas semanas con novedades y consejos. Sin spam.",
        unsubscribe_text: "¿Prefieres dejar de recibir estos correos?",
        unsubscribe_link: "Cancelar suscripción",
      },
      admin_notification: {
        title: "Nueva suscripción al boletín informativo",
        subject: "Nueva suscripción al boletín informativo",
        preview: "Un nuevo usuario se ha suscrito al boletín informativo",
        message: "Un nuevo usuario se ha suscrito al boletín informativo.",
        subscriber_details: "Detalles del suscriptor",
        email: "Correo electrónico",
        name: "Nombre",
        preferences: "Preferencias",
        view_in_admin: "Abrir el panel de administración",
      },
    },
  },
  unsubscribe: {
    category: "Boletín",
    tags: {
      newsletter: "Boletín",
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
        support_message:
          "Si tienes dudas, escribe a nuestro equipo de soporte.",
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
      },
    },
    post: {
      title: "Newsletter Unsubscribe",
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
    sync: {
      failed: "Boletines de cancelación de suscripción falló",
      error: "Boletín de error de suscripción",
      tag: "Newsletter Sync",
      post: {
        title: "Newsletter Unsubscribe Sync",
        titleShort: "Unsub Sync",
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
  },
  email: {
    welcome: {
      title: "Bienvenidos a nuestro Boletín",
      preview: "¡Bienvenido a nuestro boletín! Gracias por suscribirse",
      greeting: "Hola.",
      greeting_with_name: "Hola, {{name}}",
      message:
        "¡Te damos la bienvenida al boletín de {{appName}}! Gracias por suscribirte.",
      what_to_expect: "Esto encontrarás en nuestro boletín:",
      benefit_1: "Actualizaciones y características de producto más recientes",
      benefit_2: "Perspectivas y tendencias de la industria",
      benefit_3: "Contenido y consejos exclusivos",
      benefit_4: "Ofertas y promociones especiales",
      frequency:
        "Cada semana te enviaremos un boletín con las últimas novedades.",
      unsubscribe_text: "Puedes darte de baja cuando quieras haciendo clic",
      unsubscribe_link: "aquí",
      subject: "¡Bienvenido a nuestro Boletín!",
    },
    admin_notification: {
      title: "Nueva suscripción al boletín informativo",
      preview: "Un nuevo usuario se ha suscrito al boletín informativo",
      message: "Un nuevo usuario se ha suscrito a su newsletter.",
      subscriber_details: "Detalles del suscriptor",
      email: "Correo electrónico",
      name: "Nombre",
      preferences: "Preferencias",
      view_in_admin: "Abrir el panel de administración",
      subject: "Nueva suscripción al boletín - Notificación del administrador",
    },
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
  enum: {
    preferences: {
      marketing: "Marketing",
      productNews: "Noticias del producto",
      companyUpdates: "Actualizaciones de la empresa",
      industryInsights: "Insights Industry",
      events: "Eventos",
    },
    status: {
      subscribed: "Suscrito",
      unsubscribed: "Suscripción cancelada",
      pending: "Pendiente",
      bounced: "Bounced",
      complained: "Denuncias",
    },
    creditBonus: {
      active: "Bono activo",
      pendingConfirmation: "Confirma tu correo para desbloquear el bono",
      claimedElsewhere: "Ya reclamado por otra cuenta",
      accountRequired: "Cuenta gratuita requerida",
    },
  },
  hooks: {
    errors: {
      missing_lead_id: "suscripción al boletín: Falta leadId",
    },
  },
  errors: {
    email_generation_failed: "Failed para generar correo electrónico",
  },
  error: {
    general: {
      internal_server_error: "Error del servidor interno",
    },
    default: "Se produjo un error",
  },
  subscription: {
    error: {
      description: "No se puede suscribir al boletín informativo",
    },
    unsubscribe: {
      error: "No suscribirse del boletín de noticias",
      confirmQuestion: "¿Quieres cancelar tu suscripción?",
    },
  },
};
