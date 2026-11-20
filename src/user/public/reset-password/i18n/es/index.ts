import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  confirm: {
    category: "Usuarios",

    title: "Confirma el cambio de contraseña",
    titleShort: "Confirmar restablecimiento",
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
  },
  request: {
    category: "Usuarios",
    title: "Reset Password Request",
    titleShort: "Restablecer contraseña",
    description: "Solicitar contraseña reset",
    tag: "Restablecimiento de contraseña",
    ui: {
      title: "Restablece tu contraseña",
      subtitle:
        "Ingresa tu correo electrónico. Te enviaremos un enlace para restablecer tu contraseña.",
      sendResetLink: "Enviar enlace de restablecimiento",
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
        label: "Correo electrónico",
        description: "Introduzca su dirección de correo electrónico",
        placeholder: "you@example.com",
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
      no_email:
        "No se encontró ninguna cuenta con esa dirección de correo electrónico",
      email_generation_failed: "Failed para generar correo electrónico",
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
  },
  validate: {
    category: "Usuarios",

    title: "Validar Reiniciar contraseña Token",
    titleShort: "Validar Token",
    description: "Validar contraseña restablecer el punto final token",
    tag: "Reiniciar la validación",
    groups: {
      tokenInput: {
        title: "Validación por token",
        description:
          "Introduzca el token de reinicio de contraseña para validar",
      },
    },
    fields: {
      token: {
        label: "Reset Token",
        description:
          "restablecimiento de contraseña token desde el correo electrónico",
        placeholder: "Introducir reinicio token",
        help: "Introduzca la ficha que recibió en su correo electrónico",
        validation: {
          required: "Reiniciar ficha es necesario",
        },
      },
    },
    response: {
      title: "Resultado de validación",
      description: "Respuesta a la validación token",
      valid: "Token Valid",
      message: "Mensaje de validación",
      validationMessage: "Reiniciar la validación de token completado",
      userId: "Usuario ID",
      expiresAt: "Expires Token At",
      nextSteps: {
        item: "Siguientes pasos después de la validación",
        setPassword: "Procede para establecer su nueva contraseña",
        choosePassword: "Elija una contraseña fuerte y única",
      },
    },
    errors: {
      title: "Error",
      validation: {
        title: "Error de validación",
        description: "Falló la validación de tokens",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Token inválido o caducado",
      },
      internal: {
        title: "Error interno",
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
        description: "Token no encontró",
      },
      unsaved: {
        title: "Cambios sin guardar",
        description: "Se detectaron cambios no observados",
      },
      conflict: {
        title: "Conflicto",
        description: "Hay un conflicto entre los datos",
      },
    },
    success: {
      title: "Token Valid",
      description: "restablecimiento de contraseña token es válido",
    },
    post: {
      title: "Validación",
      description: "Punto final validado",
      form: {
        title: "Configuración validada",
        description: "Configurar parámetros validados",
      },
      response: {
        title: "Respuesta",
        description: "Datos de respuesta validados",
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
  actions: {
    back: "Atrás",
    submit: "Enviar",
    submitting: "Enviando...",
  },
  success: {
    password_reset: "Su contraseña se ha restaurado con éxito.",
  },
  errors: {
    tokenValidationFailed: "Falló la validación de tokens",
    userLookupFailed: "Failed to lookup user",
    tokenDeletionFailed: "Fallado para borrar token",
    userDeletionFailed: "Fallado para borrar usuario",
    resetFailed: "No pudimos restablecer la contraseña",
    tokenCreationFailed: "Fallado para crear el token de reset",
    noDataReturned: "La base de datos no devolvió datos",
    tokenInvalid: "Reiniciar la ficha es inválida",
    tokenExpired: "Reiniciar la ficha ha expirado",
    tokenVerificationFailed: "Falló la verificación",
    userNotFound: "Usuario no encontrado",
    passwordUpdateFailed: "No actualizado la contraseña",
    passwordResetFailed: "No pudimos restablecer la contraseña",
    requestFailed: "Falló la solicitud de reasentamiento",
    emailMismatch: "El correo electrónico no coincide",
    confirmationFailed: "Confirmación de reajuste de contraseña falló",
  },
};
