import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Stripe CLI",
  titleShort: "Stripe CLI",
  description: "Počúvať pre Stripe webhooks lokálne",
  category: "Integrácia platieb",
  tags: {
    stripe: "Stripe",
    cli: "Príkazový riadok",
    webhook: "Webhook",
  },

  form: {
    title: "Stripe CLI",
    description: "Forward Stripe webhook akcie na vašom lokálnom serveri",
    fields: {
      port: {
        label: "Port",
        description:
          "Lokálny port na presmerovanie webhooks do (predvolené: 3000)",
        placeholder: "3000",
      },
    },
  },

  status: {
    authenticated: "Overené a pripravené",
    not_authenticated: "Nie je overená 'stripe login'",
    not_installed: "Stripe CLI nie je nainštalovaný. {{instructions}}",
  },

  errors: {
    validation: {
      title: "Neplatné nastavenie",
      description: "Skontrolujte si konfiguráciu Stripe CLI a skúste to znova",
    },
    network: {
      title: "Chyba siete",
      description: "Nepodarilo sa pripojiť k Stripe",
    },
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description: "Nemáte povolenie na vykonanie tejto operácie.",
    },
    forbidden: {
      title: "Prístup zamietnutý",
      description: "Táto operácia nie je povolená pre váš účet",
    },
    notFound: {
      title: "Nenašlo sa",
      description: "Stripe CLI nie je nainštalovaný",
    },
    serverError: {
      detail: "Poslucháč Stripe CLI zlyhal: {{error}}",
      title: "Chyba servera",
      description: "Nastala chyba pri spustení poslucháča Stripe",
    },
    unknown: {
      title: "Neznáma chyba",
      description: "Nastala neočakávaná chyba",
    },
    customerRetrievalFailed: {
      detail:
        "Nepodarilo sa načítať zákaznícky záznam Stripe: {{error}} (užívateľ {{userId}})",
      title: "Nepodarilo sa načítať zákazníka",
      description: "Nepodarilo sa načítať údaje o zákazníkovi zo Stripe.",
    },
    unsavedChanges: {
      title: "Neuložené zmeny",
      description: "Máte neuložené zmeny konfigurácie",
    },
    conflict: {
      title: "Konflikt operácií",
      description: "V súčasnosti prebieha ďalšia operácia Stripe",
    },
    execution_failed: "Operácia Stripe CLI zlyhala",
    userNotFound: {
      detail: "Účet používateľa {{userId}} sa nenašiel.",
      title: "Používateľ sa nenašiel",
      description: "Zadaný užívateľ nebol nájdený",
    },
    customerCreationFailed: {
      detail:
        "Nepodarilo sa vytvoriť zákaznícky záznam Stripe: {{error}} (užívateľ {{userId}})",
      title: "Vytvorenie zákazníka zlyhalo",
      description: "Zákazníka v Stripe sa nepodarilo vytvoriť",
    },
    checkoutUnavailable: {
      detail:
        "Platba kartou je teraz u nás nedostupná. Vieme o tom a riešime to. Skús to neskôr.",
    },
    checkoutCreationFailed: {
      detail: "Platbu sa nepodarilo spustiť: {{error}}",
      title: "Nepodarilo sa vytvoriť platobnú reláciu",
      description: "Nepodarilo sa vytvoriť platobnú reláciu Stripe.",
    },
    webhookVerificationFailed: {
      detail: "Nepodarilo sa overiť webhook Stripe: {{error}}",
      title: "Nepodarilo sa overiť webhook",
      description: "Nepodarilo sa overiť podpis webhooku",
    },
    subscriptionRetrievalFailed: {
      detail: "Nepodarilo sa načítať predplatné od Stripe: {{error}}",
      title: "Nepodarilo sa načítať predplatné",
      description: "Nepodarilo sa získať predplatné z Stripe",
    },
    subscriptionCancellationFailed: {
      detail: "Nepodarilo sa zrušiť predplatné: {{error}}",
      title: "Nepodarilo sa zrušiť predplatné",
      description: "Nepodarilo sa zrušiť predplatné v Stripe",
    },
    priceCreationFailed: {
      detail:
        "Nepodarilo sa vytvoriť cenu Stripe: {{error}} (produkt {{productId}})",
      title: "Nepodarilo sa vytvoriť cenu",
      description: "Nepodarilo sa vytvoriť cenu v Stripe",
    },
    notConfigured: {
      title: "Stripe nie je nastavený",
      description: "Nastaviť STRIPE_SECRET_KEY vo vašom .env",
    },
    stripeCliNotInstalled: "Stripe CLI nie je nainštalovaný",
    listenerFailed: "Nepodarilo sa spustiť príjem webhookov Stripe.",
  },

  success: {
    title: "Poslucháč začal",
    description: "Stripe CLI počúva pre webhooks",
  },
};
