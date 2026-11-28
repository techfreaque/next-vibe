import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Pagos",
  tags: {
    subscription: "Suscripción",
    billing: "Facturación",
  },

  get: {
    title: "Mueve tu plan",
    titleShort: "Mover plan",
    description:
      "Muestra si tu plan con tarjeta puede pasar al nuevo proveedor de pagos y cuándo empieza allí la facturación.",
  },
  post: {
    title: "Iniciar cambio de plan",
    titleShort: "Mover plan",
    description:
      "Abre el pago en el nuevo proveedor para tu plan actual. Tu antiguo plan con tarjeta se detiene cuando pagas el nuevo. Sin cobros dobles.",
  },

  form: {
    fields: {
      provider: {
        label: "Método de pago",
        description:
          "Tarjeta (Whop) o cripto (NOWPayments). Por defecto, el método principal.",
      },
    },
  },

  response: {
    offer: "Oferta",
    targetProvider: "Nuevo proveedor",
    providers: "Métodos de pago",
    nowPaymentsAcceptsCards: "Pagos con tarjeta vía NOWPayments",
    cryptoMinUsd: "Importe mínimo en cripto (USD)",
    plan: "Plan",
    billingInterval: "Intervalo de facturación",
    pastDue: "Pago pendiente",
    deadline: "El plan dura hasta",
    billingStartAt: "Nueva facturación desde",
    firstPeriodEnd: "Fin del primer período nuevo",
    carryOver: "Traspaso del tiempo pagado",
    checkoutUrl: "Enlace de pago",
    sessionId: "Sesión de pago",
  },

  widget: {
    badge: "Acción necesaria",
    title: "Demasiado libre para nuestro procesador de tarjetas",
    description:
      "Decidieron que una IA que responde libremente no encaja en sus reglas. No vamos a cambiar ni una sola respuesta. Tu plan y tus créditos están a salvo.",
    deadline:
      "Sin prisa: tu plan dura hasta el {{date}}. Muévelo cuando quieras antes de esa fecha.",
    carryExtend:
      "Moverlo antes no cuesta nada extra: los días que ya pagaste se mantienen (el primer período nuevo dura hasta el {{date}}).",
    carryDeferred:
      "Hoy no se cobra nada. La facturación con el nuevo proveedor empieza el {{date}}, cuando termina tu tiempo pagado.",
    pastDue:
      "Tu última renovación no se pudo cobrar. Muévelo ahora para conservar tu plan.",
    unsupportedPlan:
      "El nuevo pago con tarjeta aún no ofrece este plan con facturación mensual. Elige facturación anual o paga con cripto.",
    cta: "Mover mi plan",
    ctaLoading: "Abriendo el pago...",
    noDoubleCharge:
      "Tu antiguo plan con tarjeta se detiene en cuanto pagas el nuevo. Nunca pagas dos veces.",
    checkoutReady: "El pago está listo.",
    openCheckout: "Abrir pago",
    notEligible: "No hay plan con tarjeta que mover.",
  },

  manage: {
    cancelOld: "Cancelar el plan antiguo con tarjeta",
    moveFirst:
      "¿Quieres conservar tu plan? Muévelo arriba. Cancelar aquí lo termina.",
  },

  enums: {
    paymentProvider: {
      nowpayments: "NowPayments",
      stripe: "Stripe",
      whop: "Whop",
    },
    carryOver: {
      extendFirstPeriod:
        "Cobro ahora, el tiempo pagado alarga el primer período",
      deferredStart: "La facturación empieza cuando termina el tiempo pagado",
    },
    status: {
      pending: "Pago iniciado",
      completed: "Movido",
      cancelFailed: "Movido, falló la cancelación del plan antiguo",
    },
    cancelMode: {
      atPeriodEnd: "Al final del período",
      immediate: "De inmediato",
    },
    offer: {
      available: "Disponible",
      planNotSupported: "Plan no compatible",
      notEligible: "No apto",
    },
    notice: {
      sending: "Enviando",
      sent: "Enviado",
      failed: "Fallido",
    },
  },

  errors: {
    validation: {
      title: "Solicitud no válida",
      description: "Revisa la solicitud y vuelve a intentarlo.",
    },
    unauthorized: {
      title: "Inicia sesión",
      description: "Inicia sesión para mover tu plan.",
    },
    forbidden: {
      title: "No permitido",
      description: "Esta cuenta no puede mover un plan.",
    },
    notFound: {
      title: "Sin plan con tarjeta",
      description: "Esta cuenta no tiene ningún plan con tarjeta que mover.",
    },
    conflict: {
      title: "Nada que mover",
      description:
        "El cambio de plan no está abierto ahora, o este plan no se puede mover. Tu plan sigue activo.",
    },
    unsupportedPlan: {
      title: "Plan no compatible",
      description:
        "El nuevo proveedor no puede ofrecer este plan con este intervalo de facturación.",
    },
    server: {
      title: "Algo falló",
      description: "No se pudo abrir el pago. Inténtalo de nuevo en un minuto.",
    },
    network: {
      title: "Error de red",
      description: "No se pudo conectar con el servidor. Revisa tu conexión.",
    },
    unknown: {
      title: "Error inesperado",
      description: "Pasó algo inesperado. Inténtalo de nuevo.",
    },
    unsavedChanges: {
      title: "Cambios sin guardar",
      description: "Guarda o descarta tus cambios primero.",
    },
  },

  success: {
    title: "Pago listo",
    description: "Completa el pago para mover tu plan.",
  },
};
