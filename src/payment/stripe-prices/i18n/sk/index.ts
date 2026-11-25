import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Platby",
  tags: {
    payment: "platba",
    admin: "admin",
  },
  post: {
    title: "Zabezpečenie cien Stripe",
    titleShort: "Ceny Stripe",
    description:
      "Vytvorte každý plán a kreditnú cenu na pripojenom účte Stripe (na menu a jazyk), nájdené vyhľadávacím kľúčom. Idempotentné, žiadne id ceny v .env. Suchý beh uvádza, čo existuje a čo chýba.",
    fields: {
      dryRun: {
        label: "Suchý beh",
        description: "Zoznam cien bez vytvorenia niečoho",
      },
    },
    response: {
      dryRun: "Skúšobný beh",
      stripeMode: "Režim Stripe",
      existing: "Už som tam.",
      created: "Stvorené teraz",
      missing: "Chýba",
      prices: "Ceny",
      lookupKey: "Hľadanie kľúča",
      priceId: "ID ceny",
      productId: "ID produktu",
      amount: "Suma",
      status: "Stav",
    },
    widget: {
      hint: "Spustiť raz na účet Stripe po zmene cien. Pokladňa tiež vytvára chýbajúcu cenu pri prvom použití.",
      submit: "Zabezpečenie cien",
      summary:
        "Stripe {{mode}}: {{existing}} existujúca, {{created}} vytvorená, {{missing}} chýba",
    },
  },
  errors: {
    validation: {
      title: "Neplatný vstup",
      description: "Skontroluj požiadavku",
    },
    unauthorized: {
      title: "Nezapísané",
      description: "Prihlás sa ako správca",
    },
    forbidden: {
      title: "Iba administrátori",
      description: "Iba administrátori môžu spravovať ceny Stripe",
    },
    notFound: {
      title: "Nenájdené",
      description: "Požadovaný zdroj sa nenašiel",
    },
    conflict: {
      title: "Konflikt",
      description: "Stripe medzitým zmenil, spustiť znova",
    },
    server: {
      title: "Chyba servera",
      description: "Nebolo možné zabezpečiť ceny Stripe",
    },
    network: {
      title: "Chyba siete",
      description: "Požiadavka sa nedostala na server",
    },
    unknown: {
      title: "Neznáma chyba",
      description: "Niečo nečakané zlyhalo",
    },
    unsavedChanges: {
      title: "Neuložené zmeny",
      description: "Najprv uložte alebo zrušte zmeny",
    },
    notConfigured: "Stripe nie je konfigurovaný (STRIPE_SECRET_KEY chýba)",
  },
  success: {
    title: "Hotovo",
    description: "Skontrolované ceny Stripe",
  },
};
