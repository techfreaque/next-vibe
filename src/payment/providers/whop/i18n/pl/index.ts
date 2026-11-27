import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    notConfigured: "Płatności kartą przez Whop nie są jeszcze skonfigurowane.",
    productNotFound: "Tego produktu nie można teraz kupić kartą.",
    userNotFound: "Nie znaleziono konta.",
    checkoutFailed: "Nie udało się otworzyć płatności kartą: {{error}}",
    webhookInvalidSignature: "Podpis webhooka Whop jest nieprawidłowy.",
    webhookInvalidPayload: "Nie udało się odczytać webhooka Whop: {{error}}",
    membershipFailed: "Nie udało się wczytać członkostwa Whop: {{error}}",
    cancelFailed: "Nie udało się anulować członkostwa Whop: {{error}}",
    catalogFailed: "Nie udało się zsynchronizować katalogu Whop: {{error}}",
  },
};
