import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Un robot ha premuto tutti i pulsanti. Ha trovato otto falle.",
    description:
      "Abbiamo creato un framework di test end-to-end che apre le pagine in un browser vero e copre tutti gli endpoint usati dai clienti. Ecco cosa abbiamo trovato.",
    category: "Ingegneria",
    imageAlt: "Test end-to-end guida {{appName}} in un vero browser",
    keywords:
      "E2E testing, Playwright, security, SSRF, open redirect, next-vibe, {{appName}}",
  },
  hero: {
    backToBlog: "Torna al blog",
    category: "Ingegneria",
    readTime: "7 min lettura",
    title: "Un robot ha premuto tutti i pulsanti. Ha trovato otto falle.",
    subtitle:
      "Siamo passati dai singoli componenti alle pagine intere. Un browser vero, un server vero e clic veri su tutti gli endpoint accessibili ai clienti.",
  },
  intro: {
    lead: "Il codice aveva superato il controllo dei tipi, il lint e i test unitari, eppure sono passati dei bug. Un modulo ignorava la conferma della password, i link alle fatture non funzionavano e il feed mostrava thread cancellati.",
    p1: "Ognuno di loro viveva nel vuoto tra i pezzi. La funzione era a posto. La pagina intorno a esso non era. Così abbiamo costruito un quadro di prova che si preoccupa solo di una cosa: ciò che un cliente realmente vede e invia.",
  },
  why: {
    title: "Perché testare la pagina reale?",
    intro:
      "Ogni livello di test cattura una classe diversa di bug. Solo l'ultimo vede ciò che i tuoi utenti vedono.",
    unit: {
      label: "Prova di unità",
      title: "Controlla una funzione",
      body: "Veloce ed economico. Cieco al cablaggio: sbagliato URL, nome del campo sbagliato, un pulsante che non invia mai.",
    },
    api: {
      label: "Test API",
      title: "Controlla una richiesta",
      body: "Fornisce le risposte del server. Non prova mai la pagina invia quella richiesta o rende la risposta.",
    },
    e2e: {
      label: "Fine-to-end",
      title: "Controlla l'intero viaggio",
      body: "Apre la pagina in Chromium, tipi come una persona, clicca sotto, legge la risposta dal filo. Se funziona qui, funziona per i clienti.",
    },
  },
  how: {
    title: "Come funziona l'imbracatura",
    intro:
      "Playwright guidato da bun test, costruito sulla parte superiore delle definizioni endpoint di next-vibe. La definizione conosce già ogni campo: quindi il test non ha bisogno di farlo.",
    step1: {
      title: "Aprire la pagina reale",
      body: "Il test apre una pagina reale, come /user/login o /story/framework. Aspetta che React prenda il controllo del modulo prima di digitare.",
    },
    step2: {
      title: "Riempire con valori digitati",
      body: "Si passano i valori, non i selettori. I driver di campo leggono la definizione e operano il visibile UI: tipo, scelgono un'opzione dalla sua etichetta, allegano un file.",
    },
    step3: {
      title: "Catturare la chiamata via il filo",
      body: "Invia restituisce la verità: il corpo di richiesta, lo stato e la risposta. L'imbracatura afferma che la richiesta ha portato esattamente ciò che è stato digitato.",
    },
    step4: {
      title: "Registrare una volta, rigiocare per sempre",
      body: "Alla prima esecuzione di ogni test registriamo le chiamate ai provider a pagamento di modelli IA, immagini, musica e video. Poi riproduciamo le chiamate registrate. Niente costi a sorpresa e risultati ripetibili.",
    },
    step5: {
      title: "Copertura dei report",
      body: "Un rapporto di copertura conta ogni punto finale pubblico: un successo e un rifiuto ciascuno. I salti sono visibili, non indovinati.",
    },
    codeCaption: "Una spec completa. Niente selettori, niente mock.",
  },
  numbers: {
    title: "Il tabellone",
    suites: "suite di prova",
    covered: "punti di vista pubblici coperti",
    security: "fori di sicurezza chiusi",
    note: "I punti finali rimanenti hanno bisogno di chiavi del fornitore retribuite per la ricerca, la demolizione e il discorso prima che possano essere registrati.",
  },
  security: {
    title: "I buchi di sicurezza che ha trovato",
    intro:
      "Nessuno di questi si è presentato in controlli di tipo o test unitari. Tutti loro hanno mostrato il momento in cui un vero browser ha camminato il flusso reale.",
    openRedirect: {
      title: "Aprire il reindirizzamento su /track",
      body: "Chiunque potrebbe creare un link che ha rimbalzato attraverso il nostro dominio a qualsiasi sito. Gli obiettivi esterni hanno ora bisogno di una firma HMAC.",
    },
    ssrf: {
      title: "SSRF tramite URL forniti dall'utente",
      body: "Gli URL che si consegnano lo AI potrebbero puntare agli indirizzi interni. Una guardia ora risolve DNS e controlla ogni hop reindirizzato.",
    },
    ssrCache: {
      title: "cache server condivisa tra le richieste",
      body: "La cache di query server-render potrebbe portare i dati di un utente in un'altra pagina render. Ora è isolato a richiesta.",
    },
    systemPrompt: {
      title: "Debug di sistema-prompt leggere qualsiasi thread",
      body: "Un punto finale di debug non ha controllato la proprietà del thread. Ora si'.",
    },
    publicFeed: {
      title: "Feed pubblico elencato thread nascosti",
      body: "I filetti nascosti e cancellati sono apparsi nel feed pubblico. Sono filtrati.",
    },
    loginOptions: {
      title: "Opzioni di accesso account trapelati",
      body: "La risposta alle opzioni di login ha rivelato se un'e-mail avesse un account. Non lo fa più.",
    },
    resetPassword: {
      title: "Ripristino ignorato la conferma",
      body: "Il passo di conferma del reset-password ha ignorato il campo di conferma. Le mancanze sono ora respinte.",
    },
    privateFiles: {
      title: "File privati memorizzati in cache pubblicamente",
      body: "I file privati sono stati serviti con Cache-Control: pubblico, in modo che le cache condivise potrebbero tenerli. Ora sono private.",
    },
  },
  broken: {
    title: "E le cose che sono state appena rotte",
    intro:
      "Questi bug passavano inosservati e creavano problemi agli utenti:",
    items: {
      attachments:
        "Gli URL degli allegati di chat e i rapporti di errore del client sono stati resi 404.",
      permissions:
        "I permessi di radice non sono mai stati recuperati: i clienti non potevano inviare in Shared.",
      embed: "Il widget di Mount incorporato era morto.",
      invoices: "I link email di fatturazione sono tornati 404.",
      models: "La pagina dei modelli era inutilizzabile.",
      music: "La generazione musicale su OpenRouter è fallita.",
      fixtures: "Campo di prova di portata trapelato chiamate live pagate.",
      pglite:
        "I database locali PGlite hanno restituito le righe errate da INSERT... RETURNING.",
      pagination: "L'impaginazione dei visitatori su /tools è stata rotta.",
    },
    footer:
      "Inoltre una lunga coda di stringhe e widget non traslati corretti.",
  },
  closing: {
    title: "Che cosa significa per te",
    p1: "Ogni pagina che usi per iscriverti, accedere, pagare, chat, generare o abbonarsi ora ha un test che lo apre in un browser reale e fa quello che fai. Quando cambiamo qualcosa, il robot lo ripassa di nuovo prima che tu lo faccia.",
    p2: "Il framework navi con next-vibe. Se si costruisce su di esso, i punti finali ottenere la stessa imbracatura gratuitamente.",
  },
  cta: {
    title: "Leggi l'imbracatura. Usalo sul tuo codice.",
    subtitle:
      "Il framework E2E è open source e parte di next-vibe. Un file spec per caratteristica, colocato con la definizione.",
    github: "Visualizza su GitHub",
    framework: "Esplorare next-vibe",
  },
};
