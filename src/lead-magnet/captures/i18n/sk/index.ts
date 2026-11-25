import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  list: {
    title: "Získané kontakty",
    titleShort: "Získané kontakty",
    description: "Všetci, ktorí odoslali formulár na odber",
    tag: "lead-magnet-captures",
    response: {
      items: "Kontakty",
      total: "Spolu",
      page: "Stránka",
      pageSize: "Veľkosť stránky",
    },
    success: {
      title: "Kontakty načítané",
      description: "Tvoje získané kontakty",
    },
    errors: {
      validation: {
        title: "Chyba overenia údajov",
        description: "Skontroluj zadané údaje",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Prihlás sa a pokračuj",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Prístup zamietnutý",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Nenašli sa žiadne kontakty",
      },
      conflict: {
        title: "Konflikt",
        description: "Nastal konflikt",
      },
      network: {
        title: "Chyba siete",
        description: "Vyskytla sa chyba siete",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máš neuložené zmeny",
      },
      internal: {
        title: "Chyba servera",
        description: "Vyskytla sa interná chyba",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neznáma chyba",
      },
    },
  },
  widget: {
    empty:
      "Zatiaľ žiadni odberatelia. Zdieľaj stránku svojej zručnosti a oslov ďalších návštevníkov.",
    exportCsv: "Exportovať CSV",
    columns: {
      date: "Dátum",
      name: "Meno",
      email: "E-mail",
      status: "Stav",
    },
    statusSuccess: "Získané",
    statusFailed: "Zlyhalo",
  },
};
