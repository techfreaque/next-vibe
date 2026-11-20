import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Abbonamenti Sync da Stripe",
    titleShort: "Sincronizzazione Stripe",
    description:
      "Estrarre lo stato, il periodo di fatturazione e i campi di cancellazione da Stripe nelle nostre righe di abbonamento. Scade righe legacy senza Stripe id e un periodo finito. Mai concedere o revocare crediti. Eseguire a secco per impostazione predefinita.",
    fields: {
      subscriptionId: {
        label: "Abbonamento",
        description:
          "Il nostro abbonamento id (uuid) o l'abbonamento Stripe id (sub_...). Lasciare vuoto con 'All'in.",
        placeholder: "sub_... o abbonamento uuid",
      },
      all: {
        label: "Tutti",
        description:
          "Controllare ogni abbonamento che non è già annullato o scaduto.",
      },
      dryRun: {
        label: "Simulazione",
        description: "Anteprima i cambiamenti senza scrivere nulla.",
      },
    },
    response: {
      dryRun: "Simulazione",
      scanned: "Checked",
      changed: "Variazione",
      failed: "Sfigato",
      items: "Abbonamenti",
      item: {
        subscriptionId: "Abbonamento",
        userEmail: "Utente",
        providerSubscriptionId: "Stripe",
        action: "Azione",
        statusBefore: "Stato prima",
        statusAfter: "Stato dopo",
        periodEndBefore: "Periodo di fine prima",
        periodEndAfter: "Periodo di fine dopo",
        note: "Nota",
      },
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Login richiesto",
      },
      validation: {
        title: "Obiettivo mancante",
        description: "Passare un abbonamento id, uno Stripe id, o all=true.",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso all'amministratore richiesto",
      },
      server: {
        title: "Sync ha fallito",
        description: "Non è possibile sincronizzare gli abbonamenti da Stripe",
        detail: "Sincronizzazione dell'abbonamento non riuscita: {{error}}",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Errore inaspettato durante la sincronizzazione",
      },
      conflict: {
        title: "Conflitto",
        description: "L'abbonamento è cambiato durante la sincronizzazione",
      },
      network: {
        title: "Errore di rete",
        description: "Non poteva raggiungere Stripe",
      },
      notFound: {
        title: "Account o sessione non trovati",
        description: "Nessun abbonamento corrisponde a quello id",
        detail: "Nessun abbonamento corrisponde a {{id}}",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Correre o scartare la sincronizzazione in sospeso prima",
      },
      notConfigured: "Stripe non è configurato su questa istanza.",
    },
    success: {
      title: "Sincronizzazione completa",
      description: "Abbonamenti controllati contro Stripe",
    },
    notes: {
      keptCanceled:
        "Stripe dice {{stripeStatus}}; continua a cancellare (mai disdetta).",
      missingInStripe:
        "Non trovato in Stripe; contrassegnato cancellato e Stripe id sgomberato.",
      expiredLegacy:
        "N. Stripe id e il periodo finito {{date}} ; contrassegnato annullato.",
      noStripeIdActivePeriod:
        "No Stripe id, periodo ancora in esecuzione; sinistra come è.",
      notStripe: "Il fornitore non è Stripe; saltato.",
      stripeError: "Errore Stripe: {{error}}",
    },
    widget: {
      submit: "Esegui la sincronizzazione",
      submitting: "Sincronizzazione...",
      preview: "Anteprima: niente scritto",
      applied: "Applicato",
      empty: "Niente da sincronizzare.",
      none: "nessuno",
    },
  },
  enums: {
    action: {
      updated: "Aggiornato",
      unchanged: "In sincronizzazione",
      expired: "Scadenza",
      missingInStripe: "Manca a Stripe",
      skipped: "Asciugata",
      error: "Errore",
    },
  },
};
