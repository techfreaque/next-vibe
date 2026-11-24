import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Configura {{appName}}",
    description: "Prima configurazione della tua istanza self-hosted.",
  },
  stepOf: "Passo {{current}} di {{total}}",
  steps: {
    admin: "Accesso admin",
    ai: "Collega l'IA",
    extras: "Extra",
    done: "Fatto",
  },
  back: "Indietro",
  continue: "Avanti",
  getKey: "Ottieni una chiave",
  secretSaved: "Salvata. Lascia vuoto per mantenerla.",
  errors: {
    saveFailed:
      "Salvataggio non riuscito. Controlla il terminale con vibe dev e riprova.",
  },
  restart: {
    title: "Applico le tue impostazioni",
    body: "L'istanza si riavvia per caricarle. La pagina si ricarica da sola tra qualche secondo.",
    slow: "Ci mette più del solito?",
    reload: "Ricarica la pagina",
    manualTitle: "Salvato",
    manualBody:
      "Riavvia il server per applicare le nuove impostazioni. Nel frattempo puoi andare avanti.",
    continue: "Avanti",
  },
  welcome: {
    title: "La tua istanza è attiva.",
    body: "Proteggila con il tuo accesso admin, collega un'IA e inizi a chattare. Bastano due minuti.",
    inProgress:
      "La configurazione di questa istanza è già iniziata. Accedi come admin per completarla.",
    failed:
      "L'accesso admin predefinito non ha funzionato. Se l'hai già cambiato, accedi con il tuo.",
    start: "Avvia la configurazione",
    starting: "Avvio in corso",
    signIn: "Accedi come admin",
  },
  readOnly: {
    title: "Qui le impostazioni sono di sola lettura",
    body: "Questa istanza prende le impostazioni dall'ambiente di deploy, quindi questa pagina non può salvarle. Impostale dove fai il deploy, poi riavvia.",
  },
  admin: {
    title: "Crea il tuo accesso admin",
    body: "Sostituisce l'accesso predefinito. Lo usi per entrare qui e nella CLI vibe.",
    email: "Email",
    emailHelp: "Il tuo nome di accesso. Non ci arriva nessuna email.",
    emailPlaceholder: "tu@esempio.it",
    password: "Password",
    passwordHelp: "Almeno 8 caratteri. Salvata cifrata su questo computer.",
    confirm: "Ripeti la password",
    save: "Salva e continua",
    errors: {
      email: "Inserisci un indirizzo email valido.",
      passwordShort: "Usa almeno 8 caratteri.",
      passwordDefault: "Scegli una password tua, non quella predefinita.",
      mismatch: "Le password non coincidono.",
    },
  },
  ai: {
    title: "Collega l'IA",
    body: "Scegli da dove arrivano i modelli. Basta un'opzione. Puoi aggiungerne altre quando vuoi.",
    byo: "Oppure usa le tue chiavi",
    moreProviders: "Altri provider",
    skip: "Salta per ora",
    unbottled: {
      title: "Il tuo account unbottled.ai",
      recommended: "Consigliato",
      body: "Un solo accesso sblocca tutti i modelli di unbottled.ai: mainstream, aperti e senza censura. L'uso scala i tuoi crediti unbottled.ai. Nessuna chiave da gestire.",
      email: "Email unbottled.ai",
      password: "Password unbottled.ai",
      advanced: "Avanzate",
      serverUrl: "URL del server",
      serverUrlHelp: "Cambiala solo per collegare un'altra istanza next-vibe.",
      failed: "Accesso non riuscito. Controlla email e password.",
      connect: "Collega l'account",
      connecting: "Collegamento",
      connected: "Collegato a {{url}}",
      unhealthy: "Connessione salvata, ma ora il server non risponde.",
      disconnect: "Scollega",
      noAccount: "Non hai un account?",
      createAccount: "Creane uno",
    },
    claude: {
      title: "Claude Code",
      detectedBadge: "Rilevato",
      missingBadge: "Non installato",
      detected:
        "Trovato su questo computer. I modelli Claude usano il tuo abbonamento Claude. Niente da inserire.",
      missing:
        "Installa la CLI claude e accedi per usare il tuo abbonamento Claude. Poi riavvia vibe dev.",
    },
  },
  fields: {
    openRouter: {
      label: "Chiave API OpenRouter",
      help: "Centinaia di modelli con una sola chiave.",
    },
    venice: {
      label: "Chiave API Venice AI",
      help: "Modelli privati e senza censura.",
    },
    nanoGpt: {
      label: "Chiave API NanoGPT",
      help: "Modelli senza censura e abliterated. Pagamento in crypto.",
    },
    openAi: {
      label: "Chiave API OpenAI",
      help: "Generazione di immagini con i modelli gpt-image.",
    },
    smtpHost: {
      label: "Server SMTP",
      help: "Il tuo server di posta, per esempio smtp.example.com.",
    },
    smtpPort: { label: "Porta", help: "Di solito 587, oppure 465 con TLS." },
    smtpSecure: {
      label: "Usa TLS",
      help: "Attivalo per la porta 465.",
    },
    smtpUser: {
      label: "Nome utente",
      help: "Di solito il tuo indirizzo email completo.",
    },
    smtpPass: {
      label: "Password",
      help: "Gmail e la maggior parte dei grandi provider chiedono qui una password per app.",
    },
    smtpFromEmail: {
      label: "Indirizzo mittente",
      help: "Le email partono da questo indirizzo.",
    },
    smtpFromName: {
      label: "Nome mittente",
      help: "Mostrato come mittente, per esempio il nome della tua istanza.",
    },
    stripeSecret: {
      label: "Chiave segreta",
      help: "Inizia con sk_. Vanno bene anche le chiavi di test.",
    },
    stripePublishable: {
      label: "Chiave pubblicabile",
      help: "Inizia con pk_.",
    },
    stripeWebhook: {
      label: "Segreto di firma del webhook",
      help: "Inizia con whsec_. Conferma che i pagamenti arrivano alla tua istanza.",
    },
    storageType: {
      label: "Dove salvare i file",
      help: "Caricamenti, immagini e audio delle tue chat.",
      optionFilesystem: "Questo computer",
      optionS3: "Storage compatibile S3",
    },
    s3Endpoint: {
      label: "URL dell'endpoint",
      help: "L'endpoint S3 del tuo provider, per esempio https://s3.amazonaws.com.",
    },
    s3Region: {
      label: "Regione",
      help: "Per esempio us-east-1. Alcuni provider accettano auto.",
    },
    s3Bucket: { label: "Bucket", help: "Il bucket deve già esistere." },
    s3AccessKey: {
      label: "Access key ID",
      help: "Dalla pagina delle chiavi di accesso del tuo provider di storage.",
    },
    s3SecretKey: {
      label: "Secret access key",
      help: "Viene mostrata una sola volta, quando crei la chiave.",
    },
    s3PublicUrl: {
      label: "URL pubblico",
      help: "Facoltativo. Un CDN o l'indirizzo pubblico del bucket per i link ai file.",
    },
  },
  extras: {
    title: "Extra facoltativi",
    body: "Per chattare non serve niente di tutto questo. Salta e torna quando ti serve.",
    configured: "Configurato",
    finish: "Completa la configurazione",
    skipFinish: "Salta e completa",
    errors: {
      s3Incomplete:
        "Lo storage S3 richiede endpoint, regione, bucket ed entrambe le chiavi.",
    },
    sections: {
      email: {
        title: "Email",
        body: "Conferme di registrazione e reset della password tramite il tuo server SMTP.",
      },
      payments: {
        title: "Pagamenti",
        body: "Vendi crediti e abbonamenti con Stripe.",
      },
      storage: {
        title: "Archivio file",
        body: "I file delle chat restano su questo computer, a meno che tu non scelga S3.",
      },
    },
  },
  done: {
    title: "Tutto pronto.",
    body: "La tua istanza è configurata ed è tua.",
    admin: "Accesso admin: {{email}}",
    aiUnbottled: "IA: il tuo account unbottled.ai",
    aiKeys: "IA: le tue chiavi dei provider",
    aiClaude: "IA: Claude Code su questo computer",
    aiNone:
      "Nessuna IA collegata per ora. Per chattare serve un provider. Puoi aggiungerlo quando vuoi nelle impostazioni admin.",
    start: "Inizia a chattare",
    later: "Puoi cambiare tutto più avanti nelle impostazioni admin.",
  },
};
