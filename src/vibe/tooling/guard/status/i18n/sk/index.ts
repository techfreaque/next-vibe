import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Guard",
  post: {
    title: "Stav prostredia Guard",
    titleShort: "Stav prostredia Guard",
    description: "Skontrolovať stav prostredia Guard",
    tag: "Stav",
    container: {
      title: "Nastavenia kontroly stavu prostredia Guard",
      description: "Nastaviť parametre kontroly stavu",
    },
    fields: {
      projectPath: {
        title: "Cesta k projektu",
        description: "Cesta k projektu prostredia Guard",
        placeholder: "/path/to/project",
      },
      guardId: {
        title: "ID prostredia Guard",
        description: "Jedinečné ID prostredia Guard",
        placeholder: "guard-123",
      },
      username: {
        title: "Používateľské meno",
      },
      status: {
        title: "Stav",
      },
      createdAt: {
        title: "Čas vytvorenia",
      },
      securityLevel: {
        title: "Úroveň bezpečnosti",
      },
      isolationMethod: {
        title: "Spôsob izolácie",
      },
      isRunning: {
        title: "Beží",
      },
      userHome: {
        title: "Domovský priečinok používateľa",
      },
      listAll: {
        title: "Zobraziť všetky prostredia Guard",
        description: "Zobraziť zoznam všetkých prostredí Guard",
      },
      success: {
        title: "Úspech",
      },
      output: {
        title: "Výstup",
      },
      guards: {
        title: "Prostredia Guard",
      },
      totalGuards: {
        title: "Celkový počet prostredí Guard",
      },
      activeGuards: {
        title: "Aktívne prostredia Guard",
      },
    },
    form: {
      title: "Nastavenie stavu",
      description: "Nastaviť parametre stavu",
    },
    response: {
      title: "Odpoveď",
      description: "Výsledok kontroly stavu",
    },
    errors: {
      unauthorized: {
        title: "Bez oprávnenia",
        description: "Vyžaduje sa prihlásenie",
      },
      validation: {
        title: "Chyba overenia",
        description: "Neplatné parametre požiadavky",
      },
      server: {
        title: "Chyba servera",
        description: "Nastala chyba interného servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neznáma chyba",
      },
      network: {
        title: "Chyba siete",
        description: "Nastala chyba siete",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "Prístup zakázaný",
      },
      notFound: {
        title: "Nenájdené",
        description: "Zdroj sa nenašiel.",
      },
      conflict: {
        title: "Konflikt",
        description: "Nastal konflikt údajov",
      },
      internal: {
        title: "Interná chyba",
        description: "Nastala chyba interného servera",
      },
      statusFailed: "Interná chyba pri kontrole prostredia Guard: {{detail}}",
    },
    success: {
      title: "Úspech",
      description: "Operácia úspešne dokončená",
    },
  },
};
