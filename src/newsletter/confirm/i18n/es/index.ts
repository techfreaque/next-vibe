import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Boletín",
  tags: {
    newsletter: "Boletín",
  },
  token: {
    label: "Código de confirmación",
    description: "El código del enlace en el correo de bienvenida",
    placeholder: "Pega el código que recibiste por correo",
  },
  response: {
    confirmed: "Confirmado",
    email: "Correo electrónico",
    bonusCredits: "Créditos de bonificación por mes",
  },
  post: {
    title: "Confirma tu correo para el boletín",
    titleShort: "Confirmar correo",
    description:
      "Confirme una dirección de boletín con el código del email de bienvenida. Desbloquea el bono mensual de crédito libre.",
    errors: {
      validation: {
        title: "Código inválido",
        description: "El código de confirmación está desaparecido o malformado",
      },
      notFound: {
        title: "Enlace vencido o inválido",
        description:
          "Este enlace de confirmación no es válido. Suscríbete de nuevo para recibir otro.",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes acceso",
      },
      internal: {
        title: "La confirmación falló",
        description:
          "Algo se rompió a nuestro lado. Prueba el enlace otra vez.",
      },
    },
    success: {
      title: "Correo confirmado",
      description: "Bono se aplica a su cuenta gratuita",
    },
  },
  widget: {
    heroTitle: "Un clic. +{{bonusCredits}} créditos cada mes.",
    heroDescription:
      "Confirma tu dirección. Si tienes una cuenta gratis, el bono se suma a tus créditos de inmediato.",
    confirmButton: "Confirmar mi correo",
    confirming: "Confirmando…",
    confirmedTitle:
      "Correo confirmado. +{{bonusCredits}} créditos al mes en tu cuenta gratis.",
    confirmedDescription:
      "¿Ya iniciaste sesión? El bono ya está en tu saldo gratis y se renueva cada mes mientras sigas suscrito. Si todavía no tienes una cuenta, regístrate gratis en este navegador para desbloquearlo.",
    startChatting: "Empieza a chatear",
  },
};
