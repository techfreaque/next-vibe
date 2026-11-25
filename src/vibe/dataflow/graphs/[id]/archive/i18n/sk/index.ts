import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Archivovať graf",
    titleShort: "Archivovať graf",
    description: "Deaktivuje graf a presunie ho do archívu.",
    fields: {
      id: { label: "ID grafu", description: "UUID grafu na archiváciu" },
    },
    response: {
      archivedId: "ID archivovaného grafu",
    },
    widget: {
      confirmDescription:
        "Graf sa deaktivuje a presunie do archívu. Prestane sa spúšťať podľa plánu. Archiváciu možno zrušiť.",
      archivedIdLabel: "ID archivovaného grafu",
      backToList: "Späť na zoznam grafov",
    },
    success: {
      title: "Graf bol archivovaný",
      description: "Graf bol úspešne archivovaný",
    },
    errors: {
      unauthorized: {
        title: "Bez oprávnenia",
        description: "Vyžaduje sa prihlásenie",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "Nie je možné archivovať systémové grafy",
      },
      server: {
        title: "Chyba servera",
        description: "Nepodarilo sa archivovať graf",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      validation: {
        title: "Overenie vstupu zlyhalo",
        description: "Neplatné parametre",
      },
      notFound: { title: "Nenájdené", description: "Graf sa nenašiel." },
      conflict: { title: "Konflikt", description: "Konflikt zdrojov" },
      network: {
        title: "Chyba siete",
        description: "Sieťová požiadavka zlyhala",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Najprv ulož zmeny",
      },
    },
  },
};
