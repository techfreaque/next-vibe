import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Spustenie úlohy",
  tags: {
    execute: "Spustiť",
  },
  errors: {
    executeTask: "Nepodarilo sa spustiť úlohu",
    forbidden: "Na spustenie tejto úlohy nemáte oprávnenie.",
    alreadyRunning: "Úloha už beží",
    notFound: "Úloha {{taskId}} sa nenašla.",
  },
  post: {
    title: "Spustiť úlohu",
    titleShort: "Spustiť úlohu",
    description:
      "Spustiť úlohu podľa ID a počkať na výsledok v tej istej požiadavke",
    container: {
      title: "Spustenie úlohy",
      description: "Spustí vybranú úlohu a počká na výsledok.",
    },
    fields: {
      taskId: {
        label: "Kľúč úlohy",
        description: "ID úlohy na vykonanie",
      },
      success: {
        title: "Úspech",
      },
      message: {
        title: "Správa",
      },
    },
    response: {
      taskId: "ID úlohy",
      taskName: "Názov úlohy",
      executedAt: "Čas spustenia",
      duration: "Trvanie (ms)",
      status: "Stav",
      output: "Výstup",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      internal: {
        title: "Interná chyba",
        description: "Nastala interná chyba servera.",
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
        description: "Na spustenie tejto úlohy nemáte oprávnenie.",
      },
      notFound: {
        title: "Nenájdené",
        description: "Úloha sa nenašla.",
      },
      conflict: {
        title: "Konflikt",
        description: "Úloha už beží",
      },
      unsaved: {
        title: "Neuložené zmeny",
        description: "Sú tu neuložené zmeny.",
      },
      validation: {
        title: "Chyba overenia",
        description: "Neplatné parametre požiadavky",
      },
    },
    submitButton: {
      label: "Spustiť úlohu",
      loadingText: "Prebieha…",
    },
    success: {
      title: "Úspech",
      description: "Úloha sa úspešne vykonala.",
    },
  },
};
