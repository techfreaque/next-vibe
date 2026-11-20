import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Perfil de usuario",

  title: "Cambiar contraseña",
  titleShort: "Cambiar contraseña",
  description: "Confirme su contraseña actual, luego establezca una nueva.",
  tag: "cambio de contraseña",
  debug: {
    updatingPassword: "Actualizar contraseña",
    errorUpdatingPassword: "Actualización de contraseña",
    settingPassword: "Configuración de contraseña",
    errorSettingPassword: "Configuración de errores",
  },
  groups: {
    currentCredentials: {
      title: "Contraseña actual",
      description: "Verifique su contraseña actual para proceder",
    },
    newCredentials: {
      title: "Nueva contraseña",
      description: "Elige una nueva contraseña fuerte para tu cuenta",
    },
  },
  currentPassword: {
    label: "Contraseña actual",
    description: "Introduzca su contraseña actual",
    placeholder: "Su contraseña actual",
    help: "Introduzca su contraseña actual para verificar su identidad antes de cambiarla",
  },
  newPassword: {
    label: "Nueva contraseña",
    description: "Al menos 8 caracteres.",
    placeholder: "Al menos 8 caracteres",
    help: "Elija una contraseña fuerte con al menos 8 caracteres incluyendo letras, números y símbolos",
  },
  confirmPassword: {
    label: "Repetir nueva contraseña",
    description: "Confirme su nueva contraseña",
    placeholder: "Escribe otra vez.",
    help: "Reintroducir su nueva contraseña para asegurarse de que fue escrito correctamente",
  },
  twoFactorCode: {
    label: "Código de dos factores",
    description:
      "Introduzca su código de autenticación de dos factores si está habilitado",
    placeholder: "Ingrese el código 2FA",
  },
  response: {
    title: "Respuesta del cambio de contraseña",
    description: "Respuesta a la operación de cambio de contraseña",
    success: "Password Changed",
    message: "Mensaje de Estado",
    securityTip: "Tip de seguridad",
    nextSteps: {
      item: "Siguientes pasos",
    },
  },
  validation: {
    currentPassword: {
      minLength: "La contraseña actual debe ser por lo menos 8 caracteres",
    },
    newPassword: {
      minLength: "Nueva contraseña debe ser por lo menos 8 caracteres",
    },
    confirmPassword: {
      minLength:
        "La confirmación de la contraseña debe ser por lo menos 8 caracteres",
    },
    passwords: {
      mismatch: "Las contraseñas no coinciden",
    },
  },
  errors: {
    passwords_do_not_match: "Las contraseñas no coinciden",
    user_not_found: "Usuario {{userId}} no encontrado",
    incorrect_password: "Contraseña incorrecta",
    update_failed: "No actualizado la contraseña",
    token_creation_failed: "Fallado para crear ficha de contraseña",
    two_factor_code_required:
      "Código de autenticación de dos factores requerido",
    invalid_two_factor_code: "Código de autenticación inválido de dos factores",
    invalid_request: {
      title: "Solicitud inválida",
      description: "La solicitud de cambio de contraseña es nula",
    },
    validation: {
      title: "Error de validación",
      description: "Por favor, compruebe su entrada e inténtelo de nuevo",
    },
    unauthorized: {
      title: "Se requiere autenticación",
      description: "Debes iniciar sesión para cambiar tu contraseña",
    },
    server: {
      title: "Error del servidor",
      description:
        "Fallado para actualizar la contraseña debido al error del servidor",
    },
    unknown: {
      title: "Error desconocido",
      description: "Se produjo un error inesperado al actualizar la contraseña",
    },
    network: {
      title: "Error de red",
      description: "La conexión de red falló",
    },
    forbidden: {
      title: "Access Forbidden",
      description: "Usted no tiene permiso para realizar esta acción",
    },
    notFound: {
      title: "Usuario No encontrado",
      description: "No se pudo encontrar la cuenta de usuario",
    },
    unsavedChanges: {
      title: "Cambios sin guardar",
      description: "Tienes cambios sin salvar que se perderán",
    },
    conflict: {
      title: "Conflicto de datos",
      description: "Se produjo un conflicto al actualizar la contraseña",
    },
  },
  success: {
    updated: "Contraseña actualizada con éxito",
    securityTip:
      "Para mejorar la seguridad, permita la autenticación de dos factores",
    nextSteps: {
      logoutOther:
        "Cada otra sesión está firmada. Usa la nueva contraseña la próxima vez.",
      enable2fa:
        "Considere la posibilidad de habilitar la autenticación de dos factores para una mejor seguridad",
    },
    title: "Contraseña actualizada",
    description: "Su contraseña ha sido actualizada con éxito",
  },
  update: {
    success: {
      title: "Contraseña Actualizada",
      description: "Su contraseña ha sido actualizada con éxito",
    },
    errors: {
      unknown: {
        title: "Error desconocido",
        description:
          "Se produjo un error inesperado al actualizar la contraseña",
      },
    },
  },
  widget: {
    back: "Atrás",
    submit: "Actualizar contraseña",
    submitting: "Actualizando...",
  },
};
