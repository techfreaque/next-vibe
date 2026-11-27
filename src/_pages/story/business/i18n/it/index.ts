import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Contabilità, CRM e AI sul tuo server | {{appName}}",
    description:
      "Contabilità in partita doppia, fatturazione, acquisti, magazzino, cassa, CRM e newsletter in un'unica app open source. Gira sul tuo server. Ogni funzione è uno strumento che la tua AI sa usare.",
    category: "Aziende",
    imageAlt: "{{appName}} self-hosted: contabilità, CRM e AI",
    keywords:
      "software di contabilità self-hosted, ERP open source, contabilità open source, partita doppia, software di fatturazione, contabilità con AI, CRM self-hosted, {{appName}}",
  },
  hero: {
    badge: "Gestionale open source",
    title: "I tuoi conti. Il tuo server.",
    titleHighlight: "AI inclusa.",
    subtitle:
      "Contabilità in partita doppia, fatturazione, acquisti, magazzino, cassa, CRM e newsletter in un'unica app open source. Gira sul tuo server. Ogni funzione è uno strumento che la tua AI sa usare.",
    ctaStart: "Installalo da te",
    ctaGithub: "Vedi su GitHub",
    shotAlt: "Bilancio di verifica di un'azienda demo: Dare uguale Avere",
    stats: {
      actions: "azioni che la tua AI può eseguire",
      reports: "report dal libro mastro, in tempo reale",
      charts: "piani dei conti: SKR03, ÖKR, SK, IFRS",
      languages: "lingue integrate",
    },
  },
  ledger: {
    eyebrow: "I conti",
    title: "Partita doppia. Senza eccezioni.",
    intro:
      "Fatture attive e passive, pagamenti e vendite in cassa finiscono da soli nel libro mastro, incluse scritture multivaluta con cambi giornalieri BCE, differenze cambio realizzate e rivalutazione di fine periodo. Dare uguale Avere, altrimenti non si registra nulla.",
    points: {
      balanced: {
        title: "Quadrata o respinta",
        body: "Ogni scrittura richiede almeno due righe e una quadratura esatta. Verificata alla creazione, alla registrazione e allo storno.",
      },
      final: {
        title: "Registrata è definitiva",
        body: "Niente modifiche silenziose. Un errore si corregge con uno storno che rispecchia l'originale e lo collega.",
      },
      periods: {
        title: "Periodi che si chiudono",
        body: "Le scritture devono cadere in un periodo aperto. La chiusura è bloccata finché ci sono bozze e registra chi ha chiuso.",
      },
      templates: {
        title: "Parti dal tuo paese",
        body: "Germania (SKR03), Austria (ÖKR) o Slovacchia (SK): aliquote IVA, cassa e conto bancario inclusi. Altrove: un piano dei conti IFRS generico, le aliquote le aggiungi tu.",
      },
    },
    reportsLabel: "Report in tempo reale dal libro mastro",
    reports: {
      balanceSheet: "Stato patrimoniale",
      profitLoss: "Conto economico",
      trialBalance: "Bilancio di verifica",
      aging: "Scadenzario clienti",
      vat: "Report IVA",
      payablesAging: "Scadenzario fornitori",
      journalExport: "Export CSV del giornale",
      taxFilings:
        "Dichiarazioni fiscali per paese (DE UStVA/EÜR, AT UVA, SK DPH/KV, IVA generica)",
    },
    shotAlt: "Fatture fornitori con stato e importi nell'admin di {{appName}}",
  },
  flows: {
    eyebrow: "Entrate e uscite",
    title: "Dal preventivo al mastro, senza ribattere nulla.",
    intro:
      "Ogni documento diventa il successivo con un'azione. La registrazione avviene strada facendo.",
    posted: "Registrato nel mastro",
    sales: {
      title: "Vendite",
      steps: {
        estimate: "Preventivo",
        invoice: "Fattura",
        payment: "Incasso registrato",
      },
      note: "Note di credito, PDF personalizzati con ZUGFeRD e codici QR di pagamento, invio email con registro consegne, fatture ricorrenti e link di pagamento Stripe.",
    },
    purchasing: {
      title: "Acquisti",
      steps: {
        order: "Ordine d'acquisto",
        receipt: "Merce ricevuta",
        bill: "Fattura fornitore",
        payment: "Pagata",
      },
      note: "Fornitori con aliquota IVA predefinita. Consegne parziali tracciate riga per riga. Il ricevimento carica la merce a magazzino.",
    },
    pos: {
      title: "Cassa",
      steps: {
        session: "Apri la cassa",
        order: "Batti lo scontrino",
        payment: "Contanti, carta o bonifico",
      },
      note: "Vendite e rimborsi scaricano il magazzino della cassa e registrano il costo del venduto (COGS) con regole configurabili sulle giacenze negative. La chiusura quadra i contanti.",
    },
    inventory: {
      title: "Magazzino",
      body: "Magazzini, carichi, scarichi e rettifiche, trasferimenti tra sedi. Ogni movimento entra in un registro non modificabile, con chi l'ha fatto.",
    },
  },
  suite: {
    eyebrow: "Intorno ai conti",
    title: "Il resto dell'azienda, nella stessa app.",
    intro:
      "Un login, un database, un pannello. Niente sincronizzazioni tra cinque abbonamenti.",
    aiLabel: "Qualsiasi modello",
    toolCount: "{{count}} azioni",
    cards: {
      crm: {
        title: "CRM e lead",
        body: "Importa contatti da CSV, segui trattative e prospezione, esporta quando vuoi.",
      },
      newsletter: {
        title: "Newsletter e campagne",
        body: "Doppio opt-in, disiscrizione con un clic, gestione dei rimbalzi, sequenze email.",
      },
      messaging: {
        title: "Posta e messaggi",
        body: "La tua casella via IMAP e SMTP, più SMS, Telegram e WhatsApp Business.",
      },
      payments: {
        title: "Fatturazione abbonamenti",
        body: "Checkout con Stripe e cripto, webhook e rimborsi per piani in abbonamento.",
      },
      team: {
        title: "Aziende e ruoli",
        body: "Più aziende in un'istanza. Invita il team come titolare, admin, contabile, membro o lettore.",
      },
      ai: {
        title: "Agenti programmati",
        body: "Gli agenti eseguono report e controlli a orari fissi. Con il tuo account {{appName}} o la tua chiave del provider.",
      },
    },
  },
  ai: {
    eyebrow: "Un'AI che lavora",
    title: "Chiedi ai tuoi conti. Risposte, non grafici.",
    intro:
      "Ogni operazione contabile è uno strumento tipizzato. La tua AI chiama lo stesso codice dei pulsanti dell'admin, con gli stessi controlli.",
    points: {
      chat: "Chiedi a parole tue. Il modello esegue il report e te lo spiega.",
      cli: "Automatizza la chiusura del mese dal terminale. Ogni strumento è un comando CLI.",
      mcp: "Claude Code, Cursor e Codex usano gli stessi strumenti via MCP.",
      permissions:
        "Un agente agisce come l'utente che lo avvia. Stesso ruolo in azienda, stessi controlli.",
    },
    demo: {
      label: "Esempio",
      question: "Chi ci deve soldi, e da quanto?",
      tool: "Scadenzario clienti",
      answer:
        "Tre clienti sono in ritardo, 4.180 EUR in totale. Il saldo più alto, 2.380 EUR, è scaduto da 47 giorni. Vuoi i numeri delle fatture?",
    },
    tabs: {
      cli: "CLI",
      mcp: "MCP",
    },
  },
  compare: {
    eyebrow: "La differenza",
    title: "Il tipico software di contabilità SaaS contro il tuo server.",
    intro:
      "Gli strumenti in cloud sono comodi. Ecco cosa cedi in cambio, e dove sono ancora avanti.",
    colSaas: "Tipico software contabile SaaS",
    colUs: "{{appName}}, self-hosted",
    colSaasShort: "SaaS",
    colUsShort: "Self-hosted",
    rows: {
      data: {
        label: "Dove stanno i tuoi conti",
        saas: "Nel loro cloud, alle loro condizioni",
        us: "Sul tuo server, nel tuo Postgres",
      },
      seats: {
        label: "Prezzo per utente",
        saas: "Canone mensile per postazione",
        us: "Nessun canone per postazione. Paghi l'hosting e l'AI che usi.",
      },
      ai: {
        label: "AI",
        saas: "Come extra, o per niente",
        us: "Ogni funzione è uno strumento AI, con qualsiasi modello",
      },
      code: {
        label: "Codice sorgente",
        saas: "Chiuso",
        us: "Aperto su GitHub",
      },
      missing: {
        label: "Ti manca una funzione",
        saas: "Aspetti la roadmap",
        us: "La costruisci: un file di definizione",
      },
      exit: {
        label: "Andarsene",
        saas: "Esporti quello che ti lasciano",
        us: "È già il tuo database",
      },
      filings: {
        label: "Collegamento bancario e dichiarazioni",
        saas: "Spesso inclusi",
        us: "Inclusi: feed bancari (Enable Banking), import estratti conto (CAMT.053, MT940, CSV) e riconciliazione, più export DE UStVA/EÜR, AT UVA, SK DPH/KV e IVA generica.",
      },
      hosting: {
        label: "Gestione",
        saas: "Fatta per te",
        us: "Lo gestisci tu. Ti aiutiamo se chiedi.",
      },
    },
  },
  start: {
    eyebrow: "Installazione",
    title: "Tre comandi. Poi crea la tua azienda.",
    intro:
      "Clona, installa, avvia. La procedura guidata imposta login admin e AI. Poi aggiungi la tua azienda nell'admin. Germania, Austria o Slovacchia: piano dei conti, aliquote IVA, cassa e conto bancario in un passo. Altrove: un piano IFRS generico come base.",
    terminalTitle: "Avvia la tua istanza",
    guide: "Guida completa al self-hosting",
    developers: "Crea i tuoi moduli",
  },
  code: {
    copy: "Copia",
    copied: "Copiato",
    wrap: "A capo automatico",
  },
  help: {
    title: "Stai portando qui un'azienda?",
    description:
      "Aiuto all'installazione, migrazione dei dati, moduli su misura. Ogni messaggio lo legge una persona.",
  },
};
