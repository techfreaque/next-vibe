import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Ottenere il Referral di contatto corrente",
  titleShort: "Referral del contatto",
  description:
    "Restituisce il codice di riferimento legato al comando corrente, se presente",
  tag: "Inviti",
  noReferral: "Nessun invito associato a questo contatto",
  response: {
    referralCode: "Codice invito",
    referralLabel: "Etichetta di riferimento",
    subscriptionBonusCredits: "Crediti bonus con il tuo primo piano",
  },
  errors: {
    validation: {
      title: "Errore di convalida",
      description: "Richiesta non valida",
    },
    unauthorized: {
      title: "Autenticazione richiesta",
      description: "Accedi per continuare",
    },
    forbidden: { title: "Accesso negato", description: "Accesso negato" },
    notFound: { title: "Non trovato", description: "Risorsa non trovata" },
    conflict: { title: "Conflitto", description: "Conflittuale dei dati" },
    serverError: {
      title: "Errore del server",
      description: "Errore del server interno",
    },
    unknown: {
      title: "Errore sconosciuto",
      description: "Si è verificato un errore imprevisto",
    },
    network: {
      title: "Errore di rete",
      description: "Si è verificato un errore di rete",
    },
    unsavedChanges: {
      title: "Modifiche non salvate",
      description: "Hai modifiche non salvate",
    },
  },
  success: {
    title: "Referral Code recuperato",
    description:
      "Corrente codice di riferimento del contatto recuperato con successo",
  },
};
