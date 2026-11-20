import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Contatti",
  tags: {
    leads: "Contatti",
    batch: "Batch.",
  },

  patch: {
    title: "Aggiornamento Batch",
    titleShort: "Aggiornamento Batch",
    description: "L'aggiornamento di Batch si basa sui criteri di filtro",
    form: {
      title: "Configurazione di aggiornamento batch",
      description: "Configurare i parametri di aggiornamento batch",
    },
    search: {
      label: "Cerca",
      description: "Ricerca conduce per e-mail o nome commerciale",
      placeholder: "Inserisci e-mail o nome commerciale",
    },
    status: {
      label: "Filtro di stato",
      description: "Filtra i cavi per lo stato corrente",
    },
    currentCampaignStage: {
      label: "Filtro della fase di campagna",
      description: "Filtro conduce dalla fase di campagna corrente",
    },
    source: {
      label: "Filtro sorgente",
      description: "Filtro conduce per fonte",
    },
    scope: {
      label: "Campo d'azione",
      description: "Definire la portata dell'operazione batch",
    },
    dryRun: {
      label: "Correre a secco",
      description: "Anteprima modifiche senza applicarle",
    },
    maxRecords: {
      label: "Max Records",
      description: "Numero massimo di record da elaborare",
    },
    updates: {
      title: "Campi di aggiornamento",
      description: "Specificare quali campi da aggiornare",
      status: {
        label: "Nuovo stato",
        description: "Aggiornare lo stato di contatto a questo valore",
      },
      currentCampaignStage: {
        label: "Nuova fase della campagna",
        description: "Aggiornare la fase della campagna a questo valore",
      },
      source: {
        label: "Nuova fonte",
        description: "Aggiornare la fonte di contatto a questo valore",
      },
      notes: {
        label: "Osservazioni",
        description: "Aggiungi o aggiorna le note per il contatto",
      },
    },
    response: {
      title: "Risposta dell'aggiornamento",
      description: "Dati di risposta di aggiornamento Batch",
      success: "Operazione riuscita",
      totalMatched: "Totale abbinato",
      totalProcessed: "Totale processato",
      totalUpdated: "Totale aggiornato",
      preview: "Anteprima",
      errors: "Errori",
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Autenticazione richiesta per operazioni batch",
      },
      validation: {
        title: "Errore di convalida",
        description:
          "Parametri di richiesta non validi per l'aggiornamento batch",
      },
      server: {
        title: "Errore del server",
        description:
          "Errore del server interno si è verificato durante l'aggiornamento batch",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore sconosciuto si è verificato durante l'aggiornamento batch",
      },
      network: {
        title: "Errore di rete",
        description:
          "Errore di rete si è verificato durante l'aggiornamento batch",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso vietato per operazioni batch",
      },
      notFound: {
        title: "Non trovato",
        description: "Risorse non trovate per l'aggiornamento batch",
      },
      conflict: {
        title: "Conflitto",
        description:
          "Il conflitto di dati si è verificato durante l'aggiornamento batch",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Ci sono modifiche non salvate nell'aggiornamento batch",
      },
    },
    success: {
      title: "Aggiornamento del successo",
      description:
        "Funzionamento di aggiornamento batch completato con successo",
    },
  },
  delete: {
    title: "Batch Elimina",
    titleShort: "Batch Elimina",
    description: "Batch elimina i cavi in base ai criteri di filtro",
    form: {
      title: "Batch Elimina configurazione",
      description: "Configurare i parametri di eliminazione batch",
    },
    search: {
      label: "Cerca",
      description: "Ricerca conduce per e-mail o nome commerciale",
    },
    status: {
      label: "Filtro di stato",
      description: "Filtra i cavi per lo stato corrente",
    },
    confirmDelete: {
      label: "Conferma Cancella",
      description: "Confermare che si desidera eliminare i lead selezionati",
    },
    dryRun: {
      label: "Correre a secco",
      description:
        "Cancellazioni di anteprima senza effettivamente rimuovere i record",
    },
    maxRecords: {
      label: "Max Records",
      description: "Numero massimo di record da eliminare",
    },
    response: {
      title: "Eliminare la risposta",
      description: "Batch cancellare i dati di risposta",
      success: "Operazione riuscita",
      totalMatched: "Totale abbinato",
      totalProcessed: "Totale processato",
      totalDeleted: "Totale cancellato",
      preview: "Anteprima",
      errors: "Errori",
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description:
          "Autenticazione richiesta per operazioni di eliminazione batch",
      },
      validation: {
        title: "Errore di convalida",
        description:
          "Parametri di richiesta non validi per la cancellazione del lotto",
      },
      server: {
        title: "Errore del server",
        description:
          "Errore del server interno si è verificato durante l'eliminazione batch",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore sconosciuto si è verificato durante l'eliminazione del lotto",
      },
      network: {
        title: "Errore di rete",
        description:
          "Errore di rete si è verificato durante l'eliminazione batch",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso vietato per operazioni di eliminazione batch",
      },
      notFound: {
        title: "Non trovato",
        description: "Risorse non trovata per lotto cancellare",
      },
      conflict: {
        title: "Conflitto",
        description:
          "Il conflitto di dati si è verificato durante l'eliminazione batch",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Ci sono modifiche non salvate nel lotto eliminare",
      },
    },
    success: {
      title: "Eliminare il successo",
      description: "operazione di cancellazione Batch completata con successo",
    },
  },
  widget: {
    update: {
      headerTitle: "Aggiornamento batch",
      emptyStateTitle: "Aggiornamento batch",
      emptyStateDescription:
        "Applicare un aggiornamento del campo a molti lead in una volta basato su criteri di filtro. Uso",
      emptyStateDescriptionStrong: "Correre a secco",
      emptyStateDescriptionSuffix:
        "a anteprima che conduce sarà influenzato prima di commettere modifiche.",
      emptyStateTip1:
        "Impostare filtri e fare clic su Invia per eseguire un'anteprima a secco prima",
      emptyStateTip2:
        "Deseleziona Dry Run per applicare le modifiche per reale",
      highVolumeTitle: "Grande lotto: {{count}} porta abbinati",
      highVolumeDescription:
        "Ciò influenzerà un gran numero di record. Verificare attentamente l'anteprima prima di disabilitare Dry Run e presentarsi per reale.",
      partialBatchTitle: "lotto parziale elaborato",
      partialBatchDescription:
        "{{processed}} di {{matched}} sono stati elaborati i cavi corrispondenti. Aumentare Max Records o eseguire di nuovo per elaborare di più.",
      successTitle: "Operazione di Batch completata",
      failureTitle: "operazione di Batch fallito",
      statMatched: "Corrispondenza",
      statProcessed: "Elaborazione",
      statUpdated: "Aggiornato",
      btnRunAgain: "Correre di nuovo",
      btnViewAllAffected: "Visualizza tutti i Contatti interessati",
      btnViewInList: "Visualizza in Lista",
      dryRunPreviewTitle:
        "Anteprima di corsa a secco (i cavi {{count}} sarebbero colpiti)",
      leadFallback: "Contatto {{number}}",
      errorsTitle: "Errore(i) {{count}}",
      errorRow: "Contatto {{leadId}}: {{error}}",
      sectionFilter: "Criteri di filtro",
      sectionUpdates: "Campi di aggiornamento",
      sectionSettings: "Impostazioni di funzionamento",
      activeFiltersLabel: "Filtri attivi dall'elenco (preriempiti)",
      filterSearch: "Cerca",
      submitButton: "Applicare aggiornamenti",
      submitButtonLoading: "Applicare...",
    },
    delete: {
      headerTitle: "Batch Elimina Contatto",
      warningTitle:
        "Avvertenza: {{count}} lead verrà cancellato definitivamente",
      warningTitlePlural:
        "Avvertenza: i cavi {{count}} verranno eliminati in modo permanente",
      warningDescription:
        "Questa azione non può essere annullata. Tutti i dati per i cavi corrispondenti verranno rimossi in modo permanente. Disabilita Dry Run e conferma di procedere.",
      successTitle: "Cancellazione completata",
      failureTitle: "Il fallimento della cancellazione",
      statMatched: "Corrispondenza",
      statDeleted: "Cancellato",
      btnRunAgain: "Correre di nuovo",
      btnViewRemainingLeads: "Visualizzare i comandi rimanenti",
      previewTitle: "I cavi {{count}} verranno eliminati in modo permanente",
      leadFallback: "Contatto {{number}}",
      errorRow: "Contatto {{leadId}}: {{error}}",
      sectionFilter: "Criteri di filtro",
      sectionSettings: "Elimina impostazioni",
      activeFiltersLabel: "Filtri attivi dall'elenco (preriempiti)",
      filterSearch: "Cerca",
      submitButton: "Eliminare i lead",
      submitButtonLoading: "Deleting...",
    },
  },
  enums: {
    batchOperationScope: {
      currentPage: "Pagina corrente",
      allPages: "Tutte le pagine",
    },
    leadStatus: {
      new: "Nuovo",
      pending: "Finanziamenti",
      campaignRunning: "Campagna in corso",
      websiteUser: "Utente del Sito",
      newsletterSubscriber: "Iscriviti alla newsletter",
      inContact: "In contatto",
      signedUp: "Firmato",
      subscriptionConfirmed: "Abbonamento Confermato",
      unsubscribed: "Iscrizione annullata",
      bounced: "Bounce",
      invalid: "Non valido",
    },
    emailCampaignStage: {
      notStarted: "Non iniziato",
      initial: "Contatto iniziale",
      followup1: "Seguito 1",
      followup2: "Seguito 2",
      followup3: "Seguito 3",
      nurture: "Nurture",
      reactivation: "Riattivazione",
    },
    leadSource: {
      website: "Sito web",
      socialMedia: "Social Media",
      emailCampaign: "Campagna di email",
      referral: "Inviti",
      csvImport: "Importazione di CSV",
    },
  },
  email: {
    admin: {
      batchUpdate: {
        title: "Aggiornamento batch completo",
        subject: "Risultati di aggiornamento Batch",
        preview: "I cavi {{totalProcessed}} sono stati elaborati",
        message:
          "L'operazione di aggiornamento batch è completata con {{totalProcessed}} conduce elaborati.",
        operationSummary: "Riepilogo delle operazioni",
        totalMatched: "Totale abbinato",
        totalProcessed: "Totale processato",
        totalUpdated: "Totale aggiornato",
        errors: "Errori",
        dryRunNote:
          "Questa era una corsa a secco - non sono state apportate modifiche effettive.",
        viewLeads: "Visualizza Contatto Aggiornato",
        error: {
          noData: "Nessun dato di aggiornamento batch disponibile",
        },
      },
      batchDelete: {
        title: "Batch Eliminare Completa",
        subject: "Eliminare i risultati",
        preview:
          "I cavi {{totalProcessed}} sono stati elaborati per la cancellazione",
        message:
          "L'operazione di eliminazione batch è completata con {{totalProcessed}} conduce elaborati.",
        operationSummary: "Riepilogo delle operazioni",
        totalMatched: "Totale abbinato",
        totalProcessed: "Totale processato",
        totalDeleted: "Totale cancellato",
        errors: "Errori",
        dryRunNote:
          "Questa era una pista asciutta - non sono state fatte delle cancellazioni reali.",
        viewLeads: "Visualizza Contatto",
        error: {
          noData: "Nessun lotto elimina i dati disponibili",
        },
      },
    },
    error: {
      general: {
        internal_server_error: "Si è verificato un errore del server interno",
      },
    },
  },
};
