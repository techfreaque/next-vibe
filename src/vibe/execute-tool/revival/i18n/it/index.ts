import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    unexpectedError:
      "Si è verificato un errore inaspettato: {{error}}. Per favore, riprovate.",
    modelNotResolved:
      "Non poteva risolvere un modello per questo thread - il flusso non può essere rianimato.",
  },
  post: {
    title: "Revival",
    titleShort: "Revival",
    description:
      "Prosegue un thread esistente dopo che un'attività asincrona completa (callbackMode =wait o wakeUp). Pianificato come un compito di cron di un colpo da TaskCompletion.handle; l'impulso di cron lo esegue sull'istanza corretta.",
    fields: {
      threadId: {
        title: "File ID",
        description: "UUID del filo per continuare.",
      },
      favoriteId: {
        title: "ID preferito",
        description: "Salvato favorito per caricare modello e abilità da.",
      },
      modelId: {
        title: "Modello ID",
        description: "Modello AI per la curva ripresa.",
      },
      skillId: {
        title: "ID della skill",
        description: "Competenze/persona per la curva ripresa.",
      },
      callbackMode: {
        title: "Modalità di callback",
        description:
          "attendere o wakeUp. determina il comportamento di rinascita.",
      },
      wakeUpToolMessageId: {
        title: "Messaggio degli strumenti ID",
        description:
          "Originale messaggio di chiamata strumento ID con il risultato riempito.",
      },
      wakeUpTaskId: {
        title: "Attività di WakeUp ID",
        description:
          "Originaria del compito cron wakeUp, cancellato dopo la rinascita.",
      },
      resumeTaskId: {
        title: "Compito di rinascita ID",
        description:
          "Questo compito di cron revival stesso, cancellato dopo la rinascita.",
      },
      resumed: {
        title: "Risoluzioni",
        description: "Se il filo è stato continuato con successo.",
      },
      lastAiMessageId: {
        title: "Ultimo messaggio AI ID",
        description: "UUID del messaggio di assistente finale generato.",
      },
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description:
          "Parametri non validi. threadId deve essere un valido UUID.",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Autenticazione richiesta.",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso negato.",
      },
      notFound: {
        title: "Non trovato",
        description: "Filo o modello non trovato.",
      },
      internal: {
        title: "Errore del server",
        description: "Errore interno durante il risveglio del flusso.",
      },
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete.",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore inaspettato.",
      },
      unsaved: {
        title: "Modifiche non salvate",
        description: "Conflitto con cambiamenti non salvati.",
      },
      conflict: {
        title: "Conflitto",
        description: "Si è verificato un conflitto.",
      },
    },
    success: {
      title: "Filetto rivitalizzato",
      description: "Il filo AI è stato continuato con successo.",
    },
  },
};
