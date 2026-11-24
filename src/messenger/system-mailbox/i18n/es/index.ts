import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Plataforma Mailbox",
  tag: "Plataforma Mailbox",

  task: {
    description:
      "Componer el informe de estado interno diario y enviarlo desde el buzón de la plataforma",
  },

  send: {
    title: "Enviar correo de plataforma",
    titleShort: "Enviar correo",
    description:
      "Enviar un correo electrónico transaccional desde el buzón de la plataforma y archivarlo en Sent",
    container: {
      title: "Enviar correo de plataforma",
      description:
        "Un destinatario, un mensaje. Almacenado en la carpeta Sent después de la entrega.",
    },
    fields: {
      to: {
        label: "Recipiente",
        description: "Una sola dirección de correo electrónico",
        placeholder: "name@example.com",
      },
      subject: {
        label: "Asunto",
        description: "Título",
        placeholder: "¿De qué se trata esto?",
      },
      body: {
        label: "Mensaje",
        description: "Cuerpo de texto simple",
        placeholder: "Escribe el mensaje...",
      },
      html: {
        label: "Cuerpo HTML",
        description: "Opcional versión HTML simple",
        placeholder: "<p> Opcional HTML </p>",
      },
    },
    response: {
      messageId: "Mensaje ID",
      from: "Desde",
      to: "A",
      storedInSent: "Almacenado en Sent",
      sentFolder: "Carpeta enviada",
      sentLastHour: "Enviado en la última hora",
      rateLimitPerHour: "Limitación horaria",
    },
    widget: {
      submit: "Enviar correo",
      submitting: "Enviando…",
      sent: "Correo enviado",
      filed: "Filed in Sent",
      notFiled: "Entregado, pero no archivado en sentencia",
      yes: "Sí.",
      no: "No.",
    },
    success: {
      title: "Correo enviado",
      description: "El mensaje fue entregado al servidor de correos",
    },
  },

  inbox: {
    title: "Plataforma Inbox",
    titleShort: "Bandeja de entrada",
    description: "Lista de mensajes recientes INBOX del buzón de la plataforma",
    container: {
      title: "Plataforma Inbox",
      description:
        "Lo más nuevo primero. La lectura nunca marca un mensaje como leído.",
    },
    fields: {
      limit: {
        label: "Limitación",
        description: "¿Cuántos mensajes hay que devolver (1-50)",
        placeholder: "20",
      },
      unreadOnly: {
        label: "Sólo falta leer",
        description: "Sólo devuelve mensajes no leídos",
      },
    },
    response: {
      address: "Mailbox",
      messages: {
        title: "Mensajes",
        uid: "UID",
        from: "Desde",
        subject: "Asunto",
        date: "Fecha",
        snippet: "Snippet",
        unread: "No.",
      },
    },
    widget: {
      submit: "Refresh inbox",
      submitting: "Cargando...",
      empty: "No hay mensajes",
      emptyDescription: "Nada coincide con estos filtros.",
      unread: "No.",
      noSubject: "(sin tema)",
      open: "Abierto",
    },
    success: {
      title: "Caja de entrada cargada",
      description: "Mensajes recogidos del buzón de plataforma",
    },
  },

  message: {
    title: "Lea la plataforma Mail",
    titleShort: "Lea Mail",
    description: "Buscar un mensaje INBOX del buzón de plataforma por UID",
    container: {
      title: "Lea la plataforma Mail",
      description: "Cuerpo completo de un mensaje. No lo marca como leído.",
    },
    fields: {
      uid: {
        label: "UID",
        description: "Mensaje UID desde la lista de la caja",
        placeholder: "42",
      },
    },
    response: {
      uid: "UID",
      from: "Desde",
      to: "A",
      subject: "Asunto",
      date: "Fecha",
      messageId: "Mensaje ID",
      unread: "No.",
      bodyText: "Cuerpo",
    },
    widget: {
      submit: "Texto",
      submitting: "Cargando...",
      unread: "No.",
      noSubject: "(sin tema)",
    },
    success: {
      title: "Mensaje cargado",
      description: "Mensaje recogido del buzón de la plataforma",
    },
  },

  report: {
    title: "Informe diario de estado",
    titleShort: "Informe diario",
    description:
      "Componga el último informe de plataforma-24h y envíelo por correo desde el buzón de plataforma",
    container: {
      title: "Daily Status Report",
      description:
        "Suscripciones, suscripciones, gasto de crédito, embudo, incidentes de tarea y errores. Texto sencillo.",
    },
    fields: {
      to: {
        label: "Recipiente",
        description: "Deja vacío para usar la dirección de informe configurada",
        placeholder: "name@example.com",
      },
      dryRun: {
        label: "Vista previa solamente",
        description: "Componga el informe pero no lo envíe",
      },
    },
    response: {
      subject: "Asunto",
      body: "Informe",
      recipient: "Recipiente",
      sent: "Sent",
      sections: "Seccións incluidas",
      skippedSections: "Secciones saltadas",
    },
    widget: {
      submit: "Enviar informe",
      submitting: "Componiendo...",
      sent: "Informe enviado",
      preview: "Vista previa",
    },
    success: {
      title: "Informe listo",
      description: "El informe diario sobre la situación se compuso",
    },
  },

  errors: {
    unauthorized: {
      title: "Se requiere autenticación",
      description: "Inicia sesión para continuar",
    },
    forbidden: {
      title: "Acceso denegado",
      description:
        "Sólo los administradores pueden utilizar el buzón de la plataforma",
    },
    server: {
      title: "Error del servidor",
      description: "La solicitud de buzón de plataforma falló",
    },
    unknown: {
      title: "Error desconocido",
      description: "Ocurrió un error desconocido",
    },
    validation: {
      title: "Error de validación",
      description: "Parámetros de solicitud no válidos",
    },
    notConfigured:
      "El buzón de la plataforma no está configurado. Juego THEA_MAIL_ADDRESS, THEA_MAIL_HOST y THEA_MAIL_PASSWORD.",
    invalidRecipient:
      "El destinatario debe ser una dirección de correo electrónico válida",
    noRecipient: "Sin receptor. Pase uno o conjunto THEA_MAIL_REPORT_TO.",
    rateLimited:
      "Plazo de envío al día ({{sent}} de {{limit}}). Inténtalo de nuevo más tarde.",
    smtpFailed: "El servidor de correo rechazó el mensaje: {{error}}",
    imapFailed: "No podía llegar al buzón de correo: {{error}}",
    messageNotFound: "No hay mensaje con ese UID en la bandeja de entrada",
    reportFailed: "No pudo componer el informe: {{error}}",
  },
};
