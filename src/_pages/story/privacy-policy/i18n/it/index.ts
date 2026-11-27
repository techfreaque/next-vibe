import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Informativa sulla privacy | {{appName}}",
    category: "Informazioni legali",
    description:
      "Scopri come {{appName}} protegge la tua privacy e tratta i tuoi dati",
    imageAlt: "Informativa sulla privacy",
    keywords:
      "informativa sulla privacy, protezione dei dati, privacy degli utenti, privacy {{appName}}",
    ogTitle: "Informativa sulla privacy | {{appName}}",
    ogDescription:
      "Scopri come {{appName}} protegge la tua privacy e tratta i tuoi dati",
    twitterTitle: "Informativa sulla privacy | {{appName}}",
    twitterDescription:
      "Scopri come {{appName}} protegge la tua privacy e tratta i tuoi dati",
  },
  printAriaLabel: "Stampa l’informativa sulla privacy",
  onThisPage: "In questa pagina",
  printButton: "Stampa",
  title: "Informativa sulla privacy",
  lastUpdated: "Ultimo aggiornamento: novembre 2026",
  bindingVersionNotice:
    "Questa traduzione è fornita a titolo informativo. Fa fede la versione in lingua tedesca.",
  introduction:
    "{{appName}} tutela la tua privacy. Questa informativa spiega come raccogliamo, utilizziamo e proteggiamo i tuoi dati personali quando usi la nostra piattaforma di chat IA senza censura.",
  sections: {
    informationCollect: {
      title: "Dati che raccogliamo",
      description:
        "Raccogliamo i dati che ci fornisci direttamente e quelli che il servizio rileva automaticamente quando lo usi.",
    },
    personalData: {
      title: "Dati personali",
      description: "Possiamo raccogliere i seguenti dati personali:",
      items: {
        name: "Nome e recapiti",
        email: "Indirizzo email",
        phone: "Numero di telefono (facoltativo)",
        company: "Ragione sociale (facoltativa)",
        billing: "Dati di fatturazione e pagamento",
        payment: "Metodo di pagamento e dettagli delle transazioni",
      },
    },
    socialMediaData: {
      title: "Dati dei social media",
      description:
        "Se colleghi account di social media, possiamo raccogliere informazioni sul profilo e dati correlati nei limiti consentiti da tali piattaforme.",
    },
    derivativeData: {
      title: "Dati derivati",
      description:
        "Possiamo ricavare dati anonimi e aggregati dal tuo utilizzo per migliorare i nostri servizi.",
    },
    useOfInformation: {
      title: "Come usiamo i tuoi dati",
      description: "Usiamo i dati raccolti per varie finalità, tra cui:",
      items: {
        provide: "Fornire e mantenere i nostri servizi di chat IA",
        process: "Elaborare le transazioni e gestire il tuo account",
        send: "Inviarti aggiornamenti, newsletter e comunicazioni promozionali",
        respond: "Rispondere alle tue richieste e fornirti assistenza",
        monitor:
          "Monitorare e analizzare le modalità d’uso per migliorare la nostra piattaforma",
        personalize:
          "Personalizzare la tua esperienza e proporti contenuti pertinenti",
      },
    },
    disclosure: {
      title: "Comunicazione dei dati",
      description:
        "Possiamo comunicare i tuoi dati quando la legge lo impone o per tutelare i nostri diritti e la nostra sicurezza.",
    },
    businessTransfers: {
      title: "Cambio di gestore",
      description:
        "Se un nuovo gestore subentra nel servizio, i tuoi dati possono essergli trasferiti.",
    },
    thirdParty: {
      title: "Servizi di terze parti",
      description:
        "Condividiamo dati personali solo con i fornitori elencati qui sotto, e solo nella misura in cui ciascuno ne ha bisogno per il suo lavoro. Il tuo account, le tue chat e i tuoi file sono conservati sui nostri server in Germania.",
      aiNotice:
        "Quando chatti o generi contenuti multimediali, la richiesta va al fornitore del modello che hai scelto. Contiene ciò che serve al modello per rispondere: il tuo messaggio, i messaggi precedenti della conversazione, gli allegati, le istruzioni e i ricordi usati dall'IA e il nome visualizzato del tuo profilo. Non inviamo il tuo indirizzo email. Intermediari come OpenRouter, NanoGPT e Venice passano la richiesta all'azienda che gestisce il modello, per esempio OpenAI, Anthropic, Google, xAI, DeepSeek o Mistral. Per quanto tempo un fornitore conserva una richiesta e cosa può farne lo stabiliscono le sue condizioni. Non addestriamo modelli di IA con le tue chat.",
      transfers:
        "Diversi fornitori hanno sede fuori dall'UE. Quando un fornitore offre le clausole contrattuali standard della Commissione europea, come Stripe e OpenRouter, il trasferimento si basa su di esse. Negli altri casi i dati vengono trasferiti secondo le condizioni del fornitore.",
      labels: {
        purpose: "Finalità",
        data: "Dati condivisi",
        privacyPolicy: "Informativa sulla privacy",
      },
      groups: {
        hosting: "Hosting e archiviazione",
        email: "Email",
        payments: "Pagamenti",
        ai: "Modelli di IA",
        web: "Ricerca web e caricamento pagine",
      },
      providers: {
        hostinger: {
          purpose:
            "Ci affitta i due server virtuali su cui gira la piattaforma. Database, archivio file (MinIO) e cache (Redis) li gestiamo noi su questi server. Nessun servizio di archiviazione cloud separato è coinvolto.",
          data: "Tutto ciò che è salvato sulla piattaforma: dati dell'account, chat, ricordi, file caricati e generati, registrazioni dei pagamenti.",
          location: "Server in Germania, azienda in Lituania (UE)",
        },
        hosttech: {
          purpose:
            "Server di posta per i nostri indirizzi email. Invia codici di registrazione, ricevute e newsletter e riceve le email che ci scrivi.",
          data: "Indirizzo email, nome, contenuto delle email.",
          location: "Svizzera (decisione di adeguatezza dell'UE)",
        },
        stripe: {
          purpose: "Pagamenti con carta, abbonamenti e fatture.",
          data: "Nome, indirizzo email, indirizzo di fatturazione, dati di pagamento, importi, l'ID del tuo account. Non vediamo mai il numero completo della tua carta.",
          location:
            "Stripe Payments Europe, Ltd., Irlanda (UE); società madre negli USA",
        },
        paypal: {
          purpose: "Solo se scegli PayPal nel pagamento Stripe.",
          data: "Nome, indirizzo email, dati di pagamento, importi.",
          location: "PayPal (Europe) S.à r.l. et Cie, S.C.A., Lussemburgo (UE)",
        },
        nowpayments: {
          purpose: "Pagamenti in criptovalute.",
          data: "L'ID del tuo account nel numero d'ordine, prodotto e importo, dati del wallet e della transazione. Per i pagamenti crypto ricorrenti anche il tuo indirizzo email.",
          location: "Saint Vincent e Grenadine",
        },
        openrouter: {
          purpose:
            "Inoltra la maggior parte dei modelli di chat (per esempio di OpenAI, Anthropic, Google, xAI, DeepSeek, Mistral e Qwen) e alcuni modelli di immagini e video all'azienda che li gestisce.",
          data: "Contenuto della richiesta all'IA descritto sopra. L'azienda che gestisce il modello riceve lo stesso contenuto.",
          location: "USA",
        },
        nanogpt: {
          purpose: "Modelli di chat, immagini e video, sintesi vocale.",
          data: "Contenuto della richiesta all'IA, testo che vuoi ascoltare.",
          location: "USA",
        },
        venice: {
          purpose: "Modelli di chat, immagini e video senza censura.",
          data: "Contenuto della richiesta all'IA.",
          location: "USA",
        },
        uncensoredAi: {
          purpose: "Modello di chat UncensoredLM.",
          data: "Contenuto della richiesta all'IA.",
          location: "USA",
        },
        freedomgpt: {
          purpose: "Modelli di chat di FreedomGPT.",
          data: "Contenuto della richiesta all'IA.",
          location: "USA",
        },
        gabAi: {
          purpose: "Modelli di chat di Gab AI.",
          data: "Contenuto della richiesta all'IA.",
          location: "USA",
        },
        modelslab: {
          purpose: "Modelli di immagini, video e musica.",
          data: "Il tuo prompt e le immagini che alleghi.",
          location: "India",
        },
        edenAi: {
          purpose:
            "Trascrizione vocale e sintesi vocale. Passa l'audio o il testo al motore vocale che usa.",
          data: "Registrazioni vocali che trascrivi, testo che vuoi ascoltare.",
          location: "Francia (UE)",
        },
        braveSearch: {
          purpose: "Ricerca web quando l'IA cerca su internet.",
          data: "La query di ricerca scritta dall'IA. Nessun dato dell'account.",
          location: "USA",
        },
        kagi: {
          purpose:
            "Ricerca web e brevi risposte dal web quando l'IA cerca su internet.",
          data: "La query di ricerca scritta dall'IA. Nessun dato dell'account.",
          location: "USA",
        },
        scrappey: {
          purpose: "Carica una pagina web quando l'IA legge un link.",
          data: "L'indirizzo della pagina. Nessun dato dell'account.",
          location: "UE",
        },
      },
    },
    legal: {
      title: "Base giuridica del trattamento",
      description:
        "Trattiamo i tuoi dati personali sulla base del tuo consenso, della necessità di eseguire il contratto, degli obblighi di legge e del nostro legittimo interesse a fornire e migliorare i servizi.",
    },
    security: {
      title: "Misure di sicurezza",
      description:
        "Adottiamo misure tecniche e organizzative adeguate per proteggere i tuoi dati personali da accessi non autorizzati, modifiche, divulgazione o distruzione. Nessun metodo di trasmissione su Internet garantisce una sicurezza assoluta.",
    },
    rights: {
      title: "I tuoi diritti in materia di protezione dei dati",
      description:
        "La normativa sulla protezione dei dati ti riconosce determinati diritti sui tuoi dati personali:",
      items: {
        access: "Diritto di accesso ai tuoi dati personali",
        correction: "Diritto di rettifica dei dati inesatti o incompleti",
        deletion:
          "Diritto alla cancellazione: elimina il tuo account dalle impostazioni per cancellare i tuoi dati personali",
        objection: "Diritto di opposizione al trattamento dei tuoi dati",
        portability:
          "Diritto alla portabilità: esporta tutti i tuoi dati in formato JSON dalle impostazioni",
      },
    },
    cookies: {
      title: "Cookie e tracciamento",
      description:
        "Non usiamo strumenti di tracciamento di terze parti, pixel pubblicitari o tecniche di fingerprinting. Un solo cookie proprietario ci permette di riconoscere il tuo browser. Per capire quali canali attirano utenti che continuano a usare il servizio, registriamo come ci hai raggiunto la prima volta e come ci hai raggiunto l’ultima volta tramite un link con parametri: i tag della campagna nel link (utm_source, utm_medium, utm_campaign, utm_content, utm_term), il dominio del sito di provenienza (mai l’indirizzo completo), la pagina di destinazione (senza la stringa di query) e l’eventuale codice d’invito. Registriamo poi quando hai iniziato a chattare, ti sei registrato, hai confermato l’iscrizione alla newsletter, hai pagato e hai rinnovato. Quando ti registri, colleghiamo questi dati al tuo account. Li usiamo solo in forma aggregata per valutare i canali di marketing, non li vendiamo né li condividiamo e li cancelliamo quando elimini l’account.",
    },
    guestMedia: {
      title: "Contenuti multimediali creati senza account",
      description:
        "Conserviamo sui nostri server le immagini, gli audio e i video generati senza account, anche in modalità in incognito, per permetterti di visualizzarli e scaricarli. Se non crei un account, eliminiamo automaticamente questi file dopo 4 mesi.",
    },
    thirdPartySites: {
      title: "Siti web di terze parti",
      description:
        "Il nostro servizio può contenere link a siti di terze parti. Non siamo responsabili di come questi siti trattano i dati personali. Ti invitiamo a consultare le rispettive informative sulla privacy.",
    },
    children: {
      title: "Privacy dei minori",
      description:
        "Il servizio non è destinato ai minori di 13 anni. Non raccogliamo consapevolmente dati di minori.",
    },
    changes: {
      title: "Modifiche a questa informativa",
      description:
        "Possiamo aggiornare periodicamente questa informativa sulla privacy. Ti comunicheremo ogni modifica significativa.",
    },
    controller: {
      description:
        "Il titolare del trattamento dei tuoi dati ai sensi del GDPR è {{operator}}, {{address}}.",
    },
    gdpr: {
      title: "Conformità al GDPR",
      description:
        "Per gli utenti dell’Unione europea rispettiamo i diritti previsti dal GDPR. Puoi esportare i tuoi dati in qualsiasi momento dalle impostazioni. Quando elimini l’account, cancelliamo il tuo profilo, le chat, i ricordi, gli indirizzi, l’iscrizione alla newsletter e i recapiti, e rimuoviamo i dati personali dalle registrazioni di visita collegate. Conserviamo le statistiche anonime aggregate e il registro dei movimenti dei crediti, che non sarà più collegato a te. Contattaci per ciò che non puoi fare dalle impostazioni.",
    },
  },
  post: {
    title: "Informativa sulla privacy",
    description: "Endpoint dell’informativa sulla privacy",
    form: {
      title: "Configurazione dell’informativa sulla privacy",
      description: "Configura i parametri dell’informativa sulla privacy",
    },
    response: {
      title: "Risposta",
      description: "Dati restituiti dall’informativa sulla privacy",
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
