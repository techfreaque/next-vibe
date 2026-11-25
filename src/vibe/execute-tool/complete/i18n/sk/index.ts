import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Systém",
  tags: {
    remoteSync: "Vzdialená synchronizácia",
  },
  taskReport: {
    post: {
      title: "Hlásenie o úlohe",
      titleShort: "Správa",
      description: "Prijme výsledky vykonania úloh zo vzdialených inštancií.",
      taskId: {
        label: "ID úlohy",
        description: "ID úlohy, ktorej sa hlásenie týka",
      },
      executionId: {
        label: "ID vykonania",
        description: "ID konkrétneho spustenia",
      },
      status: {
        label: "Stav",
        description: "Konečný stav vykonávania úlohy",
      },
      durationMs: {
        label: "Trvanie (ms)",
        description: "Trvanie vykonania v milisekundách",
      },
      summary: {
        label: "Zhrnutie",
        description: "Zrozumiteľné zhrnutie výsledku vykonania",
      },
      error: {
        label: "Chyba",
        description: "Chybové hlásenie pri zlyhaní vykonania",
      },
      serverTimezone: {
        label: "Časové pásmo servera",
        description: "Časové pásmo servera, ktorý úlohu vykonal",
      },
      executedByInstance: {
        label: "Vykonávajúca inštancia",
        description: "ID inštancie, ktorá úlohu vykonala",
      },
      output: {
        label: "Výstup",
        description: "Štruktúrovaný výstup úlohy",
      },
      startedAt: {
        label: "Čas spustenia",
        description: "Čas spustenia vo formáte ISO",
      },
      wakeUpContext: {
        label: "Kontext obnovenia",
        description:
          "Kontext na obnovenie vlákna vrátený z pôvodnej požiadavky. Volajúci môže vlákno obnoviť aj bez miestneho záznamu úlohy.",
      },
      processed: {
        label: "Spracované",
        description: "Či sa hlásenie prijalo",
      },
      errors: {
        validation: {
          title: "Chyba overenia údajov",
          description: "Neplatné údaje hlásenia",
        },
        unauthorized: {
          title: "Bez oprávnenia",
          description: "Vyžaduje sa prihlásenie",
        },
        internal: {
          title: "Chyba spracovania",
          description: "Nastala chyba počas spracovania správy",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Na odosielanie hlásení nemáte oprávnenie",
        },
        notFound: {
          title: "Nenájdené",
          description: "Úloha sa nenašla.",
        },
        network: {
          title: "Chyba siete",
          description: "S koncovým bodom pre hlásenia sa nepodarilo spojiť",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Vyskytla sa neočakávaná chyba",
        },
        unsaved: {
          title: "Neuložené zmeny",
          description: "Zostali neuložené zmeny.",
        },
        conflict: {
          title: "Konflikt",
          description: "Zistil sa konflikt v hlásení",
        },
      },
      success: {
        title: "Hlásenie prijaté",
        description: "Hlásenie o úlohe sa úspešne spracovalo",
      },
    },
  },
};
