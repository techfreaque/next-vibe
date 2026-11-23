import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Crea una skill e personalizza la tua IA",
    description:
      "Trasforma qualsiasi procedura in una skill IA da riutilizzare. Creala dalla pagina delle skill o chiedilo a Thea in chat. Senza scrivere codice.",
    category: "Skill",
    imageAlt: "Costruire un'abilità AI personalizzata su {{appName}}",
    keywords:
      "costruire AI abilità, personalizzato AI, creatore di abilità, {{appName}}, prompt dei sistemi, AI persona",
  },
  hero: {
    badge: "Editor di skill",
    title: "Crea una skill.",
    titleLine2: "L’IA prende la forma che vuoi.",
    subtitle:
      "Configura una volta sola personalità, modello, strumenti e voce. Crea la skill che ti serve, condividila e guadagna.",
    ctaPrimary: "Crea una skill",
    ctaSecondary: "Chiedi a Thea o Hermes",
  },
  what: {
    title: "Una skill è una configurazione IA che puoi riutilizzare.",
    subtitle: "Impostala una volta. Usala ovunque e condividila con chi vuoi.",
    item0Label: "Avviamento del sistema",
    item0Body:
      "Identità e istruzioni. 200–500 parole. Si sente come una persona, non un FAQ.",
    item1Label: "Selezione del modello",
    item1Body:
      "Filtra per intelligenza, livello di contenuto e prezzo o pin un modello specifico.",
    item2Label: "Strumenti",
    item2Body:
      "Lista bianca esatta: ricerca, immagine gen, memoria, codice, musica, video.",
    item3Label: "Voce",
    item3Body: "Scegli un modello vocale per le risposte parlate.",
  },
  ways: {
    title: "Due modi per costruire",
    subtitle: "Scegli quello che si adatta.",
    way1Badge: "Pagina delle competenze",
    way1Title: "Creare pulsante nella lista delle competenze",
    way1Body:
      "Aprire la pagina delle competenze o il selettore modello all'interno di qualsiasi thread di chat. Hit Create. Compila il modulo: nome, prompt del sistema, modello, strumenti. Fatto.",
    way1Detail:
      "Niente mago, niente passi extra. Il modulo è la configurazione completa.",
    way1Cta: "Abilità aperte",
    way2Badge: "Chat",
    way2Title: "Chiedi a Thea o Hermes",
    way2Body:
      'Aprire un filo e dire: "Compilami una abilità di ragionamento clinico per studenti di medicina." Il sub-agente Skill Creator pone alcune domande, elabora il prompt, sceglie il modello, configura gli strumenti, crea l\'abilità, lo spilla alla barra laterale.',
    way2Detail:
      "Thea delegati al Creatore di Abilità: un sub-agente dotato di abilità-creare, favorito-creare, strumento-aiuto. Descrivi, si costruisce.",
    way2Cta: "Apri chat",
  },
  prompt: {
    title: "Avvisa di sistema che funziona",
    subtitle:
      "La parte più critica. Un grande si sente come una persona, non un documento politico.",
    dos: "Che cosa funziona",
    donts: "Che cosa lo uccide",
    do0Title: "Aperto con identità",
    do0Body: '"Tu sei [nome], un [rolo] che [does X]." Prima riga, sempre.',
    do1Title: "3–5 tratti concreti",
    do1Body: '"Diretto e Socratico" batte "utile e informativo". Sempre.',
    do2Title: "Set di competenze",
    do2Body: "Che cosa sa profondamente. Che cosa sgonfia. Niente ambiguità.",
    do3Title: "Specificare lo stile di comunicazione",
    do3Body: '"Risponde sempre in un solo paragrafo" è un\'istruzione valida.',
    do4Title: "Meno di 500 parole",
    do4Body: "Il modello legge il prompt completo ogni volta. Vince più breve.",
    dont0Title: "Elenchi delle regole di stile ToS",
    dont0Body:
      "\"Sempre essere utile, mai essere scortese\" (ogni AI ottiene questo. Un rumore puro.)",
    dont1Title: '"Sempre essere utile"',
    dont1Body: "Il modello lo sa già. Salta.",
    dont2Title: "Limiti di contrasto",
    dont2Body:
      "\"Sii creativo ma sempre rimanere sull'argomento\" (il modello siepi per sempre. Scegline uno.)",
    dont3Title: "Liste di capacità lunghe",
    dont3Body: "Il modello sa cosa può fare. Non ripetere i documenti.",
  },
  examples: {
    title: "Abilità persone realmente costruire",
    item0Name: "Ragione clinica",
    item0Category: "Istruzione",
    item0Desc:
      "Sembra un ambulatorio senior. I casi di lavoro, differenziali, ragionamenti sotto pressione.",
    item1Name: "Recensione del codice",
    item1Category: "Programmazione",
    item1Desc:
      "Conosce il tuo stack, fa rispettare le convenzioni del team. Collegato alla ricerca di documenti.",
    item2Name: "Scrittore non censurato",
    item2Category: "Creativo",
    item2Desc:
      "Fiction, roleplay, dibattito senza restrizioni della piattaforma. Modelli non censurati.",
    item3Name: "Personal Mentor",
    item3Category: "Compagno",
    item3Desc:
      "Socratico, sfocato, concentrato sulla crescita. Personalità costruita dalla filosofia reale del creatore.",
    item4Name: "Agente di ricerca",
    item4Category: "Analisi",
    item4Desc:
      "Cerca Brave e Kagi, fetches pagine, synthesizes, memorizza i risultati in memoria.",
    item5Name: "L'esperto che non si può afford",
    item5Category: "Specialista",
    item5Desc:
      "Consulente, avvocato, consulente finanziario: distillato in un'abilità. $400/hr conoscenza, zero costo.",
  },
  dev: {
    title: "Per chi sviluppa: skill.ts",
    body: "Eseguire next-vibe localmente? Chiedi al tuo agente di generare un file di abilità. Stessa struttura di ogni abilità incorporata: compila-pronta, pronto commit.",
    note: "L'agente sa tutto. Descrivi ciò che vuoi: genera il file, registra l'abilità, è dal vivo.",
  },
  cta: {
    title: "Costruisci il tuo.",
    subtitle:
      "Descrivi quello che vuoi. Il Creatore di Abilità gestisce il resto.",
    primary: "Creare un'abilità",
    secondary: "Chiedi a Thea o Hermes",
  },
};
