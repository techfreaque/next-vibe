import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Usuarios",
  title: "Reset Password Request",
  description: "Solicitar contraseña reset",
  tag: "Restablecimiento de contraseña",
  ui: {
    title: "Restablecer su contraseña",
    subtitle:
      "Introduzca su dirección de correo electrónico y le enviaremos un enlace para restablecer su contraseña",
    sendResetLink: "Enviar enlace de reiniciamiento",
    alreadyHaveAccount: "¿Ya tienes una cuenta? Inicia sesión",
  },
  actions: {
    submitting: "Enviando…",
  },
  email: {
    title: "Restablece tu contraseña de {{appName}}",
    subject: "Solicitud para restablecer tu contraseña de {{appName}}",
    previewText:
      "Restablece tu contraseña de {{appName}}. El enlace es válido por {{hours}} horas.",
    greeting: "Hola, {{name}}:",
    requestInfo:
      "Recibimos una solicitud para restablecer la contraseña de tu cuenta de {{appName}}. Si la enviaste tú, usa el botón de abajo.",
    buttonText: "Restablecer mi contraseña",
    expirationInfo:
      "El enlace vence en {{hours}} horas. Si no hiciste la solicitud, ignora este correo. Tu contraseña sigue siendo la misma.",
    signoff: "El equipo de {{appName}}",
    promoText: "{{modelCount}} modelos de IA. Sin filtros. Sin sermones.",
  },
  groups: {
    emailInput: {
      title: "Dirección de correo",
      description:
        "Introduzca su dirección de correo electrónico para recibir instrucciones de reseteo",
    },
  },
  fields: {
    email: {
      label: "Dirección de correo electrónico",
      description: "Introduzca su dirección de correo electrónico",
      placeholder: "your@email.com",
      help: "Introduzca la dirección de correo electrónico asociada a su cuenta",
      validation: {
        invalid:
          "Por favor, introduzca una dirección de correo electrónico válida",
      },
    },
  },
  response: {
    title: "Reiniciar solicitud de respuesta",
    description: "Respuesta de solicitud de reajuste de contraseña",
    success: {
      message: "Enlace de restablecimiento enviado",
    },
    deliveryInfo: {
      estimatedTime: "dentro de 5 minutos",
      expiresAt: "4 horas desde ahora",
    },
    nextSteps: {
      checkEmail:
        "Compruebe su correo electrónico de la bandeja de entrada y la carpeta de spam",
      clickLink: "Haga clic en el enlace de reseteo en el correo electrónico",
      createPassword: "Crear una nueva contraseña segura",
    },
  },
  errors: {
    title: "Error",
    validation: {
      title: "Error de validación",
      description: "Invalide input provided",
    },
    unauthorized: {
      title: "Se requiere autenticación",
      description: "Solicitud no autorizada",
    },
    internal: {
      title: "Error interno",
      description: "Error del servidor interno",
    },
    unknown: {
      title: "Error desconocido",
      description: "Ocurrió un error desconocido",
    },
    network: {
      title: "Error de red",
      description: "Error de conexión de red",
    },
    forbidden: {
      title: "Acceso denegado",
      description: "No tienes acceso",
    },
    notFound: {
      title: "No encontrado",
      description: "No se encontró el recurso",
    },
    unsaved: {
      title: "Cambios sin guardar",
      description: "Los cambios no se salvaron",
    },
    conflict: {
      title: "Conflicto",
      description: "Hay un conflicto entre los datos",
    },
    no_email: "No se ha encontrado ninguna cuenta para {{email}}",
    email_generation_failed:
      "No se pudo construir el correo electrónico de reset para {{email}} : {{errorMessage}}",
  },
  success: {
    title: "Solicitud enviada",
    description: "Enviamos la solicitud para restablecer tu contraseña",
  },
  post: {
    title: "Solicitud",
    description: "Solicitud de punto final",
    form: {
      title: "Solicitud de configuración",
      description: "Configurar los parámetros de solicitud",
    },
    response: {
      title: "Respuesta",
      description: "Solicitar datos de respuesta",
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
  emailTemplates: {
    request: {
      name: "Correo para restablecer la contraseña",
      description:
        "Correo electrónico enviado a los usuarios con un enlace para restablecer su contraseña",
      category: "Autenticación",
      preview: {
        publicName: {
          label: "Nombre público",
          description: "Nombre de la pantalla pública del usuario",
        },
        userId: {
          label: "Usuario ID",
          description: "El identificador único del usuario",
        },
        passwordResetUrl: {
          label: "Password Reset URL",
          description: "El URL para restablecer la contraseña",
        },
      },
    },
  },
};
