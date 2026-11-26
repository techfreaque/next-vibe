import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { pos: "Cassa", fiscal: "Scontrini fiscali" },
  enums: {
    adapter: {
      sandbox: "Sandbox (solo test, non certificato)",
    },
    deviceKind: {
      orp: "ORP (registratore con memoria hardware)",
      sorp: "SORP (registratore software, memoria presso il produttore)",
      vrp: "VRP (registratore virtuale gratuito della Finančná správa)",
    },
    receiptStatus: {
      pending: "In attesa di registrazione",
      registered: "Registrato",
      offline: "Emesso offline",
      failed: "Non riuscito",
    },
  },
  block: {
    ekasaRequired:
      "La legge slovacca impone di registrare in eKasa ogni vendita in contanti o con carta. Prima di vendere, colleghi un registratore eKasa certificato nelle impostazioni fiscali della cassa.",
  },
  title: "Scontrini fiscali",
  description:
    "Verifichi se il suo paese richiede scontrini fiscali online e quale registratore registra le sue vendite.",
  saveTitle: "Registratore fiscale",
  saveDescription:
    "Colleghi il registratore che trasmette le vendite della cassa all'amministrazione fiscale.",
  company: "Azienda",
  adapter: "Fornitore",
  adapterPlaceholder: "Scelga un fornitore",
  adapterDescription:
    "Solo i fornitori certificati registrano vendite reali. La sandbox serve ai test e non sblocca mai la vendita.",
  deviceKind: "Tipo di registratore",
  deviceKindDescription:
    "ORP salva gli scontrini in un CHDÚ hardware. SORP tiene la memoria protetta sui server del produttore. VRP è il servizio gratuito della Finančná správa.",
  cashRegisterCode: "Codice registratore",
  cashRegisterCodeDescription:
    "Il codice assegnato a questo registratore dall'amministrazione fiscale (kód pokladnice).",
  cashRegisterCodePlaceholder: "es. 88812345678900001",
  isEnabled: "Registrare le vendite con questo fornitore",
  isEnabledDescription:
    "Se attivo, ogni vendita conclusa viene messa in coda per la registrazione.",
  certifiedUntil: "Certificato valido fino al",
  certifiedUntilDescription:
    "Ultimo giorno di validità del certificato del registratore. Dopo la scadenza le vendite sono bloccate.",
  credentialRef: "Riferimento credenziali",
  credentialRefDescription:
    "Nome della chiave o del certificato salvato. Non incolli mai qui una chiave privata o una password.",
  offlineDeadlineHours: "Termine di invio offline (ore)",
  offlineDeadlineHoursDescription:
    "Gli scontrini emessi offline devono arrivare all'amministrazione fiscale entro questo termine.",
  response: {
    required: "Scontrini fiscali obbligatori",
    blocked: "Vendite bloccate",
    provider: "Registratore",
    counts: "Coda scontrini",
    adapters: "Fornitori disponibili",
    companyName: "Azienda",
    country: "Paese",
    saved: "Salvato",
  },
  widget: {
    requiredTitle: "eKasa è obbligatoria per questa azienda",
    requiredMessage:
      "Ogni vendita in contanti o con carta va registrata online in eKasa (zákon 384/2025 Z. z.). Gli scontrini non confermati entro 5 secondi vengono salvati offline e vanno inviati entro 96 ore.",
    notRequiredTitle: "Nessuno scontrino fiscale online richiesto",
    notRequiredMessage:
      "La nostra libreria non prevede un sistema fiscale online per il paese di questa azienda. Le vendite in cassa funzionano come sempre.",
    blockedTitle: "Le vendite in cassa sono bloccate",
    blockedMessage:
      "Colleghi e attivi un registratore eKasa certificato. Fino ad allora la cassa non può concludere vendite.",
    readyTitle: "Le vendite vengono registrate",
    readyMessage:
      "Le vendite concluse vengono messe in coda e registrate dal registratore collegato.",
    noCertifiedProvider:
      "In questa installazione non è ancora disponibile alcun fornitore eKasa certificato.",
    noProvider: "Nessun registratore collegato",
    configure: "Colleghi un registratore",
    edit: "Modifichi il registratore",
    certified: "Certificato",
    notCertified: "Non certificato",
    enabled: "Attivo",
    disabled: "Disattivato",
    certifiedUntilValue: "Certificato valido fino al {{date}}",
    pending: "In attesa",
    offline: "Offline",
    failed: "Non riusciti",
    overdue: "Oltre il termine",
    queueHint: "Scontrini non ancora confermati dall'amministrazione fiscale.",
    disclaimer: "Forniamo strumenti, non consulenza fiscale.",
    pickCompany: {
      title: "Scelga un'azienda",
      message: "Le regole fiscali dipendono dal paese dell'azienda.",
    },
    savedTitle: "Registratore salvato",
    savedBlocked:
      "Le vendite restano bloccate: questo fornitore non è certificato per eKasa.",
    savedReady:
      "Le vendite concluse saranno registrate da questo registratore.",
    back: "Indietro",
    save: "Salvi il registratore",
    sectionProvider: "Fornitore",
    sectionDevice: "Registratore",
  },
  errors: {
    validation: {
      title: "Controlli i dati del registratore",
      description: "Alcuni valori mancano o non sono validi.",
    },
    unauthorized: {
      title: "Accesso richiesto",
      description: "Acceda per gestire gli scontrini fiscali.",
    },
    forbidden: {
      title: "Accesso negato",
      description:
        "Solo i titolari e gli amministratori dell'azienda possono modificare le impostazioni fiscali.",
    },
    notFound: {
      title: "Azienda non trovata",
      description: "L'azienda non esiste o lei non ne è membro.",
    },
    conflict: {
      title: "Impostazioni modificate",
      description: "Ricarichi la pagina e riprovi.",
    },
    server: {
      title: "Impostazioni fiscali non disponibili",
      description: "Riprovi tra un momento.",
    },
    network: {
      title: "Nessuna connessione",
      description: "Controlli la connessione e riprovi.",
    },
    unknown: {
      title: "Qualcosa è andato storto",
      description: "Riprovi tra un momento.",
    },
    unsavedChanges: {
      title: "Modifiche non salvate",
      description: "Salvi o annulli prima le modifiche.",
    },
    deviceKindUnsupported:
      "Questo fornitore non supporta il tipo di registratore scelto.",
    adapterUnknown: "Questo fornitore non esiste.",
    sandboxProduction:
      "La sandbox non è ammessa in produzione. Scelga un fornitore certificato.",
  },
  success: {
    title: "Impostazioni fiscali caricate",
    description: "Stato degli scontrini fiscali dell'azienda.",
    savedTitle: "Registratore salvato",
    savedDescription: "Le impostazioni del registratore fiscale sono salvate.",
  },
};
