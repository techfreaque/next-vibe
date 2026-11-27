import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Import checkout translations
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
          description: "Elige el plan",
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
          placeholder: "Introduce metadatos en JSON",
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

  // Main subscription domain
  category: "Facturación",

  // Tags
  tags: {
    subscription: "suscripción",
    billing: "Facturación",
    get: "¡Vamos!",
    create: "crear",
    update: "actualización",
    cancel: "Cancelación",
  },

  // Subscription plans
  plans: {
    starter: {
      title: "Plan de inicio",
    },
    professional: {
      title: "Plan del cuadro orgánico",
    },
    premium: {
      title: "Plan Premium",
    },
    enterprise: {
      title: "Plan institucional",
    },
  },

  // Billing intervals
  billing: {
    monthly: "Mensual",
    yearly: "Anual",
  },

  // GET endpoint
  get: {
    title: "Suscripción",
    titleShort: "Mi suscripción",
    description: "Recuperar los datos de suscripción actuales",
    form: {
      title: "Detalles de la suscripción",
      description: "Consulta los datos de tu suscripción actual",
    },
  },

  // POST endpoint
  post: {
    title: "Crear suscripción",
    titleShort: "Suscribirse",
    description: "Crear una nueva suscripción",
    form: {
      title: "Creación de suscripciones",
      description: "Crear una nueva suscripción con el plan seleccionado",
    },
    errors: {
      validation: {
        title: "Entrada inválida",
        description: "Revisa los datos de tu suscripción y vuelve a intentarlo",
      },
      network: {
        title: "Error de conexión",
        description: "Sin conexión. Revisa tu conexión a Internet",
      },
      unauthorized: {
        title: "Inicia sesión para continuar",
        description: "Inicia sesión para suscribirte",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes permiso para crear una suscripción",
      },
      notFound: {
        title: "Plan no encontrado",
        description: "No encontramos el plan que elegiste",
      },
      server: {
        title: "Algo salió mal",
        description: "No pudimos crear tu suscripción. Vuelve a intentarlo.",
      },
      unknown: {
        title: "Error inesperado",
        description: "Algo salió mal. Vuelve a intentarlo.",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
      conflict: {
        title: "Ya tienes una suscripción",
        description: "Ya tienes una suscripción activa",
      },
    },
    success: {
      title: "Suscripción activada",
      description: "Tu suscripción está activa",
    },
  },

  // PUT endpoint
  put: {
    title: "Actualizar suscripción",
    titleShort: "Cambiar plan",
    description: "Actualizar la suscripción existente",
    form: {
      title: "Actualización de la suscripción",
      description: "Cambia tu plan o la frecuencia de facturación",
    },
    errors: {
      validation: {
        title: "Actualización inválida",
        description: "Revisa tus cambios y vuelve a intentarlo",
      },
      network: {
        title: "Error de conexión",
        description: "No pudimos guardar tus cambios. Vuelve a intentarlo.",
      },
      unauthorized: {
        title: "Inicia sesión para continuar",
        description: "Inicia sesión para cambiar tu suscripción",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes permiso para cambiar esta suscripción",
      },
      notFound: {
        title: "Suscripción no encontrada",
        description: "No encontramos tu suscripción",
      },
      server: {
        title: "No se pudo actualizar",
        description: "No pudimos guardar tus cambios. Vuelve a intentarlo.",
      },
      unknown: {
        title: "Error inesperado",
        description: "Algo salió mal. Vuelve a intentarlo.",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
      conflict: {
        title: "Conflicto al actualizar",
        description:
          "Tu suscripción cambió mientras tanto. Recarga la página y vuelve a intentarlo",
      },
    },
    submit: {
      label: "Actualizar suscripción",
      loading: "Actualizando...",
    },
    success: {
      title: "Suscripción actualizada",
      description: "Tu suscripción está actualizada",
    },
  },

  // DELETE endpoint
  delete: {
    title: "Cancelar suscripción",
    titleShort: "Cancelar",
    description: "Cancela tu suscripción",
    warning:
      "Si cancelas, tu acceso termina al final del período de facturación.",
    form: {
      title: "Cancelación de la suscripción",
      description: "Cancela tu suscripción, con ajustes opcionales",
    },
    errors: {
      validation: {
        title: "Solicitud inválida",
        description: "Revisa los datos de la cancelación y vuelve a intentarlo",
      },
      network: {
        title: "Error de conexión",
        description: "No pudimos procesar la cancelación. Vuelve a intentarlo.",
      },
      unauthorized: {
        title: "Inicia sesión para continuar",
        description: "Inicia sesión para cancelar tu suscripción",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes permiso para cancelar esta suscripción",
      },
      notFound: {
        title: "Suscripción no encontrada",
        description: "No encontramos tu suscripción",
      },
      server: {
        title: "Cancelación fallida",
        description: "No pudimos cancelar tu suscripción. Vuelve a intentarlo.",
      },
      unknown: {
        title: "Error inesperado",
        description: "Algo salió mal. Vuelve a intentarlo.",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
      conflict: {
        title: "Conflicto de cancelación",
        description:
          "El estado de tu suscripción cambió. Recarga la página y vuelve a intentarlo",
      },
    },
    submit: {
      label: "Cancelar suscripción",
      loading: "Cancelando...",
    },
    success: {
      title: "Suscripción cancelada",
      description: "Tu suscripción está cancelada",
    },
  },

  // Form fields
  form: {
    fields: {
      planId: {
        label: "Plan de suscripción",
        description: "Elige tu plan",
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
      },
      catalogProductId: {
        label: "Producto del catálogo",
        description: "Enlace a un producto de catálogo para esta suscripción",
      },
      cancelAtPeriodEnd: {
        label: "Cancelar al final del período",
        description: "Cancela la suscripción al final del período actual",
      },
      reason: {
        label: "Motivo de la cancelación",
        description: "Cuéntanos por qué cancelas",
        placeholder: "Escribe el motivo",
      },
    },
  },

  // Response fields
  response: {
    checkoutUrl: "URL de la página de pago",
    sessionId: "ID de sesión",
    hasSubscription: "Suscripción",
    id: "Suscripción ID",
    userId: "Usuario ID",
    status: "Estado de la suscripción",
    planId: "ID del plan",
    billingInterval: "Frecuencia de facturación",
    currentPeriodStart: "Inicio del período actual",
    currentPeriodEnd: "Período actual",
    cancelAtPeriodEnd: "Cancelar al final del período",
    cancelAt: "Cancelar",
    canceledAt: "Cancelado",
    endedAt: "Finalizada el",
    checkoutProviders: "Métodos de pago disponibles",
    nowPaymentsAcceptsCards: "El pago cripto acepta tarjetas",
    trialStart: "Fecha de inicio del juicio",
    trialEnd: "Fecha final del juicio",
    success: "Operación con éxito",
    message: "Mensaje de Estado",
    subscriptionId: "Suscripción ID",
    stripeCustomerId: "Stripe Cliente ID",
    updatedFields: "Campos actualizados",
    endsAt: "Fins At",
    createdAt: "Creado en",
    updatedAt: "Actualizado en",
    provider: "Proveedor de pagos",
    providerSubscriptionId: "Suscripción del proveedor ID",
  },

  // Error types
  errors: {
    tierChange: {
      notActive: "Tu plan está inactivo. Activa uno nuevo.",
      cryptoNotSupported:
        "Los planes pagados con criptomonedas solo se pueden cambiar al final del período. Elige tu nuevo plan cuando termine el actual.",
      paymentRequired:
        "Tu banco solicita que confirmes el cambio de plan. Abre la factura para completarlo: {{url}}",
      failed: "No pudimos cambiar el plan: {{error}}",
      upgraded:
        "Ya tienes el plan {{plan}}. Recibiste {{credits}} créditos extra para este período.",
      changed: "Cambiaste al plan {{plan}}.",
      downgraded:
        "Pasarás a {{plan}} en la próxima renovación. Hasta entonces conservas tus créditos actuales.",
      unchanged: "Ya tienes este plan.",
    },
    validation: {
      title: "Error de validación",
      description: "Parámetros de suscripción inválidos",
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
      description: "Suscripción no encontrada",
    },
    not_found: "Suscripción no encontrada",
    not_found_description: "No se pudo encontrar la suscripción solicitada",
    server: {
      title: "Error del servidor",
      description: "Ocurrió un error interno del servidor",
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
    use_checkout_flow: "Compra tu suscripción desde la página de pago",
    use_checkout_flow_description:
      "Para activar una suscripción, completa la compra desde la página de pago.",
    conflict: {
      title: "Conflicto",
      description: "Hay un conflicto entre los datos",
    },
    sync_failed: "No se pudo sincronizar la suscripción con la base de datos",
    database_error: "Error de la base de datos ocurrido: {{error}}",
    create_crashed: "La creación de suscripción falló",
    cancel_failed: "Fallado para cancelar la suscripción: {{error}}",
    user_not_found: "Usuario no encontrado",
    stripe_customer_creation_failed: "No se pudo crear el cliente de Stripe",
    not_implemented_on_native:
      "{{method}} aún no está disponible en la app. Usa la versión web.",
    no_provider_id: "No proveedor de pago ID encontrado",
  },

  sync: {
    failed: "No sincronizar la suscripción: {{error}}",
    stripe_error: "Error de sincronización Stripe: {{error}}",
    success: "Suscripción sincronizada con éxito",
  },

  // Cancel operation
  cancel: {
    success: "Suscripción cancelada con éxito",
  },

  // Success types
  success: {
    title: "Operación completada",
    description: "La operación se completó correctamente",
  },

  // Status translations
  status: {
    incomplete: "Incompleta",
    incomplete_expired: "Gastos incompletos",
    trialing: "Juicio",
    active: "Activa",
    pastDue: "Puestos atrasados",
    canceled: "Cancelado",
    unpaid: "No pagados",
    paused: "Pausa",
  },

  // Email translations
  email: {
    success: {
      headline: "Ya tienes acceso. Sin filtros, sin sermones.",
      subject: "Tu suscripción a {{appName}} está activa",
      previewText:
        "{{privateName}}, ya tienes acceso. {{subscriptionCredits}} créditos al mes, {{modelCount}} modelos, cero restricciones.",
      activeBadge: "Activa",
      greeting: "Hola, {{privateName}}:",
      intro:
        "Tu suscripción a {{appName}} está activa. Tienes {{subscriptionCredits}} créditos al mes para usar con todos los modelos. Sin límites diarios, sin filtros de contenido y sin tener que dar explicaciones.",
      models: {
        title: "{{modelCount}} modelos, 3 categorías",
        mainstream: "Convencional",
        open: "Código abierto",
        uncensored: "Sin censura",
      },
      included: {
        title: "Lo que recibes cada mes:",
        credits:
          "{{subscriptionCredits}} créditos al mes con renovación automática",
        models: "Acceso a los {{modelCount}} modelos de IA",
        nolimits: "Sin límites diarios. Usa tus créditos cuando quieras",
        uncensored: "Modelos sin filtros de contenido",
        packs: "Compra paquetes de créditos extra que nunca vencen",
        cancel: "Cancela cuando quieras, sin dar explicaciones",
      },
      cta: "Empieza a chatear",
      packs: {
        title: "¿Necesitas más créditos?",
        description:
          "¿Te quedan pocos créditos antes de renovar? Recarga cuando quieras: {{packCredits}} créditos por {{packPrice}}. Los paquetes nunca vencen y se suman a tus créditos mensuales.",
        cta: "Comprar paquete de créditos",
      },
      manage: "Gestiona o cancela tu suscripción en cualquier momento desde",
      manageLink: "la configuración de tu cuenta",
      signoff: "Que disfrutes tus chats,\nEl equipo de {{appName}}",
    },
    admin_notification: {
      title: "Nueva suscripción",
      subject: "Nueva suscripción al plan {{planName}}",
      preview: "Nueva suscripción: {{userName}} eligió {{planName}}",
      message: "Hay una nueva suscripción a {{appName}}.",
      details: "Detalles de la suscripción",
      user_name: "Nombre del usuario",
      user_email: "Correo electrónico",
      plan: "Plan",
      status: "Estado",
      contact_user: "Contactar al usuario",
      footer: "Notificación automática de {{appName}}",
    },
  },

  // Email template metadata (for preview registry)
  emailTemplates: {
    success: {
      name: "Suscripción Éxito Email",
      description:
        "Correo electrónico de confirmación enviado cuando el usuario activa una suscripción",
      category: "suscripción",
      preview: {
        privateName: {
          label: "Nombre del usuario",
          description: "Nombre de la pantalla del usuario",
        },
        userId: {
          label: "Usuario ID",
          description: "El identificador único del usuario",
        },
        leadId: {
          label: "ID del contacto",
          description: "El identificador de contacto asociado",
        },
        planName: {
          label: "Nombre del plan",
          description: "El nombre del plan de suscripción",
        },
      },
    },
    adminNotification: {
      name: "Aviso de suscripción para admins",
      description:
        "La notificación interna enviada a los administradores cuando un usuario se suscribe",
      category: "admin",
      preview: {
        privateName: {
          label: "Nombre del usuario",
        },
        publicName: {
          label: "Nombre público",
        },
        email: {
          label: "Correo electrónico",
        },
        planName: {
          label: "Nombre del plan",
        },
        statusName: {
          label: "Estado de la suscripción",
        },
      },
    },
  },

  // Widget-specific keys (cancel confirmation dialog, etc.)
  widget: {
    back: "Atrás",
    confirm: {
      title: "¿Quieres cancelar tu suscripción?",
      description:
        "Perderás el acceso al final del período de facturación. La cancelación es definitiva.",
      cancel: "Mantener suscripción",
      proceed: "Sí, cancelar",
    },
  },

  // Widget display keys
  title: "Tu suscripción",
  description: "Gestiona tu suscripción y facturación",
  notAvailable: "N/A",
  canceledOn: "Cancelada el",
  endedOn: "Finalizó el",
  billingInterval: "Frecuencia de facturación",
  currentPeriodStart: "Inicio del período actual",
  endsOn: "Termina el",
  nextBillingDate: "Próxima fecha de facturación",
  cancellation: {
    title: "Cancelación programada",
    description:
      "Tu suscripción terminará el {{date}}. Conservas el acceso hasta ese día.",
  },
  canceled: {
    title: "Suscripción finalizada",
    description:
      "Tu suscripción terminó. Renuévala para recuperar el acceso a todas las funciones.",
  },
  noSubscription: {
    title: "Aún no tienes una suscripción",
    description:
      "Suscríbete para recibir créditos mensuales y acceder a todos los modelos.",
    cta: "Ver planes",
  },
  manage: {
    nowpayments: {
      info: "Contacta a soporte para gestionar tu suscripción a través de NowPayments.",
      button: "Gestionar suscripción",
    },
    stripe: {
      button: "Gestionar suscripción",
    },
    portal: {
      error: "No pudimos abrir el portal del cliente. Vuelve a intentarlo.",
    },
  },

  // Enum translations
  enums: {
    plan: {
      subscription: "Starter",
      plus: "Plus",
      pro: "Pro",
      ultra: "Ultra",
    },
    status: {
      incomplete: "Incompleta",
      incompleteExpired: "Gastos incompletos",
      trialing: "Juicio",
      active: "Activa",
      pastDue: "Puestos atrasados",
      canceled: "Cancelado",
      unpaid: "No pagados",
      paused: "Pausa",
      canceling: "Pendiente de cancelación",
    },
    billing: {
      monthly: "Mensual",
      yearly: "Anual",
    },
    cancellation: {
      tooExpensive: "Demasiado caro",
      missingFeatures: "Características desaparecidas",
      switchingService: "Servicio de conmutación",
      temporaryPause: "Pausa temporal",
      other: "Otro",
    },
    paymentProvider: {
      nowpayments: "NowPayments",
      stripe: "Stripe",
    },
  },

  // Buy / pricing page translations
  quickCheckout: {
    pack: {
      title: "{{credits}} créditos",
      note: "Recarga única. Los créditos nunca vencen.",
      aria: "Compra {{credits}} créditos por {{price}}. Pago único.",
    },
    plan: {
      title: "{{credits}} créditos al mes",
      note: "{{plan}}. Cancela cuando quieras.",
      perMonth: "/mes",
      aria: "Activa {{plan}}: {{credits}} créditos al mes por {{price}}",
    },
    upgrade: {
      title: "Subir al plan {{plan}}",
      note: "{{credits}} créditos al mes",
      aria: "Sube a {{plan}}: {{credits}} créditos al mes por {{price}}",
      confirm:
        "Pagas la diferencia por lo que queda del período y recibes los créditos extra al instante.",
      confirmButton: "Cambiar de plan ahora",
      cancel: "Cancelar",
      working: "Cambiando de plan…",
    },
    opening: "Abriendo la página de pago…",
    secure: "Tarjeta, PayPal, Apple Pay y Google Pay a través de Stripe.",
    allPlans: "Todos los planes y criptomonedas",
    moreOptions: "Criptomonedas y otras opciones",
    error: "No pudimos abrir la página de pago. Vuelve a intentarlo.",
  },
  tiers: {
    examples: {
      heading: "Lo que te dan {{credits}} créditos al mes",
      subheading: "Mensajes al mes con algunos modelos populares.",
      perMessage: "unos {{credits}} créditos por mensaje",
      messages: "unos {{amount}} mensajes",
      note: "Estimado para un mensaje típico: {{input}} tokens de entrada (tu chat hasta ahora) y {{output}} de salida. Los chats cortos cuestan menos, los largos y los archivos cuestan más.",
    },
    faq: {
      heading: "Preguntas antes de pagar",
      credit: {
        question: "¿Cuánto vale un crédito?",
        answer:
          "Un crédito vale {{unitPrice}}. Los modelos ligeros cuestan menos de un crédito por mensaje, los mejores unos pocos. Los ejemplos de arriba usan los precios reales de los modelos.",
      },
      unused: {
        question: "¿Qué pasa con los créditos que no uso?",
        answer:
          "Los créditos del plan cubren tu mes de facturación y se recargan al renovar. Los paquetes de créditos nunca caducan.",
      },
      cancel: {
        question: "¿Puedo cancelar?",
        answer:
          "Sí, cuando quieras, aquí mismo. Conservas tu plan y sus créditos hasta que termine el periodo pagado.",
      },
      free: {
        question: "¿Qué sigue siendo gratis?",
        answer:
          "Los invitados reciben {{freeCreditsGuest}} créditos al mes. Una cuenta gratuita recibe {{freeCreditsSignedIn}}, y {{freeCreditsMax}} con la suscripción al boletín confirmada. Sin tarjeta.",
      },
      api: {
        question: "¿Un plan desbloquea la API?",
        answer:
          "Sí. Cualquier plan o paquete de créditos desbloquea claves API para clientes compatibles con OpenAI y Anthropic. Los créditos gratis no.",
      },
      pay: {
        question: "¿Cómo puedo pagar?",
        answer:
          "Con tarjeta o PayPal a través de Stripe, o con cripto a través de NOWPayments.",
      },
      more: "Más respuestas en el centro de ayuda",
    },
    heading: "Elige tu plan",
    subheading:
      "Nuevos créditos cada mes para los {{modelCount}} modelos. Cancela cuando quieras.",
    changeHeading: "Cambiar de plan",
    changeSubheading: "Tienes el plan {{plan}}: {{credits}} créditos al mes.",
    recommended: "Recomendado",
    current: "Tu plan",
    perMonth: "/ mes",
    perYear: "/ año",
    creditsPerMonth: "créditos al mes",
    yearlyEquivalent: "{{monthlyPrice}} al mes, con facturación anual",
    picked: "{{plan}}: {{credits}} créditos al mes",
    pickedNote:
      "Los {{modelCount}} modelos. Tus créditos se renuevan cada mes. Cancela cuando quieras.",
    cta: {
      start: "Elegir {{plan}}",
      upgrade: "Subir al plan {{plan}}",
      downgrade: "Cambiar a {{plan}} al renovar",
      intervalYearly: "Cambiar a facturación anual",
      intervalMonthly: "Cambiar a {{plan}} con facturación mensual",
      current: "Tu plan actual",
    },
    signInHint: "Crea una cuenta gratis para activar un plan.",
    cryptoHint:
      "¿Pagas con criptomonedas? Plus, Pro y Ultra las aceptan con facturación mensual o anual. Starter solo con la anual.",
    confirm: {
      upgradeTitle: "¿Quieres subir a {{plan}}?",
      upgradeBody:
        "Pagas la diferencia por lo que queda del período y recibes los créditos extra al instante. Desde la próxima renovación pagarás {{price}} al mes por {{credits}} créditos.",
      upgradeButton: "Pagar y cambiar de plan",
      downgradeTitle: "¿Quieres cambiar a {{plan}}?",
      downgradeBody:
        "El nuevo plan empieza el {{date}}, en tu próxima renovación. Hasta entonces conservas tu plan y tus créditos actuales. Desde ese día pagarás {{price}} al mes por {{credits}} créditos.",
      downgradeButton: "Cambiar al renovar",
      intervalTitle: "¿Quieres cambiar la facturación?",
      intervalBody:
        "Tu período de facturación vuelve a empezar hoy. Stripe ajusta la diferencia según el tiempo restante. Nuevo plan: {{plan}}, {{price}}{{period}}, {{credits}} créditos al mes.",
      intervalButton: "Cambiar facturación",
      cancel: "Ahora no",
      working: "Cambiando…",
    },
    packsLocked: {
      title: "Paquetes de créditos: {{credits}} créditos por {{price}}",
      body: "Los paquetes recargan un plan activo. Activa un plan y añade paquetes cuando te queden pocos créditos. Nunca vencen.",
    },
    topUp: {
      heading: "Recargar",
      subheading:
        "¿Te quedan pocos créditos antes de renovar? Los paquetes se suman a tu plan y nunca vencen.",
    },
  },
  buy: {
    provider: {
      stripe: "Tarjeta, PayPal y billeteras digitales",
      stripeDescription:
        "Tarjeta, PayPal, Apple Pay y Google Pay a través de Stripe",
      nowpayments: "Criptomonedas (NowPayments)",
      nowpaymentsDescription:
        "Paga con Bitcoin, Ethereum y otras criptomonedas",
      cryptoMonthlyDisabled:
        "Starter acepta criptomonedas con facturación anual. Plus, Pro y Ultra también las aceptan con facturación mensual.",
    },
    login: "Iniciar sesión",
    signup: "Regístrate gratis",
  },

  // Page metadata
  meta: {
    subscription: {
      title: "Suscripción",
      description: "Gestiona tu suscripción y facturación",
    },
    buyCredits: {
      title: "Comprar créditos",
      description: "Compra créditos adicionales para tu cuenta",
    },
    history: {
      title: "Historial de facturación",
      description: "Consulta tu historial de facturación y transacciones",
    },
    overview: {
      title: "Resumen de la suscripción",
      description: "Consulta el estado y los detalles de tu suscripción",
    },
  },
};
