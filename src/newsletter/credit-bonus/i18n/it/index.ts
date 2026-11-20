import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Newsletter",
  tags: {
    newsletter: "Newsletter",
    credits: "Crediti",
  },
  enum: {
    offer: {
      available: "Disponibile",
      pendingConfirmation: "In attesa di conferma e-mail",
      active: "Bonus attivo",
      notEligible: "Non disponibile",
    },
  },
  response: {
    offer: "Bonus della newsletter",
    email: "E-mail account",
    bonusCredits: "Crediti bonus al mese",
    freeRefillAt: "Crediti gratuiti ricaricare",
  },
  get: {
    title: "Newsletter Bonus di credito",
    titleShort: "Bonus della newsletter",
    description:
      "Se il tuo account può ancora ottenere il bonus mensile di credito newsletter. Solo i conti.",
  },
  post: {
    title: "Richiedi Newsletter Bonus di credito",
    titleShort: "Rivendica il bonus newsletter",
    description:
      "Iscriviti il tuo account e-mail alla newsletter per crediti extra gratuiti ogni mese. Solo conti, una volta per conto.",
  },
  errors: {
    validation: {
      title: "Richiesta non valida",
      description: "La richiesta non poteva essere elaborata",
    },
    unauthorized: {
      title: "Conto richiesto",
      description:
        "Per il bonus della newsletter serve un account. Registrati gratis o accedi.",
    },
    forbidden: {
      title: "Operazione non consentita",
      description: "Non si può rivendicare questo bonus",
    },
    notFound: {
      title: "Account non trovato",
      description: "Non abbiamo trovato il tuo account",
    },
    internal: {
      title: "Qualcosa di rotto",
      description: "Non poteva controllare il bonus newsletter. Riprova.",
    },
  },
  success: {
    title: "Fatto",
    description: "Bonus di newsletter stato caricato",
  },
  widget: {
    available: "+{{bonusCredits}} crediti gratis ogni mese",
    availableHint:
      "Iscrivi {{email}} alla newsletter. Prima ti invieremo un link di conferma.",
    claim: "Ricevi +{{bonusCredits}} crediti al mese",
    pending:
      "Controlla la posta di {{email}}. Apri il link di conferma per sbloccare +{{bonusCredits}} crediti al mese.",
    active: "Bonus newsletter attivo: +{{bonusCredits}} crediti al mese.",
    notEligible: "Bonus di newsletter non disponibile per questo account.",
    refill: "I crediti gratuiti si rinnovano il {{date}}.",
  },
};
