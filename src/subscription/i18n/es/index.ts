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
      description: "Vea su información de suscripción actual",
    },
  },

  // POST endpoint
  post: {
    title: "Crear suscripción",
    titleShort: "Crear sesión",
    description: "Crear una nueva suscripción",
    form: {
      title: "Creación de suscripciones",
      description: "Crear una nueva suscripción con el plan seleccionado",
    },
    errors: {
      validation: {
        title: "Entrada inválida",
        description:
          "Por favor, compruebe sus datos de suscripción e inténtelo de nuevo",
      },
      network: {
        title: "Error de conexión",
        description:
          "Incapaz de conectarse. Por favor, compruebe su conexión a Internet",
      },
      unauthorized: {
        title: "Inicia sesión para continuar",
        description: "Por favor, inicie sesión para crear una suscripción",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes permiso para crear una suscripción",
      },
      notFound: {
        title: "Plan no encontrado",
        description:
          "El plan de suscripción que seleccionó no pudo ser encontrado",
      },
      server: {
        title: "Algo que estaba mal.",
        description:
          "No podíamos crear tu suscripción. Por favor, inténtelo de nuevo.",
      },
      unknown: {
        title: "Error inesperado",
        description: "Algo inesperado sucedió. Por favor, inténtelo de nuevo.",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios que no han sido salvados",
      },
      conflict: {
        title: "Existencias de suscripción",
        description: "Ya tienes una suscripción activa",
      },
    },
    success: {
      title: "Suscripción activada",
      description: "Su suscripción se ha activado con éxito",
    },
  },

  // PUT endpoint
  put: {
    title: "Actualizar suscripción",
    titleShort: "Actualizar Sub",
    description: "Actualizar la suscripción existente",
    form: {
      title: "Actualización de la suscripción",
      description:
        "Actualice su plan de suscripción o intervalo de facturación",
    },
    errors: {
      validation: {
        title: "Actualización inválida",
        description: "Por favor, compruebe sus cambios e inténtelo de nuevo",
      },
      network: {
        title: "Error de conexión",
        description:
          "Incapaz de salvar tus cambios. Por favor, inténtelo de nuevo.",
      },
      unauthorized: {
        title: "Inicia sesión para continuar",
        description: "Inicie sesión para actualizar su suscripción",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tiene permiso para actualizar esta suscripción",
      },
      notFound: {
        title: "Suscripción No encontrada",
        description: "No pudimos encontrar su suscripción para actualizar",
      },
      server: {
        title: "Actualización Fallada",
        description:
          "No podíamos salvar tus cambios. Por favor, inténtelo de nuevo.",
      },
      unknown: {
        title: "Error inesperado",
        description: "Algo inesperado sucedió. Por favor, inténtelo de nuevo.",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios que no han sido salvados",
      },
      conflict: {
        title: "Actualización de conflictos",
        description:
          "Tu suscripción ha cambiado. Por favor, refresca y prueba de nuevo",
      },
    },
    submit: {
      label: "Actualizar suscripción",
      loading: "Actualizando...",
    },
    success: {
      title: "Subscripción Actualizada",
      description: "Su suscripción ha sido actualizada con éxito",
    },
  },

  // DELETE endpoint
  delete: {
    title: "Cancelar suscripción",
    titleShort: "Cancelar Sub",
    description: "Cancela tu suscripción",
    warning:
      "Si cancelas, tu acceso termina al final del período de facturación.",
    form: {
      title: "Cancelación de la suscripción",
      description: "Cancele su suscripción con ajustes opcionales",
    },
    errors: {
      validation: {
        title: "Solicitud inválida",
        description:
          "Por favor, compruebe sus datos de cancelación e inténtelo de nuevo",
      },
      network: {
        title: "Error de conexión",
        description:
          "Incapaz de procesar la cancelación. Por favor, inténtelo de nuevo.",
      },
      unauthorized: {
        title: "Inicia sesión para continuar",
        description: "Inicie sesión para cancelar su suscripción",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes permiso para cancelar esta suscripción",
      },
      notFound: {
        title: "Suscripción No encontrada",
        description: "No pudimos encontrar su suscripción para cancelar",
      },
      server: {
        title: "Cancelación fallida",
        description:
          "No podíamos cancelar tu suscripción. Por favor, inténtelo de nuevo.",
      },
      unknown: {
        title: "Error inesperado",
        description: "Algo inesperado sucedió. Por favor, inténtelo de nuevo.",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios que no han sido salvados",
      },
      conflict: {
        title: "Conflicto de cancelación",
        description:
          "Su estado de suscripción ha cambiado. Por favor, refresca y prueba de nuevo",
      },
    },
    submit: {
      label: "Cancelar suscripción",
      loading: "Cancelando...",
    },
    success: {
      title: "Suscripción cancelada",
      description: "Su suscripción ha sido cancelada con éxito",
    },
  },

  // Form fields
  form: {
    fields: {
      planId: {
        label: "Plan de suscripción",
        description: "Seleccione su plan de suscripción",
        placeholder: "Elija el plan",
      },
      billingInterval: {
        label: "Frecuencia de facturación",
        description: "Selecciona la frecuencia de facturación",
        placeholder: "Elige la frecuencia de facturación",
      },
      provider: {
        label: "Proveedor de pagos",
        description: "Seleccione su proveedor de pago",
      },
      catalogProductId: {
        label: "Catálogo Producto",
        description: "Enlace a un producto de catálogo para esta suscripción",
      },
      cancelAtPeriodEnd: {
        label: "Cancelar al final del período",
        description: "Cancelación de suscripción al final del período actual",
      },
      reason: {
        label: "Razón de cancelación",
        description: "Por favor, proporcione una razón para la cancelación",
        placeholder: "Ingrese la razón de cancelación",
      },
    },
  },

  // Response fields
  response: {
    checkoutUrl: "URL de la página de pago",
    sessionId: "Período de sesiones ID",
    hasSubscription: "Suscripción",
    id: "Suscripción ID",
    userId: "Usuario ID",
    status: "Estado de la suscripción",
    planId: "Plan ID",
    billingInterval: "Frecuencia de facturación",
    currentPeriodStart: "Período actual Inicio",
    currentPeriodEnd: "Período actual",
    cancelAtPeriodEnd: "Cancelar al final del período",
    cancelAt: "Cancelar",
    canceledAt: "Cancelado",
    endedAt: "Ended At",
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
    sync_failed: "Failed to sync subscription with database",
    database_error: "Error de la base de datos ocurrido: {{error}}",
    create_crashed: "La creación de suscripción falló",
    cancel_failed: "Fallado para cancelar la suscripción: {{error}}",
    user_not_found: "Usuario no encontrado",
    stripe_customer_creation_failed: "Failed to create Stripe customer",
    not_implemented_on_native:
      "{{method}} no se implementa en plataforma nativa. Por favor, utilice la versión web para esta operación.",
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
      status: "Situación",
      contact_user: "Contacto Usuario",
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
      name: "Admin Subscription Notification",
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
  canceledOn: "Cancelado",
  endedOn: "Ended On",
  billingInterval: "Frecuencia de facturación",
  currentPeriodStart: "Período actual Inicio",
  endsOn: "Finales en",
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
      stripe: "Cuenta PayPal, tarjeta o billetera digital",
      stripeDescription: "Tarjeta, PayPal, Apple Pay, Google Pay via Stripe",
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
      description: "Compra créditos adicionales para su cuenta",
    },
    history: {
      title: "Historial de facturación",
      description: "Vea su historial de facturación y transacción",
    },
    overview: {
      title: "Resumen de la suscripción",
      description: "Ver su estado de suscripción y detalles",
    },
  },
};
