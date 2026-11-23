import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  bounceSync: {
    title: "Fallos de entrega de registro sincronizado",
    description:
      "Compruebe la bandeja de entrada del sistema para correos electrónicos de confirmación de registro fallidos.",
    marked: "Actualización de las firmas",
    result: "Suscripciones actualizadas: {{count}}",
    productionOnly:
      "La sincronización de entrega de registro se ejecuta sólo en la producción.",
    mailboxUnavailable:
      "No podía revisar la bandeja de entrada del sistema para emails de registro fallidos.",
  },
  events: {
    started: "Registro iniciado",
    emailSent: "Correo de confirmación enviado",
    sendFailed: "Falló el correo de confirmación",
    bounced: "Correo de confirmación rebotado",
    expired: "Confirmación caducada",
    confirmed: "Correo confirmado",
    reminderSent: "Recordatorio enviado",
  },
  reminder: {
    subject: "Tu cuenta de {{appName}} está a un clic",
    hint: "Empezaste a registrarte pero nunca confirmaste tu correo. Confirma ahora y recibe {{credits}} créditos gratis cada mes. El código y el botón de abajo valen 24 horas y sustituyen a los del primer correo.",
    button: "Confirmar e iniciar sesión",
    ignore:
      "¿No fuiste tú? Ignora este correo. Sin un clic no se crea ninguna cuenta.",
  },
  confirmation: {
    bouncedTitle: "No pudimos entregar el correo de confirmación",
    changeAddress: "Cambiar dirección de correo",
    description:
      "Completa tu registro con el código o el enlace que recibiste por correo.",
    title: "Revisa tu bandeja de entrada",
    sent: "Ingresa el código que enviamos a {{email}}. Vence en 30 minutos.",
    code: "Código de 6 dígitos",
    confirm: "Confirmar e iniciar sesión",
    change: "¿La dirección es incorrecta? Cámbiala",
    resend: "Reenviar código",
    countdown: "Reenviar en {{seconds}} s",
    save: "Enviar a esta dirección",
    cancel: "Cancelar",
    email: "Dirección de correo electrónico",
    hint: "Para terminar de crear tu cuenta, ingresa este código o usa el enlace de abajo en los próximos 30 minutos.",
    bounce:
      "No pudimos entregar el correo de confirmación a {{email}}. Revisa la dirección o usa otra.",
    bouncePolicy:
      "Tu proveedor bloqueó nuestro mensaje. Las cuentas escolares y laborales suelen rechazar correos externos. Usa otra dirección.",
    bounceMailboxMissing:
      "Tu proveedor indica que {{email}} no existe. Revisa la dirección o usa otra.",
    bounceMailboxFull:
      "La bandeja de {{email}} está llena. Libera espacio y solicita otro código o usa una dirección diferente.",
    invalid:
      "El código o el enlace no es válido o ya venció. Solicita otro código.",
    cooldown: "Demasiadas solicitudes. Espera antes de pedir otro código.",
    domain: "Este dominio no puede recibir correo. Revisa la dirección.",
    sendFailed:
      "No pudimos enviar el correo a {{email}}. Revisa la dirección o vuelve a intentarlo.",
    done: "Correo confirmado. Ya iniciaste sesión.",
    newsletter:
      "Al confirmar, también activas la suscripción al boletín que solicitaste.",
    link: "Confirmar mi correo",
    pendingId: "Referencia de inscripción",
    token: "Enlace de confirmación de correo electrónico token",
    callback: "Camino de retorno",
    suggestion: "¿Quisiste decir {{email}}?",
    expired: "El registro venció. Vuelve a empezar para recibir otro código.",
    retry: "Volver a registrarme",
  },
  category: "Usuarios",

  _components: {
    passwordStrength: {
      label: "Seguridad de la contraseña",
      weak: "Débil",
      fair: "Aceptable",
      good: "Buena",
      strong: "Fuerte",
      requirement: {
        minLength: {
          icon: "✗",
          text: "Al menos 8 caracteres",
        },
        uppercase: {
          icon: "✗",
          text: "Al menos una letra mayúscula",
        },
        lowercase: {
          icon: "✗",
          text: "Al menos una letra minúscula",
        },
        number: {
          icon: "✗",
          text: "Al menos un número",
        },
        special: {
          icon: "!",
          text: "Carácter especial (opcional, la hace más segura)",
        },
      },
    },
    post: {
      title: "_components",
      description: "_ punto final de los componentes",
      form: {
        title: "Configuración de _components",
        description: "Configurar los parámetros _components",
      },
      response: {
        title: "Respuesta",
        description: "Datos de respuesta _components",
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
      },
      success: {
        title: "Operación completada",
        description: "La operación se completó correctamente",
      },
    },
  },
  title: "Registro de Usuarios",
  titleShort: "Registrarse",
  description: "Punto final de registro del usuario",
  tag: "Autenticación",
  form: {
    title: "Crea tu cuenta",
    description: "Todos los modelos. Tus reglas. Gratis para empezar.",
  },
  actions: {
    submit: "Enviar código de confirmación",
    submitting: "Enviando código...",
  },
  fields: {
    privateName: {
      label: "Nombre privado",
      description: "Cómo te llama la IA. Nadie más lo ve.",
      placeholder: "p. ej. Alex",
      validation: {
        required: "El nombre privado es obligatorio",
        minLength: "El nombre debe tener al menos 2 caracteres",
        maxLength: "El nombre debe tener menos de 100 caracteres",
      },
    },
    publicName: {
      label: "Nombre público",
      description: "Se muestra en chats compartidos y foros.",
      placeholder: "p. ej. alex_crea",
      validation: {
        required: "El nombre público es obligatorio",
        minLength: "El nombre público debe tener al menos 2 caracteres",
        maxLength: "El nombre público debe tener menos de 100 caracteres",
      },
    },
    email: {
      label: "Correo electrónico",
      description: "Solo para iniciar sesión. Nunca se comparte.",
      placeholder: "tu@ejemplo.com",
      help: "Será tu correo para iniciar sesión y tu contacto principal",
      validation: {
        required: "El correo es obligatorio",
        invalid: "Introduce un correo válido",
      },
    },
    password: {
      label: "Contraseña",
      description:
        "8+ caracteres con mayúscula, minúscula y un número. Guárdala bien: llega el cifrado de extremo a extremo, y entonces un restablecimiento borrará tu historial.",
      placeholder: "Crea una contraseña",
      validation: {
        required: "Se requiere contraseña",
        minLength: "La contraseña debe tener al menos 8 caracteres",
        complexity:
          "La contraseña debe incluir mayúsculas, minúsculas y un número",
      },
    },
    confirmPassword: {
      label: "Confirma la contraseña",
      validation: {
        required: "Confirma tu contraseña",
        minLength: "La contraseña debe tener al menos 8 caracteres",
        mismatch: "Las contraseñas no coinciden",
      },
    },
    subscribeToNewsletter: {
      label:
        "Suscríbete al boletín y recibe créditos gratis adicionales cada mes",
      description:
        "Confirma tu correo para activar el bono mensual del boletín.",
      checkboxLabel:
        "Suscríbete al boletín y recibe +{{credits}} créditos gratis cada mes",
      hint: "Nuevos modelos y novedades del producto cada pocas semanas. Cancela cuando quieras.",
      tooltip:
        "Confirma tu correo para recibir {{credits}} créditos extra cada mes, {{total}} en total, mientras sigas suscrito.",
    },
    acceptTerms: {
      label: "Acepto los términos y condiciones",
      description:
        "Nuestros términos y nuestra política de privacidad respetan tu libertad.",
      termsLink: "términos",
      conditionsLink: "política de privacidad",
      descriptionPrefix: "Nuestros",
      descriptionAnd: "y nuestra",
      descriptionSuffix: "respetan tu libertad.",
      validation: {
        required: "Para continuar, acepta los términos y condiciones",
      },
    },
    referralCode: {
      label: "Código de referido (opcional)",
      description:
        "¿Un amigo te dio un código? Recibirá una recompensa cuando te suscribas.",
      placeholder: "Ingresa el código",
      labelPrefilled: "Código de referido",
      subscriptionBonus:
        "+{{credits}} créditos extra con tu primera suscripción.",
      descriptionPrefilled:
        "Tu amigo recibe una recompensa cuando creas tu cuenta.",
      validation: {
        invalid:
          "El código de referido no existe o ya no está activo. Corrígelo o deja el campo vacío.",
      },
    },
    supportedSkillId: {
      label: "Apoya a un creador",
      description:
        "Al registrarte, la persona que creó esta habilidad recibe un 5 % extra de tus suscripciones.",
      selectorTitle: "Apoya a un creador",
      selectorDescription:
        "Agregaste a tus favoritos habilidades de creadores independientes. Elige a quién apoyar: recibirá un 5 % extra de tus suscripciones. Puedes cambiar tu elección cuando quieras.",
      selectorNone: "Nadie (omitir)",
    },
    localFavorites: {
      label: "Locales favoritos",
    },
  },

  footer: {
    alreadyHaveAccount: "¿Ya tienes una cuenta? Inicia sesión",
  },
  errors: {
    title: "Error de registro",
    validation: {
      title: "Error de validación",
      description: "Revisa tus datos y vuelve a intentarlo",
    },
    unauthorized: {
      title: "Se requiere autenticación",
      description: "Inicia sesión para continuar",
    },
    server: {
      title: "Error del servidor",
      description: "Ocurrió un error interno del servidor",
    },
    unknown: {
      title: "Error desconocido",
      description: "Ocurrió un error inesperado",
    },
    conflict: {
      title: "La cuenta ya existe",
      description: "Ya existe una cuenta con este correo",
      detail: "Ya existe una cuenta con este correo. Inicia sesión.",
    },
    disposableEmail: {
      title: "Necesitas una dirección de correo permanente",
      detail:
        "No puedes registrarte con un correo temporal. Usa una dirección permanente.",
    },
    subnetSignupLimit: {
      title: "Demasiados registros desde tu red",
      detail:
        "Hoy se crearon demasiadas cuentas desde tu red. Intenta mañana o inicia sesión en una cuenta existente.",
    },
    userNotFound: "No se ha encontrado ninguna cuenta para {{email}}",
    forbidden: {
      title: "Acceso denegado",
      description: "Acceso denegado",
    },
    network: {
      title: "Error de red",
      description: "Ocurrió un error de red",
    },
    notFound: {
      title: "No encontrado",
      description: "No se encontró el recurso",
    },
    unsaved: {
      title: "Cambios sin guardar",
      description: "Tienes cambios sin guardar",
    },
    autoLoginFailed:
      "Tu cuenta está lista, pero el inicio de sesión automático falló. Inicia sesión con tu nueva contraseña.",
    internal: {
      title: "Falló el registro de {{email}}: {{error}}",
      description: "Se produjo un error interno",
    },
  },
  emailCheck: {
    title: "Comprobación de correo",
    description: "Comprueba si el correo está disponible para registrarse",
    tag: "Correo electrónico",
    fields: {
      email: {
        label: "Dirección de correo electrónico",
        description: "Correo electrónico para comprobar",
        placeholder: "Introduce tu correo",
        validation: {
          invalid: "Formato de correo electrónico inválido",
        },
      },
    },
    response: {
      title: "Resultado de la comprobación del correo",
      description:
        "Resultado de comprobación de disponibilidad de correo electrónico",
      available: "Correo electrónico disponible",
      message: "Mensaje",
    },
    errors: {
      validation: {
        title: "Correo electrónico inválido",
        description: "Introduce un correo válido",
      },
      internal: {
        title: "No se pudo comprobar {{email}} : {{error}}",
        description:
          "Verificación de errores disponibilidad de correo electrónico",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      conflict: {
        title: "Dirección de correo en uso",
        description: "Este correo electrónico ya está registrado",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes permiso para comprobar este correo",
      },
      network: {
        title: "Error de red",
        description:
          "Error de red ocurrió mientras se comprueba el correo electrónico",
      },
      notFound: {
        title: "Servicio No encontrado",
        description:
          "El servicio de cheque por correo electrónico no está disponible",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description:
          "Autenticación requerida para comprobar el correo electrónico",
      },
      unsaved: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
    },
    success: {
      title: "Comprobación del correo completada",
      description: "Disponibilidad de correo electrónico comprobada con éxito",
    },
  },
  post: {
    title: "Registro",
    description: "Endpoint de registro",
    form: {
      title: "Configuración de registro",
      description: "Configurar parámetros de registro",
    },
    response: {
      title: "Respuesta",
      description: "Datos de respuesta de registro",
      success: "Registro completado",
      message: "Mensaje de estado",
      userId: "ID de usuario",
      nextSteps: "Siguientes pasos",
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
      unsaved: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
    },
    success: {
      title: "Operación completada",
      description: "La operación se completó correctamente",
      processing: "Registro procesado correctamente",
    },
  },
  response: {
    title: "Respuesta",
    description: "Datos de respuesta de registro",
    success: "Registro completado",
    message: "Mensaje de estado",
    user: {
      id: "ID de usuario",
      email: "Dirección de correo electrónico",
      firstName: "Nombre",
      lastName: "Apellido",
      privateName: "Nombre privado",
      publicName: "Nombre público",
      imageUrl: "URL de la imagen de perfil",
      verificationRequired: "Verificación requerida",
    },
    verificationInfo: {
      title: "Verificación de correo electrónico",
      description:
        "Detalles sobre el proceso de verificación de correo electrónico",
      emailSent: "Correo enviado",
      expiresAt: "La verificación vence el",
      checkSpamFolder: "Revisa también la carpeta de spam",
    },
    nextSteps: "Siguientes pasos",
  },
  success: {
    title: "Revisa tu bandeja de entrada",
    description: "Ingresa el código que recibiste por correo.",
  },
  admin_notification: {
    title: "Nuevo registro de usuario",
    subject: "Nuevo registro de {{privateName}}",
    preview: "{{privateName}} acaba de registrarse",
    message: "Hay un nuevo usuario en {{appName}}",
    privateName: "Nombre privado",
    publicName: "Nombre público",
    email: "Correo electrónico",
    locale: "Idioma",
    creditBalance: "Saldo de créditos",
    leadCreditBalance: "Saldo de créditos del prospecto",
    signup_preferences: "Preferencias de inscripción",
    user_details: "Detalles del usuario",
    basic_information: "Información básica",
    signup_type: "Tipo de registro",
    direct_signup: "Registro directo",
    newsletter: "Boletín",
    subscribed: "Suscrito",
    not_subscribed: "No está suscrito",
    signup_details: "Detalles de la inscripción",
    signup_date: "Fecha de inscripción",
    user_id: "ID de usuario",
    recommended_next_steps: "Próximos pasos recomendados",
    direct_recommendation: "Revisar perfil de usuario y configuración de pago",
    contact_user: "Contactar al usuario",
    footer: "Notificación automática de {{appName}}",
  },
  email: {
    subject: "Ya tienes acceso a {{appName}}",
    previewText:
      "Hola, {{privateName}}. Tu cuenta está lista. Chatea con Claude, GPT, Gemini, DeepSeek y {{modelCount}} modelos más. Gratis y sin tarjeta.",
    headline: "Tu IA te espera.",
    greeting: "Hola, {{privateName}}:",
    intro:
      "Te damos la bienvenida a {{appName}}. Todo lo que te gusta de ChatGPT, más modelos de código abierto y modelos sin filtros de contenido. Una cuenta, un solo lugar.",
    models: {
      title: "{{modelCount}} modelos en 3 categorías",
      mainstream: "Convencional",
      open: "Código abierto",
      uncensored: "Sin censura",
    },
    free: {
      title: "Lo que recibes gratis, para siempre:",
      credits:
        "{{freeCreditsSignedIn}} créditos gratis al mes, más {{freeCreditsNewsletterBonus}} con el boletín. No necesitas tarjeta.",
      allModels: "Acceso a los {{modelCount}} modelos de IA",
      uncensored: "Modelos sin censura que sí responden a tus preguntas",
      chatModes: "Chats privados, de incógnito, compartidos y públicos",
      noCard: "Sin tarjeta de crédito. Nunca.",
    },
    verify: {
      note: "Tus créditos gratis se activan al confirmar esta dirección.",
      cta: "Confirma tu correo y recibe {{freeCreditsSignedIn}} créditos",
    },
    ctaButton: "Empieza a chatear",
    upgrade: {
      title: "¿Quieres más?",
      desc: "Los planes van desde {{subscriptionPrice}} al mes por {{subscriptionCredits}} créditos hasta {{ultraCredits}} créditos por {{ultraPrice}}. Con una suscripción, puedes recargar con paquetes de créditos que nunca vencen.",
      cta: "Ver los planes",
    },
    signoff: "Que disfrutes tus chats,\nEl equipo de {{appName}}",
    ps: "P. D. Usa el modo incógnito para guardar tus conversaciones solo en tu dispositivo. Nunca las guardamos en nuestros servidores. Los archivos multimedia generados se almacenan temporalmente por motivos técnicos.",
  },
  emailTemplates: {
    welcome: {
      name: "Correo de bienvenida tras el registro",
      description:
        "Correo electrónico de bienvenida enviado a los usuarios después del registro exitoso",
      category: "Autenticación",
      preview: {
        privateName: {
          label: "Nombre privado",
          description: "Nombre privado del usuario",
        },
        userId: {
          label: "ID de usuario",
          description: "El identificador único del usuario",
        },
        leadId: {
          label: "ID del contacto",
          description: "El identificador de prospecto del usuario",
        },
      },
    },
    adminSignup: {
      name: "Aviso de registro para admins",
      description:
        "Correo electrónico enviado a los administradores cuando un nuevo usuario se registra",
      category: "Administración",
      preview: {
        privateName: {
          label: "Nombre privado",
        },
        publicName: {
          label: "Nombre público",
        },
        email: {
          label: "Dirección de correo electrónico",
        },
        userId: {
          label: "ID de usuario",
        },
        subscribeToNewsletter: {
          label: "Suscripción",
        },
      },
    },
  },
};
