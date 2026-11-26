import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    country: {
      AT: "Austria (ÖKR)",
      DE: "Germania (SKR03)",
      XX: "Modello IFRS generico",
      SK: "Slovacchia (Rámcová účtová osnova)",
    },
  },
  post: {
    title: "Configura il piano dei conti",
    titleShort: "Configura il piano dei conti",
    description: "Completa i conti aziendali con un modello standard.",
    companyId: {
      label: "Azienda",
      description: "Scegli l’azienda da configurare.",
      placeholder: "Scegli un’azienda",
    },
    country: {
      label: "Modello del piano dei conti",
      description: "Scegli la struttura dei conti da aggiungere.",
      placeholder: "Scegli un modello",
    },
    response: {
      created: "Conti creati",
      skipped: "Conti mantenuti",
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description:
          "Devi essere connesso per impostare un grafico degli account",
      },
      validation: {
        title: "Errore di convalida",
        description: "Controlla l’azienda e il modello del piano dei conti.",
      },
      forbidden: {
        title: "Accesso negato",
        description:
          "Solo i proprietari e gli amministratori della società possono creare account",
      },
      server: {
        title: "Errore del server",
        description: "Prova ad applicare di nuovo il modello.",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      conflict: {
        title: "Controlla la configurazione",
        description:
          "Aggiorna i conti dell’azienda prima di applicare il modello.",
      },
      network: {
        title: "Errore di rete",
        description: "Non è possibile raggiungere il server",
      },
      notFound: {
        title: "Template Non trovato",
        description:
          "Nessun grafico del modello di account trovato per questo paese",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
    },
    success: {
      title: "Piano dei conti pronto",
      description:
        "Il modello è stato applicato. Controlla i conti aggiunti e quelli mantenuti.",
    },
    widget: {
      review: "Controlla la configurazione",
      previewLoading: "Ricerca dei conti esistenti…",
      previewFailed: "Il numero dei conti esistenti non è disponibile.",
      existing: "Conti esistenti: {{count}}.",
      empty: "Questa azienda non ha ancora conti contabili.",
      consequences:
        "La configurazione aggiunge i codici mancanti nel piano dei conti e conserva i dati esistenti.",
      submit: "Aggiungi i conti dal modello",
      back: "Indietro",
      viewAccounts: "Apri il piano dei conti",
      viewPeriods: "Vedi i periodi contabili",
    },
  },
  title: "Grafico della configurazione dei conti",
  description: "Inizializzare gli account aziendali dal modello",
  category: "Grafico dei conti",
  tag: "Configurazione iniziale",
};
