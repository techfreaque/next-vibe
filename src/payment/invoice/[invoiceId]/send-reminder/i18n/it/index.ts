import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Fatturazione",
  tags: {
    payment: "pagamento",
    invoice: "fattura",
    ar: "A.",
  },
  post: {
    title: "Prepara un sollecito di pagamento",
    titleShort: "Prepara sollecito",
    description:
      "Prepara una bozza con il saldo scaduto e un messaggio facoltativo.",
    form: {
      title: "Prepara sollecito",
      description: "Verifica il saldo prima di condividere la bozza.",
    },
    response: {
      success: "Bozza del sollecito pronta",
      message: "Messaggio di stato",
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      validation: {
        title: "Errore di convalida",
        description: "Parametri non validi",
      },
      server: {
        title: "Errore del server",
        description: "Si è verificato un errore interno del server",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso non consentito",
      },
      notFound: {
        title: "Non trovato",
        description: "Fattura non trovata",
      },
      conflict: {
        title: "Non esagerare.",
        description:
          "La fattura deve essere aperta e scaduta, con un saldo da pagare.",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Ci sono cambiamenti non rilevati",
      },
    },
    success: {
      title: "Bozza del sollecito pronta",
      description:
        "Il sollecito è salvato nella cronologia della fattura ed è pronto da condividere con il cliente.",
    },
  },
  invoiceId: {
    label: "Fatturazione ID",
    description: "ID della fattura indebita",
    placeholder: "Inserire la fattura ID",
  },
  message: {
    label: "Messaggio personalizzato",
    description:
      "Messaggio personalizzato opzionale da includere nel promemoria",
    placeholder: "Aggiungi una nota personale al promemoria...",
  },
  widget: {
    copy: "Copia il sollecito",
    copied: "Sollecito copiato",
    copyFailed: "Copia non riuscita. Riprova",
    download: "Scarica il sollecito",
    subject: "Sollecito per la fattura {{number}}",
    body: "Il saldo da pagare è {{amount}}. Il pagamento era previsto entro il {{date}}.",
    back: "Indietro",
    submit: "Prepara sollecito",
    reminderSent:
      "Il sollecito è salvato nella cronologia della fattura ed è pronto da condividere con il cliente.",
    viewInvoice: "Visualizza Fattura",
  },
};
