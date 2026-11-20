import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Usuarios",
  title: "Bienvenido.",
  titleShort: "Iniciar sesión",
  description: "Acceda a modelos AI sin censura y su historia de conversación.",
  tag: "Autenticación",
  options: {
    category: "Usuarios",

    title: "Opciones de acceso",
    description: "Opciones de configuración",
    tag: "inicio de sesión-opciones",
    container: {
      title: "Configuración de inicio",
      description: "Configurar la configuración y las opciones de login",
    },
    fields: {
      email: {
        label: "Dirección de correo electrónico",
        description: "Introduzca su dirección de correo electrónico",
        placeholder: "your@email.com",
      },
      allowPasswordAuth: {
        label: "Permitir autenticación de contraseña",
        description: "Permitir la autentificación basada en contraseña",
      },
      allowSocialAuth: {
        label: "Permitir la autenticación social",
        description: "Activar la autenticación del proveedor social",
      },
      maxAttempts: {
        label: "Maximum Login Attempts",
        description: "Número máximo de intentos de inicio de sesión permitido",
      },
      requireTwoFactor: {
        label: "Requiere Autenticación de dos factores",
        description: "Consultar 2FA para el login del usuario",
      },
      socialProviders: {
        label: "Proveedores sociales",
        description: "Proveedores de autenticación social disponibles",
      },
      socialProvider: {
        title: "Proveedor social",
        description: "Configuración del proveedor de autenticación social",
        enabled: {
          label: "Enabled",
          description: "Si este proveedor está habilitado",
        },
        name: {
          label: "Nombre del proveedor",
          description: "Nombre del proveedor social",
        },
        providers: {
          label: "Opciones de proveedor",
          description: "Opciones de proveedores sociales disponibles",
        },
      },
    },
    response: {
      title: "Iniciar sesión Respuesta de opciones",
      description: "Opciones de configuración de acceso disponibles",
      success: {
        badge: "Operación completada",
      },
      message: {
        content: "Mensaje de Estado",
      },
      forUser: {
        content: "Dirección de correo electrónico",
      },
      loginMethods: {
        title: "Métodos de inicio de sesión",
        description: "Métodos de autenticación disponibles",
        password: {
          title: "Contraseña",
          description: "autenticación de contraseña estándar",
          enabled: {
            badge: "Enabled",
          },
        },
        social: {
          title: "Social Login",
          description: "Opciones de autenticación de redes sociales",
          enabled: {
            badge: "Enabled",
          },
          providers: {
            item: {
              title: "Proveedor social",
              description: "Proveedor de autenticación social",
            },
            name: {
              content: "Nombre del proveedor",
            },
            id: {
              content: "Proveedor ID",
            },
            enabled: {
              badge: "Disponible",
            },
            description: "Proveedor Descripción",
          },
        },
      },
      security: {
        title: "Ajustes de seguridad",
        description: "Necesidades de seguridad de autenticación",
        maxAttempts: {
          content: "Maximum Login Attempts",
        },
        requireTwoFactor: {
          badge: "2FA requerida",
        },
      },
      recommendations: {
        item: "Opción de inicio de sesión recomendada",
      },
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Parámetros de solicitud no válidos",
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
        description: "Los cambios no se salvaron",
      },
    },
    success: {
      title: "Operación completada",
      description: "Opciones de acceso recuperadas con éxito",
    },
    post: {
      title: "Opciones de acceso",
      description: "Obtenga opciones de acceso disponibles",
      response: {
        title: "Iniciar sesión Respuesta de opciones",
        description: "Opciones de configuración de acceso disponibles",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Parámetros de solicitud no válidos",
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
          description: "Ocurrió un error desconocido",
        },
      },
      success: {
        description: "Opciones de acceso recuperadas con éxito",
      },
    },
    enums: {
      socialProviders: {
        google: "Google",
        github: "GitHub",
        facebook: "Facebook",
      },
    },
    messages: {
      successMessage: "Opciones de acceso recuperadas con éxito",
      passwordAuthDescription:
        "Inicia sesión con tu correo electrónico y contraseña",
      socialAuthDescription:
        "La conexión social todavía no está disponible. Utilice correo electrónico y contraseña.",
      continueWithProvider: "Continuar con {{provider}}",
      twoFactorRequired: "Mayor seguridad: 2FA requerida",
      standardSecurity: "Necesidades de seguridad estándar",
      tryPasswordFirst: "Pruebe la contraseña primero",
      useSocialLogin: "Usar acceso social",
      socialLoginFaster: "Acceso social es más rápido para nuevos usuarios",
    },
  },
  actions: {
    submit: "Iniciar sesión",
    submitting: "Inicie sesión...",
  },
  fields: {
    email: {
      label: "Su correo electrónico",
      description: "El correo electrónico con el que se inscribió.",
      placeholder: "Ingresa tu correo",
      validation: {
        required: "El correo electrónico es necesario",
        invalid:
          "Por favor, introduzca una dirección de correo electrónico válida",
      },
    },
    password: {
      label: "Su contraseña",
      description:
        "Introduzca la contraseña que establezca durante el registro.",
      placeholder: "Introduzca su contraseña",
      help: "Introduzca su contraseña de cuenta",
      validation: {
        required: "Se requiere contraseña",
        minLength: "La contraseña debe tener al menos 8 caracteres de largo",
      },
    },
    twoFactorCode: {
      label: "Código de autenticación",
      description:
        "Utilice el código de aplicación o un código de recuperación.",
      placeholder: "Código de 6 dígitos",
    },
    rememberMe: {
      label: "Mantenme conectado.",
    },
  },
  twoFactorStep: {
    title: "Verificación de dos pasos",
    helper:
      "Introduzca el código de 6 dígitos de su aplicación de autenticador.",
    recoveryHelper:
      "Introduzca uno de sus códigos de recuperación. Cada uno trabaja una vez.",
    codeLabel: "Código de autenticación",
    recoveryLabel: "Código de recuperación",
    recoveryPlaceholder: "XXXXX-XXXXX",
    useRecovery: "Usar un código de recuperación",
    useApp: "Usar la aplicación de autenticación",
    verify: "Verificar",
    verifying: "Verificante...",
    back: "Atrás",
  },
  groups: {
    credentials: {
      title: "Login Credenciales",
      description: "Introduzca su información de inicio de sesión",
    },
    options: {
      title: "Opciones de acceso",
      description: "Preferencias y ajustes adicionales de login",
    },
    preferences: {
      title: "Preferencias",
      description: "Opciones de acceso adicionales",
    },
    advanced: {
      title: "Opciones avanzadas",
      description: "Ajustes de acceso avanzados",
    },
  },
  footer: {
    forgotPassword: "¿Olvidaste tu contraseña?",
    createAccount: "¿No tienes cuenta? Regístrate",
  },
  response: {
    title: "Iniciar sesión Respuesta",
    description: "Datos de respuesta",
    success: "Iniciaste sesión",
    message: "Mensaje de Estado",
    user: {
      title: "Detalles del usuario",
      description: "Logged en información de usuario",
      id: "Usuario ID",
      email: "Dirección de correo electrónico",
      firstName: "Nombre",
      lastName: "Apellido",
      privateName: "Nombre privado",
      publicName: "Nombre público",
      imageUrl: "Imagen del perfil",
    },
    sessionInfo: {
      title: "Sesión de información",
      description: "Detalles de la sesión de usuario",
      expiresAt: "Vencimiento de la sesión",
      rememberMeActive: "Estado de la opción para mantener la sesión",
      loginLocation: "Ubicación del inicio de sesión",
    },
    nextSteps: {
      title: "Siguientes pasos",
      item: "Siguientes pasos",
    },
  },
  errors: {
    title: "Iniciar sesión Error",
    account_suspended:
      "Cuenta suspendida. Si crees que hay un error, contacta a soporte.",
    account_locked:
      "Demasiados intentos fallidos. Espera 15 minutos o restablece tu contraseña. ¿Todavía no tienes una cuenta? Regístrate.",
    accountLocked: "Cuenta bloqueada",
    accountLockedDescription: "Tu cuenta está bloqueada. Contacta a soporte.",
    pendingEmail: "Confirma tu correo antes de iniciar sesión.",
    resendPending: "Reenviar el correo de confirmación",
    invalid_credentials:
      "Correo o contraseña incorrectos. ¿Todavía no tienes una cuenta? Regístrate.",
    two_factor_required: "Se requiere autenticación de dos factores",
    invalid_two_factor_code: "Código de autenticación inválida",
    auth_error: "Autenticación falló para {{email}} : {{error}}",
    user_not_found: "No se ha encontrado ningún usuario para {{userId}}",
    session_creation_failed:
      "No podía crear una sesión para {{userId}} : {{error}}",
    token_save_failed: "Fallado para salvar el token de autenticación",
    validation: {
      title: "Validación fallida",
      description: "Por favor, compruebe su entrada",
    },
    unauthorized: {
      title: "No pudimos iniciar sesión",
      description: "Credenciales inválidos",
    },
    unknown: {
      title: "Iniciar sesión Error",
      description: "Se produjo un error durante la sesión",
    },
    network: {
      title: "Error de red",
      description: "La conexión falló",
    },
    forbidden: {
      title: "Acceso denegado",
      description: "No se permite el acceso",
    },
    notFound: {
      title: "Usuario No encontrado",
      description: "Cuenta de usuario no encontrada",
    },
    unsaved: {
      title: "Cambios sin guardar",
      description: "Los cambios no se salvaron",
    },
    conflict: {
      title: "Conflicto",
      description: "Ingreso detectado",
    },
    server: {
      title: "Error del servidor",
      description: "Ocurrió un error interno del servidor",
    },
  },
  success: {
    title: "Iniciaste sesión",
    description: "Has estado conectado.",
    message: "¡Bienvenido! Has entrado con éxito.",
  },
  token: {
    save: {
      failed: "Fallado para salvar el token de autenticación",
      success: "Authentication token guardado con éxito",
    },
  },
  process: {
    failed: "El proceso de inicio de sesión falló",
  },
  enums: {
    socialProviders: {
      google: "Google",
      github: "GitHub",
      facebook: "Facebook",
    },
  },
  dev: {
    quickLogin: "Dev Quick Login",
  },
};
