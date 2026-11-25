import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Fatturazione",
  tags: {
    payment: "pagamento",
    invoice: "fattura",
    ar: "A.",
    creditNote: "credito-nota",
  },
  post: {
    title: "Creare una nota di credito",
    titleShort: "Nota di credito",
    description:
      "Emetti una nota di credito totale o parziale per una fattura registrata. La nota storna il credito, il ricavo e l’IVA corrispondenti.",
    form: {
      title: "Creare una nota di credito",
      description: "Emettere un credito contro una fattura esistente",
    },
    response: {
      success: "Nota di credito creata",
      message: "Messaggio di stato",
      creditNote: {
        title: "Nota di credito",
        subtitle: "Dati della nota di credito",
        id: "Nota di credito ID",
        invoiceId: "Fatturazione originale ID",
        companyId: "Società ID",
        currency: "Valuta",
        status: "Stato",
        amount: "Importo",
        reason: "Motivazione",
        createdAt: "Creato a",
        updatedAt: "Aggiornato At",
      },
    },
    errors: {
      creditLines:
        "Inserisci quantità positive e usa le aliquote IVA della fattura originale.",
      creditLimit:
        "L’importo supera l’imponibile, l’IVA o il totale ancora stornabile della fattura originale.",
      originalPosting:
        "Riconcilia la scrittura della fattura originale prima di emettere la nota di credito.",
      posting:
        "Controlla la valuta aziendale, il periodo contabile aperto e i conti della scrittura originale.",
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
        title: "Non c'è credito",
        description:
          "Solo le fatture OPEN o PAID possono avere note di credito",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Ci sono cambiamenti non rilevati",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "Nota di credito creata e voce di giornale postata",
    },
    widget: {
      back: "Indietro",
      submit: "Creare una nota di credito",
    },
  },
  invoiceId: {
    label: "Fatturazione ID",
    description: "La fattura viene accreditata",
    placeholder: "Inserire la fattura ID",
  },
  companyId: {
    label: "Società ID",
    description: "Società che emette la nota di credito",
    placeholder: "Entra in azienda ID",
  },
  reason: {
    label: "Motivazione",
    description: "Perché questo credito viene rilasciato",
    placeholder: "Descrivere il motivo del credito",
  },
  lineItems: {
    label: "Elementi di linea",
    description:
      "Linee di credito parziali opzionali. Se omesso, viene applicato il credito completo.",
    placeholder: "",
  },
};
