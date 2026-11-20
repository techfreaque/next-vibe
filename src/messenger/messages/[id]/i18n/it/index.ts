import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Email",
  tags: {
    emails: "Email",
  },
  title: "Dettaglio email",
  titleShort: "Dettaglio email",
  description: "Recuperare un'unica e-mail dal suo identificatore univoco",
  container: {
    title: "Email Dettagli",
    description: "Visualizza informazioni dettagliate su una specifica email",
  },
  fields: {
    id: {
      label: "Email ID",
      description: "Unico identificatore dell'e-mail per recuperare",
    },
  },
  response: {
    email: {
      title: "Email Dettagli",
      description: "Informazioni complete sull'e-mail richiesta",
      id: "Email ID",
      subject: "Oggetto",
      recipientEmail: "Email sensibile",
      recipientName: "Nome del destinatario",
      senderEmail: "Email di pagamento",
      senderName: "Nome del fornitore",
      type: "Tipo di email",
      status: "Stato",
      templateName: "Nome del modello",
      emailProvider: "Email Provider",
      externalId: "ID esterno",
      sentAt: "Inviato a",
      deliveredAt: "Consegnato a",
      openedAt: "Aperta",
      clickedAt: "Cliccato su",
      retryCount: "Conte di Retry",
      error: "Messaggio di errore",
      userId: "Utente ID",
      leadId: "ID del contatto",
      createdAt: "Creato a",
      updatedAt: "Aggiornato At",
    },
  },
  get: {
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "L'e-mail fornita ID non è valida",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Devi essere autenticato per accedere ai dettagli e-mail",
      },
      not_found: {
        title: "Email non trovata",
        description: "Nessuna e-mail trovata con il ID specificato",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di visualizzare questa email",
      },
      server: {
        title: "Errore del server",
        description:
          "Si è verificato un errore del server interno durante il recupero dell'e-mail",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
    },
  },
  errors: {
    validation: {
      title: "Errore di convalida",
      description: "L'e-mail fornita ID non è valida",
    },
    unauthorized: {
      title: "Autenticazione richiesta",
      description: "Devi essere autenticato per accedere ai dettagli e-mail",
    },
    notFound: {
      title: "Email non trovata",
      description: "Nessuna e-mail trovata con il ID specificato",
    },
    forbidden: {
      title: "Accesso negato",
      description: "Non hai il permesso di visualizzare questa email",
    },
    server: {
      title: "Errore del server",
      description:
        "Si è verificato un errore del server interno durante il recupero dell'e-mail",
    },
    conflict: {
      title: "Errore di conflitto",
      description:
        "Si è verificato un conflitto durante l'elaborazione della richiesta di posta elettronica",
    },
    network: {
      title: "Errore di rete",
      description:
        "Si è verificato un errore di rete durante il recupero dell'e-mail",
    },
    unsavedChanges: {
      title: "Modifiche non salvate",
      description: "Ci sono cambiamenti non rilevati",
    },
    unknown: {
      title: "Errore sconosciuto",
      description: "Si è verificato un errore imprevisto",
    },
  },
  success: {
    title: "Email recuperato",
    description: "Dettagli e-mail recuperati con successo",
  },
  widget: {
    parties: "Parti",
    to: "A",
    from: "Da",
    timestamps: "Lampade da terra",
    sentAt: "Inviato a",
    deliveredAt: "Consegnato a",
    openedAt: "Aperta",
    clickedAt: "Cliccato su",
    technical: "Dettagli tecnici",
    template: "Template",
    provider: "Fornitore",
    externalId: "ID esterno",
    retryCount: "Conte di Retry",
    error: "Errore",
    associations: "Associazioni",
    lead: "Contatto",
    user: "Utente",
    notFound: "Email non trovata",
  },
  enums: {
    status: {
      pending: "Finanziamenti",
      sent: "Inviato",
      delivered: "Consegnato",
      opened: "Aperto",
      clicked: "Cliccato",
      bounced: "Bounce",
      failed: "Sfigato",
      unsubscribed: "Iscrizione annullata",
    },
    type: {
      transactional: "Transazione",
      marketing: "Marketing",
      notification: "Notifica",
      system: "Sistema",
      leadCampaign: "Campagna di acquisizione contatti",
      userCommunication: "Comunicazione dell'utente",
    },
    provider: {
      resend: "Resend",
      sendgrid: "SendGrid",
      mailgun: "Mailgun",
      ses: "Amazon SES",
      smtp: "SMTP",
      mailjet: "Mailjet",
      postmark: "Postmark",
      other: "Altro",
    },
  },
};
