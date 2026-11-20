import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
};
