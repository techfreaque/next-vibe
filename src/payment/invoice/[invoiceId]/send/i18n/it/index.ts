import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Fatturazione",
  tags: {
    payment: "pagamento",
    invoice: "fattura",
  },
  post: {
    title: "Emetti fattura",
    titleShort: "Emetti fattura",
    description: "Emetti la bozza e registra il credito.",
    form: {
      title: "Emetti fattura",
      description: "Dopo l’emissione sarà disponibile un link per il cliente.",
    },
    response: {
      success: "Fattura emessa",
      message: "Messaggio di stato",
      viewUrl: "Vista clienti URL",
    },
    errors: {
      invoiceLines:
        "Aggiungi righe con un totale positivo prima di emettere la fattura.",
      posting:
        "Controlla il totale della fattura, la valuta aziendale, il periodo contabile e i conti di registrazione.",
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
        title: "Conflitto",
        description: "La fattura non è in progetto di stato",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Ci sono cambiamenti non rilevati",
      },
    },
    success: {
      title: "Fattura emessa",
      description: "Il link è pronto per essere condiviso con il cliente.",
    },
  },
  invoiceId: {
    label: "Fatturazione ID",
    description: "ID della fattura da inviare",
    placeholder: "Inserire la fattura ID",
  },
  delivery: {
    share: "Condividi la fattura",
    description:
      "Copia il link per il cliente oppure invialo all’indirizzo salvato sulla fattura.",
    send: "Invia per e-mail",
    confirmDescription:
      "Invia il link della fattura al destinatario confermato.",
    recipient: "Destinatario della fattura",
    noRecipient:
      "La fattura non ha un destinatario valido. Puoi comunque copiare il link.",
    status: "Stato dell’e-mail",
    notIssued: "Puoi condividere solo le fatture emesse.",
    recipientChanged:
      "Il destinatario è cambiato o non è disponibile. Riapri la condivisione della fattura.",
    emailSubject: "Fattura {{number}}",
    emailText:
      "{{company}} ha emesso la fattura {{number}}. Aprila qui:\n{{url}}",
    states: {
      ready: "Pronta per l’invio",
      pending:
        "L’invio è in corso o da confermare. I nuovi tentativi sono sospesi.",
      accepted: "Il server di posta ha accettato il messaggio.",
      retryable: "Il server di posta non è stato contattato. Puoi riprovare.",
      uncertain:
        "L’esito dell’invio è incerto. Verifica con il destinatario prima di condividere il link separatamente.",
    },
  },
  widget: {
    back: "Indietro",
    submit: "Emetti fattura",
    sent: "Condividi il link con il cliente per consegnare la fattura.",
    copy: "Copia il link per il cliente",
    copied: "Link copiato",
    copyError:
      "Impossibile copiare il link. Seleziona e copia l’indirizzo qui sopra.",
    viewUrl: "Link di visualizzazione del cliente",
  },
};
