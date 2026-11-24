import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  heading: "Suscríbete a la newsletter",
  subheadingPublic: "Nuevos modelos sin censura, gotas de producto, no spam.",
  subheadingLoggedIn: "Nuevos modelos sin censura, gotas de producto, no spam.",
  bonusGuest:
    "Cuenta gratuita: créditos {{freeCreditsSignedIn}} al mes, {{freeCreditsMax}} con el boletín informativo.",
  bonusGuestLink: "Regístrate gratis",
  bonusAccount:
    "Confirme su correo electrónico: + {{bonusCredits}} créditos gratuitos, {{freeCreditsMax}} al mes en total.",
  emailPlaceholder: "you@example.com",
  invalidEmail: "Introduce una dirección de correo electrónico válida.",
  subscribe: "Suscribirme",
  alreadyIn: "Estás en la lista. Cuidado con la bandeja de entrada.",
  success: "Ya casi. Comprueba tu buzón para confirmarlo.",
  error: "Eso no pasó. Inténtalo de nuevo.",
  privacy: "Un clic para darse de baja, en cualquier momento.",
  loggedInHint: "Lo enviaremos a su correo electrónico de cuenta.",
  pending: {
    title: "Compruebe su bandeja de entrada para confirmar",
    bodyWithEmail: "El enlace de confirmación fue a {{email}}.",
    body: "El enlace de confirmación está en su buzón de entrada.",
    bonus: "Un clic desbloquea + créditos gratis {{bonusCredits}} al mes.",
    resend: "Reenviar el correo electrónico",
    resending: "Enviando…",
    resent: "Enviado. Chequee el spam también si no aparece.",
  },
  subscribedNotice: {
    title: "Estás suscrito.",
    bonus:
      "+ {{bonusCredits}} créditos gratis al mes están en directo en su cuenta.",
    body: "Nuevos modelos y gotas de productos aterrizan en su buzón de entrada.",
    manage: "Gestionar o darse de baja",
  },
};
