import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    maintenance: "Manutenzione",
  },
  post: {
    title: "Pulizia dei media degli ospiti",
    titleShort: "Pulizia dei media degli ospiti",
    description:
      "Eliminare i supporti che gli ospiti generati in chat incognito e strumento standalone viene eseguito una volta che passa la finestra di ritenzione. Solo gli ospiti che non si sono mai iscritti o si sono registrati. I file salvati e i file di account non vengono mai toccati.",
    container: {
      title: "Pulizia dei media degli ospiti",
      description: "Correre o visualizzare in anteprima la pulizia",
    },
    fields: {
      retentionDays: {
        label: "Ritenzione (giorni)",
        description:
          "Eliminare i supporti ospiti più vecchi di questo molti giorni",
      },
      batchSize: {
        label: "Max delezioni",
        description:
          "Limite superiore di file cancellati per eseguire. Il resto aspetta la prossima corsa.",
      },
      dryRun: {
        label: "Simulazione",
        description:
          "Contare e registrare ciò che sarebbe cancellato, eliminare nulla",
      },
    },
    response: {
      cutoff: "Taglio",
      namespacesScanned: "Spazi di nome scansionati",
      storedThreadNamespaces: "Filetti salvati saltati",
      filesScanned: "File scansionati",
      filesDeleted: "File cancellati",
      bytesDeleted: "Bytes cancellato",
      skippedTooNew: "Kept: ritenzione interna",
      skippedUserOwned: "Kept: di proprietà del conto",
      skippedUnowned: "Kept: nessun proprietario",
      skippedAccountLead: "Kept: piombo collegato a un account",
      deferred: "Deferito alla prossima corsa",
      failed: "Sfigato",
      executionTimeMs: "Tempo di esecuzione (ms)",
    },
    success: {
      title: "Pulizia fatta",
      description: "I supporti ospiti esplosivi rimossi",
    },
  },
  errors: {
    failed: "La pulizia dei media degli ospiti non è riuscita: {{error}}",
    server: {
      title: "Errore di pulizia",
      description: "La pulizia dei media degli ospiti non è riuscita",
    },
  },
  task: {
    name: "Pulizia dei file degli ospiti",
    description:
      "Elimina ogni giorno i file scaduti degli ospiti dalle chat in incognito e dalle esecuzioni autonome degli strumenti.",
  },
};
