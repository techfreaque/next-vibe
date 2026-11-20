import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Usuarios",

  title: "Confirma el cambio de contraseña",
  description:
    "Confirme el restablecimiento de su contraseña con una nueva contraseña",
  tag: "Restablecimiento de contraseña",
  email: {
    title: "Contraseña restablecida",
    subject: "Contraseña restablecida en {{appName}}",
    previewText:
      "Restableciste tu contraseña de {{appName}}. Inicia sesión para chatear con {{modelCount}} modelos de IA.",
    greeting: "Hola, {{name}}:",
    successMessage:
      "Ya puedes iniciar sesión con tu nueva contraseña y seguir donde lo dejaste.",
    loginButton: "Iniciar sesión en {{appName}}",
    promoText: "{{modelCount}} modelos de IA. Sin filtros. Sin sermones.",
    securityWarning:
      "¿No pediste cambiar tu contraseña? Contacta a soporte de inmediato. Tu cuenta podría estar en riesgo.",
  },
  groups: {
    verification: {
      title: "Verificación",
      description: "Verifique su solicitud de restablecimiento de contraseña",
    },
    newPassword: {
      title: "Nueva contraseña",
      description: "Configura tu nueva contraseña",
    },
  },
  fields: {
    token: {
      label: "Reset Token",
      description:
        "El token de la contraseña se reinicia desde su correo electrónico",
      placeholder: "Introducir reinicio token",
      help: "Compruebe su correo electrónico para la contraseña reiniciar ficha e ingrese aquí",
      validation: {
        required: "Reiniciar ficha es necesario",
      },
    },
    email: {
      label: "Dirección de correo electrónico",
      description: "Su dirección de correo electrónico",
      placeholder: "Introduzca su dirección de correo electrónico",
      validation: {
        invalid:
          "Por favor, introduzca una dirección de correo electrónico válida",
      },
    },
    password: {
      label: "Nueva contraseña",
      description: "Su nueva contraseña",
      placeholder: "Ingrese nueva contraseña",
      help: "Elija una contraseña fuerte con al menos 8 caracteres incluyendo letras, números y símbolos",
      validation: {
        minLength: "La contraseña debe tener al menos 8 caracteres de largo",
      },
    },
    confirmPassword: {
      label: "Confirmar contraseña",
      description: "Confirme su nueva contraseña",
      placeholder: "Confirme nueva contraseña",
      validation: {
        minLength: "La contraseña debe tener al menos 8 caracteres de largo",
      },
    },
  },
  validation: {
    passwords: {
      mismatch: "Las contraseñas no coinciden",
    },
  },
  response: {
    title: "Respuesta del restablecimiento de contraseñas",
    description: "Contraseña reajuste de confirmación respuesta",
    message: {
      label: "Mensaje",
      description: "Mensaje de respuesta",
    },
    securityTip:
      "Considere la posibilidad de habilitar la autenticación de dos factores para una mejor seguridad",
    nextSteps: [
      "Inicia sesión con tu nueva contraseña",
      "Actualizar contraseñas guardadas en su navegador",
      "Considerar la posibilidad de habilitar 2FA para una mayor seguridad",
    ],
  },
  errors: {
    title: "Error de reiniciamiento de contraseña",
    no_email:
      "No se encontró ninguna cuenta con esa dirección de correo electrónico",
    validation: {
      title: "Error de validación",
      description: "Por favor, compruebe su entrada e inténtelo de nuevo",
      passwordsDoNotMatch: "Las contraseñas no coinciden",
    },
    unauthorized: {
      title: "Se requiere autenticación",
      description: "Token de reajuste inválido o vencido",
    },
    internal: {
      title: "Error del servidor",
      description: "Se produjo un error de servidor interno",
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
      description: "Usted no tiene permiso para realizar esta acción",
    },
    notFound: {
      title: "No encontrado",
      description: "Reiniciar la ficha no encontrada o caducada",
    },
    unsaved: {
      title: "Cambios sin guardar",
      description: "Hay cambios sin salvar",
    },
    conflict: {
      title: "Conflicto",
      description: "Un conflicto ocurrió mientras procesaba su solicitud",
    },
  },
  success: {
    title: "Contraseña restablecida",
    description: "Su contraseña ha sido restaurada con éxito",
    message: "La contraseña se ha restaurado con éxito",
    password_reset: "Su contraseña ha sido restaurada con éxito",
  },
  actions: {
    requestNewLink: "Solicitar un nuevo vínculo de reiniciamiento",
  },
  emailTemplates: {
    confirm: {
      name: "Correo de confirmación de cambio de contraseña",
      description:
        "Correo electrónico enviado a los usuarios después de que su contraseña se haya restaurado con éxito",
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
      },
    },
  },
};
