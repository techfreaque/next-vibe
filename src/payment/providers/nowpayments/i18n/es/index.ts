import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  name: "NOWPayments",
  description: "Proveedor de pago de criptomonedas con soporte de suscripción",

  cli: {
    post: {
      title: "NOWPayments CLI",
      description: "Manage NOWPayments webhook túnel con ngrok",
      category: "Pago",
      tags: {
        nowpayments: "NOWPayments",
        cli: "CLI",
        webhook: "Webhook",
      },
      operations: {
        check: "Verificación",
        install: "Instala",
        tunnel: "Tunnel",
        status: "Situación",
      },
      form: {
        title: "NOWPayments CLI Operations",
        description:
          "Configurar y gestionar túnel ngrok para los juegos web NOWPayments",
        fields: {
          operation: {
            label: "Operación",
            description: "Seleccione la operación para realizar",
            placeholder: "Elija una operación",
          },
          port: {
            label: "Port",
            description: "Puerto local a túnel (por defecto: 3000)",
            placeholder: "3000",
          },
        },
      },
      errors: {
        validationFailed: {
          title: "Error de validación",
          description: "Funcionamiento o parámetros inválidos",
        },
        networkError: {
          title: "Error de red",
          description: "La conexión de red falló",
        },
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Inicia sesión para continuar",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "Acceso denegado",
        },
        notFound: {
          title: "No encontrado",
          description: "No se encontró el recurso",
        },
        serverError: {
          title: "Error del servidor",
          description: "Fallado para ejecutar la operación",
        },
        unknownError: {
          title: "Error desconocido",
          description: "Ocurrió un error desconocido",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Hay cambios sin salvar",
        },
        conflict: {
          title: "Conflicto",
          description: "Conflicto de recursos",
        },
      },
      response: {
        title: "Respuesta",
        description: "Resultado de la operación",
        fields: {
          success: "Operación completada",
          installed: "Instalados",
          version: "Version",
          status: "Situación",
          output: "Producto",
          instructions: "Instrucciones",
          tunnelUrl: "Tunel URL",
          webhookUrl: "Webhook URL",
        },
      },
      success: {
        title: "Operación completada",
        description: "La operación se completó correctamente",
      },
    },
  },

  errors: {
    userNotFound: {
      detail: "No se ha encontrado ninguna cuenta para el usuario {{userId}}",
      title: "Usuario No encontrado",
      description: "El usuario especificado no pudo ser encontrado",
    },
    customerCreationFailed: {
      detail:
        "No se puede configurar su registro de clientes NOWPayments: {{error}} (user {{userId}})",
      title: "Creación del cliente fallada",
      description: "Failed to ensure NOWPayments customer: {{error}}",
    },
    productNotFound: {
      detail: "Ningún producto de este tipo: {{productId}}",
      title: "Producto no encontrado",
      description:
        "El producto especificado no se pudo encontrar: {{productId}}",
    },
    userEmailRequired: {
      title: "Correo electrónico del usuario requerido",
      description:
        "El correo electrónico del usuario es necesario para las suscripciones: {{userId}}",
    },
    checkoutCreationFailed: {
      detail: "No se puede comenzar el checkout criptográfico: {{error}}",
      title: "Creación de checkout fracasado",
      description: "Failed to create NOWPayments checkout session: {{error}}",
    },
    invoiceCreationFailed: {
      detail: "No se puede crear la factura NOWPayments: {{error}}",
      title: "Creación de facturas fallada",
      description: "Failed to create NOWPayments bill: {{error}}",
    },
    invalidApiKey: {
      detail:
        "Llave inválida NOWPayments API. Compruebe NOWPAYMENTS_API_KEY en su entorno y confirme la clave en https://nowpayments.io/app/dashboard",
      title: "Llave API inválida",
      description:
        "Llave inválida NOWPayments API. Por favor, compruebe su configuración y asegúrese de tener una llave API válida desde https://nowpayments.io/app/dashboard",
    },
    planCreationFailed: {
      title: "Creación de planes fracasado",
      description: "Failed to create NOWPayments subscription plan: {{error}}",
    },
    subscriptionCreationFailed: {
      title: "Creación de suscripción fallada",
      description: "Failed to create NOWPayments subscription: {{error}}",
    },
    subscriptionRetrievalFailed: {
      detail: "No se puede cargar la suscripción a NOWPayments: {{error}}",
      title: "Suscripción Retrieval Failed",
      description: "Failed to retrieve NOWPayments subscription: {{error}}",
    },
    subscriptionCancellationFailed: {
      detail: "No se puede cancelar la suscripción a NOWPayments: {{error}}",
      title: "Cancelación de suscripción Fallada",
      description:
        "Fallado para cancelar la suscripción a NOWPayments: {{error}}",
    },
    subscriptionListFailed: {
      detail: "No se puede listar las suscripciones NOWPayments: {{error}}",
      title: "Lista de suscripciones",
      description: "Failed to list NOWPayments subscriptions: {{error}}",
    },
    notConfigured: {
      title: "NOWPayments No Configurado",
      description:
        "NOWPayments no está configurado. Define NOWPAYMENTS_API_KEY y NOWPAYMENTS_IPN_SECRET en el archivo .env",
    },
    webhookVerificationFailed: {
      detail: "No se pudo verificar el Webhook NOWPayments: {{error}}",
      invalidSignature: "La firma Webhook no coincide",
      title: "Verificación Webhook Falled",
      description: "Failed to verify NOWPayments webhook signature: {{error}}",
    },
    paymentStatusFailed: {
      detail: "No podía leer el estado de pago de NOWPayments : {{error}}",
      title: "Estado de pago Retrieval Falled",
      description:
        "Fallado para recuperar el estado de pago de NOWPayments : {{error}}",
    },
  },

  success: {
    invoiceCreated: {
      title: "Factura Creada",
      description: "factura NOWPayments creada con éxito",
    },
    webhookVerified: {
      title: "Webhook Verified",
      description: "NOWPayments webhook verificado con éxito",
    },
    paymentStatusRetrieved: {
      title: "Estado de pago",
      description: "estado de pago NOWPayments recuperado con éxito",
    },
  },
};
