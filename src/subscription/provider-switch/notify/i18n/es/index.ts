import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Pagos",
  tag: "Aviso de cambio de plan",

  post: {
    title: "Aviso de cambio de plan",
    titleShort: "Aviso de cambio",
    description:
      "Correo único a cada suscriptor con tarjeta: mover el plan al nuevo proveedor de pagos. La prueba lista los destinatarios y genera una vista previa. Un envío real escribe a cada usuario una sola vez y se bloquea hasta que el nuevo proveedor esté activo.",
    container: {
      title: "Aviso de cambio de plan",
      description:
        "Suscriptores con tarjeta (activos, en prueba, con pago pendiente, que terminan al final del período) que aún no recibieron el correo",
    },
    fields: {
      dryRun: {
        label: "Prueba",
        description:
          "Lista destinatarios y genera una vista previa. No envía nada.",
      },
      batchSize: {
        label: "Tamaño del lote",
        description:
          "Máximo de correos en este envío (también limitado por el cupo por hora)",
      },
      hourlyCap: {
        label: "Límite por hora",
        description:
          "Máximo de correos de la plataforma por hora, contando todos (el buzón permite 500)",
      },
      previewLocale: {
        label: "Idioma de la vista previa",
        description: "Genera el correo en este idioma",
      },
      testRecipient: {
        label: "Destinatario de prueba",
        description:
          "Envía el correo real solo a esta dirección. Sin comprobar si el proveedor está activo y sin marcar a nadie como avisado.",
      },
    },
    response: {
      providerLive: "Nuevo proveedor activo",
      targetProvider: "Nuevo proveedor",
      totalRecipients: "Suscriptores con tarjeta",
      alreadyNotified: "Ya avisados",
      pending: "Por avisar",
      planNotSupported: "Plan no disponible con el nuevo proveedor (omitido)",
      hourlyBudget: "Cupo por hora restante",
      sent: "Enviados",
      failed: "Fallidos",
      byLocale: "Por idioma",
      locale: "Idioma",
      count: "Cantidad",
      recipients: "Destinatarios de este envío",
      userId: "Usuario",
      email: "Correo",
      status: "Estado",
      deadline: "Fecha límite",
      testSentTo: "Prueba enviada a",
      previewSubject: "Asunto de vista previa",
      previewHtml: "HTML de vista previa",
    },
    widget: {
      dryRunBadge: "Prueba",
      liveBadge: "Envío real",
      notLive:
        "El nuevo proveedor aún no está activo. Un envío real se rechaza.",
      run: "Ejecutar",
      noRecipients: "No queda nadie por avisar.",
    },
    errors: {
      notLive: {
        title: "Nuevo proveedor no activo",
        description:
          "Configura SUBSCRIPTION_SWITCH_PROVIDER y SUBSCRIPTION_SWITCH_ENABLED=true y comprueba que el proveedor acepta pagos antes de enviar.",
      },
      validation: {
        title: "Solicitud no válida",
        description: "Revisa los campos y vuelve a intentarlo.",
      },
      unauthorized: {
        title: "Inicia sesión",
        description: "Solo para administradores.",
      },
      forbidden: {
        title: "No permitido",
        description: "Solo para administradores.",
      },
      server: {
        title: "El envío falló",
        description: "El envío de avisos falló. Revisa los logs.",
      },
      unknown: {
        title: "Error inesperado",
        description: "Pasó algo inesperado.",
      },
    },
    success: {
      title: "Envío terminado",
      description: "Mira las cifras abajo.",
    },
  },

  emailTemplate: {
    name: "Aviso de cambio de plan",
    description:
      "Correo único que pide a los suscriptores con tarjeta mover su plan al nuevo proveedor de pagos",
    category: "Suscripciones",
    preview: {
      privateName: {
        label: "Nombre",
        description: "Nombre del suscriptor",
      },
      planName: {
        label: "Plan",
        description: "Nombre del plan",
      },
      deadline: {
        label: "Fecha límite",
        description: "Último día del período pagado",
      },
    },
  },

  email: {
    subject:
      "Demasiado libre para nuestro procesador de tarjetas. Mueve tu plan antes del {{deadline}}",
    subjectPastDue:
      "Demasiado libre para nuestro procesador de tarjetas. Mueve tu plan ya",
    subjectNoDate:
      "Demasiado libre para nuestro procesador de tarjetas. Mueve tu plan para conservarlo",
    previewText: "Un clic y conservas tu plan. Mismo precio, créditos a salvo.",
    headline: "Demasiado libre para sus reglas. Justo lo que tú quieres.",
    greeting: "Hola, {{privateName}}:",
    intro:
      "Nuestro procesador de tarjetas decidió que una IA que responde libremente no encaja en sus reglas, así que los pagos con tarjeta de tu plan {{planName}} se han detenido. Con un clic lo pasas a nuestro nuevo sistema de pago antes del {{deadline}}, o el plan termina el {{deadline}} y tus créditos se quedan contigo.",
    introPastDue:
      "Nuestro procesador de tarjetas decidió que una IA que responde libremente no encaja en sus reglas, así que la última renovación de tu plan {{planName}} no se pudo cobrar. Con un clic pasas tu plan a nuestro nuevo sistema de pago ahora mismo, y tus créditos se quedan pase lo que pase.",
    introNoDate:
      "Nuestro procesador de tarjetas decidió que una IA que responde libremente no encaja en sus reglas, así que los pagos con tarjeta de tu plan {{planName}} se han detenido. Con un clic lo pasas a nuestro nuevo sistema de pago, o el plan termina cuando acabe tu periodo pagado y tus créditos se quedan contigo.",
    cta: "Mover mi plan",
    reassurance:
      "Mismo plan, mismo precio, y los días pagados se mantienen. Nunca te cobramos dos veces. Cada crédito sigue siendo tuyo.",
    stance: "Antes cambiamos de procesador que censurar una sola respuesta.",
    crypto: "¿Prefieres pagar con cripto? También puedes.",
    cryptoCta: "Pagar con cripto",
    help: "¿Dudas? Responde a este correo. Cada respuesta la lee una persona.",
    signoff: "Gracias por estar de nuestro lado,\nEl equipo de {{appName}}",
  },
};
