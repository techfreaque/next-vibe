import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Stripe CLI",
  titleShort: "Stripe CLI",
  description: "Escucha Stripe webhooks localmente",
  category: "Integración del pago",
  tags: {
    stripe: "Stripe",
    cli: "Línea de mando",
    webhook: "Webhook",
  },

  form: {
    title: "Stripe CLI",
    description: "Avance eventos Stripe Webhook en su servidor local",
    fields: {
      port: {
        label: "Port",
        description:
          "Puerto local para reenvío de webhooks a (por defecto: 3000)",
        placeholder: "3000",
      },
    },
  },

  status: {
    authenticated: "Autenticado y listo",
    not_authenticated: "No autenticado: ejecutar 'stripe login'",
    not_installed: "Stripe CLI no está instalado. {{instructions}}",
  },

  errors: {
    validation: {
      title: "Configuración inválida",
      description: "Compruebe su configuración Stripe CLI e inténtelo de nuevo",
    },
    network: {
      title: "Error de red",
      description: "Incapaz de conectarse a Stripe",
    },
    unauthorized: {
      title: "Se requiere autenticación",
      description: "No tienes permiso para realizar esta operación",
    },
    forbidden: {
      title: "Access Forbidden",
      description: "Esta operación no está permitida para su cuenta",
    },
    notFound: {
      title: "No encontrado",
      description: "Stripe CLI no está instalado",
    },
    serverError: {
      detail: "Stripe CLI listener failed: {{error}}",
      title: "Error del servidor",
      description: "Se produjo un error al ejecutar el oyente Stripe",
    },
    unknown: {
      title: "Error desconocido",
      description: "Ocurrió un error inesperado",
    },
    customerRetrievalFailed: {
      detail:
        "No se puede cargar su registro de clientes Stripe: {{error}} (user {{userId}})",
      title: "Retrieval del cliente Failed",
      description: "Failed to retrieve Stripe customer information",
    },
    unsavedChanges: {
      title: "Cambios sin guardar",
      description: "Usted tiene cambios de configuración sin guardar",
    },
    conflict: {
      title: "Operación Conflicto",
      description: "Otra operación Stripe está en marcha.",
    },
    execution_failed: "La operación Stripe CLI falló",
    userNotFound: {
      detail: "No se ha encontrado ninguna cuenta para el usuario {{userId}}",
      title: "Usuario No encontrado",
      description: "El usuario especificado no fue encontrado",
    },
    customerCreationFailed: {
      detail:
        "No se puede crear su registro de clientes Stripe: {{error}} (user {{userId}})",
      title: "Creación del cliente fallada",
      description: "Failed to create Stripe customer",
    },
    checkoutCreationFailed: {
      detail: "No podía empezar el checkout: {{error}}",
      title: "Creación de checkout fracasado",
      description: "Failed to create Stripe checkout session",
    },
    webhookVerificationFailed: {
      detail: "No se pudo verificar el Webhook Stripe: {{error}}",
      title: "Verificación Webhook Falled",
      description: "Fallado para verificar la firma webhook",
    },
    subscriptionRetrievalFailed: {
      detail: "No se pudo cargar la suscripción de Stripe : {{error}}",
      title: "Suscripción Retrieval Failed",
      description: "Fallado para recuperar la suscripción de Stripe",
    },
    subscriptionCancellationFailed: {
      detail: "No se puede cancelar la suscripción: {{error}}",
      title: "Cancelación de suscripción Fallada",
      description: "Fallado para cancelar la suscripción en Stripe",
    },
    priceCreationFailed: {
      detail:
        "No se puede crear el precio Stripe: {{error}} (producto {{productId}})",
      title: "Creación de precio fallado",
      description: "Failed to create price in Stripe",
    },
    notConfigured: {
      title: "Stripe No Configurado",
      description: "Define STRIPE_SECRET_KEY en el archivo .env",
    },
    stripeCliNotInstalled: "Stripe CLI no está instalado",
    listenerFailed: "Failed to start Stripe Webhook listener",
  },

  success: {
    title: "Oyente comenzó",
    description: "Stripe CLI está escuchando para juegos web",
  },
};
