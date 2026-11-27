import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Platby",
  tags: {
    payment: "payment",
    admin: "admin",
  },
  post: {
    title: "Synchronizovať katalóg Whop",
    titleShort: "Katalóg Whop",
    description:
      "Vytvorí každý plán a balík kreditov v prepojenom účte Whop: jeden produkt na plán, jednu variantu na interval, menu a cenu, nájdenú podľa nášho kľúča v metadátach. Idempotentné. Skúšobný beh ukáže, čo existuje a čo chýba.",
    fields: {
      dryRun: {
        label: "Skúšobný beh",
        description: "Iba vypísať varianty, nič nevytvárať",
      },
    },
    response: {
      dryRun: "Skúšobný beh",
      environment: "Prostredie Whop",
      accountId: "Účet Whop",
      existing: "Už existujú",
      created: "Vytvorené teraz",
      missing: "Chýbajú",
      variants: "Varianty",
      key: "Kľúč",
      variantId: "ID varianty",
      productId: "Produkt Whop",
      amount: "Suma",
      status: "Stav",
      purchaseUrl: "Odkaz na nákup",
    },
    widget: {
      hint: "Spusti raz na účet Whop po zmene cien. Pokladňa vytvorí chýbajúcu variantu aj pri prvom nákupe.",
      submit: "Synchronizovať katalóg",
      summary:
        "Whop {{environment}} ({{accountId}}): {{existing}} existuje, {{created}} vytvorených, {{missing}} chýba",
    },
  },
  errors: {
    validation: {
      title: "Neplatný vstup",
      description: "Skontroluj požiadavku",
    },
    unauthorized: {
      title: "Neprihlásený",
      description: "Prihlás sa ako admin",
    },
    forbidden: {
      title: "Len pre adminov",
      description: "Katalóg Whop synchronizujú len admini",
    },
    notFound: { title: "Nenájdené", description: "Zdroj sa nenašiel" },
    conflict: {
      title: "Konflikt",
      description: "Whop sa medzitým zmenil. Spusti znova.",
    },
    server: {
      title: "Chyba servera",
      description: "Katalóg Whop sa nepodarilo zosynchronizovať",
    },
    network: {
      title: "Chyba siete",
      description: "Požiadavka sa nedostala na server",
    },
    unknown: {
      title: "Neznáma chyba",
      description: "Niečo sa nečakane pokazilo",
    },
    unsavedChanges: {
      title: "Neuložené zmeny",
      description: "Najprv ulož alebo zahoď zmeny",
    },
    notConfigured:
      "Whop nie je nastavený (chýba API kľúč aktívneho WHOP_ENVIRONMENT)",
    syncFailed: "Synchronizácia katalógu Whop zlyhala: {{error}}",
  },
  success: {
    title: "Hotovo",
    description: "Katalóg Whop skontrolovaný",
  },
};
