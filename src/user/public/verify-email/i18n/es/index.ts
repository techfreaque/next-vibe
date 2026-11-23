import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Cuenta",
  title: "Verifica tu correo",
  titleShort: "Verificar correo",
  description:
    "Confirma tu correo con el enlace que te enviamos. Llama sin token para reenviar el enlace.",
  tag: "check-email",
  token: {
    label: "Token de verificación",
    description:
      "Viene en el enlace de tu correo de verificación. Déjalo vacío para reenviar el correo.",
    placeholder: "Token del correo",
  },
  response: {
    verified: "Verificado",
    message: "Estado",
    email: "Correo electrónico",
    emailChanged: "Correo electrónico cambiado",
  },
  widget: {
    heroTitle: "Confirma tu correo",
    heroDescription: "Verifica tu dirección con un clic.",
    confirmButton: "Verificar mi correo",
    confirming: "Verificando…",
    doneTitle: "Correo verificado",
    doneDescription: "Tu dirección está confirmada. Ya puedes continuar.",
    resend: "Enviarme otro enlace",
    continue: "Continuar",
    changedTitle: "Correo electrónico cambiado",
    changedDescription:
      "Ahora puedes iniciar sesión con {{email}}. La dirección anterior dejó de usarse.",
  },
  creditsPrompt: {
    title: "Confirma tu correo para desbloquear tus créditos gratis",
    description:
      "Abre el enlace que te enviamos por correo y recibe {{credits}} créditos gratis cada mes.",
    resend: "Reenviar enlace",
    sending: "Enviando…",
    sent: "Enviamos el enlace a {{email}}. Revisa también el correo no deseado.",
  },
  email: {
    subject: "Desbloquea tus {{credits}} créditos gratis en {{appName}}",
    title: "Confirma tu correo",
    previewText:
      "Con un clic confirmas tu dirección y activas tus créditos gratis.",
    greeting: "Hola, {{name}}:",
    body: "Tu cuenta está lista. Confirma esta dirección y recibe {{credits}} créditos gratis cada mes. No necesitas tarjeta.",
    newsletter:
      "Con ese mismo clic confirmas tu suscripción al boletín. Recibirás {{credits}} créditos gratis adicionales cada mes mientras sigas suscrito.",
    button: "Confirmar y desbloquear créditos",
    reminder: {
      subject: "Tus {{credits}} créditos gratis siguen pendientes",
      previewText: "Haz clic en el enlace para activarlos.",
      body: "Creaste tu cuenta de {{appName}} ayer. Solo falta confirmar tu dirección para activar tus {{credits}} créditos gratis al mes. Basta con un clic.",
    },
    expiry:
      "El enlace es válido por {{days}} días. Si no creaste una cuenta, ignora este correo.",
    signoff: "El equipo de {{appName}}",
  },
  emailTemplates: {
    name: "Verificación de correo electrónico",
    description:
      "Enviado después del registro y a petición de verificar el correo electrónico de la cuenta",
    category: "Cuenta",
  },
  errors: {
    emailTaken:
      "Otra cuenta ya usa esta dirección. Tu correo sigue siendo el mismo.",
    invalidToken:
      "El enlace de verificación no es válido o ya venció. Solicita otro en Configuración.",
    userNotFound: "No encontramos la cuenta.",
    failed: "No pudimos verificar el correo.",
    needLogin: "Inicia sesión para reenviar el correo de verificación.",
    validation: {
      title: "Error de validación",
      description: "Comprueba tu entrada e intenta de nuevo",
    },
    unauthorized: {
      title: "Se requiere autenticación",
      description: "Inicia sesión para reenviar el correo de verificación",
    },
    server: {
      title: "Error del servidor",
      description: "La verificación falló debido a un error del servidor",
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
    title: "Listo",
    description: "Verificación de correo electrónico actualizada",
    verified: "Tu correo está verificado.",
    alreadyVerified: "Tu correo ya está verificado.",
    emailChanged: "Listo. Ahora tu correo es {{email}}.",
    sent: "Enviamos el correo de verificación. Revisa tu bandeja de entrada.",
  },
};
