import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Emails",
  tags: {
    emails: "Emails",
  },
  title: "Detalle de correo electrónico",
  titleShort: "Detalle de correo electrónico",
  description:
    "Recuperar un solo correo electrónico por su identificador único",
  container: {
    title: "Detalles del correo",
    description: "Ver información detallada sobre un email específico",
  },
  fields: {
    id: {
      label: "Correo electrónico ID",
      description: "Unico identificador del correo electrónico para recuperar",
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
        description: "Usted no tiene permiso para ver este correo electrónico",
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
};
