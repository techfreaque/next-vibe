import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Perfil de usuario",
  title: "autenticación de dos factores",
  titleShort: "Dos factores",
  description:
    "Protege tu cuenta con un código de una sola vez de una aplicación de autenticador. Configurar, desactivar o regenerar códigos de recuperación.",
  tag: "2-factor",
  enums: {
    action: {
      status: "Situación",
      setup: "Configuración de inicio",
      enable: "Confirmación y habilitación",
      disable: "Inhabilitación",
      regenerate: "Códigos de recuperación regenerados",
    },
  },
  fields: {
    action: {
      label: "Medida",
      description:
        "estado, configuración, habilitar, desactivar o regenerar. La configuración devuelve un secreto, y luego permite confirmarlo con un código.",
    },
    code: {
      label: "Código de autenticación",
      description:
        "Código de 6 dígitos de su aplicación autenticador, o código de recuperación.",
      placeholder: "123456",
    },
    password: {
      label: "Contraseña",
      description:
        "Su contraseña de cuenta (alternativa a un código para desactivar).",
      placeholder: "Su contraseña",
    },
  },
  response: {
    enabled: "Dos factores habilitados",
    message: "Situación",
    recoveryCodesRemaining: "Códigos de recuperación dejados",
    otpauthUri: "Authenticator URI",
    secret: "Clave secreta",
    qrDataUri: "Código QR",
    recoveryCodes: "Códigos de recuperación",
  },
  widget: {
    back: "Atrás",
    statusOn: "Activados",
    statusOff: "Desactivados",
    offIntro:
      "Agregue un segundo paso para entrar. Incluso con su contraseña, nadie entra sin el código de su teléfono.",
    startSetup: "Configuración de dos factores",
    setupStep1:
      "1. Escríbete este código QR con una aplicación de autenticador (Google Authenticator, Aegis, 1Password, Authy).",
    setupStep2: "¿No puedes escanear? Introduzca esta clave manualmente:",
    setupStep3:
      "2. Introduzca el código de 6 dígitos que la aplicación muestra para confirmar.",
    confirm: "Confirme y encienda",
    confirming: "Confirmando…",
    cancelSetup: "Cancelar",
    onIntro:
      "Sign-in pide un código de tu app de autenticador. Códigos de recuperación izquierda: {{count}}.",
    recoveryTitle: "Guarda tus códigos de recuperación",
    recoveryHint:
      "Cada código funciona una vez si pierdes el teléfono. Se muestran sólo ahora. Guárdalos en algún lugar seguro.",
    recoveryCopy: "Copiar códigos",
    recoveryCopied: "Copiado",
    recoveryDone: "Los salvé.",
    manageTitle: "Gestionar",
    manageHint:
      "Introduzca un código de autenticador actual (o un código de recuperación) para cambiar la configuración.",
    regenerate: "Códigos de recuperación regenerados",
    disable: "Apaga dos factores",
    disablePasswordHint: "O confirmar con su contraseña en su lugar:",
    working: "Trabajando...",
  },
  errors: {
    notConfigured:
      "Dos factores necesita una clave de servidor (JWT_SECRET_KEY) y no está establecido.",
    alreadyEnabled:
      "Dos factores ya están habilitados. Deshágala primero para re-correr la configuración.",
    notEnabled: "Dos factores no están habilitados.",
    noPendingSetup:
      "No hay ninguna configuración en curso. Comienza a configurar primero.",
    codeRequired: "Introduzca el código de 6 dígitos.",
    invalidCode:
      "Ese código no es válido. Compruebe la hora en su teléfono e inténtelo de nuevo.",
    credentialRequired:
      "Introduzca un código actual, un código de recuperación o su contraseña.",
    invalidPassword: "La contraseña es incorrecta.",
    tooManyAttempts:
      "Demasiados intentos equivocados. Espera unos minutos y vuelve a intentarlo.",
    userNotFound: "No encontramos la cuenta.",
    failed: "No podía actualizar la configuración de dos factores.",
    validation: {
      title: "Error de validación",
      description: "Comprueba tu entrada e intenta de nuevo",
    },
    unauthorized: {
      title: "Se requiere autenticación",
      description: "Debes estar conectado para administrar dos factores",
    },
    server: {
      title: "Error del servidor",
      description: "No se puede actualizar dos factores",
    },
    unknown: {
      title: "Error desconocido",
      description: "Ocurrió un error inesperado",
    },
    network: {
      title: "Error de red",
      description: "La conexión de red falló",
    },
    forbidden: {
      title: "No tienes acceso",
      description: "No tienes permiso para hacer esto.",
    },
    notFound: {
      title: "Cuenta o sesión no encontradas",
      description: "No se puede encontrar una cuenta",
    },
    unsavedChanges: {
      title: "Cambios sin guardar",
      description: "Tienes cambios sin guardar",
    },
    conflict: {
      title: "Conflicto",
      description: "Se produjo un conflicto",
    },
  },
  success: {
    title: "Actualización de dos factores",
    description: "Tu configuración de dos factores se guardaron",
    status: "Estado de dos factores cargado.",
    setupStarted:
      "Escríbete el código QR, y luego confirma con un código para encenderlo.",
    enabled:
      "Dos-factores están encendidas. Guarde sus códigos de recuperación ahora - se muestran sólo una vez.",
    disabled: "Dos-factores están apagados.",
    regenerated:
      "Nuevos códigos de recuperación generados. Los viejos ya no funcionan.",
  },
};
