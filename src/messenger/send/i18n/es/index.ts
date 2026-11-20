/**
 * English translations for unified Messenger Send endpoint
 */

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Enviar mensaje",
  titleShort: "Enviar mensaje",
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
    description: "Respuesta a la dirección (sólo correo electrónico, opcional)",
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
      description: "Se produjo un error de servidor interno mientras se envía",
      detail: "Enviar fallido: {{error}}",
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
};
