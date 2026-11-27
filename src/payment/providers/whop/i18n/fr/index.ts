import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    notConfigured: "Le paiement par carte via Whop n'est pas encore configuré.",
    productNotFound:
      "Ce produit ne peut pas être acheté par carte pour le moment.",
    userNotFound: "Compte introuvable.",
    checkoutFailed: "Impossible d'ouvrir le paiement par carte : {{error}}",
    webhookInvalidSignature: "La signature du webhook Whop est invalide.",
    webhookInvalidPayload: "Impossible de lire le webhook Whop : {{error}}",
    membershipFailed: "Impossible de charger l'abonnement Whop : {{error}}",
    cancelFailed: "Impossible d'annuler l'abonnement Whop : {{error}}",
    catalogFailed: "Impossible de synchroniser le catalogue Whop : {{error}}",
  },
};
