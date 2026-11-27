import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    paymentProvider: {
      stripe: "Stripe",
      nowpayments: "NowPayments",
      whop: "Whop",
    },
  },
  post: {
    title: "Comprar créditos",
    titleShort: "Comprar créditos",
    description:
      "Crea una sesión de pago de Stripe para comprar un paquete de créditos",
    container: {
      title: "Comprar créditos",
      description: "Compra paquetes de créditos para usar las funciones de IA",
    },
    quantity: {
      label: "Cantidad",
      description: "Número de paquetes de crédito para comprar (1-10)",
      placeholder: "Introduzca la cantidad (1-10)",
    },
    productId: {
      label: "Paquete de créditos",
      description: "Elige el paquete que quieres comprar",
      placeholder: "Selecciona un paquete",
    },
    provider: {
      label: "Elige un método de pago",
      description: "Elige cómo pagar tu paquete de créditos",
      placeholder: "Selecciona el proveedor de pagos",
      stripe: "Cuenta PayPal, tarjeta o billetera digital",
      stripeDescription: "Tarjeta, PayPal, Apple Pay, Google Pay via Stripe",
      nowpayments: "Criptomonedas",
      nowpaymentsDescription:
        "Paga con Bitcoin, Ethereum y otras criptomonedas",
      cryptoMinimumDisabled:
        "Puedes pagar con criptomonedas a partir de {{min}} paquetes",
    },
    checkoutUrl: {
      content: "URL de la página de pago",
    },
    sessionId: {
      content: "Período de sesiones ID",
    },
    totalAmount: {
      content: "Importe total (en centavos)",
    },
    totalCredits: {
      content: "Créditos totales",
    },
    pack: {
      addPack: "Añadir un paquete",
      removePack: "Quitar un paquete",
      qtyCredits: "{{count}} créditos",
      title: "Paquete de créditos",
      description: "Recarga tu plan. Los créditos nunca vencen.",
      perPack: "/ paquete",
      features: {
        credits: "Incluye {{count}} créditos",
        expiry: "Los créditos nunca vencen",
        bestFor: "Se suman a tus créditos mensuales",
      },
      planRequired: {
        title: "Recarga tu plan con paquetes",
        body: "Activa un plan y añade paquetes cuando te queden pocos créditos. Planes desde {{price}} al mes.",
        cta: "Ver planes",
      },
      logIn: "Iniciar sesión",
      signUp: "Registrarse",
      signInToBuy:
        "Los paquetes recargan tu plan. Crea una cuenta gratis y activa un plan.",
      totalSummary: "{{totalCredits}} créditos · {{totalPrice}} en total",
    },
    submit: {
      text: "Comprar paquete de créditos",
      loading: "Procesando…",
    },
    redirecting: "Abriendo la página de pago…",
    openCheckout: "Ir al pago",
    backButton: {
      label: "Atrás",
    },
    submitButton: {
      label: "Comprar créditos",
      loadingText: "Procesando…",
    },
    success: {
      title: "Se creó la sesión de pago",
      description: "Se creó la sesión de pago de Stripe",
    },
    errors: {
      planRequired: {
        title: "Necesitas un plan activo",
        description:
          "Los paquetes recargan un plan activo. Elige un plan y añade paquetes cuando quieras.",
      },
      validation: {
        title: "Error de validación",
        description: "Cantidad de compra inválida",
      },
      network: {
        title: "Error de red",
        description: "La conexión de red falló",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para comprar créditos",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Usted no tiene permiso para comprar créditos",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso",
      },
      server: {
        title: "Error del servidor",
        description: "No se pudo crear la sesión de pago",
        detail: "No se pudo iniciar el pago: {{error}}",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
      conflict: {
        title: "Conflicto",
        description: "Conflicto de recursos",
      },
    },
  },
  errors: {
    userNotFound: {
      title: "Usuario no encontrado",
      description: "La cuenta de usuario no se pudo encontrar",
    },
    checkoutFailed: {
      title: "El pago falló",
      description: "No se pudo crear la sesión de pago para comprar créditos",
    },
  },
};
