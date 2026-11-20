import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Risorsa per acquisire contatti",
  tags: {
    leadMagnet: "lead-magnet",
    config: "config",
    capture: "capture",
  },
  enums: {
    captureStatus: {
      success: "Operazione riuscita",
      failed: "Sfigato",
    },
    provider: {
      getresponse: "GetResponse",
      klaviyo: "Klaviyo",
      emarsys: "Emarsys",
      acumbamail: "Acumbamail",
      cleverreach: "CleverReach",
      connectif: "Connectif",
      datanext: "DataNext",
      edrone: "Edrone",
      expertsender: "ExpertSender",
      freshmail: "FreshMail",
      mailup: "MailUp",
      mapp: "Mapp",
      sailthru: "Sailthru",
      salesmanago: "SALESmanago",
      shopify: "Shopify",
      spotler: "Spotler",
      youlead: "YouLead",
      adobecampaign: "Adobe Campaign",
      googleSheets: "Google Sheets",
      platformEmail: "Email (via piattaforma)",
    },
  },
  config: {
    title: "Configurazione magnetica di piombo",
    description: "Configurare l'integrazione e-mail del magnete di piombo",
    form: {
      title: "Impostazioni del magnete di piombo",
      description:
        "Collegare la tua piattaforma e-mail per catturare i cavi dalla tua pagina di abilità",
      provider: {
        label: "Piattaforma e-mail",
        description: "Quale piattaforma di email marketing si utilizza?",
      },
      listId: {
        label: "Elenco / Gruppo ID",
        description:
          "La ID dell'elenco o del segmento da aggiungere porta a (opzionale)",
      },
      headline: {
        label: "Modulo Headline",
        description:
          "L'intestazione mostrata sopra la forma di cattura del piombo",
        placeholder: "Ottieni gratuitamente il mio pacchetto AI",
      },
      buttonText: {
        label: "Testo del pulsante",
        description: "Il testo sul pulsante di presentazione",
        placeholder: "Ottenere l'accesso →",
      },
      isActive: {
        label: "Attivo",
        description:
          "Abilitare o disabilitare la forma del magnete di piombo nella tua pagina di abilità",
      },
      credentials: {
        label: "Credenziali API",
        description:
          "La tua piattaforma di posta elettronica API credenziali (stored crittografato)",
      },
    },
    success: {
      saved: "Configurazione magnete di piombo salvata",
      deleted: "Lead magnete config cancellato",
    },
  },
  capture: {
    title: "Iscriviti alla lista",
    description: "Iscriviti e accedi",
    form: {
      title: "Accesso",
      description: "Inserisci i tuoi dati per ottenere l'accesso",
      firstName: {
        label: "Nome",
        description: "Il tuo nome",
      },
      email: {
        label: "Indirizzo email",
        description: "Il tuo indirizzo email",
      },
      skillId: {
        label: "ID della skill",
        description: "Riferimento delle competenze interne",
      },
    },
    success: {
      submitted: "Ci sei! Controlla la posta.",
    },
  },
  errors: {
    providerError: "Errore del provider di posta elettronica",
  },
  providers: {
    shared: {
      listId: {
        label: "Elenco / Gruppo ID",
        description: "La ID dell'elenco o del segmento da aggiungere porta a",
        placeholder: "ad es. abc123",
      },
      headline: {
        label: "Modulo Headline",
        description:
          "L'intestazione mostrata sopra il modulo di cattura del piombo nella tua pagina di abilità",
        placeholder: "Ottieni gratuitamente il mio pacchetto AI",
      },
      buttonText: {
        label: "Testo del pulsante",
        description: "Il testo sul pulsante di presentazione",
        placeholder: "Ottenere l'accesso →",
      },
      isActive: {
        label: "Attivo",
        description:
          "Abilitare il modulo di cattura del piombo nella vostra pagina di abilità",
      },
      secretKeepExisting: "Lascia vuoto per mantenere la chiave esistente",
      saveTitle: "Salvare la situazione",
      saveDescription:
        "Collegare la tua piattaforma e-mail per catturare i lead",
      saveTag: "lead-magnet-provider",
      saveSuccess: {
        title: "Configurazione salvata",
        description:
          "La tua piattaforma e-mail è collegata. I condotti fluiranno.",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Si prega di controllare il vostro input",
        },
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Devi essere connesso",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Non hai il permesso",
        },
        notFound: { title: "Non trovato", description: "Risorsa non trovata" },
        conflict: {
          title: "Conflitto",
          description: "Si è verificato un conflitto",
        },
        network: {
          title: "Errore di rete",
          description: "Si è verificato un errore di rete",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
        internal: {
          title: "Errore del server",
          description: "Si è verificato un errore interno",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore sconosciuto",
        },
      },
      response: {
        provider: "Fornitore",
        isActive: "Attivo",
        headline: "Denominazione",
        buttonText: "Testo del pulsante",
        listId: "Elenco ID",
      },
    },
    klaviyo: {
      title: "Collegare Klaviyo",
      titleShort: "Klaviyo",
      description:
        "Collegare il tuo account Klaviyo per catturare i cavi dalla tua pagina di abilità",
      klaviyoApiKey: {
        label: "Chiave Klaviyo API",
        description: "La chiave privata di Klaviyo API",
        placeholder: "pk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    getresponse: {
      title: "Collegare GetResponse",
      titleShort: "GetResponse",
      description:
        "Collega il tuo account GetResponse per catturare i lead dalla tua pagina di abilità",
      getresponseApiKey: {
        label: "GetResponse API Key",
        description:
          "La chiave GetResponse API dalle impostazioni dell'account",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    emarsys: {
      title: "Collegare Emarsys",
      titleShort: "Emarsys",
      description:
        "Collegare il tuo account Emarsys per catturare i lead dalla tua pagina di abilità",
      emarsysUserName: {
        label: "Nome utente",
        description: "Il tuo nome utente Emarsys API",
        placeholder: "account123",
      },
      emarsysApiKey: {
        label: "Chiave API",
        description: "La chiave segreta di Emarsys API",
        placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      },
      emarsysSubDomain: {
        label: "Sottotitoli",
        description:
          "Il sottodominio Emarsys API (ad esempio suite.emarsys.net)",
        placeholder: "suite.emarsys.net",
      },
    },
    acumbamail: {
      title: "Collegare Acumbambamail",
      titleShort: "Acumbamail",
      description:
        "Collegare il tuo account Acumbamail per catturare i lead dalla tua pagina di abilità",
      acumbamailApiKey: {
        label: "Chiave API",
        description: "La chiave Acumbamail API",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    cleverreach: {
      title: "Collegare CleverReach",
      titleShort: "CleverReach",
      description:
        "Collegare il tuo account CleverReach per catturare i cavi dalla tua pagina di abilità",
      cleverreachClientId: {
        label: "Client ID",
        description: "Il tuo client CleverReach OAuth ID",
        placeholder: "xxxxxxxx",
      },
      cleverreachClientSecret: {
        label: "Segreto del cliente",
        description: "Il segreto del tuo cliente CleverReach OAuth",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      cleverreachListId: {
        label: "Gruppo / Lista ID",
        description: "La ID del gruppo CleverReach per aggiungere contatti a",
        placeholder: "123456",
      },
      cleverreachFormId: {
        label: "DOI Form ID (opzionale)",
        description:
          "Modulo ID per doppio opt-in. Lasciare vuoto per saltare DOI.",
        placeholder: "123456",
      },
      cleverreachSource: {
        label: "Fonte (opzionale)",
        description: "Etichetta sorgente di contatto per il tracciamento",
        placeholder: "unbottled.ai",
      },
    },
    connectif: {
      title: "Collegare Connectif",
      titleShort: "Connectif",
      description:
        "Collegare il tuo account Connectif per catturare i cavi dalla tua pagina di abilità",
      connectifApiKey: {
        label: "Chiave API",
        description: "La chiave Connectif API",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    datanext: {
      title: "Collegare DataNext",
      titleShort: "DataNext",
      description:
        "Collegare il tuo account DataNext per catturare i lead dalla tua pagina di abilità",
      datanextApiKey: {
        label: "Chiave API",
        description: "La chiave DataNext API",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      datanextApiSecret: {
        label: "Segreto di API",
        description: "Il tuo segreto DataNext API",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      datanextFormId: {
        label: "Modulo ID",
        description: "Il modulo DataNext ID per il modulo opt-in",
        placeholder: "123456",
      },
      datanextCampaignId: {
        label: "Campagna ID",
        description: "La campagna ID per associare i lead",
        placeholder: "123456",
      },
    },
    edrone: {
      title: "Collegare Edrone",
      titleShort: "Edrone",
      description:
        "Collegare il tuo account Edrone per catturare i lead dalla tua pagina di abilità",
      edroneAppId: {
        label: "App ID",
        description: "La tua app Edrone ID",
        placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      },
    },
    expertsender: {
      title: "Collegare Expertsender",
      titleShort: "ExpertSender",
      description:
        "Collegare il tuo account ExpertSender per catturare i lead dalla tua pagina di abilità",
      expertSenderApiDomain: {
        label: "Dominio API",
        description: "Il dominio ExpertSender API",
        placeholder: "api3.esv2.com",
      },
      expertSenderApiKey: {
        label: "Chiave API",
        description: "La chiave di ExpertSender API",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    freshmail: {
      title: "Collegare il materiale fresco",
      titleShort: "FreshMail",
      description:
        "Collegare il tuo account FreshMail per catturare i cavi dalla tua pagina di abilità",
      freshmailApiKey: {
        label: "Chiave API",
        description: "Il tuo tasto FreshMail API",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      freshmailApiSecret: {
        label: "Segreto di API",
        description: "Il segreto di FreshMail API",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      listHash: {
        label: "Elenco Hash",
        description: "L'hash dell'elenco degli abbonati da aggiungere porta a",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    mailup: {
      title: "Collegare MailUp",
      titleShort: "MailUp",
      description:
        "Collegare il tuo account MailUp per catturare i lead dalla tua pagina di abilità",
      mailupClientId: {
        label: "Client ID",
        description: "Il tuo client MailUp OAuth ID",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      mailupClientSecret: {
        label: "Segreto del cliente",
        description: "Il segreto del tuo client MailUp OAuth",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      mailupUsername: {
        label: "Nome utente",
        description: "Nome utente del tuo account MailUp",
        placeholder: "m12345",
      },
      mailupPassword: {
        label: "Password",
        description: "La password del tuo account MailUp",
        placeholder: "••••••••",
      },
      mailupListId: {
        label: "Elenco ID",
        description: "Il numero ID dell'elenco per sottoscrivere i contatti a",
        placeholder: "1",
      },
    },
    mapp: {
      title: "Collegare Mapp",
      titleShort: "Mapp",
      description:
        "Collegare il tuo account Mapp per catturare i lead dalla tua pagina di abilità",
      mappUsername: {
        label: "Nome utente",
        description: "Il tuo nome utente Mapp API",
        placeholder: "nome utente",
      },
      mappPassword: {
        label: "Password",
        description: "La tua password Mapp API",
        placeholder: "••••••••",
      },
      mappDomain: {
        label: "Domini",
        description: "Il dominio Mapp API",
        placeholder: "api.mapp.com",
      },
    },
    sailthru: {
      title: "Collegare Sailthru",
      titleShort: "Sailthru",
      description:
        "Collegare il tuo account Sailthru per catturare i lead dalla tua pagina di abilità",
      sailthruApiKey: {
        label: "Chiave API",
        description: "La chiave Sailthru API",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      sailthruSecret: {
        label: "Segreto di API",
        description: "Il tuo segreto Sailthru API",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      listName: {
        label: "Nome dell'elenco",
        description:
          "Il nome dell'elenco Sailthru per sottoscrivere i contatti a",
        placeholder: "I miei abbonati",
      },
    },
    salesmanago: {
      title: "Collegare SALESmanago",
      titleShort: "SALESmanago",
      description:
        "Collega il tuo account SALESmanago per catturare i lead dalla tua pagina di abilità",
      salesManagoClientId: {
        label: "Client ID",
        description: "Il tuo cliente SALESmanago ID",
        placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      },
      salesManagoApiKey: {
        label: "Chiave API",
        description: "La chiave di SALESmanago API",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      salesManagoSha: {
        label: "SHA",
        description: "Il tuo hash SALESmanago SHA per l'autenticazione",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      salesManagoDomain: {
        label: "Domini",
        description: "Il dominio SALESmanago API",
        placeholder: "app3.salesmanago.pl",
      },
      salesManagoOwner: {
        label: "Proprietario Email",
        description: "L'email del proprietario per il tuo account SALESmanago",
        placeholder: "owner@example.com",
      },
    },
    shopify: {
      title: "Collegare Shopify",
      titleShort: "Shopify",
      description:
        "Collegare il negozio Shopify per catturare i cavi dalla tua pagina di abilità",
      shopifyDomain: {
        label: "Memorizzare il dominio",
        description: "Il dominio negozio Shopify",
        placeholder: "mystore.myshopify.com",
      },
      shopifyAccessToken: {
        label: "Token di accesso",
        description: "Il token di accesso di Shopify Admin API",
        placeholder: "shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    spotler: {
      title: "Collegare Spotler",
      titleShort: "Spotler",
      description:
        "Collegare il tuo account Spotler per catturare i cavi dalla tua pagina di abilità",
      spotlerConsumerKey: {
        label: "Chiave del consumatore",
        description: "La chiave del consumatore Spotler API",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      spotlerConsumerSecret: {
        label: "Segreto dei consumatori",
        description: "Il tuo segreto di consumo Spotler API",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    youlead: {
      title: "Collegare il modulo",
      titleShort: "YouLead",
      description:
        "Collegare il tuo account YouLead per catturare i lead dalla tua pagina di abilità",
      youLeadAppId: {
        label: "App ID",
        description: "La tua applicazione YouLead ID",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      youLeadClientId: {
        label: "Client ID",
        description: "Il tuo cliente YouLead ID",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      youLeadAppSecretKey: {
        label: "App segreto chiave",
        description: "La chiave segreta dell'applicazione YouLead",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    adobecampaign: {
      title: "Connetti la campagna Adobe",
      titleShort: "Adobe Campaign",
      description:
        "Collegare il tuo account Adobe Campaign per catturare i lead dalla tua pagina di abilità",
      adobeCampaignOrganizationId: {
        label: "Organizzazione ID",
        description: "Il tuo Adobe IMS Organizzazione ID",
        placeholder: "XXXXXXXXXXXXXXXXXXXXXXXX@AdobeOrg",
      },
      adobeCampaignClientId: {
        label: "Client ID",
        description: "La tua campagna di Adobe API cliente ID",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      adobeCampaignClientSecret: {
        label: "Segreto del cliente",
        description: "Il segreto del tuo client Adobe Campaign API",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      adobeCampaignApiKey: {
        label: "Chiave API",
        description: "La chiave di Adobe Campaign API",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      adobeCampaignListId: {
        label: "Elenco ID",
        description:
          "La lista dei profili di Adobe Campaign ID da aggiungere porta a",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    platformEmail: {
      title: "Notifica via e-mail della piattaforma",
      titleShort: "Email della piattaforma",
      description:
        "Ricevi una notifica e-mail ogni volta che qualcuno si registra tramite il tuo magnete di piombo",
      notifyEmail: {
        label: "Email di notifica",
        description: "Dove inviare le notifiche di piombo",
        placeholder: "you@example.com",
      },
      notifyEmailName: {
        label: "Il tuo nome",
        description: "Nome visualizzato nell'e-mail di notifica",
        placeholder: "Jane.",
      },
    },
    googleSheets: {
      title: "Collegare fogli Google",
      titleShort: "Google Sheets",
      description:
        "Appendere una riga al foglio di calcolo Google ogni volta che un piombo si registra",
      saveTitle: "Salvare la configurazione di fogli Google",
      connect: {
        label: "Collegare l'account Google",
      },
      connected: {
        description: "Il tuo account Google è collegato",
      },
      spreadsheetId: {
        label: "Foglio di calcolo",
        description:
          "Selezionare il foglio di calcolo in cui verranno aggiunti i cavi",
        placeholder: "Seleziona un foglio di calcolo...",
      },
      sheetTab: {
        label: "Scheda foglio (opzionale)",
        description:
          "Il nome della scheda nel foglio di calcolo. Lasciare vuoto per utilizzare la prima scheda.",
        placeholder: "ad es. Piombo",
      },
      widget: {
        connectTitle: "Collegare fogli Google",
        connectDescription:
          "Accedi con Google per aggiungere automaticamente ogni nuovo lead come riga nel foglio di calcolo.",
        redirectNote:
          "Verrai reindirizzato a Google per concedere l'accesso ai fogli di calcolo.",
        reconnect: "Ricollegamento",
        loading: "Caricamento fogli...",
        noSheets: "Nessun foglio di calcolo trovato",
        refresh: "Elenco dei rifiuti",
        selectRequired: "Seleziona un foglio di calcolo",
        saveFailed: "Non ho fatto nulla per salvare. Per favore, riprovate.",
        saving: "Salvare...",
      },
    },
  },
};
