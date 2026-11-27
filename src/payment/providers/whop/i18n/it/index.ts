import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    notConfigured:
      "Il pagamento con carta tramite Whop non è ancora configurato.",
    productNotFound:
      "Questo prodotto non si può acquistare con carta in questo momento.",
    userNotFound: "Account non trovato.",
    checkoutFailed: "Impossibile aprire il pagamento con carta: {{error}}",
    webhookInvalidSignature: "La firma del webhook Whop non è valida.",
    webhookInvalidPayload: "Impossibile leggere il webhook Whop: {{error}}",
    membershipFailed: "Impossibile caricare l'abbonamento Whop: {{error}}",
    cancelFailed: "Impossibile annullare l'abbonamento Whop: {{error}}",
    catalogFailed: "Impossibile sincronizzare il catalogo Whop: {{error}}",
  },
};
