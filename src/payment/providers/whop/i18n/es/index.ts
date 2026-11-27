import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    notConfigured: "El pago con tarjeta vía Whop aún no está configurado.",
    productNotFound:
      "Este producto no se puede comprar con tarjeta ahora mismo.",
    userNotFound: "Cuenta no encontrada.",
    checkoutFailed: "No se pudo abrir el pago con tarjeta: {{error}}",
    webhookInvalidSignature: "La firma del webhook de Whop no es válida.",
    webhookInvalidPayload: "No se pudo leer el webhook de Whop: {{error}}",
    membershipFailed: "No se pudo cargar la membresía de Whop: {{error}}",
    cancelFailed: "No se pudo cancelar la membresía de Whop: {{error}}",
    catalogFailed: "No se pudo sincronizar el catálogo de Whop: {{error}}",
  },
};
