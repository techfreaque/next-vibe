import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Stato della Newsletter",
  titleShort: "Stato della Newsletter",
  description:
    "Controlla lo stato dell'abbonamento alla newsletter per un indirizzo email",
  category: "Newsletter",
  tags: {
    status: "Stato",
  },
  form: {
    title: "Controllare lo stato della Newsletter",
    description:
      "Inserisci un indirizzo e-mail per controllare lo stato dell'abbonamento alla newsletter",
  },
  email: {
    label: "Indirizzo email",
    description: "L'indirizzo email per verificare lo stato dell'abbonamento",
    placeholder: "user@example.com",
    helpText: "Lasciare vuoto per controllare il proprio abbonamento",
  },
  response: {
    subscribed: "Stato di abbonamento",
    status: "Stato attuale",
    confirmed: "Confermato",
    email: "Indirizzo email",
  },
  errors: {
    validation: {
      title: "E-mail non valida",
      description: "Si prega di fornire un indirizzo email valido",
    },
    internal: {
      title: "Errore interno",
      description:
        "Si è verificato un errore durante il controllo dello stato dell'abbonamento",
      detail: "Controllo dello stato dell'abbonamento non riuscito: {{error}}",
    },
    unauthorized: {
      title: "Autenticazione richiesta",
      description:
        "Non sei autorizzato a controllare lo stato dell'abbonamento",
    },
    notFound: {
      title: "Non trovato",
      description:
        "Nessuna informazione di sottoscrizione trovata per questo indirizzo email",
    },
  },
  success: {
    title: "Stato recuperato",
    description:
      "Stato di abbonamento della newsletter recuperato con successo",
  },
};
