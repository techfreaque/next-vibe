import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Cosa c'è di nuovo: sei mesi in una pagina ({{appName}})",
    description:
      "Stop vuol dire stop. La voce funziona su iPhone. La tua IA gira su tutte le tue macchine. Self-hosting senza Docker. Un robot di test ha chiuso otto falle.",
    category: "Aggiornamento del prodotto",
    imageAlt: "{{appName}}: aggiornamento di novembre 2026",
    keywords:
      "{{appName}}, aggiornamento prodotto, Hermes, Thea, PGlite, self-host, discorso al testo, test E2E, sicurezza",
  },
  hero: {
    backToBlog: "Torna al blog",
    category: "Aggiornamento del prodotto",
    readTime: "6 minuti di lettura",
    title:
      "Sei mesi di novità: più velocità, più sicurezza, su qualsiasi dispositivo.",
    subtitle:
      "Fermati significa fermarti. La voce funziona su iPhone. Il tuo AI ti segue attraverso le macchine. L'auto-hosting non ha bisogno di Docker. E un robot di prova ha chiuso otto buchi di sicurezza.",
  },
  intro: {
    lead: "Il nostro ultimo aggiornamento è stato a maggio. Da allora abbiamo strappato la base di codice fino alle borchie, l'abbiamo ricostruita più lusinghiera, e abbiamo trascorso mesi a fissare ciò che le persone reali hanno colpito in produzione.",
    p1: "Lasciamo da parte gli elenchi da 200 voci. Ecco i cambiamenti che noterai, divisi per area.",
  },
  chat: {
    title: "Chatta che obbedisce",
    intro:
      "Le piccole cose che hanno fatto chiacchierare si sentono lenti o testardi.",
    stop: {
      title: "Stop significa stop",
      body: "Colpire stop e tokens smettere di apparire in quel momento: non aspettare che il server si abbatte. Stop ora raggiunge anche chat incognito e log-out, dove usava fare nulla.",
    },
    input: {
      title: "Input misura per il tuo modello",
      body: "La casella di messaggio sa quanto spazio il modello selezionato ha lasciato in questo thread, invece di un limite piatto per ogni modello.",
    },
    reasoning: {
      title: "I modelli tengono il loro treno di pensiero",
      body: "I blocchi di ragionamento vengono rimandati al modello sul turno successivo invece di essere spogliati. Così i modelli di pensiero si basano su quello che hanno già funzionato.",
    },
    queue: {
      title: "Digitare mentre funziona",
      body: "Invia messaggi mentre AI è mid-answer: si in coda in ordine. Lo strumento lungo funziona compatto il loro contesto mid-stream invece di colpire la parete.",
    },
  },
  voice: {
    title: "Voce che funziona ovunque",
    intro: "Speech-to-text ha avuto l'attenzione di cui aveva bisogno.",
    ios: {
      title: "iPhone e iPad fissi",
      body: "Safari su iOS ha sospeso il motore audio, così la dittazione silenziosamente è morta. Ora riprende correttamente.",
    },
    long: {
      title: "Registra finché ti piace",
      body: "Le registrazioni sono divise in pezzi, quindi la dittatura non è più bloccata da un caricamento.",
    },
    windows: {
      title: "Finestre fissate",
      body: "Un'esecuzione di correzioni ha fatto il lavoro vocale-to-text sui desktop di Windows.",
    },
  },
  agents: {
    title: "Il tuo AI, attraverso le tue macchine",
    intro:
      "Thea corre nel cloud. Hermes funziona sul tuo computer. Ora lavorano veramente insieme.",
    twoWay: {
      title: "Filetti remoti a due vie",
      body: "Consegnare un filo dal cloud alla macchina o indietro, in entrambe le direzioni. Se l'altro lato non ha chiave API, il tuo lato cade indietro e lo gestisce localmente.",
      link: "Come parlare Hermes e Thea",
    },
    coding: {
      title: "Un agente di codifica è possibile guardare",
      body: "Thea può avviare un agente di codifica interattivo sulla tua macchina: una vera finestra della console che puoi vedere: tracciato come un'attività, con il risultato riportato indietro.",
      link: "Incontra l'agente di codifica",
    },
    tools: {
      title: "Strumenti più nitidi",
      body: "Migliore automazione del browser con l'emulazione del dispositivo, strumenti desktop su Windows e strumenti SSH per ogni cliente: non solo amministratori.",
    },
  },
  selfHost: {
    title: "Auto-hosting è stato facile",
    intro:
      "Eseguire la propria istanza usato per significare Docker e una toolchain C++. Non piu'.",
    pglite: {
      title: "Non c'è bisogno di Docker",
      body: "Punto DATABASE_URL in un file e il server viene eseguito su un Postgres incorporato (PGlite). Migrazioni e semi funzionano.",
    },
    windows: {
      title: "Windows è di prima classe",
      body: "Mesi di Windows correzioni: percorsi, blocchi di file, user seeding, funzioni del database. Clone, install, run.",
    },
    native: {
      title: "Nessun compilatore richiesto",
      body: "Password hashing si è spostato in binari precostruiti: node-gyp, senza strumenti di costruzione. Stesso algoritmo, hashes esistenti ancora valida.",
    },
    revive: {
      title: "Torna da solo",
      body: "Il server di produzione si riavvia dopo un crash, e un riavvio del database non può più abbassare l'app.",
    },
  },
  security: {
    title: "Sicuro per impostazione predefinita",
    intro: "I miglioramenti alla sicurezza fanno il loro lavoro in silenzio.",
    e2e: {
      title: "Un robot testa ogni pagina",
      body: "60 end-to-end suite ora guidare le pagine reali in un browser reale. Hanno trovato e abbiamo chiuso otto buchi di sicurezza, da un redirect aperto a file privati memorizzati pubblicamente.",
      link: "Leggi cosa ha trovato",
    },
    patches: {
      title: "Immagine di base Patched",
      body: "Il nostro contenitore tira le ultime patch di sicurezza alpina, tra cui la correzione per CVE-2026 -111497.",
    },
    toolCalls: {
      title: "Meno chiamate attrezzo rotto",
      body: "Quando un modello invia malformato utensile-call JSON, viene riparato invece di mancare l'intero giro.",
    },
  },
  cta: {
    title: "Guardalo da solo.",
    subtitle:
      "Ogni cambiamento sopra è live su {{appName}} oggi e nel codice open-source se si esegue il proprio.",
    chat: "Iniziare a chattare",
    selfHost: "Te lo garantisco.",
  },
};
