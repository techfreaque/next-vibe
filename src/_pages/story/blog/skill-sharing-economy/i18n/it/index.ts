import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Crea una skill. Condividi il link. Guadagna ogni mese.",
    description:
      "Le competenze {{appName}} sono configurate con le impostazioni AI preconfigurate che si mettono in commercio una volta e condividono ovunque. Il link di condivisione ti posiziona nella catena di riferimento - guadagnando il 10% di ogni pagamento che l'utente fa mai, più il 5% quando altri condividono la tua abilità.",
    category: "Economia delle skill",
    imageAlt:
      "Una persona che costruisce abilità AI e guadagna reddito ricorrente condividendo loro",
    keywords:
      "AI competenze, reddito passivo, programma di riferimento, {{appName}}, personalizzato AI, condivisione di abilità, economia di abilità",
  },
  hero: {
    backToBlog: "Torna al blog",
    category: "Economia delle skill",
    readTime: "7 min lettura",
    title: "Crea una skill. Condividi il link. Guadagna ogni mese.",
    subtitle:
      "Crea una AI preconfigurata una volta. Condividi ovunque. Guadagnare il 10% ricorrente da ogni pagamento che le persone che si iscrivano attraverso di esso mai fare.",
    quote:
      "\"Ho costruito un'abilità di ragionamento clinica per gli studenti di medicina. Tre mesi dopo, paga per il mio abbonamento e poi un po'.\"",
  },
  whatAreSkills: {
    title: "Quali sono le competenze su {{appName}}?",
    p1: "Un'abilità è una configurazione AI completa - prompt del sistema, persona compagna, selezione modello per modalità, impostazioni di generazione vocale, immagine - configurata una volta e riutilizzabile ovunque. Pensate a esso come una ricetta: capire gli ingredienti giusti una volta, allora chiunque può usarlo.",
    p2: "La piattaforma ha modelli {{modelCount}}: mainstream, open-source, non censurato. Ogni abilità configura quale modello da utilizzare per la conversazione, che per la visione, che per la generazione di immagini, con cui la voce parlare. La maggior parte degli utenti non avrà mai bisogno di toccare quelle impostazioni - basta usare l'abilità. Tu, come il creatore, capirai una volta.",
    p3: "Le abilità sono libere di creare. Non è richiesto alcun abbonamento a pagamento. Niente codifica. Se si può descrivere ciò che si desidera un AI da fare, è possibile costruire una abilità.",
    buildTitle: "Tre modi per costruire un'abilità",
    build1Title: "Manualmente sulla pagina delle abilità",
    build1Body:
      "Controllo completo. Configurare ogni impostazione direttamente. Bene, se sai esattamente cosa vuoi.",
    build2Title: "Chiedi a Thea o Hermes in conversazione",
    build2Body:
      "Descrivi cosa stai cercando di costruire. Brainstorm con loro - lasciateli redigere il prompt del sistema, spingere indietro sulle vostre idee, iterare. Il modo migliore per costruire qualcosa di sfumato. Conoscono la piattaforma.",
    build3Title: "Per chi sviluppa: genera un file skill.ts",
    build3Body:
      "Chiedi al tuo agente di creare un file di abilità. Emette un skill.ts seguendo la stessa struttura delle abilità di compagno incorporato - pronto a impegnarsi e utilizzare immediatamente.",
  },
  shareLink: {
    title: "Il link meccanico di condivisione - come si guadagna realmente",
    p1: "Quando si colpisce Share & Earn su qualsiasi abilità, si ottiene un URL che fa due cose contemporaneamente:",
    bullet1:
      "Mostra ai visitatori l'abilità - che cosa fa, come è configurato, che tipo di AI è",
    bullet2:
      "Posizioni nella catena di rinvio - chiunque si accendi attraverso questo link è attribuito a voi",
    p2: "Ecco cosa significa quell'attribuzione nella pratica: quando qualcuno si iscrive attraverso il tuo link di abilità, sei il loro referrer diretto. Guadagnerai il 10% di ogni pagamento che facciano, per sempre. E quando un altro membro condivide la tua abilità con il proprio link, si guadagna ancora 5% come creatore di abilità - sugli utenti che non hai mai toccato.",
    p3: "Guadagni il 10% a ogni rinnovo dell’abbonamento, ricarica o acquisto. Ti basta condividere il link una volta.",
    p4: "La URL sembra: {{appName}} /track?ref= YOUR_CODE &url=/en/skill/ SKILL_ID",
  },
  examples: {
    title: "Competenze che le persone in realtà condividono - e guadagnare da",
    p1: "Le abilità di maggior successo risolvono un problema specifico e ricorrente che è difficile da spiegare senza mostrare. Ecco i modelli che funzionano:",
    example1Title: "Il compagno specializzato",
    example1Body:
      "Uno studente di medicina costruisce un'abilità che ti parla come un collega clinico senior - casi, differenziali, ragionamento sotto pressione. Condividi in forum di medicina. Ogni iscrizione da quella comunità paga mensile.",
    example2Title: "Il prodotto reale del venditore di conoscenze",
    example2Body:
      "Allenatori, consulenti, creatori di corsi - hanno venduto PDF e chiamate Zoom. Un'abilità ben costruita con la loro esperienza reale guadagna reddito ricorrente senza il capo. E' meglio di un corso.",
    example3Title: "L'opzione non censurata",
    example3Body:
      "Competenze utilizzando modelli non censurati per la scrittura creativa, il gioco di ruolo, o il dibattito. Condividi nelle comunità in cui la censura tradizionale AI è una frustrazione costante e quotidiana. E' un'alta intenzione di firmare.",
    example4Title: "Il recensore del codice dello sviluppatore",
    example4Body:
      "Conosce il tuo stack, fa rispettare le convenzioni della tua squadra. Condividi in comunità ingegneristiche piene di persone che spendono $100–200/mese su AI. Firma di alto valore che attaccano.",
  },
  theMath: {
    title: "La matematica: 10% per utente al mese, per sempre",
    p1: "Quando qualcuno si iscrive attraverso il tuo link di abilità e abbona, si guadagna 10% di ogni pagamento che fanno. Altri condividono la tua abilità? Guadagnerai anche il 5% sulle loro iscrizioni. Non solo il primo mese. Ogni mese, per tutto il tempo che sono iscritti.",
    tableHeaderProfile: "Profilo utente",
    tableHeaderSpend: "Spesa mensile",
    tableHeaderEarn: "Guadagno/mo (tramite il link di abilità)",
    row1Profile: "Abbonato di avviamento",
    row1Spend: "{{planPrice}} / Mo",
    row1Earn: "{{planEarn}} / Mo",
    row2Profile: "Starter + 1 pacchetto di credito",
    row2Spend: "{{plusPackSpend}} / Mo",
    row2Earn: "{{plusPackEarn}} / Mo",
    row3Profile: "utente pesante: Starter + {{heavyPacks}} packs",
    row3Spend: "{{heavySpend}} / Mo",
    row3Earn: "{{heavyEarn}} / Mo",
    row4Profile: "Power user: Starter + pacchetti {{powerPacks}}",
    row4Spend: "{{powerSpend}} / Mo",
    row4Earn: "{{powerEarn}} / Mo",
    p2: "L'abilità è l'amo. Il link è il fatturato. Si guadagna se qualcuno utilizza la vostra abilità ogni giorno o passa a qualcos'altro - l'attribuzione di riferimento rimane con voi indipendentemente.",
    p3: "Condividere un'abilità in cinque posti. Una certa percentuale di clic attraverso. Qualche percentuale si iscrive. Quei registri ti pagano il 10% ogni mese. Condividi un'altra abilità il mese prossimo. I vostri guadagni crescono senza proporzionalmente più lavoro.",
  },
  chain: {
    title:
      "Si guadagna anche quando i tuoi utenti fanno riferimento agli altri",
    p1: "Quando gli utenti di cui hai parlato vanno a riferire altri, si guadagna una parte di quei pagamenti troppo - fino a 5 livelli profondi, ogni livello halving:",
    level1:
      "Livello 2 (i riferimenti dei vostri referrals): ~5% di ogni pagamento",
    level2: "Livello 3: ~2.5% di ogni pagamento",
    level3: "Livello 4: ~ 1,25% di ogni pagamento",
    level4: "Livello 5: ~0.625% di ogni pagamento",
    p2: "Nota onesto: i bonus catena ottenere piccolo veloce. Il 10% che si guadagna da referral di abilità dirette è dove quasi tutto il vostro reddito proviene da. Trattare guadagni catena come un bonus - non ottimizzare per profondità, ottimizzare per le azioni di qualità.",
  },
  howTo: {
    title: "5 minuti al tuo primo link di condivisione",
    step1Title: "Creare o trovare un'abilità",
    step1Body:
      "Costruire uno da zero sulla pagina di abilità, chiedere Thea o Hermes per aiutarti a redigere, o trovare una abilità incorporata che vale la pena condividere.",
    step2Title: "Aprire l'abilità",
    step2Body:
      "Fare clic sull'abilità per vedere la sua pagina dei dettagli. Qui troverai il pulsante Share & Earn.",
    step3Title: "Genera il tuo link di condivisione",
    step3Body:
      "Fare clic su Condividi & Earn. Se hai un codice di riferimento, selezionalo. Se no, creane uno in tre secondi. Il tuo link porta il tuo codice di riferimento e l'abilità ID - l'attribuzione viene tracciata automaticamente.",
    step4Title: "Condividi dove conta",
    step4Body:
      "Postarlo in comunità in cui le persone avrebbero effettivamente utilizzare l'abilità - server Discord, sottoreddits, thread forum, post del blog, canali Slack. Battiti specifici.",
    step5Title: "Guarda il cruscotto",
    step5Body:
      "Il tuo cruscotto di riferimento mostra visitatori, iscrizioni e guadagni in tempo reale. Ogni nuova registrazione attraverso il vostro link è 10% entrate ricorrenti.",
  },
  close: {
    title: "L'abilità è il prodotto. Il link è il fatturato.",
    p1: 'La maggior parte delle persone pensano di programmi di riferimento come la condivisione di un link generico di registrazione. "Ecco un link a una piattaforma AI" non va da nessuna parte. "Ecco uno AI che pensa come un ambulatorio senior" è qualcosa che la gente manda.',
    p2: "Costruisci quello che vuoi usare te stesso. Lo faccia in modo specifico. Allora condividi il link. Il 10% si prende cura di se stesso.",
    createSkill: "Crea la tua prima abilità",
    referralPage: "Impostare il codice di riferimento",
  },
};
