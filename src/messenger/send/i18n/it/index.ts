/**
 * English translations for unified Messenger Send endpoint
 */

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Invia messaggio",
  titleShort: "Invia messaggio",
  description:
    "Invia un messaggio tramite qualsiasi canale (Email, SMS, WhatsApp, Telegram)",
  category: "Messaggistica",
  tag: "Invia",

  container: {
    title: "Invia messaggio",
    description: "Inviare tramite un account messenger configurato",
  },

  accountId: {
    label: "Conto del Messaggero",
    description: "Account da inviare tramite",
    placeholder: "Selezionare l'account UUID",
  },
  to: {
    label: "Recipiente",
    description: "Indirizzo e-mail, numero di telefono, o chat ID",
    placeholder: "user@example.com o +12025551234",
  },
  toName: {
    label: "Nome del destinatario",
    description: "Visualizzazione del nome del destinatario (opzionale)",
    placeholder: "John Doe",
  },
  subject: {
    label: "Oggetto",
    description: "Linea del soggetto (solo e-mail, opzionale per altri canali)",
    placeholder: "Il tuo soggetto qui...",
  },
  text: {
    label: "Messaggio",
    description:
      "Corpo di testo normale - usato per SMS / WhatsApp /Telegram; errore di posta elettronica",
    placeholder: "Inserisci il tuo messaggio...",
  },
  html: {
    label: "Contenuto di HTML",
    description:
      "Corpo HTML (solo per e-mail, facoltativo - ritorna al testo se omesso)",
    placeholder: "<p> Inserisci il contenuto di e-mail HTML... </p>",
  },
  senderName: {
    label: "Nome del fornitore",
    description: "Visualizza il nome del mittente (solo e-mail, facoltativo)",
    placeholder: "La tua azienda",
  },
  replyTo: {
    label: "Rispondete",
    description: "Indirizzo di risposta (solo e-mail, facoltativo)",
    placeholder: "support@example.com",
  },
  leadId: {
    label: "ID del contatto",
    description: "Lead associato per il monitoraggio (facoltativo)",
    placeholder: "UUID",
  },
  campaignId: {
    label: "Campagna ID",
    description: "Campagna associata per il tracciamento (opzionale)",
    placeholder: "UUID",
  },

  response: {
    title: "Invia il Risultato",
    description: "Risultato dell'operazione di invio",
    messageId: { label: "Messaggio ID" },
    accountName: { label: "Account" },
    channel: { label: "Canale" },
    provider: { label: "Fornitore" },
    sentAt: { label: "Inviato a" },
  },

  errors: {
    validation: {
      title: "Errore di convalida",
      description: "Si prega di controllare il vostro input e riprovare",
    },
    unauthorized: {
      title: "Autenticazione richiesta",
      description: "Non hai il permesso di inviare messaggi",
    },
    server: {
      title: "Errore del server",
      description:
        "Si è verificato un errore del server interno durante l'invio",
      detail: "Invia fallito: {{error}}",
    },
    unknown: {
      title: "Errore sconosciuto",
      description: "Si è verificato un errore imprevisto",
    },
    forbidden: {
      title: "Accesso negato",
      description: "L'accesso a questa risorsa è vietato",
    },
    network: {
      title: "Errore di rete",
      description: "Si è verificato un errore di rete durante l'invio",
    },
    notFound: {
      title: "Account Non trovato",
      description: "L'account messenger specificato non è stato trovato",
    },
    conflict: {
      title: "Conflitto",
      description: "Richiedi conflitti con i dati esistenti",
    },
    unsavedChanges: {
      title: "Modifiche non salvate",
      description: "Hai modifiche non salvate",
    },
  },

  success: {
    title: "Messaggio",
    description: "Il tuo messaggio è stato inviato con successo",
  },
};
