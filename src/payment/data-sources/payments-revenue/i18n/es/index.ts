import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    vibeSense: "vibe-sense",
  },
  enums: {
    kind: {
      all: "Todo",
      pack: "Paquetes de créditos",
      subscription: "Suscripciones (nuevas + renovaciones)",
      newSubscription: "Nuevas suscripciones",
      renewal: "Renovaciones",
    },
    provider: {
      all: "Todas las pasarelas",
      stripe: "Stripe",
      nowpayments: "NOWPayments",
    },
  },
  post: {
    title: "Ingresos (USD)",
    titleShort: "Ingresos",
    description:
      "Dinero cobrado por periodo, en USD aprox. (EUR y PLN a tipos fijos). Pagos exitosos y reembolsados después, sin cuentas admin. Filtra por producto y por pasarela.",
    fields: {
      resolution: {
        label: "Resolución",
        description: "Plazo de cálculo",
      },
      range: {
        label: "Rango",
        description: "Rango de tiempo para la consulta",
      },
      lookback: {
        label: "Mira atrás.",
        description: "Barras extra antes de empezar el rango",
      },
      result: {
        label: "Ingresos (USD)",
        description: "Serie de tiempo de producción",
      },
      meta: {
        label: "Meta",
        description: "Metadatos de ejecución de nodos",
      },
      kind: {
        label: "Pagado por",
        description:
          "Paquetes de créditos, suscripciones (nuevas + renovaciones) o uno de ellos",
      },
      provider: {
        label: "Pasarela de pago",
        description: "Stripe, NOWPayments o ambas",
      },
    },
    success: {
      title: "Ingresos calculados",
      description: "Serie de ingresos devuelta",
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Acceso de los administradores necesario",
      },
      server: {
        title: "Error del servidor",
        description: "La consulta falló.",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      validation: {
        title: "Falló la validación",
        description: "Parámetros de solicitud no válidos",
      },
      notFound: {
        title: "Cuenta o sesión no encontradas",
        description: "Cuenta o sesión no encontradas",
      },
      conflict: {
        title: "Conflicto",
        description: "Conflicto",
      },
      network: {
        title: "Error de red",
        description: "Solicitud de red falló",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Guardar los cambios primero",
      },
    },
  },
};
