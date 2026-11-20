import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Inviti",
  tags: {
    referral: "referral",
    admin: "admin",
  },
  post: {
    title: "Bonus Codice Referral",
    titleShort: "Codice Bonus",
    description:
      "Impostare i crediti bonus una volta un codice di riferimento dà le persone che porta. Pagato quando iniziano il loro primo piano pagato, mai su iscrizione gratuita. 0 rimuove il bonus.",
    fields: {
      code: {
        label: "Codice invito",
        description: "Il codice da modificare (caso non importa)",
        placeholder: "krysalid",
      },
      bonusCredits: {
        label: "Crediti bonus",
        description:
          "Crediti concessi una volta con il primo piano pagato. 0 = nessun bonus.",
        placeholder: "100",
      },
    },
    response: {
      code: "Codice",
      ownerEmail: "Codice proprietario",
      previousBonusCredits: "Bonus precedente",
      subscriptionBonusCredits: "Crediti bonus",
    },
    widget: {
      back: "Indietro",
      hint: 'Mostrato sull\'iscrizione come "+N bonus credits con il tuo primo abbonamento". Concessa una volta per utente.',
      submit: "Risparmiare bonus",
      set: "{{code}} ({{owner}}): + crediti {{credits}} con il primo piano (era {{previous}}).",
      cleared: "{{code}} ({{owner}}): nessun bonus (era {{previous}}).",
    },
  },
  errors: {
    validation: {
      title: "Input non valido",
      description: "Controllare il codice e l'importo del credito",
    },
    unauthorized: {
      title: "Non firmato",
      description: "Accedi come amministratore per impostare bonus di codice",
    },
    forbidden: {
      title: "Admins solo",
      description: "Solo gli amministratori possono impostare bonus di codice",
    },
    notFound: {
      title: "Account o sessione non trovati",
      description: "Il codice non esiste",
    },
    conflict: {
      title: "Conflitto",
      description: "Il codice è cambiato nel frattempo, riprovare",
    },
    server: {
      title: "Errore del server",
      description: "Non poteva salvare il bonus",
    },
    network: {
      title: "Errore di rete",
      description: "Richiesta non ha raggiunto il server",
    },
    unknown: {
      title: "Errore sconosciuto",
      description: "Qualcosa di imprevisto è fallito",
    },
    unsavedChanges: {
      title: "Modifiche non salvate",
      description: "Salvare o scartare le modifiche prima",
    },
    codeNotFound: "Codice di riferimento {{code}} non esiste",
  },
  success: {
    title: "Salvataggio",
    description: "Codice bonus aggiornato",
  },
};
