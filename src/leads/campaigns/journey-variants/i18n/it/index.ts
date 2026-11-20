import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Varianti di viaggio",
  description: "Gestire le registrazioni delle varianti di viaggio email",
  enums: {
    campaignType: {
      leadCampaign: "Campagna di acquisizione contatti",
      newsletter: "Newsletter",
      signupNurture: "Nurture di iscrizione",
      retention: "Retenzione",
      winback: "Winback",
      transactional: "Transazione",
      notification: "Notifica",
      system: "Sistema",
    },
  },
  get: {
    title: "Varianti di viaggio",
    titleShort: "Varianti di viaggio",
    description: "Elenca tutte le varianti di viaggio email registrate",
    response: {
      id: "ID",
      variantKey: "Variante chiave",
      displayName: "Nome dell'esposizione",
      description: "Designazione",
      weight: "Peso",
      active: "Attivo",
      campaignType: "Tipo di campagna",
      sourceFilePath: "Percorso di file sorgente",
      senderName: "Nome del fornitore",
      companyName: "Nome della Società",
      companyEmail: "Email della società",
      checkErrors: "Controllare gli errori",
      createdAt: "Creato a",
      updatedAt: "Aggiornato At",
      items: "Varianti",
      total: "Varianti totali",
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Deve essere l'amministratore",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Nessuna autorizzazione",
      },
      server: {
        title: "Errore del server",
        description: "Non caricate varianti di viaggio",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
      validation: {
        title: "Errore di convalida",
        description: "Parametri della richiesta non validi",
      },
      notFound: {
        title: "Non trovato",
        description: "Account o sessione non trovati",
      },
      conflict: { title: "Conflitto", description: "Conflitto" },
      network: { title: "Errore di rete", description: "Errore di rete" },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Modifiche non salvate",
      },
    },
    success: {
      title: "Varianti caricati",
      description: "Varianti di viaggio caricate con successo",
    },
  },
  post: {
    title: "Registrazione Variante di viaggio",
    titleShort: "Nuovo Variante",
    description: "Registra una nuova variante di viaggio email",
    fields: {
      variantKey: {
        label: "Variante chiave",
        description:
          "Identificatore unico (ad es. MY_VARIANT). Deve corrispondere a una chiave in EmailJourneyVariant enum.",
      },
      displayName: {
        label: "Nome dell'esposizione",
        description: "Nome leggibile per questa variante",
      },
      description: {
        label: "Designazione",
        description: "Che cosa questo viaggio è",
      },
      weight: {
        label: "Peso",
        description:
          "Peso di prova A/B (1-100). Utilizzato solo per le campagne di carico a freddo.",
      },
      campaignType: {
        label: "Tipo di campagna",
        description: "Quale tipo di campagna questa variante è per (opzionale)",
      },
      sourceFilePath: {
        label: "Percorso di file sorgente",
        description:
          "Percorso relativo al file.email.tsx (ad esempio, viaggi/my-variant.email)",
      },
      senderName: {
        label: "Nome del fornitore",
        description:
          "Dal nome indicato nel client di posta elettronica (ad es. Alex da Unbottled)",
      },
      companyName: {
        label: "Nome della Società",
        description: "Nome della Società visualizzato in email footer/template",
      },
      companyEmail: {
        label: "Email della società",
        description:
          "E-mail di contatto dell'azienda mostrata in email footer/template",
      },
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Deve essere l'amministratore",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Nessuna autorizzazione",
      },
      server: {
        title: "Errore del server",
        description: "Non registrate la variante del viaggio",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
      validation: {
        title: "Errore di convalida",
        description: "Chiave o dati di variante non valida",
      },
      notFound: {
        title: "Non trovato",
        description: "Variante chiave non trovata in enum",
      },
      conflict: {
        title: "Conflitto",
        description: "Chiave Variante già registrata",
      },
      network: { title: "Errore di rete", description: "Errore di rete" },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Modifiche non salvate",
      },
    },
    success: {
      title: "Variante Registrato",
      description: "Variante di viaggio registrata con successo",
    },
  },
  patch: {
    title: "Aggiornamento Variante del viaggio",
    titleShort: "Modifica Variante",
    description: "Aggiornare una variante di viaggio e-mail registrata",
    fields: {
      id: {
        label: "Variante ID",
        description: "ID della variante per aggiornare",
      },
      active: {
        label: "Attivo",
        description: "Abilitare o disabilitare questa variante",
      },
      weight: {
        label: "Peso",
        description: "Peso di prova A/B (1-100)",
      },
      displayName: {
        label: "Nome dell'esposizione",
        description: "Nome leggibile per questa variante",
      },
      description: {
        label: "Designazione",
        description: "Che cosa questo viaggio è",
      },
      senderName: {
        label: "Nome del fornitore",
        description: "Dal nome indicato nel client di posta elettronica",
      },
      companyName: {
        label: "Nome della Società",
        description: "Nome della Società visualizzato in email footer/template",
      },
      companyEmail: {
        label: "Email della società",
        description:
          "E-mail di contatto dell'azienda mostrata in email footer/template",
      },
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Deve essere l'amministratore",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Nessuna autorizzazione",
      },
      server: {
        title: "Errore del server",
        description: "Non è riuscito ad aggiornare la variante del viaggio",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
      validation: {
        title: "Errore di convalida",
        description: "Dati di aggiornamento non validi",
      },
      notFound: { title: "Non trovato", description: "Variante non trovato" },
      conflict: { title: "Conflitto", description: "Conflitto" },
      network: { title: "Errore di rete", description: "Errore di rete" },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Modifiche non salvate",
      },
    },
    success: {
      title: "Variante aggiornato",
      description: "Variante di viaggio aggiornata con successo",
    },
  },
  widget: {
    title: "Varianti di viaggio",
    refresh: "Aggiorna",
    register: "Variante di registro",
    noVariants: "Nessuna variante registrata ancora",
    activeLabel: "Attivo",
    inactiveLabel: "Inattivo",
    weightLabel: "Peso",
    campaignTypeLabel: "Tipo di campagna",
    sourceFileLabel: "File di origine",
    toggleActivate: "Attivare",
    toggleDeactivate: "Disattivare",
    checkErrorsLabel: "Controllare gli errori:",
    unsavedChanges: "modifiche non soddisfatte",
    saving: "Salvare...",
    saveChanges: "Salvare le modifiche",
  },
};
