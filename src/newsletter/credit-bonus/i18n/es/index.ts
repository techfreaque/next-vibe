import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Boletín",
  tags: {
    newsletter: "Boletín",
    credits: "Créditos",
  },
  enum: {
    offer: {
      available: "Disponible",
      pendingConfirmation: "Esperando la confirmación del correo electrónico",
      active: "Bono activo",
      notEligible: "No disponible",
    },
  },
  response: {
    offer: "Bono de bonificación",
    email: "Correo electrónico de la cuenta",
    bonusCredits: "Créditos de bonificación por mes",
    freeRefillAt: "Créditos gratis recargan encendido",
  },
  get: {
    title: "Bono de crédito",
    titleShort: "Bono de bonificación",
    description:
      "Si su cuenta todavía puede obtener el bono mensual de crédito de boletín de noticias. Cuentas solamente.",
  },
  post: {
    title: "Bono de crédito del boletín de reclamaciones",
    titleShort: "Boletín de noticias sobre reclamaciones",
    description:
      "Suscribir su cuenta de correo electrónico a la newsletter para créditos extra gratis cada mes. Cuentas solamente, una vez por cuenta.",
  },
  errors: {
    validation: {
      title: "Solicitud inválida",
      description: "La solicitud no puede tramitarse",
    },
    unauthorized: {
      title: "Cuenta necesaria",
      description:
        "Necesitas una cuenta para recibir el bono del boletín. Regístrate gratis o inicia sesión.",
    },
    forbidden: {
      title: "Operación no permitida",
      description: "Usted no puede reclamar este bono",
    },
    notFound: {
      title: "Cuenta no encontrada",
      description: "No pudimos encontrar su cuenta.",
    },
    internal: {
      title: "Algo rompió.",
      description:
        "No podía revisar el bono de la newsletter. Inténtalo de nuevo.",
    },
  },
  success: {
    title: "Listo",
    description: "Boletín de bonificación estado cargado",
  },
  widget: {
    available: "+{{bonusCredits}} créditos gratis cada mes",
    availableHint:
      "Suscribe {{email}} al boletín. Primero te enviaremos un enlace de confirmación.",
    claim: "Recibe +{{bonusCredits}} créditos al mes",
    pending:
      "Revisa el correo de {{email}}. Abre el enlace de confirmación para desbloquear +{{bonusCredits}} créditos al mes.",
    active: "Bono del boletín activo: +{{bonusCredits}} créditos al mes.",
    notEligible: "Bono de bonificación no disponible para esta cuenta.",
    refill: "Los créditos gratis se renuevan el {{date}}.",
  },
};
