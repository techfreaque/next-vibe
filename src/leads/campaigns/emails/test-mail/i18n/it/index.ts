import { regionalCountryNames } from "next-vibe/core/i18n/core/regions";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Contatti",
  countries: {
    ...regionalCountryNames("it"),
    global: "Globale",
    de: "Germania",
    pl: "Polonia",
    fr: "Francia",
    us: "Stati Uniti",
  },
  languages: {
    it: "Italiano",
    es: "Spagnolo",
    en: "Inglese",
    de: "Tedesco",
    pl: "Polacco",
    fr: "Francese",
  },
  enums: {
    campaignType: {
      leadCampaign: "Campagna di acquisizione contatti",
      newsletter: "Newsletter",
      signupNurture: "Nurture di iscrizione",
      retention: "Retenzione",
      winback: "Winback",
      transactional: "Transazione",
      notification: "Notifica",
      system: "Sistema",
    },
    emailJourneyVariant: {
      uncensoredConvert: "Conversione ai modelli senza censura",
      sideHustle: "Hustle laterali",
      quietRecommendation: "Raccomandazioni silenziose",
      signupNurture: "Nurture di iscrizione",
      retention: "Retenzione",
      winback: "Winback",
      newsletterMay2026: "Newsletter maggio 2026",
      newsletterNov2026: "Newsletter Novembre 2026",
    },
    emailCampaignStage: {
      notStarted: "Non iniziato",
      initial: "Iniziativa",
      followup1: "Seguito 1",
      followup2: "Seguito 2",
      followup3: "Seguito 3",
      nurture: "Nurture",
      reactivation: "Riattivazione",
    },
    leadStatus: {
      new: "Nuovo",
      pending: "Finanziamenti",
      campaignRunning: "Campagna in corso",
      websiteUser: "Utente del Sito",
      newsletterSubscriber: "Iscriviti alla newsletter",
      inContact: "In contatto",
      signedUp: "Firmato",
      subscriptionConfirmed: "Abbonamento Confermato",
      unsubscribed: "Iscrizione annullata",
      bounced: "Bounce",
      invalid: "Non valido",
    },
    leadSource: {
      website: "Sito web",
      socialMedia: "Social Media",
      emailCampaign: "Campagna di email",
      referral: "Inviti",
      csvImport: "Importazione di CSV",
    },
  },
  tags: {
    campaigns: "Campagne",
    leads: "Contatti",
  },
  post: {
    title: "Test Mail",
    titleShort: "Test Email",
    description: "Invia email di prova con dati personalizzati di piombo",
    form: {
      title: "Configurazione di posta di prova",
      description:
        "Configurare i parametri della posta di prova e i dati di piombo",
    },
    campaignType: {
      label: "Tipo di campagna",
      description: "Tipo di campagna email",
      placeholder: "Inserisci il tipo di campagna",
    },
    emailJourneyVariant: {
      label: "Variante di viaggio email",
      description: "A/B variante di prova per il viaggio e-mail",
      placeholder: "Selezionare la variante del viaggio",
    },
    emailCampaignStage: {
      label: "Fase della campagna e-mail",
      description: "La fase attuale della campagna email",
      placeholder: "Selezionare la fase della campagna",
    },
    testEmail: {
      label: "Test Indirizzo e-mail",
      description: "Indirizzo e-mail per inviare la posta di prova a",
      placeholder: "test@example.com",
    },
    leadData: {
      title: "Dati di piombo",
      description: "Informazioni di piombo per il rendering dei modelli",
      businessName: {
        label: "Nome di affari",
        description: "Nome del business",
        placeholder: "Acme Corporation",
      },
      contactName: {
        label: "Nome di contatto",
        description: "Nome della persona di contatto",
        placeholder: "John Doe",
      },
      website: {
        label: "Sito web",
        description: "Sito web della Società URL",
        placeholder: "https://example.com",
      },
      country: {
        label: "Paese",
        description: "Codice paese",
        placeholder: "GLOBAL",
      },
      language: {
        label: "Lingua",
        description: "Preferito codice di lingua",
        placeholder: "E' un piacere.",
      },
      status: {
        label: "Stato",
        description: "Stato di piombo",
        placeholder: "NEW",
      },
      source: {
        label: "Fonte",
        description: "Fonte di piombo",
        placeholder: "WEBSITE",
      },
      notes: {
        label: "Osservazioni",
        description: "Note aggiuntive sul piombo",
        placeholder: "Inserire eventuali note aggiuntive",
      },
    },
    response: {
      title: "Risultato email di prova",
      description: "Risultato dell'invio di email di prova",
      success: {
        content: "Operazione riuscita",
      },
      messageId: {
        content: "Messaggio ID",
      },
      testEmail: {
        content: "Test Email",
      },
      subject: {
        content: "Oggetto e-mail",
      },
      sentAt: {
        content: "Inviato a",
      },
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      validation: {
        title: "Errore di convalida",
        description: "Parametri della richiesta non validi",
      },
      server: {
        title: "Errore del server",
        description: "Si è verificato un errore interno del server",
        detail: "Prova invio fallito: {{error}}",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso non consentito",
      },
      notFound: {
        title: "Non trovato",
        description: "Risorsa non trovata",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Ci sono cambiamenti non rilevati",
      },
      conflict: {
        title: "Conflitto",
        description: "I dati sono in conflitto",
      },
      templateNotFound: {
        title:
          "Nessun modello per {{emailJourneyVariant}} / {{emailCampaignStage}}",
        description: "Modello di e-mail non trovato per parametri specificati",
      },
      sendingFailed: {
        title: "Invia a {{recipient}} fallito ({{subject}}): {{error}}",
        description: "Non ha inviato email di prova",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "E-mail di prova inviata con successo",
    },
    selectionCriteria: "Criteri di selezione SMTP",
    widget: {
      title: "Inviare la prova",
      send: "Inviare la prova",
      sending: "Invio in corso…",
      successMessage: "E-mail di prova inviata con successo",
      sentTo: "Inviato a: ",
      subject: "Oggetto: ",
      sentAt: "Inviato a: ",
      campaignConfig: "Configurazione della campagna",
      sendAnother: "Invia un'altra",
    },
  },
};
