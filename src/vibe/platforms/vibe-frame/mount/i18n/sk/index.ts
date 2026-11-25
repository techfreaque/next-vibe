import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Systém",
  tags: {
    vibeFrame: "Vibe Frame",
    embed: "Vloženie",
    widget: "Komponent",
    config: "Konfig",
  },
  post: {
    title: "Nastavenia Vibe Frame",
    titleShort: "Vibe Frame",
    description:
      "Vráti adresy URL rámcov iframe požadovaných integrácií. Server načíta prihlasovacie súbory cookie (credentials: include) a vydá výmenné tokeny s krátkou platnosťou, aby sa do adries URL nedostali tajné údaje.",
    container: {
      title: "Nastavenia Vibe Frame",
      description:
        "Vyžiadať adresy URL rámcov iframe pre jednu alebo viac integrácií",
    },
    fields: {
      leadId: {
        label: "ID kontaktu",
        description:
          "ID návštevníka z hostiteľskej stránky. Pri rôznych pôvodoch sa nedá načítať zo súborov cookie.",
      },
      authToken: {
        label: "Overovací token",
        description:
          "Token JWT z relácie na hostiteľskej stránke pre komponenty, ktoré vyžadujú prihlásenie",
      },
      integrations: {
        label: "Integrácie",
        description: "Zoznam integrácií na nastavenie",
      },
      integration: {
        label: "Integrácia",
        description: "Nastavenia jednej integrácie",
      },
      id: {
        label: "ID integrácie",
        description: "Jedinečné ID pozície tejto integrácie",
        placeholder: "contact_POST",
      },
      endpoint: {
        label: "Koncový bod",
        description:
          "Voliteľné ID koncového bodu. Ak ho nevyplníte, použije sa hodnota id.",
        placeholder: "contact_POST",
      },
      hasRendered: {
        label: "Už zobrazené",
        description:
          "Ak je integrácia už pripojená, nastavte hodnotu true a server ju preskočí.",
      },
      theme: {
        label: "Téma",
        description: "Farebná téma rámca",
      },
      urlPathParams: {
        label: "Parametre cesty URL",
        description: "Parametre cesty URL vo formáte JSON",
        placeholder: '{"id":"123"}',
      },
      data: {
        label: "Údaje",
        description: "Údaje na predvyplnenie vo formáte JSON",
        placeholder: "{}",
      },
      widgets: {
        label: "Komponenty",
        description: "Nastavenia komponentov podľa ID integrácie",
      },
      widget: {
        label: "Komponent",
        description: "Nastavenia komponentu pre jednu integráciu",
      },
      frameId: {
        label: "ID rámca",
        description:
          "Jedinečné ID rámca na komunikáciu cez prepojovaciu vrstvu",
      },
      widgetUrl: {
        label: "Adresa URL komponentu",
        description: "Adresa src rámca iframe s výmenným tokenom",
      },
    },
    errors: {
      validation: {
        title: "Neplatné parametre",
        description: "Zadané parametre sú neplatné",
      },
      unauthorized: {
        title: "Bez oprávnenia",
        description: "Vyžaduje sa prihlásenie",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "Nemáte povolenie.",
      },
      notFound: {
        title: "Koncový bod sa nenašiel.",
        description: "Jeden alebo viac koncových bodov neexistuje",
      },
      internal: {
        title: "Konfigurácia zlyhala",
        description: "Pri zostavovaní odpovede s nastaveniami nastala chyba",
      },
      network: {
        title: "Chyba siete",
        description: "Nastala chyba siete",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neznáma chyba",
      },
      unsaved: {
        title: "Neuložené zmeny",
        description: "Zostali neuložené zmeny.",
      },
      conflict: {
        title: "Konflikt",
        description: "Nastal konflikt",
      },
    },
    repository: {
      invalidUrlPathParams: "Neplatný formát parametrov cesty URL",
      invalidData: "Neplatný formát údajov",
      endpointNotFound: "Koncový bod sa nenašiel.",
      configFailed: "Nepodarilo sa vytvoriť nastavenia rámca",
      tokenMintFailed: "Nepodarilo sa vydať výmenný token",
    },
    success: {
      configured: {
        title: "Nastavenia sú pripravené",
        description: "Adresy URL rámcov iframe boli vygenerované",
      },
    },
  },
};
