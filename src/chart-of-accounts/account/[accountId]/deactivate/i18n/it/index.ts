import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Disattivare Account",
    titleShort: "Disattivare",
    description:
      "Disattivare un account. Non può disattivare gli account di sistema o gli account con le linee di inserimento della rivista postate.",
    accountId: {
      label: "Conto",
      description: "L'account per disattivare",
      placeholder: "Scegli un conto",
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Login richiesto",
      },
      validation: {
        title: "Errore di convalida",
        description: "account non valido ID",
      },
      forbidden: {
        title: "Accesso negato",
        description: "I conti di sistema non possono essere disattivati",
      },
      server: {
        title: "Errore del server",
        description: "Non poteva disattivare l'account",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      conflict: {
        title: "Ha Transazioni",
        description:
          "Non può disattivare un account che ha le linee di entrata del diario",
      },
      network: {
        title: "Errore di rete",
        description: "Non è possibile raggiungere il server",
      },
      notFound: { title: "Non trovato", description: "Account non trovato" },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
    },
    success: {
      title: "Riattivato conto",
      description: "L'account è ora inattivo",
    },
    widget: {
      confirmWarning:
        "Questo account verrà disattivato. Questa azione non può essere annullata per i conti con le transazioni pubblicate.",
      doneLabel: "Fatto",
      confirmTitle: "Disattivare Account?",
      confirmDescription:
        "Questo account sarà disattivato e non può più essere utilizzato per le nuove voci di giornale. Le voci esistenti non sono interessate.",
      confirmButton: "Sì, disattivare",
      cancelButton: "Annulla",
    },
  },
  title: "Disattivare Account",
  description: "Disattivare un account",
  category: "Grafico dei conti",
  tag: "Account",
};
