import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Main checkout titles and descriptions
  title: "Crear pago de suscripción",
  titleShort: "Pago",
  description: "Crea una sesión de pago de Stripe para la suscripción",
  category: "Suscripción",

  // Tags
  tags: {
    subscription: "suscripción",
    checkout: "checkout",
    stripe: "stripe",
  },

  // Form configuration
  form: {
    title: "Configuración del pago",
    description: "Configura los parámetros de la sesión de pago",
    fields: {
      planId: {
        label: "Plan de suscripción",
        description: "Seleccione el plan de suscripción",
        placeholder: "Elige un plan",
      },
      billingInterval: {
        label: "Frecuencia de facturación",
        description: "Selecciona la frecuencia de facturación",
        placeholder: "Elige la frecuencia de facturación",
      },
      provider: {
        label: "Proveedor de pagos",
        description: "Elige cómo pagar",
        placeholder: "Selecciona el proveedor de pagos",
      },
      payCurrency: {
        label: "Criptomoneda",
        description:
          "Moneda con la que pagas. Déjalo vacío para elegirla en la página de pago.",
        placeholder: "Elige una moneda",
      },
      metadata: {
        label: "Metadatos",
        description: "Metadatos adicionales de la sesión de pago",
        placeholder: "Ingrese metadatos como JSON",
      },
    },
  },

  // Response fields
  response: {
    success: "Se creó la sesión de pago",
    sessionId: "ID de la sesión de Stripe",
    checkoutUrl: "URL de la página de pago",
    message: "Mensaje de Estado",
  },

  // Error types
  errors: {
    validation: {
      title: "Error de validación",
      description: "Parámetros de solicitud no válidos",
    },
    network: {
      title: "Error de red",
      description: "Error de conexión de red",
    },
    unauthorized: {
      title: "Se requiere autenticación",
      description: "Inicia sesión para continuar",
    },
    forbidden: {
      title: "Acceso denegado",
      description: "No tienes acceso",
    },
    notFound: {
      title: "No encontrado",
      description: "No se encontró el recurso",
    },
    serverError: {
      title: "Error del servidor",
      description: "Ocurrió un error interno del servidor",
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
      description: "Hay un conflicto entre los datos",
    },
  },

  // Success types
  success: {
    title: "Operación completada",
    description: "Se creó la sesión de pago",
  },

  // POST endpoint specific translations
  post: {
    title: "Crear sesión de pago",
    description: "Crea una nueva sesión de pago para la suscripción",
    form: {
      title: "Configuración de la sesión de pago",
      description: "Configura los parámetros de la sesión de pago",
    },
    response: {
      title: "Respuesta de la sesión de pago",
      description: "Datos que devuelve la sesión de pago",
    },
    errors: {
      alreadySubscribed: {
        detail: "Usted ya tiene una suscripción activa (user {{userId}})",
        title: "Ya tienes una suscripción",
        description: "Ya tienes una suscripción activa",
      },
      validation: {
        title: "Error de validación",
        description: "Parámetros de pago no válidos",
        reason: {
          yearlyNotAvailable:
            "La facturación anual solo está disponible para el plan {{plan}}. Elige la modalidad mensual.",
        },
      },
      network: {
        title: "Error de red",
        description: "Error de conexión de red",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes acceso",
      },
      notFound: {
        detail: "No se ha encontrado ninguna cuenta para el usuario {{userId}}",
        title: "No encontrado",
        description: "No se encontró la sesión de pago",
      },
      server: {
        detail: "No se pudo iniciar el pago: {{error}}",
        title: "Error del servidor",
        description: "Ocurrió un error interno del servidor",
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
        description: "Hay un conflicto entre los datos",
      },
    },
    success: {
      title: "Operación completada",
      description: "Se creó la sesión de pago",
    },
  },

  // General error message
  error: "Ocurrió un error durante el pago",
  errorDetail: "Falló el pago: {{error}}",

  // Subscription plan labels
  plans: {
    starter: {
      title: "Starter",
    },
    plus: {
      title: "Plus",
    },
    pro: {
      title: "Pro",
    },
    ultra: {
      title: "Ultra",
    },
  },

  enums: {
    paymentProvider: {
      stripe: "Stripe",
      nowpayments: "NowPayments",
    },
  },

  // Billing interval labels
  billing: {
    monthly: "Mensual",
    yearly: "Anual",
  },
  availability: {
    cardPaused:
      "Los pagos con tarjeta están en pausa por ahora. Con criptomonedas pagas al instante.",
    cardPausedError:
      "Los pagos con tarjeta están en pausa por ahora. Elige criptomonedas para completar la compra.",
    nowpaymentsCardLabel: "Tarjeta o criptomonedas (NOWPayments)",
    nowpaymentsCardDescription:
      "Visa, Mastercard, Apple Pay, Google Pay o Bitcoin, Ethereum y más",
    cryptoPickCoin: "Elige una moneda",
    cryptoCoinUnavailable: "Esa moneda no está disponible ahora. Elige otra.",
    cryptoCoinBelowMinimum:
      "Este importe no llega al mínimo de esa moneda. Elige otra.",
    cryptoAmountBelowMinimum:
      "Este importe no llega al mínimo para cripto. Añade un paquete o elige un plan mayor.",
  },
  cryptoCoin: {
    btc: "Bitcoin (BTC)",
    eth: "Ethereum (ETH)",
    usdtTrc20: "USDT (TRON)",
    usdtErc20: "USDT (Ethereum)",
    usdtBsc: "USDT (BNB Chain)",
    usdc: "USDC (Ethereum)",
    sol: "Solana (SOL)",
    ltc: "Litecoin (LTC)",
    xmr: "Monero (XMR)",
    doge: "Dogecoin (DOGE)",
    trx: "TRON (TRX)",
    bnbBsc: "BNB (BNB Chain)",
  },
};
