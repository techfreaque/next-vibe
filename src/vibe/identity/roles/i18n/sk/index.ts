import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    find_failed:
      "Pre používateľa {{userId}} sa nepodarilo nájsť roly: {{error}}",
    batch_find_failed:
      "Nepodarilo sa hromadne načítať roly. Počet používateľov: {{count}}. Chyba: {{error}}",
    not_found: "Používateľ {{userId}} nemá rolu {{role}}.",
    lookup_failed:
      "Nepodarilo sa vyhľadať rolu {{role}} pre používateľa {{userId}}: {{error}}",
    add_failed:
      "Používateľovi {{userId}} sa nepodarilo priradiť rolu {{role}}: {{error}}",
    no_data_returned: "Databáza nevrátila žiadne údaje",
    remove_failed:
      "Nepodarilo sa odobrať rolu {{role}} používateľovi {{userId}}: {{error}}",
    check_failed:
      "Nepodarilo sa overiť rolu {{role}} používateľa {{userId}}: {{error}}",
    delete_failed:
      "Používateľovi {{userId}} sa nepodarilo odstrániť roly: {{error}}",
    endpoint_not_created:
      "Koncový bod pre roly používateľov ešte nebol vytvorený.",
  },
  post: {
    title: "Roly používateľov",
    description: "Koncový bod pre roly používateľov",
    form: {
      title: "Nastavenia používateľských rolí",
      description: "Nastavte parametre používateľských rolí",
    },
    response: {
      title: "Odpoveď",
      description: "Údaje odpovede o rolách používateľov",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      validation: {
        title: "Chyba kontroly údajov",
        description: "Neplatné parametre požiadavky",
      },
      server: {
        title: "Chyba servera",
        description: "Vyskytla sa interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neznáma chyba",
      },
      network: {
        title: "Chyba siete",
        description: "Vyskytla sa chyba siete",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Prístup zamietnutý",
      },
      notFound: {
        title: "Nenájdené",
        description: "Zdroj sa nenašiel",
      },
      conflict: {
        title: "Konflikt",
        description: "Nastal konflikt údajov",
      },
      database_connection_failed: {
        title: "Pripojenie k databáze zlyhalo",
        description: "Nepodarilo sa pripojiť k databáze",
      },
    },
    success: {
      title: "Úspech",
      description: "Operácia prebehla úspešne",
    },
  },
  enums: {
    userRole: {
      public: "Verejnosť",
      customer: "Zákazník",
      partnerAdmin: "Správca partnera",
      partnerEmployee: "Zamestnanec partnera",
      admin: "Správca",
      cliOff: "CLI vypnuté",
      cliAuthBypass: "Obídenie overenia v CLI",
      aiToolOff: "Nástroj AI vypnutý",
      webOff: "Web vypnutý",
      mcpOff: "MCP vypnuté",
      mcpVisible: "Viditeľné v MCP",
      cronAllowed: "Povolené pre plánované úlohy cron",
      productionOff: "V produkcii vypnuté",
      skillOff: "Zručnosť vypnutá",
    },
  },
};
