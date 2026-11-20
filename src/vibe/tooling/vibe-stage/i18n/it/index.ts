import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Vibe Stage",
  titleShort: "Vibe Stage",
  description:
    "I file della caldaia a stadio automatico (route.ts, i18n/*/index.ts) che passano i controlli del modello. Anche le fasi di importazione-solo modifiche in qualsiasi file, o parzialmente stadi solo gli scassi di importazione da file di scambio misto.",

  fields: {
    dryRun: {
      label: "Correre a secco",
      description:
        "Anteprima che i file sarebbero in scena senza effettivamente eseguire git add",
    },
    paths: {
      label: "Limiti ai percorsi",
      description:
        "Considerare solo i candidati sotto questi percorsi. Lasciare vuoto per eseguire la scansione di tutti i cambiamenti instabili.",
      placeholder: "ad esempio. src",
    },
  },

  response: {
    staged: "Fase",
    partiallyStaged: "Partialmente in scena (solo le importazioni)",
    skipped: "Asciutto (violazioni)",
    renamed: "Rinominati (movimenti)",
    deleted: "Eliminato (generato/fissioni)",
    noChanges: "Nessun file scenici trovati nell'albero di lavoro",
    dryRunNote:
      "Corsa a secco - nessun file è stato effettivamente messo in scena",
  },

  errors: {
    validation: {
      title: "Parametri non validi",
      description: "I parametri dello stadio dell'atmosfera non sono validi",
    },
    internal: {
      title: "Errore interno",
      description:
        "Si è verificato un errore durante l'esecuzione della fase dell'atmosfera",
    },
    unauthorized: {
      title: "Autenticazione richiesta",
      description: "Devi essere connesso per eseguire la fase dell'atmosfera",
    },
    forbidden: {
      title: "Accesso negato",
      description: "L'accesso alla fase dell'atmosfera è vietato",
    },
    notFound: {
      title: "Non trovato",
      description: "Nessun archivio git trovato",
    },
    server: {
      title: "Errore del server",
      description:
        "Un errore del server si è verificato durante la fase dell'atmosfera",
    },
    unknown: {
      title: "Errore sconosciuto",
      description:
        "Un errore sconosciuto si è verificato durante la fase dell'atmosfera",
    },
    unsaved: {
      title: "Modifiche non salvate",
      description: "Rilevamento delle modifiche non rilevate",
    },
    conflict: {
      title: "Conflitto",
      description:
        "Un conflitto si è verificato durante la fase dell'atmosfera",
    },
  },

  success: {
    title: "Fase completa",
    description: "I file di Boilerplate hanno messo in scena con successo",
  },

  widget: {
    title: "Vibe Stage",
    subtitle: "Auto-stadio caldaia file che passano i controlli del modello",
    submit: "Fase di esecuzione",
    dryRun: "Correre a secco",
    staged: "Fase",
    partiallyStaged: "Particolare allestimento",
    skipped: "Asciugata",
    renamed: "Rinominato",
    deleted: "Cancellato",
    stagedCount: "file in fase",
    partiallyStaged_count: "file parzialmente in scena (solo le importazioni)",
    skippedCount: "file saltati (violazioni)",
    renamedCount: "mosse in scena",
    deletedCount: "delle delezioni",
    renameFile: "spostato",
    deleteFile: "rimosso",
    noChanges: "Nessun file scenico trovato",
    noChangesHint:
      "I file di Boilerplate, le modifiche di importazione o i file con scassi di importazione compariranno qui",
    dryRunBadge: "Correre a secco",
    dryRunNote: "Anteprima solo. nessun file è stato messo in scena",
    cleanFile: "pulito",
    partialFile: "Importazioni solo",
    violationsFile: "violazioni",
    loading: "Scansione albero di lavoro...",
  },
};
