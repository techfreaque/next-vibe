import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    unexpectedError: "Nastala neočakávaná chyba: {{error}}. Skúste to znova.",
    modelNotResolved:
      "Nepodarilo sa určiť model pre toto vlákno. Prenos odpovede nemožno obnoviť.",
  },
  post: {
    title: "Obnova",
    titleShort: "Obnova",
    description:
      "Pokračuje v existujúcom vlákne po dokončení asynchrónnej úlohy (callbackMode=wait alebo wakeUp). TaskCompletion.handle naplánuje jednorazovú úlohu cron, ktorú plánovač spustí na správnej inštancii.",
    fields: {
      threadId: {
        title: "ID vlákna",
        description: "UUID vlákna, v ktorom sa má pokračovať.",
      },
      favoriteId: {
        title: "ID obľúbenej položky",
        description:
          "Uložená obľúbená položka, z ktorej sa načíta model a zručnosť.",
      },
      modelId: {
        title: "ID modelu",
        description: "Model AI, ktorý po obnovení odpovie.",
      },
      skillId: {
        title: "ID zručnosti",
        description: "Zručnosť alebo persona, s ktorou sa má pokračovať.",
      },
      callbackMode: {
        title: "Režim spätného volania",
        description: "Hodnota wait alebo wakeUp určuje spôsob obnovenia.",
      },
      wakeUpToolMessageId: {
        title: "ID správy nástroja",
        description:
          "ID pôvodnej správy o volaní nástroja, do ktorej sa doplnil výsledok.",
      },
      wakeUpTaskId: {
        title: "ID úlohy wakeUp",
        description:
          "Pôvodná úloha cron typu wakeUp. Po obnovení vlákna sa odstráni.",
      },
      resumeTaskId: {
        title: "ID úlohy obnovy",
        description: "ID tejto úlohy cron. Po obnovení vlákna sa odstráni.",
      },
      resumed: {
        title: "Obnovené",
        description: "Či sa podarilo pokračovať vo vlákne.",
      },
      lastAiMessageId: {
        title: "ID poslednej správy AI",
        description: "UUID poslednej správy, ktorú asistent vygeneroval.",
      },
    },
    errors: {
      validation: {
        title: "Chyba overenia údajov",
        description: "Neplatné parametre. threadId musí obsahovať platné UUID.",
      },
      unauthorized: {
        title: "Bez oprávnenia",
        description: "Vyžaduje sa prihlásenie.",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Prístup zamietnutý.",
      },
      notFound: {
        title: "Nenájdené",
        description: "Vlákno alebo model sa nenašiel.",
      },
      internal: {
        title: "Chyba servera",
        description: "Pri obnove prenosu nastala interná chyba.",
      },
      network: {
        title: "Chyba siete",
        description: "Nastala chyba siete.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neočakávaná chyba.",
      },
      unsaved: {
        title: "Neuložené zmeny",
        description: "Konflikt s neuloženými zmenami.",
      },
      conflict: {
        title: "Konflikt",
        description: "Nastal konflikt.",
      },
    },
    success: {
      title: "Vlákno obnovené",
      description: "AI úspešne pokračovala vo vlákne.",
    },
  },
};
