import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Utenti",

  post: {
    title: "Pulizie di sessione",
    titleShort: "Sessioni pulite",
    description: "Pulire le sessioni e i gettoni degli utenti scaduti",
    tag: "Pulizie di sessione",
    container: {
      title: "Pulizie di sessione",
      description: "Configurare e eseguire la pulizia della sessione",
    },
    fields: {
      sessionRetentionDays: {
        label: "Giorni di conservazione della sessione",
        description: "Numero di giorni per mantenere le sessioni",
      },
      tokenRetentionDays: {
        label: "Giorni di conservazione dei token",
        description: "Numero di giorni per conservare i token",
      },
      batchSize: {
        label: "Dimensione della batch",
        description: "Numero di record da elaborare per lotto",
      },
      dryRun: {
        label: "Correre a secco",
        description: "Correre senza effettivamente cancellare i record",
      },
    },
    response: {
      sessionsDeleted: "Sessioni cancellate",
      tokensDeleted: "Tokens Cancellati",
      totalProcessed: "Totale processato",
      executionTimeMs: "Tempo di esecuzione (ms)",
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description:
          "Devi essere un amministratore per eseguire la pulizia della sessione",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso non consentito",
      },
      server: {
        title: "Errore del server",
        description: "Errore del server interno durante la pulizia",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
      validation: {
        title: "Errore di convalida",
        description: "Configurazione di pulizia non valida",
      },
    },
    success: {
      title: "Pulizia sessione completata",
      description: "Sessioni e gettoni puliti con successo",
    },
  },
  task: {
    name: "user-session-cleanup",
    description:
      "Pulire le sessioni utente scadute per mantenere la sicurezza del sistema",
    purpose:
      "Rimuove le sessioni scadute per mantenere la sicurezza e le prestazioni",
    impact:
      "Migliora le prestazioni e la sicurezza del sistema rimuovendo i dati di sessione stanti",
    rollback: "Rollback non applicabile per le operazioni di pulizia",
  },
  errors: {
    default: "Si è verificato un errore durante la pulizia della sessione",
    execution_failed: {
      title: "Pulizia sessione non riuscita: {{error}}",
      description: "Non pulire sessioni scadute",
    },
    partial_failure: {
      title: "Fallimento di pulizia sessione parziale: {{errors}}",
      description: "Alcune sessioni non potevano essere ripulite",
    },
    unknown_error: {
      title: "Errore di pulizia sessione sconosciuto",
      description:
        "Un errore sconosciuto si è verificato durante la pulizia della sessione",
    },
    invalid_session_retention: {
      title: "Ritenzione della sessione non valida",
      description:
        "Periodo di conservazione della sessione non valido specificato",
    },
    invalid_token_retention: {
      title: "Invalid Token Retenzione",
      description: "Periodo di conservazione dei token non valido specificato",
    },
    invalid_batch_size: {
      title: "Dimensione della bacca non valida",
      description: "Dimensione del lotto non valido specificata per la pulizia",
    },
    validation_failed: {
      title: "Convalida non riuscita",
      description:
        "La convalida della configurazione di pulizia sessione non è riuscita",
    },
  },
  success: {
    title: "Pulizia sessione completata",
    description: "Ripulito con successo le sessioni scadute",
  },
  monitoring: {
    alertTrigger: "Il compito di pulizia della sessione è fallito",
  },
  documentation: {
    overview:
      "Questa attività rimuove le sessioni degli utenti scadute dal sistema per mantenere la sicurezza e le prestazioni",
  },
};
