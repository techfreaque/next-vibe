import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    maintenance: "Údržba",
  },
  post: {
    title: "Obnova zaseknutých odpovedí",
    titleShort: "Zaseknuté odpovede",
    description:
      "Odblokuje vlákna, ktoré zostali v stave streaming po zlyhaní procesu generovania odpovede. Ponechá doterajšiu odpoveď, označí ju ako prerušenú a spustí čakajúce správy. Prebiehajúce odpovede na ktoromkoľvek uzle ponechá nedotknuté.",
    container: {
      title: "Obnova zaseknutých odpovedí",
      description: "Zobraziť alebo odblokovať zaseknuté vlákna",
    },
    fields: {
      localThresholdMinutes: {
        label: "Časový limit pre lokálne vlákna (min)",
        description:
          "Odblokovať lokálne vlákno, ak jeho proces počas tohto času neodoslal signál aktivity",
      },
      remoteThresholdMinutes: {
        label: "Časový limit pre vzdialené vlákna (min)",
        description:
          "Odblokovať vlákno spracúvané na inej inštancii, ak z nej počas tohto času neprišla žiadna aktualizácia",
      },
      batchSize: {
        label: "Najviac vlákien",
        description:
          "Najvyšší počet vlákien na odblokovanie pri jednom spustení",
      },
      dryRun: {
        label: "Skúšobné spustenie",
        description: "Zobraziť zaseknuté vlákna bez zmien",
      },
    },
    response: {
      candidates: "Nájdené zaseknuté vlákna",
      reaped: "Odblokované vlákna",
      lost: "Preskočené: opäť aktívne",
      failed: "Zlyhalo",
      queuedStarted: "Spustené čakajúce správy",
      threadIds: "ID vlákien",
      executionTimeMs: "Čas vykonania (ms)",
    },
    success: {
      title: "Kontrola dokončená",
      description: "Zaseknuté vlákna sa odblokovali",
    },
  },
  interrupted: {
    content:
      "Server sa reštartoval počas generovania odpovede. Doterajšia odpoveď je uložená. Ak chceš pokračovať, skús znova.",
  },
  errors: {
    failed: "Obnova zaseknutých vlákien zlyhala: {{error}}",
    server: {
      title: "Chyba pri obnove vlákien",
      description: "Nepodarilo sa obnoviť zaseknuté vlákna",
    },
  },
  task: {
    name: "Obnova zaseknutých odpovedí",
    description:
      "Každých 5 minút odblokuje vlákna, ktoré zostali zaseknuté po zlyhaní procesu počas generovania odpovede",
  },
};
