import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    notConfigured: "Kartenzahlung über Whop ist noch nicht eingerichtet.",
    productNotFound: "Dieses Produkt ist gerade nicht per Karte kaufbar.",
    userNotFound: "Konto nicht gefunden.",
    checkoutFailed: "Kartenzahlung konnte nicht geöffnet werden: {{error}}",
    webhookInvalidSignature: "Signatur des Whop-Webhooks ist ungültig.",
    webhookInvalidPayload:
      "Whop-Webhook konnte nicht gelesen werden: {{error}}",
    membershipFailed:
      "Whop-Mitgliedschaft konnte nicht geladen werden: {{error}}",
    cancelFailed:
      "Whop-Mitgliedschaft konnte nicht gekündigt werden: {{error}}",
    catalogFailed: "Whop-Katalog konnte nicht abgeglichen werden: {{error}}",
  },
};
