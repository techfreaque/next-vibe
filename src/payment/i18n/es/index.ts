import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Import sub-domain translations
  checkout: {
    // Main checkout titles and descriptions
    title: "Crear pago de suscripción",
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
          title: "Ya tienes una suscripción",
          description: "Ya tienes una suscripción activa",
        },
        validation: {
          title: "Error de validación",
          description: "Parámetros de pago no válidos",
          reason: {
            enterpriseCustomPricing:
              "Plan ENTERPRISE requiere precios personalizados",
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
          title: "No encontrado",
          description: "No se encontró la sesión de pago",
        },
        server: {
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

    // Subscription plan labels
    plans: {
      starter: {
        title: "Starter",
      },
    },

    // Billing interval labels
    billing: {
      monthly: "Mensual",
      yearly: "Anual",
    },
  },
  invoice: {
    category: "Facturación",
    tags: {
      payment: "pago",
      invoice: "factura",
      transactions: "transacciones",
    },
    defaultItem: "Tema de facturación",
    success: {
      created: "Factura creada con éxito",
    },
    post: {
      title: "Factura",
      description: "Punto final de facturación",
      form: {
        title: "Configuración de facturación",
        description: "Configurar los parámetros de factura",
      },
      response: {
        success: "Factura creada con éxito",
        message: "Mensaje de Estado",
        invoice: {
          title: "Detalles de facturación",
          description: "Información de facturas generadas",
          id: "Factura ID",
          userId: "Usuario ID",
          stripeInvoiceId: "Stripe Invoice ID",
          invoiceNumber: "Número de facturación",
          amount: "Monto",
          currency: "Moneda",
          status: "Situación",
          invoiceUrl: "Factura URL",
          invoicePdf: "Factura PDF",
          dueDate: "Fecha prevista",
          paidAt: "Pagado en",
          createdAt: "Creado en",
          updatedAt: "Actualizado en",
        },
      },
      errors: {
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Inicia sesión para continuar",
        },
        validation: {
          title: "Error de validación",
          description: "Parámetros de solicitud no válidos",
        },
        server: {
          title: "Error del servidor",
          description: "Ocurrió un error interno del servidor",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error desconocido",
        },
        network: {
          title: "Error de red",
          description: "Ocurrió un error de red",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No tienes acceso",
        },
        notFound: {
          title: "No encontrado",
          description: "No se encontró el recurso",
        },
        conflict: {
          title: "Conflicto",
          description: "Hay un conflicto entre los datos",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Hay cambios sin salvar",
        },
      },
      success: {
        title: "Operación completada",
        description: "La operación se completó correctamente",
      },
      widget: {
        back: "Atrás",
      },
    },
    customerId: {
      label: "Cliente ID",
      description: "Identificador del cliente de Stripe",
      placeholder: "Ingrese al cliente ID",
    },
    amount: {
      label: "Monto",
      description: "Cantidad de factura",
      placeholder: "Ingrese la cantidad",
    },
    currency: {
      label: "Moneda",
      description: "Código de divisas",
      placeholder: "Seleccione la moneda",
      usd: "Dólar US (USD)",
      eur: "Euro (EUR)",
      pln: "Polaco Zloty (PLN)",
    },
    description: {
      label: "Descripción",
      description: "Descripción de facturas",
      placeholder: "Escriba descripción",
    },
    dueDate: {
      label: "Fecha prevista",
      description: "Fecha de pago",
      placeholder: "Fecha de vencimiento",
    },
    metadata: {
      label: "Metadatos",
      description: "Metadatos adicionales",
      placeholder: "Ingrese metadatos como JSON",
    },
  },
  portal: {
    success: {
      created: "Sesión del portal de atención al cliente creada con éxito",
    },
    post: {
      title: "Portal del cliente",
      description:
        "Crear sesión de portal de clientes para la gestión de facturación",
      form: {
        title: "Configuración del Portal",
        description: "Configurar los parámetros del portal del cliente",
      },
      returnUrl: {
        label: "Volver URL",
        description: "URL para redirigir a la sesión del portal",
        placeholder: "https://example.com/dashboard",
      },
      response: {
        success: "Sesión de portales creada con éxito",
        message: "Mensaje de Estado",
        customerPortalUrl: "Portal de atención al cliente URL",
      },
      errors: {
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Inicia sesión para continuar",
        },
        validation: {
          title: "Error de validación",
          description: "Parámetros de solicitud no válidos",
        },
        server: {
          title: "Error del servidor",
          description: "Ocurrió un error interno del servidor",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error desconocido",
        },
        network: {
          title: "Error de red",
          description: "Ocurrió un error de red",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "No tienes acceso",
        },
        notFound: {
          title: "No encontrado",
          description: "No se encontró el recurso",
        },
        conflict: {
          title: "Conflicto",
          description: "Hay un conflicto entre los datos",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Hay cambios sin salvar",
        },
      },
      success: {
        title: "Operación completada",
        description: "La operación se completó correctamente",
      },
    },
  },
  refund: {
    title: "Reembolso del proceso",
    description: "Procesar un reembolso para una transacción de pago",
    category: "Reembolsos de pago",

    tags: {
      refund: "reembolso",
      transaction: "transacción",
    },

    success: {
      created: "Reembolso procesado con éxito",
    },

    reason: {
      requestedByCustomer: "Solicitud de cliente",
    },

    form: {
      title: "Formulario de reembolso",
      description: "Ingrese los detalles de reembolso",
      fields: {
        transactionId: {
          label: "Transacción ID",
          description: "ID de la transacción para reembolsar",
          placeholder: "Introducir transacción ID",
        },
        amount: {
          label: "Monto de reembolso",
          description:
            "Monto para el reembolso (opcional, predeterminados a la cantidad completa)",
          placeholder: "Ingrese la cantidad",
        },
        reason: {
          label: "Reembolso de la razón",
          description: "Razones para el reembolso",
          placeholder: "Introducir razón",
        },
        metadata: {
          label: "Metadatos",
          description: "Metadatos de reembolso adicionales",
          placeholder: "Ingrese metadatos como JSON",
        },
      },
    },

    post: {
      title: "Reembolso del proceso",
      description: "Procesar un reembolso de pago",
      response: {
        success: "Reembolso procesado con éxito",
        message: "Mensaje de Estado",
        refund: {
          title: "Detalles del reembolso",
          description: "Información de reembolso procesada",
          id: "Reembolso ID",
          userId: "Usuario ID",
          transactionId: "Transacción ID",
          stripeRefundId: "Stripe Reembolso ID",
          amount: "Monto de reembolso",
          currency: "Moneda",
          status: "Estado de los reembolsos",
          reason: "Reembolso de la razón",
          createdAt: "Creado en",
          updatedAt: "Actualizado en",
        },
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Parámetros de reembolso inválidos",
        },
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Inicia sesión para continuar",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "Permiso denegado",
        },
        notFound: {
          title: "No encontrado",
          description: "Transacción no encontrada",
        },
        server: {
          title: "Error del servidor",
          description: "Ocurrió un error interno del servidor",
        },
        network: {
          title: "Error de red",
          description: "Error de conexión de red",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
        conflict: {
          title: "Conflicto",
          description: "Conflicto de reembolso detectado",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Hay cambios sin salvar",
        },
      },
      success: {
        title: "Operación completada",
        description: "Reembolso procesado con éxito",
      },
    },
  },
  providers: {
    stripe: {
      title: "Stripe CLI Integration",
      description: "Gestione las operaciones Stripe CLI y escucha webhook",
      category: "Integración del pago",
      tags: {
        stripe: "Stripe",
        cli: "Línea de mando",
        webhook: "Webhook",
      },

      operations: {
        check: "Verificación de la instalación",
        install: "Instalar Stripe CLI",
        listen: "Inicio Webhook Listener",
        login: "Iniciar sesión en Stripe",
        status: "Estado de control",
      },

      form: {
        title: "Configuración Stripe CLI",
        description:
          "Configurar operaciones Stripe CLI y configuración de webhook",
        fields: {
          operation: {
            label: "Tipo de operación",
            description: "Seleccione la operación Stripe CLI para realizar",
            placeholder: "Elige una operación...",
          },
          port: {
            label: "Número de puerto",
            description:
              "Número de puerto para el reenvío de webhook (1000-65535)",
            placeholder: "4242",
          },
          events: {
            label: "Webhook Eventos",
            description: "Seleccionar eventos Stripe para escuchar",
            placeholder: "Seleccione eventos para monitorear...",
            paymentIntentSucceeded: "Intención de pago",
            paymentIntentFailed: "Intención de pago fallado",
            subscriptionCreated: "Suscripción activada",
            subscriptionUpdated: "Subscripción Actualizada",
            invoicePaymentSucceeded: "Invoice Payment Succeeded",
            invoicePaymentFailed: "Factura de pago fallado",
          },
          forwardTo: {
            label: "Adelante a URL",
            description: "Punto final local para eventos de Webhook",
            placeholder: "localhost:3000/api/webhooks/stripe",
          },
          skipSslVerify: {
            label: "Skip SSL Verification",
            description: "Skip SSL certificate verification for development",
          },
        },
      },

      response: {
        success: "La operación se completó correctamente",
        installed: "estado de instalación Stripe CLI",
        version: "Versión instalada Stripe CLI",
        status: "Situación actual de la operación",
        output: "Salida del comando y registros",
        instructions: "Siguientes pasos e instrucciones",
        webhookEndpoint: "Webhook endpoint URL",
      },

      login: {
        instructions:
          "Para autenticar con Stripe, ejecute 'stripe login' en su terminal y siga las instrucciones para conectar su cuenta Stripe.",
      },

      status: {
        authenticated: "Autenticado y listo",
        not_authenticated: "No autenticado - ejecutar 'stripe login'",
        not_installed: "Stripe CLI no está instalado",
      },

      errors: {
        validation: {
          title: "Configuración inválida",
          description:
            "Por favor, compruebe su configuración Stripe CLI e inténtelo de nuevo",
        },
        network: {
          title: "Error de red",
          description: "Incapaz de conectarse a los servicios Stripe",
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
          title: "Recursos no encontrados",
          description: "No se encontró el recurso solicitado Stripe",
        },
        serverError: {
          title: "Error del servidor",
          description: "Se produjo un error al procesar la operación Stripe",
        },
        unknown: {
          title: "Error desconocido",
          description: "Un error inesperado ocurrió con Stripe CLI",
        },
        customerRetrievalFailed: {
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
        execution_failed: "La operación Stripe CLI no se ejecutó correctamente",
        userNotFound: {
          title: "Usuario No encontrado",
          description: "El usuario especificado no fue encontrado",
        },
        customerCreationFailed: {
          title: "Creación del cliente fallada",
          description: "Failed to create Stripe customer",
        },
        checkoutCreationFailed: {
          title: "Creación de checkout fracasado",
          description: "Failed to create Stripe checkout session",
        },
        webhookVerificationFailed: {
          title: "Verificación Webhook Falled",
          description: "Fallado para verificar la firma webhook",
        },
        subscriptionRetrievalFailed: {
          title: "Suscripción Retrieval Failed",
          description: "Fallado para recuperar la suscripción de Stripe",
        },
        subscriptionCancellationFailed: {
          title: "Cancelación de suscripción Fallada",
          description: "Fallado para cancelar la suscripción en Stripe",
        },
        priceCreationFailed: {
          title: "Creación de precio fallado",
          description: "Failed to create price in Stripe",
        },
        notConfigured: {
          title: "Stripe No Configurado",
          description:
            "Stripe no está configurado. Define STRIPE_SECRET_KEY en el archivo .env",
        },
        stripeCliNotInstalled: "Stripe CLI no está instalado",
        listenerFailed: "Failed to start Stripe Webhook listener",
      },

      success: {
        title: "Operación exitosa",
        description: "La operación Stripe CLI terminó con éxito",
      },

      installInstructions: {
        documentation:
          "Por favor, instale Stripe CLI siguiendo la documentación oficial en: https://docs.stripe.com/stripe-cli",
        quickInstallation: "Opciones de instalación rápidas:",
        macOS: {
          title: "macOS (utilizando Homebrew):",
          command: "brew install stripe/stripe-cli/stripe",
        },
        linux: {
          title: "Linux (usando gestor de paquetes):",
          debian: {
            title: "Debian/Ubuntu",
          },
          fedora: {
            title: "CentOS/RHEL/Fedora",
          },
        },
        windows: {
          title: "Windows:",
          scoop: {
            title: "Usando Scoop",
          },
          github: {
            title: "O descarga directamente desde GitHub versiones:",
            url: "https://github.com/stripe/stripe-cli/releases",
          },
        },
        authentication: {
          title: "Después de la instalación, autenticar con:",
          command: "stripe login",
        },
      },
    },
    nowpayments: {
      name: "NOWPayments",
      description:
        "Proveedor de pago de criptomonedas con soporte de suscripción",

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
          title: "Usuario No encontrado",
          description: "El usuario especificado no pudo ser encontrado",
        },
        customerCreationFailed: {
          title: "Creación del cliente fallada",
          description: "Failed to ensure NOWPayments customer: {error}",
        },
        productNotFound: {
          title: "Producto no encontrado",
          description:
            "El producto especificado no se pudo encontrar: {productId}",
        },
        userEmailRequired: {
          title: "Correo electrónico del usuario requerido",
          description:
            "El correo electrónico del usuario es necesario para las suscripciones: {userId}",
        },
        checkoutCreationFailed: {
          title: "Creación de checkout fracasado",
          description: "Failed to create NOWPayments checkout session: {error}",
        },
        invoiceCreationFailed: {
          title: "Creación de facturas fallada",
          description: "Failed to create NOWPayments bill: {error}",
        },
        invalidApiKey: {
          title: "Llave API inválida",
          description:
            "Llave inválida NOWPayments API. Por favor, compruebe su configuración y asegúrese de tener una llave API válida desde https://nowpayments.io/app/dashboard",
        },
        planCreationFailed: {
          title: "Creación de planes fracasado",
          description:
            "Failed to create NOWPayments subscription plan: {error}",
        },
        subscriptionCreationFailed: {
          title: "Creación de suscripción fallada",
          description: "Failed to create NOWPayments subscription: {error}",
        },
        subscriptionRetrievalFailed: {
          title: "Suscripción Retrieval Failed",
          description: "Failed to retrieve NOWPayments subscription: {error}",
        },
        subscriptionCancellationFailed: {
          title: "Cancelación de suscripción Fallada",
          description:
            "Fallado para cancelar la suscripción a NOWPayments: {error}",
        },
        subscriptionListFailed: {
          title: "Lista de suscripciones",
          description: "Failed to list NOWPayments subscriptions: {error}",
        },
        notConfigured: {
          title: "NOWPayments No Configurado",
          description:
            "NOWPayments no está configurado. Define NOWPAYMENTS_API_KEY y NOWPAYMENTS_IPN_SECRET en el archivo .env",
        },
        webhookVerificationFailed: {
          title: "Verificación Webhook Falled",
          description:
            "Failed to verify NOWPayments webhook signature: {error}",
        },
        paymentStatusFailed: {
          title: "Estado de pago Retrieval Falled",
          description:
            "Fallado para recuperar el estado de pago de NOWPayments : {error}",
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
    },
  },

  // Main payment domain
  category: "Facturación",

  // Main form configuration
  form: {
    title: "Configuración de pago",
    description: "Configurar los parámetros de pago",
  },

  // Tags
  tags: {
    payment: "pago",
    stripe: "stripe",
    checkout: "checkout",
    list: "lista",
    transactions: "transacciones",
    info: "info",
  },

  // Create payment endpoint
  create: {
    title: "Crear sesión de pago",
    titleShort: "Crear sesión",
    description: "Crear una nueva sesión de pago con Stripe",
    form: {
      title: "Configuración de pago",
      description: "Configurar los parámetros de la sesión de pago",
    },
    paymentMethodTypes: {
      label: "Métodos de pago",
      description: "Select accepted payment methods",
    },
    successUrl: {
      label: "Éxito URL",
      description: "URL para redirigir después del pago exitoso",
      placeholder: "https://example.com/success",
    },
    cancelUrl: {
      label: "Cancelar URL",
      description: "URL para redirigir si el pago es cancelado",
      placeholder: "https://example.com/cancel",
    },
    customerEmail: {
      label: "Email del cliente",
      description: "Dirección de correo electrónico del cliente para el pago",
      placeholder: "customer@example.com",
    },
    response: {
      success: "Sesión de pago creada con éxito",
      sessionId: "ID de la sesión de Stripe",
      sessionUrl: "Stripe session URL",
      checkoutUrl: "URL de la página de pago",
      message: "Mensaje de Estado",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Parámetros de pago inválidos",
      },
      internal: {
        title: "Error interno",
        description: "Se produjo un error interno",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Permiso denegado",
      },
      notFound: {
        detail: "No se ha encontrado ninguna cuenta para el usuario {{userId}}",
        title: "No encontrado",
        description: "Período de sesiones de pago no encontrado",
      },
      server: {
        detail: "No podía crear la sesión de pago: {{error}}",
        stripeNotConfigured:
          "Stripe no está listo todavía. Añadir STRIPE_SECRET_KEY a tu entorno.",
        title: "Error del servidor",
        description: "Ocurrió un error interno del servidor",
      },
      network: {
        title: "Error de red",
        description: "Error de conexión de red",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Hay cambios sin salvar",
      },
      conflict: {
        title: "Conflicto",
        description: "Conflicto de pago detectado",
      },
    },
    success: {
      title: "Operación completada",
      description: "Sesión de pago creada con éxito",
      message: "Sesión de pago creada con éxito",
    },
  },

  // Get payment endpoint
  get: {
    title: "Tus pagos",
    titleShort: "Pagos",
    description: "Hasta diez operaciones de pago recientes de tu cuenta.",
    summary: {
      empty: "Aún no hay pagos",
      emptyDescription: "Tus pagos aparecerán aquí.",
      loading: "Cargando tus pagos…",
      error: "No se han podido cargar tus pagos",
      retry: "Volver a intentar",
      amountUnavailable: "Importe no disponible",
    },
    form: {
      title: "Consultas de pago",
      description: "Información sobre el pago de consultas",
    },
    response: {
      success: "Datos de pago recuperados con éxito",
      sessionUrl: "Período de sesiones de pago URL",
      sessionId: "Período de sesiones de pago ID",
      message: "Mensaje de Estado",
      transactions: "Operaciones de pago",
      paymentMethods: "Métodos de pago",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Parámetros de consulta inválidos",
      },
      internal: {
        title: "Error interno",
        description: "Se produjo un error interno",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Permiso denegado",
      },
      notFound: {
        title: "No encontrado",
        description: "Información de pago no encontrada",
      },
      server: {
        detail: "No podía cargar su información de pago: {{error}}",
        title: "Error del servidor",
        description: "Ocurrió un error interno del servidor",
      },
      network: {
        title: "Error de red",
        description: "Error de conexión de red",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Hay cambios sin salvar",
      },
      conflict: {
        title: "Conflicto",
        description: "Conflicto de pago detectado",
      },
    },
    success: {
      title: "Operación completada",
      description: "Información de pago recuperada con éxito",
    },
  },

  // Top-level error handling
  errors: {
    validation: {
      title: "Error de validación",
      description: "Parámetros de pago inválidos",
    },
    notFound: {
      title: "No encontrado",
      description: "Pago no encontrado",
    },
    unauthorized: {
      signInRequired: "Inicie sesión para administrar pagos",
      title: "Se requiere autenticación",
      description: "Inicia sesión para continuar",
    },
    forbidden: {
      title: "Acceso denegado",
      description: "Permiso denegado",
    },
    server: {
      detail: "No se puede procesar el webhook de pago: {{error}}",
      title: "Error del servidor",
      description: "Ocurrió un error interno del servidor",
    },
    network: {
      title: "Error de red",
      description: "Error de conexión de red",
    },
    unknown: {
      title: "Error desconocido",
      description: "Ocurrió un error inesperado",
    },
    unsavedChanges: {
      title: "Cambios sin guardar",
      description: "Hay cambios sin salvar",
    },
    conflict: {
      title: "Conflicto",
      description: "Conflicto de pago detectado",
    },
    notImplemented: {
      title: "No se aplica",
      description:
        "Esta característica del proveedor de pago todavía no se aplica",
    },
    customerCreationFailed: "Failed to create Stripe customer",
    customerNotFound: "Stripe cliente no encontrado",
    localMode: "El pago está desactivado en el modo de desarrollo local.",
    webhookVerificationFailed:
      "La verificación de la firma Webhook falló: {{error}}",
  },

  // Top-level success
  success: {
    title: "Operación completada",
    description: "La operación se completó correctamente",
    sessionCreated: "Sesión de pago creada con éxito",
    infoRetrieved: "Información de pago recuperada con éxito",
  },

  // Field labels and descriptions
  amount: {
    label: "Monto",
    description: "Cantidad de pago en la moneda especificada",
    placeholder: "Ingrese la cantidad",
  },
  currency: {
    label: "Moneda",
    description: "Moneda de pago",
    placeholder: "Seleccione la moneda",
    usd: "Dólar US (USD)",
    eur: "Euro (EUR)",
    pln: "Polaco Zloty (PLN)",
  },
  mode: {
    label: "Modo de pago",
    description: "Tipo de período de sesiones de pago",
    placeholder: "Seleccione el modo de pago",
  },
  successUrl: {
    label: "Éxito URL",
    description: "URL para redirigir después del pago exitoso",
    placeholder: "https://example.com/success",
  },
  cancelUrl: {
    label: "Cancelar URL",
    description: "URL para redirigir si el pago es cancelado",
    placeholder: "https://example.com/cancel",
  },
  metadata: {
    label: "Metadatos",
    description: "Metadatos adicionales para la sesión de pago",
    placeholder: "Ingrese metadatos como JSON",
  },
  paymentId: {
    label: "Pago ID",
    description: "Pago específico ID para recuperar",
    placeholder: "Ingrese el pago ID",
  },
  sessionId: {
    label: "Período de sesiones ID",
    description: "Stripe session ID to query",
    placeholder: "Entrar sesión ID",
  },
  limit: {
    label: "Limitación",
    description: "Número máximo de resultados a la vuelta",
    placeholder: "20",
  },
  offset: {
    label: "Offset",
    description: "Número de resultados para saltar",
    placeholder: "0",
  },
  priceId: {
    label: "Precio ID",
    description: "Identificador de precio Stripe para el producto",
    placeholder: "price_1234567890",
  },
  provider: {
    label: "Proveedor de pagos",
    description: "Elija su método de pago",
    placeholder: "Selecciona el proveedor de pagos",
  },

  // Enum translations
  enums: {
    paymentProvider: {
      stripe: "Stripe",
      nowpayments: "NOWPayments",
      whop: "Whop",
    },
    paymentStatus: {
      pending: "Pendiente",
      processing: "Procesamiento",
      succeeded: "Succedido",
      failed: "Failed",
      canceled: "Cancelado",
      refunded: "Reembolsos",
    },
    paymentMethodType: {
      card: "Tarjeta de crédito/débito",
      bankTransfer: "Transferencia bancaria",
      paypal: "PayPal",
      applePay: "Apple Pay",
      googlePay: "Google Pay",
      sepaDebit: "SEPA Direct Debit",
    },
    paymentIntentStatus: {
      requiresPaymentMethod: "Requiere el método de pago",
      requiresConfirmation: "Requiere confirmación",
      requiresAction: "Requiere acción",
      processing: "Procesamiento",
      requiresCapture: "Requisitos Capture",
      canceled: "Cancelado",
      succeeded: "Succedido",
    },
    checkoutMode: {
      payment: "Pago",
      subscription: "Suscripción",
      setup: "Configuración inicial",
    },
    refundStatus: {
      pending: "Pendiente",
      succeeded: "Succedido",
      failed: "Failed",
      canceled: "Cancelado",
    },
    disputeStatus: {
      warningNeedsResponse: "Advertencia - Respuesta a las necesidades",
      warningUnderReview: "Advertencia - bajo revisión",
      warningClosed: "Advertencia - Cerrado",
      needsResponse: "Respuesta a las necesidades",
      underReview: "En examen",
      chargeRefunded: "Reembolso de carga",
      won: "Won",
      lost: "Perdidos",
    },
    invoiceStatus: {
      draft: "Proyecto",
      open: "Abierto",
      paid: "Pagado",
      void: "Vacío",
      uncollectible: "Incolectible",
    },
    taxStatus: {
      complete: "Completado",
      failed: "Failed",
      requiresLocation: "Requiere la ubicación",
    },
    paymentInterval: {
      month: "Mensual",
      year: "Anual",
      one_time: "Una vez",
    },
    manualPaymentMethod: {
      cash: "Efectivo",
      bankTransfer: "Transferencia bancaria",
      other: "Otro",
    },
    billStatus: {
      DRAFT: "Proyecto",
      RECEIVED: "Recibidos",
      APPROVED: "Aprobados",
      PAID: "Pagado",
      DISPUTED: "Controversias",
    },
    estimateStatus: {
      DRAFT: "Proyecto",
      SENT: "Sent",
      ACCEPTED: "Aceptado",
      DECLINED: "Declind",
      EXPIRED: "Gastos",
      CONVERTED: "Conversión",
    },
  },
};
