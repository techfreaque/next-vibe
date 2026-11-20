import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Product category
  category: "Productos",

  // Enums
  enums: {
    productType: {
      service: "Servicio",
      physical: "Física",
      digital: "Digital",
    },
  },

  // Product summary (single source of truth)
  summary:
    "Puedes empezar gratis. Tienes {{freeCredits}} créditos al mes sin cuenta, {{freeCreditsSignedIn}} con una cuenta gratis y {{freeCreditsMax}} si también te suscribes al boletín. Hay cuatro planes mensuales: {{subCredits}} créditos por {{subPrice}}, {{plusCredits}} por {{plusPrice}}, {{proCredits}} por {{proPrice}} y {{ultraCredits}} por {{ultraPrice}}. Con una suscripción puedes recargar cuando quieras con paquetes de {{packCredits}} créditos por {{packPrice}} que nunca vencen.",

  // Free tier product
  free: {
    name: "Plan gratuito",
    description: "Empieza con créditos gratis. No necesitas tarjeta.",
  },

  // Subscription product
  subscription: {
    name: "Starter",
    description:
      "{{subCredits}} créditos al mes para usar con los {{modelCount}} modelos de IA",
    longDescription:
      "Suscripción mensual con {{subCredits}} créditos para los {{modelCount}} modelos de IA sin censura",
    price: "Precio de la suscripción mensual",
    cta: "Suscribirme",
    features: {
      credits: "{{subCredits}} créditos al mes",
      allModels: "Los {{modelCount}} modelos de IA",
      allFeatures: "Todas las funciones incluidas",
      cancel: "Cancela cuando quieras",
    },
  },

  // Higher subscription tiers (credits and prices come from config)
  subscriptionPlus: {
    name: "Plus",
  },
  subscriptionPro: {
    name: "Pro",
  },
  subscriptionUltra: {
    name: "Ultra",
  },

  // Credit pack product
  creditPack: {
    name: "Paquete de créditos",
    description: "Recarga tu plan. Los créditos nunca vencen.",
    longDescription:
      "¿Te quedan pocos créditos antes de renovar? Añade un paquete. Los créditos se suman a los de tu plan mensual y nunca vencen.",
    features: {
      credits: "{{packCredits}} créditos por paquete",
      allModels: "Incluye los {{modelCount}} modelos de IA",
      allFeatures: "Todas las funciones incluidas",
      multiple: "Compra varios paquetes",
      permanent: "Los créditos nunca vencen",
    },
  },

  // Large credit pack: retired, no longer sold. Shown only on past purchases.
  creditPackLarge: {
    name: "Paquete grande de créditos (retirado)",
    description:
      "Ya no está a la venta. Los créditos que compraste siguen vigentes.",
  },
};
