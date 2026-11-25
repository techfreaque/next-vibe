import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Systém",
  tags: {
    remoteSync: "Vzdialená synchronizácia",
  },
  taskSync: {
    post: {
      title: "Vzdialená synchronizácia",
      titleShort: "Synchronizácia",
      description:
        "Obojsmerná synchronizácia medzi inštanciami. Volajúca strana pošle kurzory označujúce posledné spracované záznamy a prijme iba novšie údaje.",
      instanceId: {
        label: "ID inštancie",
        description: "Identifikátor volajúcej inštancie",
      },
      syncCursors: {
        label: "Kurzory synchronizácie",
        description:
          "Kurzor pre každú oblasť údajov označuje, po ktorý záznam už synchronizácia prebehla.",
      },
      capabilitiesVersion: {
        label: "Verzia zoznamu dostupných funkcií",
        description:
          "Verzia zoznamu funkcií prijímajúcej inštancie, ktorú má uloženú volajúca strana",
      },
      senderCapabilitiesVersion: {
        label: "Verzia zoznamu funkcií odosielateľa",
        description: "Verzia vlastného zoznamu funkcií volajúcej inštancie",
      },
      capabilitiesJson: {
        label: "Dostupné funkcie vo formáte JSON",
        description:
          "Zoznam dostupných nástrojov, ktorý sa má zaregistrovať na tejto inštancii",
      },
      pushPayloads: {
        label: "Odosielané údaje",
        description:
          "Záznamy volajúceho novšie než jeho kurzory odosielania. Použijú sa tu pred serializáciou odpovede pri obojsmernej synchronizácii.",
      },
      syncPayloads: {
        label: "Synchronizované údaje",
        description:
          "Novšie záznamy od pozície označenej kurzorom, osobitne za každú oblasť",
      },
      syncCounts: {
        label: "Počty synchronizovaných záznamov",
        description: "Počet vrátených záznamov v každej oblasti",
      },
      remoteCursors: {
        label: "Kurzory vzdialenej inštancie",
        description:
          "Aktuálne kurzory tejto inštancie. Posuňte miestne kurzory na tieto hodnoty.",
      },
      remoteCapabilitiesVersion: {
        label: "Verzia zoznamu funkcií vzdialenej inštancie",
        description:
          "Aktuálna verzia zoznamu dostupných funkcií tejto inštancie",
      },
      capabilities: {
        label: "Dostupné funkcie",
        description: "Zoznam nástrojov dostupných na tejto inštancii",
      },
      serverTime: {
        label: "Čas servera",
        description: "Aktuálna časová pečiatka servera",
      },
      errors: {
        validation: {
          title: "Chyba overenia",
          description: "Neplatná požiadavka na synchronizáciu",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Vyžaduje sa prihlásenie",
        },
        internal: {
          title: "Chyba synchronizácie",
          description: "Počas synchronizácie nastala chyba.",
        },
        forbidden: {
          title: "Prístup zakázaný",
          description: "Nemáte povolenie synchronizovať",
        },
        notFound: {
          title: "Nenašlo sa",
          description: "Cieľ synchronizácie sa nenašiel.",
        },
        network: {
          title: "Chyba siete",
          description: "Synchronizačný koncový bod je nedostupný.",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Vyskytla sa neočakávaná chyba",
        },
        unsaved: {
          title: "Neuložené zmeny",
          description: "Sú tu neuložené zmeny.",
        },
        conflict: {
          title: "Konflikt",
          description: "Pri synchronizácii sa zistil konflikt.",
        },
      },
      success: {
        title: "Zosynchronizované",
        description: "Synchronizácia sa dokončila.",
      },
    },
  },
};
