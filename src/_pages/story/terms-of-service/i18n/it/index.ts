import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Condizioni di servizio | {{appName}}",
    category: "Informazioni legali",
    description: "Leggi le condizioni di utilizzo di {{appName}}",
    imageAlt: "Condizioni di servizio",
    keywords:
      "condizioni di servizio, termini e condizioni, accordo con l’utente, condizioni {{appName}}",
    ogTitle: "Condizioni di servizio | {{appName}}",
    ogDescription: "Leggi le condizioni di utilizzo di {{appName}}",
    twitterTitle: "Condizioni di servizio | {{appName}}",
    twitterDescription: "Leggi le condizioni di utilizzo di {{appName}}",
  },
  printAriaLabel: "Stampa le condizioni di servizio",
  onThisPage: "In questa pagina",
  printButton: "Stampa",
  title: "Condizioni di servizio",
  lastUpdated: "Ultimo aggiornamento: novembre 2026",
  bindingVersionNotice:
    "Questa traduzione è fornita a titolo informativo. Fa fede la versione in lingua tedesca.",
  introduction:
    "Ti diamo il benvenuto su {{appName}}. Usando la nostra piattaforma di chat IA senza censura, accetti queste condizioni di servizio. Leggile con attenzione. Il gestore di {{appName}} è {{operator}}, Germania.",
  sections: {
    agreement: {
      title: "Accettazione delle condizioni",
      content:
        "Accedendo a {{appName}} o usandolo, accetti di rispettare queste condizioni di servizio e tutte le leggi e i regolamenti applicabili. Se non accetti anche una sola di queste condizioni, non puoi usare il servizio.",
    },
    description: {
      title: "Descrizione del servizio",
      content:
        "{{appName}} offre accesso a modelli di chat IA senza censura di diversi fornitori. Offriamo piani gratuiti e a pagamento con funzionalità e limiti di utilizzo differenti. Il servizio è fornito nello stato in cui si trova, senza garanzie di alcun tipo.",
    },
    subscriptions: {
      title: "Abbonamenti e fatturazione",
      plans: {
        title: "Piani di abbonamento",
        content:
          "Offriamo un piano in abbonamento e pacchetti di crediti. I pacchetti di crediti non scadono mai, neppure al termine dell’abbonamento.",
      },
      billing: {
        title: "Fatturazione",
        content:
          "Gli abbonamenti si pagano ogni mese o ogni anno. Anche con il piano annuale i crediti vengono accreditati ogni mese. I pacchetti di crediti sono ricariche acquistabili singolarmente da chi ha un abbonamento attivo e non scadono mai. Accettiamo carte, PayPal, Apple Pay e Google Pay tramite Stripe e criptovalute tramite NowPayments.",
      },
      cancellation: {
        title: "Disdetta",
        content:
          "Puoi disdire l’abbonamento in qualsiasi momento. La disdetta ha effetto alla fine del periodo di fatturazione in corso. I pacchetti di crediti non sono rimborsabili, salvo nei casi in cui si applichi il diritto di recesso previsto dalla legge (vedi la sezione Diritto di recesso dei consumatori).",
      },
    },
    withdrawal: {
      title: "Diritto di recesso dei consumatori",
      intro:
        "Se sei un consumatore ai sensi del § 13 del codice civile tedesco (BGB), hai diritto per legge di recedere dai contratti di acquisto di pacchetti di crediti e di abbonamento che concludi con noi tramite {{appName}}, secondo quanto indicato nella seguente informativa sul diritto di recesso.",
      notice: {
        title: "Informativa sul diritto di recesso",
        right:
          "Hai il diritto di recedere dal contratto entro quattordici giorni senza indicarne il motivo. Il periodo di recesso è di quattordici giorni dalla data di conclusione del contratto.",
        exercise:
          "Per esercitare il diritto di recesso devi informarci ({{operator}}, {{address}}, email: {{email}}) della tua decisione di recedere dal contratto mediante una dichiarazione inequivocabile, ad esempio con una lettera inviata per posta o un’email. Puoi usare il modulo tipo riportato qui sotto, ma non è obbligatorio. È sufficiente una semplice email.",
        deadline:
          "Per rispettare il termine di recesso, è sufficiente inviare la comunicazione relativa all’esercizio del diritto prima della scadenza del periodo di recesso.",
      },
      effects: {
        title: "Effetti del recesso",
        refund:
          "Se recedi dal contratto, ti rimborseremo tutti i pagamenti ricevuti senza indebito ritardo e comunque entro quattordici giorni dalla data in cui riceviamo la tua comunicazione di recesso. Useremo lo stesso mezzo di pagamento che hai usato per la transazione originaria, salvo diverso accordo espresso con te. Non dovrai sostenere alcun costo per il rimborso.",
        compensation:
          "Se hai chiesto che la prestazione dei servizi inizi durante il periodo di recesso, ci dovrai versare un importo ragionevole, proporzionato alla parte dei servizi già fornita al momento in cui ci comunichi che eserciti il diritto di recesso dal contratto, rispetto al totale dei servizi previsti dal contratto.",
        end: "Fine dell’informativa sul diritto di recesso",
      },
      expiry: {
        title: "Estinzione anticipata del diritto di recesso",
        digitalContent:
          "Per un contratto di fornitura di contenuti digitali senza supporto materiale, il diritto di recesso si estingue ai sensi del § 356, comma 5, BGB se abbiamo iniziato a eseguire il contratto dopo che hai espressamente acconsentito all’inizio dell’esecuzione prima della scadenza del periodo di recesso, hai confermato di sapere che con tale consenso perdi il diritto di recesso all’inizio dell’esecuzione e ti abbiamo fornito una conferma del contratto.",
        services:
          "Per un contratto di prestazione di servizi, il diritto di recesso si estingue ai sensi del § 356, comma 4, BGB se abbiamo fornito integralmente il servizio e abbiamo iniziato a eseguirlo solo dopo che hai dato il tuo consenso espresso e confermato contestualmente di sapere che avresti perso il diritto di recesso una volta eseguito integralmente il contratto.",
        credits:
          "Se il tuo diritto di recesso non si è estinto ai sensi di queste disposizioni, per i crediti vale quanto segue. Rimborsiamo per intero la parte del prezzo corrispondente ai crediti inutilizzati del contratto da cui recedi e li rimuoviamo dal tuo account al momento del recesso. Per i crediti già utilizzati addebitiamo, nei limiti consentiti dalla legge, un importo proporzionale al rapporto tra i crediti utilizzati e quelli acquistati con il contratto. Il recesso da un abbonamento comporta anche la sua cessazione.",
      },
      form: {
        title: "Modulo tipo di recesso",
        intro:
          "(Se intendi recedere dal contratto, compila questo modulo e inviacelo.)",
        recipient: "A {{operator}}, {{address}}, email: {{email}}",
        statement:
          "Con la presente comunico/comunichiamo (*) il recesso dal mio/nostro (*) contratto per la fornitura dei seguenti contenuti digitali (*)/per la prestazione del seguente servizio (*):",
        orderedOn: "Ordinato il (*)/ricevuto il (*)",
        name: "Nome del consumatore o dei consumatori",
        address: "Indirizzo del consumatore o dei consumatori",
        signature:
          "Firma del consumatore o dei consumatori (solo se il modulo è inviato su carta)",
        date: "Data",
        footnote: "(*) Cancellare la dicitura non pertinente.",
        accountHint:
          "Per aiutarci a risalire rapidamente all’acquisto, indica l’indirizzo email del tuo account. Non è un requisito per la validità del recesso.",
      },
    },
    userAccounts: {
      title: "Account utente",
      creation: {
        title: "Creazione dell’account",
        content:
          "Quando crei un account devi fornire informazioni esatte. Sei responsabile della sicurezza delle tue credenziali di accesso.",
      },
      responsibilities: {
        title: "Responsabilità dell’utente",
        content:
          "Sei responsabile di tutte le attività svolte con il tuo account. Non puoi condividere l’account con altri o usare il servizio per scopi illeciti.",
      },
    },
    userContent: {
      title: "Contenuti degli utenti",
      ownership: {
        title: "Titolarità dei contenuti",
        content:
          "Mantieni tutti i diritti sulle tue conversazioni e sui tuoi dati. Non rivendichiamo la titolarità dei tuoi contenuti. Solo tu puoi accedere alle tue cartelle private.",
      },
      guidelines: {
        title: "Regole sui contenuti",
        intro:
          "Offriamo accesso all’IA senza censura. È vietato usare il servizio per:",
        items: {
          item1: "Svolgere attività illecite",
          item2: "Molestare, minacciare o danneggiare altre persone",
          item3: "Violare diritti di proprietà intellettuale",
          item4:
            "Tentare di accedere alla piattaforma senza autorizzazione o comprometterla",
        },
      },
    },
    intellectualProperty: {
      title: "Proprietà intellettuale",
      content:
        "La piattaforma {{appName}}, compresi il design, le funzionalità e il codice, è tutelata dalla normativa sulla proprietà intellettuale. Non puoi copiare, modificare o distribuire la nostra piattaforma senza autorizzazione.",
    },
    limitation: {
      title: "Limitazione di responsabilità",
      content:
        "{{appName}} non risponde di danni indiretti, incidentali, speciali o consequenziali derivanti dall’uso del servizio.",
    },
    indemnification: {
      title: "Manleva",
      content:
        "Accetti di indennizzare e tenere indenne {{appName}} da qualsiasi pretesa, danno o spesa derivante dall’uso del servizio o dalla violazione di queste condizioni.",
    },
    termination: {
      title: "Cessazione",
      content:
        "Ci riserviamo il diritto di chiudere o sospendere il tuo account in caso di violazione di queste condizioni. Puoi chiudere il tuo account in qualsiasi momento.",
    },
    changes: {
      title: "Modifica delle condizioni",
      content:
        "Possiamo aggiornare queste condizioni di servizio periodicamente. Continuando a usare il servizio dopo le modifiche, accetti le nuove condizioni.",
    },
    governingLaw: {
      title: "Legge applicabile",
      content:
        "Queste condizioni di servizio sono disciplinate dalla legge della Repubblica federale di Germania. Se sei un consumatore, questa scelta non ti priva della tutela offerta dalle norme inderogabili del paese in cui risiedi abitualmente. Se sei un commerciante, una persona giuridica di diritto pubblico o un patrimonio speciale di diritto pubblico, il foro competente per tutte le controversie derivanti da queste condizioni è quello della sede del gestore a Simbach am Inn, in Germania. In tutti gli altri casi si applica il foro previsto dalla legge.",
    },
  },
  post: {
    title: "Condizioni di servizio",
    description: "Endpoint delle condizioni di servizio",
    form: {
      title: "Configurazione delle condizioni di servizio",
      description: "Configura i parametri delle condizioni di servizio",
    },
    response: {
      title: "Risposta",
      description: "Dati restituiti dalle condizioni di servizio",
    },
    errors: {
      unauthorized: {
        title: "Non autorizzato",
        description: "Devi autenticarti",
      },
      validation: {
        title: "Errore di convalida",
        description: "Parametri della richiesta non validi",
      },
      server: {
        title: "Errore del server",
        description: "Si è verificato un errore interno del server",
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
        description: "Non hai i permessi per accedere",
      },
      notFound: {
        title: "Risorsa non trovata",
        description: "La risorsa richiesta non esiste",
      },
      conflict: {
        title: "Conflitto",
        description: "Si è verificato un conflitto di dati",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "Operazione completata",
    },
  },
};
