import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Usuarios",

  title: "Opciones de acceso",
  titleShort: "Opciones de acceso",
  description: "Opciones de configuración",
  tag: "inicio de sesión-opciones",
  container: {
    title: "Configuración de inicio",
    description: "Configurar la configuración y las opciones de login",
  },
  fields: {
    email: {
      label: "Dirección de correo electrónico",
      description: "Introduce tu correo",
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
    socialAuthDescription: "Inicie sesión con sus cuentas de redes sociales",
    continueWithProvider: "Continuar con {{provider}}",
    twoFactorRequired: "Mayor seguridad: 2FA requerida",
    standardSecurity: "Necesidades de seguridad estándar",
    tryPasswordFirst: "Pruebe la contraseña primero",
    useSocialLogin: "Usar acceso social",
    socialLoginFaster: "Acceso social es más rápido para nuevos usuarios",
  },
};
