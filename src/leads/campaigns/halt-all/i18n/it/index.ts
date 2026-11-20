import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Arrestare tutte le campagne",
  description: "Interrompere tutte le campagne e-mail attive",
  post: {
    title: "Arrestare tutte le campagne",
    titleShort: "Arresto delle campagne",
    description:
      "Interrompere immediatamente tutte le campagne e-mail attive e annullare in attesa di inviare",
    fields: {
      confirm: {
        label: "Confermare l'arresto",
        description:
          "Controllare per confermare che si desidera fermare tutte le campagne",
      },
      reason: {
        label: "Motivazione",
        description: "Motivo di arresto (opzionale)",
      },
    },
    response: {
      halted: "Campagne bloccate",
      emailsCancelled: "E-mail cancellate",
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
        description: "Non riuscita a fermare le campagne",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
      validation: {
        title: "Errore di convalida",
        description: "La conferma deve essere controllata",
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
      title: "Campagne arretrate",
      description: "Tutte le campagne sono state arrestate con successo",
    },
  },
  widget: {
    title: "Arresto di emergenza",
    description:
      "Interrompi immediatamente tutte le campagne e-mail attive. Utilizzare questo in caso di errori o problemi urgenti.",
    haltButton: "Arrestare tutte le campagne",
    halting: "Arresto...",
    confirmTitle: "Arresto di tutte le campagne?",
    confirmDescription:
      "Questo fermerà immediatamente tutte le campagne e-mail attive e annullerà le email in sospeso. Questa azione non può essere annullata.",
    confirmButton: "Si', basta tutto.",
    cancelButton: "Annulla",
    done: "Arresto",
  },
};
