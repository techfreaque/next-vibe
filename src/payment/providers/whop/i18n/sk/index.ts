import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    notConfigured: "Platby kartou cez Whop ešte nie sú nastavené.",
    productNotFound: "Tento produkt sa teraz nedá kúpiť kartou.",
    userNotFound: "Účet sa nenašiel.",
    checkoutFailed: "Platbu kartou sa nepodarilo otvoriť: {{error}}",
    webhookInvalidSignature: "Podpis webhooku Whop je neplatný.",
    webhookInvalidPayload: "Webhook Whop sa nepodarilo prečítať: {{error}}",
    membershipFailed: "Členstvo Whop sa nepodarilo načítať: {{error}}",
    cancelFailed: "Členstvo Whop sa nepodarilo zrušiť: {{error}}",
    catalogFailed: "Katalóg Whop sa nepodarilo zosynchronizovať: {{error}}",
  },
};
