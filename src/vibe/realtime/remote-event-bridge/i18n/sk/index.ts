import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Systém",
  tags: {
    remoteSync: "Vzdialená synchronizácia",
  },
  remoteEventBridge: {
    post: {
      title: "Prenos vzdialených udalostí",
      titleShort: "Prenos udalostí",
      description:
        "Prijíma udalosti zo vzdialených inštancií a odovzdáva ich obsluhe onRemoteEvent cieľovej trasy. Inštancie s režimom direct-http ho volajú cez HTTP, inštancie s režimom reverse-WS cez onRemoteEvent.",
      eventName: {
        label: "Názov udalosti",
        description: "Typ prenášanej udalosti, ktorá sa má spracovať",
      },
      leadId: {
        label: "ID kontaktu",
        description:
          "Identita odosielajúcej inštancie platná naprieč inštanciami",
      },
      originInstanceId: {
        label: "Zdrojová inštancia",
        description:
          "Inštancia, ktorá odoslala udalosť. Slúži na zabránenie spätnému odoslaniu.",
      },
      payload: {
        label: "Údaje udalosti",
        description:
          "Pôvodné údaje udalosti preposlané zo vzdialenej inštancie",
      },
      received: {
        label: "Prijaté",
        description: "Určuje, či sa udalosť prijala a spracovala",
      },
      errors: {
        validation: {
          title: "Chyba overenia",
          description: "Údaje udalosti sú neplatné",
        },
        unauthorized: {
          title: "Bez oprávnenia",
          description: "Vyžaduje sa prihlásenie",
        },
        internal: {
          title: "Chyba spracovania",
          description: "Pri spracovaní udalosti nastala chyba",
        },
        forbidden: {
          title: "Prístup zakázaný",
          description: "Nemáte oprávnenie odosielať udalosti",
        },
        notFound: {
          title: "Nenájdené",
          description: "Cieľ sa nenašiel",
        },
        network: {
          title: "Chyba siete",
          description:
            "Nepodarilo sa pripojiť ku koncovému bodu na prenos udalostí",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Vyskytla sa neočakávaná chyba",
        },
        unsaved: {
          title: "Neuložené zmeny",
          description: "Niektoré zmeny nie sú uložené.",
        },
        conflict: {
          title: "Konflikt",
          description: "Zistil sa konflikt udalostí",
        },
      },
      success: {
        title: "Udalosť prijatá",
        description: "Vzdialená udalosť sa spracovala",
      },
    },
  },
};
