import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  possibleDuplicateBookings:
    "I movimenti potrebbero sovrapporsi a un’importazione precedente. Controlla il conto bancario contabile prima di riprovare. Nessun movimento è stato salvato.",
  privacyBeforeImport:
    "Imposta le regole di riservatezza prima di visualizzare in anteprima o importare i movimenti.",
  previewResult: "Esito dell’anteprima",
  importResult: "Esito dell’importazione",
  bookingDay: "Data di contabilizzazione {{date}}",
  bookingWindow: "Periodo contabile dal {{from}} al {{to}}",
  providerBookings: "Movimenti del fornitore controllati",
  eligibleBookings: "Movimenti aziendali ammessi",
  savedBookings: "Movimenti salvati",
  previewPrivacyResult:
    "I movimenti scartati non rispettavano le regole di riservatezza. Il confronto con le fatture avviene al salvataggio. Le corrispondenze ambigue restano aperte.",
  importPrivacyResult:
    "I movimenti scartati non rispettavano le regole di riservatezza. Le corrispondenze ambigue con le fatture restano aperte.",
  setup: "Configura il conto bancario",
  setupHint:
    "Salvi il conto contabile e la data iniziale, poi configuri la privacy. La configurazione non legge operazioni.",
  privacyAction: "Configura la privacy",
  privacyRequired:
    "Salvi le impostazioni sulla privacy prima di leggere le operazioni bancarie.",
  setupSaved:
    "Configurazione salvata. Ora puoi impostare le regole per i fornitori.",
  supplierTotals: "Totali dei fornitori identificati nel periodo",
  errors: {
    validation: {
      title: "Controlla i dati",
      description:
        "Scegli un’azienda e un conto bancario attivo e registrabile nella sua valuta.",
    },
    network: {
      title: "Errore di rete",
      description: "Controlla la connessione e riprova.",
    },
    unauthorized: {
      title: "Accedi",
      description: "Accedi per usare la riconciliazione bancaria.",
    },
    forbidden: {
      title: "Accesso negato",
      description: "Il tuo ruolo aziendale non consente questa operazione.",
    },
    notFound: {
      title: "Conto o riga bancaria non disponibile",
      description: "Controlla l’azienda e il conto selezionati.",
    },
    server: {
      title: "Operazione bancaria non riuscita",
      description:
        "Riprova. Se l’operazione fallisce, i dati restano invariati.",
    },
    unknown: {
      title: "Errore bancario imprevisto",
      description: "Riprova.",
    },
    unsavedChanges: {
      title: "Modifiche non salvate",
      description: "Le modifiche sono ancora nel modulo.",
    },
    conflict: {
      title: "Conflitto nella riconciliazione",
      description:
        "Aggiorna l’estratto conto e controlla la scrittura selezionata.",
    },
  },
  maintenance: "Manutenzione collegamenti bancari",
  maintenanceHint:
    "Elimina i dati privati scaduti, ricorda ai titolari di rinnovare il consenso e aggiorna i collegamenti attivati.",
  completed: "Collegamenti aggiornati",
  failedFeeds: "Collegamenti da verificare",
  notified: "Promemoria inviati",
  matchedOnly: "Mantieni solo i movimenti che soddisfano le regole fornitori",
  discardedCount: "Scartati",
  autoMatched: "Abbinati a fatture",
  discardHint:
    "I movimenti senza corrispondenza vengono scartati senza salvarne i dettagli. Disattivi questa opzione per usare la coda di verifica privata.",
  company: "Azienda",
  account: "Conto bancario in contabilità",
  start: "Primo giorno contabile",
  daily: "Sincronizza ogni giorno",
  connect: "Collega banca",
  review: "Verifica movimenti",
  held: "Da verificare",
  privateCount: "Privati",
  connected: "Banca collegata.",
  failed: "Collegamento non riuscito. Provi a collegare di nuovo la banca.",
  check: "Verifica applicazione",
  active: "L’applicazione è attiva per la consultazione dei conti.",
  inactive:
    "L’accesso dell’applicazione alle informazioni sui conti è inattivo.",
  appUnavailable: "Stato dell’applicazione non disponibile.",
  linking:
    "Il collegamento nel portale del fornitore abilita il conto. Autorizzi l’accesso una volta in questa applicazione. I conti già autorizzati compaiono automaticamente.",
  pick: "Selezioni un conto per visualizzare un’anteprima dei movimenti contabilizzati.",
  apply: "Esegui importazione",
  previewAction: "Anteprima importazione",
  dailyHint:
    "Scegli la data iniziale e controlla i fornitori riconosciuti prima di importare.",
  title: "Conti bancari collegati",
  description:
    "Verifichi o importi i movimenti contabilizzati su un conto bancario autorizzato.",
  select: "Selezioni un collegamento bancario",
  preview: "Solo anteprima",
  sync: "Sincronizza movimenti bancari",
  connection: "Collegamento bancario",
  consentUntil: "Consenso valido fino al",
  period: "Periodo contabile",
  imported: "Importati",
  skipped: "Già importati",
  unavailable:
    "Collegamento non disponibile. Verifichi la connessione e i permessi sul conto.",
  consent:
    "Il consenso è scaduto. Lo rinnovi presso la banca prima della sincronizzazione.",
  rateLimit: "La banca è occupata. Riprovi più tardi.",
  invalidResponse:
    "La banca ha restituito un estratto incompleto. La data di avanzamento è stata conservata.",
  windowTooLarge:
    "Troppi movimenti nel periodo. Importi un estratto più breve.",
  empty: "Nessun conto bancario collegato",
  noBookings: "Nessun movimento nel periodo.",
  newBookings: "Nuovi movimenti",
  through: "Ultimo giorno importato",
};
