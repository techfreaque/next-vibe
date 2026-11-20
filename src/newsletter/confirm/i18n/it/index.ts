import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Newsletter",
  tags: {
    newsletter: "Newsletter",
  },
  token: {
    label: "Codice di conferma",
    description: "Il codice nel link dell’email di benvenuto",
    placeholder: "Incolla il codice ricevuto via email",
  },
  response: {
    confirmed: "Confermato",
    email: "Email",
    bonusCredits: "Crediti bonus al mese",
  },
  post: {
    title: "Conferma l’email per la newsletter",
    titleShort: "Conferma l’email",
    description:
      "Confermare un indirizzo di newsletter con il codice dall'email di benvenuto. Sblocca il bonus mensile di free-credit.",
    errors: {
      validation: {
        title: "Codice non valido",
        description: "Il codice di conferma è mancante o malformato",
      },
      notFound: {
        title: "Link scaduto o invalido",
        description:
          "Il link di conferma non è valido. Iscriviti di nuovo per riceverne uno nuovo.",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso non consentito",
      },
      internal: {
        title: "La conferma non è riuscita",
        description: "C'e' qualcosa che non va. Prova di nuovo il link.",
      },
    },
    success: {
      title: "Email confermata",
      description: "Il bonus si applica al tuo account gratuito",
    },
  },
  widget: {
    heroTitle: "Un clic. +{{bonusCredits}} crediti ogni mese.",
    heroDescription:
      "Conferma l’indirizzo. Se hai un account gratuito, il bonus si aggiunge subito ai tuoi crediti.",
    confirmButton: "Conferma la mia email",
    confirming: "Conferma in corso…",
    confirmedTitle:
      "Email confermata. +{{bonusCredits}} crediti al mese sul tuo account gratuito.",
    confirmedDescription:
      "Hai già effettuato l’accesso? Il bonus è già nel tuo saldo gratuito e si rinnova ogni mese finché resti iscritto. Se non hai un account, registrati gratis in questo browser per sbloccarlo.",
    startChatting: "Iniziare a chattare",
  },
};
