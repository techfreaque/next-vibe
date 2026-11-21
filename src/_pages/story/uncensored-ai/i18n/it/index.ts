import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Chat AI senza censura nel browser",
  metaTitle: "Chat AI senza censura e senza registrazione | {{appName}}",
  description:
    "Prova un chatbot senza censura nel browser con i crediti gratuiti per gli ospiti. Confronta contesto e costi stimati dei modelli o inizia subito a chattare.",
  intro:
    "Inizia senza registrarti. Scegli un modello adatto alla tua domanda o prova quello con il costo stimato più basso per scambio.",
  tryModel: "Prova {{model}}",
  chooseModel: "Confronta i modelli",
  choose:
    "Per una domanda breve, parti dai modelli più economici in cima alla lista. Per documenti o conversazioni lunghi, scegli una finestra di contesto più ampia così il modello può elaborare più testo per volta.",
  start:
    "Apri la chat del modello che hai scelto. Quando ti viene chiesto, conferma di avere almeno 18 anni e accetta le condizioni. Poi sostituisci la domanda di esempio con la tua.",
  models: "Scegli un modello per la chat",
  order:
    "I modelli sono in ordine di costo stimato crescente. La stima considera {{input}} token in ingresso e {{output}} in uscita alla tariffa disponibile più bassa. Le conversazioni lunghe possono costare di più.",
  empty:
    "Al momento su questa istanza non sono disponibili modelli di chat senza censura.",
  context: "Finestra di contesto: {{tokens}} token",
  price: "Crediti stimati per scambio: {{credits}}",
  chat: "Chatta con {{model}}",
  questions: "Prima di iniziare",
  faq: {
    access: {
      q: "Posso provare gratis una chat AI senza censura?",
      a: "Come ospite puoi ricevere fino a {{credits}} crediti gratuiti al mese. Il numero di messaggi dipende dal modello e dalla lunghezza della conversazione.",
    },
    outOfCredits: {
      q: "Cosa succede quando esaurisco i crediti da ospite?",
      a: "Puoi aspettare il mese successivo oppure creare un account gratuito e verificare il tuo indirizzo email. Dopo la verifica puoi ricevere fino a {{credits}} crediti gratuiti al mese. I crediti che hai già usato come ospite nello stesso mese contano per quel totale.",
    },
    filters: {
      q: "Cosa significa qui chat AI senza filtri?",
      a: "Scegli un modello della categoria senza censura. I modelli più diffusi, come GPT, mantengono i propri filtri. Un modello senza censura può comunque rifiutare una richiesta o sbagliare.",
    },
    local: {
      q: "Mi serve una scheda grafica per usare questi modelli?",
      a: "Bastano un browser e una connessione a internet. Il fornitore elabora la tua domanda. Per eseguire un modello interamente sul tuo computer devi installarlo in locale.",
    },
  },
  guides: "Confronta modelli e piattaforme",
  abliteratedChat: "Prova in chat un modello modificato con l’abliterazione",
  abliteration: "Come l’abliterazione modifica un modello linguistico",
  compare: "Confronta le piattaforme di chat AI senza censura",
  benchmark: "Scopri come i modelli rispondono alle stesse domande",
};
