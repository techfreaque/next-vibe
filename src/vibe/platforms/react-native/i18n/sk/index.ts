import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    missingUrlParam:
      "V adrese URL koncového bodu {{endpoint}} chýba parameter {{paramName}}",
    urlConstructionFailed: "Nepodarilo sa zostaviť adresu URL: {{error}}",
    validationFailed: "Overenie údajov zlyhalo: {{error}}",
    htmlResponseReceived:
      "Adresa {{url}} vrátila HTML namiesto JSON (stav {{status}}). Skontrolujte, či server API beží a koncový bod existuje.",
    networkError: "Nastala sieťová chyba: {{error}}",
    failedToLoadPage: "Nepodarilo sa načítať stránku",
  },
  generate: {
    post: {
      title: "Vygenerovať indexy Expo",
      titleShort: "Indexy Expo",
      description:
        "Vygenerovať adaptéry pre stránky Next.js, aby fungovali v Expo Routeri",
      response: {
        fields: {
          success: "Úspech",
          created: "Vytvorené súbory",
          skipped: "Preskočené súbory",
          errors: "Chyby",
          message: "Správa",
        },
      },
      errors: {
        validation: {
          title: "Chyba overenia údajov",
          description: "Neplatné parametre požiadavky",
        },
        unauthorized: {
          title: "Bez oprávnenia",
          description: "Nie ste oprávnení vykonať túto akciu",
        },
        server: {
          title: "Chyba servera",
          description: "Nastala chyba pri generovaní indexov",
        },
        network: {
          title: "Chyba siete",
          description: "Nastala chyba siete",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Nemáte povolenie na vykonanie tejto akcie",
        },
        notFound: {
          title: "Nenájdené",
          description: "Zdrojový priečinok sa nenašiel",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Nastala neznáma chyba",
        },
        conflict: {
          title: "Konflikt",
          description: "Nastal konflikt",
        },
      },
      success: {
        title: "Úspech",
        description:
          "Vytvorené súbory: {{created}}. Preskočené súbory: {{skipped}}. Chyby: {{errors}}.",
      },
    },
  },
};
